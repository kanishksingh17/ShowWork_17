"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  FloatingAnimationProps, 
  FloatingConfig
} from './types'
import { 
  shouldReduceMotion,
  isMobileDevice
} from './utils'
import { floatingAnimationPresets } from './config'

// Floating animation component
export const FloatingAnimation: React.FC<FloatingAnimationProps> = ({
  children,
  config = floatingAnimationPresets.gentle,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  // Skip floating animations for users who prefer reduced motion or on mobile
  if (shouldReduce || isMobile) {
    return (
      <div className={`floating-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  const {
    amplitude = 10,
    frequency = 2,
    duration = 3,
    ease = 'ease-in-out',
    direction = 'vertical'
  } = config

  // Create floating animation based on direction
  const floatingVariants = direction === 'vertical' 
    ? {
        float: {
          y: [-amplitude, amplitude, -amplitude],
          transition: {
            duration,
            ease,
            repeat: 'infinitely',
            repeatType: 'loop'
          }
        }
      }
    : direction === 'horizontal'
      ? {
          float: {
            x: [-amplitude, amplitude, -amplitude],
            transition: {
              duration,
              ease,
              repeat: 'infinitely',
              repeatType: 'loop'
            }
          }
        }
      : {
          float: {
            x: [-amplitude, amplitude, -amplitude],
            y: [-amplitude, amplitude, -amplitude],
            transition: {
              duration,
              ease,
              repeat: 'infinitely',
              repeatType: 'loop'
            }
          }
        }

  return (
    <motion.div
      animate="float"
      variants={floatingVariants}
      className={`floating-animation ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Gentle floating animation
export const GentleFloating: React.FC<Omit<FloatingAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <FloatingAnimation
      config={floatingAnimationPresets.gentle}
      className={className}
      style={style}
    >
      {children}
    </FloatingAnimation>
  )
}

// Moderate floating animation
export const ModerateFloating: React.FC<Omit<FloatingAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <FloatingAnimation
      config={floatingAnimationPresets.moderate}
      className={className}
      style={style}
    >
      {children}
    </FloatingAnimation>
  )
}

// Strong floating animation
export const StrongFloating: React.FC<Omit<FloatingAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <FloatingAnimation
      config={floatingAnimationPresets.strong}
      className={className}
      style={style}
    >
      {children}
    </FloatingAnimation>
  )
}

// Horizontal floating animation
export const HorizontalFloating: React.FC<Omit<FloatingAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <FloatingAnimation
      config={floatingAnimationPresets.horizontal}
      className={className}
      style={style}
    >
      {children}
    </FloatingAnimation>
  )
}

// Both directions floating animation
export const BothFloating: React.FC<Omit<FloatingAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <FloatingAnimation
      config={floatingAnimationPresets.both}
      className={className}
      style={style}
    >
      {children}
    </FloatingAnimation>
  )
}

