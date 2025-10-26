// AI Content Generation API Route

import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  createErrorResponse,
  createSuccessResponse,
  trackUsage,
  checkUsageLimit,
  hasFeatureAccess,
} from "../../../lib/api/middleware";
import {
  GenerateContentRequestSchema,
  GenerateContentResponse,
} from "../../../lib/api/schemas";
import { GenerateContentRequest, AuthUser } from "../../../lib/api/types";

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Content generation prompts
const CONTENT_PROMPTS = {
  hero: (profile: any) => `
    Create a compelling hero section for a ${profile.role} in the ${profile.industry} industry.
    Name: ${profile.name}
    Experience: ${profile.experience} years
    Style: ${profile.style || "professional"}
    Tone: ${profile.context?.tone || "professional"}
    
    Include:
    - Eye-catching headline
    - Brief value proposition
    - Call-to-action button text
    - Professional tagline
    
    Make it engaging and conversion-focused.
  `,

  about: (profile: any) => `
    Write an about section for ${profile.name}, a ${profile.role} with ${profile.experience} years of experience in ${profile.industry}.
    
    Skills: ${profile.skills.join(", ")}
    Style: ${profile.style || "professional"}
    Tone: ${profile.context?.tone || "professional"}
    Length: ${profile.context?.length || "medium"}
    
    Include:
    - Professional background
    - Key achievements
    - Personal touch
    - What drives them
    
    Make it authentic and compelling.
  `,

  skills: (profile: any) => `
    Create a skills section for ${profile.name}, a ${profile.role}.
    
    Skills: ${profile.skills.join(", ")}
    Experience: ${profile.experience} years
    Industry: ${profile.industry}
    
    For each skill, provide:
    - Skill name
    - Proficiency level (Beginner, Intermediate, Advanced, Expert)
    - Brief description
    - Years of experience
    
    Format as a structured list.
  `,

  projects: (profile: any) => `
    Write project descriptions for ${profile.name}, a ${profile.role}.
    
    Projects: ${JSON.stringify(profile.projects || [])}
    Style: ${profile.style || "professional"}
    Tone: ${profile.context?.tone || "professional"}
    
    For each project, include:
    - Project title
    - Brief description
    - Technologies used
    - Key achievements
    - Impact/results
    
    Make each project sound impressive and detailed.
  `,

  contact: (profile: any) => `
    Create a contact section for ${profile.name}, a ${profile.role}.
    
    Name: ${profile.name}
    Role: ${profile.role}
    Industry: ${profile.industry}
    Style: ${profile.style || "professional"}
    Tone: ${profile.context?.tone || "professional"}
    
    Include:
    - Professional contact message
    - Call-to-action
    - Availability
    - Preferred contact methods
    
    Make it inviting and professional.
  `,

  testimonials: (profile: any) => `
    Generate testimonials for ${profile.name}, a ${profile.role} in ${profile.industry}.
    
    Experience: ${profile.experience} years
    Skills: ${profile.skills.join(", ")}
    Style: ${profile.style || "professional"}
    
    Create 3-5 realistic testimonials from:
    - Clients
    - Colleagues
    - Managers
    - Industry peers
    
    Include:
    - Person's name and title
    - Company/organization
    - Testimonial text
    - Rating (4-5 stars)
    
    Make them authentic and specific.
  `,

  blog: (profile: any) => `
    Suggest blog post ideas for ${profile.name}, a ${profile.role} in ${profile.industry}.
    
    Skills: ${profile.skills.join(", ")}
    Experience: ${profile.experience} years
    Industry: ${profile.industry}
    
    Provide 5-7 blog post ideas including:
    - Title
    - Brief description
    - Target audience
    - Key points to cover
    - Estimated reading time
    
    Focus on industry insights and expertise.
  `,

  seo: (profile: any) => `
    Generate SEO metadata for ${profile.name}'s portfolio.
    
    Name: ${profile.name}
    Role: ${profile.role}
    Industry: ${profile.industry}
    Skills: ${profile.skills.join(", ")}
    Experience: ${profile.experience} years
    
    Provide:
    - Meta title (50-60 characters)
    - Meta description (150-160 characters)
    - Keywords (10-15 relevant keywords)
    - Open Graph title
    - Open Graph description
    - Twitter card content
    
    Optimize for search visibility.
  `,
};

