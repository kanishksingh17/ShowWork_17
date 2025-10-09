"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  AnimationLibraryConfig, 
  AnimationContextType, 
  AnimationExports,
  PerformanceConfig,
  AccessibilityConfig
} from './types'
import { 
  defaultAnimationConfig, 
  createAnimationConfig,
  createPerformanceConfig,
  createAccessibilityConfig
} from './config'
import { 
  shouldReduceMotion,
  isMobileDevice,
  animationUtils
} from './utils'

// Import all animation components
export * from './page-transitions'
export * from './scroll-animations'
export * from './hover-animations'
export * from './staggered-animations'
export * from './floating-animations'
export * from './hero-animations'

// Import types
export * from './types'

// Import configuration
export * from './config'

// Import utilities
export * from './utils'

// Animation context
const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

// Animation provider component
export const AnimationProvider: React.FC<{
  children: React.ReactNode
  config?: Partial<AnimationLibraryConfig>
}> = ({ children, config = {} }) => {
  const [animationConfig, setAnimationConfig] = useState<AnimationLibraryConfig>(
    createAnimationConfig(config)
  )
  
  const [respectReducedMotion, setRespectReducedMotion] = useState(shouldReduceMotion())
  const [isMobile, setIsMobile] = useState(isMobileDevice())
  
  // Update reduced motion preference on media query change
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleChange = () => {
      setRespectReducedMotion(mediaQuery.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  // Update mobile detection on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice())
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const updateConfig = (newConfig: Partial<AnimationLibraryConfig>) => {
    setAnimationConfig(prev => ({
      ...prev,
      ...newConfig
    }))
  }
  
  const contextValue: AnimationContextType = {
    config: animationConfig,
    updateConfig,
    respectReducedMotion,
    isMobile,
    prefersReducedMotion: respectReducedMotion
  }
  
  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  )
}

// Hook to use animation context
export const useAnimationContext = (): AnimationContextType => {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimationContext must be used within an AnimationProvider')
  }
  return context
}

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const [fps, setFps] = useState(60)
  const [frameTime, setFrameTime] = useState(16.67)
  const [memoryUsage, setMemoryUsage] = useState(0)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    let frameCount = 0
    let lastTime = performance.now()
    
    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        setFps(currentFps)
        setFrameTime(1000 / currentFps)
        frameCount = 0
        lastTime = currentTime
      }
      
      // Memory usage (if available)
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMemoryUsage(memory.usedJSHeapSize / 1024 / 1024) // MB
      }
      
      requestAnimationFrame(measurePerformance)
    }
    
    requestAnimationFrame(measurePerformance)
  }, [])
  
  return { fps, frameTime, memoryUsage }
}

