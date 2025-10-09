import { Variants, Transition, TargetAndTransition } from 'framer-motion'

// Base animation types
export interface AnimationConfig {
  duration?: number
  delay?: number
  ease?: string | number[]
  repeat?: number | 'infinitely'
  repeatType?: 'loop' | 'reverse' | 'mirror'
  repeatDelay?: number
}

export interface Position {
  x?: number | string
  y?: number | string
  z?: number | string
}

export interface Scale {
  scale?: number
  scaleX?: number
  scaleY?: number
  scaleZ?: number
}

export interface Rotation {
  rotate?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
}

export interface Opacity {
  opacity?: number
}

export interface Transform extends Position, Scale, Rotation, Opacity {}

// Animation variants
export interface AnimationVariants {
  initial?: TargetAndTransition
  animate?: TargetAndTransition
  exit?: TargetAndTransition
  hover?: TargetAndTransition
  tap?: TargetAndTransition
  focus?: TargetAndTransition
  whileInView?: TargetAndTransition
  whileDrag?: TargetAndTransition
}

// Page transition types
export interface PageTransitionConfig {
  type: 'fade' | 'slide' | 'scale' | 'flip' | 'rotate' | 'custom'
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  ease?: string | number[]
  delay?: number
}

export interface PageTransitionVariants {
  enter: TargetAndTransition
  exit: TargetAndTransition
}

// Scroll animation types
export interface ScrollAnimationConfig {
  trigger?: 'onEnter' | 'onLeave' | 'onCenter'
  threshold?: number
  rootMargin?: string
  once?: boolean
  amount?: 'some' | 'all'
}

export interface ScrollAnimationVariants {
  hidden: TargetAndTransition
  visible: TargetAndTransition
}

// Parallax types
export interface ParallaxConfig {
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  offset?: number
  clamp?: boolean
  stiffness?: number
  damping?: number
  mass?: number
}

// Hover interaction types
export interface HoverConfig {
  scale?: number
  rotate?: number
  y?: number
  x?: number
  shadow?: string
  brightness?: number
  saturate?: number
  duration?: number
  ease?: string | number[]
}

// Staggered animation types
export interface StaggerConfig {
  delayChildren?: number
  staggerChildren?: number
  staggerDirection?: 1 | -1
}

export interface StaggerVariants {
  hidden: AnimationVariants
  visible: AnimationVariants
}

// Floating animation types
export interface FloatingConfig {
  amplitude?: number
  frequency?: number
  duration?: number
  ease?: string | number[]
  direction?: 'vertical' | 'horizontal' | 'both'
}

// Hero animation types
export interface HeroAnimationConfig {
  type: 'typewriter' | 'fadeInUp' | 'slideInLeft' | 'zoomIn' | 'blurIn' | 'custom'
  duration?: number
  delay?: number
  stagger?: number
  ease?: string | number[]
}

// Performance configuration
export interface PerformanceConfig {
  reduceMotion?: boolean
  willChange?: boolean
  transform3d?: boolean
  gpuAcceleration?: boolean
  optimizeForMobile?: boolean
}

// Accessibility configuration
export interface AccessibilityConfig {
  respectReducedMotion?: boolean
  announceChanges?: boolean
  focusManagement?: boolean
}

// Animation presets
export interface AnimationPreset {
  name: string
  variants: AnimationVariants
  transition?: Transition
  config?: AnimationConfig
}

// Animation library configuration
export interface AnimationLibraryConfig {
  performance: PerformanceConfig
  accessibility: AccessibilityConfig
  defaultDuration: number
  defaultEase: string | number[]
  enableGPUAcceleration: boolean
  enableReducedMotion: boolean
}

// Specific animation component props
export interface PageTransitionProps {
  children: React.ReactNode
  config?: PageTransitionConfig
  className?: string
  style?: React.CSSProperties
}

export interface ScrollAnimationProps {
  children: React.ReactNode
  config?: ScrollAnimationConfig
  variants?: ScrollAnimationVariants
  className?: string
  style?: React.CSSProperties
}

export interface ParallaxProps {
  children: React.ReactNode
  config?: ParallaxConfig
  className?: string
  style?: React.CSSProperties
}

export interface HoverAnimationProps {
  children: React.ReactNode
  config?: HoverConfig
  className?: string
  style?: React.CSSProperties
}

export interface StaggeredAnimationProps {
  children: React.ReactNode
  config?: StaggerConfig
  variants?: StaggerVariants
  className?: string
  style?: React.CSSProperties
}

export interface FloatingAnimationProps {
  children: React.ReactNode
  config?: FloatingConfig
  className?: string
  style?: React.CSSProperties
}

