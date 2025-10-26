import { NextRequest } from "next/server";
import {
  authenticate,
  rateLimit,
  authorize,
  hasFeatureAccess,
  checkUsageLimit,
  createErrorResponse,
  createSuccessResponse,
  createPaginatedResponse,
  withAuth,
} from "../middleware";
import { AuthUser } from "../types";

// Mock jose
jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

// Mock crypto
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: jest.fn(() => "test-uuid"),
  },
});

describe("Authentication Middleware", () => {
  const mockUser: AuthUser = {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
    role: "user",
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticate", () => {
    it("should authenticate user with valid token", async () => {
      const { jwtVerify } = require("jose");
      jwtVerify.mockResolvedValue({ payload: mockUser });

      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: {
          authorization: "Bearer valid-token",
        },
      });

      const result = await authenticate(request);

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeUndefined();
    });

    it("should return error for missing token", async () => {
      const request = new NextRequest("http://localhost:3000/api/test");

      const result = await authenticate(request);

      expect(result.user).toEqual({});
      expect(result.error?.code).toBe("MISSING_TOKEN");
    });

    it("should return error for invalid token", async () => {
      const { jwtVerify } = require("jose");
      jwtVerify.mockRejectedValue(new Error("Invalid token"));

      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: {
          authorization: "Bearer invalid-token",
        },
      });

      const result = await authenticate(request);

      expect(result.user).toEqual({});
      expect(result.error?.code).toBe("INVALID_TOKEN");
    });
  });

  describe("rateLimit", () => {
    it("should allow request within rate limit", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: {
          "x-forwarded-for": "192.168.1.1",
        },
      });

      const result = rateLimit(request, { max: 100 });

      expect(result.allowed).toBe(true);
      expect(result.info.remaining).toBe(99);
    });

    it("should reject request exceeding rate limit", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: {
          "x-forwarded-for": "192.168.1.1",
        },
      });

      // Make multiple requests to exceed limit
      for (let i = 0; i < 100; i++) {
        rateLimit(request, { max: 100 });
      }

      const result = rateLimit(request, { max: 100 });

      expect(result.allowed).toBe(false);
      expect(result.error?.code).toBe("RATE_LIMIT_EXCEEDED");
    });
  });

  describe("authorize", () => {
    it("should authorize user with sufficient role", () => {
      const result = authorize(mockUser, "user");
      expect(result).toBe(true);
    });

    it("should authorize premium user for user role", () => {
      const premiumUser = { ...mockUser, role: "premium" as const };
      const result = authorize(premiumUser, "user");
      expect(result).toBe(true);
    });

    it("should authorize admin user for any role", () => {
      const adminUser = { ...mockUser, role: "admin" as const };
      const result = authorize(adminUser, "premium");
      expect(result).toBe(true);
    });

    it("should not authorize user with insufficient role", () => {
      const result = authorize(mockUser, "premium");
      expect(result).toBe(false);
    });
  });

  describe("hasFeatureAccess", () => {
    it("should grant access to admin users", () => {
      const adminUser = { ...mockUser, role: "admin" as const };
      const result = hasFeatureAccess(adminUser, "premium_feature");
      expect(result).toBe(true);
    });

    it("should grant access to users with feature in subscription", () => {
      const userWithFeature = {
        ...mockUser,
        subscription: {
          plan: "pro" as const,
          expiresAt: "2024-12-31T23:59:59Z",
          features: ["premium_feature"],
        },
      };
      const result = hasFeatureAccess(userWithFeature, "premium_feature");
      expect(result).toBe(true);
    });

    it("should deny access to users without feature", () => {
      const result = hasFeatureAccess(mockUser, "premium_feature");
      expect(result).toBe(false);
    });
  });

  describe("checkUsageLimit", () => {
    it("should allow usage within limits", () => {
      const result = checkUsageLimit(mockUser, "portfolios", 1);
      expect(result).toBe(true);
    });

    it("should deny usage exceeding limits", () => {
      const result = checkUsageLimit(mockUser, "portfolios", 10);
      expect(result).toBe(false);
    });
  });

  describe("Response Helpers", () => {
    describe("createErrorResponse", () => {
      it("should create error response with default status", () => {
        const error = {
          code: "TEST_ERROR",
          message: "Test error",
          timestamp: "2024-01-01T00:00:00Z",
          requestId: "test-id",
        };

        const response = createErrorResponse(error);
        const body = JSON.parse(response.body as string);

        expect(response.status).toBe(400);
        expect(body.success).toBe(false);
        expect(body.error).toBe("Test error");
        expect(body.code).toBe("TEST_ERROR");
      });

      it("should create error response with custom status", () => {
        const error = {
          code: "NOT_FOUND",
          message: "Not found",
          timestamp: "2024-01-01T00:00:00Z",
          requestId: "test-id",
        };

        const response = createErrorResponse(error, 404);
        expect(response.status).toBe(404);
      });
    });

    describe("createSuccessResponse", () => {
      it("should create success response", () => {
        const data = { id: 1, name: "Test" };
        const response = createSuccessResponse(data, "Success message");

        const body = JSON.parse(response.body as string);

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data).toEqual(data);
        expect(body.message).toBe("Success message");
      });

      it("should create success response with custom status", () => {
        const data = { id: 1, name: "Test" };
        const response = createSuccessResponse(data, "Created", 201);

        expect(response.status).toBe(201);
      });
    });

    describe("createPaginatedResponse", () => {
      it("should create paginated response", () => {
        const data = [{ id: 1 }, { id: 2 }];
        const pagination = { page: 1, limit: 20, total: 100 };

        const response = createPaginatedResponse(data, pagination, "Success");

        const body = JSON.parse(response.body as string);

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data).toEqual(data);
        expect(body.pagination).toEqual({
          page: 1,
          limit: 20,
          total: 100,
          totalPages: 5,
          hasNext: true,
          hasPrev: false,
        });
      });
    });
  });

  describe("withAuth", () => {
    it("should call handler with authenticated user", async () => {
      const { jwtVerify } = require("jose");
      jwtVerify.mockResolvedValue({ payload: mockUser });

      const mockHandler = jest
        .fn()
        .mockResolvedValue(createSuccessResponse({ message: "Success" }));

      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: {
          authorization: "Bearer valid-token",
        },
      });

      const wrappedHandler = withAuth(mockHandler, {
        requiredRole: "user",
        rateLimit: { max: 100 },
      });

      await wrappedHandler(request);

      expect(mockHandler).toHaveBeenCalledWith(request, mockUser);
    });

    it("should return 401 for missing token", async () => {
      const mockHandler = jest.fn();

      const request = new NextRequest("http://localhost:3000/api/test");

      const wrappedHandler = withAuth(mockHandler, {
        requiredRole: "user",
      });

      const response = await wrappedHandler(request);
      const body = JSON.parse(response.body as string);

      expect(response.status).toBe(401);
      expect(body.code).toBe("MISSING_TOKEN");
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it("should return 403 for insufficient permissions", async () => {
      const { jwtVerify } = require("jose");
      jwtVerify.mockResolvedValue({ payload: mockUser });

      const mockHandler = jest.fn();

      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: {
          authorization: "Bearer valid-token",
        },
      });

      const wrappedHandler = withAuth(mockHandler, {
        requiredRole: "premium",
      });

      const response = await wrappedHandler(request);
      const body = JSON.parse(response.body as string);

      expect(response.status).toBe(403);
      expect(body.code).toBe("INSUFFICIENT_PERMISSIONS");
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it("should return 429 for rate limit exceeded", async () => {
      const { jwtVerify } = require("jose");
      jwtVerify.mockResolvedValue({ payload: mockUser });

      const mockHandler = jest.fn();

      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: {
          authorization: "Bearer valid-token",
        },
      });

      const wrappedHandler = withAuth(mockHandler, {
        requiredRole: "user",
        rateLimit: { max: 0 }, // Set to 0 to trigger rate limit
      });

      const response = await wrappedHandler(request);
      const body = JSON.parse(response.body as string);

      expect(response.status).toBe(429);
      expect(body.code).toBe("RATE_LIMIT_EXCEEDED");
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });
});
