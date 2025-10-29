import { Queue } from "bullmq";
import IORedis from "ioredis";

export const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const publishQueue = new Queue("publish-posts", {
  connection: redis,
  defaultJobOptions: { 
    removeOnComplete: 20, 
    removeOnFail: 20, 
    attempts: 3, 
    backoff: { type: "exponential", delay: 2000 } 
  }
});

export const analyticsQueue = new Queue("collect-analytics", {
  connection: redis,
  defaultJobOptions: { 
    removeOnComplete: 50, 
    removeOnFail: 20, 
    attempts: 2 
  }
});
