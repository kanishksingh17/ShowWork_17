// Portfolio CRUD Operations API Routes

import { NextRequest, NextResponse } from 'next/server'
import { withAuth, createErrorResponse, createSuccessResponse, createPaginatedResponse, trackUsage, checkUsageLimit } from '../../../lib/api/middleware'
import { CreatePortfolioRequestSchema, PaginationSchema } from '../../../lib/api/schemas'
import { Portfolio, AuthUser } from '../../../lib/api/types'

// Mock database (in production, use a real database)
const portfolios = new Map<string, Portfolio>()
let nextId = 1

// Initialize with some sample data
if (portfolios.size === 0) {
  const samplePortfolio: Portfolio = {
    id: '1',
    userId: 'user-1',
    title: 'Sample Portfolio',
    description: 'A sample portfolio for demonstration',
    template: 'modern',
    content: {
      hero: {
        title: 'John Doe',
        subtitle: 'Full Stack Developer',
        description: 'Building amazing web experiences'
      },
      about: {
        text: 'Passionate developer with 5+ years of experience'
      }
    },
    settings: {
      theme: 'light',
      colors: ['#3B82F6', '#1E40AF'],
      fonts: ['Inter', 'Roboto'],
      animations: true,
      responsive: true
    },
    status: 'draft',
    visibility: 'private',
    seo: {
      title: 'John Doe - Full Stack Developer',
      description: 'Portfolio of John Doe, a full stack developer',
      keywords: ['developer', 'portfolio', 'web development']
    },
    analytics: {
      views: 0,
      uniqueViews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
  portfolios.set('1', samplePortfolio)
}

// GET /api/portfolios - List portfolios
async function handleGetPortfolios(
  request: NextRequest,
  user: AuthUser
): Promise<NextResponse> {
  const startTime = Date.now()
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID()
  
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    
    // Parse pagination parameters
    const paginationResult = PaginationSchema.safeParse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sort: searchParams.get('sort') || 'createdAt',
      order: searchParams.get('order') || 'desc'
    })
    
    if (!paginationResult.success) {
      return createErrorResponse({
        code: 'INVALID_PAGINATION',
        message: 'Invalid pagination parameters',
        timestamp: new Date().toISOString(),
        requestId,
        userId: user.id
      }, 400)
    }
    
    const { page, limit, sort, order } = paginationResult.data
    
    // Filter portfolios by user
    const userPortfolios = Array.from(portfolios.values())
      .filter(portfolio => portfolio.userId === user.id)
    
    // Sort portfolios
    userPortfolios.sort((a, b) => {
      const aValue = a[sort as keyof Portfolio]
      const bValue = b[sort as keyof Portfolio]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })
    
    // Paginate results
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPortfolios = userPortfolios.slice(startIndex, endIndex)
    
    // Track usage
    const duration = Date.now() - startTime
    trackUsage(
      user.id,
      '/api/portfolios',
      'GET',
      duration,
      200,
      0,
      JSON.stringify(paginatedPortfolios).length,
      request.headers.get('user-agent') || 'unknown',
      request.ip || 'unknown',
      ['portfolio_listing']
    )
    
    return createPaginatedResponse(
      paginatedPortfolios,
      {
        page,
        limit,
        total: userPortfolios.length
      },
      'Portfolios retrieved successfully'
    )
    
  } catch (error) {
    console.error('Get portfolios error:', error)
    
    const duration = Date.now() - startTime
    trackUsage(
      user.id,
      '/api/portfolios',
      'GET',
      duration,
      500,
      0,
      0,
      request.headers.get('user-agent') || 'unknown',
      request.ip || 'unknown',
      ['portfolio_listing']
    )
    
    return createErrorResponse({
      code: 'INTERNAL_ERROR',
      message: 'Failed to retrieve portfolios',
      timestamp: new Date().toISOString(),
      requestId,
      userId: user.id
    }, 500)
  }
}

// POST /api/portfolios - Create portfolio
async function handleCreatePortfolio(
  request: NextRequest,
  user: AuthUser
): Promise<NextResponse> {
  const startTime = Date.now()
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID()
  
  try {
    // Check usage limits
    if (!checkUsageLimit(user, 'portfolios', 1)) {
      return createErrorResponse({
        code: 'USAGE_LIMIT_EXCEEDED',
        message: 'Portfolio limit exceeded',
        timestamp: new Date().toISOString(),
        requestId,
        userId: user.id
      }, 429)
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = CreatePortfolioRequestSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
          requestId
        },
        { status: 400 }
      )
    }

    const portfolioData = validationResult.data

    // Create new portfolio
    const portfolio: Portfolio = {
      id: (nextId++).toString(),
      userId: user.id,
      title: portfolioData.title,
      description: portfolioData.description,
      template: portfolioData.template,
      content: portfolioData.content || {},
      settings: portfolioData.settings || {
        theme: 'light',
        colors: ['#3B82F6', '#1E40AF'],
        fonts: ['Inter', 'Roboto'],
        animations: true,
        responsive: true
      },
      status: 'draft',
      visibility: portfolioData.visibility || 'private',
      seo: portfolioData.seo || {
        title: portfolioData.title,
        description: portfolioData.description,
        keywords: []
      },
      analytics: {
        views: 0,
        uniqueViews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      customDomain: portfolioData.customDomain
    }

    // Save portfolio
    portfolios.set(portfolio.id, portfolio)
    
    // Update user usage
    user.usage.portfolios++

    // Track usage
    const duration = Date.now() - startTime
    trackUsage(
      user.id,
      '/api/portfolios',
      'POST',
      duration,
      201,
      JSON.stringify(body).length,
      JSON.stringify(portfolio).length,
      request.headers.get('user-agent') || 'unknown',
      request.ip || 'unknown',
      ['portfolio_creation']
    )

    return createSuccessResponse(portfolio, 'Portfolio created successfully', 201)
    
  } catch (error) {
    console.error('Create portfolio error:', error)
    
    const duration = Date.now() - startTime
    trackUsage(
      user.id,
      '/api/portfolios',
      'POST',
      duration,
      500,
      0,
      0,
      request.headers.get('user-agent') || 'unknown',
      request.ip || 'unknown',
      ['portfolio_creation']
    )

    return createErrorResponse({
      code: 'CREATION_FAILED',
      message: 'Failed to create portfolio',
      timestamp: new Date().toISOString(),
      requestId,
      userId: user.id
    }, 500)
  }
}

// Export handlers
export const GET = withAuth(handleGetPortfolios, {
  requiredRole: 'user',
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100
  }
})

export const POST = withAuth(handleCreatePortfolio, {
  requiredRole: 'user',
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 10
  }
})

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
      'Access-Control-Max-Age': '86400'
    }
  })
}