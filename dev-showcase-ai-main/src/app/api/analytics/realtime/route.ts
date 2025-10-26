import { NextRequest, NextResponse } from "next/server";
import { generateMockRealtimeMetrics } from "@/components/AnalyticsDashboard";

export async function GET(request: NextRequest) {
  try {
    // Simulate real-time data with slight variations
    const baseData = generateMockRealtimeMetrics();

    // Add some randomness to simulate live updates
    const liveData = {
      ...baseData,
      activeVisitors:
        baseData.activeVisitors + Math.floor(Math.random() * 5) - 2,
      currentViews: baseData.currentViews + Math.floor(Math.random() * 10),
      recentActivity: baseData.recentActivity.map((activity) => ({
        ...activity,
        timestamp: new Date(Date.now() - Math.random() * 300000), // Random time within last 5 minutes
      })),
    };

    return NextResponse.json({
      success: true,
      data: liveData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Realtime analytics API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch real-time analytics" },
      { status: 500 },
    );
  }
}
