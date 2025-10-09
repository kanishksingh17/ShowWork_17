"use client"

import React, { useRef, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion'
import { 
  ScrollAnimationProps, 
  ScrollAnimationConfig, 
  ScrollAnimationVariants,
  ParallaxProps,
  ParallaxConfig
} from './types'
import { 
  shouldReduceMotion,
  isMobileDevice,
  optimizeVariantsForPerformance
} from './utils'
import { scrollAnimationPresets, parallaxAnimationPresets } from './config'

// Scroll animation variants
const createScrollAnimationVariants = (config: ScrollAnimationConfig): ScrollAnimationVariants => {
  const { threshold = 0.1, once = true } = config
  
  return {
    hidden: {
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.3,
        ease: 'ease-out'
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'ease-out'
      }
    }
  }
}

// Scroll animation component
export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  config = { threshold: 0.1, once: true },
  variants,
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { 
    threshold: config.threshold,
    once: config.once,
    amount: config.amount
  })
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  // Use provided variants or create default ones
  const animationVariants = variants || createScrollAnimationVariants(config)

  // Optimize for performance and accessibility
  const optimizedVariants = shouldReduce 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : isMobile 
      ? optimizeVariantsForPerformance(animationVariants, { 
          reduceMotion: false,
          willChange: true,
          transform3d: true,
          gpuAcceleration: true,
          optimizeForMobile: true
        })
      : animationVariants

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={optimizedVariants}
      className={`scroll-animation ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Fade in up animation
export const FadeInUp: React.FC<Omit<ScrollAnimationProps, 'variants'>> = ({
  children,
  config = { threshold: 0.1, once: true },
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, config)
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : scrollAnimationPresets.fadeInUp

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={`fade-in-up ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Fade in down animation
export const FadeInDown: React.FC<Omit<ScrollAnimationProps, 'variants'>> = ({
  children,
  config = { threshold: 0.1, once: true },
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, config)
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : scrollAnimationPresets.fadeInDown

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={`fade-in-down ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Fade in left animation
export const FadeInLeft: React.FC<Omit<ScrollAnimationProps, 'variants'>> = ({
  children,
  config = { threshold: 0.1, once: true },
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, config)
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : scrollAnimationPresets.fadeInLeft

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={`fade-in-left ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Fade in right animation
export const FadeInRight: React.FC<Omit<ScrollAnimationProps, 'variants'>> = ({
  children,
  config = { threshold: 0.1, once: true },
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, config)
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : scrollAnimationPresets.fadeInRight

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={`fade-in-right ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Scale in animation
export const ScaleIn: React.FC<Omit<ScrollAnimationProps, 'variants'>> = ({
  children,
  config = { threshold: 0.1, once: true },
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, config)
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : scrollAnimationPresets.scaleIn

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={`scale-in ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Blur in animation
export const BlurIn: React.FC<Omit<ScrollAnimationProps, 'variants'>> = ({
  children,
  config = { threshold: 0.1, once: true },
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, config)
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : scrollAnimationPresets.blurIn

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={`blur-in ${className}`}
      style={{
        willChange: 'filter, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Slide in up animation
export const SlideInUp: React.FC<Omit<ScrollAnimationProps, 'variants'>> = ({
  children,
  config = { threshold: 0.1, once: true },
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, config)
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : scrollAnimationPresets.slideInUp

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={`slide-in-up ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Slide in down animation
export const SlideInDown: React.FC<Omit<ScrollAnimationProps, 'variants'>> = ({
  children,
  config = { threshold: 0.1, once: true },
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, config)
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : scrollAnimationPresets.slideInDown

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={`slide-in-down ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Parallax component
export const Parallax: React.FC<ParallaxProps> = ({
  children,
  config = parallaxAnimationPresets.normal,
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()
  
  // Reduce parallax effect on mobile and for users who prefer reduced motion
  const speed = shouldReduce || isMobile ? 0 : config.speed || 1
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed])
  const x = useTransform(scrollYProgress, [0, 1], [0, -50 * speed])
  
  // Apply direction
  const transform = config.direction === 'left' || config.direction === 'right' 
    ? { x: config.direction === 'left' ? x : useTransform(x, (x) => -x) }
    : { y: config.direction === 'up' ? y : useTransform(y, (y) => -y) }

  return (
    <motion.div
      ref={ref}
      style={{
        ...transform,
        willChange: 'transform',
        ...style
      }}
      className={`parallax parallax-${config.direction} ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Parallax background component
export const ParallaxBackground: React.FC<{
  children: React.ReactNode
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()
  
  // Reduce parallax effect on mobile and for users who prefer reduced motion
  const parallaxSpeed = shouldReduce || isMobile ? 0 : speed
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${-100 * parallaxSpeed}%`])
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `${-50 * parallaxSpeed}%`])
  
  // Apply direction
  const transform = direction === 'left' || direction === 'right' 
    ? { x: direction === 'left' ? x : useTransform(x, (x) => x.replace('-', '')) }
    : { y: direction === 'up' ? y : useTransform(y, (y) => y.replace('-', '')) }

  return (
    <motion.div
      ref={ref}
      style={{
        ...transform,
        willChange: 'transform',
        ...style
      }}
      className={`parallax-background parallax-${direction} ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Scroll progress component
export const ScrollProgress: React.FC<{
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  className = '',
  style = {}
}) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50 ${className}`}
        style={{
          scaleX,
          ...style
        }}
      />
      {children}
    </>
  )
}

// Scroll indicator component
export const ScrollIndicator: React.FC<{
  threshold?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  threshold = 0.1,
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold })
  
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : {
        hidden: {
          opacity: 0,
          scale: 0.8,
          transition: {
            duration: 0.3,
            ease: 'ease-out'
          }
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: 'ease-out'
          }
        }
      }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={`scroll-indicator ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
        <motion.div
          className="w-1 h-3 bg-gray-300 rounded-full mt-2"
          animate={{
            y: [0, 12, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: 'infinitely',
            ease: 'ease-in-out'
          }}
        />
      </div>
    </motion.div>
  )
}

// Intersection observer hook
export const useIntersectionObserver = (
  threshold: number = 0.1,
  rootMargin: string = '0px',
  triggerOnce: boolean = true
) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { 
    threshold,
    rootMargin,
    once: triggerOnce
  })

  return { ref, isInView }
}

// Scroll position hook
export const useScrollPosition = () => {
  const { scrollY, scrollYProgress } = useScroll()
  
  return {
    scrollY,
    scrollYProgress,
    scrollYSpring: useSpring(scrollY, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001
    })
  }
}

// Scroll direction hook
export const useScrollDirection = () => {
  const { scrollY } = useScroll()
  const [scrollDirection, setScrollDirection] = React.useState<'up' | 'down'>('down')

  React.useEffect(() => {
    const unsubscribe = scrollY.onChange((latest, previous) => {
      if (latest > previous) {
        setScrollDirection('down')
      } else {
        setScrollDirection('up')
      }
    })

    return unsubscribe
  }, [scrollY])

  return scrollDirection
}

// Export all components
export {
  ScrollAnimation,
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  ScaleIn,
  BlurIn,
  SlideInUp,
  SlideInDown,
  Parallax,
  ParallaxBackground,
  ScrollProgress,
  ScrollIndicator,
  useIntersectionObserver,
  useScrollPosition,
  useScrollDirection
}

// Export utilities
export {
  createScrollAnimationVariants
}

// Export default
export default ScrollAnimation
