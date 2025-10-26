import OpenAI from "openai";
import { z } from "zod";
import { prisma } from "./prisma";

// Zod schemas for input validation
export const UserInputSchema = z.object({
  role: z.string().min(1, "Role is required"),
  industry: z.string().min(1, "Industry is required"),
  experience: z
    .number()
    .min(0)
    .max(50, "Experience must be between 0-50 years"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
        url: z.string().url().optional(),
        githubUrl: z.string().url().optional(),
      }),
    )
    .optional(),
  style: z.enum(["modern", "minimal", "creative", "professional", "corporate"]),
  colorPreferences: z
    .array(z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"))
    .optional(),
  language: z
    .enum(["en", "es", "fr", "de", "it", "pt", "zh", "ja", "ko"])
    .default("en"),
  tone: z
    .enum(["professional", "casual", "friendly", "authoritative", "creative"])
    .default("professional"),
  targetAudience: z
    .enum(["employers", "clients", "peers", "general"])
    .default("employers"),
  includeTestimonials: z.boolean().default(false),
  includeBlog: z.boolean().default(false),
  includeResume: z.boolean().default(true),
});

export const ContentSectionSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    ctaText: z.string(),
    ctaUrl: z.string().optional(),
  }),
  about: z.object({
    title: z.string(),
    content: z.string(),
    highlights: z.array(z.string()),
    imageUrl: z.string().optional(),
  }),
  skills: z.object({
    title: z.string(),
    categories: z.array(
      z.object({
        name: z.string(),
        skills: z.array(
          z.object({
            name: z.string(),
            level: z.number().min(0).max(100),
            years: z.number().min(0),
          }),
        ),
      }),
    ),
  }),
  projects: z.object({
    title: z.string(),
    items: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        longDescription: z.string(),
        technologies: z.array(z.string()),
        imageUrl: z.string().optional(),
        liveUrl: z.string().optional(),
        githubUrl: z.string().optional(),
        featured: z.boolean().default(false),
        achievements: z.array(z.string()).optional(),
      }),
    ),
  }),
  experience: z.object({
    title: z.string(),
    items: z.array(
      z.object({
        company: z.string(),
        position: z.string(),
        description: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
        isCurrent: z.boolean().default(false),
        achievements: z.array(z.string()),
        technologies: z.array(z.string()),
      }),
    ),
  }),
  education: z.object({
    title: z.string(),
    items: z.array(
      z.object({
        institution: z.string(),
        degree: z.string(),
        field: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
        isCurrent: z.boolean().default(false),
        achievements: z.array(z.string()).optional(),
      }),
    ),
  }),
  contact: z.object({
    title: z.string(),
    description: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    socialLinks: z.array(
      z.object({
        platform: z.string(),
        url: z.string().url(),
        username: z.string().optional(),
      }),
    ),
  }),
  testimonials: z
    .object({
      title: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          position: z.string(),
          company: z.string(),
          content: z.string(),
          rating: z.number().min(1).max(5),
          imageUrl: z.string().optional(),
        }),
      ),
    })
    .optional(),
  blog: z
    .object({
      title: z.string(),
      description: z.string(),
      posts: z.array(
        z.object({
          title: z.string(),
          excerpt: z.string(),
          content: z.string(),
          publishedAt: z.string(),
          tags: z.array(z.string()),
          readTime: z.number(),
        }),
      ),
    })
    .optional(),
  seo: z.object({
    metaTitle: z.string(),
    metaDescription: z.string(),
    keywords: z.array(z.string()),
    ogTitle: z.string(),
    ogDescription: z.string(),
    ogImage: z.string().optional(),
  }),
});

export type UserInput = z.infer<typeof UserInputSchema>;
export type ContentSection = z.infer<typeof ContentSectionSchema>;

