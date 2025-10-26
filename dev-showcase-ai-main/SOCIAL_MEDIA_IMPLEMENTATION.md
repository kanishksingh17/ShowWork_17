# Social Media Publishing System Implementation

This document outlines the complete implementation of the social media publishing system for the portfolio showcase platform.

## 🏗️ Architecture Overview

```
Frontend (React/Next.js)
    ↓
API Endpoints (Next.js API Routes)
    ↓
Database (PostgreSQL + Prisma)
    ↓
Job Queue (BullMQ + Redis)
    ↓
Platform Adapters (LinkedIn, Twitter, Reddit, Facebook, Instagram)
    ↓
Platform APIs (OAuth + Publishing)
    ↓
Webhooks + Analytics Collection
    ↓
Dashboard Analytics
```

## 📊 Database Schema

### New Models Added

1. **ScheduledPost** - Stores scheduled social media posts
2. **PublishLog** - Tracks publishing attempts and results
3. **AnalyticsEvent** - Stores engagement metrics from platforms
4. **PlatformToken** - Stores OAuth tokens for each platform

### Key Fields

```prisma
model ScheduledPost {
  id              String   @id @default(cuid())
  userId          String
  projectId       String
  platforms       String[] // ["linkedin", "twitter", "reddit", "facebook", "instagram"]
  messageByPlatform Json   // { "linkedin": "message", "twitter": "message" }
  mediaUrls       String[] @default([])
  scheduledAt     DateTime
  status          PostStatus @default(SCHEDULED)
  result          Json?    // Store platform responses and post IDs
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## 🔌 API Endpoints

### Core Endpoints

1. **POST /api/calendar/schedule** - Schedule a new post
2. **GET /api/calendar/events** - Get calendar events for FullCalendar
3. **GET /api/analytics/overview** - Get aggregated analytics data
4. **POST /api/oauth/callback/[platform]** - Handle OAuth callbacks
5. **POST /api/webhooks/platform/[platform]** - Receive platform webhooks

### Example Usage

```typescript
// Schedule a post
const response = await fetch("/api/calendar/schedule", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    projectId: "proj_123",
    platforms: ["linkedin", "twitter"],
    scheduledAt: "2024-12-01T10:30:00Z",
    customMessage: "Check out my latest project!",
  }),
});
```

## 🎯 Platform Adapters

### Supported Platforms

1. **LinkedIn** - UGC API for professional posts
2. **Twitter** - Twitter API v2 for tweets
3. **Reddit** - Reddit API for subreddit posts
4. **Facebook** - Graph API for page posts
5. **Instagram** - Graph API (requires business account)

### Adapter Interface

```typescript
interface PlatformAdapter {
  publish(token: string, payload: PublishPayload): Promise<PublishResult>;
  getMetrics(token: string, postId: string): Promise<MetricsResult>;
}
```

## ⚙️ Job Queue System

### BullMQ + Redis Setup

```typescript
// Queue for publishing posts
export const publishQueue = new Queue("publish-posts", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  },
});
```

### Worker Processing

1. **Publish Worker** - Processes scheduled posts
2. **Metrics Worker** - Collects engagement data
3. **Retry Logic** - Exponential backoff for failed jobs
4. **Dead Letter Queue** - Handles permanently failed jobs

## 📈 Analytics Collection

### Data Sources

1. **Webhooks** - Real-time engagement data
2. **API Polling** - Periodic metrics collection
3. **Tracking Links** - UTM-tagged URLs for click tracking
4. **In-app Events** - Portfolio page views and interactions

### Metrics Tracked

- Views/Impressions
- Likes/Reactions
- Comments
- Shares/Retweets
- Clicks
- Engagement Rate

## 🎨 Frontend Components

### SocialMediaCalendar Component

- FullCalendar integration
- Drag-and-drop scheduling
- Platform-specific styling
- Real-time status updates
- Analytics dashboard

### Key Features

- **Visual Calendar** - Month/week/day views
- **Platform Indicators** - Color-coded platform badges
- **Status Tracking** - Scheduled/Processing/Posted/Failed
- **Quick Stats** - Dashboard metrics
- **Project Selection** - Easy project picker

## 🔐 Security & Privacy

### OAuth Implementation

- Secure token storage (encrypted at rest)
- Token refresh handling
- Minimal scope requests
- Platform-specific permissions

### Webhook Security

- Signature verification
- Platform-specific validation
- Rate limiting
- Audit logging

## 📋 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# Platform OAuth
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""
TWITTER_CLIENT_ID=""
TWITTER_CLIENT_SECRET=""
REDDIT_CLIENT_ID=""
REDDIT_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
INSTAGRAM_CLIENT_ID=""
INSTAGRAM_CLIENT_SECRET=""

# Webhook Secrets
LINKEDIN_WEBHOOK_SECRET=""
TWITTER_WEBHOOK_SECRET=""
REDDIT_WEBHOOK_SECRET=""
FACEBOOK_WEBHOOK_SECRET=""
```

## 🚀 Deployment Considerations

### Production Setup

1. **Redis Cluster** - For high availability
2. **Worker Scaling** - Multiple worker instances
3. **Database Indexing** - Optimize query performance
4. **Monitoring** - Queue depth, error rates, latency
5. **Alerting** - Failed jobs, token expiry, API errors

### Scaling Strategies

- **Horizontal Scaling** - Multiple worker processes
- **Queue Partitioning** - Separate queues by platform
- **Caching** - Redis for frequently accessed data
- **CDN** - For media uploads and static assets

## 📊 Monitoring & Observability

### Key Metrics

- Scheduled posts per day
- Success/failure rates by platform
- Average processing time
- Queue depth and latency
- API error rates
- Token refresh success rate

### Health Checks

- Database connectivity
- Redis connectivity
- Platform API status
- Worker process health
- Queue processing rate

## 🔄 Next Steps

### Immediate Tasks

1. Set up Redis instance
2. Configure OAuth apps for each platform
3. Deploy database migrations
4. Test webhook endpoints
5. Set up monitoring

### Future Enhancements

1. **AI Content Generation** - LLM integration for post creation
2. **A/B Testing** - Test different post formats
3. **Scheduling Optimization** - Best time to post analysis
4. **Cross-platform Analytics** - Unified metrics dashboard
5. **Content Templates** - Reusable post templates

## 🛠️ Development Commands

```bash
# Install dependencies
npm install bullmq ioredis @fullcalendar/react @fullcalendar/daygrid

# Run database migrations
npx prisma migrate dev

# Start Redis (Docker)
docker run -d -p 6379:6379 redis:alpine

# Start workers
npm run worker:publish
npm run worker:metrics
```

## 📚 Additional Resources

- [BullMQ Documentation](https://docs.bullmq.io/)
- [FullCalendar Documentation](https://fullcalendar.io/docs)
- [Platform API Documentation](https://developers.linkedin.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

This implementation provides a complete social media publishing system with scheduling, analytics, and multi-platform support. The architecture is designed to be scalable, maintainable, and extensible for future enhancements.

