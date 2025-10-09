"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  StaggeredAnimationProps, 
  StaggerConfig, 
  StaggerVariants
} from './types'
import { 
  shouldReduceMotion,
  isMobileDevice
} from './utils'
import { staggerAnimationPresets } from './config'

// Staggered animation variants
const createStaggeredVariants = (config: StaggerConfig): StaggerVariants => {
  const {
    delayChildren = 0.1,
    staggerChildren = 0.1,
    staggerDirection = 1
  } = config

  return {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        delayChildren,
        staggerChildren,
        staggerDirection
      }
    }
  }
}

// Child item variants
const childVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'ease-out'
    }
  }
}

// Staggered animation component
export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  config = staggerAnimationPresets.normal,
  variants,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  // Use provided variants or create default ones
  const animationVariants = variants || createStaggeredVariants(config)

  // Optimize for accessibility and mobile
  const optimizedVariants = shouldReduce 
    ? {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: {
            duration: 0.3,
            ease: 'ease-out'
          }
        }
      }
    : isMobile 
      ? {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: {
              delayChildren: config.delayChildren || 0.05,
              staggerChildren: config.staggerChildren || 0.05,
              staggerDirection: config.staggerDirection || 1
            }
          }
        }
      : animationVariants

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={optimizedVariants}
      className={`staggered-animation ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={shouldReduce ? undefined : childVariants}
          className="staggered-item"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Fast stagger animation
export const FastStagger: React.FC<Omit<StaggeredAnimationProps, 'config'>> = ({
  children,
  variants,
  className = '',
  style = {}
}) => {
  return (
    <StaggeredAnimation
      config={staggerAnimationPresets.fast}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </StaggeredAnimation>
  )
}

// Normal stagger animation
export const NormalStagger: React.FC<Omit<StaggeredAnimationProps, 'config'>> = ({
  children,
  variants,
  className = '',
  style = {}
}) => {
  return (
    <StaggeredAnimation
      config={staggerAnimationPresets.normal}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </StaggeredAnimation>
  )
}

// Slow stagger animation
export const SlowStagger: React.FC<Omit<StaggeredAnimationProps, 'config'>> = ({
  children,
  variants,
  className = '',
  style = {}
}) => {
  return (
    <StaggeredAnimation
      config={staggerAnimationPresets.slow}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </StaggeredAnimation>
  )
}

// Reverse stagger animation
export const ReverseStagger: React.FC<Omit<StaggeredAnimationProps, 'config'>> = ({
  children,
  variants,
  className = '',
  style = {}
}) => {
  return (
    <StaggeredAnimation
      config={staggerAnimationPresets.reverse}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </StaggeredAnimation>
  )
}

// Staggered grid animation
export const StaggeredGrid: React.FC<{
  children: React.ReactNode
  columns?: number
  gap?: number
  config?: StaggerConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  columns = 3,
  gap = 1,
  config = staggerAnimationPresets.normal,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: config.delayChildren || 0.1,
        staggerChildren: config.staggerChildren || 0.1,
        staggerDirection: config.staggerDirection || 1
      }
    }
  }

  const itemVariants = shouldReduce 
    ? undefined
    : {
        hidden: {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.3,
            ease: 'ease-out'
          }
        }
      }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={gridVariants}
      className={`staggered-grid grid-cols-${columns} gap-${gap} ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}rem`,
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="staggered-grid-item"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Staggered list animation
export const StaggeredList: React.FC<{
  children: React.ReactNode
  direction?: 'vertical' | 'horizontal'
  config?: StaggerConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  direction = 'vertical',
  config = staggerAnimationPresets.normal,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: config.delayChildren || 0.1,
        staggerChildren: config.staggerChildren || 0.1,
        staggerDirection: config.staggerDirection || 1
      }
    }
  }

  const itemVariants = shouldReduce 
    ? undefined
    : direction === 'vertical'
      ? {
          hidden: {
            opacity: 0,
            y: 20
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
              ease: 'ease-out'
            }
          }
        }
      : {
          hidden: {
            opacity: 0,
            x: 20
          },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.3,
              ease: 'ease-out'
            }
          }
        }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={listVariants}
      className={`staggered-list flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="staggered-list-item"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Staggered cards animation
