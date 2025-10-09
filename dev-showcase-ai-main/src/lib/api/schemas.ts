// Zod validation schemas for API routes

import { z } from 'zod'

// Base schemas
export const RequestIdSchema = z.string().uuid()
export const TimestampSchema = z.string().datetime()
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: z.enum(['createdAt', 'updatedAt', 'title', 'views']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc')
})

// User Profile Schema
export const UserProfileSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(50),
  industry: z.string().min(1).max(50),
  experience: z.number().int().min(0).max(50),
  skills: z.array(z.string().min(1).max(50)).min(1).max(20),
  projects: z.array(z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    technologies: z.array(z.string().min(1).max(30)).min(1).max(10),
    url: z.string().url().optional()
  })).max(10).optional(),
  style: z.enum(['professional', 'creative', 'minimalist', 'modern']).optional(),
  colorPreferences: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).max(5).optional(),
  language: z.string().length(2).optional()
})

// Context Schema
export const ContextSchema = z.object({
  existingContent: z.string().max(5000).optional(),
  targetAudience: z.string().max(200).optional(),
  tone: z.enum(['formal', 'casual', 'friendly', 'authoritative']).optional(),
  length: z.enum(['short', 'medium', 'long']).optional()
})

// Generate Content Request Schema
export const GenerateContentRequestSchema = z.object({
  type: z.enum(['hero', 'about', 'skills', 'projects', 'contact', 'testimonials', 'blog', 'seo']),
  userProfile: UserProfileSchema,
  context: ContextSchema.optional()
})

// Portfolio Settings Schema
export const PortfolioSettingsSchema = z.object({
  theme: z.string().min(1).max(50),
  colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).min(1).max(10),
  fonts: z.array(z.string().min(1).max(50)).min(1).max(5),
  animations: z.boolean().default(true),
  responsive: z.boolean().default(true)
})

// SEO Schema
export const SEOSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  keywords: z.array(z.string().min(1).max(30)).max(10),
  ogImage: z.string().url().optional()
})

// Create Portfolio Request Schema
export const CreatePortfolioRequestSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  template: z.string().min(1).max(50),
  content: z.record(z.any()).optional(),
  settings: PortfolioSettingsSchema.optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).default('private'),
  seo: SEOSchema.optional(),
  customDomain: z.string().min(1).max(100).optional()
})

// Update Portfolio Request Schema
export const UpdatePortfolioRequestSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(500).optional(),
  template: z.string().min(1).max(50).optional(),
  content: z.record(z.any()).optional(),
  settings: PortfolioSettingsSchema.optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).optional(),
  seo: SEOSchema.optional(),
  customDomain: z.string().min(1).max(100).optional()
})

// Device Schema
export const DeviceSchema = z.object({
  type: z.enum(['desktop', 'tablet', 'mobile']),
  width: z.number().int().min(320).max(3840),
  height: z.number().int().min(240).max(2160),
  orientation: z.enum(['portrait', 'landscape']),
  pixelRatio: z.number().min(0.5).max(4).default(1)
})

// Preview Options Schema
export const PreviewOptionsSchema = z.object({
  includeAssets: z.boolean().default(true),
  optimizeImages: z.boolean().default(true),
  minifyCode: z.boolean().default(true),
  seoOptimized: z.boolean().default(true),
  responsive: z.boolean().default(true),
  analytics: z.boolean().default(false)
})

// Preview Request Schema
export const PreviewRequestSchema = z.object({
  portfolioId: z.string().uuid(),
  device: DeviceSchema,
  zoom: z.number().min(0.1).max(3).default(1),
  pan: z.object({
    x: z.number().int().min(-1000).max(1000).default(0),
    y: z.number().int().min(-1000).max(1000).default(0)
  }),
  options: PreviewOptionsSchema.optional()
})

// Auth User Schema
export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'admin', 'premium']),
  subscription: z.object({
    plan: z.enum(['free', 'pro', 'enterprise']),
    expiresAt: z.string().datetime(),
    features: z.array(z.string())
  }).optional(),
  limits: z.object({
    portfolios: z.number().int().min(0),
    exports: z.number().int().min(0),
    apiCalls: z.number().int().min(0),
    storage: z.number().int().min(0)
  }),
  usage: z.object({
    portfolios: z.number().int().min(0),
    exports: z.number().int().min(0),
    apiCalls: z.number().int().min(0),
    storage: z.number().int().min(0)
  })
})

// Rate Limit Schema
export const RateLimitSchema = z.object({
  limit: z.number().int().min(1),
  remaining: z.number().int().min(0),
  reset: z.number().int().min(0),
  retryAfter: z.number().int().min(0).optional()
})

// Error Schema
export const ApiErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  details: z.any().optional(),
  timestamp: z.string().datetime(),
  requestId: z.string().uuid(),
  userId: z.string().uuid().optional()
})

// Validation Error Schema
export const ValidationErrorSchema = z.object({
  field: z.string().min(1),
  message: z.string().min(1),
  code: z.string().min(1),
  value: z.any().optional()
})

// Log Entry Schema
export const LogEntrySchema = z.object({
  level: z.enum(['info', 'warn', 'error', 'debug']),
  message: z.string().min(1),
  data: z.any().optional(),
  userId: z.string().uuid().optional(),
  requestId: z.string().uuid(),
  timestamp: z.string().datetime(),
  endpoint: z.string().min(1),
  method: z.string().min(1),
  ip: z.string().min(1),
  userAgent: z.string().min(1),
  duration: z.number().min(0),
  statusCode: z.number().int().min(100).max(599)
})

// Usage Analytics Schema
export const UsageAnalyticsSchema = z.object({
  userId: z.string().uuid(),
  endpoint: z.string().min(1),
  method: z.string().min(1),
  timestamp: z.string().datetime(),
  duration: z.number().min(0),
  statusCode: z.number().int().min(100).max(599),
  requestSize: z.number().int().min(0),
  responseSize: z.number().int().min(0),
  userAgent: z.string().min(1),
  ip: z.string().min(1),
  features: z.array(z.string())
})

// API Response Schema
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    timestamp: z.string().datetime(),
    requestId: z.string().uuid()
  })

// Paginated Response Schema
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ApiResponseSchema(z.array(dataSchema)).extend({
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      hasNext: z.boolean(),
      hasPrev: z.boolean()
    })
  })

// Export all schemas
export {
  RequestIdSchema,
  TimestampSchema,
  PaginationSchema,
  UserProfileSchema,
  ContextSchema,
  GenerateContentRequestSchema,
  PortfolioSettingsSchema,
  SEOSchema,
  CreatePortfolioRequestSchema,
  UpdatePortfolioRequestSchema,
  DeviceSchema,
  PreviewOptionsSchema,
  PreviewRequestSchema,
  AuthUserSchema,
  RateLimitSchema,
  ApiErrorSchema,
  ValidationErrorSchema,
  LogEntrySchema,
  UsageAnalyticsSchema,
  ApiResponseSchema,
  PaginatedResponseSchema
}
