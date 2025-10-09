// Professional Template System - Modular Components for Portfolio Excellence
export interface ProfessionalTemplate {
  id: string;
  name: string;
  category: 'developer' | 'creative' | 'business' | 'academic' | 'freelancer';
  type: '3d' | 'classic' | 'minimal' | 'corporate';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  industry: string[];
  features: ProfessionalFeature[];
  components: TemplateComponent[];
  customization: CustomizationOptions;
  performance: PerformanceMetrics;
  seo: SEOOptimization;
  accessibility: AccessibilityFeatures;
  responsive: ResponsiveDesign;
  analytics: AnalyticsIntegration;
}

export interface ProfessionalFeature {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'about' | 'projects' | 'skills' | 'experience' | 'contact' | '3d' | 'interactive';
  required: boolean;
  configurable: boolean;
  dependencies: string[];
}

export interface TemplateComponent {
  id: string;
  name: string;
  type: 'hero' | 'about' | 'projects' | 'skills' | 'experience' | 'contact' | '3d' | 'interactive';
  props: ComponentProps;
  styles: ComponentStyles;
  animations: AnimationConfig;
  responsive: ResponsiveConfig;
  accessibility: AccessibilityConfig;
}

export interface CustomizationOptions {
  colors: ColorPalette;
  typography: TypographySystem;
  layout: LayoutOptions;
  animations: AnimationOptions;
  branding: BrandingOptions;
}

export interface PerformanceMetrics {
  lighthouseScore: number;
  loadTime: number;
  bundleSize: number;
  mobileOptimized: boolean;
  seoScore: number;
  accessibilityScore: number;
}

