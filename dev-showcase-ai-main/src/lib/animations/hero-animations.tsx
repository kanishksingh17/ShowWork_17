"use client"

import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { 
  HeroAnimationProps, 
  HeroAnimationConfig
} from './types'
import { 
  shouldReduceMotion,
  isMobileDevice
} from './utils'
import { heroAnimationPresets } from './config'

// Hero animation component
export const HeroAnimation: React.FC<HeroAnimationProps> = ({
  children,
  config = heroAnimationPresets.fadeInUp,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()
  const controls = useAnimation()

  useEffect(() => {
    if (!shouldReduce && !isMobile) {
      controls.start('animate')
    } else {
      controls.start('reduce')
    }
  }, [controls, shouldReduce, isMobile])

  const { type = 'fadeInUp', duration = 0.8, delay = 0.1, ease = 'ease-out' } = config

  // Create variants based on animation type
  const getVariants = () => {
    if (shouldReduce || isMobile) {
      return {
        reduce: {
          opacity: 1,
          y: 0,
          scale: 1
        }
      }
    }

    switch (type) {
      case 'typewriter':
        return {
          animate: {
            opacity: 1,
            width: 'auto',
            transition: {
              duration,
              ease,
              delay
            }
          }
        }

      case 'fadeInUp':
        return {
          animate: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              ease,
              delay
            }
          }
        }

      case 'slideInLeft':
        return {
          animate: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              ease,
              delay
            }
          }
        }

      case 'zoomIn':
        return {
          animate: {
            opacity: 1,
            scale: 1,
            transition: {
              duration,
              ease,
              delay
            }
          }
        }

      case 'blurIn':
        return {
          animate: {
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
              duration,
              ease,
              delay
            }
          }
        }

      default:
        return {
          animate: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              ease,
              delay
            }
          }
        }
    }
  }

  const variants = getVariants()

  return (
    <motion.div
      initial="hidden"
      animate={controls}
      variants={variants}
      className={`hero-animation ${className}`}
      style={{
        willChange: 'transform, opacity, filter',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Typewriter animation
export const TypewriterAnimation: React.FC<{
  text: string
  speed?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  style = {}
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  useEffect(() => {
    if (shouldReduce || isMobile) {
      setDisplayedText(text)
      return
    }

    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, shouldReduce, isMobile])

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(0)
      }, delay * 1000)

      return () => clearTimeout(delayTimer)
    } else {
      setCurrentIndex(0)
    }
  }, [delay])

  return (
    <motion.span
      className={`typewriter ${className}`}
      style={{
        willChange: 'content',
        ...style
      }}
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.8,
          repeat: 'infinitely',
          repeatType: 'loop'
        }}
        className="typewriter-cursor"
      >
        |
      </motion.span>
    </motion.span>
  )
}

// Fade in up animation
export const FadeInUp: React.FC<Omit<HeroAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <HeroAnimation
      config={heroAnimationPresets.fadeInUp}
      className={className}
      style={style}
    >
      {children}
    </HeroAnimation>
  )
}

// Slide in left animation
export const SlideInLeft: React.FC<Omit<HeroAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <HeroAnimation
      config={heroAnimationPresets.slideInLeft}
      className={className}
      style={style}
    >
      {children}
    </HeroAnimation>
  )
}

// Zoom in animation
export const ZoomIn: React.FC<Omit<HeroAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <HeroAnimation
      config={heroAnimationPresets.zoomIn}
      className={className}
      style={style}
    >
      {children}
    </HeroAnimation>
  )
}

// Blur in animation
export const BlurIn: React.FC<Omit<HeroAnimationProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <HeroAnimation
      config={heroAnimationPresets.blurIn}
      className={className}
      style={style}
    >
      {children}
    </HeroAnimation>
  )
}

