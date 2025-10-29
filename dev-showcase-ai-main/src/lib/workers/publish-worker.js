import { Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import ScheduledPost from "../../models/ScheduledPost.js";
import PublishLog from "../../models/PublishLog.js";
import { publishToPlatform } from "./workers_util/publishPlatform.js";

const connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null, enableReadyCheck: false });

await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
console.log("✅ publish-worker connected to MongoDB");

const w = new Worker("publish-posts", async (job) => {
  const { scheduledPostId } = job.data;

  const post = await ScheduledPost.findById(scheduledPostId);
  if (!post) throw new Error("ScheduledPost not found");

  let partialFailures = false;
  const results = [];

  for (const platform of post.platforms) {
    try {
      const result = await publishToPlatform(platform, post.payload);
      results.push({ platform, status: "success", ...result });
      await PublishLog.create({ 
        jobId: job.id, 
        scheduledPostId: post._id, 
        platform, 
        status: "success", 
        response: result 
      });
    } catch (e) {
      partialFailures = true;
      results.push({ platform, status: "failed", error: e.message });
      await PublishLog.create({ 
        jobId: job.id, 
        scheduledPostId: post._id, 
        platform, 
        status: "failed", 
        error: e.message 
      });
    }
  }

  await ScheduledPost.findByIdAndUpdate(post._id, {
    status: partialFailures ? "partial" : "published",
    results
  });

  return { published: results.length, partialFailures };
}, { connection });

new QueueEvents("publish-posts", { connection });
console.log("🚀 publish-worker running");

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Shutting down publish worker...");
  await worker.close();
  await connection.quit();
  process.exit(0);
});