// Language configurations
const LANGUAGE_CONFIGS = {
  en: {
    name: "English",
    code: "en",
    prompts: {
      hero: "Create a compelling hero section for a {role} in the {industry} industry",
      about:
        "Write an engaging about section highlighting {experience} years of experience",
      skills: "Organize skills into relevant categories for a {role}",
      projects:
        "Create detailed project descriptions showcasing technical expertise",
      experience: "Write professional experience descriptions",
      education: "Create education section content",
      contact: "Write a professional contact section",
      testimonials:
        "Generate authentic testimonials from colleagues and clients",
      blog: "Create blog post ideas and content for a {role}",
      seo: "Generate SEO-optimized meta content",
    },
  },
  es: {
    name: "Español",
    code: "es",
    prompts: {
      hero: "Crea una sección hero convincente para un {role} en la industria {industry}",
      about:
        "Escribe una sección sobre mí atractiva destacando {experience} años de experiencia",
      skills:
        "Organiza las habilidades en categorías relevantes para un {role}",
      projects:
        "Crea descripciones detalladas de proyectos que muestren experiencia técnica",
      experience: "Escribe descripciones de experiencia profesional",
      education: "Crea contenido de la sección de educación",
      contact: "Escribe una sección de contacto profesional",
      testimonials: "Genera testimonios auténticos de colegas y clientes",
      blog: "Crea ideas y contenido de blog para un {role}",
      seo: "Genera contenido meta optimizado para SEO",
    },
  },
  fr: {
    name: "Français",
    code: "fr",
    prompts: {
      hero: "Créez une section hero convaincante pour un {role} dans l'industrie {industry}",
      about:
        "Rédigez une section à propos engageante mettant en valeur {experience} années d'expérience",
      skills:
        "Organisez les compétences en catégories pertinentes pour un {role}",
      projects:
        "Créez des descriptions détaillées de projets montrant l'expertise technique",
      experience: "Rédigez des descriptions d'expérience professionnelle",
      education: "Créez du contenu pour la section éducation",
      contact: "Rédigez une section de contact professionnelle",
      testimonials:
        "Générez des témoignages authentiques de collègues et clients",
      blog: "Créez des idées et du contenu de blog pour un {role}",
      seo: "Générez du contenu meta optimisé pour le SEO",
    },
  },
};

// Cache interface
interface CacheEntry {
  content: ContentSection;
  timestamp: number;
  language: string;
  hash: string;
}

