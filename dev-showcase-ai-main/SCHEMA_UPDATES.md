# Prisma Schema Updates for Social Media Publishing

## ✅ Models Updated/Added

### 1. **UserToken** (renamed from PlatformToken)

```prisma
model UserToken {
  id           String   @id @default(cuid())
  userId       String
  platform     String
  accessToken  String   @db.Text
  refreshToken String?  @db.Text
  expiresAt    DateTime?
  scope        String?
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, platform])
  @@map("user_tokens")
}
```

**Changes:**

- Renamed from `PlatformToken` to `UserToken`
- Simplified `scope` from `String[]` to `String?`
- Removed `isActive` and `updatedAt` fields
- Updated table mapping to `user_tokens`

### 2. **PublishLog** (updated)

```prisma
model PublishLog {
  id              String   @id @default(cuid())
  scheduledPostId String
  platform        String
  attempt         Int      @default(1)
  status          String
  platformResponse Json?
  createdAt       DateTime @default(now())

  scheduledPost   ScheduledPost @relation(fields: [scheduledPostId], references: [id], onDelete: Cascade)

  @@map("publish_logs")
}
```

**Changes:**

- Changed `status` from `PublishStatus` enum to `String`
- Removed `platformPostId` and `errorMessage` fields
- Renamed `timestamp` to `createdAt`
- Simplified structure

### 3. **ScheduledPost** (updated)

```prisma
model ScheduledPost {
  id               String   @id @default(cuid())
  userId           String
  projectId        String
  platforms        String[]
  message          String?
  messageByPlatform Json?
  media            String[]      @default([])
  scheduledAt      DateTime
  status           String        @default("scheduled") // scheduled, processing, posted, failed
  result           Json?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  project         Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  publishLogs     PublishLog[]

  @@map("scheduled_posts")
}
```

**Changes:**

- Added `message` field (String?)
- Renamed `mediaUrls` to `media`
- Changed `status` from `PostStatus` enum to `String` with default "scheduled"
- Updated field names to match specification

### 4. **AnalyticsEvent** (updated)

```prisma
model AnalyticsEvent {
  id         String   @id @default(cuid())
  userId     String
  projectId   String?
  platform   String
  metricType String
  value      Int
  raw        Json?
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project    Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@map("analytics_events")
}
```

**Changes:**

- Changed `metricType` from `MetricType` enum to `String`
- Renamed `count` to `value`
- Renamed `timestamp` to `createdAt`
- Renamed `rawPayload` to `raw`
- Simplified structure

### 5. **AnalyticsAggregate** (new model)

```prisma
model AnalyticsAggregate {
  id         String   @id @default(cuid())
  userId     String
  projectId  String?
  platform   String?
  period     String   // e.g., 2025-10-01 (date string) or 2025-W40 (week)
  views      Int      @default(0)
  likes      Int      @default(0)
  shares     Int      @default(0)
  comments   Int      @default(0)
  clicks     Int      @default(0)
  updatedAt  DateTime @updatedAt

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project    Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@unique([userId, projectId, platform, period])
  @@map("analytics_aggregates")
}
```

**New Features:**

- Aggregated analytics data for performance
- Flexible period format (daily, weekly, monthly)
- Platform-specific and project-specific aggregations
- Unique constraint to prevent duplicates

## 🔄 Relationship Updates

### User Model

```prisma
model User {
  // ... existing fields ...
  scheduledPosts ScheduledPost[]
  analyticsEvents AnalyticsEvent[]
  userTokens UserToken[]                    // Updated from platformTokens
  analyticsAggregates AnalyticsAggregate[]  // New relationship
}
```

### Project Model

```prisma
model Project {
  // ... existing fields ...
  scheduledPosts ScheduledPost[]
  analyticsEvents AnalyticsEvent[]
  analyticsAggregates AnalyticsAggregate[]  // New relationship
}
```

## 🗑️ Removed Enums

The following enums were removed as they're now using String types:

- `PostStatus` (SCHEDULED, PROCESSING, POSTED, FAILED, CANCELLED)
- `PublishStatus` (PENDING, SUCCESS, FAILED, RETRYING)
- `MetricType` (VIEW, LIKE, COMMENT, SHARE, CLICK, IMPRESSION, ENGAGEMENT)

## 📊 Database Migration

To apply these changes, run:

```bash
npx prisma migrate dev --name update_social_media_models
```

## 🎯 Benefits of These Changes

1. **Simplified Schema** - Removed complex enums in favor of flexible strings
2. **Better Performance** - AnalyticsAggregate model for fast dashboard queries
3. **Flexible Status Tracking** - String-based status allows for custom states
4. **Improved Analytics** - Dedicated aggregation model for reporting
5. **Cleaner Relationships** - Updated model names and relationships

## 🔧 API Updates Required

The following API endpoints will need updates to match the new schema:

1. **Calendar Schedule API** - Update to use new field names
2. **Analytics Overview API** - Use AnalyticsAggregate for better performance
3. **Platform Adapters** - Update to use new PublishLog structure
4. **Webhook Handlers** - Update to use new AnalyticsEvent structure

## 📈 Performance Improvements

- **AnalyticsAggregate** model enables fast dashboard queries
- **Unique constraints** prevent duplicate data
- **Simplified relationships** reduce query complexity
- **String-based status** allows for flexible state management

