import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/webhook-verification";

export async function POST(
  request: NextRequest,
  { params }: { params: { platform: string } },
) {
  try {
    const { platform } = params;
    const body = await request.text();
    const signature =
      request.headers.get("x-hub-signature-256") ||
      request.headers.get("x-signature") ||
      request.headers.get("authorization");

    // Verify webhook signature (platform-specific)
    const isValid = await verifyWebhookSignature(platform, body, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);

    // Process webhook based on platform
    switch (platform) {
      case "linkedin":
        await processLinkedInWebhook(payload);
        break;
      case "twitter":
        await processTwitterWebhook(payload);
        break;
      case "reddit":
        await processRedditWebhook(payload);
        break;
      case "facebook":
        await processFacebookWebhook(payload);
        break;
      case "instagram":
        await processInstagramWebhook(payload);
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported platform" },
          { status: 400 },
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Webhook processing error for ${params.platform}:`, error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function processLinkedInWebhook(payload: any): Promise<void> {
  // LinkedIn webhook processing
  const { eventType, data } = payload;

  if (eventType === "reaction" && data) {
    // Extract post ID and metrics
    const postId = data.postId;
    const metrics = {
      likes: data.totalLikes || 0,
      comments: data.totalComments || 0,
      shares: data.totalShares || 0,
    };

    // Find the scheduled post by platform post ID
    const scheduledPost = await findScheduledPostByPlatformPostId(
      "linkedin",
      postId,
    );
    if (scheduledPost) {
      await createAnalyticsEvents(
        scheduledPost.userId,
        scheduledPost.projectId,
        "linkedin",
        metrics,
      );
    }
  }
}

async function processTwitterWebhook(payload: any): Promise<void> {
  // Twitter webhook processing
  const { tweet_create_events, favorite_events, retweet_events } = payload;

  // Process tweet creation events
  if (tweet_create_events) {
    for (const event of tweet_create_events) {
      const postId = event.id_str;
      const scheduledPost = await findScheduledPostByPlatformPostId(
        "twitter",
        postId,
      );
      if (scheduledPost) {
        await createAnalyticsEvents(
          scheduledPost.userId,
          scheduledPost.projectId,
          "twitter",
          {
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0,
          },
        );
      }
    }
  }

  // Process engagement events
  if (favorite_events) {
    for (const event of favorite_events) {
      const postId = event.favorited_status?.id_str;
      if (postId) {
        const scheduledPost = await findScheduledPostByPlatformPostId(
          "twitter",
          postId,
        );
        if (scheduledPost) {
          await createAnalyticsEvents(
            scheduledPost.userId,
            scheduledPost.projectId,
            "twitter",
            {
              likes: 1,
            },
          );
        }
      }
    }
  }
}

async function processRedditWebhook(payload: any): Promise<void> {
  // Reddit webhook processing
  const { data } = payload;

  if (data && data.id) {
    const postId = data.id;
    const metrics = {
      likes: data.ups || 0,
      comments: data.num_comments || 0,
      shares: 0, // Reddit doesn't have shares
    };

    const scheduledPost = await findScheduledPostByPlatformPostId(
      "reddit",
      postId,
    );
    if (scheduledPost) {
      await createAnalyticsEvents(
        scheduledPost.userId,
        scheduledPost.projectId,
        "reddit",
        metrics,
      );
    }
  }
}

async function processFacebookWebhook(payload: any): Promise<void> {
  // Facebook webhook processing
  const { entry } = payload;

  if (entry) {
    for (const item of entry) {
      if (item.changes) {
        for (const change of item.changes) {
          if (change.field === "feed" && change.value) {
            const postId = change.value.post_id;
            const metrics = {
              likes: change.value.reactions?.summary?.total_count || 0,
              comments: change.value.comments?.summary?.total_count || 0,
              shares: change.value.shares?.count || 0,
            };

            const scheduledPost = await findScheduledPostByPlatformPostId(
              "facebook",
              postId,
            );
            if (scheduledPost) {
              await createAnalyticsEvents(
                scheduledPost.userId,
                scheduledPost.projectId,
                "facebook",
                metrics,
              );
            }
          }
        }
      }
    }
  }
}

async function processInstagramWebhook(payload: any): Promise<void> {
  // Instagram webhook processing
  const { entry } = payload;

  if (entry) {
    for (const item of entry) {
      if (item.changes) {
        for (const change of item.changes) {
          if (change.field === "media" && change.value) {
            const postId = change.value.id;
            const metrics = {
              likes: change.value.like_count || 0,
              comments: change.value.comments_count || 0,
              shares: 0, // Instagram doesn't have shares
            };

            const scheduledPost = await findScheduledPostByPlatformPostId(
              "instagram",
              postId,
            );
            if (scheduledPost) {
              await createAnalyticsEvents(
                scheduledPost.userId,
                scheduledPost.projectId,
                "instagram",
                metrics,
              );
            }
          }
        }
      }
    }
  }
}

async function findScheduledPostByPlatformPostId(
  platform: string,
  platformPostId: string,
) {
  // This would need to be implemented based on how you store platform post IDs
  // For now, we'll search through publish logs
  const publishLog = await prisma.publishLog.findFirst({
    where: {
      platform,
      platformPostId,
      status: "SUCCESS",
    },
    include: {
      scheduledPost: {
        include: {
          user: true,
          project: true,
        },
      },
    },
  });

  return publishLog?.scheduledPost;
}

async function createAnalyticsEvents(
  userId: string,
  projectId: string | null,
  platform: string,
  metrics: Record<string, number>,
): Promise<void> {
  const events = [];

  for (const [metricType, count] of Object.entries(metrics)) {
    if (count > 0) {
      events.push({
        userId,
        projectId,
        platform,
        metricType: metricType.toUpperCase(),
        count,
        timestamp: new Date(),
      });
    }
  }

  if (events.length > 0) {
    await prisma.analyticsEvent.createMany({
      data: events,
    });
  }
}