export class AIContentGenerator {
  private openai: OpenAI;
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate complete portfolio content
   */
  async generatePortfolioContent(input: UserInput): Promise<ContentSection> {
    try {
      // Validate input
      const validatedInput = UserInputSchema.parse(input);

      // Check cache
      const cacheKey = this.generateCacheKey(validatedInput);
      const cached = this.getCachedContent(cacheKey);
      if (cached) {
        console.log("🎯 Using cached content");
        return cached;
      }

      console.log("🚀 Generating new portfolio content...");

      // Generate all sections in parallel for better performance
      const [
        hero,
        about,
        skills,
        projects,
        experience,
        education,
        contact,
        testimonials,
        blog,
        seo,
      ] = await Promise.all([
        this.generateHeroSection(validatedInput),
        this.generateAboutSection(validatedInput),
        this.generateSkillsSection(validatedInput),
        this.generateProjectsSection(validatedInput),
        this.generateExperienceSection(validatedInput),
        this.generateEducationSection(validatedInput),
        this.generateContactSection(validatedInput),
        validatedInput.includeTestimonials
          ? this.generateTestimonialsSection(validatedInput)
          : null,
        validatedInput.includeBlog
          ? this.generateBlogSection(validatedInput)
          : null,
        this.generateSEOSection(validatedInput),
      ]);

      const content: ContentSection = {
        hero,
        about,
        skills,
        projects,
        experience,
        education,
        contact,
        ...(testimonials && { testimonials }),
        ...(blog && { blog }),
        seo,
      };

      // Validate output
      const validatedContent = ContentSectionSchema.parse(content);

      // Cache the result
      this.setCachedContent(
        cacheKey,
        validatedContent,
        validatedInput.language,
      );

      // Log analytics
      await this.logGeneration(validatedInput, validatedContent);

      console.log("✅ Portfolio content generated successfully");
      return validatedContent;
    } catch (error) {
      console.error("❌ Error generating portfolio content:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Generate hero section
   */
  private async generateHeroSection(
    input: UserInput,
  ): Promise<ContentSection["hero"]> {
    const prompt = this.buildPrompt("hero", input, {
      experience: input.experience,
      skills: input.skills.slice(0, 5).join(", "),
      style: input.style,
      tone: input.tone,
    });

    const response = await this.callOpenAI(prompt, "hero");
    return response.hero;
  }

  /**
   * Generate about section
   */
  private async generateAboutSection(
    input: UserInput,
  ): Promise<ContentSection["about"]> {
    const prompt = this.buildPrompt("about", input, {
      experience: input.experience,
      skills: input.skills.join(", "),
      projects: input.projects?.map((p) => p.name).join(", ") || "",
      style: input.style,
      tone: input.tone,
    });

    const response = await this.callOpenAI(prompt, "about");
    return response.about;
  }

  /**
   * Generate skills section
   */
  private async generateSkillsSection(
    input: UserInput,
  ): Promise<ContentSection["skills"]> {
    const prompt = this.buildPrompt("skills", input, {
      skills: input.skills.join(", "),
      experience: input.experience,
      role: input.role,
      industry: input.industry,
    });

    const response = await this.callOpenAI(prompt, "skills");
    return response.skills;
  }

  /**
   * Generate projects section
   */
  private async generateProjectsSection(
    input: UserInput,
  ): Promise<ContentSection["projects"]> {
    const prompt = this.buildPrompt("projects", input, {
      projects:
        input.projects?.map((p) => `${p.name}: ${p.description}`).join("\n") ||
        "",
      skills: input.skills.join(", "),
      role: input.role,
      industry: input.industry,
    });

    const response = await this.callOpenAI(prompt, "projects");
    return response.projects;
  }

  /**
   * Generate experience section
   */
  private async generateExperienceSection(
    input: UserInput,
  ): Promise<ContentSection["experience"]> {
    const prompt = this.buildPrompt("experience", input, {
      experience: input.experience,
      role: input.role,
      industry: input.industry,
      skills: input.skills.join(", "),
    });

    const response = await this.callOpenAI(prompt, "experience");
    return response.experience;
  }

  /**
   * Generate education section
   */
  private async generateEducationSection(
    input: UserInput,
  ): Promise<ContentSection["education"]> {
    const prompt = this.buildPrompt("education", input, {
      role: input.role,
      industry: input.industry,
      experience: input.experience,
    });

    const response = await this.callOpenAI(prompt, "education");
    return response.education;
  }

  /**
   * Generate contact section
   */
  private async generateContactSection(
    input: UserInput,
  ): Promise<ContentSection["contact"]> {
    const prompt = this.buildPrompt("contact", input, {
      role: input.role,
      industry: input.industry,
      tone: input.tone,
    });

    const response = await this.callOpenAI(prompt, "contact");
    return response.contact;
  }

  /**
   * Generate testimonials section
   */
  private async generateTestimonialsSection(
    input: UserInput,
  ): Promise<ContentSection["testimonials"]> {
    const prompt = this.buildPrompt("testimonials", input, {
      role: input.role,
      industry: input.industry,
      experience: input.experience,
      skills: input.skills.join(", "),
    });

    const response = await this.callOpenAI(prompt, "testimonials");
    return response.testimonials;
  }

  /**
   * Generate blog section
   */
  private async generateBlogSection(
    input: UserInput,
  ): Promise<ContentSection["blog"]> {
    const prompt = this.buildPrompt("blog", input, {
      role: input.role,
      industry: input.industry,
      skills: input.skills.join(", "),
      experience: input.experience,
    });

    const response = await this.callOpenAI(prompt, "blog");
    return response.blog;
  }

  /**
   * Generate SEO section
   */
  private async generateSEOSection(
    input: UserInput,
  ): Promise<ContentSection["seo"]> {
    const prompt = this.buildPrompt("seo", input, {
      role: input.role,
      industry: input.industry,
      skills: input.skills.join(", "),
      experience: input.experience,
    });

    const response = await this.callOpenAI(prompt, "seo");
    return response.seo;
  }

  /**
   * Build prompt for OpenAI
   */
  private buildPrompt(
    section: string,
    input: UserInput,
    context: Record<string, any>,
  ): string {
    const langConfig = LANGUAGE_CONFIGS[input.language] || LANGUAGE_CONFIGS.en;
    const basePrompt =
      langConfig.prompts[section as keyof typeof langConfig.prompts];

    return `
${basePrompt}

Context:
- Role: ${input.role}
- Industry: ${input.industry}
- Experience: ${input.experience} years
- Style: ${input.style}
- Tone: ${input.tone}
- Target Audience: ${input.targetAudience}
- Language: ${langConfig.name}

Additional Context:
${Object.entries(context)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}

Requirements:
- Generate content in ${langConfig.name}
- Match the ${input.style} style
- Use ${input.tone} tone
- Target ${input.targetAudience}
- Be professional and engaging
- Include specific examples and achievements
- Optimize for the ${input.industry} industry

Please return a JSON object with the ${section} section content following the exact schema structure.
`;
  }

  /**
   * Call OpenAI API with retry logic
   */
  private async callOpenAI(prompt: string, section: string): Promise<any> {
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`🔄 Generating ${section} (attempt ${attempt})`);

        const response = await this.openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content:
                "You are an expert portfolio content writer. Generate professional, engaging content that matches the user's requirements. Always return valid JSON that matches the expected schema structure.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error("No content received from OpenAI");
        }

        return JSON.parse(content);
      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed for ${section}:`, error);

        if (attempt === this.MAX_RETRIES) {
          throw error;
        }

        // Wait before retry
        await new Promise((resolve) =>
          setTimeout(resolve, this.RETRY_DELAY * attempt),
        );
      }
    }
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(input: UserInput): string {
    const keyData = {
      role: input.role,
      industry: input.industry,
      experience: input.experience,
      skills: input.skills.sort(),
      style: input.style,
      language: input.language,
      tone: input.tone,
      targetAudience: input.targetAudience,
    };
    return Buffer.from(JSON.stringify(keyData)).toString("base64");
  }

  /**
   * Get cached content
   */
  private getCachedContent(key: string): ContentSection | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.content;
  }

  /**
   * Set cached content
   */
  private setCachedContent(
    key: string,
    content: ContentSection,
    language: string,
  ): void {
    this.cache.set(key, {
      content,
      timestamp: Date.now(),
      language,
      hash: this.generateCacheKey({} as UserInput), // Simplified hash
    });
  }

  /**
   * Log generation analytics
   */
  private async logGeneration(
    input: UserInput,
    content: ContentSection,
  ): Promise<void> {
    try {
      await prisma.analytics.create({
        data: {
          userId: "system", // System-generated content
          event: "ai_content_generated",
          properties: {
            role: input.role,
            industry: input.industry,
            experience: input.experience,
            language: input.language,
            style: input.style,
            tone: input.tone,
            sectionsGenerated: Object.keys(content).length,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error("Failed to log generation analytics:", error);
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: any): Error {
    if (error instanceof z.ZodError) {
      return new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    }

    if (error instanceof OpenAI.APIError) {
      return new Error(`OpenAI API error: ${error.message}`);
    }

    return error instanceof Error ? error : new Error("Unknown error occurred");
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log("🗑️ Cache cleared");
  }

  /**
   * Get cache stats
   */
  getCacheStats(): {
    size: number;
    entries: Array<{ key: string; timestamp: number; language: string }>;
  } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      timestamp: entry.timestamp,
      language: entry.language,
    }));

    return {
      size: this.cache.size,
      entries,
    };
  }
}

// Export singleton instance
export const aiContentGenerator = new AIContentGenerator();
