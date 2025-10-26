import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const userId = request.headers.get("user-id") || "default-user";

    const { db } = await connectToDatabase();

    // Get real projects from your database
    const projects = await db
      .collection("projects")
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .toArray();

    // Transform projects to include analytics data
    const projectsWithAnalytics = projects.map((project) => ({
      _id: project._id,
      name: project.name || project.title,
      title: project.title || project.name,
      description: project.description,
      technologies: project.technologies || [],
      liveUrl: project.liveUrl || project.demoUrl,
      githubUrl: project.githubUrl || project.github,
      images: project.images || [],
      views: project.views || 0,
      likes: project.likes || 0,
      shares: project.shares || 0,
      downloads: project.downloads || 0,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: projectsWithAnalytics,
      count: projectsWithAnalytics.length,
    });
  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
        data: [],
      },
      { status: 500 },
    );
  }
}
