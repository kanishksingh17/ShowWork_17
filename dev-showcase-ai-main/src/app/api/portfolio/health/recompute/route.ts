import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import {
  portfolioHealthService,
  PortfolioData,
} from "@/services/portfolioHealthService";

export async function POST(request: NextRequest) {
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

    // Parse request body for optional portfolioId
    const body = await request.json().catch(() => ({}));
    const portfolioId = body.portfolioId;

    // Find portfolio (by ID if provided, otherwise user's active portfolio)
    const query = portfolioId
      ? { _id: portfolioId, userId }
      : { userId, isPublished: true };

    const portfolio = await db.collection("portfolios").findOne(query);

    if (!portfolio) {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio not found",
        },
        { status: 404 },
      );
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

    // Compute fresh health score
    const startTime = Date.now();
    const healthScore =
      await portfolioHealthService.computePortfolioHealth(portfolioData);
    const duration = Date.now() - startTime;

    // Cache the result
    await db
      .collection("portfolios")
      .updateOne({ _id: portfolio._id }, { $set: { healthJson: healthScore } });

    console.log(
      `Portfolio health recomputed for ${portfolio._id} in ${duration}ms`,
    );

    return NextResponse.json({
      success: true,
      data: healthScore,
      message: "Portfolio health recomputed successfully",
    });
  } catch (error) {
    console.error("Error recomputing portfolio health:", error);
    return NextResponse.json(
      { success: false, error: "Failed to recompute portfolio health" },
      { status: 500 },
    );
  }
}
