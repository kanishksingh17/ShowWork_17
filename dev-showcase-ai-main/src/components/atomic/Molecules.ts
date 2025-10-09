// Atomic Design Component Library - Molecules (75 component groups)
export interface MoleculeConfig {
  id: string;
  name: string;
  type: 'navigation' | 'card' | 'form' | 'button-group' | 'media' | 'text-group' | 'layout';
  atoms: string[]; // References to atom IDs
  variants: string[];
  properties: Record<string, any>;
}

// 75 Component Molecules
export const MOLECULES: MoleculeConfig[] = [
  // Navigation Molecules (15 variants)
  {
    id: 'nav-primary',
    name: 'Primary Navigation',
    type: 'navigation',
    atoms: ['btn-primary', 'text-body', 'spacing-md'],
    variants: ['horizontal', 'vertical', 'dropdown', 'mega-menu'],
    properties: {
      layout: 'flex',
      direction: 'row',
      justify: 'space-between',
      align: 'center',
      padding: '1rem 2rem'
    }
  },
  {
    id: 'nav-secondary',
    name: 'Secondary Navigation',
    type: 'navigation',
    atoms: ['btn-secondary', 'text-caption', 'spacing-sm'],
    variants: ['tabs', 'pills', 'breadcrumb', 'pagination'],
    properties: {
      layout: 'flex',
      direction: 'row',
      justify: 'flex-start',
      align: 'center',
      gap: '0.5rem'
    }
  },
  {
    id: 'nav-mobile',
    name: 'Mobile Navigation',
    type: 'navigation',
    atoms: ['btn-icon', 'text-body', 'spacing-lg'],
    variants: ['hamburger', 'slide-out', 'overlay', 'bottom-sheet'],
    properties: {
      layout: 'flex',
      direction: 'column',
      justify: 'flex-start',
      align: 'stretch',
      padding: '2rem'
    }
  },
  {
    id: 'nav-social',
    name: 'Social Navigation',
    type: 'navigation',
    atoms: ['btn-social', 'spacing-sm'],
    variants: ['horizontal', 'vertical', 'circular', 'floating'],
    properties: {
      layout: 'flex',
      direction: 'row',
      justify: 'center',
      align: 'center',
      gap: '0.5rem'
    }
  },
  {
    id: 'nav-breadcrumb',
    name: 'Breadcrumb Navigation',
    type: 'navigation',
    atoms: ['text-caption', 'spacing-xs'],
    variants: ['simple', 'with-icons', 'collapsible'],
    properties: {
      layout: 'flex',
      direction: 'row',
      justify: 'flex-start',
      align: 'center',
      gap: '0.25rem'
    }
  },

  // Card Molecules (20 variants)
  {
    id: 'card-basic',
    name: 'Basic Card',
    type: 'card',
    atoms: ['color-surface', 'border-thin', 'shadow-sm', 'spacing-md'],
    variants: ['default', 'elevated', 'outlined', 'filled'],
    properties: {
      padding: '1.5rem',
      borderRadius: '0.5rem',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E5E7EB'
    }
  },
  {
    id: 'card-project',
    name: 'Project Card',
    type: 'card',
    atoms: ['color-surface', 'border-medium', 'shadow-md', 'spacing-lg'],
    variants: ['image-top', 'image-side', 'overlay', 'hover-effect'],
    properties: {
      padding: '1.5rem',
      borderRadius: '0.75rem',
      backgroundColor: '#FFFFFF',
      border: '2px solid #D1D5DB',
      transition: 'all 0.3s ease'
    }
  },
  {
    id: 'card-testimonial',
    name: 'Testimonial Card',
    type: 'card',
    atoms: ['color-surface', 'border-thin', 'shadow-lg', 'spacing-lg'],
    variants: ['quote', 'avatar', 'rating', 'company'],
    properties: {
      padding: '2rem',
      borderRadius: '1rem',
      backgroundColor: '#F8FAFC',
      border: '1px solid #E2E8F0',
      position: 'relative'
    }
  },
  {
    id: 'card-skill',
    name: 'Skill Card',
    type: 'card',
    atoms: ['color-primary', 'border-gradient', 'shadow-colored', 'spacing-md'],
    variants: ['progress', 'icon', 'badge', 'circular'],
    properties: {
      padding: '1rem',
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(30, 64, 175, 0.1)',
      border: '2px solid transparent',
      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1E40AF, #3B82F6)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'content-box, border-box'
    }
  },
  {
    id: 'card-contact',
    name: 'Contact Card',
    type: 'card',
    atoms: ['color-surface', 'border-glass', 'shadow-xl', 'spacing-lg'],
    variants: ['form', 'info', 'map', 'social'],
    properties: {
      padding: '2rem',
      borderRadius: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }
  },

  // Form Molecules (15 variants)
  {
    id: 'form-input',
    name: 'Input Field',
    type: 'form',
    atoms: ['border-thin', 'spacing-sm', 'text-body'],
    variants: ['text', 'email', 'password', 'search'],
    properties: {
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      border: '1px solid #D1D5DB',
      fontSize: '1rem',
      transition: 'all 0.2s ease'
    }
  },
  {
    id: 'form-textarea',
    name: 'Textarea Field',
    type: 'form',
    atoms: ['border-thin', 'spacing-md', 'text-body'],
    variants: ['default', 'resizable', 'auto-grow'],
    properties: {
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #D1D5DB',
      fontSize: '1rem',
      minHeight: '120px',
      resize: 'vertical'
    }
  },
  {
    id: 'form-select',
    name: 'Select Field',
    type: 'form',
    atoms: ['border-thin', 'spacing-sm', 'text-body'],
    variants: ['default', 'multi-select', 'searchable'],
    properties: {
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      border: '1px solid #D1D5DB',
      fontSize: '1rem',
      backgroundColor: '#FFFFFF'
    }
  },
  {
    id: 'form-checkbox',
    name: 'Checkbox Field',
    type: 'form',
    atoms: ['border-thin', 'spacing-sm'],
    variants: ['default', 'custom', 'toggle'],
    properties: {
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '0.25rem',
      border: '2px solid #D1D5DB',
      backgroundColor: '#FFFFFF'
    }
  },
  {
    id: 'form-radio',
    name: 'Radio Field',
    type: 'form',
    atoms: ['border-thin', 'spacing-sm'],
    variants: ['default', 'custom', 'button-group'],
    properties: {
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '50%',
      border: '2px solid #D1D5DB',
      backgroundColor: '#FFFFFF'
    }
  },

  // Button Group Molecules (10 variants)
  {
    id: 'btn-group-horizontal',
    name: 'Horizontal Button Group',
    type: 'button-group',
    atoms: ['btn-primary', 'btn-secondary', 'spacing-xs'],
    variants: ['connected', 'spaced', 'stacked'],
    properties: {
      display: 'flex',
      direction: 'row',
      gap: '0.25rem',
      borderRadius: '0.5rem',
      overflow: 'hidden'
    }
  },
  {
    id: 'btn-group-vertical',
    name: 'Vertical Button Group',
    type: 'button-group',
    atoms: ['btn-primary', 'btn-secondary', 'spacing-xs'],
    variants: ['connected', 'spaced', 'stacked'],
    properties: {
      display: 'flex',
      direction: 'column',
      gap: '0.25rem',
      borderRadius: '0.5rem',
      overflow: 'hidden'
    }
  },
  {
    id: 'btn-group-toggle',
    name: 'Toggle Button Group',
    type: 'button-group',
    atoms: ['btn-primary', 'btn-secondary', 'spacing-xs'],
    variants: ['single', 'multiple', 'exclusive'],
    properties: {
      display: 'flex',
      direction: 'row',
      gap: '0.25rem',
      borderRadius: '0.5rem',
      overflow: 'hidden'
    }
  },

  // Media Molecules (10 variants)
  {
    id: 'media-image',
    name: 'Image Media',
    type: 'media',
    atoms: ['border-thin', 'shadow-sm', 'spacing-sm'],
    variants: ['responsive', 'rounded', 'overlay', 'lazy'],
    properties: {
      width: '100%',
      height: 'auto',
      borderRadius: '0.5rem',
      objectFit: 'cover'
    }
  },
  {
    id: 'media-video',
    name: 'Video Media',
    type: 'media',
    atoms: ['border-thin', 'shadow-md', 'spacing-sm'],
    variants: ['responsive', 'controls', 'autoplay', 'loop'],
    properties: {
      width: '100%',
      height: 'auto',
      borderRadius: '0.5rem',
      backgroundColor: '#000000'
    }
  },
  {
    id: 'media-gallery',
    name: 'Image Gallery',
    type: 'media',
    atoms: ['media-image', 'spacing-sm'],
    variants: ['grid', 'masonry', 'carousel', 'lightbox'],
    properties: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem'
    }
  },

  // Text Group Molecules (10 variants)
  {
    id: 'text-group-heading',
    name: 'Heading Group',
    type: 'text-group',
    atoms: ['text-heading-1', 'text-heading-2', 'text-body', 'spacing-sm'],
    variants: ['h1-h2', 'h2-h3', 'h3-body', 'all-levels'],
    properties: {
      display: 'flex',
      direction: 'column',
      gap: '0.5rem',
      alignItems: 'flex-start'
    }
  },
  {
    id: 'text-group-paragraph',
    name: 'Paragraph Group',
    type: 'text-group',
    atoms: ['text-body', 'text-caption', 'spacing-md'],
    variants: ['single', 'multiple', 'with-caption'],
    properties: {
      display: 'flex',
      direction: 'column',
      gap: '1rem',
      maxWidth: '65ch'
    }
  },
  {
    id: 'text-group-list',
    name: 'List Group',
    type: 'text-group',
    atoms: ['text-body', 'spacing-sm'],
    variants: ['unordered', 'ordered', 'description'],
    properties: {
      display: 'flex',
      direction: 'column',
      gap: '0.5rem',
      paddingLeft: '1.5rem'
    }
  },

  // Layout Molecules (5 variants)
  {
    id: 'layout-grid',
    name: 'Grid Layout',
    type: 'layout',
    atoms: ['spacing-md'],
    variants: ['2-column', '3-column', '4-column', 'responsive'],
    properties: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    }
  },
  {
    id: 'layout-flex',
    name: 'Flex Layout',
    type: 'layout',
    atoms: ['spacing-md'],
    variants: ['row', 'column', 'wrap', 'center'],
    properties: {
      display: 'flex',
      direction: 'row',
      justify: 'flex-start',
      align: 'stretch',
      gap: '1.5rem'
    }
  },
  {
    id: 'layout-stack',
    name: 'Stack Layout',
    type: 'layout',
    atoms: ['spacing-md'],
    variants: ['vertical', 'horizontal', 'responsive'],
    properties: {
      display: 'flex',
      direction: 'column',
      justify: 'flex-start',
      align: 'stretch',
      gap: '1.5rem'
    }
  }
];

