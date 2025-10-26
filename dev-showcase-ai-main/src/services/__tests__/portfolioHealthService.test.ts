/**
 * Tests for Portfolio Health Service
 */

import {
  portfolioHealthService,
  PortfolioData,
  ProjectData,
} from "../portfolioHealthService";

describe("PortfolioHealthService", () => {
  const mockPortfolio: PortfolioData = {
    id: "portfolio-1",
    name: "John Doe Portfolio",
    description: "Full-stack developer portfolio",
    isPublished: true,
    templateId: "template-1",
    config: {},
    projects: [],
    user: {
      bio: "Experienced developer",
      avatar: "avatar.jpg",
      experience: 3,
      certifications: ["AWS Certified", "React Certified"],
    },
  };

  const mockProjects: ProjectData[] = [
    {
      id: "project-1",
      name: "E-commerce Website",
      description:
        "A full-stack e-commerce application built with React and Node.js",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      tags: ["ecommerce", "fullstack", "react"],
      domain: "web-development",
      imageUrl: "project1.jpg",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/user/project1",
      featured: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "project-2",
      name: "Mobile App",
      description: "Cross-platform mobile application",
      technologies: ["React Native", "JavaScript", "Firebase"],
      tags: ["mobile", "react-native"],
      domain: "mobile-development",
      imageUrl: "project2.jpg",
      liveUrl: "https://app.example.com",
      githubUrl: "https://github.com/user/project2",
      featured: false,
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
    },
  ];

  describe("computePortfolioHealth", () => {
    it("should compute health score for excellent portfolio", async () => {
      const portfolio = {
        ...mockPortfolio,
        projects: mockProjects,
      };

      const result =
        await portfolioHealthService.computePortfolioHealth(portfolio);

      expect(result).toHaveProperty("overall");
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("breakdown");
      expect(result).toHaveProperty("recommendedImprovements");
      expect(result).toHaveProperty("lastComputedAt");

      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeLessThanOrEqual(100);
      expect(["Excellent", "Good", "Fair", "Needs Work"]).toContain(
        result.status,
      );
    });

    it("should compute health score for poor portfolio", async () => {
      const portfolio = {
        ...mockPortfolio,
        projects: [],
        user: {
          bio: "",
          avatar: "",
          experience: 0,
          certifications: [],
        },
      };

      const result =
        await portfolioHealthService.computePortfolioHealth(portfolio);

      expect(result.overall).toBeLessThan(50);
      expect(result.status).toBe("Needs Work");
      expect(result.recommendedImprovements.length).toBeGreaterThan(0);
    });

    it("should compute health score for average portfolio", async () => {
      const portfolio = {
        ...mockPortfolio,
        projects: [mockProjects[0]], // Only one project
        user: {
          bio: "Short bio",
          avatar: "",
          experience: 1,
          certifications: ["One Cert"],
        },
      };

      const result =
        await portfolioHealthService.computePortfolioHealth(portfolio);

      expect(result.overall).toBeGreaterThanOrEqual(30);
      expect(result.overall).toBeLessThanOrEqual(80);
    });
  });

  describe("evaluateTechnicalSkills", () => {
    it("should score high for diverse technologies", () => {
      const portfolio = {
        ...mockPortfolio,
        projects: mockProjects,
      };

      // Access private method through any for testing
      const score = (portfolioHealthService as any).evaluateTechnicalSkills(
        portfolio,
        mockProjects,
      );

      expect(score).toBeGreaterThan(60);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should score low for no projects", () => {
      const portfolio = { ...mockPortfolio, projects: [] };
      const score = (portfolioHealthService as any).evaluateTechnicalSkills(
        portfolio,
        [],
      );

      expect(score).toBe(0);
    });
  });

  describe("evaluateProjectQuality", () => {
    it("should score high for complete projects", () => {
      const projects = mockProjects;
      const score = (portfolioHealthService as any).evaluateProjectQuality(
        projects,
      );

      expect(score).toBeGreaterThan(50);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should score low for incomplete projects", () => {
      const incompleteProjects = [
        {
          ...mockProjects[0],
          description: "Short",
          imageUrl: "",
          liveUrl: "",
          githubUrl: "",
        },
      ];

      const score = (portfolioHealthService as any).evaluateProjectQuality(
        incompleteProjects,
      );
      expect(score).toBeLessThan(50);
    });
  });

  describe("evaluatePresentation", () => {
    it("should score high for complete portfolio", () => {
      const portfolio = {
        ...mockPortfolio,
        isPublished: true,
        templateId: "template-1",
      };

      const score = (portfolioHealthService as any).evaluatePresentation(
        portfolio,
      );
      expect(score).toBeGreaterThan(50);
    });

    it("should score low for incomplete portfolio", () => {
      const portfolio = {
        ...mockPortfolio,
        description: "",
        isPublished: false,
        templateId: "",
      };

      const score = (portfolioHealthService as any).evaluatePresentation(
        portfolio,
      );
      expect(score).toBeLessThan(50);
    });
  });

  describe("evaluateExperience", () => {
    it("should score high for experienced user with many projects", () => {
      const portfolio = {
        ...mockPortfolio,
        projects: mockProjects,
        user: { ...mockPortfolio.user!, experience: 5 },
      };

      const score = (portfolioHealthService as any).evaluateExperience(
        portfolio,
        mockProjects,
      );
      expect(score).toBeGreaterThan(60);
    });

    it("should score low for new user with no projects", () => {
      const portfolio = {
        ...mockPortfolio,
        projects: [],
        user: { ...mockPortfolio.user!, experience: 0 },
      };

      const score = (portfolioHealthService as any).evaluateExperience(
        portfolio,
        [],
      );
      expect(score).toBeLessThan(40);
    });
  });

  describe("evaluateIndustryAlignment", () => {
    it("should score high for consistent domains", () => {
      const projects = [
        { ...mockProjects[0], domain: "web-development" },
        { ...mockProjects[1], domain: "web-development" },
      ];

      const score = (portfolioHealthService as any).evaluateIndustryAlignment(
        mockPortfolio,
        projects,
      );
      expect(score).toBeGreaterThan(80);
    });

    it("should score medium for mixed domains", () => {
      const projects = [
        { ...mockProjects[0], domain: "web-development" },
        { ...mockProjects[1], domain: "mobile-development" },
      ];

      const score = (portfolioHealthService as any).evaluateIndustryAlignment(
        mockPortfolio,
        projects,
      );
      expect(score).toBeGreaterThan(40);
      expect(score).toBeLessThan(80);
    });
  });

  describe("evaluateCertifications", () => {
    it("should score high for many relevant certifications", () => {
      const portfolio = {
        ...mockPortfolio,
        user: {
          ...mockPortfolio.user!,
          certifications: [
            "AWS Certified",
            "React Certified",
            "Node.js Certified",
          ],
        },
      };

      const score = (portfolioHealthService as any).evaluateCertifications(
        portfolio,
      );
      expect(score).toBeGreaterThan(60);
    });

    it("should score low for no certifications", () => {
      const portfolio = {
        ...mockPortfolio,
        user: { ...mockPortfolio.user!, certifications: [] },
      };

      const score = (portfolioHealthService as any).evaluateCertifications(
        portfolio,
      );
      expect(score).toBe(0);
    });
  });
});
