import { 
  AnimationLibraryConfig, 
  AnimationTheme, 
  AnimationPresets, 
  AnimationPreset,
  PerformanceConfig,
  AccessibilityConfig
} from './types'

// Default animation theme
export const defaultAnimationTheme: AnimationTheme = {
  durations: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.6,
    slower: 1.2
  },
  easings: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: [0.25, 0.46, 0.45, 0.94],
    bounce: [0.68, -0.55, 0.265, 1.55],
    elastic: [0.175, 0.885, 0.32, 1.275]
  },
  scales: {
    subtle: 1.02,
    normal: 1.05,
    strong: 1.1,
    extreme: 1.2
  },
  rotations: {
    subtle: 2,
    normal: 5,
    strong: 10,
    extreme: 15
  }
}

// Performance configuration
export const defaultPerformanceConfig: PerformanceConfig = {
  reduceMotion: false,
  willChange: true,
  transform3d: true,
  gpuAcceleration: true,
  optimizeForMobile: true
}

// Accessibility configuration
export const defaultAccessibilityConfig: AccessibilityConfig = {
  respectReducedMotion: true,
  announceChanges: false,
  focusManagement: true
}

// Default library configuration
export const defaultAnimationConfig: AnimationLibraryConfig = {
  performance: defaultPerformanceConfig,
  accessibility: defaultAccessibilityConfig,
  defaultDuration: 0.3,
  defaultEase: 'ease-out',
  enableGPUAcceleration: true,
  enableReducedMotion: true
}

// Animation presets
export const animationPresets: AnimationPresets = {
  // Fade animation
  fade: {
    name: 'fade',
    variants: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    transition: {
      duration: 0.3,
      ease: 'ease-out'
    },
    config: {
      duration: 0.3,
      ease: 'ease-out'
    }
  },

  // Slide animation
  slide: {
    name: 'slide',
    variants: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    },
    transition: {
      duration: 0.4,
      ease: 'ease-out'
    },
    config: {
      duration: 0.4,
      ease: 'ease-out'
    }
  },

  // Scale animation
  scale: {
    name: 'scale',
    variants: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 }
    },
    transition: {
      duration: 0.3,
      ease: 'ease-out'
    },
    config: {
      duration: 0.3,
      ease: 'ease-out'
    }
  },

  // Bounce animation
  bounce: {
    name: 'bounce',
    variants: {
      initial: { opacity: 0, y: -20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 25
        }
      },
      exit: { opacity: 0, y: -20 }
    },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    },
    config: {
      duration: 0.6,
      ease: 'ease-out'
    }
  },

  // Elastic animation
  elastic: {
    name: 'elastic',
    variants: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20
        }
      },
      exit: { opacity: 0, scale: 0.5 }
    },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    },
    config: {
      duration: 0.8,
      ease: 'ease-out'
    }
  },

  // Spring animation
  spring: {
    name: 'spring',
    variants: {
      initial: { opacity: 0, y: 50 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 150,
          damping: 15
        }
      },
      exit: { opacity: 0, y: 50 }
    },
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 15
    },
    config: {
      duration: 0.6,
      ease: 'spring'
    }
  },

  // Typewriter animation
  typewriter: {
    name: 'typewriter',
    variants: {
      initial: { opacity: 0, width: 0 },
      animate: { 
        opacity: 1, 
        width: 'auto',
        transition: {
          duration: 0.5,
          ease: 'ease-in-out'
        }
      },
      exit: { opacity: 0, width: 0 }
    },
    transition: {
      duration: 0.5,
      ease: 'ease-in-out'
    },
    config: {
      duration: 0.5,
      ease: 'ease-in-out'
    }
  },

  // Stagger animation
  stagger: {
    name: 'stagger',
    variants: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      },
      exit: { opacity: 0 }
    },
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    },
    config: {
      duration: 0.3,
      ease: 'ease-out'
    }
  },

  // Floating animation
  floating: {
    name: 'floating',
    variants: {
      initial: { y: 0 },
      animate: { 
        y: [-10, 10, -10],
        transition: {
          duration: 3,
          repeat: 'infinitely',
          ease: 'ease-in-out'
        }
      },
      exit: { y: 0 }
    },
    transition: {
      duration: 3,
      repeat: 'infinitely',
      ease: 'ease-in-out'
    },
    config: {
      duration: 3,
      ease: 'ease-in-out',
      repeat: 'infinitely'
    }
  },

  // Parallax animation
  parallax: {
    name: 'parallax',
    variants: {
      initial: { y: 0 },
      animate: { 
        y: -50,
        transition: {
          duration: 1,
          ease: 'ease-out'
        }
      },
      exit: { y: 0 }
    },
    transition: {
      duration: 1,
      ease: 'ease-out'
    },
    config: {
      duration: 1,
      ease: 'ease-out'
    }
  },

  // Hero animation
  hero: {
    name: 'hero',
    variants: {
      initial: { 
        opacity: 0, 
        y: 50,
        scale: 0.95
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          duration: 0.8,
          ease: 'ease-out',
          staggerChildren: 0.2,
          delayChildren: 0.1
        }
      },
      exit: { 
        opacity: 0, 
        y: 50,
        scale: 0.95
      }
    },
    transition: {
      duration: 0.8,
      ease: 'ease-out',
      staggerChildren: 0.2,
      delayChildren: 0.1
    },
    config: {
      duration: 0.8,
      ease: 'ease-out'
    }
  }
}

