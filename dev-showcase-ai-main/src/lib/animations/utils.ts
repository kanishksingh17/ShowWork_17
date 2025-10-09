import { Variants, Transition, TargetAndTransition } from 'framer-motion'
import { 
  AnimationConfig, 
  AnimationVariants, 
  PerformanceConfig, 
  AccessibilityConfig,
  AnimationTheme,
  AnimationPreset,
  AnimationUtils
} from './types'
import { defaultAnimationTheme } from './config'

// Check if user prefers reduced motion
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Check if device is mobile
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth < 768
}

// Check if device supports touch
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Get device pixel ratio
export const getDevicePixelRatio = (): number => {
  if (typeof window === 'undefined') return 1
  
  return window.devicePixelRatio || 1
}

// Check if browser supports WebGL
export const supportsWebGL = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch (e) {
    return false
  }
}

// Check if browser supports CSS transforms
export const supportsCSSTransforms = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const style = document.createElement('div').style
  return 'transform' in style || 'webkitTransform' in style || 'mozTransform' in style
}

// Check if browser supports CSS animations
export const supportsCSSAnimations = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const style = document.createElement('div').style
  return 'animation' in style || 'webkitAnimation' in style
}

// Create optimized variants for performance
export const optimizeVariantsForPerformance = (
  variants: AnimationVariants,
  config: PerformanceConfig
): AnimationVariants => {
  if (!config.transform3d) {
    // Remove 3D transforms if not supported
    const optimizedVariants = { ...variants }
    
    Object.keys(optimizedVariants).forEach(key => {
      const variant = optimizedVariants[key as keyof AnimationVariants]
      if (variant && typeof variant === 'object') {
        delete (variant as any).rotateX
        delete (variant as any).rotateY
        delete (variant as any).rotateZ
        delete (variant as any).scaleZ
        delete (variant as any).z
      }
    })
    
    return optimizedVariants
  }
  
  return variants
}

// Create reduced motion variants
export const createReducedMotionVariants = (variants: AnimationVariants): AnimationVariants => {
  const reducedMotionVariants: AnimationVariants = {}
  
  Object.keys(variants).forEach(key => {
    const variant = variants[key as keyof AnimationVariants]
    if (variant && typeof variant === 'object') {
      // Keep only opacity changes, remove transforms
      reducedMotionVariants[key as keyof AnimationVariants] = {
        opacity: (variant as any).opacity || 1
      }
    }
  })
  
  return reducedMotionVariants
}

// Create mobile-optimized variants
export const createMobileOptimizedVariants = (variants: AnimationVariants): AnimationVariants => {
  const mobileVariants: AnimationVariants = {}
  
  Object.keys(variants).forEach(key => {
    const variant = variants[key as keyof AnimationVariants]
    if (variant && typeof variant === 'object') {
      // Reduce animation intensity on mobile
      const mobileVariant = { ...variant }
      
      if ((mobileVariant as any).scale) {
        (mobileVariant as any).scale = Math.min((mobileVariant as any).scale, 1.05)
      }
      
      if ((mobileVariant as any).y) {
        (mobileVariant as any).y = (mobileVariant as any).y * 0.5
      }
      
      if ((mobileVariant as any).x) {
        (mobileVariant as any).x = (mobileVariant as any).x * 0.5
      }
      
      mobileVariants[key as keyof AnimationVariants] = mobileVariant
    }
  })
  
  return mobileVariants
}

// Create variants from configuration
export const createVariants = (config: AnimationConfig): AnimationVariants => {
  const variants: AnimationVariants = {}
  
  // Initial state
  variants.initial = {
    opacity: 0,
    y: 20,
    transition: {
      duration: config.duration || 0.3,
      ease: config.ease || 'ease-out'
    }
  }
  
  // Animate state
  variants.animate = {
    opacity: 1,
    y: 0,
    transition: {
      duration: config.duration || 0.3,
      ease: config.ease || 'ease-out',
      delay: config.delay || 0
    }
  }
  
  // Exit state
  variants.exit = {
    opacity: 0,
    y: -20,
    transition: {
      duration: config.duration || 0.3,
      ease: config.ease || 'ease-out'
    }
  }
  
  // Hover state
  variants.hover = {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'ease-out'
    }
  }
  
  // Tap state
  variants.tap = {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'ease-out'
    }
  }
  
  return variants
}

