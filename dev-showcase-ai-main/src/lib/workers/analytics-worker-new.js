import { Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import mongoose from "mongoose";
import dayjs from "dayjs";
import dotenv from "dotenv";
dotenv.config();

import AnalyticsEvent from "../../models/AnalyticsEvent.js";
import AnalyticsAggregate from "../../models/AnalyticsAggregate.js";

const connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null, enableReadyCheck: false });

await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
console.log("✅ analytics-worker connected to MongoDB");

const w = new Worker("collect-analytics", async (job) => {
  const { event } = job.data;
  const d = dayjs(event.ts || Date.now()).format("YYYY-MM-DD");

  await AnalyticsEvent.create(event);

  const agg = await AnalyticsAggregate.findOne({ portfolioId: event.portfolioId, day: d });
  if (!agg) {
    const counters = { views: 0, downloads: 0, shares: 0, likes: 0, clicks: 0 };
    counters[event.eventType + "s"] = 1;
    await AnalyticsAggregate.create({ portfolioId: event.portfolioId, day: d, counters });
  } else {
    const path = `counters.${event.eventType + "s"}`;
    await AnalyticsAggregate.updateOne({ _id: agg._id }, { $inc: { [path]: 1 } });
  }

  return { ok: true };
}, { connection });

new QueueEvents("collect-analytics", { connection });
console.log("📈 analytics-worker running");