export const StaggeredCards: React.FC<{
  children: React.ReactNode
  columns?: number
  gap?: number
  config?: StaggerConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  columns = 3,
  gap = 1,
  config = staggerAnimationPresets.normal,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const cardsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: config.delayChildren || 0.1,
        staggerChildren: config.staggerChildren || 0.1,
        staggerDirection: config.staggerDirection || 1
      }
    }
  }

  const cardVariants = shouldReduce 
    ? undefined
    : {
        hidden: {
          opacity: 0,
          y: 30,
          scale: 0.9
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.4,
            ease: 'ease-out'
          }
        }
      }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={cardsVariants}
      className={`staggered-cards grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}rem`,
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          className="staggered-card"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Staggered text animation
export const StaggeredText: React.FC<{
  text: string
  config?: StaggerConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  text,
  config = staggerAnimationPresets.normal,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: config.delayChildren || 0.1,
        staggerChildren: config.staggerChildren || 0.05,
        staggerDirection: config.staggerDirection || 1
      }
    }
  }

  const wordVariants = shouldReduce 
    ? undefined
    : {
        hidden: {
          opacity: 0,
          y: 20
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: 'ease-out'
          }
        }
      }

  const words = text.split(' ')

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={textVariants}
      className={`staggered-text ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="staggered-word"
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Staggered characters animation
export const StaggeredCharacters: React.FC<{
  text: string
  config?: StaggerConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  text,
  config = staggerAnimationPresets.normal,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: config.delayChildren || 0.1,
        staggerChildren: config.staggerChildren || 0.02,
        staggerDirection: config.staggerDirection || 1
      }
    }
  }

  const characterVariants = shouldReduce 
    ? undefined
    : {
        hidden: {
          opacity: 0,
          y: 20
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: 'ease-out'
          }
        }
      }

  const characters = text.split('')

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={textVariants}
      className={`staggered-characters ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {characters.map((character, index) => (
        <motion.span
          key={index}
          variants={characterVariants}
          className="staggered-character"
          style={{ display: 'inline-block' }}
        >
          {character === ' ' ? '\u00A0' : character}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Staggered lines animation
export const StaggeredLines: React.FC<{
  lines: string[]
  config?: StaggerConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  lines,
  config = staggerAnimationPresets.normal,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const linesVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: config.delayChildren || 0.1,
        staggerChildren: config.staggerChildren || 0.1,
        staggerDirection: config.staggerDirection || 1
      }
    }
  }

  const lineVariants = shouldReduce 
    ? undefined
    : {
        hidden: {
          opacity: 0,
          x: -20
        },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.3,
            ease: 'ease-out'
          }
        }
      }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={linesVariants}
      className={`staggered-lines ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {lines.map((line, index) => (
        <motion.div
          key={index}
          variants={lineVariants}
          className="staggered-line"
        >
          {line}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Staggered menu animation
export const StaggeredMenu: React.FC<{
  children: React.ReactNode
  isOpen: boolean
  config?: StaggerConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  isOpen,
  config = staggerAnimationPresets.normal,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const menuVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: config.delayChildren || 0.1,
        staggerChildren: config.staggerChildren || 0.1,
        staggerDirection: config.staggerDirection || 1
      }
    }
  }

  const itemVariants = shouldReduce 
    ? undefined
    : {
        hidden: {
          opacity: 0,
          y: 10
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.2,
            ease: 'ease-out'
          }
        }
      }

  return (
    <motion.div
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      variants={menuVariants}
      className={`staggered-menu ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="staggered-menu-item"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Staggered tabs animation
export const StaggeredTabs: React.FC<{
  children: React.ReactNode
  activeTab: number
  config?: StaggerConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  activeTab,
  config = staggerAnimationPresets.normal,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  const tabsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: config.delayChildren || 0.1,
        staggerChildren: config.staggerChildren || 0.1,
        staggerDirection: config.staggerDirection || 1
      }
    }
  }

  const tabVariants = shouldReduce 
    ? undefined
    : {
        hidden: {
          opacity: 0,
          scale: 0.9
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.3,
            ease: 'ease-out'
          }
        }
      }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tabsVariants}
      className={`staggered-tabs ${className}`}
      style={{
        willChange: 'transform, opacity',
        ...style
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={tabVariants}
          className={`staggered-tab ${index === activeTab ? 'active' : ''}`}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Export all components
export {
  StaggeredAnimation,
  FastStagger,
  NormalStagger,
  SlowStagger,
  ReverseStagger,
  StaggeredGrid,
  StaggeredList,
  StaggeredCards,
  StaggeredText,
  StaggeredCharacters,
  StaggeredLines,
  StaggeredMenu,
  StaggeredTabs
}

// Export utilities
export {
  createStaggeredVariants
}

// Export default
export default StaggeredAnimation
