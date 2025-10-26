/**
 * Health Monitoring System
 * Comprehensive health checks for all system components
 */

import { connectDB } from '../config/db.js';
import { Queue } from 'bullmq';
import fetch from 'node-fetch';

// Health check configuration
const HEALTH_CHECK_TIMEOUT = 5000; // 5 seconds
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

/**
 * Check database connectivity
 */
async function checkDatabase() {
  try {
    const start = Date.now();
    await connectDB();
    const duration = Date.now() - start;
    
    return {
      status: 'healthy',
      responseTime: `${duration}ms`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Check Redis connectivity
 */
async function checkRedis() {
  try {
    const start = Date.now();
    const queue = new Queue('health-check', { 
      connection: { url: REDIS_URL },
      defaultJobOptions: { removeOnComplete: 1, removeOnFail: 1 }
    });
    
    const job = await queue.add('ping', { timestamp: Date.now() });
    await queue.close();
    
    const duration = Date.now() - start;
    
    return {
      status: 'healthy',
      responseTime: `${duration}ms`,
      jobId: job.id,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Check external API connectivity
 */
async function checkExternalAPIs() {
  const apis = [
    { name: 'OpenAI', url: 'https://api.openai.com/v1/models' },
    { name: 'Google OAuth', url: 'https://accounts.google.com' },
    { name: 'GitHub API', url: 'https://api.github.com' }
  ];
  
  const results = {};
  
  for (const api of apis) {
    try {
      const start = Date.now();
      const response = await fetch(api.url, { 
        method: 'HEAD',
        timeout: HEALTH_CHECK_TIMEOUT 
      });
      const duration = Date.now() - start;
      
      results[api.name] = {
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime: `${duration}ms`,
        statusCode: response.status
      };
    } catch (error) {
      results[api.name] = {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
  
  return results;
}

/**
 * Check system resources
 */
function checkSystemResources() {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  return {
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    uptime: `${Math.round(uptime)}s`,
    nodeVersion: process.version,
    platform: process.platform
  };
}

/**
 * Comprehensive health check
 */
export async function performHealthCheck() {
  const start = Date.now();
  
  try {
    const [database, redis, externalAPIs, systemResources] = await Promise.all([
      checkDatabase(),
      checkRedis(),
      checkExternalAPIs(),
      Promise.resolve(checkSystemResources())
    ]);
    
    const duration = Date.now() - start;
    
    const overallStatus = [database, redis].every(check => check.status === 'healthy') 
      ? 'healthy' 
      : 'unhealthy';
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: `${duration}ms`,
      services: {
        database,
        redis,
        externalAPIs,
        systemResources
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Quick health check for load balancers
 */
export async function quickHealthCheck() {
  try {
    await connectDB();
    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
