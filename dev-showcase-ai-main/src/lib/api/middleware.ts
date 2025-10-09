// Authentication middleware and utilities

import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { AuthUserSchema, RateLimitSchema } from './schemas'
import { AuthUser, RateLimitInfo, ApiError } from './types'

// JWT Secret (in production, use environment variable)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Authentication middleware
export async function authenticate(request: NextRequest): Promise<{ user: AuthUser; error?: ApiError }> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return {
        user: {} as AuthUser,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Authorization token is required',
          timestamp: new Date().toISOString(),
          requestId: request.headers.get('x-request-id') || crypto.randomUUID()
        }
      }
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    // Validate user data
    const userData = AuthUserSchema.parse(payload)
    
    return { user: userData }
  } catch (error) {
    return {
      user: {} as AuthUser,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
        timestamp: new Date().toISOString(),
        requestId: request.headers.get('x-request-id') || crypto.randomUUID()
      }
    }
  }
}

// Rate limiting middleware
export function rateLimit(
  request: NextRequest,
  options: {
    windowMs?: number
    max?: number
    skipSuccessfulRequests?: boolean
    skipFailedRequests?: boolean
  } = {}
): { allowed: boolean; info: RateLimitInfo; error?: ApiError } {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100,
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options

  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowStart = now - windowMs

  // Clean expired entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }

  const key = `${ip}:${request.nextUrl.pathname}`
  const current = rateLimitStore.get(key)

  if (!current) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return {
      allowed: true,
      info: {
        limit: max,
        remaining: max - 1,
        reset: now + windowMs
      }
    }
  }

  if (current.count >= max) {
    const retryAfter = Math.ceil((current.resetTime - now) / 1000)
    return {
      allowed: false,
      info: {
        limit: max,
        remaining: 0,
        reset: current.resetTime,
        retryAfter
      },
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Rate limit exceeded',
        timestamp: new Date().toISOString(),
        requestId: request.headers.get('x-request-id') || crypto.randomUUID()
      }
    }
  }

  current.count++
  return {
    allowed: true,
    info: {
      limit: max,
      remaining: max - current.count,
      reset: current.resetTime
    }
  }
}

// User role authorization
export function authorize(user: AuthUser, requiredRole: 'user' | 'admin' | 'premium'): boolean {
  const roleHierarchy = { user: 1, premium: 2, admin: 3 }
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}

// Feature access check
export function hasFeatureAccess(user: AuthUser, feature: string): boolean {
  if (user.role === 'admin') return true
  
  const subscription = user.subscription
  if (!subscription) return false
  
  return subscription.features.includes(feature)
}

// Usage limit check
export function checkUsageLimit(user: AuthUser, resource: 'portfolios' | 'exports' | 'apiCalls' | 'storage', amount: number = 1): boolean {
  return user.usage[resource] + amount <= user.limits[resource]
}

// Request ID generator
export function generateRequestId(): string {
  return crypto.randomUUID()
}

// Error response helper
export function createErrorResponse(
  error: ApiError,
  status: number = 400
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: error.message,
      code: error.code,
      timestamp: error.timestamp,
      requestId: error.requestId
    },
    { status }
  )
}

// Success response helper
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
      requestId: generateRequestId()
    },
    { status }
  )
}

// Paginated response helper
export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
  },
  message?: string
): NextResponse {
  const totalPages = Math.ceil(pagination.total / pagination.limit)
  
  return NextResponse.json(
    {
      success: true,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1
      },
      message,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId()
    }
  )
}

// Validation error helper
export function createValidationErrorResponse(
  errors: Array<{ field: string; message: string; code: string }>,
  requestId: string
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors,
      timestamp: new Date().toISOString(),
      requestId
    },
    { status: 400 }
  )
}

// Middleware wrapper for authentication and rate limiting
export function withAuth(
  handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>,
  options: {
    requiredRole?: 'user' | 'admin' | 'premium'
    rateLimit?: {
      windowMs?: number
      max?: number
    }
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId()
    
    try {
      // Rate limiting
      if (options.rateLimit) {
        const rateLimitResult = rateLimit(request, options.rateLimit)
        if (!rateLimitResult.allowed) {
          return NextResponse.json(
            {
              success: false,
              error: rateLimitResult.error?.message,
              code: rateLimitResult.error?.code,
              timestamp: new Date().toISOString(),
              requestId
            },
            { 
              status: 429,
              headers: {
                'X-RateLimit-Limit': rateLimitResult.info.limit.toString(),
                'X-RateLimit-Remaining': rateLimitResult.info.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.info.reset.toString(),
                'Retry-After': rateLimitResult.info.retryAfter?.toString() || '0'
              }
            }
          )
        }
      }

      // Authentication
      const authResult = await authenticate(request)
      if (authResult.error) {
        return createErrorResponse(authResult.error, 401)
      }

      // Role authorization
      if (options.requiredRole && !authorize(authResult.user, options.requiredRole)) {
        return createErrorResponse({
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Insufficient permissions',
          timestamp: new Date().toISOString(),
          requestId,
          userId: authResult.user.id
        }, 403)
      }

      // Call the actual handler
      return await handler(request, authResult.user)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return createErrorResponse({
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
        requestId
      }, 500)
    }
  }
}

// CORS headers helper
export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID')
  response.headers.set('Access-Control-Max-Age', '86400')
  return response
}

// Request logging helper
export function logRequest(
  request: NextRequest,
  response: NextResponse,
  duration: number,
  userId?: string
): void {
  const logEntry = {
    level: response.status >= 400 ? 'error' : 'info',
    message: `${request.method} ${request.nextUrl.pathname} - ${response.status}`,
    userId,
    requestId: request.headers.get('x-request-id') || generateRequestId(),
    timestamp: new Date().toISOString(),
    endpoint: request.nextUrl.pathname,
    method: request.method,
    ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    duration,
    statusCode: response.status
  }

  // In production, send to logging service
  console.log(JSON.stringify(logEntry))
}

// Usage analytics helper
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
  const analytics = {
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

  // In production, send to analytics service
  console.log('Usage Analytics:', JSON.stringify(analytics))
}
