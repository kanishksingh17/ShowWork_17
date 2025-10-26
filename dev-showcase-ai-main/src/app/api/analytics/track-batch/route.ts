import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { events } = await request.json();

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ success: true });
    }

    const { db } = await connectToDatabase();

    // Store all events in batch
    const eventsWithTimestamp = events.map((event) => ({
      ...event,
      createdAt: new Date(),
      sessionId: event.sessionId || "unknown",
      userId: event.userId || "anonymous",
    }));

    await db.collection("analytics_events").insertMany(eventsWithTimestamp);

    return NextResponse.json({ success: true, count: events.length });
  } catch (error) {
    console.error("Analytics batch tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track events" },
      { status: 500 },
    );
  }
}
