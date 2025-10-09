import { TemplateComponent, ComponentProp, ComponentStyle, AccessibilityConfig, ResponsiveConfig, ComponentMetadata, PerformanceMetrics, SEOConfig, TemplateLayout, TemplatePage, NavigationConfig, ThemeConfig, LayoutStructure, ResponsiveTemplate, PageLayout, PageSEO, NavigationItem, ResponsiveNavigation } from './types'
import { organisms, organismRegistry } from './organisms'

// Base template configuration
const baseAccessibility: AccessibilityConfig = {
  keyboardNavigation: true,
  screenReaderSupport: true,
  colorContrast: 'AA',
  focusManagement: true,
  semanticHTML: true
}

const baseResponsive: ResponsiveConfig = {
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280
  },
  mobileFirst: true,
  fluidLayout: true,
  adaptiveImages: true
}

const basePerformance: PerformanceMetrics = {
  bundleSize: 10,
  renderTime: 10,
  memoryUsage: 10,
  lighthouseScore: 95
}

const baseSEO: SEOConfig = {
  semanticHTML: true,
  metaTags: true,
  structuredData: true,
  socialSharing: true
}

const baseMetadata: ComponentMetadata = {
  version: '1.0.0',
  author: 'ShowWork Team',
  createdAt: new Date(),
  updatedAt: new Date(),
  dependencies: [],
  compatibility: ['modern'],
  performance: basePerformance,
  seo: baseSEO
}

// Portfolio Template
export const portfolioTemplate: TemplateComponent = {
  id: 'portfolio',
  type: 'template',
  name: 'Portfolio Template',
  description: 'Complete portfolio template with all sections',
  category: 'portfolio',
  tags: ['portfolio', 'developer', 'creative'],
  organisms: ['header', 'hero', 'about-section', 'project-gallery', 'skills-section', 'contact-form', 'footer'],
  layout: {
    type: 'single-page',
    structure: {
      header: true,
      hero: true,
      sidebar: false,
      main: true,
      footer: true,
      sections: ['about', 'projects', 'skills', 'contact']
    },
    responsive: {
      mobile: {
        type: 'single-page',
        structure: {
          header: true,
          hero: true,
          sidebar: false,
          main: true,
          footer: true,
          sections: ['about', 'projects', 'skills', 'contact']
        }
      },
      tablet: {
        type: 'single-page',
        structure: {
          header: true,
          hero: true,
          sidebar: false,
          main: true,
          footer: true,
          sections: ['about', 'projects', 'skills', 'contact']
        }
      },
      desktop: {
        type: 'single-page',
        structure: {
          header: true,
          hero: true,
          sidebar: false,
          main: true,
          footer: true,
          sections: ['about', 'projects', 'skills', 'contact']
        }
      }
    }
  },
  pages: [
    {
      id: 'home',
      name: 'Home',
      path: '/',
      organisms: ['header', 'hero', 'about-section', 'project-gallery', 'skills-section', 'contact-form', 'footer'],
      layout: {
        type: 'full-width',
        maxWidth: 1200,
        padding: 2,
        margin: 0
      },
      seo: {
        title: 'Portfolio - {name}',
        description: 'Professional portfolio showcasing projects and skills',
        keywords: ['portfolio', 'developer', 'projects', 'skills'],
        ogImage: '/og-image.jpg',
        canonical: '/'
      }
    }
  ],
  navigation: {
    type: 'header',
    items: [
      {
        id: 'home',
        label: 'Home',
        path: '/'
      },
      {
        id: 'about',
        label: 'About',
        path: '#about'
      },
      {
        id: 'projects',
        label: 'Projects',
        path: '#projects'
      },
      {
        id: 'skills',
        label: 'Skills',
        path: '#skills'
      },
      {
        id: 'contact',
        label: 'Contact',
        path: '#contact'
      }
    ],
    responsive: {
      mobile: 'hamburger',
      tablet: 'horizontal',
      desktop: 'horizontal'
    }
  },
  theme: {
    name: 'Portfolio Theme',
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a'
      },
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a'
      },
      accent: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12'
      },
      neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b'
      },
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f'
      },
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d'
      },
      info: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      }
    },
    typography: {
      fontFamily: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Georgia, serif',
        mono: 'JetBrains Mono, monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      }
    },
    spacing: {
      xs: 0.25,
      sm: 0.5,
      md: 1,
      lg: 1.5,
      xl: 2,
      '2xl': 3,
      '3xl': 4
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      none: '0 0 #0000'
    },
    animations: {
      duration: {
        fast: 150,
        normal: 300,
        slow: 500
      },
      easing: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      },
      transitions: {
        fade: {
          duration: 300,
          easing: 'ease-in-out',
          properties: ['opacity']
        },
        slide: {
          duration: 300,
          easing: 'ease-out',
          properties: ['transform', 'opacity']
        },
        scale: {
          duration: 200,
          easing: 'ease-out',
          properties: ['transform']
        },
        rotate: {
          duration: 300,
          easing: 'ease-in-out',
          properties: ['transform']
        }
      }
    }
  },
  props: [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Portfolio owner name'
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Portfolio owner title'
    },
    {
      name: 'description',
      type: 'string',
      required: true,
      description: 'Portfolio description'
    },
    {
      name: 'image',
      type: 'string',
      required: false,
      description: 'Portfolio owner image'
    },
    {
      name: 'projects',
      type: 'array',
      required: true,
      description: 'Array of projects'
    },
    {
      name: 'skills',
      type: 'array',
      required: true,
      description: 'Array of skills'
    },
    {
      name: 'contact',
      type: 'object',
      required: true,
      description: 'Contact information'
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      defaultValue: 'default',
      description: 'Template variant'
    },
    {
      name: 'theme',
      type: 'object',
      required: false,
      description: 'Custom theme configuration'
    }
  ],
  styles: [
    {
      name: 'variant',
      type: 'layout',
      properties: ['backgroundColor', 'color'],
      defaultValue: 'default',
      description: 'Template variant'
    },
    {
      name: 'layout',
      type: 'layout',
      properties: ['maxWidth', 'padding', 'margin'],
      defaultValue: 'container',
      description: 'Template layout'
    },
    {
      name: 'spacing',
      type: 'spacing',
      properties: ['gap', 'padding'],
      defaultValue: 'lg',
      description: 'Template spacing'
    }
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata
}

