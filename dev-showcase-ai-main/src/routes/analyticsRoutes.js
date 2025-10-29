import express from "express";
import { analyticsQueue } from "../lib/queue/index.js";
import AnalyticsEvent from "../models/AnalyticsEvent.js";
import AnalyticsAggregate from "../models/AnalyticsAggregate.js";

const router = express.Router();

// Queue analytics event
router.post("/", async (req, res) => {
  try {
    const { event, userId, portfolioId, projectId, platform = "site" } = req.body;
    
    if (!event || !portfolioId) {
      return res.status(400).json({ 
        error: "Missing required fields: event, portfolioId" 
      });
    }

    const job = await analyticsQueue.add("analytics", {
      event: {
        userId,
        portfolioId,
        projectId,
        eventType: event,
        platform,
        meta: req.body,
        ts: new Date()
      }
    });

    res.json({ 
      queued: true, 
      jobId: job.id,
      message: "Analytics event queued successfully"
    });
  } catch (err) {
    console.error("Analytics queue error:", err);
    res.status(500).json({ error: "Failed to queue analytics event" });
  }
});

// Get analytics for a portfolio
router.get("/portfolio/:portfolioId", async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const events = await AnalyticsEvent.find({
      portfolioId,
      ts: { $gte: startDate }
    }).sort({ ts: -1 });

    const aggregates = await AnalyticsAggregate.find({
      portfolioId,
      day: { $gte: startDate.toISOString().split('T')[0] }
    }).sort({ day: -1 });

    res.json({
      portfolioId,
      period: `${days} days`,
      events: events.length,
      aggregates: aggregates.length,
      data: {
        events,
        aggregates
      }
    });
  } catch (err) {
    console.error("Analytics fetch error:", err);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
});

// Get analytics overview
router.get("/overview/:portfolioId", async (req, res) => {
  try {
    const { portfolioId } = req.params;
    
    const today = new Date().toISOString().split('T')[0];
    const aggregate = await AnalyticsAggregate.findOne({
      portfolioId,
      day: today
    });

    const totalEvents = await AnalyticsEvent.countDocuments({ portfolioId });
    const recentEvents = await AnalyticsEvent.find({
      portfolioId,
      ts: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).countDocuments();

    res.json({
      portfolioId,
      today: aggregate || { counters: { views: 0, downloads: 0, shares: 0, likes: 0, clicks: 0 } },
      totalEvents,
      recentEvents24h: recentEvents
    });
  } catch (err) {
    console.error("Analytics overview error:", err);
    res.status(500).json({ error: "Failed to fetch analytics overview" });
  }
});

export default router;