// Professional Template Database
export const PROFESSIONAL_TEMPLATES: ProfessionalTemplate[] = [
  {
    id: 'pro-dev-neo-001',
    name: 'Neo Developer Pro',
    category: 'developer',
    type: '3d',
    complexity: 'advanced',
    industry: ['technology', 'software', 'startups'],
    features: [
      {
        id: '3d-hero',
        name: '3D Interactive Hero',
        description: 'Immersive 3D hero section with interactive elements',
        category: '3d',
        required: true,
        configurable: true,
        dependencies: ['react-three-fiber', 'three.js']
      },
      {
        id: 'code-visualization',
        name: 'Code Visualization',
        description: 'Animated code snippets and technical demonstrations',
        category: 'interactive',
        required: false,
        configurable: true,
        dependencies: ['prism.js', 'framer-motion']
      },
      {
        id: 'project-showcase',
        name: 'Advanced Project Showcase',
        description: 'Interactive project gallery with detailed case studies',
        category: 'projects',
        required: true,
        configurable: true,
        dependencies: ['swiper', 'lightbox']
      }
    ],
    components: [
      {
        id: 'hero-3d',
        name: '3D Hero Section',
        type: 'hero',
        props: {
          title: 'string',
          subtitle: 'string',
          ctaText: 'string',
          background: '3d-scene',
          particles: 'boolean'
        },
        styles: {
          primary: '#1E40AF',
          secondary: '#3B82F6',
          accent: '#8B5CF6',
          background: 'gradient'
        },
        animations: {
          type: '3d-rotation',
          duration: 2000,
          easing: 'ease-in-out'
        },
        responsive: {
          mobile: 'simplified-3d',
          tablet: 'reduced-complexity',
          desktop: 'full-3d'
        },
        accessibility: {
          reducedMotion: '2d-fallback',
          screenReader: 'descriptive-text',
          keyboard: 'tab-navigation'
        }
      }
    ],
    customization: {
      colors: {
        primary: '#1E40AF',
        secondary: '#3B82F6',
        accent: '#8B5CF6',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#FFFFFF',
        textMuted: '#94A3B8'
      },
      typography: {
        fontFamily: 'Inter',
        headingFont: 'Inter',
        bodyFont: 'Inter',
        sizes: {
          h1: '4rem',
          h2: '2.5rem',
          h3: '1.875rem',
          body: '1rem',
          small: '0.875rem'
        }
      },
      layout: {
        container: 'max-width-1200',
        spacing: 'consistent',
        grid: 'responsive',
        sections: 'modular'
      },
      animations: {
        enabled: true,
        duration: 'medium',
        easing: 'smooth',
        reducedMotion: true
      },
      branding: {
        logo: 'customizable',
        favicon: 'auto-generated',
        socialLinks: 'configurable'
      }
    },
    performance: {
      lighthouseScore: 95,
      loadTime: 1.2,
      bundleSize: 280,
      mobileOptimized: true,
      seoScore: 98,
      accessibilityScore: 96
    },
    seo: {
      structuredData: true,
      metaOptimization: true,
      sitemap: true,
      robots: true,
      socialSharing: true
    },
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigation: true,
      screenReader: true,
      colorContrast: true,
      reducedMotion: true
    },
    responsive: {
      breakpoints: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px',
        large: '1440px'
      },
      mobileFirst: true,
      touchOptimized: true,
      performanceOptimized: true
    },
    analytics: {
      googleAnalytics: true,
      customEvents: true,
      performanceTracking: true,
      userBehavior: true
    }
  },
  {
    id: 'pro-creative-vision-001',
    name: 'Creative Vision Pro',
    category: 'creative',
    type: '3d',
    complexity: 'intermediate',
    industry: ['design', 'art', 'photography', 'marketing'],
    features: [
      {
        id: 'portfolio-gallery',
        name: '3D Portfolio Gallery',
        description: 'Interactive 3D gallery with smooth transitions',
        category: '3d',
        required: true,
        configurable: true,
        dependencies: ['react-three-fiber', 'gsap']
      },
      {
        id: 'creative-showcase',
        name: 'Creative Work Showcase',
        description: 'Advanced showcase for creative projects',
        category: 'projects',
        required: true,
        configurable: true,
        dependencies: ['swiper', 'lightbox']
      }
    ],
    components: [
      {
        id: 'creative-hero',
        name: 'Creative Hero Section',
        type: 'hero',
        props: {
          title: 'string',
          tagline: 'string',
          portfolioPreview: 'image-gallery',
          ctaText: 'string'
        },
        styles: {
          primary: '#F59E0B',
          secondary: '#EF4444',
          accent: '#10B981',
          background: 'creative-gradient'
        },
        animations: {
          type: 'creative-entrance',
          duration: 1500,
          easing: 'creative-bounce'
        },
        responsive: {
          mobile: 'stacked-layout',
          tablet: 'side-by-side',
          desktop: 'full-creative'
        },
        accessibility: {
          reducedMotion: 'static-fallback',
          screenReader: 'creative-descriptions',
          keyboard: 'creative-navigation'
        }
      }
    ],
    customization: {
      colors: {
        primary: '#F59E0B',
        secondary: '#EF4444',
        accent: '#10B981',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        text: '#1F2937',
        textMuted: '#6B7280'
      },
      typography: {
        fontFamily: 'Poppins',
        headingFont: 'Poppins',
        bodyFont: 'Inter',
        sizes: {
          h1: '3.5rem',
          h2: '2.25rem',
          h3: '1.5rem',
          body: '1rem',
          small: '0.875rem'
        }
      },
      layout: {
        container: 'max-width-1400',
        spacing: 'creative',
        grid: 'creative-masonry',
        sections: 'creative-flow'
      },
      animations: {
        enabled: true,
        duration: 'creative',
        easing: 'creative-bounce',
        reducedMotion: true
      },
      branding: {
        logo: 'creative-customizable',
        favicon: 'creative-generated',
        socialLinks: 'creative-configurable'
      }
    },
    performance: {
      lighthouseScore: 92,
      loadTime: 1.5,
      bundleSize: 320,
      mobileOptimized: true,
      seoScore: 95,
      accessibilityScore: 94
    },
    seo: {
      structuredData: true,
      metaOptimization: true,
      sitemap: true,
      robots: true,
      socialSharing: true
    },
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigation: true,
      screenReader: true,
      colorContrast: true,
      reducedMotion: true
    },
    responsive: {
      breakpoints: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px',
        large: '1440px'
      },
      mobileFirst: true,
      touchOptimized: true,
      performanceOptimized: true
    },
    analytics: {
      googleAnalytics: true,
      customEvents: true,
      performanceTracking: true,
      userBehavior: true
    }
  }
];

