import express from "express";
import { publishQueue } from "../lib/queue/index.js";
import ScheduledPost from "../models/ScheduledPost.js";

const router = express.Router();

// Schedule a post
router.post("/schedule", async (req, res) => {
  try {
    const { 
      userId, 
      projectId, 
      platforms, 
      content, 
      mediaUrls = [], 
      scheduledAt,
      perPlatform = {} 
    } = req.body;

    if (!userId || !platforms || !content || !scheduledAt) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, platforms, content, scheduledAt" 
      });
    }

    // Create scheduled post
    const scheduledPost = new ScheduledPost({
      userId,
      projectId,
      platforms,
      payload: {
        text: content,
        mediaUrls,
        perPlatform
      },
      scheduledAt: new Date(scheduledAt),
      status: "pending"
    });

    await scheduledPost.save();

    // Add to publish queue
    const job = await publishQueue.add("publish-post", {
      scheduledPostId: scheduledPost._id
    }, {
      delay: new Date(scheduledAt).getTime() - Date.now()
    });

    res.json({
      success: true,
      message: "Post scheduled successfully",
      jobId: job.id,
      scheduledPostId: scheduledPost._id,
      scheduledAt: scheduledAt
    });
  } catch (err) {
    console.error("Schedule post error:", err);
    res.status(500).json({ error: "Failed to schedule post" });
  }
});

// Get scheduled posts for a user
router.get("/scheduled/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 50 } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const posts = await ScheduledPost.find(query)
      .sort({ scheduledAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      posts,
      count: posts.length
    });
  } catch (err) {
    console.error("Get scheduled posts error:", err);
    res.status(500).json({ error: "Failed to fetch scheduled posts" });
  }
});

// Cancel a scheduled post
router.delete("/cancel/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await ScheduledPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Scheduled post not found" });
    }

    if (post.status === "published") {
      return res.status(400).json({ error: "Cannot cancel already published post" });
    }

    post.status = "cancelled";
    await post.save();

    res.json({
      success: true,
      message: "Post cancelled successfully"
    });
  } catch (err) {
    console.error("Cancel post error:", err);
    res.status(500).json({ error: "Failed to cancel post" });
  }
});

// Get calendar events (formatted for calendar UI)
router.get("/events/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { start, end } = req.query;

    const query = { userId };
    if (start && end) {
      query.scheduledAt = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    const posts = await ScheduledPost.find(query)
      .sort({ scheduledAt: 1 });

    const events = posts.map(post => ({
      id: post._id,
      title: post.payload.text.substring(0, 50) + "...",
      start: post.scheduledAt,
      platforms: post.platforms,
      status: post.status,
      color: post.status === "published" ? "green" : 
             post.status === "failed" ? "red" : 
             post.status === "pending" ? "blue" : "gray"
    }));

    res.json({
      success: true,
      events
    });
  } catch (err) {
    console.error("Get calendar events error:", err);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

export default router;