// Hero section with multiple animations
export const HeroSection: React.FC<{
  title: string
  subtitle?: string
  description?: string
  cta?: React.ReactNode
  background?: React.ReactNode
  config?: HeroAnimationConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  title,
  subtitle,
  description,
  cta,
  background,
  config = heroAnimationPresets.fadeInUp,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = shouldReduce || isMobile
    ? {
        visible: {
          opacity: 1,
          y: 0
        }
      }
    : {
        hidden: {
          opacity: 0,
          y: 50
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

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`hero-section ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {background && (
        <div className="hero-background">
          {background}
        </div>
      )}
      
      <div className="hero-content">
        {subtitle && (
          <motion.div
            variants={itemVariants}
            className="hero-subtitle"
          >
            {subtitle}
          </motion.div>
        )}
        
        <motion.h1
          variants={itemVariants}
          className="hero-title"
        >
          {title}
        </motion.h1>
        
        {description && (
          <motion.p
            variants={itemVariants}
            className="hero-description"
          >
            {description}
          </motion.p>
        )}
        
        {cta && (
          <motion.div
            variants={itemVariants}
            className="hero-cta"
          >
            {cta}
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

// Hero background with parallax
export const HeroBackground: React.FC<{
  children: React.ReactNode
  parallax?: boolean
  speed?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  parallax = true,
  speed = 0.5,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  if (!parallax || shouldReduce || isMobile) {
    return (
      <div className={`hero-background-static ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={`hero-background-parallax ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Hero text with typewriter effect
export const HeroText: React.FC<{
  text: string
  typewriter?: boolean
  speed?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  text,
  typewriter = false,
  speed = 50,
  delay = 0,
  className = '',
  style = {}
}) => {
  if (typewriter) {
    return (
      <TypewriterAnimation
        text={text}
        speed={speed}
        delay={delay}
        className={className}
        style={style}
      />
    )
  }

  return (
    <FadeInUp className={className} style={style}>
      {text}
    </FadeInUp>
  )
}

// Hero button with hover effects
export const HeroButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const buttonVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'ease-out',
        delay: 0.8
      }
    }
  }

  const hoverVariants = shouldReduce || isMobile
    ? {}
    : {
        hover: {
          scale: 1.05,
          y: -2,
          transition: {
            duration: 0.2,
            ease: 'ease-out'
          }
        },
        tap: {
          scale: 0.95,
          transition: {
            duration: 0.1,
            ease: 'ease-out'
          }
        }
      }

  return (
    <motion.button
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={{ ...buttonVariants, ...hoverVariants }}
      onClick={onClick}
      className={`hero-button hero-button-${variant} ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {children}
    </motion.button>
  )
}

// Hero image with reveal effect
export const HeroImage: React.FC<{
  src: string
  alt: string
  reveal?: boolean
  delay?: number
  className?: string
  style?: React.CSSProperties
}> = ({
  src,
  alt,
  reveal = true,
  delay = 0.4,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const imageVariants = shouldReduce || isMobile
    ? {
        animate: {
          opacity: 1,
          scale: 1
        }
      }
    : {
        initial: {
          opacity: 0,
          scale: 0.8
        },
        animate: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.8,
            ease: 'ease-out',
            delay
          }
        }
      }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={imageVariants}
      className={`hero-image ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </motion.div>
  )
}

// Hero stats with counter animation
export const HeroStats: React.FC<{
  stats: Array<{
    value: number
    label: string
    suffix?: string
  }>
  className?: string
  style?: React.CSSProperties
}> = ({
  stats,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const statVariants = shouldReduce || isMobile
    ? {
        visible: {
          opacity: 1,
          y: 0
        }
      }
    : {
        hidden: {
          opacity: 0,
          y: 20
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

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={statsVariants}
      className={`hero-stats ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={statVariants}
          className="hero-stat"
        >
          <div className="hero-stat-value">
            {shouldReduce || isMobile ? (
              `${stat.value}${stat.suffix || ''}`
            ) : (
              <CounterAnimation
                target={stat.value}
                suffix={stat.suffix}
                duration={2}
                delay={index * 0.1}
              />
            )}
          </div>
          <div className="hero-stat-label">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// Counter animation component
const CounterAnimation: React.FC<{
  target: number
  suffix?: string
  duration?: number
  delay?: number
}> = ({ target, suffix = '', duration = 2, delay = 0 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let startTime = Date.now()
      const startValue = 0

      const updateCount = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / (duration * 1000), 1)
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3)
        
        setCount(Math.floor(startValue + (target - startValue) * easeOut))

        if (progress < 1) {
          requestAnimationFrame(updateCount)
        }
      }

      requestAnimationFrame(updateCount)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [target, duration, delay])

  return (
    <span>
      {count}{suffix}
    </span>
  )
}

// Export all components
export {
  HeroAnimation,
  TypewriterAnimation,
  FadeInUp,
  SlideInLeft,
  ZoomIn,
  BlurIn,
  HeroSection,
  HeroBackground,
  HeroText,
  HeroButton,
  HeroImage,
  HeroStats
}

// Export default
export default HeroAnimation