// Create transition from configuration
export const createTransition = (config: AnimationConfig): Transition => {
  return {
    duration: config.duration || 0.3,
    ease: config.ease || 'ease-out',
    delay: config.delay || 0,
    repeat: config.repeat || 0,
    repeatType: config.repeatType || 'loop',
    repeatDelay: config.repeatDelay || 0
  }
}

// Combine multiple variants
export const combineVariants = (variantsArray: AnimationVariants[]): AnimationVariants => {
  const combined: AnimationVariants = {}
  
  variantsArray.forEach(variants => {
    Object.keys(variants).forEach(key => {
      const variant = variants[key as keyof AnimationVariants]
      if (variant) {
        combined[key as keyof AnimationVariants] = {
          ...combined[key as keyof AnimationVariants],
          ...variant
        }
      }
    })
  })
  
  return combined
}

// Create sequence variants
export const createSequenceVariants = (variantsArray: AnimationVariants[]): AnimationVariants => {
  const sequence: AnimationVariants = {}
  let totalDelay = 0
  
  variantsArray.forEach((variants, index) => {
    Object.keys(variants).forEach(key => {
      const variant = variants[key as keyof AnimationVariants]
      if (variant) {
        const duration = (variant as any).transition?.duration || 0.3
        sequence[key as keyof AnimationVariants] = {
          ...variant,
          transition: {
            ...variant.transition,
            delay: totalDelay
          }
        }
        totalDelay += duration
      }
    })
  })
  
  return sequence
}

// Create conditional variants
export const createConditionalVariants = (
  condition: boolean,
  trueVariants: AnimationVariants,
  falseVariants: AnimationVariants
): AnimationVariants => {
  return condition ? trueVariants : falseVariants
}

// Calculate animation duration based on distance
export const calculateDurationFromDistance = (distance: number, baseDuration: number = 0.3): number => {
  const maxDistance = 100
  const normalizedDistance = Math.min(distance / maxDistance, 1)
  return baseDuration + (normalizedDistance * 0.2)
}

// Calculate animation delay based on index
export const calculateDelayFromIndex = (index: number, baseDelay: number = 0.1): number => {
  return index * baseDelay
}

// Create spring configuration
export const createSpringConfig = (stiffness: number = 150, damping: number = 15): Transition => {
  return {
    type: 'spring',
    stiffness,
    damping
  }
}