// Page transition presets
export const pageTransitionPresets = {
  fade: {
    type: 'fade' as const,
    duration: 0.3,
    ease: 'ease-out'
  },
  slideLeft: {
    type: 'slide' as const,
    direction: 'left' as const,
    duration: 0.4,
    ease: 'ease-out'
  },
  slideRight: {
    type: 'slide' as const,
    direction: 'right' as const,
    duration: 0.4,
    ease: 'ease-out'
  },
  slideUp: {
    type: 'slide' as const,
    direction: 'up' as const,
    duration: 0.4,
    ease: 'ease-out'
  },
  slideDown: {
    type: 'slide' as const,
    direction: 'down' as const,
    duration: 0.4,
    ease: 'ease-out'
  },
  scale: {
    type: 'scale' as const,
    duration: 0.3,
    ease: 'ease-out'
  },
  flip: {
    type: 'flip' as const,
    duration: 0.6,
    ease: 'ease-in-out'
  },
  rotate: {
    type: 'rotate' as const,
    duration: 0.5,
    ease: 'ease-in-out'
  }
}

// Scroll animation presets
export const scrollAnimationPresets = {
  fadeInUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' }
  },
  slideInUp: {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 }
  },
  slideInDown: {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0 }
  }
}

// Hover animation presets
export const hoverAnimationPresets = {
  lift: {
    scale: 1.05,
    y: -5,
    duration: 0.2,
    ease: 'ease-out'
  },
  scale: {
    scale: 1.1,
    duration: 0.2,
    ease: 'ease-out'
  },
  tilt: {
    rotate: 5,
    duration: 0.2,
    ease: 'ease-out'
  },
  glow: {
    brightness: 1.1,
    saturate: 1.2,
    duration: 0.3,
    ease: 'ease-out'
  },
  shadow: {
    y: -10,
    shadow: '0 20px 40px rgba(0,0,0,0.1)',
    duration: 0.3,
    ease: 'ease-out'
  },
  bounce: {
    y: -10,
    duration: 0.3,
    ease: 'ease-out'
  }
}

// Floating animation presets
export const floatingAnimationPresets = {
  gentle: {
    amplitude: 10,
    frequency: 2,
    duration: 3,
    direction: 'vertical' as const
  },
  moderate: {
    amplitude: 20,
    frequency: 1.5,
    duration: 4,
    direction: 'vertical' as const
  },
  strong: {
    amplitude: 30,
    frequency: 1,
    duration: 5,
    direction: 'vertical' as const
  },
  horizontal: {
    amplitude: 15,
    frequency: 2,
    duration: 3,
    direction: 'horizontal' as const
  },
  both: {
    amplitude: 10,
    frequency: 1.5,
    duration: 4,
    direction: 'both' as const
  }
}

// Stagger animation presets
export const staggerAnimationPresets = {
  fast: {
    delayChildren: 0.05,
    staggerChildren: 0.05,
    staggerDirection: 1 as const
  },
  normal: {
    delayChildren: 0.1,
    staggerChildren: 0.1,
    staggerDirection: 1 as const
  },
  slow: {
    delayChildren: 0.2,
    staggerChildren: 0.2,
    staggerDirection: 1 as const
  },
  reverse: {
    delayChildren: 0.1,
    staggerChildren: 0.1,
    staggerDirection: -1 as const
  }
}