// Breathing animation
export const BreathingAnimation: React.FC<{
  children: React.ReactNode
  scale?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  scale = 1.05,
  duration = 3,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`breathing-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        scale: [1, scale, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{
        duration,
        ease: 'ease-in-out',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`breathing-animation ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Pulse animation
export const PulseAnimation: React.FC<{
  children: React.ReactNode
  scale?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  scale = 1.1,
  duration = 1,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`pulse-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        scale: [1, scale, 1]
      }}
      transition={{
        duration,
        ease: 'ease-in-out',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`pulse-animation ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Wiggle animation
export const WiggleAnimation: React.FC<{
  children: React.ReactNode
  intensity?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  intensity = 5,
  duration = 2,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`wiggle-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        rotate: [-intensity, intensity, -intensity, intensity, 0]
      }}
      transition={{
        duration,
        ease: 'ease-in-out',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`wiggle-animation ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Bob animation
export const BobAnimation: React.FC<{
  children: React.ReactNode
  amplitude?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  amplitude = 10,
  duration = 2,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`bob-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        y: [0, -amplitude, 0]
      }}
      transition={{
        duration,
        ease: 'ease-in-out',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`bob-animation ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Sway animation
export const SwayAnimation: React.FC<{
  children: React.ReactNode
  amplitude?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  amplitude = 10,
  duration = 3,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`sway-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        x: [0, amplitude, 0, -amplitude, 0]
      }}
      transition={{
        duration,
        ease: 'ease-in-out',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`sway-animation ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Orbit animation
export const OrbitAnimation: React.FC<{
  children: React.ReactNode
  radius?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  radius = 20,
  duration = 4,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`orbit-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        x: [0, radius, 0, -radius, 0],
        y: [0, -radius, 0, radius, 0]
      }}
      transition={{
        duration,
        ease: 'linear',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`orbit-animation ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Spiral animation
export const SpiralAnimation: React.FC<{
  children: React.ReactNode
  radius?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  radius = 30,
  duration = 5,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`spiral-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        x: [0, radius * 0.5, radius, radius * 0.5, 0, -radius * 0.5, -radius, -radius * 0.5, 0],
        y: [0, -radius * 0.5, 0, radius * 0.5, radius, radius * 0.5, 0, -radius * 0.5, 0]
      }}
      transition={{
        duration,
        ease: 'ease-in-out',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`spiral-animation ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Twinkle animation
export const TwinkleAnimation: React.FC<{
  children: React.ReactNode
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  duration = 2,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`twinkle-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        opacity: [0.3, 1, 0.3],
        scale: [0.8, 1.2, 0.8]
      }}
      transition={{
        duration,
        ease: 'ease-in-out',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`twinkle-animation ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Glow animation
export const GlowAnimation: React.FC<{
  children: React.ReactNode
  intensity?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  intensity = 20,
  duration = 2,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`glow-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 ${intensity}px rgba(59, 130, 246, 0.5)`,
          `0 0 ${intensity * 2}px rgba(59, 130, 246, 0.8)`,
          `0 0 ${intensity}px rgba(59, 130, 246, 0.5)`
        ]
      }}
      transition={{
        duration,
        ease: 'ease-in-out',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`glow-animation ${className}`}
      style={{
        willChange: 'box-shadow',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Shimmer animation
export const ShimmerAnimation: React.FC<{
  children: React.ReactNode
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  duration = 2,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`shimmer-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration,
        ease: 'linear',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`shimmer-animation ${className}`}
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        backgroundSize: '200% 100%',
        willChange: 'background-position',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Wave animation
export const WaveAnimation: React.FC<{
  children: React.ReactNode
  amplitude?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  amplitude = 10,
  duration = 2,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`wave-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        y: [0, -amplitude, 0, amplitude, 0]
      }}
      transition={{
        duration,
        ease: 'ease-in-out',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`wave-animation ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Bounce animation
export const BounceAnimation: React.FC<{
  children: React.ReactNode
  height?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  height = 20,
  duration = 1,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`bounce-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        y: [0, -height, 0]
      }}
      transition={{
        duration,
        ease: 'ease-out',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`bounce-animation ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Rotate animation
export const RotateAnimation: React.FC<{
  children: React.ReactNode
  duration?: number
  direction?: 'clockwise' | 'counterclockwise'
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  duration = 3,
  direction = 'clockwise',
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`rotate-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  const rotation = direction === 'clockwise' ? 360 : -360

  return (
    <motion.div
      animate={{
        rotate: rotation
      }}
      transition={{
        duration,
        ease: 'linear',
        repeat: 'infinitely',
        repeatType: 'loop'
      }}
      className={`rotate-animation ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Export all components
export {
  FloatingAnimation,
  GentleFloating,
  ModerateFloating,
  StrongFloating,
  HorizontalFloating,
  BothFloating,
  BreathingAnimation,
  PulseAnimation,
  WiggleAnimation,
  BobAnimation,
  SwayAnimation,
  OrbitAnimation,
  SpiralAnimation,
  TwinkleAnimation,
  GlowAnimation,
  ShimmerAnimation,
  WaveAnimation,
  BounceAnimation,
  RotateAnimation
}

// Export default
export default FloatingAnimation
