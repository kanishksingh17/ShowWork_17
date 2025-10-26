// Project API Routes - CRUD operations for projects

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  CreateProjectRequestSchema,
  ProjectPaginationSchema,
} from "@/lib/validation/projectSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { extractProjectDomain } from "@/lib/hooks/useProjectDomainExtraction";

const prisma = new PrismaClient();

// GET /api/projects - Fetch user projects with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const visibility = searchParams.get("visibility");
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status.toUpperCase();
    }

    if (category) {
      where.category = category;
    }

    if (visibility) {
      where.visibility = visibility.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortField] = sortOrder;

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch projects with relations
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          mediaFiles: true,
          teamMembers: true,
        },
      }),
      prisma.project.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validationResult = CreateProjectRequestSchema.safeParse(body);

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

    const projectData = validationResult.data;

    // Extract domain if portfolio health is enabled
    let domain = null;
    if (process.env.PORTFOLIO_HEALTH_ENABLED === "true") {
      try {
        domain = await extractProjectDomain({
          name: projectData.name,
          description: projectData.description,
          technologies: projectData.technologies.map((t) => t.name),
          tags: projectData.tags,
          category: projectData.category,
        });
      } catch (error) {
        console.warn("Domain extraction failed:", error);
      }
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name: projectData.name,
        description: projectData.description,
        longDescription: projectData.longDescription,
        category: projectData.category,
        status: projectData.status.toUpperCase() as any,
        visibility: projectData.visibility.toUpperCase() as any,
        technologies: projectData.technologies.map((t) => t.name),
        githubUrl: projectData.githubUrl,
        liveUrl: projectData.liveUrl,
        tags: projectData.tags,
        domain,
        userId: session.user.id,
      },
      include: {
        mediaFiles: true,
        teamMembers: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: "Project created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create project" },
      { status: 500 },
    );
  }
}

// DELETE /api/projects - Bulk delete projects
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { projectIds } = body;

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Project IDs are required" },
        { status: 400 },
      );
    }

    // Verify ownership before deletion
    const projects = await prisma.project.findMany({
      where: {
        id: { in: projectIds },
        userId: session.user.id,
      },
    });

    if (projects.length !== projectIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Some projects not found or not owned by user",
        },
        { status: 403 },
      );
    }

    // Delete projects (cascade will handle related records)
    await prisma.project.deleteMany({
      where: {
        id: { in: projectIds },
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${projectIds.length} project(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete projects" },
      { status: 500 },
    );
  }
}