// Developer Portfolio Template
export const developerPortfolioTemplate: TemplateComponent = {
  id: 'developer-portfolio',
  type: 'template',
  name: 'Developer Portfolio',
  description: 'Specialized portfolio template for developers',
  category: 'developer',
  tags: ['developer', 'code', 'technical'],
  organisms: ['header', 'hero', 'about-section', 'project-gallery', 'skills-section', 'contact-form', 'footer'],
  layout: {
    type: 'single-page',
    structure: {
      header: true,
      hero: true,
      sidebar: false,
      main: true,
      footer: true,
      sections: ['about', 'projects', 'skills', 'contact']
    },
    responsive: {
      mobile: {
        type: 'single-page',
        structure: {
          header: true,
          hero: true,
          sidebar: false,
          main: true,
          footer: true,
          sections: ['about', 'projects', 'skills', 'contact']
        }
      },
      tablet: {
        type: 'single-page',
        structure: {
          header: true,
          hero: true,
          sidebar: false,
          main: true,
          footer: true,
          sections: ['about', 'projects', 'skills', 'contact']
        }
      },
      desktop: {
        type: 'single-page',
        structure: {
          header: true,
          hero: true,
          sidebar: false,
          main: true,
          footer: true,
          sections: ['about', 'projects', 'skills', 'contact']
        }
      }
    }
  },
  pages: [
    {
      id: 'home',
      name: 'Home',
      path: '/',
      organisms: ['header', 'hero', 'about-section', 'project-gallery', 'skills-section', 'contact-form', 'footer'],
      layout: {
        type: 'full-width',
        maxWidth: 1200,
        padding: 2,
        margin: 0
      },
      seo: {
        title: 'Developer Portfolio - {name}',
        description: 'Full-stack developer portfolio showcasing technical projects and expertise',
        keywords: ['developer', 'portfolio', 'full-stack', 'javascript', 'react', 'node'],
        ogImage: '/og-image.jpg',
        canonical: '/'
      }
    }
  ],
  navigation: {
    type: 'header',
    items: [
      {
        id: 'home',
        label: 'Home',
        path: '/'
      },
      {
        id: 'about',
        label: 'About',
        path: '#about'
      },
      {
        id: 'projects',
        label: 'Projects',
        path: '#projects'
      },
      {
        id: 'skills',
        label: 'Skills',
        path: '#skills'
      },
      {
        id: 'contact',
        label: 'Contact',
        path: '#contact'
      }
    ],
    responsive: {
      mobile: 'hamburger',
      tablet: 'horizontal',
      desktop: 'horizontal'
    }
  },
  theme: {
    name: 'Developer Theme',
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      },
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a'
      },
      accent: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12'
      },
      neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b'
      },
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f'
      },
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d'
      },
      info: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      }
    },
    typography: {
      fontFamily: {
        primary: 'JetBrains Mono, monospace',
        secondary: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      }
    },
    spacing: {
      xs: 0.25,
      sm: 0.5,
      md: 1,
      lg: 1.5,
      xl: 2,
      '2xl': 3,
      '3xl': 4
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      none: '0 0 #0000'
    },
    animations: {
      duration: {
        fast: 150,
        normal: 300,
        slow: 500
      },
      easing: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      },
      transitions: {
        fade: {
          duration: 300,
          easing: 'ease-in-out',
          properties: ['opacity']
        },
        slide: {
          duration: 300,
          easing: 'ease-out',
          properties: ['transform', 'opacity']
        },
        scale: {
          duration: 200,
          easing: 'ease-out',
          properties: ['transform']
        },
        rotate: {
          duration: 300,
          easing: 'ease-in-out',
          properties: ['transform']
        }
      }
    }
  },
  props: [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Developer name'
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Developer title'
    },
    {
      name: 'description',
      type: 'string',
      required: true,
      description: 'Developer description'
    },
    {
      name: 'image',
      type: 'string',
      required: false,
      description: 'Developer image'
    },
    {
      name: 'github',
      type: 'string',
      required: false,
      description: 'GitHub profile URL'
    },
    {
      name: 'linkedin',
      type: 'string',
      required: false,
      description: 'LinkedIn profile URL'
    },
    {
      name: 'projects',
      type: 'array',
      required: true,
      description: 'Array of projects'
    },
    {
      name: 'skills',
      type: 'array',
      required: true,
      description: 'Array of technical skills'
    },
    {
      name: 'contact',
      type: 'object',
      required: true,
      description: 'Contact information'
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      defaultValue: 'default',
      description: 'Template variant'
    }
  ],
  styles: [
    {
      name: 'variant',
      type: 'layout',
      properties: ['backgroundColor', 'color'],
      defaultValue: 'default',
      description: 'Template variant'
    },
    {
      name: 'layout',
      type: 'layout',
      properties: ['maxWidth', 'padding', 'margin'],
      defaultValue: 'container',
      description: 'Template layout'
    },
    {
      name: 'spacing',
      type: 'spacing',
      properties: ['gap', 'padding'],
      defaultValue: 'lg',
      description: 'Template spacing'
    }
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata
}

