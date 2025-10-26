/**
 * Analytics Worker - Handles background analytics processing
 * Processes analytics events from Redis queue
 */

import { Worker, Queue } from 'bullmq';
import { connectDB } from '../config/db.js';
import AnalyticsEvent from '../../models/AnalyticsEvent.js';

// Initialize database connection
await connectDB();

// Create Redis connection
const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

// Create queue for analytics events
const analyticsQueue = new Queue('analyticsQueue', { connection });

// Create worker to process analytics
const analyticsWorker = new Worker('analyticsQueue', async (job) => {
  const { eventType, data, userId, projectId, platform } = job.data;
  
  console.log(`📊 Processing analytics event: ${eventType}`);
  
  try {
    // Create analytics event record
    const analyticsEvent = new AnalyticsEvent({
      eventType,
      data,
      userId,
      projectId,
      platform,
      timestamp: new Date(),
      processed: true
    });
    
    await analyticsEvent.save();
    
    // Update aggregated metrics
    await updateAggregatedMetrics({
      userId,
      projectId,
      platform,
      eventType,
      data
    });
    
    console.log(`✅ Analytics event processed: ${eventType}`);
    return { success: true, eventId: analyticsEvent._id };
  } catch (error) {
    console.error('❌ Analytics worker error:', error);
    throw error;
  }
}, { connection });

// Function to update aggregated metrics
async function updateAggregatedMetrics({ userId, projectId, platform, eventType, data }) {
  try {
    // Update user-level metrics
    await User.findByIdAndUpdate(userId, {
      $inc: {
        [`analytics.${platform}.${eventType}`]: 1,
        [`analytics.${platform}.totalEngagement`]: data.engagement || 0
      }
    });
    
    // Update project-level metrics
    await Project.findByIdAndUpdate(projectId, {
      $inc: {
        [`analytics.${platform}.${eventType}`]: 1,
        [`analytics.${platform}.totalEngagement`]: data.engagement || 0
      }
    });
    
    console.log(`📈 Updated metrics for ${platform} - ${eventType}`);
  } catch (error) {
    console.error('❌ Failed to update aggregated metrics:', error);
  }
}

// Worker event handlers
analyticsWorker.on('completed', (job) => {
  console.log(`✅ Analytics event processed: ${job.id}`);
});

analyticsWorker.on('failed', (job, err) => {
  console.error(`❌ Analytics processing failed: ${job.id}`, err.message);
});

analyticsWorker.on('error', (err) => {
  console.error('❌ Analytics worker error:', err);
});

console.log('📊 Analytics Worker active on queue: analyticsQueue');
console.log('🚀 Worker ready to process analytics events...');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📊 Analytics Worker shutting down...');
  await analyticsWorker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📊 Analytics Worker shutting down...');
  await analyticsWorker.close();
  process.exit(0);
});
