import { OrganismComponent, ComponentProp, ComponentStyle, AccessibilityConfig, ResponsiveConfig, ComponentMetadata, PerformanceMetrics, SEOConfig, OrganismLayout, OrganismSection, SectionLayout, ResponsiveSection } from './types'
import { molecules, moleculeRegistry } from './molecules'

// Base organism configuration
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
  bundleSize: 5,
  renderTime: 5,
  memoryUsage: 5,
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

// Header Organism
export const headerOrganism: OrganismComponent = {
  id: 'header',
  type: 'organism',
  name: 'Header',
  description: 'Site header with navigation, logo, and user actions',
  category: 'navigation',
  tags: ['header', 'navigation', 'branding'],
  molecules: ['navigation-item', 'button-group', 'avatar-group'],
  sections: [
    {
      id: 'brand',
      name: 'Brand Section',
      molecules: ['logo', 'site-title'],
      layout: {
        type: 'flex',
        direction: 'horizontal',
        gap: 1,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.5,
          columns: 1
        },
        tablet: {
          type: 'flex',
          direction: 'horizontal',
          gap: 1,
          columns: 1
        },
        desktop: {
          type: 'flex',
          direction: 'horizontal',
          gap: 1,
          columns: 1
        }
      }
    },
    {
      id: 'navigation',
      name: 'Navigation Section',
      molecules: ['navigation-item'],
      layout: {
        type: 'flex',
        direction: 'horizontal',
        gap: 0.5,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.25,
          columns: 1
        },
        tablet: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.5,
          columns: 1
        },
        desktop: {
          type: 'flex',
          direction: 'horizontal',
          gap: 1,
          columns: 1
        }
      }
    },
    {
      id: 'actions',
      name: 'Actions Section',
      molecules: ['button-group', 'avatar-group'],
      layout: {
        type: 'flex',
        direction: 'horizontal',
        gap: 0.5,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.25,
          columns: 1
        },
        tablet: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.5,
          columns: 1
        },
        desktop: {
          type: 'flex',
          direction: 'horizontal',
          gap: 1,
          columns: 1
        }
      }
    }
  ],
  layout: {
    type: 'header',
    columns: 3,
    spacing: 1,
    alignment: 'center'
  },
  props: [
    {
      name: 'logo',
      type: 'string',
      required: false,
      description: 'Logo image URL'
    },
    {
      name: 'siteName',
      type: 'string',
      required: false,
      description: 'Site name'
    },
    {
      name: 'navigation',
      type: 'array',
      required: true,
      description: 'Navigation items'
    },
    {
      name: 'userActions',
      type: 'array',
      required: false,
      description: 'User action buttons'
    },
    {
      name: 'user',
      type: 'object',
      required: false,
      description: 'User information'
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      defaultValue: 'default',
      description: 'Header variant'
    },
    {
      name: 'sticky',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: 'Whether header is sticky'
    }
  ],
  styles: [
    {
      name: 'variant',
      type: 'color',
      properties: ['backgroundColor', 'color', 'borderColor'],
      defaultValue: 'default',
      description: 'Header color variant'
    },
    {
      name: 'elevation',
      type: 'effect',
      properties: ['boxShadow'],
      defaultValue: 'none',
      description: 'Header elevation level'
    },
    {
      name: 'spacing',
      type: 'spacing',
      properties: ['padding', 'margin'],
      defaultValue: 'md',
      description: 'Header spacing'
    }
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata
}

