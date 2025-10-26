import {
  JobRole,
  PortfolioTemplate,
  UserPortfolio,
  Project,
  AIRecommendation,
  PortfolioCustomization,
} from "../types/portfolio";

export class PortfolioAIService {
  private openaiApiKey: string;

  constructor(apiKey: string) {
    this.openaiApiKey = apiKey;
  }

  /**
   * Extract job role from user data and projects
   */
  async extractJobRole(userData: any, projects: Project[]): Promise<JobRole> {
    const prompt = `
    Analyze the following user data and projects to determine the most suitable job role:
    
    User Data: ${JSON.stringify(userData)}
    Projects: ${JSON.stringify(projects)}
    
    Based on the technologies used, project types, and user information, determine:
    1. The most suitable job title
    2. The industry/sector
    3. Required skills
    4. Experience level (entry/mid/senior/lead)
    5. A brief description
    
    Return as JSON with the following structure:
    {
      "title": "string",
      "industry": "string", 
      "skills": ["string"],
      "experienceLevel": "entry|mid|senior|lead",
      "description": "string"
    }
    `;

    try {
      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error("Error extracting job role:", error);
      return this.getDefaultJobRole();
    }
  }

  /**
   * Get AI recommendations for portfolio templates
   */
  async getPortfolioRecommendations(
    jobRole: JobRole,
    userData: any,
    projects: Project[],
  ): Promise<AIRecommendation[]> {
    const prompt = `
    Based on the job role and user profile, recommend the best portfolio templates:
    
    Job Role: ${JSON.stringify(jobRole)}
    User Data: ${JSON.stringify(userData)}
    Projects: ${JSON.stringify(projects)}
    
    Recommend 3-5 portfolio templates with:
    1. Template ID
    2. Confidence score (0-1)
    3. Reasons for recommendation
    4. Suggested customizations
    
    Return as JSON array with this structure:
    [
      {
        "templateId": "string",
        "confidence": 0.95,
        "reasons": ["reason1", "reason2"],
        "suggestedCustomizations": {
          "colors": {...},
          "fonts": {...}
        }
      }
    ]
    `;

    try {
      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return [];
    }
  }

  /**
   * Generate AI-customized content for portfolio sections
   */
  async generatePortfolioContent(
    section: string,
    jobRole: JobRole,
    userData: any,
    projects: Project[],
  ): Promise<string> {
    const prompt = `
    Generate compelling content for the "${section}" section of a portfolio for someone applying to:
    
    Job Role: ${jobRole.title} in ${jobRole.industry}
    Required Skills: ${jobRole.skills.join(", ")}
    Experience Level: ${jobRole.experienceLevel}
    
    User Information: ${JSON.stringify(userData)}
    Projects: ${JSON.stringify(projects)}
    
    Generate professional, engaging content that:
    1. Highlights relevant skills and experience
    2. Showcases projects that align with the job role
    3. Uses industry-appropriate language
    4. Demonstrates value proposition
    5. Is optimized for ATS systems
    
    Make it compelling and tailored to maximize job application success.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error("Error generating content:", error);
      return this.getDefaultContent(section);
    }
  }

  /**
   * Calculate project relevance score for job role
   */
  async calculateProjectRelevance(
    project: Project,
    jobRole: JobRole,
  ): Promise<number> {
    const prompt = `
    Calculate the relevance score (0-1) for this project to the job role:
    
    Project: ${JSON.stringify(project)}
    Job Role: ${JSON.stringify(jobRole)}
    
    Consider:
    1. Technology alignment
    2. Project type relevance
    3. Complexity level
    4. Industry relevance
    
    Return only a number between 0 and 1.
    `;

    try {
      const response = await this.callOpenAI(prompt);
      return parseFloat(response.trim());
    } catch (error) {
      console.error("Error calculating relevance:", error);
      return 0.5; // Default neutral score
    }
  }

  /**
   * Generate optimized resume/CV content
   */
  async generateResumeContent(
    jobRole: JobRole,
    userData: any,
    projects: Project[],
    format: "resume" | "cv" = "resume",
  ): Promise<string> {
    const prompt = `
    Generate a professional ${format.toUpperCase()} optimized for this job role:
    
    Job Role: ${jobRole.title} in ${jobRole.industry}
    Required Skills: ${jobRole.skills.join(", ")}
    
    User Data: ${JSON.stringify(userData)}
    Projects: ${JSON.stringify(projects)}
    
    Format: ${format}
    
    Generate content that:
    1. Uses industry-standard formatting
    2. Highlights relevant experience and skills
    3. Is ATS-optimized
    4. Demonstrates quantifiable achievements
    5. Is tailored to the specific role
    
    Return the content in the requested format.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error("Error generating resume:", error);
      return this.getDefaultResumeContent();
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert career advisor and portfolio consultant. Provide professional, tailored advice for job applications and portfolio optimization.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private getDefaultJobRole(): JobRole {
    return {
      id: "default",
      title: "Software Developer",
      industry: "Technology",
      skills: ["JavaScript", "React", "Node.js"],
      experienceLevel: "mid",
      description:
        "Full-stack developer with experience in modern web technologies",
    };
  }

  private getDefaultContent(section: string): string {
    const defaultContent = {
      hero: "Passionate developer with expertise in modern technologies and a track record of delivering high-quality solutions.",
      about:
        "Experienced professional with a strong background in software development and a passion for creating innovative solutions.",
      projects:
        "Here are some of my recent projects that demonstrate my skills and experience.",
      skills:
        "Technical skills and expertise in various technologies and frameworks.",
      experience:
        "Professional experience in software development and related fields.",
    };

    return (
      defaultContent[section as keyof typeof defaultContent] ||
      "Content not available."
    );
  }

  private getDefaultResumeContent(): string {
    return `
# Professional Resume

## Contact Information
[Your contact details will be auto-populated]

## Professional Summary
Experienced professional with expertise in relevant technologies and a proven track record of success.

## Skills
- Technical skills relevant to the position
- Soft skills and competencies

## Experience
- Professional experience and achievements
- Quantifiable results and impact

## Education
- Educational background and qualifications

## Projects
- Relevant projects and accomplishments
    `.trim();
  }
}
