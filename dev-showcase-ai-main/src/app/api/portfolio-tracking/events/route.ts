import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();

    // Validate required fields
    if (!event.userId || !event.event || !event.timestamp) {
      return NextResponse.json(
        { error: "Missing required fields: userId, event, timestamp" },
        { status: 400 },
      );
    }

    // Create analytics record
    const analyticsRecord = await prisma.analytics.create({
      data: {
        userId: event.userId,
        portfolioId: event.portfolioId || null,
        event: event.event,
        properties: event.properties || {},
        timestamp: new Date(event.timestamp),
        ip: event.properties?.ip || null,
        userAgent: event.properties?.userAgent || null,
        referrer: event.properties?.referrer || null,
        country: event.properties?.country || null,
        city: event.properties?.city || null,
        device: event.properties?.device || null,
        browser: event.properties?.browser || null,
        os: event.properties?.os || null,
      },
    });

    return NextResponse.json({
      success: true,
      id: analyticsRecord.id,
    });
  } catch (error) {
    console.error("Portfolio tracking events API error:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get("portfolioId");
    const limit = parseInt(searchParams.get("limit") || "100");

    if (!portfolioId) {
      return NextResponse.json(
        { error: "Portfolio ID is required" },
        { status: 400 },
      );
    }

    const events = await prisma.analytics.findMany({
      where: {
        portfolioId,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Portfolio tracking events API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
