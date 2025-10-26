import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";
import { publishWorker } from "../workers/publish-worker";

// Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

// Queue for publishing posts
export const publishQueue = new Queue("publish-posts", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});

// Queue for collecting metrics
export const metricsQueue = new Queue("collect-metrics", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

// Worker for processing publish jobs
export const publishWorkerInstance = new Worker(
  "publish-posts",
  async (job) => {
    console.log(`Processing publish job: ${job.id}`);
    await publishWorker.processJob(job.data);
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

// Worker for processing metrics collection jobs
export const metricsWorkerInstance = new Worker(
  "collect-metrics",
  async (job) => {
    console.log(`Processing metrics job: ${job.id}`);
    await collectMetrics(job.data);
  },
  {
    connection: redis,
    concurrency: 3,
  },
);

// Function to collect metrics from platform APIs
async function collectMetrics(data: {
  scheduledPostId: string;
  platform: string;
  postId: string;
}) {
  // This would implement the metrics collection logic
  // For now, just log the job
  console.log(`Collecting metrics for ${data.platform} post ${data.postId}`);
}

// Error handling
publishWorkerInstance.on("error", (error) => {
  console.error("Publish worker error:", error);
});

metricsWorkerInstance.on("error", (error) => {
  console.error("Metrics worker error:", error);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Shutting down workers...");
  await publishWorkerInstance.close();
  await metricsWorkerInstance.close();
  await redis.quit();
});

export { redis };