// Create keyframes animation
export const createKeyframesAnimation = (keyframes: any[]): Transition => {
  return {
    duration: 1,
    ease: 'linear',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create stagger configuration
export const createStaggerConfig = (
  delayChildren: number = 0.1,
  staggerChildren: number = 0.1,
  staggerDirection: 1 | -1 = 1
): Transition => {
  return {
    delayChildren,
    staggerChildren,
    staggerDirection
  }
}

// Create parallax configuration
export const createParallaxConfig = (
  speed: number = 1,
  direction: 'up' | 'down' | 'left' | 'right' = 'up'
): Transition => {
  return {
    duration: 1,
    ease: 'ease-out'
  }
}

// Create floating animation
export const createFloatingAnimation = (
  amplitude: number = 10,
  frequency: number = 2,
  duration: number = 3
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create typewriter animation
export const createTypewriterAnimation = (
  duration: number = 0.5,
  delay: number = 0.1
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    delay
  }
}

// Create blur animation
export const createBlurAnimation = (
  blurAmount: number = 10,
  duration: number = 0.3
): Transition => {
  return {
    duration,
    ease: 'ease-out'
  }
}

// Create scale animation
export const createScaleAnimation = (
  scale: number = 1.1,
  duration: number = 0.3
): Transition => {
  return {
    duration,
    ease: 'ease-out'
  }
}

// Create rotate animation
export const createRotateAnimation = (
  rotate: number = 360,
  duration: number = 1
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create slide animation
export const createSlideAnimation = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance: number = 50,
  duration: number = 0.4
): Transition => {
  return {
    duration,
    ease: 'ease-out'
  }
}

// Create fade animation
export const createFadeAnimation = (
  duration: number = 0.3,
  delay: number = 0
): Transition => {
  return {
    duration,
    ease: 'ease-out',
    delay
  }
}

// Create bounce animation
export const createBounceAnimation = (
  stiffness: number = 400,
  damping: number = 25
): Transition => {
  return {
    type: 'spring',
    stiffness,
    damping
  }
}

// Create elastic animation
export const createElasticAnimation = (
  stiffness: number = 300,
  damping: number = 20
): Transition => {
  return {
    type: 'spring',
    stiffness,
    damping
  }
}

// Create wobble animation
export const createWobbleAnimation = (
  stiffness: number = 200,
  damping: number = 10
): Transition => {
  return {
    type: 'spring',
    stiffness,
    damping
  }
}

// Create shake animation
export const createShakeAnimation = (
  intensity: number = 10,
  duration: number = 0.5
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 3,
    repeatType: 'reverse'
  }
}

// Create pulse animation
export const createPulseAnimation = (
  scale: number = 1.1,
  duration: number = 0.5
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create heartbeat animation
export const createHeartbeatAnimation = (
  scale: number = 1.2,
  duration: number = 0.8
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create glow animation
export const createGlowAnimation = (
  intensity: number = 1.2,
  duration: number = 2
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create shimmer animation
export const createShimmerAnimation = (
  duration: number = 1.5
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create wave animation
export const createWaveAnimation = (
  amplitude: number = 20,
  frequency: number = 1,
  duration: number = 2
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create spiral animation
export const createSpiralAnimation = (
  radius: number = 50,
  duration: number = 3
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create orbit animation
export const createOrbitAnimation = (
  radius: number = 100,
  duration: number = 4
): Transition => {
  return {
    duration,
    ease: 'linear',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create pendulum animation
export const createPendulumAnimation = (
  angle: number = 30,
  duration: number = 2
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create breathing animation
export const createBreathingAnimation = (
  scale: number = 1.05,
  duration: number = 3
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create twinkle animation
export const createTwinkleAnimation = (
  opacity: number = 0.3,
  duration: number = 1
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create sparkle animation
export const createSparkleAnimation = (
  scale: number = 1.3,
  duration: number = 0.3
): Transition => {
  return {
    duration,
    ease: 'ease-out',
    repeat: 3,
    repeatType: 'reverse'
  }
}

// Create morphing animation
export const createMorphingAnimation = (
  duration: number = 2
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create liquid animation
export const createLiquidAnimation = (
  duration: number = 3
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create matrix animation
export const createMatrixAnimation = (
  duration: number = 0.1
): Transition => {
  return {
    duration,
    ease: 'linear',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create glitch animation
export const createGlitchAnimation = (
  intensity: number = 5,
  duration: number = 0.1
): Transition => {
  return {
    duration,
    ease: 'linear',
    repeat: 5,
    repeatType: 'reverse'
  }
}

// Create neon animation
export const createNeonAnimation = (
  intensity: number = 1.5,
  duration: number = 1
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create hologram animation
export const createHologramAnimation = (
  duration: number = 2
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create cyberpunk animation
export const createCyberpunkAnimation = (
  duration: number = 1.5
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create retro animation
export const createRetroAnimation = (
  duration: number = 0.5
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create vintage animation
export const createVintageAnimation = (
  duration: number = 2
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create modern animation
export const createModernAnimation = (
  duration: number = 0.3
): Transition => {
  return {
    duration,
    ease: 'ease-out'
  }
}

// Create minimalist animation
export const createMinimalistAnimation = (
  duration: number = 0.2
): Transition => {
  return {
    duration,
    ease: 'ease-out'
  }
}

// Create maximalist animation
export const createMaximalistAnimation = (
  duration: number = 1
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create organic animation
export const createOrganicAnimation = (
  duration: number = 4
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create geometric animation
export const createGeometricAnimation = (
  duration: number = 2
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create fluid animation
export const createFluidAnimation = (
  duration: number = 3
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create rigid animation
export const createRigidAnimation = (
  duration: number = 0.5
): Transition => {
  return {
    duration,
    ease: 'ease-out'
  }
}

// Create soft animation
export const createSoftAnimation = (
  duration: number = 0.8
): Transition => {
  return {
    duration,
    ease: 'ease-out'
  }
}

// Create sharp animation
export const createSharpAnimation = (
  duration: number = 0.1
): Transition => {
  return {
    duration,
    ease: 'ease-out'
  }
}

// Create smooth animation
export const createSmoothAnimation = (
  duration: number = 0.6
): Transition => {
  return {
    duration,
    ease: 'ease-in-out'
  }
}

// Create jerky animation
export const createJerkyAnimation = (
  duration: number = 0.2
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 3,
    repeatType: 'reverse'
  }
}

// Create gentle animation
export const createGentleAnimation = (
  duration: number = 1
): Transition => {
  return {
    duration,
    ease: 'ease-out'
  }
}

// Create aggressive animation
export const createAggressiveAnimation = (
  duration: number = 0.1
): Transition => {
  return {
    duration,
    ease: 'ease-out',
    repeat: 5,
    repeatType: 'reverse'
  }
}

// Create calm animation
export const createCalmAnimation = (
  duration: number = 2
): Transition => {
  return {
    duration,
    ease: 'ease-out'
  }
}

// Create energetic animation
export const createEnergeticAnimation = (
  duration: number = 0.3
): Transition => {
  return {
    duration,
    ease: 'ease-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create peaceful animation
export const createPeacefulAnimation = (
  duration: number = 3
): Transition => {
  return {
    duration,
    ease: 'ease-out'
  }
}

// Create chaotic animation
export const createChaoticAnimation = (
  duration: number = 0.05
): Transition => {
  return {
    duration,
    ease: 'linear',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create ordered animation
export const createOrderedAnimation = (
  duration: number = 1
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Create random animation
export const createRandomAnimation = (
  duration: number = 0.5
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'loop'
  }
}

// Create predictable animation
export const createPredictableAnimation = (
  duration: number = 1
): Transition => {
  return {
    duration,
    ease: 'ease-in-out',
    repeat: 'infinitely',
    repeatType: 'reverse'
  }
}

// Animation utilities object
export const animationUtils: AnimationUtils = {
  createVariants,
  createTransition,
  shouldReduceMotion,
  isMobileDevice,
  optimizeForPerformance: optimizeVariantsForPerformance
}

// Export all utility functions
export {
  // Core utilities
  createVariants,
  createTransition,
  combineVariants,
  createSequenceVariants,
  createConditionalVariants,
  
  // Performance utilities
  optimizeVariantsForPerformance,
  createReducedMotionVariants,
  createMobileOptimizedVariants,
  
  // Device detection
  shouldReduceMotion,
  isMobileDevice,
  isTouchDevice,
  getDevicePixelRatio,
  supportsWebGL,
  supportsCSSTransforms,
  supportsCSSAnimations,
  
  // Animation creators
  createSpringConfig,
  createKeyframesAnimation,
  createStaggerConfig,
  createParallaxConfig,
  createFloatingAnimation,
  createTypewriterAnimation,
  createBlurAnimation,
  createScaleAnimation,
  createRotateAnimation,
  createSlideAnimation,
  createFadeAnimation,
  createBounceAnimation,
  createElasticAnimation,
  createWobbleAnimation,
  createShakeAnimation,
  createPulseAnimation,
  createHeartbeatAnimation,
  createGlowAnimation,
  createShimmerAnimation,
  createWaveAnimation,
  createSpiralAnimation,
  createOrbitAnimation,
  createPendulumAnimation,
  createBreathingAnimation,
  createTwinkleAnimation,
  createSparkleAnimation,
  createMorphingAnimation,
  createLiquidAnimation,
  createMatrixAnimation,
  createGlitchAnimation,
  createNeonAnimation,
  createHologramAnimation,
  createCyberpunkAnimation,
  createRetroAnimation,
  createVintageAnimation,
  createModernAnimation,
  createMinimalistAnimation,
  createMaximalistAnimation,
  createOrganicAnimation,
  createGeometricAnimation,
  createFluidAnimation,
  createRigidAnimation,
  createSoftAnimation,
  createSharpAnimation,
  createSmoothAnimation,
  createJerkyAnimation,
  createGentleAnimation,
  createAggressiveAnimation,
  createCalmAnimation,
  createEnergeticAnimation,
  createPeacefulAnimation,
  createChaoticAnimation,
  createOrderedAnimation,
  createRandomAnimation,
  createPredictableAnimation,
  
  // Calculation utilities
  calculateDurationFromDistance,
  calculateDelayFromIndex,
  
  // Main utilities object
  animationUtils
}
