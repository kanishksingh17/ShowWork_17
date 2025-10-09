// Comprehensive Error Handling and Logging System

import { NextRequest, NextResponse } from 'next/server'
import { LogEntrySchema, UsageAnalyticsSchema, ApiErrorSchema } from '../../lib/api/schemas'
import { LogEntry, UsageAnalytics, ApiError } from '../../lib/api/types'

// Logging levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// Error codes
export enum ErrorCode {
  // Authentication errors
  MISSING_TOKEN = 'MISSING_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Resource errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Usage limits
  USAGE_LIMIT_EXCEEDED = 'USAGE_LIMIT_EXCEEDED',
  FEATURE_NOT_AVAILABLE = 'FEATURE_NOT_AVAILABLE',
  
  // External service errors
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  OPENAI_API_ERROR = 'OPENAI_API_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // Internal errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  GENERATION_FAILED = 'GENERATION_FAILED',
  PREVIEW_FAILED = 'PREVIEW_FAILED',
  CREATION_FAILED = 'CREATION_FAILED',
  UPDATE_FAILED = 'UPDATE_FAILED',
  DELETE_FAILED = 'DELETE_FAILED',
  PUBLISH_FAILED = 'PUBLISH_FAILED',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // File errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED'
}

// Error messages
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.MISSING_TOKEN]: 'Authorization token is required',
  [ErrorCode.INVALID_TOKEN]: 'Invalid or expired token',
  [ErrorCode.TOKEN_EXPIRED]: 'Token has expired',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
  [ErrorCode.VALIDATION_ERROR]: 'Validation failed',
  [ErrorCode.INVALID_INPUT]: 'Invalid input provided',
  [ErrorCode.MISSING_REQUIRED_FIELD]: 'Required field is missing',
  [ErrorCode.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
  [ErrorCode.RESOURCE_CONFLICT]: 'Resource conflict',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
  [ErrorCode.USAGE_LIMIT_EXCEEDED]: 'Usage limit exceeded',
  [ErrorCode.FEATURE_NOT_AVAILABLE]: 'Feature not available',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'External service error',
  [ErrorCode.OPENAI_API_ERROR]: 'OpenAI API error',
  [ErrorCode.DATABASE_ERROR]: 'Database error',
  [ErrorCode.INTERNAL_ERROR]: 'Internal server error',
  [ErrorCode.GENERATION_FAILED]: 'Content generation failed',
  [ErrorCode.PREVIEW_FAILED]: 'Preview generation failed',
  [ErrorCode.CREATION_FAILED]: 'Resource creation failed',
  [ErrorCode.UPDATE_FAILED]: 'Resource update failed',
  [ErrorCode.DELETE_FAILED]: 'Resource deletion failed',
  [ErrorCode.PUBLISH_FAILED]: 'Resource publishing failed',
  [ErrorCode.NETWORK_ERROR]: 'Network error',
  [ErrorCode.TIMEOUT_ERROR]: 'Request timeout',
  [ErrorCode.FILE_TOO_LARGE]: 'File too large',
  [ErrorCode.INVALID_FILE_TYPE]: 'Invalid file type',
  [ErrorCode.FILE_UPLOAD_FAILED]: 'File upload failed'
}

// HTTP status codes for errors
export const ERROR_STATUS_CODES: Record<ErrorCode, number> = {
  [ErrorCode.MISSING_TOKEN]: 401,
  [ErrorCode.INVALID_TOKEN]: 401,
  [ErrorCode.TOKEN_EXPIRED]: 401,
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 403,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.INVALID_INPUT]: 400,
  [ErrorCode.MISSING_REQUIRED_FIELD]: 400,
  [ErrorCode.RESOURCE_NOT_FOUND]: 404,
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: 409,
  [ErrorCode.RESOURCE_CONFLICT]: 409,
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 429,
  [ErrorCode.USAGE_LIMIT_EXCEEDED]: 429,
  [ErrorCode.FEATURE_NOT_AVAILABLE]: 403,
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 502,
  [ErrorCode.OPENAI_API_ERROR]: 502,
  [ErrorCode.DATABASE_ERROR]: 500,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.GENERATION_FAILED]: 500,
  [ErrorCode.PREVIEW_FAILED]: 500,
  [ErrorCode.CREATION_FAILED]: 500,
  [ErrorCode.UPDATE_FAILED]: 500,
  [ErrorCode.DELETE_FAILED]: 500,
  [ErrorCode.PUBLISH_FAILED]: 500,
  [ErrorCode.NETWORK_ERROR]: 502,
  [ErrorCode.TIMEOUT_ERROR]: 408,
  [ErrorCode.FILE_TOO_LARGE]: 413,
  [ErrorCode.INVALID_FILE_TYPE]: 400,
  [ErrorCode.FILE_UPLOAD_FAILED]: 500
}