// Animation controller hook
export const useAnimationController = () => {
  const { config, updateConfig, respectReducedMotion, isMobile } = useAnimationContext()
  
  const enableAnimations = () => {
    updateConfig({
      accessibility: {
        ...config.accessibility,
        respectReducedMotion: false
      }
    })
  }
  
  const disableAnimations = () => {
    updateConfig({
      accessibility: {
        ...config.accessibility,
        respectReducedMotion: true
      }
    })
  }
  
  const setPerformanceMode = (mode: 'high' | 'medium' | 'low' | 'mobile') => {
    const performanceConfigs = {
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
    
    updateConfig({
      performance: performanceConfigs[mode]
    })
  }
  
  const setAccessibilityMode = (mode: 'standard' | 'enhanced' | 'minimal') => {
    const accessibilityConfigs = {
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
    
    updateConfig({
      accessibility: accessibilityConfigs[mode]
    })
  }
  
  return {
    config,
    respectReducedMotion,
    isMobile,
    enableAnimations,
    disableAnimations,
    setPerformanceMode,
    setAccessibilityMode,
    updateConfig
  }
}

// Animation preset hook
export const useAnimationPreset = (presetName: string) => {
  const { config } = useAnimationContext()
  
  const getPreset = () => {
    // This would typically import from a presets file
    // For now, return a basic preset
    return {
      variants: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      },
      transition: {
        duration: config.defaultDuration,
        ease: config.defaultEase
      }
    }
  }
  
  return getPreset()
}

// Responsive animation hook
export const useResponsiveAnimation = () => {
  const { isMobile, respectReducedMotion } = useAnimationContext()
  
  const getResponsiveConfig = (desktopConfig: any, mobileConfig: any) => {
    if (respectReducedMotion) {
      return {
        variants: {
          initial: { opacity: 0 },
          animate: { opacity: 1 }
        },
        transition: { duration: 0.3 }
      }
    }
    
    return isMobile ? mobileConfig : desktopConfig
  }
  
  return { getResponsiveConfig, isMobile, respectReducedMotion }
}

// Animation debugger component
export const AnimationDebugger: React.FC<{
  enabled?: boolean
  showFPS?: boolean
  showTiming?: boolean
  showVariants?: boolean
  logPerformance?: boolean
}> = ({
  enabled = false,
  showFPS = true,
  showTiming = true,
  showVariants = false,
  logPerformance = false
}) => {
  const { fps, frameTime, memoryUsage } = usePerformanceMonitoring()
  const { config, respectReducedMotion, isMobile } = useAnimationContext()
  
  if (!enabled) return null
  
  if (logPerformance) {
    console.log('Animation Performance:', {
      fps,
      frameTime,
      memoryUsage,
      respectReducedMotion,
      isMobile,
      config
    })
  }
  
  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="mb-2 font-bold">Animation Debugger</div>
      
      {showFPS && (
        <div className="mb-1">
          FPS: <span className={fps < 30 ? 'text-red-400' : fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
            {fps}
          </span>
        </div>
      )}
      
      {showTiming && (
        <div className="mb-1">
          Frame Time: <span className={frameTime > 33 ? 'text-red-400' : frameTime > 20 ? 'text-yellow-400' : 'text-green-400'}>
            {frameTime.toFixed(2)}ms
          </span>
        </div>
      )}
      
      <div className="mb-1">
        Memory: <span className="text-blue-400">{memoryUsage.toFixed(2)}MB</span>
      </div>
      
      <div className="mb-1">
        Reduced Motion: <span className={respectReducedMotion ? 'text-yellow-400' : 'text-green-400'}>
          {respectReducedMotion ? 'Yes' : 'No'}
        </span>
      </div>
      
      <div className="mb-1">
        Mobile: <span className={isMobile ? 'text-yellow-400' : 'text-green-400'}>
          {isMobile ? 'Yes' : 'No'}
        </span>
      </div>
      
      {showVariants && (
        <div className="mt-2 p-2 bg-gray-800 rounded">
          <div className="font-bold mb-1">Config:</div>
          <pre className="text-xs overflow-auto max-h-32">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

// Animation wrapper component
export const AnimationWrapper: React.FC<{
  children: React.ReactNode
  preset?: string
  customVariants?: any
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  preset = 'fade',
  customVariants,
  className = '',
  style = {}
}) => {
  const { respectReducedMotion, isMobile } = useAnimationContext()
  
  // Use reduced motion variants if needed
  const variants = respectReducedMotion || isMobile
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      }
    : customVariants || {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      }
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={className}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Main animation library exports
const animationLibrary: AnimationExports = {
  // Components
  PageTransition: require('./page-transitions').default,
  ScrollAnimation: require('./scroll-animations').default,
  Parallax: require('./scroll-animations').Parallax,
  HoverAnimation: require('./hover-animations').default,
  StaggeredAnimation: require('./staggered-animations').default,
  FloatingAnimation: require('./floating-animations').default,
  HeroAnimation: require('./hero-animations').default,
  
  // Hooks
  useAnimation: () => {
    const { config } = useAnimationContext()
    return {
      variants: {
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      },
      transition: {
        duration: config.defaultDuration,
        ease: config.defaultEase
      },
      controls: null,
      ref: null
    }
  },
  useScrollAnimation: () => {
    const { respectReducedMotion } = useAnimationContext()
    return {
      variants: {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      },
      controls: null,
      ref: null,
      inView: false
    }
  },
  useParallax: () => {
    return {
      y: null,
      x: null,
      ref: null
    }
  },
  useStaggeredAnimation: () => {
    return {
      variants: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }
    }
  },
  
  // Utilities
  createVariants: animationUtils.createVariants,
  createTransition: animationUtils.createTransition,
  getAnimationPreset: () => undefined,
  
  // Configuration
  AnimationProvider,
  useAnimationContext,
  
  // Presets
  presets: {
    fade: {
      name: 'fade',
      variants: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      transition: { duration: 0.3 },
      config: { duration: 0.3 }
    }
  },
  
  // Theme
  theme: {
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
  },
  
  // Utils
  utils: animationUtils
}

// Export the main animation library
export default animationLibrary

// Export individual components and hooks
export {
  AnimationProvider,
  useAnimationContext,
  usePerformanceMonitoring,
  useAnimationController,
  useAnimationPreset,
  useResponsiveAnimation,
  AnimationDebugger,
  AnimationWrapper
}