export interface HeroAnimationProps {
  children: React.ReactNode
  config?: HeroAnimationConfig
  className?: string
  style?: React.CSSProperties
}

// Animation hook return types
export interface UseAnimationReturn {
  variants: AnimationVariants
  transition: Transition
  controls: any
  ref: React.RefObject<HTMLElement>
}

export interface UseScrollAnimationReturn {
  variants: ScrollAnimationVariants
  controls: any
  ref: React.RefObject<HTMLElement>
  inView: boolean
}

export interface UseParallaxReturn {
  y: any
  x: any
  ref: React.RefObject<HTMLElement>
}

// Animation context types
export interface AnimationContextType {
  config: AnimationLibraryConfig
  updateConfig: (config: Partial<AnimationLibraryConfig>) => void
  respectReducedMotion: boolean
  isMobile: boolean
  prefersReducedMotion: boolean
}

// Animation utilities
export interface AnimationUtils {
  createVariants: (config: AnimationConfig) => AnimationVariants
  createTransition: (config: AnimationConfig) => Transition
  shouldReduceMotion: () => boolean
  isMobileDevice: () => boolean
  optimizeForPerformance: (variants: AnimationVariants) => AnimationVariants
}

// Animation presets library
export interface AnimationPresets {
  fade: AnimationPreset
  slide: AnimationPreset
  scale: AnimationPreset
  bounce: AnimationPreset
  elastic: AnimationPreset
  spring: AnimationPreset
  typewriter: AnimationPreset
  stagger: AnimationPreset
  floating: AnimationPreset
  parallax: AnimationPreset
  hero: AnimationPreset
}

// Animation performance metrics
export interface AnimationPerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  gpuUsage: number
  droppedFrames: number
}

// Animation debugging
export interface AnimationDebugConfig {
  enabled: boolean
  showFPS: boolean
  showTiming: boolean
  showVariants: boolean
  logPerformance: boolean
}

// Animation theme
export interface AnimationTheme {
  durations: {
    fast: number
    normal: number
    slow: number
    slower: number
  }
  easings: {
    linear: string
    ease: string
    easeIn: string
    easeOut: string
    easeInOut: string
    spring: number[]
    bounce: number[]
    elastic: number[]
  }
  scales: {
    subtle: number
    normal: number
    strong: number
    extreme: number
  }
  rotations: {
    subtle: number
    normal: number
    strong: number
    extreme: number
  }
}

// Animation events
export interface AnimationEvents {
  onAnimationStart?: () => void
  onAnimationComplete?: () => void
  onAnimationRepeat?: () => void
  onHoverStart?: () => void
  onHoverEnd?: () => void
  onTap?: () => void
  onFocus?: () => void
  onBlur?: () => void
  onInView?: () => void
  onOutOfView?: () => void
}

// Animation composition
export interface AnimationComposition {
  combine: (animations: AnimationVariants[]) => AnimationVariants
  sequence: (animations: AnimationVariants[]) => AnimationVariants
  parallel: (animations: AnimationVariants[]) => AnimationVariants
  conditional: (condition: boolean, trueAnimation: AnimationVariants, falseAnimation: AnimationVariants) => AnimationVariants
}

// Animation testing
export interface AnimationTestConfig {
  enabled: boolean
  testVariants: boolean
  testPerformance: boolean
  testAccessibility: boolean
  mockReducedMotion: boolean
}

// Animation export types
export interface AnimationExports {
  // Components
  PageTransition: React.ComponentType<PageTransitionProps>
  ScrollAnimation: React.ComponentType<ScrollAnimationProps>
  Parallax: React.ComponentType<ParallaxProps>
  HoverAnimation: React.ComponentType<HoverAnimationProps>
  StaggeredAnimation: React.ComponentType<StaggeredAnimationProps>
  FloatingAnimation: React.ComponentType<FloatingAnimationProps>
  HeroAnimation: React.ComponentType<HeroAnimationProps>
  
  // Hooks
  useAnimation: () => UseAnimationReturn
  useScrollAnimation: (config?: ScrollAnimationConfig) => UseScrollAnimationReturn
  useParallax: (config?: ParallaxConfig) => UseParallaxReturn
  useStaggeredAnimation: (config?: StaggerConfig) => any
  
  // Utilities
  createVariants: (config: AnimationConfig) => AnimationVariants
  createTransition: (config: AnimationConfig) => Transition
  getAnimationPreset: (name: string) => AnimationPreset | undefined
  
  // Configuration
  AnimationProvider: React.ComponentType<{ children: React.ReactNode }>
  useAnimationContext: () => AnimationContextType
  
  // Presets
  presets: AnimationPresets
  
  // Theme
  theme: AnimationTheme
  
  // Utils
  utils: AnimationUtils
}
