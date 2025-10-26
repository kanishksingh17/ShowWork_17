/**
 * Portfolio Health Scoring Service
 * Implements rule-based scoring for portfolio health assessment
 */

export interface PortfolioHealthScore {
  overall: number;
  status: "Excellent" | "Good" | "Fair" | "Needs Work";
  breakdown: {
    technicalSkills: number;
    projectQuality: number;
    portfolioPresentation: number;
    experience: number;
    industryAlignment: number;
    certifications: number;
  };
  recommendedImprovements: string[];
  lastComputedAt: string;
}

export interface PortfolioData {
  id: string;
  name: string;
  description?: string;
  isPublished: boolean;
  templateId?: string;
  config?: any;
  projects: ProjectData[];
  user?: {
    bio?: string;
    avatar?: string;
    experience?: number; // years of experience
    certifications?: string[];
  };
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  tags: string[];
  domain?: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

class PortfolioHealthService {
  private readonly WEIGHTS = {
    technicalSkills: 0.2,
    projectQuality: 0.25,
    portfolioPresentation: 0.15,
    experience: 0.15,
    industryAlignment: 0.15,
    certifications: 0.1,
  };

  /**
   * Main method to compute portfolio health score
   */
  async computePortfolioHealth(
    portfolio: PortfolioData,
  ): Promise<PortfolioHealthScore> {
    const startTime = Date.now();

    try {
      const projects = portfolio.projects || [];

      // Calculate individual component scores
      const scores = {
        technicalSkills: this.evaluateTechnicalSkills(portfolio, projects),
        projectQuality: this.evaluateProjectQuality(projects),
        portfolioPresentation: this.evaluatePresentation(portfolio),
        experience: this.evaluateExperience(portfolio, projects),
        industryAlignment: this.evaluateIndustryAlignment(portfolio, projects),
        certifications: this.evaluateCertifications(portfolio),
      };

      // Calculate weighted overall score
      const overall = this.calculateOverallScore(scores);

      // Generate recommendations
      const recommendedImprovements = this.buildRecommendations(
        scores,
        portfolio,
        projects,
      );

      // Determine status
      const status = this.getStatusFromScore(overall);

      const result: PortfolioHealthScore = {
        overall,
        status,
        breakdown: scores,
        recommendedImprovements,
        lastComputedAt: new Date().toISOString(),
      };

      const duration = Date.now() - startTime;
      console.log(
        `Portfolio health computed in ${duration}ms for portfolio ${portfolio.id}: ${overall}/100`,
      );

      return result;
    } catch (error) {
      console.error("Error computing portfolio health:", error);
      throw new Error("Failed to compute portfolio health");
    }
  }

  /**
   * Evaluate technical skills based on technology diversity and depth
   */
  private evaluateTechnicalSkills(
    portfolio: PortfolioData,
    projects: ProjectData[],
  ): number {
    if (projects.length === 0) return 0;

    const allTechnologies = projects.flatMap((p) => p.technologies);
    const uniqueTechnologies = new Set(allTechnologies);

    // Base score from technology diversity
    let score = Math.min(uniqueTechnologies.size * 5, 40); // Max 40 points for diversity

    // Bonus for full-stack indicators
    const hasFrontend = allTechnologies.some((tech) =>
      [
        "react",
        "vue",
        "angular",
        "javascript",
        "typescript",
        "html",
        "css",
      ].includes(tech.toLowerCase()),
    );
    const hasBackend = allTechnologies.some((tech) =>
      ["node", "express", "python", "java", "c#", "php", "ruby", "go"].includes(
        tech.toLowerCase(),
      ),
    );
    const hasDatabase = allTechnologies.some((tech) =>
      ["mysql", "postgresql", "mongodb", "redis", "sqlite"].includes(
        tech.toLowerCase(),
      ),
    );

    if (hasFrontend && hasBackend) score += 20; // Full-stack bonus
    if (hasDatabase) score += 10; // Database knowledge
    if (hasFrontend) score += 10; // Frontend skills
    if (hasBackend) score += 10; // Backend skills

    // Bonus for modern/advanced technologies
    const modernTechs = [
      "typescript",
      "docker",
      "kubernetes",
      "graphql",
      "microservices",
    ];
    const modernCount = allTechnologies.filter((tech) =>
      modernTechs.includes(tech.toLowerCase()),
    ).length;
    score += Math.min(modernCount * 5, 20); // Max 20 points for modern techs

    return Math.min(Math.round(score), 100);
  }

  /**
   * Evaluate project quality based on completeness and presentation
   */
  private evaluateProjectQuality(projects: ProjectData[]): number {
    if (projects.length === 0) return 0;

    const qualityScores = projects.map((project) => {
      let score = 0;

      // Description quality (0-20 points)
      const descLength = project.description.length;
      if (descLength > 200) score += 20;
      else if (descLength > 100) score += 15;
      else if (descLength > 50) score += 10;

      // Media presence (0-20 points)
      if (project.imageUrl) score += 20;

      // Live demo (0-20 points)
      if (project.liveUrl) score += 20;

      // GitHub link (0-15 points)
      if (project.githubUrl) score += 15;

      // Technology tags (0-15 points)
      score += Math.min(project.technologies.length * 3, 15);

      // Recency bonus (0-10 points)
      const daysSinceUpdate =
        (Date.now() - new Date(project.updatedAt).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSinceUpdate < 30) score += 10;
      else if (daysSinceUpdate < 90) score += 5;

      return Math.min(score, 100);
    });

    // Return average quality score
    return Math.round(
      qualityScores.reduce((sum, score) => sum + score, 0) /
        qualityScores.length,
    );
  }