// Hero animation presets
export const heroAnimationPresets = {
  typewriter: {
    type: 'typewriter' as const,
    duration: 0.5,
    delay: 0.1,
    ease: 'ease-in-out'
  },
  fadeInUp: {
    type: 'fadeInUp' as const,
    duration: 0.8,
    delay: 0.1,
    ease: 'ease-out'
  },
  slideInLeft: {
    type: 'slideInLeft' as const,
    duration: 0.6,
    delay: 0.1,
    ease: 'ease-out'
  },
  zoomIn: {
    type: 'zoomIn' as const,
    duration: 0.7,
    delay: 0.1,
    ease: 'ease-out'
  },
  blurIn: {
    type: 'blurIn' as const,
    duration: 0.8,
    delay: 0.1,
    ease: 'ease-out'
  }
}

// Parallax animation presets
export const parallaxAnimationPresets = {
  subtle: {
    speed: 0.5,
    direction: 'up' as const,
    offset: 0,
    clamp: true
  },
  normal: {
    speed: 1,
    direction: 'up' as const,
    offset: 0,
    clamp: true
  },
  strong: {
    speed: 2,
    direction: 'up' as const,
    offset: 0,
    clamp: true
  },
  horizontal: {
    speed: 1,
    direction: 'left' as const,
    offset: 0,
    clamp: true
  }
}

// Performance optimization presets
export const performancePresets = {
  high: {
    reduceMotion: false,
    willChange: true,
    transform3d: true,
    gpuAcceleration: true,
    optimizeForMobile: true
  },
  medium: {
    reduceMotion: false,
    willChange: true,
    transform3d: true,
    gpuAcceleration: true,
    optimizeForMobile: false
  },
  low: {
    reduceMotion: true,
    willChange: false,
    transform3d: false,
    gpuAcceleration: false,
    optimizeForMobile: true
  },
  mobile: {
    reduceMotion: false,
    willChange: true,
    transform3d: true,
    gpuAcceleration: true,
    optimizeForMobile: true
  }
}

// Accessibility presets
export const accessibilityPresets = {
  standard: {
    respectReducedMotion: true,
    announceChanges: false,
    focusManagement: true
  },
  enhanced: {
    respectReducedMotion: true,
    announceChanges: true,
    focusManagement: true
  },
  minimal: {
    respectReducedMotion: true,
    announceChanges: false,
    focusManagement: false
  }
}

// Utility functions for configuration
export const createAnimationConfig = (overrides: Partial<AnimationLibraryConfig> = {}): AnimationLibraryConfig => {
  return {
    ...defaultAnimationConfig,
    ...overrides
  }
}

export const createPerformanceConfig = (overrides: Partial<PerformanceConfig> = {}): PerformanceConfig => {
  return {
    ...defaultPerformanceConfig,
    ...overrides
  }
}

export const createAccessibilityConfig = (overrides: Partial<AccessibilityConfig> = {}): AccessibilityConfig => {
  return {
    ...defaultAccessibilityConfig,
    ...overrides
  }
}

export const getAnimationPreset = (name: string): AnimationPreset | undefined => {
  return animationPresets[name as keyof AnimationPresets]
}

export const getAllAnimationPresets = (): AnimationPresets => {
  return animationPresets
}

export const getPageTransitionPreset = (name: string) => {
  return pageTransitionPresets[name as keyof typeof pageTransitionPresets]
}

export const getScrollAnimationPreset = (name: string) => {
  return scrollAnimationPresets[name as keyof typeof scrollAnimationPresets]
}

export const getHoverAnimationPreset = (name: string) => {
  return hoverAnimationPresets[name as keyof typeof hoverAnimationPresets]
}

export const getFloatingAnimationPreset = (name: string) => {
  return floatingAnimationPresets[name as keyof typeof floatingAnimationPresets]
}

export const getStaggerAnimationPreset = (name: string) => {
  return staggerAnimationPresets[name as keyof typeof staggerAnimationPresets]
}

export const getHeroAnimationPreset = (name: string) => {
  return heroAnimationPresets[name as keyof typeof heroAnimationPresets]
}

export const getParallaxAnimationPreset = (name: string) => {
  return parallaxAnimationPresets[name as keyof typeof parallaxAnimationPresets]
}

export const getPerformancePreset = (name: string) => {
  return performancePresets[name as keyof typeof performancePresets]
}

export const getAccessibilityPreset = (name: string) => {
  return accessibilityPresets[name as keyof typeof accessibilityPresets]
}
