import { NextRequest } from 'next/server'
import { GET, POST } from '../../portfolios/route'
import { GET as GET_ID, PUT, DELETE, PATCH } from '../../portfolios/[id]/route'
import { AuthUser } from '../../../../lib/api/types'

// Mock the middleware
jest.mock('../../../../lib/api/middleware', () => ({
  withAuth: (handler: any) => handler,
  createErrorResponse: jest.fn((error) => ({
    status: 400,
    body: JSON.stringify({ success: false, error: error.message })
  })),
  createSuccessResponse: jest.fn((data, message, status = 200) => ({
    status,
    body: JSON.stringify({ success: true, data, message })
  })),
  createPaginatedResponse: jest.fn((data, pagination, message) => ({
    status: 200,
    body: JSON.stringify({ 
      success: true, 
      data, 
      pagination,
      message 
    })
  })),
  trackUsage: jest.fn(),
  checkUsageLimit: jest.fn(() => true)
}))

describe('/api/portfolios Integration Tests', () => {
  const mockUser: AuthUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    limits: {
      portfolios: 10,
      exports: 5,
      apiCalls: 100,
      storage: 1000
    },
    usage: {
      portfolios: 2,
      exports: 1,
      apiCalls: 10,
      storage: 100
    }
  }

  const validPortfolioData = {
    title: 'My Portfolio',
    description: 'A showcase of my work and skills',
    template: 'modern',
    settings: {
      theme: 'light',
      colors: ['#3B82F6', '#1E40AF'],
      fonts: ['Inter', 'Roboto'],
      animations: true,
      responsive: true
    },
    visibility: 'private'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/portfolios', () => {
    it('should list portfolios with pagination', async () => {
      const request = new NextRequest('http://localhost:3000/api/portfolios?page=1&limit=10', {
        method: 'GET',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await GET(request, { user: mockUser })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data).toBeDefined()
      expect(body.pagination).toBeDefined()
      expect(body.pagination.page).toBe(1)
      expect(body.pagination.limit).toBe(10)
    })

    it('should handle pagination parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/portfolios?page=2&limit=5&sort=title&order=asc', {
        method: 'GET',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await GET(request, { user: mockUser })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.pagination.page).toBe(2)
      expect(body.pagination.limit).toBe(5)
    })

    it('should return validation error for invalid pagination', async () => {
      const request = new NextRequest('http://localhost:3000/api/portfolios?page=0&limit=200', {
        method: 'GET',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await GET(request, { user: mockUser })
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.success).toBe(false)
      expect(body.code).toBe('INVALID_PAGINATION')
    })
  })

  describe('POST /api/portfolios', () => {
    it('should create portfolio successfully', async () => {
      const request = new NextRequest('http://localhost:3000/api/portfolios', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer valid-token'
        },
        body: JSON.stringify(validPortfolioData)
      })

      const response = await POST(request, { user: mockUser })
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.success).toBe(true)
      expect(body.data).toHaveProperty('id')
      expect(body.data.title).toBe(validPortfolioData.title)
      expect(body.data.userId).toBe(mockUser.id)
      expect(body.data.status).toBe('draft')
    })

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        title: '', // Invalid: empty title
        description: 'Valid description',
        template: 'modern'
      }

      const request = new NextRequest('http://localhost:3000/api/portfolios', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer valid-token'
        },
        body: JSON.stringify(invalidData)
      })

      const response = await POST(request, { user: mockUser })
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.success).toBe(false)
      expect(body.code).toBe('VALIDATION_ERROR')
    })

    it('should return error when portfolio limit exceeded', async () => {
      const { checkUsageLimit } = require('../../../../lib/api/middleware')
      checkUsageLimit.mockReturnValue(false)

      const request = new NextRequest('http://localhost:3000/api/portfolios', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer valid-token'
        },
        body: JSON.stringify(validPortfolioData)
      })

      const response = await POST(request, { user: mockUser })
      const body = await response.json()

      expect(response.status).toBe(429)
      expect(body.success).toBe(false)
      expect(body.code).toBe('USAGE_LIMIT_EXCEEDED')
    })

    it('should create portfolio with default settings', async () => {
      const minimalData = {
        title: 'Minimal Portfolio',
        description: 'A minimal portfolio',
        template: 'modern'
      }

      const request = new NextRequest('http://localhost:3000/api/portfolios', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer valid-token'
        },
        body: JSON.stringify(minimalData)
      })

      const response = await POST(request, { user: mockUser })
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.success).toBe(true)
      expect(body.data.settings).toBeDefined()
      expect(body.data.settings.theme).toBe('light')
      expect(body.data.settings.colors).toEqual(['#3B82F6', '#1E40AF'])
    })
  })

  describe('GET /api/portfolios/[id]', () => {
    it('should get portfolio by ID', async () => {
      const portfolioId = '1'
      const request = new NextRequest(`http://localhost:3000/api/portfolios/${portfolioId}`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await GET_ID(request, { user: mockUser }, { params: { id: portfolioId } })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data).toHaveProperty('id', portfolioId)
    })

    it('should return 404 for non-existent portfolio', async () => {
      const portfolioId = 'non-existent'
      const request = new NextRequest(`http://localhost:3000/api/portfolios/${portfolioId}`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await GET_ID(request, { user: mockUser }, { params: { id: portfolioId } })
      const body = await response.json()

      expect(response.status).toBe(404)
      expect(body.success).toBe(false)
      expect(body.code).toBe('PORTFOLIO_NOT_FOUND')
    })

    it('should return 403 for unauthorized access', async () => {
      const portfolioId = 'other-user-portfolio'
      const request = new NextRequest(`http://localhost:3000/api/portfolios/${portfolioId}`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await GET_ID(request, { user: mockUser }, { params: { id: portfolioId } })
      const body = await response.json()

      expect(response.status).toBe(403)
      expect(body.success).toBe(false)
      expect(body.code).toBe('ACCESS_DENIED')
    })

    it('should increment view count for public portfolios', async () => {
      const portfolioId = 'public-portfolio'
      const request = new NextRequest(`http://localhost:3000/api/portfolios/${portfolioId}`, {
        method: 'GET',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await GET_ID(request, { user: mockUser }, { params: { id: portfolioId } })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      // View count should be incremented for public portfolios
    })
  })

  describe('PUT /api/portfolios/[id]', () => {
    it('should update portfolio successfully', async () => {
      const portfolioId = '1'
      const updateData = {
        title: 'Updated Portfolio',
        description: 'Updated description'
      }

      const request = new NextRequest(`http://localhost:3000/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer valid-token'
        },
        body: JSON.stringify(updateData)
      })

      const response = await PUT(request, { user: mockUser }, { params: { id: portfolioId } })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data.title).toBe(updateData.title)
      expect(body.data.description).toBe(updateData.description)
    })

    it('should return 404 for non-existent portfolio', async () => {
      const portfolioId = 'non-existent'
      const updateData = { title: 'Updated Title' }

      const request = new NextRequest(`http://localhost:3000/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer valid-token'
        },
        body: JSON.stringify(updateData)
      })

      const response = await PUT(request, { user: mockUser }, { params: { id: portfolioId } })
      const body = await response.json()

      expect(response.status).toBe(404)
      expect(body.success).toBe(false)
      expect(body.code).toBe('PORTFOLIO_NOT_FOUND')
    })

    it('should return 403 for unauthorized access', async () => {
      const portfolioId = 'other-user-portfolio'
      const updateData = { title: 'Updated Title' }

      const request = new NextRequest(`http://localhost:3000/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer valid-token'
        },
        body: JSON.stringify(updateData)
      })

      const response = await PUT(request, { user: mockUser }, { params: { id: portfolioId } })
      const body = await response.json()

      expect(response.status).toBe(403)
      expect(body.success).toBe(false)
      expect(body.code).toBe('ACCESS_DENIED')
    })
  })

  describe('DELETE /api/portfolios/[id]', () => {
    it('should delete portfolio successfully', async () => {
      const portfolioId = '1'
      const request = new NextRequest(`http://localhost:3000/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await DELETE(request, { user: mockUser }, { params: { id: portfolioId } })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data).toBeNull()
    })

    it('should return 404 for non-existent portfolio', async () => {
      const portfolioId = 'non-existent'
      const request = new NextRequest(`http://localhost:3000/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await DELETE(request, { user: mockUser }, { params: { id: portfolioId } })
      const body = await response.json()

      expect(response.status).toBe(404)
      expect(body.success).toBe(false)
      expect(body.code).toBe('PORTFOLIO_NOT_FOUND')
    })
  })

  describe('PATCH /api/portfolios/[id]/publish', () => {
    it('should publish portfolio successfully', async () => {
      const portfolioId = '1'
      const request = new NextRequest(`http://localhost:3000/api/portfolios/${portfolioId}/publish`, {
        method: 'PATCH',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await PATCH(request, { user: mockUser }, { params: { id: portfolioId } })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data.status).toBe('published')
      expect(body.data.publishedAt).toBeDefined()
    })

    it('should return 404 for non-existent portfolio', async () => {
      const portfolioId = 'non-existent'
      const request = new NextRequest(`http://localhost:3000/api/portfolios/${portfolioId}/publish`, {
        method: 'PATCH',
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await PATCH(request, { user: mockUser }, { params: { id: portfolioId } })
      const body = await response.json()

      expect(response.status).toBe(404)
      expect(body.success).toBe(false)
      expect(body.code).toBe('PORTFOLIO_NOT_FOUND')
    })
  })
})
