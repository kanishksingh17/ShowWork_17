// OpenAI API Integration - Generates all textual content via GPT-4/GPT-3.5
export interface OpenAIConfig {
  apiKey: string;
  baseUrl?: string;
  model?: "gpt-4" | "gpt-3.5-turbo";
  maxTokens?: number;
  temperature?: number;
}

export interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ImageGenerationRequest {
  prompt: string;
  n?: number;
  size?: "256x256" | "512x512" | "1024x1024";
  response_format?: "url" | "b64_json";
}

export interface ImageGenerationResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
}

// OpenAI API Client
export class OpenAIClient {
  private config: OpenAIConfig;
  private baseUrl: string;

  constructor(config: OpenAIConfig) {
    this.config = {
      baseUrl: "https://api.openai.com/v1",
      model: "gpt-4",
      maxTokens: 2000,
      temperature: 0.7,
      ...config,
    };
    this.baseUrl = this.config.baseUrl!;
  }

  // Chat Completions API - /v1/chat/completions
  async createChatCompletion(
    request: ChatCompletionRequest,
  ): Promise<ChatCompletionResponse> {
    const url = `${this.baseUrl}/chat/completions`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model || this.config.model,
        messages: request.messages,
        max_tokens: request.max_tokens || this.config.maxTokens,
        temperature: request.temperature || this.config.temperature,
        top_p: request.top_p || 1,
        frequency_penalty: request.frequency_penalty || 0,
        presence_penalty: request.presence_penalty || 0,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `OpenAI API error: ${error.error?.message || response.statusText}`,
      );
    }

    return await response.json();
  }

  // Image Generation API - /v1/images/generations
  async generateImage(
    request: ImageGenerationRequest,
  ): Promise<ImageGenerationResponse> {
    const url = `${this.baseUrl}/images/generations`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: request.prompt,
        n: request.n || 1,
        size: request.size || "512x512",
        response_format: request.response_format || "url",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `OpenAI API error: ${error.error?.message || response.statusText}`,
      );
    }

    return await response.json();
  }
}

// Portfolio-specific OpenAI content generation
export class PortfolioContentGenerator {
  private openai: OpenAIClient;

  constructor(apiKey: string) {
    this.openai = new OpenAIClient({ apiKey });
  }

  // Generate professional bio
  async generateProfessionalBio(userData: any): Promise<string> {
    const prompt = `Generate a professional bio for a ${userData.title || "professional"} with the following information:
    
    Name: ${userData.name}
    Title: ${userData.title}
    Skills: ${userData.skills?.join(", ") || "various skills"}
    Experience: ${userData.experience?.length || 0} years
    Current Role: ${userData.currentRole || "Not specified"}
    
    Requirements:
    - 2-3 sentences maximum
    - Professional and engaging tone
    - Highlight key achievements and expertise
    - Include passion for technology/innovation
    - Optimized for portfolio websites
    
    Generate a compelling professional bio:`;

    const response = await this.openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a professional copywriter specializing in creating compelling bios for tech professionals and developers.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  }

