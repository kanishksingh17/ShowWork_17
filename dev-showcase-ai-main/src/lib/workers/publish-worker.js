/**
 * Publish Worker - Handles background publishing to social platforms
 * Processes scheduled posts from Redis queue
 */

import { Worker, Queue } from 'bullmq';
import { connectDB } from '../config/db.js';
import { generatePost } from './postGenerator.js';
import { publishToPlatform } from './platformPublisher.js';

// Initialize database connection
await connectDB();

// Create Redis connection
const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

// Create queue for scheduled posts
const postQueue = new Queue('postQueue', { connection });

// Create worker to process posts
const publishWorker = new Worker('postQueue', async (job) => {
  const { projectId, platforms, content, scheduledAt, userId } = job.data;
  
  console.log(`📣 Processing scheduled post for project ${projectId}`);
  
  try {
    // Generate platform-specific content
    const generatedContent = await generatePost({
      projectTitle: job.data.projectTitle,
      description: job.data.description,
      platforms: platforms
    });
    
    // Publish to each platform
    const results = [];
    for (const platform of platforms) {
      try {
        const result = await publishToPlatform({
          platform,
          content: generatedContent[platform] || content,
          userId,
          projectId
        });
        
        results.push({ platform, success: true, result });
        console.log(`✅ Published to ${platform}: ${result.postId}`);
      } catch (error) {
        console.error(`❌ Failed to publish to ${platform}:`, error.message);
        results.push({ platform, success: false, error: error.message });
      }
    }
    
    return { success: true, results };
  } catch (error) {
    console.error('❌ Publish worker error:', error);
    throw error;
  }
}, { connection });

// Worker event handlers
publishWorker.on('completed', (job) => {
  console.log(`✅ Post published successfully: ${job.id}`);
});

publishWorker.on('failed', (job, err) => {
  console.error(`❌ Post publishing failed: ${job.id}`, err.message);
});

publishWorker.on('error', (err) => {
  console.error('❌ Publish worker error:', err);
});

console.log('📣 Publish Worker listening on queue: postQueue');
console.log('🚀 Worker ready to process scheduled posts...');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📣 Publish Worker shutting down...');
  await publishWorker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📣 Publish Worker shutting down...');
  await publishWorker.close();
  process.exit(0);
});