// Creative Portfolio Template
export const creativePortfolioTemplate: TemplateComponent = {
  id: 'creative-portfolio',
  type: 'template',
  name: 'Creative Portfolio',
  description: 'Creative portfolio template for designers and artists',
  category: 'creative',
  tags: ['creative', 'design', 'art'],
  organisms: ['header', 'hero', 'about-section', 'project-gallery', 'skills-section', 'contact-form', 'footer'],
  layout: {
    type: 'single-page',
    structure: {
      header: true,
      hero: true,
      sidebar: false,
      main: true,
      footer: true,
      sections: ['about', 'projects', 'skills', 'contact']
    },
    responsive: {
      mobile: {
        type: 'single-page',
        structure: {
          header: true,
          hero: true,
          sidebar: false,
          main: true,
          footer: true,
          sections: ['about', 'projects', 'skills', 'contact']
        }
      },
      tablet: {
        type: 'single-page',
        structure: {
          header: true,
          hero: true,
          sidebar: false,
          main: true,
          footer: true,
          sections: ['about', 'projects', 'skills', 'contact']
        }
      },
      desktop: {
        type: 'single-page',
        structure: {
          header: true,
          hero: true,
          sidebar: false,
          main: true,
          footer: true,
          sections: ['about', 'projects', 'skills', 'contact']
        }
      }
    }
  },
  pages: [
    {
      id: 'home',
      name: 'Home',
      path: '/',
      organisms: ['header', 'hero', 'about-section', 'project-gallery', 'skills-section', 'contact-form', 'footer'],
      layout: {
        type: 'full-width',
        maxWidth: 1400,
        padding: 2,
        margin: 0
      },
      seo: {
        title: 'Creative Portfolio - {name}',
        description: 'Creative portfolio showcasing design and artistic projects',
        keywords: ['creative', 'design', 'portfolio', 'art', 'ui', 'ux'],
        ogImage: '/og-image.jpg',
        canonical: '/'
      }
    }
  ],
  navigation: {
    type: 'header',
    items: [
      {
        id: 'home',
        label: 'Home',
        path: '/'
      },
      {
        id: 'about',
        label: 'About',
        path: '#about'
      },
      {
        id: 'projects',
        label: 'Projects',
        path: '#projects'
      },
      {
        id: 'skills',
        label: 'Skills',
        path: '#skills'
      },
      {
        id: 'contact',
        label: 'Contact',
        path: '#contact'
      }
    ],
    responsive: {
      mobile: 'hamburger',
      tablet: 'horizontal',
      desktop: 'horizontal'
    }
  },
  theme: {
    name: 'Creative Theme',
    colors: {
      primary: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#d946ef',
        600: '#c026d3',
        700: '#a21caf',
        800: '#86198f',
        900: '#701a75'
      },
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a'
      },
      accent: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12'
      },
      neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b'
      },
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f'
      },
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d'
      },
      info: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      }
    },
    typography: {
      fontFamily: {
        primary: 'Playfair Display, serif',
        secondary: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      }
    },
    spacing: {
      xs: 0.25,
      sm: 0.5,
      md: 1,
      lg: 1.5,
      xl: 2,
      '2xl': 3,
      '3xl': 4
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      none: '0 0 #0000'
    },
    animations: {
      duration: {
        fast: 150,
        normal: 300,
        slow: 500
      },
      easing: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      },
      transitions: {
        fade: {
          duration: 300,
          easing: 'ease-in-out',
          properties: ['opacity']
        },
        slide: {
          duration: 300,
          easing: 'ease-out',
          properties: ['transform', 'opacity']
        },
        scale: {
          duration: 200,
          easing: 'ease-out',
          properties: ['transform']
        },
        rotate: {
          duration: 300,
          easing: 'ease-in-out',
          properties: ['transform']
        }
      }
    }
  },
  props: [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Creative name'
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Creative title'
    },
    {
      name: 'description',
      type: 'string',
      required: true,
      description: 'Creative description'
    },
    {
      name: 'image',
      type: 'string',
      required: false,
      description: 'Creative image'
    },
    {
      name: 'portfolio',
      type: 'array',
      required: true,
      description: 'Array of creative works'
    },
    {
      name: 'skills',
      type: 'array',
      required: true,
      description: 'Array of creative skills'
    },
    {
      name: 'contact',
      type: 'object',
      required: true,
      description: 'Contact information'
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      defaultValue: 'default',
      description: 'Template variant'
    }
  ],
  styles: [
    {
      name: 'variant',
      type: 'layout',
      properties: ['backgroundColor', 'color'],
      defaultValue: 'default',
      description: 'Template variant'
    },
    {
      name: 'layout',
      type: 'layout',
      properties: ['maxWidth', 'padding', 'margin'],
      defaultValue: 'container',
      description: 'Template layout'
    },
    {
      name: 'spacing',
      type: 'spacing',
      properties: ['gap', 'padding'],
      defaultValue: 'lg',
      description: 'Template spacing'
    }
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata
}

