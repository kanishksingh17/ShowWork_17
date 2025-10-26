import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();

    const { db } = await connectToDatabase();

    // Store the tracking event
    await db.collection("analytics_events").insertOne({
      ...event,
      createdAt: new Date(),
      sessionId: event.sessionId || "unknown",
      userId: event.userId || "anonymous",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track event" },
      { status: 500 },
    );
  }
}