  /**
   * Evaluate portfolio presentation quality
   */
  private evaluatePresentation(portfolio: PortfolioData): number {
    let score = 0;

    // Basic info (0-30 points)
    if (portfolio.name) score += 10;
    if (portfolio.description && portfolio.description.length > 50) score += 20;

    // Template selection (0-20 points)
    if (portfolio.templateId) score += 20;

    // Published status (0-30 points)
    if (portfolio.isPublished) score += 30;

    // User profile completeness (0-20 points)
    if (portfolio.user) {
      if (portfolio.user.bio && portfolio.user.bio.length > 50) score += 10;
      if (portfolio.user.avatar) score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Evaluate experience level
   */
  private evaluateExperience(
    portfolio: PortfolioData,
    projects: ProjectData[],
  ): number {
    let score = 0;

    // Project count (0-40 points)
    const projectCount = projects.length;
    if (projectCount >= 5) score += 40;
    else if (projectCount >= 3) score += 30;
    else if (projectCount >= 1) score += 20;

    // Explicit experience years (0-30 points)
    if (portfolio.user?.experience) {
      const years = portfolio.user.experience;
      if (years >= 5) score += 30;
      else if (years >= 3) score += 20;
      else if (years >= 1) score += 10;
    }

    // Project diversity (0-30 points)
    const domains = new Set(projects.map((p) => p.domain).filter(Boolean));
    if (domains.size >= 3) score += 30;
    else if (domains.size >= 2) score += 20;
    else if (domains.size >= 1) score += 10;

    return Math.min(score, 100);
  }

  /**
   * Evaluate industry alignment
   */
  private evaluateIndustryAlignment(
    portfolio: PortfolioData,
    projects: ProjectData[],
  ): number {
    if (projects.length === 0) return 0;

    // For now, give bonus for domain consistency
    const domains = projects.map((p) => p.domain).filter(Boolean);
    if (domains.length === 0) return 50; // Neutral if no domains

    // Check for domain consistency
    const domainCounts: Record<string, number> = {};
    domains.forEach((domain) => {
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });

    const maxDomainCount = Math.max(...Object.values(domainCounts));
    const consistency = maxDomainCount / domains.length;

    // Score based on consistency (0-100)
    return Math.round(consistency * 100);
  }

  /**
   * Evaluate certifications
   */
  private evaluateCertifications(portfolio: PortfolioData): number {
    const certifications = portfolio.user?.certifications || [];

    if (certifications.length === 0) return 0;

    // Base score from certification count
    let score = Math.min(certifications.length * 20, 60);

    // Bonus for relevant certifications
    const relevantCerts = certifications.filter(
      (cert) =>
        cert.toLowerCase().includes("aws") ||
        cert.toLowerCase().includes("azure") ||
        cert.toLowerCase().includes("google") ||
        cert.toLowerCase().includes("microsoft") ||
        cert.toLowerCase().includes("react") ||
        cert.toLowerCase().includes("node"),
    );

    score += Math.min(relevantCerts.length * 10, 40);

    return Math.min(score, 100);
  }

  /**
   * Calculate overall weighted score
   */
  private calculateOverallScore(
    scores: PortfolioHealthScore["breakdown"],
  ): number {
    let weightedSum = 0;
    let totalWeight = 0;

    Object.entries(scores).forEach(([key, score]) => {
      const weight = this.WEIGHTS[key as keyof typeof this.WEIGHTS];
      weightedSum += score * weight;
      totalWeight += weight;
    });

    return Math.round(weightedSum / totalWeight);
  }

  /**
   * Generate improvement recommendations
   */
  private buildRecommendations(
    scores: PortfolioHealthScore["breakdown"],
    portfolio: PortfolioData,
    projects: ProjectData[],
  ): string[] {
    const recommendations: string[] = [];

    if (scores.technicalSkills < 60) {
      recommendations.push("Add more diverse technologies to your projects");
      recommendations.push("Include both frontend and backend technologies");
    }

    if (scores.projectQuality < 60) {
      recommendations.push("Add detailed descriptions to your projects");
      recommendations.push("Include live demos and GitHub links");
      recommendations.push("Add screenshots or images to showcase your work");
    }

    if (scores.portfolioPresentation < 60) {
      recommendations.push("Complete your portfolio description");
      recommendations.push("Choose a professional template");
      recommendations.push("Publish your portfolio to make it visible");
    }

    if (scores.experience < 60) {
      recommendations.push("Add more projects to showcase your experience");
      recommendations.push("Include projects from different domains");
    }

    if (scores.industryAlignment < 60) {
      recommendations.push("Focus on projects within your target industry");
      recommendations.push(
        "Ensure project domains align with your career goals",
      );
    }

    if (scores.certifications < 40) {
      recommendations.push("Consider earning relevant certifications");
      recommendations.push("Add any existing certifications to your profile");
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  }

  /**
   * Get status label from score
   */
  private getStatusFromScore(score: number): PortfolioHealthScore["status"] {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Needs Work";
  }
}

export const portfolioHealthService = new PortfolioHealthService();