// Export all templates
export const templates: TemplateComponent[] = [
  portfolioTemplate,
  developerPortfolioTemplate,
  creativePortfolioTemplate
]

// Template registry
export const templateRegistry = new Map<string, TemplateComponent>()
templates.forEach(template => {
  templateRegistry.set(template.id, template)
})

// Utility functions
export function getTemplate(id: string): TemplateComponent | undefined {
  return templateRegistry.get(id)
}

export function getTemplatesByCategory(category: string): TemplateComponent[] {
  return templates.filter(template => template.category === category)
}

export function getTemplatesByTag(tag: string): TemplateComponent[] {
  return templates.filter(template => template.tags.includes(tag))
}

export function getTemplatesByOrganism(organismId: string): TemplateComponent[] {
  return templates.filter(template => template.organisms.includes(organismId))
}

export function validateTemplateProps(template: TemplateComponent, props: Record<string, any>): boolean {
  for (const prop of template.props) {
    if (prop.required && !(prop.name in props)) {
      return false
    }
  }
  return true
}

export function createTemplateLayout(
  type: 'single-page' | 'multi-page' | 'blog' | 'portfolio' | 'landing' | 'dashboard',
  structure: LayoutStructure,
  responsive: ResponsiveTemplate
): TemplateLayout {
  return {
    type,
    structure,
    responsive
  }
}

export function createTemplatePage(
  id: string,
  name: string,
  path: string,
  organisms: string[],
  layout: PageLayout,
  seo: PageSEO
): TemplatePage {
  return {
    id,
    name,
    path,
    organisms,
    layout,
    seo
  }
}

export function createNavigationConfig(
  type: 'header' | 'sidebar' | 'footer' | 'breadcrumb',
  items: NavigationItem[],
  responsive: ResponsiveNavigation
): NavigationConfig {
  return {
    type,
    items,
    responsive
  }
}

export function createThemeConfig(
  name: string,
  colors: any,
  typography: any,
  spacing: any,
  shadows: any,
  animations: any
): ThemeConfig {
  return {
    name,
    colors,
    typography,
    spacing,
    shadows,
    animations
  }
}
