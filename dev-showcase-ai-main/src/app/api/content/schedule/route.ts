import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { postId, scheduledAt } = body;

    if (!postId || !scheduledAt) {
      return NextResponse.json(
        { error: "Post ID and scheduled time are required" },
        { status: 400 },
      );
    }

    // Verify post belongs to user
    const post = await prisma.scheduledPost.findFirst({
      where: {
        id: postId,
        userId: session.user.id,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Update post with scheduled time
    const updatedPost = await prisma.scheduledPost.update({
      where: { id: postId },
      data: {
        scheduledAt: new Date(scheduledAt),
        status: "scheduled",
      },
    });

    // TODO: Enqueue job in BullMQ queue
    // const { publishQueue } = await import('@/lib/queue');
    // await publishQueue.add('publish-post', { scheduledPostId: postId }, {
    //   delay: new Date(scheduledAt).getTime() - Date.now(),
    // });

    return NextResponse.json({
      success: true,
      post: {
        id: updatedPost.id,
        scheduledAt: updatedPost.scheduledAt,
        status: updatedPost.status,
      },
    });
  } catch (error) {
    console.error("Error scheduling post:", error);
    return NextResponse.json(
      { error: "Failed to schedule post" },
      { status: 500 },
    );
  }
}