// Hero Organism
export const heroOrganism: OrganismComponent = {
  id: 'hero',
  type: 'organism',
  name: 'Hero Section',
  description: 'Hero section with headline, description, and call-to-action',
  category: 'content',
  tags: ['hero', 'banner', 'cta'],
  molecules: ['button-group', 'card'],
  sections: [
    {
      id: 'content',
      name: 'Content Section',
      molecules: ['headline', 'description', 'cta'],
      layout: {
        type: 'stack',
        direction: 'vertical',
        gap: 1,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.75,
          columns: 1
        },
        tablet: {
          type: 'stack',
          direction: 'vertical',
          gap: 1,
          columns: 1
        },
        desktop: {
          type: 'stack',
          direction: 'vertical',
          gap: 1.5,
          columns: 1
        }
      }
    },
    {
      id: 'visual',
      name: 'Visual Section',
      molecules: ['image', 'video', 'animation'],
      layout: {
        type: 'flex',
        direction: 'horizontal',
        gap: 1,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.5,
          columns: 1
        },
        tablet: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.75,
          columns: 1
        },
        desktop: {
          type: 'flex',
          direction: 'horizontal',
          gap: 1,
          columns: 1
        }
      }
    }
  ],
  layout: {
    type: 'hero',
    columns: 2,
    spacing: 2,
    alignment: 'center'
  },
  props: [
    {
      name: 'headline',
      type: 'string',
      required: true,
      description: 'Hero headline'
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Hero description'
    },
    {
      name: 'cta',
      type: 'object',
      required: false,
      description: 'Call-to-action button'
    },
    {
      name: 'image',
      type: 'string',
      required: false,
      description: 'Hero background image'
    },
    {
      name: 'video',
      type: 'string',
      required: false,
      description: 'Hero background video'
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      defaultValue: 'default',
      description: 'Hero variant'
    },
    {
      name: 'alignment',
      type: 'string',
      required: false,
      defaultValue: 'center',
      description: 'Content alignment'
    }
  ],
  styles: [
    {
      name: 'variant',
      type: 'color',
      properties: ['backgroundColor', 'color'],
      defaultValue: 'default',
      description: 'Hero color variant'
    },
    {
      name: 'background',
      type: 'effect',
      properties: ['backgroundImage', 'backgroundSize', 'backgroundPosition'],
      defaultValue: 'cover',
      description: 'Hero background style'
    },
    {
      name: 'spacing',
      type: 'spacing',
      properties: ['padding', 'margin'],
      defaultValue: 'xl',
      description: 'Hero spacing'
    }
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata
}

// Project Gallery Organism
export const projectGalleryOrganism: OrganismComponent = {
  id: 'project-gallery',
  type: 'organism',
  name: 'Project Gallery',
  description: 'Gallery of projects with filtering and sorting',
  category: 'content',
  tags: ['gallery', 'projects', 'portfolio'],
  molecules: ['card', 'search-input', 'button-group'],
  sections: [
    {
      id: 'filters',
      name: 'Filters Section',
      molecules: ['search-input', 'button-group'],
      layout: {
        type: 'flex',
        direction: 'horizontal',
        gap: 1,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.5,
          columns: 1
        },
        tablet: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.75,
          columns: 1
        },
        desktop: {
          type: 'flex',
          direction: 'horizontal',
          gap: 1,
          columns: 1
        }
      }
    },
    {
      id: 'gallery',
      name: 'Gallery Section',
      molecules: ['card'],
      layout: {
        type: 'grid',
        direction: 'horizontal',
        gap: 1,
        columns: 3
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.75,
          columns: 1
        },
        tablet: {
          type: 'grid',
          direction: 'horizontal',
          gap: 0.75,
          columns: 2
        },
        desktop: {
          type: 'grid',
          direction: 'horizontal',
          gap: 1,
          columns: 3
        }
      }
    }
  ],
  layout: {
    type: 'grid',
    columns: 1,
    spacing: 2,
    alignment: 'stretch'
  },
  props: [
    {
      name: 'projects',
      type: 'array',
      required: true,
      description: 'Array of project objects'
    },
    {
      name: 'filters',
      type: 'array',
      required: false,
      description: 'Available filters'
    },
    {
      name: 'sortOptions',
      type: 'array',
      required: false,
      description: 'Sorting options'
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      defaultValue: 'grid',
      description: 'Gallery layout variant'
    },
    {
      name: 'columns',
      type: 'number',
      required: false,
      defaultValue: 3,
      description: 'Number of columns'
    },
    {
      name: 'showFilters',
      type: 'boolean',
      required: false,
      defaultValue: true,
      description: 'Whether to show filters'
    }
  ],
  styles: [
    {
      name: 'variant',
      type: 'layout',
      properties: ['display', 'gridTemplateColumns'],
      defaultValue: 'grid',
      description: 'Gallery layout variant'
    },
    {
      name: 'spacing',
      type: 'spacing',
      properties: ['gap'],
      defaultValue: 'md',
      description: 'Gallery spacing'
    },
    {
      name: 'animation',
      type: 'animation',
      properties: ['transition'],
      defaultValue: 'fade',
      description: 'Gallery animation'
    }
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata
}

