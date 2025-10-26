import { NextRequest, NextResponse } from "next/server";
import { generateMockBenchmarkData } from "@/components/AnalyticsDashboard";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "Full Stack Developer";
    const metric = searchParams.get("metric");

    const benchmarkData = generateMockBenchmarkData();

    // Filter by specific metric if provided
    let filteredData = benchmarkData;
    if (metric) {
      filteredData = {
        ...benchmarkData,
        metrics: benchmarkData.metrics.filter((m) =>
          m.name.toLowerCase().includes(metric.toLowerCase()),
        ),
      };
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      category,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Benchmarks API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch benchmark data" },
      { status: 500 },
    );
  }
}
