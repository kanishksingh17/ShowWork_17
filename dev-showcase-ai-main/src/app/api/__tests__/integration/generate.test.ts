import { NextRequest } from "next/server";
import { POST } from "../../generate/route";
import { AuthUser } from "../../../../lib/api/types";

// Mock the middleware
jest.mock("../../../../lib/api/middleware", () => ({
  withAuth: (handler: any) => handler,
  createErrorResponse: jest.fn((error) => ({
    status: 400,
    body: JSON.stringify({ success: false, error: error.message }),
  })),
  createSuccessResponse: jest.fn((data, message) => ({
    status: 200,
    body: JSON.stringify({ success: true, data, message }),
  })),
  trackUsage: jest.fn(),
  checkUsageLimit: jest.fn(() => true),
  hasFeatureAccess: jest.fn(() => true),
}));

// Mock OpenAI
jest.mock("openai", () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: "Generated content for the hero section",
              },
            },
          ],
        }),
      },
    },
  })),
}));

describe("/api/generate Integration Tests", () => {
  const mockUser: AuthUser = {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
    role: "user",
    subscription: {
      plan: "pro",
      expiresAt: "2024-12-31T23:59:59Z",
      features: ["ai_content_generation"],
    },
    limits: {
      portfolios: 10,
      exports: 5,
      apiCalls: 100,
      storage: 1000,
    },
    usage: {
      portfolios: 2,
      exports: 1,
      apiCalls: 10,
      storage: 100,
    },
  };

  const validRequestBody = {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/generate", () => {
    it("should generate content successfully", async () => {
      const request = new NextRequest("http://localhost:3000/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer valid-token",
        },
        body: JSON.stringify(validRequestBody),
      });

      const response = await POST(request, { user: mockUser });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty("content");
      expect(body.data).toHaveProperty("metadata");
      expect(body.data.metadata).toHaveProperty("wordCount");
      expect(body.data.metadata).toHaveProperty("readingTime");
      expect(body.data.metadata).toHaveProperty("keywords");
      expect(body.data.metadata).toHaveProperty("confidence");
    });

    it("should return validation error for invalid request body", async () => {
      const invalidRequestBody = {
        type: "invalid_type",
        userProfile: {
          name: "", // Invalid: empty name
          role: "Developer",
          industry: "Technology",
          experience: 5,
          skills: [],
        },
      };

      const request = new NextRequest("http://localhost:3000/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer valid-token",
        },
        body: JSON.stringify(invalidRequestBody),
      });

      const response = await POST(request, { user: mockUser });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.code).toBe("VALIDATION_ERROR");
    });

    it("should return error when usage limit exceeded", async () => {
      const { checkUsageLimit } = require("../../../../lib/api/middleware");
      checkUsageLimit.mockReturnValue(false);

      const request = new NextRequest("http://localhost:3000/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer valid-token",
        },
        body: JSON.stringify(validRequestBody),
      });

      const response = await POST(request, { user: mockUser });
      const body = await response.json();

      expect(response.status).toBe(429);
      expect(body.success).toBe(false);
      expect(body.code).toBe("USAGE_LIMIT_EXCEEDED");
    });

    it("should return error when feature not available", async () => {
      const { hasFeatureAccess } = require("../../../../lib/api/middleware");
      hasFeatureAccess.mockReturnValue(false);

      const request = new NextRequest("http://localhost:3000/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer valid-token",
        },
        body: JSON.stringify(validRequestBody),
      });

      const response = await POST(request, { user: mockUser });
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.success).toBe(false);
      expect(body.code).toBe("FEATURE_NOT_AVAILABLE");
    });

    it("should generate different content types", async () => {
      const contentTypes = [
        "hero",
        "about",
        "skills",
        "projects",
        "contact",
        "testimonials",
        "blog",
        "seo",
      ];

      for (const type of contentTypes) {
        const requestBody = {
          ...validRequestBody,
          type,
        };

        const request = new NextRequest("http://localhost:3000/api/generate", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "Bearer valid-token",
          },
          body: JSON.stringify(requestBody),
        });

        const response = await POST(request, { user: mockUser });
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data.content).toBeTruthy();
      }
    });

    it("should handle OpenAI API errors", async () => {
      const { OpenAI } = require("openai");
      const mockOpenAI = new OpenAI();
      mockOpenAI.chat.completions.create.mockRejectedValue(
        new Error("OpenAI API error"),
      );

      const request = new NextRequest("http://localhost:3000/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer valid-token",
        },
        body: JSON.stringify(validRequestBody),
      });

      const response = await POST(request, { user: mockUser });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.success).toBe(false);
      expect(body.code).toBe("GENERATION_FAILED");
    });

    it("should generate alternatives for long content", async () => {
      const requestBody = {
        ...validRequestBody,
        context: {
          ...validRequestBody.context,
          length: "long",
        },
      };

      const request = new NextRequest("http://localhost:3000/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer valid-token",
        },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request, { user: mockUser });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.alternatives).toBeDefined();
      expect(Array.isArray(body.data.alternatives)).toBe(true);
    });

    it("should track usage analytics", async () => {
      const { trackUsage } = require("../../../../lib/api/middleware");

      const request = new NextRequest("http://localhost:3000/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer valid-token",
          "user-agent": "test-agent",
        },
        body: JSON.stringify(validRequestBody),
      });

      await POST(request, { user: mockUser });

      expect(trackUsage).toHaveBeenCalledWith(
        mockUser.id,
        "/api/generate",
        "POST",
        expect.any(Number),
        200,
        expect.any(Number),
        expect.any(Number),
        "test-agent",
        "unknown",
        ["ai_content_generation", "hero"],
      );
    });

    it("should handle different user profiles", async () => {
      const differentProfiles = [
        {
          name: "Jane Smith",
          role: "UX Designer",
          industry: "Design",
          experience: 3,
          skills: ["Figma", "Sketch", "Adobe XD"],
          style: "creative",
        },
        {
          name: "Bob Johnson",
          role: "Data Scientist",
          industry: "Finance",
          experience: 8,
          skills: ["Python", "R", "SQL", "Machine Learning"],
          style: "professional",
        },
      ];

      for (const profile of differentProfiles) {
        const requestBody = {
          ...validRequestBody,
          userProfile: profile,
        };

        const request = new NextRequest("http://localhost:3000/api/generate", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "Bearer valid-token",
          },
          body: JSON.stringify(requestBody),
        });

        const response = await POST(request, { user: mockUser });
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data.content).toContain(profile.name);
      }
    });

    it("should handle different context options", async () => {
      const contextOptions = [
        { tone: "formal", length: "short" },
        { tone: "casual", length: "medium" },
        { tone: "friendly", length: "long" },
        { tone: "authoritative", length: "medium" },
      ];

      for (const context of contextOptions) {
        const requestBody = {
          ...validRequestBody,
          context,
        };

        const request = new NextRequest("http://localhost:3000/api/generate", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "Bearer valid-token",
          },
          body: JSON.stringify(requestBody),
        });

        const response = await POST(request, { user: mockUser });
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data.content).toBeTruthy();
      }
    });
  });
});
