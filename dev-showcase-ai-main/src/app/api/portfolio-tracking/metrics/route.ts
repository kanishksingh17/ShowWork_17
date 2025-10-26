import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get("portfolioId");
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    if (!portfolioId) {
      return NextResponse.json(
        { error: "Portfolio ID is required" },
        { status: 400 },
      );
    }

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // Fetch analytics data from database
    const analytics = await prisma.analytics.findMany({
      where: {
        portfolioId,
        ...(Object.keys(dateFilter).length > 0 && { timestamp: dateFilter }),
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    // Calculate metrics
    const totalViews = analytics.filter((a) => a.event === "page_view").length;
    const uniqueVisitors = new Set(
      analytics.filter((a) => a.event === "page_view").map((a) => a.ip),
    ).size;
    const totalDownloads = analytics.filter(
      (a) => a.event === "download",
    ).length;
    const totalInteractions = analytics.filter((a) =>
      ["like", "share", "click", "external_link"].includes(a.event),
    ).length;

    // Calculate average session duration
    const sessionDurations = analytics
      .filter(
        (a) =>
          a.properties &&
          typeof a.properties === "object" &&
          "duration" in a.properties,
      )
      .map((a) => (a.properties as any).duration)
      .filter((d) => typeof d === "number");

    const averageSessionDuration =
      sessionDurations.length > 0
        ? sessionDurations.reduce((sum, d) => sum + d, 0) /
          sessionDurations.length
        : 0;

    // Calculate bounce rate (single page visits)
    const singlePageVisits = analytics
      .filter((a) => a.event === "page_view")
      .reduce(
        (acc, a) => {
          const ip = a.ip || "unknown";
          acc[ip] = (acc[ip] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const bouncedVisits = Object.values(singlePageVisits).filter(
      (count) => count === 1,
    ).length;
    const bounceRate = totalViews > 0 ? (bouncedVisits / totalViews) * 100 : 0;

    // Calculate conversion rate (downloads / views)
    const conversionRate =
      totalViews > 0 ? (totalDownloads / totalViews) * 100 : 0;

    // Get top countries
    const countryData = analytics
      .filter((a) => a.country)
      .reduce(
        (acc, a) => {
          const country = a.country!;
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const topCountries = Object.entries(countryData)
      .map(([country, count]) => ({
        country,
        visitors: count,
        percentage: (count / totalViews) * 100,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);

    // Get top devices
    const deviceData = analytics
      .filter((a) => a.device)
      .reduce(
        (acc, a) => {
          const device = a.device!;
          acc[device] = (acc[device] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const topDevices = Object.entries(deviceData)
      .map(([device, count]) => ({
        device,
        visitors: count,
        percentage: (count / totalViews) * 100,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);

    // Get top browsers
    const browserData = analytics
      .filter((a) => a.browser)
      .reduce(
        (acc, a) => {
          const browser = a.browser!;
          acc[browser] = (acc[browser] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const topBrowsers = Object.entries(browserData)
      .map(([browser, count]) => ({
        browser,
        visitors: count,
        percentage: (count / totalViews) * 100,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);

    // Get top operating systems
    const osData = analytics
      .filter((a) => a.os)
      .reduce(
        (acc, a) => {
          const os = a.os!;
          acc[os] = (acc[os] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const topOperatingSystems = Object.entries(osData)
      .map(([os, count]) => ({
        os,
        visitors: count,
        percentage: (count / totalViews) * 100,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);

    // Get traffic sources
    const referrerData = analytics
      .filter((a) => a.referrer)
      .reduce(
        (acc, a) => {
          const referrer = a.referrer!;
          let source = "Direct";

          if (referrer.includes("google")) source = "Google";
          else if (referrer.includes("linkedin")) source = "LinkedIn";
          else if (referrer.includes("github")) source = "GitHub";
          else if (referrer.includes("twitter")) source = "Twitter";
          else if (referrer.includes("facebook")) source = "Facebook";
          else if (referrer) source = "Other";

          acc[source] = (acc[source] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const trafficSources = Object.entries(referrerData)
      .map(([source, count]) => ({
        source,
        visitors: count,
        percentage: (count / totalViews) * 100,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);

    const metrics = {
      totalViews,
      uniqueVisitors,
      totalDownloads,
      totalInteractions,
      averageSessionDuration,
      bounceRate,
      conversionRate,
      topCountries,
      topDevices,
      topBrowsers,
      topOperatingSystems,
      trafficSources,
      lastUpdated: new Date(),
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Portfolio tracking metrics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio metrics" },
      { status: 500 },
    );
  }
}