// Skills Section Organism
export const skillsSectionOrganism: OrganismComponent = {
  id: 'skills-section',
  type: 'organism',
  name: 'Skills Section',
  description: 'Skills section with categories and proficiency levels',
  category: 'content',
  tags: ['skills', 'expertise', 'categories'],
  molecules: ['card', 'progress-bar', 'badge'],
  sections: [
    {
      id: 'header',
      name: 'Header Section',
      molecules: ['title', 'description'],
      layout: {
        type: 'stack',
        direction: 'vertical',
        gap: 0.5,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.25,
          columns: 1
        },
        tablet: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.5,
          columns: 1
        },
        desktop: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.75,
          columns: 1
        }
      }
    },
    {
      id: 'categories',
      name: 'Categories Section',
      molecules: ['card'],
      layout: {
        type: 'grid',
        direction: 'horizontal',
        gap: 1,
        columns: 2
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.75,
          columns: 1
        },
        tablet: {
          type: 'grid',
          direction: 'horizontal',
          gap: 0.75,
          columns: 2
        },
        desktop: {
          type: 'grid',
          direction: 'horizontal',
          gap: 1,
          columns: 3
        }
      }
    }
  ],
  layout: {
    type: 'content',
    columns: 1,
    spacing: 2,
    alignment: 'stretch'
  },
  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Section title'
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Section description'
    },
    {
      name: 'skills',
      type: 'array',
      required: true,
      description: 'Array of skill categories'
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      defaultValue: 'cards',
      description: 'Skills display variant'
    },
    {
      name: 'showLevels',
      type: 'boolean',
      required: false,
      defaultValue: true,
      description: 'Whether to show proficiency levels'
    },
    {
      name: 'showYears',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: 'Whether to show years of experience'
    }
  ],
  styles: [
    {
      name: 'variant',
      type: 'layout',
      properties: ['display'],
      defaultValue: 'cards',
      description: 'Skills display variant'
    },
    {
      name: 'spacing',
      type: 'spacing',
      properties: ['gap'],
      defaultValue: 'md',
      description: 'Skills spacing'
    },
    {
      name: 'animation',
      type: 'animation',
      properties: ['transition'],
      defaultValue: 'fade',
      description: 'Skills animation'
    }
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata
}

// Contact Form Organism
export const contactFormOrganism: OrganismComponent = {
  id: 'contact-form',
  type: 'organism',
  name: 'Contact Form',
  description: 'Contact form with validation and submission',
  category: 'form',
  tags: ['contact', 'form', 'validation'],
  molecules: ['form-field', 'button-group'],
  sections: [
    {
      id: 'fields',
      name: 'Fields Section',
      molecules: ['form-field'],
      layout: {
        type: 'stack',
        direction: 'vertical',
        gap: 1,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.75,
          columns: 1
        },
        tablet: {
          type: 'stack',
          direction: 'vertical',
          gap: 1,
          columns: 1
        },
        desktop: {
          type: 'stack',
          direction: 'vertical',
          gap: 1.25,
          columns: 1
        }
      }
    },
    {
      id: 'actions',
      name: 'Actions Section',
      molecules: ['button-group'],
      layout: {
        type: 'flex',
        direction: 'horizontal',
        gap: 0.5,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.5,
          columns: 1
        },
        tablet: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.5,
          columns: 1
        },
        desktop: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.75,
          columns: 1
        }
      }
    }
  ],
  layout: {
    type: 'content',
    columns: 1,
    spacing: 2,
    alignment: 'stretch'
  },
  props: [
    {
      name: 'fields',
      type: 'array',
      required: true,
      description: 'Form fields configuration'
    },
    {
      name: 'submitText',
      type: 'string',
      required: false,
      defaultValue: 'Submit',
      description: 'Submit button text'
    },
    {
      name: 'onSubmit',
      type: 'function',
      required: true,
      description: 'Form submission handler'
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      defaultValue: 'default',
      description: 'Form variant'
    },
    {
      name: 'validation',
      type: 'object',
      required: false,
      description: 'Form validation rules'
    }
  ],
  styles: [
    {
      name: 'variant',
      type: 'layout',
      properties: ['backgroundColor', 'borderRadius', 'padding'],
      defaultValue: 'default',
      description: 'Form variant'
    },
    {
      name: 'spacing',
      type: 'spacing',
      properties: ['gap'],
      defaultValue: 'md',
      description: 'Form spacing'
    },
    {
      name: 'layout',
      type: 'layout',
      properties: ['display', 'flexDirection'],
      defaultValue: 'column',
      description: 'Form layout'
    }
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata
}

