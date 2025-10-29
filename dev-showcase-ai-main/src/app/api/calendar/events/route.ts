import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json(
        { error: "Start and end dates are required" },
        { status: 400 },
      );
    }

    const scheduledPosts = await prisma.scheduledPost.findMany({
      where: {
        userId: session.user.id,
        scheduledAt: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    // Format for FullCalendar
    const events = scheduledPosts.map((post) => ({
      id: post.id,
      title: `${post.project.name} - ${post.platforms.join(", ")}`,
      start: post.scheduledAt.toISOString(),
      end: new Date(post.scheduledAt.getTime() + 30 * 60 * 1000).toISOString(), // 30 min duration
      allDay: false,
      backgroundColor: getStatusColor(post.status),
      borderColor: getStatusColor(post.status),
      textColor: "#ffffff",
      extendedProps: {
        projectId: post.projectId,
        projectName: post.project.name,
        projectImage: post.project.imageUrl,
        platforms: post.platforms,
        status: post.status,
        messageByPlatform: post.messageByPlatform,
        mediaUrls: post.mediaUrls,
      },
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 },
    );
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "SCHEDULED":
      return "#3B82F6"; // Blue
    case "PROCESSING":
      return "#F59E0B"; // Amber
    case "POSTED":
      return "#10B981"; // Green
    case "FAILED":
      return "#EF4444"; // Red
    case "CANCELLED":
      return "#6B7280"; // Gray
    default:
      return "#3B82F6";
  }
}