// Generate content using OpenAI
async function generateContentWithOpenAI(
  prompt: string,
  options: {
    maxTokens?: number;
    temperature?: number;
    model?: string;
  } = {},
): Promise<string> {
  const { maxTokens = 1000, temperature = 0.7, model = "gpt-4" } = options;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a professional content writer specializing in portfolio and personal branding content. Create engaging, professional, and conversion-focused content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `OpenAI API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

// Calculate content metrics
function calculateContentMetrics(content: string) {
  const words = content.split(/\s+/).length;
  const readingTime = Math.ceil(words / 200); // 200 words per minute
  const keywords = content.match(/\b\w{4,}\b/g) || [];
  const uniqueKeywords = [...new Set(keywords)].slice(0, 10);

  return {
    wordCount: words,
    readingTime,
    keywords: uniqueKeywords,
    suggestions: generateSuggestions(content),
    confidence: Math.min(95, Math.max(60, 100 - (words < 50 ? 20 : 0))),
  };
}

// Generate content suggestions
function generateSuggestions(content: string): string[] {
  const suggestions = [];

  if (content.length < 100) {
    suggestions.push(
      "Consider adding more detail to make the content more engaging",
    );
  }

  if (!content.includes("!") && !content.includes("?")) {
    suggestions.push("Add some variety with questions or exclamations");
  }

  if (content.split(".").length < 3) {
    suggestions.push("Break up long sentences for better readability");
  }

  if (!content.match(/\d+/)) {
    suggestions.push(
      "Include specific numbers or statistics to add credibility",
    );
  }

  return suggestions;
}

// Generate alternative content
async function generateAlternatives(
  originalContent: string,
  prompt: string,
  count: number = 2,
): Promise<string[]> {
  const alternatives = [];

  for (let i = 0; i < count; i++) {
    try {
      const alternativePrompt = `${prompt}\n\nCreate an alternative version with a different approach or tone.`;
      const content = await generateContentWithOpenAI(alternativePrompt, {
        temperature: 0.8 + i * 0.1, // Vary temperature for different styles
      });
      alternatives.push(content);
    } catch (error) {
      console.error(`Failed to generate alternative ${i + 1}:`, error);
    }
  }

  return alternatives;
}

// Main API handler
async function handleGenerateContent(
  request: NextRequest,
  user: AuthUser,
): Promise<NextResponse> {
  const startTime = Date.now();
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  try {
    // Check usage limits
    if (!checkUsageLimit(user, "apiCalls", 1)) {
      return createErrorResponse(
        {
          code: "USAGE_LIMIT_EXCEEDED",
          message: "API call limit exceeded",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        429,
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = GenerateContentRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
          requestId,
        },
        { status: 400 },
      );
    }

    const { type, userProfile, context } = validationResult.data;

    // Check if user has access to AI features
    if (!hasFeatureAccess(user, "ai_content_generation")) {
      return createErrorResponse(
        {
          code: "FEATURE_NOT_AVAILABLE",
          message: "AI content generation is not available in your plan",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        403,
      );
    }

    // Generate the prompt
    const prompt = CONTENT_PROMPTS[type]({ ...userProfile, context });

    // Generate content
    const content = await generateContentWithOpenAI(prompt, {
      maxTokens: type === "seo" ? 500 : 1000,
      temperature: context?.tone === "creative" ? 0.8 : 0.7,
    });

    // Calculate metrics
    const metadata = calculateContentMetrics(content);

    // Generate alternatives if requested
    let alternatives: string[] = [];
    if (context?.length === "long" || type === "hero") {
      try {
        alternatives = await generateAlternatives(content, prompt, 2);
      } catch (error) {
        console.error("Failed to generate alternatives:", error);
      }
    }

    // Prepare response
    const response: GenerateContentResponse = {
      content,
      metadata,
      alternatives: alternatives.length > 0 ? alternatives : undefined,
    };

    // Update usage
    user.usage.apiCalls++;

    // Track usage analytics
    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      "/api/generate",
      "POST",
      duration,
      200,
      JSON.stringify(body).length,
      JSON.stringify(response).length,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["ai_content_generation", type],
    );

    return createSuccessResponse(response, "Content generated successfully");
  } catch (error) {
    console.error("Content generation error:", error);

    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      "/api/generate",
      "POST",
      duration,
      500,
      0,
      0,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["ai_content_generation"],
    );

    return createErrorResponse(
      {
        code: "GENERATION_FAILED",
        message: "Failed to generate content",
        timestamp: new Date().toISOString(),
        requestId,
        userId: user.id,
      },
      500,
    );
  }
}

// Export the handler with authentication and rate limiting
export const POST = withAuth(handleGenerateContent, {
  requiredRole: "user",
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per 15 minutes
  },
});

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Request-ID",
      "Access-Control-Max-Age": "86400",
    },
  });
}
