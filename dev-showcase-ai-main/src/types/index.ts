// Core TypeScript Interfaces for ShowWork Portfolio Builder
import { User, Portfolio, Project, Skill, Experience, Education, Testimonial, Template, Analytics } from '@prisma/client'

// User Types
export interface UserProfile extends User {
  portfolios: Portfolio[]
  projects: Project[]
  skills: Skill[]
  experiences: Experience[]
  educations: Education[]
  testimonials: Testimonial[]
  analytics: Analytics[]
}

// Portfolio Types
export interface PortfolioWithDetails extends Portfolio {
  user: User
  projects: Project[]
  analytics: Analytics[]
  template?: Template
}

// Project Types
export interface ProjectWithDetails extends Project {
  user: User
  portfolio?: Portfolio
}

// Template Types
export interface TemplateWithDetails extends Template {
  user?: User
}

// Analytics Types
export interface AnalyticsWithDetails extends Analytics {
  user: User
  portfolio?: Portfolio
}

// Atomic Design Types
export interface AtomConfig {
  id: string
  name: string
  type: 'button' | 'typography' | 'color' | 'spacing' | 'border' | 'shadow' | 'icon'
  variants: string[]
  properties: Record<string, any>
}

export interface MoleculeConfig {
  id: string
  name: string
  type: 'navigation' | 'card' | 'form' | 'button-group' | 'media' | 'text-group' | 'layout'
  atoms: string[]
  variants: string[]
  properties: Record<string, any>
}

export interface OrganismConfig {
  id: string
  name: string
  type: 'header' | 'hero' | 'about' | 'projects' | 'skills' | 'experience' | 'contact' | 'footer' | 'gallery' | 'testimonials'
  molecules: string[]
  variants: string[]
  properties: Record<string, any>
  layout: {
    container: string
    sections: string[]
    responsive: Record<string, any>
  }
}

export interface TemplateConfig {
  id: string
  name: string
  industry: string
  organisms: string[]
  variants: string[]
  properties: Record<string, any>
  layout: {
    structure: string[]
    responsive: Record<string, any>
    performance: {
      lighthouseScore: number
      loadTime: number
      bundleSize: number
    }
  }
}

// Infinite Combinations Types
export interface InfiniteCombination {
  template: TemplateConfig
  organisms: OrganismConfig[]
  molecules: MoleculeConfig[]
  atoms: AtomConfig[]
  uniquenessScore: number
  performanceScore: number
  generatedAt: string
  metadata: {
    generationSeed: string
    aiEnhanced: boolean
    totalCombinations: number
  }
}

// AI Generation Types
export interface AIGenerationRequest {
  userId: string
  templateId: string
  userData: {
    name: string
    title: string
    bio?: string
    skills: string[]
    projects: Array<{
      name: string
      description: string
      technologies: string[]
      stars?: number
      forks?: number
    }>
    experience: Array<{
      company: string
      position: string
      duration: string
      description: string
    }>
    preferences?: {
      customDomain?: string
      colorScheme?: string[]
      animationStyle?: 'subtle' | 'dynamic' | 'minimal'
    }
  }
}

