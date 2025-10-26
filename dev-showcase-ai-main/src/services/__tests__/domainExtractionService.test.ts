/**
 * Tests for Domain Extraction Service
 */

import {
  domainExtractionService,
  ProjectData,
} from "../domainExtractionService";

describe("DomainExtractionService", () => {
  const mockProjectData: ProjectData = {
    name: "React E-commerce App",
    description:
      "A full-stack e-commerce application built with React, Node.js, and MongoDB",
    technologies: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
    tags: ["ecommerce", "fullstack", "react", "node"],
    category: "Web Development",
  };

  describe("extractDomainRuleBased", () => {
    it("should extract web-development domain for web projects", () => {
      const result =
        domainExtractionService.extractDomainRuleBased(mockProjectData);

      expect(result.domain).toBe("web-development");
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.method).toBe("rule-based");
    });

    it("should extract mobile-development domain for mobile projects", () => {
      const mobileProject: ProjectData = {
        name: "React Native App",
        description: "Cross-platform mobile application",
        technologies: ["React Native", "JavaScript", "Firebase"],
        tags: ["mobile", "react-native", "cross-platform"],
        category: "Mobile Development",
      };

      const result =
        domainExtractionService.extractDomainRuleBased(mobileProject);

      expect(result.domain).toBe("mobile-development");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should extract data-science domain for ML projects", () => {
      const mlProject: ProjectData = {
        name: "Machine Learning Model",
        description: "Predictive analytics using Python and TensorFlow",
        technologies: ["Python", "TensorFlow", "Pandas", "NumPy"],
        tags: ["machine-learning", "ai", "python"],
        category: "Data Science",
      };

      const result = domainExtractionService.extractDomainRuleBased(mlProject);

      expect(result.domain).toBe("data-science");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should return general domain for unclear projects", () => {
      const unclearProject: ProjectData = {
        name: "Project",
        description: "A project",
        technologies: [],
        tags: [],
        category: "Other",
      };

      const result =
        domainExtractionService.extractDomainRuleBased(unclearProject);

      expect(result.domain).toBe("general");
      expect(result.confidence).toBe(0);
    });
  });

  describe("getDomainDisplayName", () => {
    it("should return correct display names", () => {
      expect(
        domainExtractionService.getDomainDisplayName("web-development"),
      ).toBe("Web Development");
      expect(
        domainExtractionService.getDomainDisplayName("mobile-development"),
      ).toBe("Mobile Development");
      expect(domainExtractionService.getDomainDisplayName("data-science")).toBe(
        "Data Science",
      );
      expect(domainExtractionService.getDomainDisplayName("devops")).toBe(
        "DevOps",
      );
      expect(domainExtractionService.getDomainDisplayName("blockchain")).toBe(
        "Blockchain",
      );
      expect(
        domainExtractionService.getDomainDisplayName("game-development"),
      ).toBe("Game Development");
      expect(
        domainExtractionService.getDomainDisplayName("cybersecurity"),
      ).toBe("Cybersecurity");
      expect(domainExtractionService.getDomainDisplayName("general")).toBe(
        "General",
      );
    });

    it("should return General for unknown domains", () => {
      expect(
        domainExtractionService.getDomainDisplayName("unknown-domain"),
      ).toBe("General");
    });
  });

  describe("extractDomain", () => {
    it("should work without AI keys", async () => {
      // Mock environment without AI keys
      const originalEnv = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;
      process.env.PORTFOLIO_HEALTH_ENABLED = "true";

      const result =
        await domainExtractionService.extractDomain(mockProjectData);

      expect(result.domain).toBe("web-development");
      expect(result.method).toBe("rule-based");

      // Restore environment
      if (originalEnv) {
        process.env.OPENAI_API_KEY = originalEnv;
      }
    });

    it("should handle errors gracefully", async () => {
      const invalidProject: ProjectData = {
        name: "",
        description: "",
        technologies: [],
        tags: [],
        category: "",
      };

      const result =
        await domainExtractionService.extractDomain(invalidProject);

      expect(result.domain).toBe("general");
      expect(result.method).toBe("rule-based");
    });
  });
});
