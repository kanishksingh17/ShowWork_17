// API Documentation and Usage Examples

import { NextRequest, NextResponse } from "next/server";
import { withAuth, createSuccessResponse } from "../../../lib/api/middleware";
import { AuthUser } from "../../../lib/api/types";

// API Documentation endpoint
async function handleApiDocumentation(
  request: NextRequest,
  user: AuthUser,
): Promise<NextResponse> {
  const documentation = {
    title: "Portfolio Builder API",
    version: "1.0.0",
    description:
      "Comprehensive API for AI-powered portfolio generation, management, and preview",
    baseUrl: "https://api.portfoliobuilder.com",
    authentication: {
      type: "Bearer Token",
      description: "Include your JWT token in the Authorization header",
      example: "Authorization: Bearer your-jwt-token",
    },
    rateLimits: {
      default: "100 requests per 15 minutes",
      generate: "50 requests per 15 minutes",
      preview: "100 requests per 15 minutes",
      portfolios: "100 requests per 15 minutes",
    },
    endpoints: {
      "/api/generate": {
        method: "POST",
        description: "Generate AI-powered content for portfolio sections",
        authentication: "Required",
        rateLimit: "50 requests per 15 minutes",
        requestBody: {
          type: "object",
          required: ["type", "userProfile"],
          properties: {
            type: {
              type: "string",
              enum: [
                "hero",
                "about",
                "skills",
                "projects",
                "contact",
                "testimonials",
                "blog",
                "seo",
              ],
              description: "Type of content to generate",
            },
            userProfile: {
              type: "object",
              required: ["name", "role", "industry", "experience", "skills"],
              properties: {
                name: { type: "string", minLength: 1, maxLength: 100 },
                role: { type: "string", minLength: 1, maxLength: 50 },
                industry: { type: "string", minLength: 1, maxLength: 50 },
                experience: { type: "number", minimum: 0, maximum: 50 },
                skills: {
                  type: "array",
                  items: { type: "string" },
                  minItems: 1,
                  maxItems: 20,
                },
                projects: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      technologies: {
                        type: "array",
                        items: { type: "string" },
                      },
                      url: { type: "string", format: "uri" },
                    },
                  },
                },
                style: {
                  type: "string",
                  enum: ["professional", "creative", "minimalist", "modern"],
                },
                colorPreferences: {
                  type: "array",
                  items: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
                },
                language: { type: "string", pattern: "^[a-z]{2}$" },
              },
            },
            context: {
              type: "object",
              properties: {
                existingContent: { type: "string", maxLength: 5000 },
                targetAudience: { type: "string", maxLength: 200 },
                tone: {
                  type: "string",
                  enum: ["formal", "casual", "friendly", "authoritative"],
                },
                length: { type: "string", enum: ["short", "medium", "long"] },
              },
            },
          },
        },
        response: {
          success: true,
          data: {
            content: "string",
            metadata: {
              wordCount: "number",
              readingTime: "number",
              keywords: "array",
              suggestions: "array",
              confidence: "number",
            },
            alternatives: "array (optional)",
          },
          message: "Content generated successfully",
          timestamp: "string",
          requestId: "string",
        },
        examples: {
          request: {
            type: "hero",
            userProfile: {
              name: "John Doe",
              role: "Full Stack Developer",
              industry: "Technology",
              experience: 5,
              skills: ["React", "Node.js", "TypeScript", "Python"],
              style: "professional",
              colorPreferences: ["#3B82F6", "#1E40AF"],
            },
            context: {
              tone: "professional",
              length: "medium",
            },
          },
          response: {
            success: true,
            data: {
              content:
                "Building Digital Experiences That Matter\n\nI'm John Doe, a Full Stack Developer with 5 years of experience creating scalable web applications. I specialize in React, Node.js, TypeScript, and Python, helping businesses transform their ideas into powerful digital solutions.\n\nLet's build something amazing together.",
              metadata: {
                wordCount: 45,
                readingTime: 1,
                keywords: [
                  "developer",
                  "web applications",
                  "React",
                  "Node.js",
                  "TypeScript",
                  "Python",
                ],
                suggestions: [
                  "Consider adding specific achievements or metrics",
                  "Include a call-to-action",
                ],
                confidence: 92,
              },
            },
            message: "Content generated successfully",
            timestamp: "2024-01-15T10:30:00Z",
            requestId: "req_123456789",
          },
        },
      },
      "/api/portfolios": {
        method: "GET",
        description: "List user portfolios with pagination",
        authentication: "Required",
        rateLimit: "100 requests per 15 minutes",
        queryParameters: {
          page: { type: "number", minimum: 1, default: 1 },
          limit: { type: "number", minimum: 1, maximum: 100, default: 20 },
          sort: {
            type: "string",
            enum: ["createdAt", "updatedAt", "title", "views"],
            default: "createdAt",
          },
          order: { type: "string", enum: ["asc", "desc"], default: "desc" },
        },
        response: {
          success: true,
          data: "array of portfolio objects",
          pagination: {
            page: "number",
            limit: "number",
            total: "number",
            totalPages: "number",
            hasNext: "boolean",
            hasPrev: "boolean",
          },
          message: "Portfolios retrieved successfully",
          timestamp: "string",
          requestId: "string",
        },
      },
      "/api/portfolios": {
        method: "POST",
        description: "Create a new portfolio",
        authentication: "Required",
        rateLimit: "10 requests per 15 minutes",
        requestBody: {
          type: "object",
          required: ["title", "description", "template"],
          properties: {
            title: { type: "string", minLength: 1, maxLength: 100 },
            description: { type: "string", minLength: 1, maxLength: 500 },
            template: { type: "string", minLength: 1, maxLength: 50 },
            content: { type: "object" },
            settings: {
              type: "object",
              properties: {
                theme: { type: "string" },
                colors: {
                  type: "array",
                  items: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
                },
                fonts: { type: "array", items: { type: "string" } },
                animations: { type: "boolean" },
                responsive: { type: "boolean" },
              },
            },
            visibility: {
              type: "string",
              enum: ["public", "private", "unlisted"],
              default: "private",
            },
            seo: {
              type: "object",
              properties: {
                title: { type: "string", maxLength: 60 },
                description: { type: "string", maxLength: 160 },
                keywords: { type: "array", items: { type: "string" } },
                ogImage: { type: "string", format: "uri" },
              },
            },
            customDomain: { type: "string", maxLength: 100 },
          },
        },
        response: {
          success: true,
          data: "portfolio object",
          message: "Portfolio created successfully",
          timestamp: "string",
          requestId: "string",
        },
      },
      "/api/portfolios/[id]": {
        method: "GET",
        description: "Get a specific portfolio by ID",
        authentication: "Required",
        rateLimit: "200 requests per 15 minutes",
        pathParameters: {
          id: { type: "string", format: "uuid", description: "Portfolio ID" },
        },
        response: {
          success: true,
          data: "portfolio object",
          message: "Portfolio retrieved successfully",
          timestamp: "string",
          requestId: "string",
        },
      },
      "/api/portfolios/[id]": {
        method: "PUT",
        description: "Update a specific portfolio",
        authentication: "Required",
        rateLimit: "50 requests per 15 minutes",
        pathParameters: {
          id: { type: "string", format: "uuid", description: "Portfolio ID" },
        },
        requestBody: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 1, maxLength: 100 },
            description: { type: "string", minLength: 1, maxLength: 500 },
            template: { type: "string", minLength: 1, maxLength: 50 },
            content: { type: "object" },
            settings: { type: "object" },
            visibility: {
              type: "string",
              enum: ["public", "private", "unlisted"],
            },
            seo: { type: "object" },
            customDomain: { type: "string", maxLength: 100 },
          },
        },
        response: {
          success: true,
          data: "updated portfolio object",
          message: "Portfolio updated successfully",
          timestamp: "string",
          requestId: "string",
        },
      },
      "/api/portfolios/[id]": {
        method: "DELETE",
        description: "Delete a specific portfolio",
        authentication: "Required",
        rateLimit: "10 requests per 15 minutes",
        pathParameters: {
          id: { type: "string", format: "uuid", description: "Portfolio ID" },
        },
        response: {
          success: true,
          data: null,
          message: "Portfolio deleted successfully",
          timestamp: "string",
          requestId: "string",
        },
      },
      "/api/portfolios/[id]/publish": {
        method: "PATCH",
        description: "Publish a portfolio",
        authentication: "Required",
        rateLimit: "20 requests per 15 minutes",
        pathParameters: {
          id: { type: "string", format: "uuid", description: "Portfolio ID" },
        },
        response: {
          success: true,
          data: "published portfolio object",
          message: "Portfolio published successfully",
          timestamp: "string",
          requestId: "string",
        },
      },
      "/api/preview": {
        method: "POST",
        description: "Generate real-time preview of a portfolio",
        authentication: "Required",
        rateLimit: "100 requests per 15 minutes",
        requestBody: {
          type: "object",
          required: ["portfolioId", "device"],
          properties: {
            portfolioId: { type: "string", format: "uuid" },
            device: {
              type: "object",
              required: ["type", "width", "height", "orientation"],
              properties: {
                type: { type: "string", enum: ["desktop", "tablet", "mobile"] },
                width: { type: "number", minimum: 320, maximum: 3840 },
                height: { type: "number", minimum: 240, maximum: 2160 },
                orientation: {
                  type: "string",
                  enum: ["portrait", "landscape"],
                },
                pixelRatio: {
                  type: "number",
                  minimum: 0.5,
                  maximum: 4,
                  default: 1,
                },
              },
            },
            zoom: { type: "number", minimum: 0.1, maximum: 3, default: 1 },
            pan: {
              type: "object",
              properties: {
                x: {
                  type: "number",
                  minimum: -1000,
                  maximum: 1000,
                  default: 0,
                },
                y: {
                  type: "number",
                  minimum: -1000,
                  maximum: 1000,
                  default: 0,
                },
              },
            },
            options: {
              type: "object",
              properties: {
                includeAssets: { type: "boolean", default: true },
                optimizeImages: { type: "boolean", default: true },
                minifyCode: { type: "boolean", default: true },
                seoOptimized: { type: "boolean", default: true },
                responsive: { type: "boolean", default: true },
                analytics: { type: "boolean", default: false },
              },
            },
          },
        },
        response: {
          success: true,
          data: {
            html: "string",
            css: "string",
            js: "string",
            assets: "array of asset objects",
            metadata: {
              renderTime: "number",
              bundleSize: "number",
              componentCount: "number",
              performanceScore: "number",
            },
            previewUrl: "string",
            expiresAt: "string",
          },
          message: "Preview generated successfully",
          timestamp: "string",
          requestId: "string",
        },
      },
    },
    errorCodes: {
      MISSING_TOKEN: "Authorization token is required",
      INVALID_TOKEN: "Invalid or expired token",
      INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
      VALIDATION_ERROR: "Validation failed",
      RESOURCE_NOT_FOUND: "Resource not found",
      RATE_LIMIT_EXCEEDED: "Rate limit exceeded",
      USAGE_LIMIT_EXCEEDED: "Usage limit exceeded",
      FEATURE_NOT_AVAILABLE: "Feature not available",
      GENERATION_FAILED: "Content generation failed",
      PREVIEW_FAILED: "Preview generation failed",
      INTERNAL_ERROR: "Internal server error",
    },
    statusCodes: {
      200: "Success",
      201: "Created",
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      409: "Conflict",
      429: "Too Many Requests",
      500: "Internal Server Error",
      502: "Bad Gateway",
    },
    examples: {
      "Generate Hero Content": {
        request: {
          method: "POST",
          url: "/api/generate",
          headers: {
            Authorization: "Bearer your-jwt-token",
            "Content-Type": "application/json",
          },
          body: {
            type: "hero",
            userProfile: {
              name: "Jane Smith",
              role: "UX Designer",
              industry: "Design",
              experience: 3,
              skills: ["Figma", "Sketch", "Adobe XD", "User Research"],
              style: "creative",
            },
            context: {
              tone: "friendly",
              length: "medium",
            },
          },
        },
        response: {
          status: 200,
          body: {
            success: true,
            data: {
              content:
                "Creating Beautiful User Experiences\n\nHi, I'm Jane Smith, a passionate UX Designer with 3 years of experience crafting intuitive and engaging digital experiences. I specialize in Figma, Sketch, and Adobe XD, and I love turning complex problems into simple, elegant solutions.\n\nLet's create something amazing together!",
              metadata: {
                wordCount: 52,
                readingTime: 1,
                keywords: [
                  "UX Designer",
                  "digital experiences",
                  "Figma",
                  "Sketch",
                  "Adobe XD",
                ],
                suggestions: [
                  "Consider adding specific project examples",
                  "Include a personal touch",
                ],
                confidence: 89,
              },
            },
            message: "Content generated successfully",
            timestamp: "2024-01-15T10:30:00Z",
            requestId: "req_123456789",
          },
        },
      },
      "Create Portfolio": {
        request: {
          method: "POST",
          url: "/api/portfolios",
          headers: {
            Authorization: "Bearer your-jwt-token",
            "Content-Type": "application/json",
          },
          body: {
            title: "My Portfolio",
            description: "A showcase of my work and skills",
            template: "modern",
            settings: {
              theme: "light",
              colors: ["#3B82F6", "#1E40AF"],
              fonts: ["Inter", "Roboto"],
              animations: true,
              responsive: true,
            },
            visibility: "private",
          },
        },
        response: {
          status: 201,
          body: {
            success: true,
            data: {
              id: "123e4567-e89b-12d3-a456-426614174000",
              userId: "user-123",
              title: "My Portfolio",
              description: "A showcase of my work and skills",
              template: "modern",
              content: {},
              settings: {
                theme: "light",
                colors: ["#3B82F6", "#1E40AF"],
                fonts: ["Inter", "Roboto"],
                animations: true,
                responsive: true,
              },
              status: "draft",
              visibility: "private",
              seo: {
                title: "My Portfolio",
                description: "A showcase of my work and skills",
                keywords: [],
              },
              analytics: {
                views: 0,
                uniqueViews: 0,
                createdAt: "2024-01-15T10:30:00Z",
                updatedAt: "2024-01-15T10:30:00Z",
              },
            },
            message: "Portfolio created successfully",
            timestamp: "2024-01-15T10:30:00Z",
            requestId: "req_123456789",
          },
        },
      },
      "Generate Preview": {
        request: {
          method: "POST",
          url: "/api/preview",
          headers: {
            Authorization: "Bearer your-jwt-token",
            "Content-Type": "application/json",
          },
          body: {
            portfolioId: "123e4567-e89b-12d3-a456-426614174000",
            device: {
              type: "desktop",
              width: 1200,
              height: 800,
              orientation: "landscape",
              pixelRatio: 1,
            },
            zoom: 1,
            pan: { x: 0, y: 0 },
            options: {
              includeAssets: true,
              optimizeImages: true,
              minifyCode: true,
              seoOptimized: true,
              responsive: true,
              analytics: false,
            },
          },
        },
        response: {
          status: 200,
          body: {
            success: true,
            data: {
              html: "<!DOCTYPE html>...</html>",
              css: "body { font-family: Inter, sans-serif; }...",
              js: 'document.addEventListener("DOMContentLoaded", function() {...});',
              assets: [
                {
                  type: "image",
                  url: "https://example.com/image.jpg",
                  size: 1024000,
                  optimized: true,
                },
              ],
              metadata: {
                renderTime: 25.5,
                bundleSize: 156789,
                componentCount: 12,
                performanceScore: 92,
              },
              previewUrl:
                "https://preview.example.com/123e4567-e89b-12d3-a456-426614174000",
              expiresAt: "2024-01-16T10:30:00Z",
            },
            message: "Preview generated successfully",
            timestamp: "2024-01-15T10:30:00Z",
            requestId: "req_123456789",
          },
        },
      },
    },
    sdk: {
      javascript: {
        installation: "npm install @portfoliobuilder/api-client",
        usage: `
import { PortfolioBuilderAPI } from '@portfoliobuilder/api-client';

const api = new PortfolioBuilderAPI({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.portfoliobuilder.com'
});

// Generate content
const content = await api.generateContent({
  type: 'hero',
  userProfile: {
    name: 'John Doe',
    role: 'Developer',
    industry: 'Technology',
    experience: 5,
    skills: ['React', 'Node.js']
  }
});

// Create portfolio
const portfolio = await api.createPortfolio({
  title: 'My Portfolio',
  description: 'A showcase of my work',
  template: 'modern'
});

// Generate preview
const preview = await api.generatePreview({
  portfolioId: portfolio.id,
  device: {
    type: 'desktop',
    width: 1200,
    height: 800,
    orientation: 'landscape'
  }
});
        `,
      },
      python: {
        installation: "pip install portfoliobuilder-api",
        usage: `
from portfoliobuilder import PortfolioBuilderAPI

api = PortfolioBuilderAPI(api_key='your-api-key')

# Generate content
content = api.generate_content(
    type='hero',
    user_profile={
        'name': 'John Doe',
        'role': 'Developer',
        'industry': 'Technology',
        'experience': 5,
        'skills': ['React', 'Node.js']
    }
)

# Create portfolio
portfolio = api.create_portfolio(
    title='My Portfolio',
    description='A showcase of my work',
    template='modern'
)

# Generate preview
preview = api.generate_preview(
    portfolio_id=portfolio['id'],
    device={
        'type': 'desktop',
        'width': 1200,
        'height': 800,
        'orientation': 'landscape'
    }
)
        `,
      },
    },
  };

  return createSuccessResponse(
    documentation,
    "API documentation retrieved successfully",
  );
}

// Export the handler
export const GET = withAuth(handleApiDocumentation, {
  requiredRole: "user",
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 10,
  },
});

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Request-ID",
      "Access-Control-Max-Age": "86400",
    },
  });
}
