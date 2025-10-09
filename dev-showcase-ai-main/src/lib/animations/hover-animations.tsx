"use client"

import React from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { 
  HoverAnimationProps, 
  HoverConfig
} from './types'
import { 
  shouldReduceMotion,
  isMobileDevice
} from './utils'
import { hoverAnimationPresets } from './config'

// Hover animation component
export const HoverAnimation: React.FC<HoverAnimationProps> = ({
  children,
  config = hoverAnimationPresets.lift,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  // Skip hover animations on mobile and for users who prefer reduced motion
  if (shouldReduce || isMobile) {
    return (
      <div className={`hover-animation-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  const {
    scale = 1.05,
    rotate = 0,
    y = -5,
    x = 0,
    shadow = '0 20px 40px rgba(0,0,0,0.1)',
    brightness = 1,
    saturate = 1,
    duration = 0.2,
    ease = 'ease-out'
  } = config

  return (
    <motion.div
      whileHover={{
        scale,
        rotate,
        y,
        x,
        boxShadow: shadow,
        filter: `brightness(${brightness}) saturate(${saturate})`,
        transition: {
          duration,
          ease
        }
      }}
      whileTap={{
        scale: scale * 0.95,
        transition: {
          duration: 0.1,
          ease: 'ease-out'
        }
      }}
      className={`hover-animation ${className}`}
      style={{
        willChange: 'transform, box-shadow, filter',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Lift hover animation
export const LiftHover: React.FC<Omit<HoverAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <HoverAnimation
      config={hoverAnimationPresets.lift}
      className={className}
      style={style}
    >
      {children}
    </HoverAnimation>
  )
}

// Scale hover animation
export const ScaleHover: React.FC<Omit<HoverAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <HoverAnimation
      config={hoverAnimationPresets.scale}
      className={className}
      style={style}
    >
      {children}
    </HoverAnimation>
  )
}

// Tilt hover animation
export const TiltHover: React.FC<Omit<HoverAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <HoverAnimation
      config={hoverAnimationPresets.tilt}
      className={className}
      style={style}
    >
      {children}
    </HoverAnimation>
  )
}

// Glow hover animation
export const GlowHover: React.FC<Omit<HoverAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <HoverAnimation
      config={hoverAnimationPresets.glow}
      className={className}
      style={style}
    >
      {children}
    </HoverAnimation>
  )
}

// Shadow hover animation
export const ShadowHover: React.FC<Omit<HoverAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <HoverAnimation
      config={hoverAnimationPresets.shadow}
      className={className}
      style={style}
    >
      {children}
    </HoverAnimation>
  )
}

// Bounce hover animation
export const BounceHover: React.FC<Omit<HoverAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <HoverAnimation
      config={hoverAnimationPresets.bounce}
      className={className}
      style={style}
    >
      {children}
    </HoverAnimation>
  )
}

// 3D tilt hover animation
export const Tilt3DHover: React.FC<{
  children: React.ReactNode
  intensity?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  intensity = 20,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`tilt-3d-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY
    
    x.set(mouseX / (rect.width / 2))
    y.set(mouseY / (rect.height / 2))
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style
      }}
      className={`tilt-3d ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Magnetic hover animation
export const MagneticHover: React.FC<{
  children: React.ReactNode
  intensity?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  intensity = 0.3,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`magnetic-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, {
    stiffness: 150,
    damping: 15
  })
  const springY = useSpring(y, {
    stiffness: 150,
    damping: 15
  })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY
    
    x.set(mouseX * intensity)
    y.set(mouseY * intensity)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        willChange: 'transform',
        ...style
      }}
      className={`magnetic ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Ripple hover animation
export const RippleHover: React.FC<{
  children: React.ReactNode
  color?: string
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  color = 'rgba(255, 255, 255, 0.3)',
  duration = 0.6,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`ripple-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, duration * 1000)
  }

  return (
    <div
      onClick={handleClick}
      className={`ripple-container relative overflow-hidden ${className}`}
      style={style}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            borderRadius: '50%',
            backgroundColor: color,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration, ease: 'ease-out' }}
        />
      ))}
    </div>
  )
}

// Shake hover animation
export const ShakeHover: React.FC<{
  children: React.ReactNode
  intensity?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  intensity = 10,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`shake-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{
        x: [0, -intensity, intensity, -intensity, intensity, 0],
        transition: {
          duration: 0.5,
          ease: 'ease-in-out'
        }
      }}
      className={`shake-hover ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Pulse hover animation
export const PulseHover: React.FC<{
  children: React.ReactNode
  scale?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  scale = 1.05,
  duration = 0.5,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`pulse-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{
        scale,
        transition: {
          duration,
          ease: 'ease-in-out',
          repeat: 2,
          repeatType: 'reverse'
        }
      }}
      className={`pulse-hover ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Wiggle hover animation
export const WiggleHover: React.FC<{
  children: React.ReactNode
  intensity?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  intensity = 5,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`wiggle-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{
        rotate: [0, -intensity, intensity, -intensity, 0],
        transition: {
          duration: 0.5,
          ease: 'ease-in-out'
        }
      }}
      className={`wiggle-hover ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Glow hover animation
export const GlowEffectHover: React.FC<{
  children: React.ReactNode
  color?: string
  intensity?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  color = '#3B82F6',
  intensity = 20,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`glow-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 ${intensity}px ${color}`,
        transition: {
          duration: 0.3,
          ease: 'ease-out'
        }
      }}
      className={`glow-hover ${className}`}
      style={{
        willChange: 'box-shadow',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Flip hover animation
export const FlipHover: React.FC<{
  children: React.ReactNode
  axis?: 'x' | 'y'
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  axis = 'y',
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`flip-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{
        rotateX: axis === 'x' ? 180 : 0,
        rotateY: axis === 'y' ? 180 : 0,
        transition: {
          duration: 0.6,
          ease: 'ease-in-out'
        }
      }}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style
      }}
      className={`flip-hover ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Morph hover animation
export const MorphHover: React.FC<{
  children: React.ReactNode
  borderRadius?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  borderRadius = 20,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (shouldReduce || isMobile) {
    return (
      <div className={`morph-disabled ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{
        borderRadius,
        transition: {
          duration: 0.3,
          ease: 'ease-out'
        }
      }}
      className={`morph-hover ${className}`}
      style={{
        willChange: 'border-radius',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Export all components
export {
  HoverAnimation,
  LiftHover,
  ScaleHover,
  TiltHover,
  GlowHover,
  ShadowHover,
  BounceHover,
  Tilt3DHover,
  MagneticHover,
  RippleHover,
  ShakeHover,
  PulseHover,
  WiggleHover,
  GlowEffectHover,
  FlipHover,
  MorphHover
}

// Export default
export default HoverAnimation
