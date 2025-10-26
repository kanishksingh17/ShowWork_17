import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { aiContentService } from "@/lib/ai-content-service";
import { UserInputSchema } from "@/lib/ai-content-generator";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { input, templateId, portfolioId } = body;

    // Validate input using Zod schema
    const validatedInput = UserInputSchema.parse(input);

    // Generate content
    const result = await aiContentService.generateContent({
      userId: session.user.id,
      input: validatedInput,
      templateId,
      portfolioId,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      content: result.content,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("Content generation API error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get generation history
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const history = await aiContentService.getGenerationHistory(
      session.user.id,
      limit,
    );
    const stats = await aiContentService.getGenerationStats(session.user.id);

    return NextResponse.json({
      success: true,
      history,
      stats,
    });
  } catch (error) {
    console.error("Get generation history API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
