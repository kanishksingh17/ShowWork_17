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
    const period = searchParams.get("period") || "30d";

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get analytics events for the period
    const analyticsEvents = await prisma.analyticsEvent.findMany({
      where: {
        userId: session.user.id,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Aggregate metrics
    const metrics = {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalClicks: 0,
      totalImpressions: 0,
      engagementRate: 0,
      platformBreakdown: {} as Record<string, any>,
      projectBreakdown: {} as Record<string, any>,
      dailyMetrics: [] as any[],
    };

    // Process events
    analyticsEvents.forEach((event) => {
      const { metricType, count, platform, project } = event;

      // Aggregate by metric type
      switch (metricType) {
        case "VIEW":
          metrics.totalViews += count;
          break;
        case "LIKE":
          metrics.totalLikes += count;
          break;
        case "COMMENT":
          metrics.totalComments += count;
          break;
        case "SHARE":
          metrics.totalShares += count;
          break;
        case "CLICK":
          metrics.totalClicks += count;
          break;
        case "IMPRESSION":
          metrics.totalImpressions += count;
          break;
      }

      // Platform breakdown
      if (!metrics.platformBreakdown[platform]) {
        metrics.platformBreakdown[platform] = {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          clicks: 0,
          impressions: 0,
        };
      }

      if (metricType in metrics.platformBreakdown[platform]) {
        metrics.platformBreakdown[platform][metricType.toLowerCase() + "s"] +=
          count;
      }

      // Project breakdown
      if (project) {
        if (!metrics.projectBreakdown[project.id]) {
          metrics.projectBreakdown[project.id] = {
            name: project.name,
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            clicks: 0,
            impressions: 0,
          };
        }

        if (metricType in metrics.projectBreakdown[project.id]) {
          metrics.projectBreakdown[project.id][
            metricType.toLowerCase() + "s"
          ] += count;
        }
      }
    });

    // Calculate engagement rate
    const totalEngagement =
      metrics.totalLikes + metrics.totalComments + metrics.totalShares;
    metrics.engagementRate =
      metrics.totalImpressions > 0
        ? (totalEngagement / metrics.totalImpressions) * 100
        : 0;

    // Generate daily metrics for the last 7 days
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayEvents = analyticsEvents.filter(
        (event) => event.timestamp >= date && event.timestamp < nextDate,
      );

      const dayMetrics = {
        date: date.toISOString().split("T")[0],
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        clicks: 0,
        impressions: 0,
      };

      dayEvents.forEach((event) => {
        switch (event.metricType) {
          case "VIEW":
            dayMetrics.views += event.count;
            break;
          case "LIKE":
            dayMetrics.likes += event.count;
            break;
          case "COMMENT":
            dayMetrics.comments += event.count;
            break;
          case "SHARE":
            dayMetrics.shares += event.count;
            break;
          case "CLICK":
            dayMetrics.clicks += event.count;
            break;
          case "IMPRESSION":
            dayMetrics.impressions += event.count;
            break;
        }
      });

      dailyData.push(dayMetrics);
    }

    metrics.dailyMetrics = dailyData;

    return NextResponse.json({
      success: true,
      period,
      metrics,
    });
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics overview" },
      { status: 500 },
    );
  }
}
