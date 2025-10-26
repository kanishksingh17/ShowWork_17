// Individual Portfolio Operations API Route

import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  createErrorResponse,
  createSuccessResponse,
  trackUsage,
} from "../../../../lib/api/middleware";
import { UpdatePortfolioRequestSchema } from "../../../../lib/api/schemas";
import { Portfolio, AuthUser } from "../../../../lib/api/types";

// Mock database (in production, use a real database)
const portfolios = new Map<string, Portfolio>();

// GET /api/portfolios/[id] - Get single portfolio
async function handleGetPortfolio(
  request: NextRequest,
  user: AuthUser,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const startTime = Date.now();
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  try {
    const { id } = params;

    // Find portfolio
    const portfolio = portfolios.get(id);

    if (!portfolio) {
      return createErrorResponse(
        {
          code: "PORTFOLIO_NOT_FOUND",
          message: "Portfolio not found",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        404,
      );
    }

    // Check ownership or public access
    if (portfolio.userId !== user.id && portfolio.visibility !== "public") {
      return createErrorResponse(
        {
          code: "ACCESS_DENIED",
          message: "Access denied",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        403,
      );
    }

    // Update view count if it's a public portfolio and user is not the owner
    if (portfolio.visibility === "public" && portfolio.userId !== user.id) {
      portfolio.analytics.views++;
      portfolio.analytics.lastViewed = new Date().toISOString();
      portfolios.set(id, portfolio);
    }

    // Track usage
    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      `/api/portfolios/${id}`,
      "GET",
      duration,
      200,
      0,
      JSON.stringify(portfolio).length,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["portfolio_viewing"],
    );

    return createSuccessResponse(portfolio, "Portfolio retrieved successfully");
  } catch (error) {
    console.error("Get portfolio error:", error);

    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      `/api/portfolios/${params.id}`,
      "GET",
      duration,
      500,
      0,
      0,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["portfolio_viewing"],
    );

    return createErrorResponse(
      {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve portfolio",
        timestamp: new Date().toISOString(),
        requestId,
        userId: user.id,
      },
      500,
    );
  }
}

