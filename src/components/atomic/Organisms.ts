// Atomic Design Component Library - Organisms (50 section types)
export interface OrganismConfig {
  id: string;
  name: string;
  type: 'header' | 'hero' | 'about' | 'projects' | 'skills' | 'experience' | 'contact' | 'footer' | 'gallery' | 'testimonials';
  molecules: string[]; // References to molecule IDs
  variants: string[];
  properties: Record<string, any>;
  layout: {
    container: string;
    sections: string[];
    responsive: Record<string, any>;
  };
}

// 50 Section Organisms
export const ORGANISMS: OrganismConfig[] = [
  // Header Organisms (5 variants)
  {
    id: 'header-standard',
    name: 'Standard Header',
    type: 'header',
    molecules: ['nav-primary', 'btn-group-horizontal'],
    variants: ['fixed', 'sticky', 'transparent', 'glass'],
    properties: {
      height: '4rem',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: '0',
      zIndex: '1000'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['logo', 'navigation', 'cta'],
      responsive: {
        mobile: { direction: 'column', height: 'auto' },
        tablet: { direction: 'row', height: '4rem' }
      }
    }
  },
  {
    id: 'header-minimal',
    name: 'Minimal Header',
    type: 'header',
    molecules: ['nav-secondary', 'btn-icon'],
    variants: ['centered', 'left-aligned', 'right-aligned'],
    properties: {
      height: '3rem',
      backgroundColor: 'transparent',
      position: 'absolute',
      top: '0',
      width: '100%',
      zIndex: '1000'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['logo', 'navigation'],
      responsive: {
        mobile: { display: 'none' },
        tablet: { display: 'flex' }
      }
    }
  },
  {
    id: 'header-creative',
    name: 'Creative Header',
    type: 'header',
    molecules: ['nav-primary', 'btn-group-vertical'],
    variants: ['animated', '3d', 'particles'],
    properties: {
      height: '5rem',
      background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
      position: 'relative',
      overflow: 'hidden'
    },
    layout: {
      container: 'max-width-1400',
      sections: ['logo', 'navigation', 'social', 'cta'],
      responsive: {
        mobile: { height: 'auto', padding: '1rem' },
        tablet: { height: '5rem', padding: '0 2rem' }
      }
    }
  },
  {
    id: 'header-corporate',
    name: 'Corporate Header',
    type: 'header',
    molecules: ['nav-primary', 'btn-group-horizontal'],
    variants: ['professional', 'minimal', 'branded'],
    properties: {
      height: '4.5rem',
      backgroundColor: '#1F2937',
      color: '#FFFFFF',
      borderBottom: '2px solid #374151'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['logo', 'navigation', 'contact-info'],
      responsive: {
        mobile: { height: 'auto' },
        tablet: { height: '4.5rem' }
      }
    }
  },
  {
    id: 'header-mobile-first',
    name: 'Mobile-First Header',
    type: 'header',
    molecules: ['nav-mobile', 'btn-icon'],
    variants: ['hamburger', 'slide-out', 'overlay'],
    properties: {
      height: '3.5rem',
      backgroundColor: '#FFFFFF',
      position: 'fixed',
      top: '0',
      width: '100%',
      zIndex: '1000'
    },
    layout: {
      container: 'full-width',
      sections: ['logo', 'hamburger', 'mobile-menu'],
      responsive: {
        mobile: { display: 'flex' },
        tablet: { display: 'none' }
      }
    }
  },

  // Hero Organisms (10 variants)
  {
    id: 'hero-standard',
    name: 'Standard Hero',
    type: 'hero',
    molecules: ['text-group-heading', 'btn-group-horizontal', 'media-image'],
    variants: ['centered', 'split', 'full-width', 'minimal'],
    properties: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1E293B, #0F172A)',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['content', 'media', 'cta'],
      responsive: {
        mobile: { minHeight: '80vh', padding: '2rem 1rem' },
        tablet: { minHeight: '100vh', padding: '4rem 2rem' }
      }
    }
  },
  {
    id: 'hero-3d',
    name: '3D Hero',
    type: 'hero',
    molecules: ['text-group-heading', 'btn-group-horizontal'],
    variants: ['particles', 'geometric', 'interactive'],
    properties: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1E40AF, #8B5CF6)',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    },
    layout: {
      container: 'max-width-1400',
      sections: ['3d-scene', 'content', 'cta'],
      responsive: {
        mobile: { minHeight: '80vh' },
        tablet: { minHeight: '100vh' }
      }
    }
  },
  {
    id: 'hero-video',
    name: 'Video Hero',
    type: 'hero',
    molecules: ['text-group-heading', 'btn-group-horizontal', 'media-video'],
    variants: ['background', 'overlay', 'autoplay'],
    properties: {
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['video-background', 'content-overlay', 'cta'],
      responsive: {
        mobile: { minHeight: '80vh' },
        tablet: { minHeight: '100vh' }
      }
    }
  },
  {
    id: 'hero-parallax',
    name: 'Parallax Hero',
    type: 'hero',
    molecules: ['text-group-heading', 'btn-group-horizontal'],
    variants: ['scroll', 'mouse', 'touch'],
    properties: {
      minHeight: '120vh',
      background: 'linear-gradient(135deg, #0F172A, #1E293B)',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['parallax-bg', 'content', 'cta'],
      responsive: {
        mobile: { minHeight: '100vh' },
        tablet: { minHeight: '120vh' }
      }
    }
  },
  {
    id: 'hero-minimal',
    name: 'Minimal Hero',
    type: 'hero',
    molecules: ['text-group-heading', 'btn-secondary'],
    variants: ['centered', 'left-aligned', 'right-aligned'],
    properties: {
      minHeight: '80vh',
      backgroundColor: '#FFFFFF',
      color: '#1F2937',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    layout: {
      container: 'max-width-800',
      sections: ['content', 'cta'],
      responsive: {
        mobile: { minHeight: '60vh', padding: '2rem 1rem' },
        tablet: { minHeight: '80vh', padding: '4rem 2rem' }
      }
    }
  },

  // About Organisms (5 variants)
  {
    id: 'about-standard',
    name: 'Standard About',
    type: 'about',
    molecules: ['text-group-heading', 'text-group-paragraph', 'media-image'],
    variants: ['text-image', 'image-text', 'centered'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#F8FAFC',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'content', 'image', 'stats'],
      responsive: {
        mobile: { padding: '4rem 0', direction: 'column' },
        tablet: { padding: '6rem 0', direction: 'row' }
      }
    }
  },
  {
    id: 'about-timeline',
    name: 'Timeline About',
    type: 'about',
    molecules: ['text-group-heading', 'text-group-paragraph'],
    variants: ['vertical', 'horizontal', 'zigzag'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#FFFFFF',
      color: '#1F2937',
      position: 'relative'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'timeline'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'about-stats',
    name: 'Stats About',
    type: 'about',
    molecules: ['text-group-heading', 'card-basic'],
    variants: ['numbers', 'progress', 'achievements'],
    properties: {
      padding: '6rem 0',
      background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
      color: '#FFFFFF'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'stats-grid'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'about-values',
    name: 'Values About',
    type: 'about',
    molecules: ['text-group-heading', 'card-basic'],
    variants: ['icons', 'cards', 'list'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#F8FAFC',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'values-grid'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'about-testimonial',
    name: 'Testimonial About',
    type: 'about',
    molecules: ['text-group-heading', 'card-testimonial'],
    variants: ['single', 'carousel', 'grid'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#FFFFFF',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'testimonials'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },

  // Projects Organisms (10 variants)
  {
    id: 'projects-grid',
    name: 'Projects Grid',
    type: 'projects',
    molecules: ['text-group-heading', 'card-project', 'layout-grid'],
    variants: ['2-column', '3-column', '4-column', 'masonry'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#F8FAFC',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-1400',
      sections: ['heading', 'filters', 'projects-grid'],
      responsive: {
        mobile: { padding: '4rem 0', gridColumns: '1' },
        tablet: { padding: '6rem 0', gridColumns: '2' },
        desktop: { gridColumns: '3' }
      }
    }
  },
  {
    id: 'projects-carousel',
    name: 'Projects Carousel',
    type: 'projects',
    molecules: ['text-group-heading', 'card-project'],
    variants: ['horizontal', 'vertical', '3d'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#FFFFFF',
      color: '#1F2937',
      overflow: 'hidden'
    },
    layout: {
      container: 'max-width-1400',
      sections: ['heading', 'carousel', 'navigation'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'projects-featured',
    name: 'Featured Projects',
    type: 'projects',
    molecules: ['text-group-heading', 'card-project', 'media-gallery'],
    variants: ['hero-project', 'side-projects', 'alternating'],
    properties: {
      padding: '6rem 0',
      background: 'linear-gradient(135deg, #1E293B, #0F172A)',
      color: '#FFFFFF'
    },
    layout: {
      container: 'max-width-1400',
      sections: ['heading', 'featured', 'other-projects'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'projects-categories',
    name: 'Categorized Projects',
    type: 'projects',
    molecules: ['text-group-heading', 'card-project', 'nav-secondary'],
    variants: ['tabs', 'filters', 'tags'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#F8FAFC',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-1400',
      sections: ['heading', 'categories', 'projects'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'projects-interactive',
    name: 'Interactive Projects',
    type: 'projects',
    molecules: ['text-group-heading', 'card-project'],
    variants: ['hover-effects', '3d-cards', 'parallax'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#FFFFFF',
      color: '#1F2937',
      perspective: '1000px'
    },
    layout: {
      container: 'max-width-1400',
      sections: ['heading', 'interactive-grid'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },

  // Skills Organisms (5 variants)
  {
    id: 'skills-bars',
    name: 'Skills Bars',
    type: 'skills',
    molecules: ['text-group-heading', 'card-skill'],
    variants: ['horizontal', 'vertical', 'circular'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#F8FAFC',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'skills-grid'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'skills-cloud',
    name: 'Skills Cloud',
    type: 'skills',
    molecules: ['text-group-heading', 'card-skill'],
    variants: ['word-cloud', 'tag-cloud', 'bubble'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#FFFFFF',
      color: '#1F2937',
      position: 'relative'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'skills-cloud'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'skills-categories',
    name: 'Categorized Skills',
    type: 'skills',
    molecules: ['text-group-heading', 'card-skill'],
    variants: ['frontend', 'backend', 'tools', 'soft-skills'],
    properties: {
      padding: '6rem 0',
      background: 'linear-gradient(135deg, #1E40AF, #8B5CF6)',
      color: '#FFFFFF'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'categories', 'skills-grid'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'skills-timeline',
    name: 'Skills Timeline',
    type: 'skills',
    molecules: ['text-group-heading', 'card-skill'],
    variants: ['chronological', 'proficiency', 'learning'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#F8FAFC',
      color: '#1F2937',
      position: 'relative'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'timeline'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'skills-interactive',
    name: 'Interactive Skills',
    type: 'skills',
    molecules: ['text-group-heading', 'card-skill'],
    variants: ['3d-visualization', 'interactive-chart', 'skill-tree'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#FFFFFF',
      color: '#1F2937',
      minHeight: '80vh'
    },
    layout: {
      container: 'max-width-1400',
      sections: ['heading', '3d-scene'],
      responsive: {
        mobile: { padding: '4rem 0', minHeight: '60vh' },
        tablet: { padding: '6rem 0', minHeight: '80vh' }
      }
    }
  },

  // Experience Organisms (5 variants)
  {
    id: 'experience-timeline',
    name: 'Experience Timeline',
    type: 'experience',
    molecules: ['text-group-heading', 'card-basic'],
    variants: ['vertical', 'horizontal', 'zigzag'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#F8FAFC',
      color: '#1F2937',
      position: 'relative'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'timeline'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'experience-cards',
    name: 'Experience Cards',
    type: 'experience',
    molecules: ['text-group-heading', 'card-basic'],
    variants: ['grid', 'carousel', 'accordion'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#FFFFFF',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'experience-grid'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'experience-company',
    name: 'Company Experience',
    type: 'experience',
    molecules: ['text-group-heading', 'card-basic', 'media-image'],
    variants: ['logo-timeline', 'company-cards', 'role-progression'],
    properties: {
      padding: '6rem 0',
      background: 'linear-gradient(135deg, #1E293B, #0F172A)',
      color: '#FFFFFF'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'companies', 'roles'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'experience-achievements',
    name: 'Achievements Experience',
    type: 'experience',
    molecules: ['text-group-heading', 'card-basic'],
    variants: ['milestones', 'awards', 'certifications'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#F8FAFC',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'achievements-grid'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'experience-projects',
    name: 'Project Experience',
    type: 'experience',
    molecules: ['text-group-heading', 'card-project'],
    variants: ['chronological', 'by-company', 'by-role'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#FFFFFF',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-1400',
      sections: ['heading', 'projects-timeline'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },

  // Contact Organisms (5 variants)
  {
    id: 'contact-form',
    name: 'Contact Form',
    type: 'contact',
    molecules: ['text-group-heading', 'form-input', 'form-textarea', 'btn-primary'],
    variants: ['standard', 'minimal', 'creative'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#F8FAFC',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-800',
      sections: ['heading', 'form', 'info'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'contact-split',
    name: 'Split Contact',
    type: 'contact',
    molecules: ['text-group-heading', 'form-input', 'card-contact'],
    variants: ['form-info', 'form-map', 'form-social'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#FFFFFF',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'form-section', 'info-section'],
      responsive: {
        mobile: { padding: '4rem 0', direction: 'column' },
        tablet: { padding: '6rem 0', direction: 'row' }
      }
    }
  },
  {
    id: 'contact-cards',
    name: 'Contact Cards',
    type: 'contact',
    molecules: ['text-group-heading', 'card-contact'],
    variants: ['info-cards', 'social-cards', 'location-cards'],
    properties: {
      padding: '6rem 0',
      background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
      color: '#FFFFFF'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'contact-grid'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'contact-interactive',
    name: 'Interactive Contact',
    type: 'contact',
    molecules: ['text-group-heading', 'form-input', 'btn-primary'],
    variants: ['animated-form', '3d-contact', 'particle-bg'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#FFFFFF',
      color: '#1F2937',
      position: 'relative',
      overflow: 'hidden'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['heading', 'interactive-form', 'background'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },
  {
    id: 'contact-minimal',
    name: 'Minimal Contact',
    type: 'contact',
    molecules: ['text-group-heading', 'form-input', 'btn-secondary'],
    variants: ['centered', 'left-aligned', 'right-aligned'],
    properties: {
      padding: '6rem 0',
      backgroundColor: '#F8FAFC',
      color: '#1F2937'
    },
    layout: {
      container: 'max-width-600',
      sections: ['heading', 'form'],
      responsive: {
        mobile: { padding: '4rem 0' },
        tablet: { padding: '6rem 0' }
      }
    }
  },

  // Footer Organisms (5 variants)
  {
    id: 'footer-standard',
    name: 'Standard Footer',
    type: 'footer',
    molecules: ['nav-social', 'text-group-paragraph'],
    variants: ['simple', 'detailed', 'branded'],
    properties: {
      padding: '4rem 0 2rem',
      backgroundColor: '#1F2937',
      color: '#FFFFFF'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['content', 'links', 'social', 'copyright'],
      responsive: {
        mobile: { padding: '2rem 0 1rem' },
        tablet: { padding: '4rem 0 2rem' }
      }
    }
  },
  {
    id: 'footer-minimal',
    name: 'Minimal Footer',
    type: 'footer',
    molecules: ['text-caption', 'nav-social'],
    variants: ['centered', 'left-aligned', 'right-aligned'],
    properties: {
      padding: '2rem 0',
      backgroundColor: '#F8FAFC',
      color: '#6B7280',
      borderTop: '1px solid #E5E7EB'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['copyright', 'social'],
      responsive: {
        mobile: { padding: '1rem 0' },
        tablet: { padding: '2rem 0' }
      }
    }
  },
  {
    id: 'footer-creative',
    name: 'Creative Footer',
    type: 'footer',
    molecules: ['text-group-heading', 'nav-social', 'btn-primary'],
    variants: ['animated', '3d', 'particles'],
    properties: {
      padding: '6rem 0 2rem',
      background: 'linear-gradient(135deg, #1E40AF, #8B5CF6)',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['content', 'cta', 'social', 'copyright'],
      responsive: {
        mobile: { padding: '4rem 0 1rem' },
        tablet: { padding: '6rem 0 2rem' }
      }
    }
  },
  {
    id: 'footer-corporate',
    name: 'Corporate Footer',
    type: 'footer',
    molecules: ['text-group-paragraph', 'nav-primary'],
    variants: ['professional', 'legal', 'branded'],
    properties: {
      padding: '4rem 0 2rem',
      backgroundColor: '#111827',
      color: '#D1D5DB',
      borderTop: '2px solid #374151'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['company-info', 'links', 'legal', 'copyright'],
      responsive: {
        mobile: { padding: '2rem 0 1rem' },
        tablet: { padding: '4rem 0 2rem' }
      }
    }
  },
  {
    id: 'footer-glass',
    name: 'Glass Footer',
    type: 'footer',
    molecules: ['text-group-paragraph', 'nav-social'],
    variants: ['frosted', 'blur', 'transparent'],
    properties: {
      padding: '4rem 0 2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#FFFFFF'
    },
    layout: {
      container: 'max-width-1200',
      sections: ['content', 'social', 'copyright'],
      responsive: {
        mobile: { padding: '2rem 0 1rem' },
        tablet: { padding: '4rem 0 2rem' }
      }
    }
  }
];

// Organism Generator
export class OrganismGenerator {
  private organisms: OrganismConfig[];
  
  constructor() {
    this.organisms = ORGANISMS;
  }
  
  // Get organism by ID
  getOrganism(id: string): OrganismConfig | undefined {
    return this.organisms.find(organism => organism.id === id);
  }
  
  // Get organisms by type
  getOrganismsByType(type: string): OrganismConfig[] {
    return this.organisms.filter(organism => organism.type === type);
  }
  
  // Generate random organism combination
  generateRandomOrganismCombination(): Record<string, OrganismConfig> {
    const combination: Record<string, OrganismConfig> = {};
    
    // Select one organism from each type
    const types = ['header', 'hero', 'about', 'projects', 'skills', 'experience', 'contact', 'footer'];
    types.forEach(type => {
      const organismsOfType = this.getOrganismsByType(type);
      if (organismsOfType.length > 0) {
        const randomOrganism = organismsOfType[Math.floor(Math.random() * organismsOfType.length)];
        combination[type] = randomOrganism;
      }
    });
    
    return combination;
  }
  
  // Calculate total combinations
  calculateTotalCombinations(): number {
    let total = 1;
    
    const types = ['header', 'hero', 'about', 'projects', 'skills', 'experience', 'contact', 'footer'];
    types.forEach(type => {
      const organismsOfType = this.getOrganismsByType(type);
      total *= organismsOfType.length;
    });
    
    return total;
  }
}

// Export the organism generator
export const organismGenerator = new OrganismGenerator();
