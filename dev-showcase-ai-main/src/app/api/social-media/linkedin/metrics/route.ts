import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token required" },
        { status: 401 },
      );
    }

    // Fetch LinkedIn profile metrics
    const profileResponse = await fetch(
      "https://api.linkedin.com/v2/people/~",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      },
    );

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch LinkedIn profile");
    }

    const profile = await profileResponse.json();

    // Fetch LinkedIn analytics (requires LinkedIn Marketing API)
    const analyticsResponse = await fetch(
      "https://api.linkedin.com/v2/analytics",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      },
    );

    let analytics = {};
    if (analyticsResponse.ok) {
      analytics = await analyticsResponse.json();
    }

    // Combine profile and analytics data
    const metrics = {
      followersCount: analytics.followersCount || 0,
      followingCount: analytics.followingCount || 0,
      postsCount: analytics.postsCount || 0,
      totalLikes: analytics.totalLikes || 0,
      totalShares: analytics.totalShares || 0,
      totalComments: analytics.totalComments || 0,
      engagementRate: analytics.engagementRate || 0,
      reach: analytics.reach || 0,
      impressions: analytics.impressions || 0,
      profileViews: analytics.profileViews || 0,
      connectionsCount: analytics.connectionsCount || 0,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("LinkedIn metrics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch LinkedIn metrics" },
      { status: 500 },
    );
  }
}