// PUT /api/portfolios/[id] - Update portfolio
async function handleUpdatePortfolio(
  request: NextRequest,
  user: AuthUser,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const startTime = Date.now();
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  try {
    const { id } = params;

    // Find portfolio
    const portfolio = portfolios.get(id);

    if (!portfolio) {
      return createErrorResponse(
        {
          code: "PORTFOLIO_NOT_FOUND",
          message: "Portfolio not found",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        404,
      );
    }

    // Check ownership
    if (portfolio.userId !== user.id) {
      return createErrorResponse(
        {
          code: "ACCESS_DENIED",
          message: "Access denied",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        403,
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = UpdatePortfolioRequestSchema.safeParse({
      id,
      ...body,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
          requestId,
        },
        { status: 400 },
      );
    }

    const updateData = validationResult.data;

    // Update portfolio
    const updatedPortfolio: Portfolio = {
      ...portfolio,
      ...updateData,
      analytics: {
        ...portfolio.analytics,
        updatedAt: new Date().toISOString(),
      },
    };

    // Save updated portfolio
    portfolios.set(id, updatedPortfolio);

    // Track usage
    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      `/api/portfolios/${id}`,
      "PUT",
      duration,
      200,
      JSON.stringify(body).length,
      JSON.stringify(updatedPortfolio).length,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["portfolio_updating"],
    );

    return createSuccessResponse(
      updatedPortfolio,
      "Portfolio updated successfully",
    );
  } catch (error) {
    console.error("Update portfolio error:", error);

    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      `/api/portfolios/${params.id}`,
      "PUT",
      duration,
      500,
      0,
      0,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["portfolio_updating"],
    );

    return createErrorResponse(
      {
        code: "UPDATE_FAILED",
        message: "Failed to update portfolio",
        timestamp: new Date().toISOString(),
        requestId,
        userId: user.id,
      },
      500,
    );
  }
}

// DELETE /api/portfolios/[id] - Delete portfolio
async function handleDeletePortfolio(
  request: NextRequest,
  user: AuthUser,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const startTime = Date.now();
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  try {
    const { id } = params;

    // Find portfolio
    const portfolio = portfolios.get(id);

    if (!portfolio) {
      return createErrorResponse(
        {
          code: "PORTFOLIO_NOT_FOUND",
          message: "Portfolio not found",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        404,
      );
    }

    // Check ownership
    if (portfolio.userId !== user.id) {
      return createErrorResponse(
        {
          code: "ACCESS_DENIED",
          message: "Access denied",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        403,
      );
    }

    // Delete portfolio
    portfolios.delete(id);

    // Update user usage
    user.usage.portfolios--;

    // Track usage
    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      `/api/portfolios/${id}`,
      "DELETE",
      duration,
      200,
      0,
      0,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["portfolio_deletion"],
    );

    return createSuccessResponse(null, "Portfolio deleted successfully");
  } catch (error) {
    console.error("Delete portfolio error:", error);

    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      `/api/portfolios/${params.id}`,
      "DELETE",
      duration,
      500,
      0,
      0,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["portfolio_deletion"],
    );

    return createErrorResponse(
      {
        code: "DELETE_FAILED",
        message: "Failed to delete portfolio",
        timestamp: new Date().toISOString(),
        requestId,
        userId: user.id,
      },
      500,
    );
  }
}

// PATCH /api/portfolios/[id]/publish - Publish portfolio
async function handlePublishPortfolio(
  request: NextRequest,
  user: AuthUser,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const startTime = Date.now();
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  try {
    const { id } = params;

    // Find portfolio
    const portfolio = portfolios.get(id);

    if (!portfolio) {
      return createErrorResponse(
        {
          code: "PORTFOLIO_NOT_FOUND",
          message: "Portfolio not found",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        404,
      );
    }

    // Check ownership
    if (portfolio.userId !== user.id) {
      return createErrorResponse(
        {
          code: "ACCESS_DENIED",
          message: "Access denied",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        403,
      );
    }

    // Update portfolio status
    const updatedPortfolio: Portfolio = {
      ...portfolio,
      status: "published",
      publishedAt: new Date().toISOString(),
      analytics: {
        ...portfolio.analytics,
        updatedAt: new Date().toISOString(),
      },
    };

    // Save updated portfolio
    portfolios.set(id, updatedPortfolio);

    // Track usage
    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      `/api/portfolios/${id}/publish`,
      "PATCH",
      duration,
      200,
      0,
      JSON.stringify(updatedPortfolio).length,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["portfolio_publishing"],
    );

    return createSuccessResponse(
      updatedPortfolio,
      "Portfolio published successfully",
    );
  } catch (error) {
    console.error("Publish portfolio error:", error);

    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      `/api/portfolios/${params.id}/publish`,
      "PATCH",
      duration,
      500,
      0,
      0,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["portfolio_publishing"],
    );

    return createErrorResponse(
      {
        code: "PUBLISH_FAILED",
        message: "Failed to publish portfolio",
        timestamp: new Date().toISOString(),
        requestId,
        userId: user.id,
      },
      500,
    );
  }
}

// Export handlers
export const GET = withAuth(handleGetPortfolio, {
  requiredRole: "user",
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 200,
  },
});

export const PUT = withAuth(handleUpdatePortfolio, {
  requiredRole: "user",
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 50,
  },
});

export const DELETE = withAuth(handleDeletePortfolio, {
  requiredRole: "user",
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 10,
  },
});

export const PATCH = withAuth(handlePublishPortfolio, {
  requiredRole: "user",
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 20,
  },
});

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Request-ID",
      "Access-Control-Max-Age": "86400",
    },
  });
}