export interface AIGenerationResponse {
  portfolioId: string
  url: string
  customUrl?: string
  deploymentId: string
  performance: {
    pageSpeed: number
    loadTime: number
    bundleSize: number
  }
  analytics: {
    trackingId: string
    customEvents: string[]
  }
  combination: InfiniteCombination
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form Types
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface PortfolioFormData {
  name: string
  description: string
  isPublic: boolean
  templateId: string
  customDomain?: string
}

export interface ProjectFormData {
  name: string
  description: string
  longDescription?: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  category?: string
  startDate?: Date
  endDate?: Date
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
}

export interface SkillFormData {
  name: string
  category: string
  level: number
  years: number
  isFeatured: boolean
}

export interface ExperienceFormData {
  company: string
  position: string
  description?: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
  location?: string
  achievements: string[]
  technologies: string[]
}

export interface EducationFormData {
  institution: string
  degree: string
  field?: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
  gpa?: number
  achievements: string[]
}

export interface TestimonialFormData {
  name: string
  position: string
  company: string
  content: string
  rating: number
  isPublic: boolean
}

// Authentication Types
export interface AuthUser {
  id: string
  name?: string
  email: string
  image?: string
  role: 'USER' | 'ADMIN' | 'PREMIUM'
}

export interface AuthSession {
  user: AuthUser
  expires: string
}

// Error Types
export interface AppError {
  message: string
  code?: string
  statusCode?: number
  details?: any
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

// Analytics Types
export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  portfolioId?: string
  timestamp?: Date
}

export interface AnalyticsData {
  overview: {
    totalViews: number
    uniqueVisitors: number
    bounceRate: number
    avgSessionDuration: number
    pageViews: number
    newVisitors: number
    returningVisitors: number
    conversionRate: number
  }
  traffic: {
    daily: Array<{ date: string; views: number; visitors: number }>
    weekly: Array<{ week: string; views: number; visitors: number }>
    monthly: Array<{ month: string; views: number; visitors: number }>
    sources: Array<{ source: string; views: number; percentage: number }>
  }
  performance: {
    pageLoadTime: number
    lighthouseScore: number
    coreWebVitals: {
      lcp: number
      fid: number
      cls: number
    }
    mobileScore: number
    desktopScore: number
    seoScore: number
    accessibilityScore: number
  }
  conversions: {
    totalConversions: number
    conversionRate: number
    goalCompletions: Array<{ goal: string; completions: number; rate: number }>
    funnelData: Array<{ step: string; visitors: number; dropoff: number }>
  }
  demographics: {
    countries: Array<{ country: string; visitors: number; percentage: number }>
    cities: Array<{ city: string; visitors: number; percentage: number }>
    languages: Array<{ language: string; visitors: number; percentage: number }>
    ageGroups: Array<{ age: string; visitors: number; percentage: number }>
  }
  devices: {
    devices: Array<{ device: string; visitors: number; percentage: number }>
    browsers: Array<{ browser: string; visitors: number; percentage: number }>
    operatingSystems: Array<{ os: string; visitors: number; percentage: number }>
    screenSizes: Array<{ size: string; visitors: number; percentage: number }>
  }
}

// 3D Types
export interface ThreeDConfig {
  enabled: boolean
  performance: 'high' | 'medium' | 'low'
  background: 'space' | 'particles' | 'geometric' | 'minimal'
  camera: {
    position: [number, number, number]
    fov: number
  }
  lighting: {
    ambient: number
    directional: number
    point: number
  }
  animations: {
    enabled: boolean
    style: 'fade' | 'slide' | 'zoom' | 'rotate' | 'bounce'
    duration: number
    easing: string
  }
}

// File Upload Types
export interface FileUpload {
  file: File
  type: 'image' | 'video' | 'document'
  size: number
  url?: string
  progress?: number
  error?: string
}

export interface ImageUpload extends FileUpload {
  type: 'image'
  dimensions?: {
    width: number
    height: number
  }
  alt?: string
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  category?: string
  industry?: string
  complexity?: 'beginner' | 'intermediate' | 'advanced'
  price?: 'free' | 'premium'
  rating?: number
  features?: string[]
  sortBy?: 'name' | 'rating' | 'downloads' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Notification Types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Theme Types
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textMuted: string
  }
  typography: {
    fontFamily: string
    headingFont: string
    bodyFont: string
    sizes: {
      h1: string
      h2: string
      h3: string
      body: string
      small: string
    }
  }
  spacing: {
    section: string
    component: string
    element: string
  }
  animations: {
    enabled: boolean
    style: string
    duration: number
    easing: string
  }
}

// Export all types
export type {
  UserProfile,
  PortfolioWithDetails,
  ProjectWithDetails,
  TemplateWithDetails,
  AnalyticsWithDetails,
  AtomConfig,
  MoleculeConfig,
  OrganismConfig,
  TemplateConfig,
  InfiniteCombination,
  AIGenerationRequest,
  AIGenerationResponse,
  ApiResponse,
  PaginatedResponse,
  ContactFormData,
  PortfolioFormData,
  ProjectFormData,
  SkillFormData,
  ExperienceFormData,
  EducationFormData,
  TestimonialFormData,
  AuthUser,
  AuthSession,
  AppError,
  ValidationError,
  AnalyticsEvent,
  AnalyticsData,
  ThreeDConfig,
  FileUpload,
  ImageUpload,
  SearchFilters,
  Notification,
  ThemeConfig
}
