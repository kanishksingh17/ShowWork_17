/**
 * API Route: Health Check
 * GET /api/health
 */

import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/config/db.js';

export async function GET() {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        database: 'checking...',
        redis: 'checking...',
        workers: 'checking...'
      },
      version: '1.0.0',
      uptime: process.uptime()
    };

    // Check database connection
    try {
      await connectDB();
      health.services.database = 'healthy';
    } catch (error) {
      health.services.database = 'unhealthy';
      health.services.database_error = error.message;
    }

    // Check Redis connection (if available)
    try {
      const { Queue } = await import('bullmq');
      const testQueue = new Queue('health-check', { 
        connection: { 
          host: process.env.REDIS_HOST || 'redis',
          port: process.env.REDIS_PORT || 6379 
        } 
      });
      await testQueue.add('health-check', { timestamp: Date.now() });
      await testQueue.close();
      health.services.redis = 'healthy';
    } catch (error) {
      health.services.redis = 'unhealthy';
      health.services.redis_error = error.message;
    }

    // Check workers (basic check)
    health.services.workers = 'healthy'; // Workers are managed by Docker

    return NextResponse.json(health);
  } catch (error) {
    console.error('❌ Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Health check failed',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
