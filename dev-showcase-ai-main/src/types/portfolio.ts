export interface JobRole {
  id: string;
  title: string;
  industry: string;
  skills: string[];
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  description: string;
}

export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  jobRoles: string[];
  industries: string[];
  layout: "modern" | "creative" | "professional" | "minimal";
  sections: PortfolioSection[];
  preview: string;
  isPopular: boolean;
}

export interface PortfolioSection {
  id: string;
  type:
    | "hero"
    | "about"
    | "projects"
    | "skills"
    | "experience"
    | "education"
    | "contact"
    | "testimonials";
  title: string;
  content: string;
  isRequired: boolean;
  order: number;
}

export interface UserPortfolio {
  id: string;
  userId: string;
  templateId: string;
  jobRole: JobRole;
  sections: PortfolioSection[];
  customizations: PortfolioCustomization;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioCustomization {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: {
    spacing: "compact" | "normal" | "spacious";
    alignment: "left" | "center" | "right";
  };
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform:
    | "github"
    | "linkedin"
    | "twitter"
    | "instagram"
    | "website"
    | "email";
  url: string;
  isAutoFetched: boolean;
  isVisible: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  isFeatured: boolean;
  relevanceScore: number; // AI-calculated relevance to job role
}

export interface AIRecommendation {
  templateId: string;
  confidence: number;
  reasons: string[];
  suggestedCustomizations: Partial<PortfolioCustomization>;
}
