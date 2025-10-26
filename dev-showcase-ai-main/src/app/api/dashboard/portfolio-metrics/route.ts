import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    // Get user from session (you'll need to implement proper auth)
    const userId = request.headers.get("user-id") || "default-user";

    // Get real portfolio data from your database
    const projects = await db.collection("projects").find({ userId }).toArray();
    const user = await db.collection("users").findOne({ _id: userId });

    // Calculate real metrics from actual data
    const totalViews = projects.reduce(
      (sum, project) => sum + (project.views || 0),
      0,
    );
    const totalLikes = projects.reduce(
      (sum, project) => sum + (project.likes || 0),
      0,
    );
    const totalShares = projects.reduce(
      (sum, project) => sum + (project.shares || 0),
      0,
    );
    const totalDownloads = projects.reduce(
      (sum, project) => sum + (project.downloads || 0),
      0,
    );

    // Calculate engagement rate
    const engagementRate =
      totalViews > 0 ? ((totalLikes + totalShares) / totalViews) * 100 : 0;

    // Calculate average session duration (estimate based on project complexity)
    const avgSessionDuration =
      projects.length > 0
        ? projects.reduce((sum, project) => {
            const baseTime = 120; // 2 minutes base
            const complexityTime = (project.technologies?.length || 0) * 30; // 30 seconds per tech
            return sum + baseTime + complexityTime;
          }, 0) / projects.length
        : 0;

    // Calculate bounce rate (estimate based on engagement)
    const bounceRate =
      totalViews > 0 ? Math.max(0, 100 - engagementRate * 2) : 100;

    // Get tech stack popularity from actual projects
    const techStackMap = new Map();
    projects.forEach((project) => {
      if (project.technologies) {
        project.technologies.forEach((tech: string) => {
          techStackMap.set(tech, (techStackMap.get(tech) || 0) + 1);
        });
      }
    });

    const techStackPopularity = Array.from(techStackMap.entries())
      .map(([name, count]) => ({
        name,
        views: count * 10, // Estimate views per tech
        projects: count,
        trend: "up" as const,
        percentage: (count / projects.length) * 100,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Calculate code quality score based on project completeness
    const codeQualityScore =
      projects.length > 0
        ? projects.reduce((sum, project) => {
            let score = 50; // Base score
            if (project.description && project.description.length > 50)
              score += 10;
            if (project.technologies && project.technologies.length > 0)
              score += 15;
            if (project.liveUrl) score += 10;
            if (project.githubUrl) score += 10;
            if (project.images && project.images.length > 0) score += 5;
            return sum + Math.min(score, 100);
          }, 0) / projects.length
        : 0;

    const metrics = {
      totalReach: totalViews + (user?.followers || 0),
      engagementRate: Math.round(engagementRate * 100) / 100,
      profileViews: totalViews,
      activeProjects: projects.length,
      codeQualityScore: Math.round(codeQualityScore),
      techStackPopularity,
      totalLikes,
      totalShares,
      averageSessionDuration: Math.round(avgSessionDuration),
      bounceRate: Math.round(bounceRate * 100) / 100,
    };

    return NextResponse.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Portfolio metrics API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch portfolio metrics",
        data: {
          totalReach: 0,
          engagementRate: 0,
          profileViews: 0,
          activeProjects: 0,
          codeQualityScore: 0,
          techStackPopularity: [],
          totalLikes: 0,
          totalShares: 0,
          averageSessionDuration: 0,
          bounceRate: 0,
        },
      },
      { status: 500 },
    );
  }
}
