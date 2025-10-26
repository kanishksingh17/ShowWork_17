import { NextRequest, NextResponse } from "next/server";
import { generateMockAIInsights } from "@/components/AnalyticsDashboard";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");

    let insights = generateMockAIInsights();

    // Filter by category if provided
    if (category) {
      insights = insights.filter((insight) => insight.category === category);
    }

    // Filter by priority if provided
    if (priority) {
      insights = insights.filter((insight) => insight.priority === priority);
    }

    return NextResponse.json({
      success: true,
      data: insights,
      filters: { category, priority },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI insights API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch AI insights" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { insightId, action } = body;

    // Simulate processing AI insight action
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      message: `Action "${action}" applied to insight ${insightId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI insights action API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process AI insight action" },
      { status: 500 },
    );
  }
}