// Footer Organism
export const footerOrganism: OrganismComponent = {
  id: 'footer',
  type: 'organism',
  name: 'Footer',
  description: 'Site footer with links, social media, and copyright',
  category: 'navigation',
  tags: ['footer', 'links', 'social'],
  molecules: ['navigation-item', 'button-group'],
  sections: [
    {
      id: 'links',
      name: 'Links Section',
      molecules: ['navigation-item'],
      layout: {
        type: 'grid',
        direction: 'horizontal',
        gap: 1,
        columns: 4
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.75,
          columns: 1
        },
        tablet: {
          type: 'grid',
          direction: 'horizontal',
          gap: 0.75,
          columns: 2
        },
        desktop: {
          type: 'grid',
          direction: 'horizontal',
          gap: 1,
          columns: 4
        }
      }
    },
    {
      id: 'social',
      name: 'Social Section',
      molecules: ['button-group'],
      layout: {
        type: 'flex',
        direction: 'horizontal',
        gap: 0.5,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.25,
          columns: 1
        },
        tablet: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.5,
          columns: 1
        },
        desktop: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.75,
          columns: 1
        }
      }
    },
    {
      id: 'copyright',
      name: 'Copyright Section',
      molecules: ['text'],
      layout: {
        type: 'flex',
        direction: 'horizontal',
        gap: 0.5,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.25,
          columns: 1
        },
        tablet: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.5,
          columns: 1
        },
        desktop: {
          type: 'flex',
          direction: 'horizontal',
          gap: 0.75,
          columns: 1
        }
      }
    }
  ],
  layout: {
    type: 'footer',
    columns: 1,
    spacing: 2,
    alignment: 'center'
  },
  props: [
    {
      name: 'links',
      type: 'array',
      required: false,
      description: 'Footer links'
    },
    {
      name: 'socialLinks',
      type: 'array',
      required: false,
      description: 'Social media links'
    },
    {
      name: 'copyright',
      type: 'string',
      required: false,
      description: 'Copyright text'
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      defaultValue: 'default',
      description: 'Footer variant'
    },
    {
      name: 'columns',
      type: 'number',
      required: false,
      defaultValue: 4,
      description: 'Number of link columns'
    }
  ],
  styles: [
    {
      name: 'variant',
      type: 'color',
      properties: ['backgroundColor', 'color', 'borderColor'],
      defaultValue: 'default',
      description: 'Footer color variant'
    },
    {
      name: 'spacing',
      type: 'spacing',
      properties: ['padding', 'margin'],
      defaultValue: 'lg',
      description: 'Footer spacing'
    },
    {
      name: 'border',
      type: 'layout',
      properties: ['borderTop'],
      defaultValue: '1px solid #E5E7EB',
      description: 'Footer border'
    }
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata
}