  // Generate project descriptions
  async generateProjectDescription(project: any): Promise<string> {
    const prompt = `Generate a compelling project description for a ${project.language || "web"} project:
    
    Project Name: ${project.name}
    Technologies: ${project.technologies?.join(", ") || "various technologies"}
    Current Description: ${project.description || "No description provided"}
    Stars: ${project.stars || 0}
    Forks: ${project.forks || 0}
    
    Requirements:
    - 2-3 sentences maximum
    - Technical depth appropriate for developers
    - Highlight key features and technologies
    - Mention impact or scale if applicable
    - Professional and engaging tone
    
    Generate a compelling project description:`;

    const response = await this.openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a technical writer specializing in describing software projects for developer portfolios.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.6,
    });

    return response.choices[0].message.content.trim();
  }

  // Generate SEO metadata
  async generateSEOMetadata(userData: any): Promise<{
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  }> {
    const prompt = `Generate SEO metadata for a portfolio website:
    
    Name: ${userData.name}
    Title: ${userData.title}
    Skills: ${userData.skills?.join(", ") || "various skills"}
    Location: ${userData.location || "Not specified"}
    Industry: ${userData.industry || "Technology"}
    
    Generate:
    1. Meta title (50-60 characters)
    2. Meta description (150-160 characters)
    3. 5-7 relevant keywords
    
    Format as JSON with keys: metaTitle, metaDescription, keywords`;

    const response = await this.openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an SEO specialist creating optimized metadata for professional portfolio websites.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        metaTitle: `${userData.name} - ${userData.title} | Portfolio`,
        metaDescription: `Professional ${userData.title?.toLowerCase() || "developer"} specializing in ${userData.skills?.slice(0, 3).join(", ") || "web development"}.`,
        keywords: userData.skills?.slice(0, 5) || [
          "developer",
          "portfolio",
          "web development",
        ],
      };
    }
  }

  // Generate achievement descriptions
  async generateAchievementDescription(achievement: any): Promise<string> {
    const prompt = `Generate a compelling achievement description:
    
    Achievement: ${achievement.title || achievement.name}
    Context: ${achievement.context || "Professional achievement"}
    Impact: ${achievement.impact || "Not specified"}
    Technologies: ${achievement.technologies?.join(", ") || "various technologies"}
    
    Requirements:
    - 1-2 sentences maximum
    - Quantify impact where possible
    - Professional tone
    - Highlight technical skills
    
    Generate a compelling achievement description:`;

    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional writer creating achievement descriptions for resumes and portfolios.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
      temperature: 0.6,
    });

    return response.choices[0].message.content.trim();
  }

  // Generate color palette suggestions
  async generateColorPalette(
    industry: string,
    preferences?: any,
  ): Promise<string[]> {
    const prompt = `Suggest a professional color palette for a ${industry} portfolio website:
    
    Industry: ${industry}
    Preferences: ${preferences ? JSON.stringify(preferences) : "None specified"}
    
    Requirements:
    - 3-4 colors maximum
    - Professional and modern
    - Industry-appropriate
    - Good contrast for accessibility
    - Hex color codes
    
    Return as a JSON array of hex color codes:`;

    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a UI/UX designer specializing in color theory and professional web design.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      // Fallback color palettes by industry
      const fallbackPalettes = {
        developer: ["#1E40AF", "#3B82F6", "#8B5CF6"],
        creative: ["#F59E0B", "#EF4444", "#10B981"],
        business: ["#374151", "#6B7280", "#1F2937"],
        academic: ["#7C3AED", "#A855F7", "#C084FC"],
        freelancer: ["#F97316", "#FB923C", "#FED7AA"],
      };

      return fallbackPalettes[industry] || fallbackPalettes.developer;
    }
  }

  // Generate custom graphics/illustrations
  async generateCustomGraphics(description: string): Promise<string> {
    const prompt = `Create a professional illustration for a portfolio website: ${description}
    
    Style: Modern, minimalist, professional
    Colors: Blue and white theme
    Purpose: Portfolio website hero section
    Format: Clean vector-style illustration`;

    try {
      const response = await this.openai.generateImage({
        prompt,
        size: "512x512",
        response_format: "url",
      });

      return response.data[0].url || "";
    } catch (error) {
      console.error("Image generation failed:", error);
      return "";
    }
  }

  // Generate call-to-action text
  async generateCallToAction(context: string): Promise<{
    primaryCTA: string;
    secondaryCTA: string;
    contactCTA: string;
  }> {
    const prompt = `Generate compelling call-to-action text for a ${context} portfolio:
    
    Context: ${context}
    
    Generate:
    1. Primary CTA (for main action button)
    2. Secondary CTA (for secondary action)
    3. Contact CTA (for contact section)
    
    Requirements:
    - Action-oriented language
    - Professional tone
    - 2-4 words each
    - Industry-appropriate
    
    Return as JSON with keys: primaryCTA, secondaryCTA, contactCTA`;

    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a conversion copywriter specializing in effective call-to-action text for professional websites.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      return {
        primaryCTA: "View Projects",
        secondaryCTA: "Download CV",
        contactCTA: "Get In Touch",
      };
    }
  }
}

// Export the main content generation function
export const generatePortfolioContent = async (
  userData: any,
  apiKey: string,
) => {
  const generator = new PortfolioContentGenerator(apiKey);

  const [bio, seoMetadata, colorPalette, ctaText] = await Promise.all([
    generator.generateProfessionalBio(userData),
    generator.generateSEOMetadata(userData),
    generator.generateColorPalette(userData.industry || "developer"),
    generator.generateCallToAction(userData.industry || "developer"),
  ]);

  // Generate project descriptions
  const projectDescriptions = await Promise.all(
    (userData.projects || []).map((project) =>
      generator.generateProjectDescription(project),
    ),
  );

  // Generate achievement descriptions
  const achievementDescriptions = await Promise.all(
    (userData.achievements || []).map((achievement) =>
      generator.generateAchievementDescription(achievement),
    ),
  );

  return {
    bio,
    seoMetadata,
    colorPalette,
    ctaText,
    projectDescriptions,
    achievementDescriptions,
  };
};
