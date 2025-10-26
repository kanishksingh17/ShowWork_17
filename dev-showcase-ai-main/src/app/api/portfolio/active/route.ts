import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

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

    // Get linked projects
    const projects = await db
      .collection("projects")
      .find({
        portfolioId: portfolio._id,
      })
      .toArray();

    // Get template info if available
    let template = null;
    if (portfolio.templateId) {
      template = await db.collection("templates").findOne({
        _id: portfolio.templateId,
      });
    }

    // Get cached health if available
    const healthJson = portfolio.healthJson || null;

    return NextResponse.json({
      success: true,
      data: {
        portfolio: {
          id: portfolio._id,
          name: portfolio.name,
          description: portfolio.description,
          url: portfolio.url,
          isPublished: portfolio.isPublished,
          templateId: portfolio.templateId,
          liveUrl:
            portfolio.customDomain ||
            `http://localhost:3000/portfolio/${portfolio.url}`,
          config: portfolio.config,
        },
        projects: projects.map((p) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          technologies: p.technologies || [],
          domain: p.domain,
          imageUrl: p.imageUrl,
          liveUrl: p.liveUrl,
          githubUrl: p.githubUrl,
          featured: p.featured,
        })),
        template,
        health: healthJson,
      },
    });
  } catch (error) {
    console.error("Error fetching active portfolio:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch active portfolio" },
      { status: 500 },
    );
  }
}