// Template Management System
export class ProfessionalTemplateManager {
  private templates: ProfessionalTemplate[];
  
  constructor() {
    this.templates = PROFESSIONAL_TEMPLATES;
  }
  
  // Get templates by category
  getTemplatesByCategory(category: string): ProfessionalTemplate[] {
    return this.templates.filter(template => template.category === category);
  }
  
  // Get templates by industry
  getTemplatesByIndustry(industry: string): ProfessionalTemplate[] {
    return this.templates.filter(template => 
      template.industry.includes(industry.toLowerCase())
    );
  }
  
  // Get templates by complexity
  getTemplatesByComplexity(complexity: string): ProfessionalTemplate[] {
    return this.templates.filter(template => template.complexity === complexity);
  }
  
  // Get high-performance templates
  getHighPerformanceTemplates(minScore: number = 90): ProfessionalTemplate[] {
    return this.templates.filter(template => 
      template.performance.lighthouseScore >= minScore
    );
  }
  
  // Get accessible templates
  getAccessibleTemplates(): ProfessionalTemplate[] {
    return this.templates.filter(template => 
      template.accessibility.wcagLevel === 'AA'
    );
  }
  
  // Get mobile-optimized templates
  getMobileOptimizedTemplates(): ProfessionalTemplate[] {
    return this.templates.filter(template => 
      template.performance.mobileOptimized
    );
  }
  
  // Get template by ID
  getTemplateById(id: string): ProfessionalTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }
  
  // Search templates
  searchTemplates(query: string): ProfessionalTemplate[] {
    const searchTerm = query.toLowerCase();
    return this.templates.filter(template => 
      template.name.toLowerCase().includes(searchTerm) ||
      template.category.toLowerCase().includes(searchTerm) ||
      template.industry.some(industry => industry.toLowerCase().includes(searchTerm)) ||
      template.features.some(feature => 
        feature.name.toLowerCase().includes(searchTerm) ||
        feature.description.toLowerCase().includes(searchTerm)
      )
    );
  }
  
  // Get recommended templates for user profile
  getRecommendedTemplates(userProfile: {
    profession: string;
    industry: string;
    experience: string;
    skills: string[];
  }): ProfessionalTemplate[] {
    const recommendations = this.templates
      .map(template => ({
        template,
        score: this.calculateRecommendationScore(template, userProfile)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(rec => rec.template);
    
    return recommendations;
  }
  
  private calculateRecommendationScore(template: ProfessionalTemplate, userProfile: any): number {
    let score = 0;
    
    // Industry match
    if (template.industry.includes(userProfile.industry.toLowerCase())) {
      score += 30;
    }
    
    // Category match
    const categoryMap = {
      'developer': 'developer',
      'designer': 'creative',
      'manager': 'business',
      'researcher': 'academic',
      'freelancer': 'freelancer'
    };
    
    const expectedCategory = categoryMap[userProfile.profession.toLowerCase() as keyof typeof categoryMap];
    if (template.category === expectedCategory) {
      score += 25;
    }
    
    // Performance score
    score += template.performance.lighthouseScore * 0.2;
    
    // Accessibility score
    score += template.performance.accessibilityScore * 0.15;
    
    // SEO score
    score += template.performance.seoScore * 0.1;
    
    return score;
  }
}

// Export the template manager
export const professionalTemplateManager = new ProfessionalTemplateManager();