// Logger class
export class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []
  private maxLogs: number = 1000

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public log(
    level: LogLevel,
    message: string,
    data?: any,
    requestId?: string,
    userId?: string,
    endpoint?: string,
    method?: string,
    ip?: string,
    userAgent?: string,
    duration?: number,
    statusCode?: number
  ): void {
    const logEntry: LogEntry = {
      level,
      message,
      data,
      userId,
      requestId: requestId || crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      endpoint: endpoint || 'unknown',
      method: method || 'unknown',
      ip: ip || 'unknown',
      userAgent: userAgent || 'unknown',
      duration: duration || 0,
      statusCode: statusCode || 200
    }

    // Validate log entry
    const validationResult = LogEntrySchema.safeParse(logEntry)
    if (!validationResult.success) {
      console.error('Invalid log entry:', validationResult.error)
      return
    }

    // Add to logs
    this.logs.push(logEntry)

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Output to console (in production, send to logging service)
    this.outputToConsole(logEntry)
  }

  private outputToConsole(logEntry: LogEntry): void {
    const timestamp = new Date(logEntry.timestamp).toISOString()
    const level = logEntry.level.toUpperCase().padEnd(5)
    const message = logEntry.message
    const context = {
      requestId: logEntry.requestId,
      userId: logEntry.userId,
      endpoint: logEntry.endpoint,
      method: logEntry.method,
      ip: logEntry.ip,
      duration: logEntry.duration,
      statusCode: logEntry.statusCode
    }

    const logMessage = `[${timestamp}] ${level} ${message}`
    const logData = { ...context, ...(logEntry.data || {}) }

    switch (logEntry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, logData)
        break
      case LogLevel.INFO:
        console.info(logMessage, logData)
        break
      case LogLevel.WARN:
        console.warn(logMessage, logData)
        break
      case LogLevel.ERROR:
        console.error(logMessage, logData)
        break
    }
  }

  public getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = this.logs

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level)
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit)
    }

    return filteredLogs
  }

  public clearLogs(): void {
    this.logs = []
  }
}

// Analytics tracker
export class AnalyticsTracker {
  private static instance: AnalyticsTracker
  private analytics: UsageAnalytics[] = []
  private maxAnalytics: number = 10000

  private constructor() {}

