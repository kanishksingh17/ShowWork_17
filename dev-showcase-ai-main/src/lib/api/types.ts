// API Types and Interfaces

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GenerateContentRequest {
  type:
    | "hero"
    | "about"
    | "skills"
    | "projects"
    | "contact"
    | "testimonials"
    | "blog"
    | "seo";
  userProfile: {
    name: string;
    role: string;
    industry: string;
    experience: number;
    skills: string[];
    projects?: Array<{
      title: string;
      description: string;
      technologies: string[];
      url?: string;
    }>;
    style?: "professional" | "creative" | "minimalist" | "modern";
    colorPreferences?: string[];
    language?: string;
  };
  context?: {
    existingContent?: string;
    targetAudience?: string;
    tone?: "formal" | "casual" | "friendly" | "authoritative";
    length?: "short" | "medium" | "long";
  };
}

export interface GenerateContentResponse {
  content: string;
  metadata: {
    wordCount: number;
    readingTime: number;
    keywords: string[];
    suggestions: string[];
    confidence: number;
  };
  alternatives?: string[];
}

export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  description: string;
  template: string;
  content: Record<string, any>;
  settings: {
    theme: string;
    colors: string[];
    fonts: string[];
    animations: boolean;
    responsive: boolean;
  };
  status: "draft" | "published" | "archived";
  visibility: "public" | "private" | "unlisted";
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  analytics: {
    views: number;
    uniqueViews: number;
    lastViewed?: string;
    createdAt: string;
    updatedAt: string;
  };
  customDomain?: string;
  publishedAt?: string;
  archivedAt?: string;
}

export interface CreatePortfolioRequest {
  title: string;
  description: string;
  template: string;
  content?: Record<string, any>;
  settings?: {
    theme?: string;
    colors?: string[];
    fonts?: string[];
    animations?: boolean;
    responsive?: boolean;
  };
  visibility?: "public" | "private" | "unlisted";
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
  customDomain?: string;
}

export interface UpdatePortfolioRequest
  extends Partial<CreatePortfolioRequest> {
  id: string;
}

export interface PreviewRequest {
  portfolioId: string;
  device: {
    type: "desktop" | "tablet" | "mobile";
    width: number;
    height: number;
    orientation: "portrait" | "landscape";
    pixelRatio: number;
  };
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  options: {
    includeAssets: boolean;
    optimizeImages: boolean;
    minifyCode: boolean;
    seoOptimized: boolean;
    responsive: boolean;
    analytics: boolean;
  };
}

export interface PreviewResponse {
  html: string;
  css: string;
  js: string;
  assets: Array<{
    type: "image" | "font" | "icon" | "video";
    url: string;
    size: number;
    optimized: boolean;
  }>;
  metadata: {
    renderTime: number;
    bundleSize: number;
    componentCount: number;
    performanceScore: number;
  };
  previewUrl: string;
  expiresAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "premium";
  subscription?: {
    plan: "free" | "pro" | "enterprise";
    expiresAt: string;
    features: string[];
  };
  limits: {
    portfolios: number;
    exports: number;
    apiCalls: number;
    storage: number; // in MB
  };
  usage: {
    portfolios: number;
    exports: number;
    apiCalls: number;
    storage: number;
  };
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  requestId: string;
  userId?: string;
}

export interface LogEntry {
  level: "info" | "warn" | "error" | "debug";
  message: string;
  data?: any;
  userId?: string;
  requestId: string;
  timestamp: string;
  endpoint: string;
  method: string;
  ip: string;
  userAgent: string;
  duration: number;
  statusCode: number;
}

export interface UsageAnalytics {
  userId: string;
  endpoint: string;
  method: string;
  timestamp: string;
  duration: number;
  statusCode: number;
  requestSize: number;
  responseSize: number;
  userAgent: string;
  ip: string;
  features: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ApiConfig {
  rateLimits: {
    windowMs: number;
    max: number;
    skipSuccessfulRequests: boolean;
    skipFailedRequests: boolean;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshTokenExpiresIn: string;
  };
  ai: {
    openaiApiKey: string;
    maxTokens: number;
    temperature: number;
    model: string;
  };
  storage: {
    maxFileSize: number;
    allowedTypes: string[];
    bucket: string;
  };
  preview: {
    cacheTtl: number;
    maxConcurrent: number;
    timeout: number;
  };
}
