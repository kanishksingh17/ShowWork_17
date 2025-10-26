import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import {
  portfolioHealthService,
  PortfolioData,
} from "@/services/portfolioHealthService";

export async function GET(request: NextRequest) {
  try {
    // Check if portfolio health is enabled
    if (process.env.PORTFOLIO_HEALTH_ENABLED !== "true") {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio health feature is not enabled",
        },
        { status: 403 },
      );
    }

    const { db } = await connectToDatabase();

    // Get user from session (implement proper auth)
    const userId = request.headers.get("user-id") || "default-user";

    // Find user's active portfolio
    const portfolio = await db.collection("portfolios").findOne({
      userId,
      isPublished: true,
    });

    if (!portfolio) {
      return NextResponse.json(
        {
          success: false,
          error: "No active portfolio found",
        },
        { status: 404 },
      );
    }

    // Check if we have cached health data
    if (portfolio.healthJson) {
      const healthData = portfolio.healthJson;
      const lastComputed = new Date(healthData.lastComputedAt);
      const hoursSinceComputed =
        (Date.now() - lastComputed.getTime()) / (1000 * 60 * 60);

      // Return cached data if less than 24 hours old
      if (hoursSinceComputed < 24) {
        return NextResponse.json({
          success: true,
          data: healthData,
        });
      }
    }

    // Get projects for health computation
    const projects = await db
      .collection("projects")
      .find({
        portfolioId: portfolio._id,
      })
      .toArray();

    // Get user data
    const user = await db.collection("users").findOne({
      _id: userId,
    });

    // Prepare portfolio data for health computation
    const portfolioData: PortfolioData = {
      id: portfolio._id,
      name: portfolio.name,
      description: portfolio.description,
      isPublished: portfolio.isPublished,
      templateId: portfolio.templateId,
      config: portfolio.config,
      projects: projects.map((p) => ({
        id: p._id,
        name: p.name,
        description: p.description,
        technologies: p.technologies || [],
        tags: p.tags || [],
        domain: p.domain,
        imageUrl: p.imageUrl,
        liveUrl: p.liveUrl,
        githubUrl: p.githubUrl,
        featured: p.featured,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      user: user
        ? {
            bio: user.bio,
            avatar: user.avatar,
            experience: user.experience,
            certifications: user.certifications || [],
          }
        : undefined,
    };

    // Compute health score
    const healthScore =
      await portfolioHealthService.computePortfolioHealth(portfolioData);

    // Cache the result
    await db
      .collection("portfolios")
      .updateOne({ _id: portfolio._id }, { $set: { healthJson: healthScore } });

    return NextResponse.json({
      success: true,
      data: healthScore,
    });
  } catch (error) {
    console.error("Error fetching portfolio health:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio health" },
      { status: 500 },
    );
  }
}