  public static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker()
    }
    return AnalyticsTracker.instance
  }

  public track(
    userId: string,
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number,
    requestSize: number,
    responseSize: number,
    userAgent: string,
    ip: string,
    features: string[] = []
  ): void {
    const analytics: UsageAnalytics = {
      userId,
      endpoint,
      method,
      timestamp: new Date().toISOString(),
      duration,
      statusCode,
      requestSize,
      responseSize,
      userAgent,
      ip,
      features
    }

    // Validate analytics
    const validationResult = UsageAnalyticsSchema.safeParse(analytics)
    if (!validationResult.success) {
      console.error('Invalid analytics entry:', validationResult.error)
      return
    }

    // Add to analytics
    this.analytics.push(analytics)

    // Keep only recent analytics
    if (this.analytics.length > this.maxAnalytics) {
      this.analytics = this.analytics.slice(-this.maxAnalytics)
    }

    // In production, send to analytics service
    this.sendToAnalyticsService(analytics)
  }

  private sendToAnalyticsService(analytics: UsageAnalytics): void {
    // In production, implement actual analytics service integration
    console.log('Analytics:', JSON.stringify(analytics))
  }

  public getAnalytics(userId?: string, limit?: number): UsageAnalytics[] {
    let filteredAnalytics = this.analytics

    if (userId) {
      filteredAnalytics = filteredAnalytics.filter(analytics => analytics.userId === userId)
    }

    if (limit) {
      filteredAnalytics = filteredAnalytics.slice(-limit)
    }

    return filteredAnalytics
  }

  public getAnalyticsSummary(userId?: string): {
    totalRequests: number
    averageDuration: number
    successRate: number
    topEndpoints: Array<{ endpoint: string; count: number }>
    topFeatures: Array<{ feature: string; count: number }>
  } {
    const analytics = this.getAnalytics(userId)
    
    const totalRequests = analytics.length
    const averageDuration = analytics.reduce((sum, a) => sum + a.duration, 0) / totalRequests
    const successRate = (analytics.filter(a => a.statusCode < 400).length / totalRequests) * 100
    
    const endpointCounts = analytics.reduce((acc, a) => {
      acc[a.endpoint] = (acc[a.endpoint] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topEndpoints = Object.entries(endpointCounts)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
    
    const featureCounts = analytics.reduce((acc, a) => {
      a.features.forEach(feature => {
        acc[feature] = (acc[feature] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)
    
    const topFeatures = Object.entries(featureCounts)
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalRequests,
      averageDuration,
      successRate,
      topEndpoints,
      topFeatures
    }
  }
}

// Error handler utility
export function createApiError(
  code: ErrorCode,
  message?: string,
  details?: any,
  requestId?: string,
  userId?: string
): ApiError {
  return {
    code,
    message: message || ERROR_MESSAGES[code],
    details,
    timestamp: new Date().toISOString(),
    requestId: requestId || crypto.randomUUID(),
    userId
  }
}

// Error response creator
export function createErrorResponse(
  error: ApiError,
  status?: number
): NextResponse {
  const statusCode = status || ERROR_STATUS_CODES[error.code as ErrorCode]
  
  return NextResponse.json(
    {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details,
      timestamp: error.timestamp,
      requestId: error.requestId
    },
    { status: statusCode }
  )
}

// Success response creator
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID()
    },
    { status }
  )
}

// Request logging middleware
export function logRequest(
  request: NextRequest,
  response: NextResponse,
  duration: number,
  userId?: string
): void {
  const logger = Logger.getInstance()
  
  logger.log(
    response.status >= 400 ? LogLevel.ERROR : LogLevel.INFO,
    `${request.method} ${request.nextUrl.pathname} - ${response.status}`,
    {
      statusCode: response.status,
      duration,
      userAgent: request.headers.get('user-agent'),
      ip: request.ip || request.headers.get('x-forwarded-for')
    },
    request.headers.get('x-request-id') || crypto.randomUUID(),
    userId,
    request.nextUrl.pathname,
    request.method,
    request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    request.headers.get('user-agent') || 'unknown',
    duration,
    response.status
  )
}

// Usage analytics middleware
export function trackUsage(
  userId: string,
  endpoint: string,
  method: string,
  duration: number,
  statusCode: number,
  requestSize: number,
  responseSize: number,
  userAgent: string,
  ip: string,
  features: string[] = []
): void {
  const tracker = AnalyticsTracker.getInstance()
  
  tracker.track(
    userId,
    endpoint,
    method,
    duration,
    statusCode,
    requestSize,
    responseSize,
    userAgent,
    ip,
    features
  )
}

// Global error handler
export function handleGlobalError(
  error: Error,
  request: NextRequest,
  requestId: string,
  userId?: string
): NextResponse {
  const logger = Logger.getInstance()
  
  logger.log(
    LogLevel.ERROR,
    'Unhandled error occurred',
    {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method
    },
    requestId,
    userId,
    request.nextUrl.pathname,
    request.method,
    request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    request.headers.get('user-agent') || 'unknown'
  )

  return createErrorResponse(
    createApiError(
      ErrorCode.INTERNAL_ERROR,
      'An unexpected error occurred',
      process.env.NODE_ENV === 'development' ? error.message : undefined,
      requestId,
      userId
    ),
    500
  )
}

// Validation error handler
export function handleValidationError(
  errors: Array<{ field: string; message: string; code: string }>,
  requestId: string
): NextResponse {
  return createErrorResponse(
    createApiError(
      ErrorCode.VALIDATION_ERROR,
      'Validation failed',
      errors,
      requestId
    ),
    400
  )
}

// Rate limit error handler
export function handleRateLimitError(
  limit: number,
  remaining: number,
  reset: number,
  requestId: string
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: ERROR_MESSAGES[ErrorCode.RATE_LIMIT_EXCEEDED],
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      timestamp: new Date().toISOString(),
      requestId
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString()
      }
    }
  )
}

// Export instances
export const logger = Logger.getInstance()
export const analyticsTracker = AnalyticsTracker.getInstance()