// About Section Organism
export const aboutSectionOrganism: OrganismComponent = {
  id: 'about-section',
  type: 'organism',
  name: 'About Section',
  description: 'About section with personal information and highlights',
  category: 'content',
  tags: ['about', 'personal', 'bio'],
  molecules: ['card', 'avatar', 'text'],
  sections: [
    {
      id: 'header',
      name: 'Header Section',
      molecules: ['title', 'description'],
      layout: {
        type: 'stack',
        direction: 'vertical',
        gap: 0.5,
        columns: 1
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.25,
          columns: 1
        },
        tablet: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.5,
          columns: 1
        },
        desktop: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.75,
          columns: 1
        }
      }
    },
    {
      id: 'content',
      name: 'Content Section',
      molecules: ['avatar', 'text', 'card'],
      layout: {
        type: 'grid',
        direction: 'horizontal',
        gap: 1,
        columns: 2
      },
      responsive: {
        mobile: {
          type: 'stack',
          direction: 'vertical',
          gap: 0.75,
          columns: 1
        },
        tablet: {
          type: 'grid',
          direction: 'horizontal',
          gap: 0.75,
          columns: 2
        },
        desktop: {
          type: 'grid',
          direction: 'horizontal',
          gap: 1,
          columns: 2
        }
      }
    }
  ],
  layout: {
    type: 'content',
    columns: 1,
    spacing: 2,
    alignment: 'stretch'
  },
  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Section title'
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Section description'
    },
    {
      name: 'image',
      type: 'string',
      required: false,
      description: 'Profile image URL'
    },
    {
      name: 'content',
      type: 'string',
      required: true,
      description: 'About content'
    },
    {
      name: 'highlights',
      type: 'array',
      required: false,
      description: 'Key highlights'
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      defaultValue: 'default',
      description: 'Section variant'
    }
  ],
  styles: [
    {
      name: 'variant',
      type: 'layout',
      properties: ['backgroundColor', 'borderRadius'],
      defaultValue: 'default',
      description: 'Section variant'
    },
    {
      name: 'spacing',
      type: 'spacing',
      properties: ['padding', 'gap'],
      defaultValue: 'lg',
      description: 'Section spacing'
    },
    {
      name: 'layout',
      type: 'layout',
      properties: ['display', 'gridTemplateColumns'],
      defaultValue: 'grid',
      description: 'Section layout'
    }
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata
}

// Export all organisms
export const organisms: OrganismComponent[] = [
  headerOrganism,
  heroOrganism,
  projectGalleryOrganism,
  skillsSectionOrganism,
  contactFormOrganism,
  footerOrganism,
  aboutSectionOrganism
]

// Organism registry
export const organismRegistry = new Map<string, OrganismComponent>()
organisms.forEach(organism => {
  organismRegistry.set(organism.id, organism)
})

// Utility functions
export function getOrganism(id: string): OrganismComponent | undefined {
  return organismRegistry.get(id)
}

export function getOrganismsByCategory(category: string): OrganismComponent[] {
  return organisms.filter(organism => organism.category === category)
}

export function getOrganismsByTag(tag: string): OrganismComponent[] {
  return organisms.filter(organism => organism.tags.includes(tag))
}

export function getOrganismsByMolecule(moleculeId: string): OrganismComponent[] {
  return organisms.filter(organism => organism.molecules.includes(moleculeId))
}

export function validateOrganismProps(organism: OrganismComponent, props: Record<string, any>): boolean {
  for (const prop of organism.props) {
    if (prop.required && !(prop.name in props)) {
      return false
    }
  }
  return true
}

export function createOrganismLayout(
  type: 'header' | 'hero' | 'content' | 'sidebar' | 'footer' | 'grid' | 'masonry',
  columns?: number,
  spacing?: number,
  alignment?: 'left' | 'center' | 'right' | 'justify'
): OrganismLayout {
  return {
    type,
    columns,
    spacing,
    alignment
  }
}

export function createOrganismSection(
  id: string,
  name: string,
  molecules: string[],
  layout: SectionLayout,
  responsive: ResponsiveSection
): OrganismSection {
  return {
    id,
    name,
    molecules,
    layout,
    responsive
  }
}

export function createSectionLayout(
  type: 'stack' | 'grid' | 'flex' | 'masonry',
  direction?: 'horizontal' | 'vertical',
  gap?: number,
  columns?: number
): SectionLayout {
  return {
    type,
    direction,
    gap,
    columns
  }
}

export function createResponsiveSection(
  mobile: SectionLayout,
  tablet: SectionLayout,
  desktop: SectionLayout
): ResponsiveSection {
  return {
    mobile,
    tablet,
    desktop
  }
}
