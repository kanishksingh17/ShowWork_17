// Single Project API Routes - Individual project operations

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { UpdateProjectRequestSchema } from "@/lib/validation/projectSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET /api/projects/[id] - Fetch a single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const projectId = params.id;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
      include: {
        mediaFiles: true,
        teamMembers: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const projectId = params.id;
    const body = await request.json();
    const validationResult = UpdateProjectRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const updateData = validationResult.data;

    // Verify project ownership
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    // Prepare update data
    const dataToUpdate: any = {};

    if (updateData.name) dataToUpdate.name = updateData.name;
    if (updateData.description)
      dataToUpdate.description = updateData.description;
    if (updateData.longDescription)
      dataToUpdate.longDescription = updateData.longDescription;
    if (updateData.category) dataToUpdate.category = updateData.category;
    if (updateData.status)
      dataToUpdate.status = updateData.status.toUpperCase();
    if (updateData.visibility)
      dataToUpdate.visibility = updateData.visibility.toUpperCase();
    if (updateData.technologies)
      dataToUpdate.technologies = updateData.technologies.map((t) => t.name);
    if (updateData.githubUrl) dataToUpdate.githubUrl = updateData.githubUrl;
    if (updateData.liveUrl) dataToUpdate.liveUrl = updateData.liveUrl;
    if (updateData.tags) dataToUpdate.tags = updateData.tags;

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: dataToUpdate,
      include: {
        mediaFiles: true,
        teamMembers: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update project" },
      { status: 500 },
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const projectId = params.id;

    // Verify project ownership
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    // Delete project (cascade will handle related records)
    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete project" },
      { status: 500 },
    );
  }
}
