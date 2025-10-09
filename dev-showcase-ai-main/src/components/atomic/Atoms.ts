// Atomic Design Component Library - Atoms (50 base elements)
export interface AtomConfig {
  id: string;
  name: string;
  type: 'button' | 'typography' | 'color' | 'spacing' | 'border' | 'shadow' | 'icon';
  variants: string[];
  properties: Record<string, any>;
}

// 50 Base Atoms
export const ATOMS: AtomConfig[] = [
  // Buttons (10 variants)
  {
    id: 'btn-primary',
    name: 'Primary Button',
    type: 'button',
    variants: ['solid', 'outline', 'ghost', 'link'],
    properties: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '600',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease'
    }
  },
  {
    id: 'btn-secondary',
    name: 'Secondary Button',
    type: 'button',
    variants: ['solid', 'outline', 'ghost', 'link'],
    properties: {
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease'
    }
  },
  {
    id: 'btn-large',
    name: 'Large Button',
    type: 'button',
    variants: ['solid', 'outline', 'ghost'],
    properties: {
      padding: '1rem 2rem',
      borderRadius: '0.75rem',
      fontWeight: '700',
      fontSize: '1rem',
      transition: 'all 0.2s ease'
    }
  },
  {
    id: 'btn-small',
    name: 'Small Button',
    type: 'button',
    variants: ['solid', 'outline', 'ghost'],
    properties: {
      padding: '0.375rem 0.75rem',
      borderRadius: '0.25rem',
      fontWeight: '500',
      fontSize: '0.75rem',
      transition: 'all 0.2s ease'
    }
  },
  {
    id: 'btn-icon',
    name: 'Icon Button',
    type: 'button',
    variants: ['square', 'circle', 'rounded'],
    properties: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  {
    id: 'btn-gradient',
    name: 'Gradient Button',
    type: 'button',
    variants: ['linear', 'radial', 'conic'],
    properties: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
      color: 'white',
      fontWeight: '600'
    }
  },
  {
    id: 'btn-3d',
    name: '3D Button',
    type: 'button',
    variants: ['raised', 'pressed', 'floating'],
    properties: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(0)',
      transition: 'all 0.2s ease'
    }
  },
  {
    id: 'btn-glass',
    name: 'Glass Button',
    type: 'button',
    variants: ['frosted', 'blur', 'transparent'],
    properties: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }
  },
  {
    id: 'btn-animated',
    name: 'Animated Button',
    type: 'button',
    variants: ['pulse', 'bounce', 'shake', 'glow'],
    properties: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      animation: 'pulse 2s infinite',
      transition: 'all 0.2s ease'
    }
  },
  {
    id: 'btn-social',
    name: 'Social Button',
    type: 'button',
    variants: ['linkedin', 'github', 'twitter', 'email'],
    properties: {
      padding: '0.5rem',
      borderRadius: '50%',
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },

  // Typography (10 variants)
  {
    id: 'text-heading-1',
    name: 'Heading 1',
    type: 'typography',
    variants: ['display', 'serif', 'sans-serif', 'monospace'],
    properties: {
      fontSize: '4rem',
      fontWeight: '700',
      lineHeight: '1.1',
      letterSpacing: '-0.025em'
    }
  },
  {
    id: 'text-heading-2',
    name: 'Heading 2',
    type: 'typography',
    variants: ['display', 'serif', 'sans-serif', 'monospace'],
    properties: {
      fontSize: '2.5rem',
      fontWeight: '600',
      lineHeight: '1.2',
      letterSpacing: '-0.025em'
    }
  },
  {
    id: 'text-heading-3',
    name: 'Heading 3',
    type: 'typography',
    variants: ['display', 'serif', 'sans-serif', 'monospace'],
    properties: {
      fontSize: '1.875rem',
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '0'
    }
  },
  {
    id: 'text-body',
    name: 'Body Text',
    type: 'typography',
    variants: ['regular', 'medium', 'large', 'small'],
    properties: {
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0'
    }
  },
  {
    id: 'text-caption',
    name: 'Caption Text',
    type: 'typography',
    variants: ['regular', 'medium', 'large', 'small'],
    properties: {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0.025em'
    }
  },
  {
    id: 'text-label',
    name: 'Label Text',
    type: 'typography',
    variants: ['regular', 'medium', 'large', 'small'],
    properties: {
      fontSize: '0.75rem',
      fontWeight: '500',
      lineHeight: '1.4',
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    }
  },
  {
    id: 'text-gradient',
    name: 'Gradient Text',
    type: 'typography',
    variants: ['linear', 'radial', 'conic'],
    properties: {
      fontSize: '2rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  },
  {
    id: 'text-animated',
    name: 'Animated Text',
    type: 'typography',
    variants: ['typewriter', 'fade-in', 'slide-up', 'glow'],
    properties: {
      fontSize: '1.5rem',
      fontWeight: '600',
      animation: 'typewriter 3s steps(40) 1s 1 normal both'
    }
  },
  {
    id: 'text-code',
    name: 'Code Text',
    type: 'typography',
    variants: ['inline', 'block', 'terminal'],
    properties: {
      fontFamily: 'monospace',
      fontSize: '0.875rem',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem'
    }
  },
  {
    id: 'text-quote',
    name: 'Quote Text',
    type: 'typography',
    variants: ['blockquote', 'pullquote', 'testimonial'],
    properties: {
      fontSize: '1.25rem',
      fontWeight: '400',
      lineHeight: '1.6',
      fontStyle: 'italic',
      borderLeft: '4px solid #1E40AF',
      paddingLeft: '1rem'
    }
  },

  // Colors (10 variants)
  {
    id: 'color-primary',
    name: 'Primary Color',
    type: 'color',
    variants: ['blue', 'green', 'purple', 'red', 'orange'],
    properties: {
      value: '#1E40AF',
      contrast: '#FFFFFF',
      shades: ['#1E3A8A', '#1E40AF', '#2563EB', '#3B82F6', '#60A5FA']
    }
  },
  {
    id: 'color-secondary',
    name: 'Secondary Color',
    type: 'color',
    variants: ['blue', 'green', 'purple', 'red', 'orange'],
    properties: {
      value: '#3B82F6',
      contrast: '#FFFFFF',
      shades: ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD']
    }
  },
  {
    id: 'color-accent',
    name: 'Accent Color',
    type: 'color',
    variants: ['blue', 'green', 'purple', 'red', 'orange'],
    properties: {
      value: '#8B5CF6',
      contrast: '#FFFFFF',
      shades: ['#7C3AED', '#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE']
    }
  },
  {
    id: 'color-success',
    name: 'Success Color',
    type: 'color',
    variants: ['green', 'emerald', 'teal'],
    properties: {
      value: '#10B981',
      contrast: '#FFFFFF',
      shades: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0']
    }
  },
  {
    id: 'color-warning',
    name: 'Warning Color',
    type: 'color',
    variants: ['yellow', 'amber', 'orange'],
    properties: {
      value: '#F59E0B',
      contrast: '#FFFFFF',
      shades: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A']
    }
  },
  {
    id: 'color-error',
    name: 'Error Color',
    type: 'color',
    variants: ['red', 'rose', 'pink'],
    properties: {
      value: '#EF4444',
      contrast: '#FFFFFF',
      shades: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA']
    }
  },
  {
    id: 'color-neutral',
    name: 'Neutral Color',
    type: 'color',
    variants: ['gray', 'slate', 'zinc'],
    properties: {
      value: '#6B7280',
      contrast: '#FFFFFF',
      shades: ['#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6']
    }
  },
  {
    id: 'color-background',
    name: 'Background Color',
    type: 'color',
    variants: ['light', 'dark', 'gradient'],
    properties: {
      value: '#FFFFFF',
      contrast: '#000000',
      shades: ['#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8']
    }
  },
  {
    id: 'color-surface',
    name: 'Surface Color',
    type: 'color',
    variants: ['light', 'dark', 'glass'],
    properties: {
      value: '#F8FAFC',
      contrast: '#000000',
      shades: ['#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B']
    }
  },
  {
    id: 'color-text',
    name: 'Text Color',
    type: 'color',
    variants: ['primary', 'secondary', 'muted'],
    properties: {
      value: '#1F2937',
      contrast: '#FFFFFF',
      shades: ['#111827', '#1F2937', '#374151', '#4B5563', '#6B7280']
    }
  },

  // Spacing (10 variants)
  {
    id: 'spacing-xs',
    name: 'Extra Small Spacing',
    type: 'spacing',
    variants: ['margin', 'padding', 'gap'],
    properties: {
      value: '0.25rem',
      variants: {
        margin: '0.25rem',
        padding: '0.25rem',
        gap: '0.25rem'
      }
    }
  },
  {
    id: 'spacing-sm',
    name: 'Small Spacing',
    type: 'spacing',
    variants: ['margin', 'padding', 'gap'],
    properties: {
      value: '0.5rem',
      variants: {
        margin: '0.5rem',
        padding: '0.5rem',
        gap: '0.5rem'
      }
    }
  },
  {
    id: 'spacing-md',
    name: 'Medium Spacing',
    type: 'spacing',
    variants: ['margin', 'padding', 'gap'],
    properties: {
      value: '1rem',
      variants: {
        margin: '1rem',
        padding: '1rem',
        gap: '1rem'
      }
    }
  },
  {
    id: 'spacing-lg',
    name: 'Large Spacing',
    type: 'spacing',
    variants: ['margin', 'padding', 'gap'],
    properties: {
      value: '1.5rem',
      variants: {
        margin: '1.5rem',
        padding: '1.5rem',
        gap: '1.5rem'
      }
    }
  },
  {
    id: 'spacing-xl',
    name: 'Extra Large Spacing',
    type: 'spacing',
    variants: ['margin', 'padding', 'gap'],
    properties: {
      value: '2rem',
      variants: {
        margin: '2rem',
        padding: '2rem',
        gap: '2rem'
      }
    }
  },
  {
    id: 'spacing-2xl',
    name: '2X Large Spacing',
    type: 'spacing',
    variants: ['margin', 'padding', 'gap'],
    properties: {
      value: '3rem',
      variants: {
        margin: '3rem',
        padding: '3rem',
        gap: '3rem'
      }
    }
  },
  {
    id: 'spacing-3xl',
    name: '3X Large Spacing',
    type: 'spacing',
    variants: ['margin', 'padding', 'gap'],
    properties: {
      value: '4rem',
      variants: {
        margin: '4rem',
        padding: '4rem',
        gap: '4rem'
      }
    }
  },
  {
    id: 'spacing-section',
    name: 'Section Spacing',
    type: 'spacing',
    variants: ['margin', 'padding', 'gap'],
    properties: {
      value: '6rem',
      variants: {
        margin: '6rem 0',
        padding: '6rem 0',
        gap: '6rem'
      }
    }
  },
  {
    id: 'spacing-container',
    name: 'Container Spacing',
    type: 'spacing',
    variants: ['margin', 'padding', 'gap'],
    properties: {
      value: '2rem',
      variants: {
        margin: '0 auto',
        padding: '0 2rem',
        gap: '2rem'
      }
    }
  },
  {
    id: 'spacing-responsive',
    name: 'Responsive Spacing',
    type: 'spacing',
    variants: ['margin', 'padding', 'gap'],
    properties: {
      value: 'clamp(1rem, 5vw, 4rem)',
      variants: {
        margin: 'clamp(1rem, 5vw, 4rem)',
        padding: 'clamp(1rem, 5vw, 4rem)',
        gap: 'clamp(1rem, 5vw, 4rem)'
      }
    }
  },

  // Borders (5 variants)
  {
    id: 'border-thin',
    name: 'Thin Border',
    type: 'border',
    variants: ['solid', 'dashed', 'dotted'],
    properties: {
      width: '1px',
      style: 'solid',
      color: '#E5E7EB',
      radius: '0.25rem'
    }
  },
  {
    id: 'border-medium',
    name: 'Medium Border',
    type: 'border',
    variants: ['solid', 'dashed', 'dotted'],
    properties: {
      width: '2px',
      style: 'solid',
      color: '#D1D5DB',
      radius: '0.5rem'
    }
  },
  {
    id: 'border-thick',
    name: 'Thick Border',
    type: 'border',
    variants: ['solid', 'dashed', 'dotted'],
    properties: {
      width: '4px',
      style: 'solid',
      color: '#9CA3AF',
      radius: '0.75rem'
    }
  },
  {
    id: 'border-gradient',
    name: 'Gradient Border',
    type: 'border',
    variants: ['linear', 'radial', 'conic'],
    properties: {
      width: '2px',
      style: 'solid',
      background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
      radius: '0.5rem'
    }
  },
  {
    id: 'border-glass',
    name: 'Glass Border',
    type: 'border',
    variants: ['frosted', 'blur', 'transparent'],
    properties: {
      width: '1px',
      style: 'solid',
      color: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      radius: '0.5rem'
    }
  },

  // Shadows (5 variants)
  {
    id: 'shadow-sm',
    name: 'Small Shadow',
    type: 'shadow',
    variants: ['drop', 'inner', 'glow'],
    properties: {
      value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      blur: '2px',
      spread: '0',
      color: 'rgba(0, 0, 0, 0.05)'
    }
  },
  {
    id: 'shadow-md',
    name: 'Medium Shadow',
    type: 'shadow',
    variants: ['drop', 'inner', 'glow'],
    properties: {
      value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      blur: '6px',
      spread: '-1px',
      color: 'rgba(0, 0, 0, 0.1)'
    }
  },
  {
    id: 'shadow-lg',
    name: 'Large Shadow',
    type: 'shadow',
    variants: ['drop', 'inner', 'glow'],
    properties: {
      value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      blur: '15px',
      spread: '-3px',
      color: 'rgba(0, 0, 0, 0.1)'
    }
  },
  {
    id: 'shadow-xl',
    name: 'Extra Large Shadow',
    type: 'shadow',
    variants: ['drop', 'inner', 'glow'],
    properties: {
      value: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      blur: '25px',
      spread: '-5px',
      color: 'rgba(0, 0, 0, 0.1)'
    }
  },
  {
    id: 'shadow-colored',
    name: 'Colored Shadow',
    type: 'shadow',
    variants: ['drop', 'inner', 'glow'],
    properties: {
      value: '0 10px 15px -3px rgba(30, 64, 175, 0.3)',
      blur: '15px',
      spread: '-3px',
      color: 'rgba(30, 64, 175, 0.3)'
    }
  }
];

// Atom Generator
export class AtomGenerator {
  private atoms: AtomConfig[];
  
  constructor() {
    this.atoms = ATOMS;
  }
  
  // Get atom by ID
  getAtom(id: string): AtomConfig | undefined {
    return this.atoms.find(atom => atom.id === id);
  }
  
  // Get atoms by type
  getAtomsByType(type: string): AtomConfig[] {
    return this.atoms.filter(atom => atom.type === type);
  }
  
  // Generate random atom combination
  generateRandomAtomCombination(): Record<string, AtomConfig> {
    const combination: Record<string, AtomConfig> = {};
    
    // Select one atom from each type
    const types = ['button', 'typography', 'color', 'spacing', 'border', 'shadow'];
    types.forEach(type => {
      const atomsOfType = this.getAtomsByType(type);
      if (atomsOfType.length > 0) {
        const randomAtom = atomsOfType[Math.floor(Math.random() * atomsOfType.length)];
        combination[type] = randomAtom;
      }
    });
    
    return combination;
  }
  
  // Calculate total combinations
  calculateTotalCombinations(): number {
    let total = 1;
    
    const types = ['button', 'typography', 'color', 'spacing', 'border', 'shadow'];
    types.forEach(type => {
      const atomsOfType = this.getAtomsByType(type);
      total *= atomsOfType.length;
    });
    
    return total;
  }
}

// Export the atom generator
export const atomGenerator = new AtomGenerator();
