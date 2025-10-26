/**
 * Integration tests for Portfolio Health API endpoints
 */

import { NextRequest } from "next/server";
import { GET as GET_HEALTH } from "../../portfolio/health/route";
import { POST as POST_RECOMPUTE } from "../../portfolio/health/recompute/route";

// Mock the database connection
jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(() =>
    Promise.resolve({
      db: {
        collection: jest.fn(() => ({
          findOne: jest.fn(),
          find: jest.fn(() => ({
            toArray: jest.fn(),
          })),
          updateOne: jest.fn(),
        })),
      },
    }),
  ),
}));

// Mock the portfolio health service
jest.mock("@/services/portfolioHealthService", () => ({
  portfolioHealthService: {
    computePortfolioHealth: jest.fn(),
  },
}));

describe("Portfolio Health API Integration Tests", () => {
  const mockUser = {
    _id: "user-123",
    name: "John Doe",
    email: "john@example.com",
  };

  const mockPortfolio = {
    _id: "portfolio-123",
    userId: "user-123",
    name: "John Doe Portfolio",
    description: "Full-stack developer portfolio",
    isPublished: true,
    templateId: "template-1",
    config: {},
    healthJson: null,
  };

  const mockProjects = [
    {
      _id: "project-1",
      name: "E-commerce App",
      description: "Full-stack e-commerce application",
      technologies: ["React", "Node.js", "MongoDB"],
      domain: "web-development",
      imageUrl: "project1.jpg",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/user/project1",
      featured: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
  ];

  const mockHealthScore = {
    overall: 75,
    status: "Good",
    breakdown: {
      technicalSkills: 80,
      projectQuality: 70,
      portfolioPresentation: 75,
      experience: 70,
      industryAlignment: 80,
      certifications: 60,
    },
    recommendedImprovements: [
      "Add more diverse technologies",
      "Include live demos for all projects",
    ],
    lastComputedAt: "2024-01-22T12:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PORTFOLIO_HEALTH_ENABLED = "true";
  });

  describe("GET /api/portfolio/health", () => {
    it("should return health score for active portfolio", async () => {
      const { connectToDatabase } = require("@/lib/mongodb");
      const {
        portfolioHealthService,
      } = require("@/services/portfolioHealthService");

      const mockDb = {
        collection: jest.fn(() => ({
          findOne: jest
            .fn()
            .mockResolvedValueOnce(mockPortfolio) // portfolio
            .mockResolvedValueOnce(mockUser), // user
          find: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue(mockProjects),
          })),
        })),
      };

      connectToDatabase.mockResolvedValue({ db: mockDb });
      portfolioHealthService.computePortfolioHealth.mockResolvedValue(
        mockHealthScore,
      );

      const request = new NextRequest(
        "http://localhost:3000/api/portfolio/health",
        {
          method: "GET",
          headers: {
            "user-id": "user-123",
          },
        },
      );

      const response = await GET_HEALTH(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(mockHealthScore);
    });

    it("should return 404 if no active portfolio found", async () => {
      const { connectToDatabase } = require("@/lib/mongodb");

      const mockDb = {
        collection: jest.fn(() => ({
          findOne: jest.fn().mockResolvedValue(null),
        })),
      };

      connectToDatabase.mockResolvedValue({ db: mockDb });

      const request = new NextRequest(
        "http://localhost:3000/api/portfolio/health",
        {
          method: "GET",
          headers: {
            "user-id": "user-123",
          },
        },
      );

      const response = await GET_HEALTH(request);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.error).toBe("No active portfolio found");
    });

    it("should return 403 if feature is disabled", async () => {
      process.env.PORTFOLIO_HEALTH_ENABLED = "false";

      const request = new NextRequest(
        "http://localhost:3000/api/portfolio/health",
        {
          method: "GET",
          headers: {
            "user-id": "user-123",
          },
        },
      );

      const response = await GET_HEALTH(request);
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.success).toBe(false);
      expect(body.error).toBe("Portfolio health feature is not enabled");
    });
  });

  describe("POST /api/portfolio/health/recompute", () => {
    it("should recompute health score and return new data", async () => {
      const { connectToDatabase } = require("@/lib/mongodb");
      const {
        portfolioHealthService,
      } = require("@/services/portfolioHealthService");

      const mockDb = {
        collection: jest.fn(() => ({
          findOne: jest
            .fn()
            .mockResolvedValueOnce(mockPortfolio) // portfolio
            .mockResolvedValueOnce(mockUser), // user
          find: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue(mockProjects),
          })),
          updateOne: jest.fn().mockResolvedValue({}),
        })),
      };

      connectToDatabase.mockResolvedValue({ db: mockDb });
      portfolioHealthService.computePortfolioHealth.mockResolvedValue(
        mockHealthScore,
      );

      const request = new NextRequest(
        "http://localhost:3000/api/portfolio/health/recompute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-id": "user-123",
          },
          body: JSON.stringify({}),
        },
      );

      const response = await POST_RECOMPUTE(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(mockHealthScore);
      expect(body.message).toBe("Portfolio health recomputed successfully");
    });

    it("should recompute for specific portfolio ID", async () => {
      const { connectToDatabase } = require("@/lib/mongodb");
      const {
        portfolioHealthService,
      } = require("@/services/portfolioHealthService");

      const mockDb = {
        collection: jest.fn(() => ({
          findOne: jest
            .fn()
            .mockResolvedValueOnce(mockPortfolio) // portfolio by ID
            .mockResolvedValueOnce(mockUser), // user
          find: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue(mockProjects),
          })),
          updateOne: jest.fn().mockResolvedValue({}),
        })),
      };

      connectToDatabase.mockResolvedValue({ db: mockDb });
      portfolioHealthService.computePortfolioHealth.mockResolvedValue(
        mockHealthScore,
      );

      const request = new NextRequest(
        "http://localhost:3000/api/portfolio/health/recompute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-id": "user-123",
          },
          body: JSON.stringify({ portfolioId: "portfolio-123" }),
        },
      );

      const response = await POST_RECOMPUTE(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
    });

    it("should return 404 if portfolio not found", async () => {
      const { connectToDatabase } = require("@/lib/mongodb");

      const mockDb = {
        collection: jest.fn(() => ({
          findOne: jest.fn().mockResolvedValue(null),
        })),
      };

      connectToDatabase.mockResolvedValue({ db: mockDb });

      const request = new NextRequest(
        "http://localhost:3000/api/portfolio/health/recompute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-id": "user-123",
          },
          body: JSON.stringify({}),
        },
      );

      const response = await POST_RECOMPUTE(request);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.error).toBe("Portfolio not found");
    });
  });
});
