import {
  aiContentGenerator,
  UserInput,
  ContentSection,
} from "./ai-content-generator";
import { prisma } from "./prisma";

export interface ContentGenerationRequest {
  userId: string;
  input: UserInput;
  templateId?: string;
  portfolioId?: string;
}

export interface ContentGenerationResponse {
  success: boolean;
  content?: ContentSection;
  error?: string;
  metadata?: {
    generationTime: number;
    sectionsGenerated: number;
    language: string;
    cacheHit: boolean;
  };
}

export class AIContentService {
  /**
   * Generate portfolio content with user context
   */
  async generateContent(
    request: ContentGenerationRequest,
  ): Promise<ContentGenerationResponse> {
    const startTime = Date.now();

    try {
      // Get user context
      const user = await prisma.user.findUnique({
        where: { id: request.userId },
        include: {
          portfolios: true,
          projects: true,
          skills: true,
          experiences: true,
          educations: true,
        },
      });

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      // Enhance input with user data
      const enhancedInput: UserInput = {
        ...request.input,
        // Add user's existing projects if not provided
        projects:
          request.input.projects ||
          user.projects.map((project) => ({
            name: project.name,
            description: project.description,
            technologies: project.technologies,
            url: project.liveUrl || undefined,
            githubUrl: project.githubUrl || undefined,
          })),
        // Add user's existing skills if not provided
        skills:
          request.input.skills.length > 0
            ? request.input.skills
            : user.skills.map((skill) => skill.name),
      };

      // Generate content
      const content =
        await aiContentGenerator.generatePortfolioContent(enhancedInput);

      const generationTime = Date.now() - startTime;

      // Save generated content to database
      if (request.portfolioId) {
        await this.saveContentToPortfolio(request.portfolioId, content);
      }

      // Log successful generation
      await this.logContentGeneration(
        request.userId,
        enhancedInput,
        content,
        generationTime,
      );

      return {
        success: true,
        content,
        metadata: {
          generationTime,
          sectionsGenerated: Object.keys(content).length,
          language: enhancedInput.language,
          cacheHit: false, // TODO: Implement cache hit detection
        },
      };
    } catch (error) {
      console.error("Content generation failed:", error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        metadata: {
          generationTime: Date.now() - startTime,
          sectionsGenerated: 0,
          language: request.input.language,
          cacheHit: false,
        },
      };
    }
  }

  /**
   * Generate specific content section
   */
  async generateSection(
    userId: string,
    section: keyof ContentSection,
    input: UserInput,
  ): Promise<ContentGenerationResponse> {
    const startTime = Date.now();

    try {
      // Get user context
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      // Generate specific section (this would require refactoring the generator)
      const content = await aiContentGenerator.generatePortfolioContent(input);
      const sectionContent = content[section];

      const generationTime = Date.now() - startTime;

      return {
        success: true,
        content: { [section]: sectionContent } as ContentSection,
        metadata: {
          generationTime,
          sectionsGenerated: 1,
          language: input.language,
          cacheHit: false,
        },
      };
    } catch (error) {
      console.error(`Section generation failed for ${section}:`, error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        metadata: {
          generationTime: Date.now() - startTime,
          sectionsGenerated: 0,
          language: input.language,
          cacheHit: false,
        },
      };
    }
  }

  /**
   * Regenerate content with different parameters
   */
  async regenerateContent(
    userId: string,
    portfolioId: string,
    updates: Partial<UserInput>,
  ): Promise<ContentGenerationResponse> {
    try {
      // Get existing portfolio
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: portfolioId },
        include: { user: true },
      });

      if (!portfolio || portfolio.userId !== userId) {
        return {
          success: false,
          error: "Portfolio not found or access denied",
        };
      }

      // Get current content configuration
      const currentConfig = portfolio.config as any;

      // Merge with updates
      const updatedInput: UserInput = {
        role: updates.role || currentConfig.role || "Developer",
        industry: updates.industry || currentConfig.industry || "Technology",
        experience: updates.experience || currentConfig.experience || 2,
        skills: updates.skills || currentConfig.skills || [],
        projects: updates.projects || currentConfig.projects || [],
        style: updates.style || currentConfig.style || "modern",
        colorPreferences:
          updates.colorPreferences || currentConfig.colorPreferences,
        language: updates.language || currentConfig.language || "en",
        tone: updates.tone || currentConfig.tone || "professional",
        targetAudience:
          updates.targetAudience || currentConfig.targetAudience || "employers",
        includeTestimonials:
          updates.includeTestimonials ||
          currentConfig.includeTestimonials ||
          false,
        includeBlog: updates.includeBlog || currentConfig.includeBlog || false,
        includeResume:
          updates.includeResume || currentConfig.includeResume || true,
      };

      // Generate new content
      return await this.generateContent({
        userId,
        input: updatedInput,
        portfolioId,
      });
    } catch (error) {
      console.error("Content regeneration failed:", error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get content generation history
   */
  async getGenerationHistory(userId: string, limit: number = 10) {
    try {
      const history = await prisma.analytics.findMany({
        where: {
          userId,
          event: "ai_content_generated",
        },
        orderBy: {
          timestamp: "desc",
        },
        take: limit,
      });

      return history.map((entry) => ({
        id: entry.id,
        timestamp: entry.timestamp,
        properties: entry.properties,
      }));
    } catch (error) {
      console.error("Failed to get generation history:", error);
      return [];
    }
  }

  /**
   * Save content to portfolio
   */
  private async saveContentToPortfolio(
    portfolioId: string,
    content: ContentSection,
  ): Promise<void> {
    try {
      await prisma.portfolio.update({
        where: { id: portfolioId },
        data: {
          config: content,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to save content to portfolio:", error);
      throw error;
    }
  }

  /**
   * Log content generation
   */
  private async logContentGeneration(
    userId: string,
    input: UserInput,
    content: ContentSection,
    generationTime: number,
  ): Promise<void> {
    try {
      await prisma.analytics.create({
        data: {
          userId,
          event: "ai_content_generated",
          properties: {
            input: {
              role: input.role,
              industry: input.industry,
              experience: input.experience,
              language: input.language,
              style: input.style,
              tone: input.tone,
            },
            output: {
              sectionsGenerated: Object.keys(content).length,
              hasTestimonials: !!content.testimonials,
              hasBlog: !!content.blog,
            },
            performance: {
              generationTime,
              timestamp: new Date().toISOString(),
            },
          },
        },
      });
    } catch (error) {
      console.error("Failed to log content generation:", error);
    }
  }

  /**
   * Get content generation statistics
   */
  async getGenerationStats(userId: string) {
    try {
      const stats = await prisma.analytics.groupBy({
        by: ["event"],
        where: {
          userId,
          event: "ai_content_generated",
        },
        _count: {
          id: true,
        },
        _avg: {
          // This would require adding a numeric field for generation time
        },
      });

      return {
        totalGenerations: stats.reduce((sum, stat) => sum + stat._count.id, 0),
        recentGenerations: await this.getGenerationHistory(userId, 5),
      };
    } catch (error) {
      console.error("Failed to get generation stats:", error);
      return {
        totalGenerations: 0,
        recentGenerations: [],
      };
    }
  }

  /**
   * Clear user's content cache
   */
  async clearUserCache(userId: string): Promise<void> {
    try {
      // This would require implementing user-specific caching
      // For now, we'll clear the global cache
      aiContentGenerator.clearCache();

      await prisma.analytics.create({
        data: {
          userId,
          event: "cache_cleared",
          properties: {
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error("Failed to clear user cache:", error);
    }
  }
}

// Export singleton instance
export const aiContentService = new AIContentService();