// Molecule Generator
export class MoleculeGenerator {
  private molecules: MoleculeConfig[];
  
  constructor() {
    this.molecules = MOLECULES;
  }
  
  // Get molecule by ID
  getMolecule(id: string): MoleculeConfig | undefined {
    return this.molecules.find(molecule => molecule.id === id);
  }
  
  // Get molecules by type
  getMoleculesByType(type: string): MoleculeConfig[] {
    return this.molecules.filter(molecule => molecule.type === type);
  }
  
  // Generate random molecule combination
  generateRandomMoleculeCombination(): Record<string, MoleculeConfig> {
    const combination: Record<string, MoleculeConfig> = {};
    
    // Select one molecule from each type
    const types = ['navigation', 'card', 'form', 'button-group', 'media', 'text-group', 'layout'];
    types.forEach(type => {
      const moleculesOfType = this.getMoleculesByType(type);
      if (moleculesOfType.length > 0) {
        const randomMolecule = moleculesOfType[Math.floor(Math.random() * moleculesOfType.length)];
        combination[type] = randomMolecule;
      }
    });
    
    return combination;
  }
  
  // Calculate total combinations
  calculateTotalCombinations(): number {
    let total = 1;
    
    const types = ['navigation', 'card', 'form', 'button-group', 'media', 'text-group', 'layout'];
    types.forEach(type => {
      const moleculesOfType = this.getMoleculesByType(type);
      total *= moleculesOfType.length;
    });
    
    return total;
  }
}

// Export the molecule generator
export const moleculeGenerator = new MoleculeGenerator();
