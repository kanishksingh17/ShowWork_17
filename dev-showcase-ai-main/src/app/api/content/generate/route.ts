import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { generateMessages } from "@/lib/postGenerator";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, platforms, useAI = false, customMessage } = body;

    if (!projectId || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Project ID and platforms are required" },
        { status: 400 },
      );
    }

    // Get project details
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Prepare project data for post generator
    const projectData = {
      title: project.name,
      description: project.description,
      tags: project.tags,
      demoUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      technologies: project.technologies,
      media: project.imageUrl ? [project.imageUrl] : [],
    };

    // Generate messages using post generator
    const { messageByPlatform, preview } = await generateMessages(
      projectData,
      platforms,
      useAI,
    );

    // If custom message provided, use it as base for all platforms
    if (customMessage) {
      for (const platform of platforms) {
        messageByPlatform[platform] = customMessage;
      }
    }

    // Create generated post record
    const generatedPost = await prisma.scheduledPost.create({
      data: {
        userId: session.user.id,
        projectId,
        platforms,
        message: customMessage || preview,
        messageByPlatform,
        media: projectData.media,
        scheduledAt: new Date(), // Will be updated when actually scheduled
        status: "draft",
      },
    });

    return NextResponse.json({
      success: true,
      post: {
        id: generatedPost.id,
        projectId: generatedPost.projectId,
        platforms: generatedPost.platforms,
        messages: generatedPost.messageByPlatform,
        createdAt: generatedPost.createdAt,
        status: generatedPost.status,
      },
    });
  } catch (error) {
    console.error("Error generating post:", error);
    return NextResponse.json(
      { error: "Failed to generate post" },
      { status: 500 },
    );
  }
}

