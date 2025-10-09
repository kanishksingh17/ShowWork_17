"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { 
  PageTransitionProps, 
  PageTransitionConfig, 
  PageTransitionVariants 
} from './types'
import { 
  createFadeAnimation, 
  createSlideAnimation, 
  createScaleAnimation,
  createRotateAnimation,
  createFlipAnimation,
  shouldReduceMotion,
  isMobileDevice
} from './utils'
import { pageTransitionPresets } from './config'

// Page transition variants
const createPageTransitionVariants = (config: PageTransitionConfig): PageTransitionVariants => {
  const { type, direction = 'up', duration = 0.3, ease = 'ease-out' } = config
  
  const baseConfig = {
    duration,
    ease
  }

  switch (type) {
    case 'fade':
      return {
        enter: {
          opacity: 1,
          transition: createFadeAnimation(duration, 0)
        },
        exit: {
          opacity: 0,
          transition: createFadeAnimation(duration, 0)
        }
      }

    case 'slide':
      const slideDistance = 100
      const slideConfig = createSlideAnimation(direction, slideDistance, duration)
      
      const slideVariants = {
        up: { y: slideDistance },
        down: { y: -slideDistance },
        left: { x: slideDistance },
        right: { x: -slideDistance }
      }
      
      return {
        enter: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: slideConfig
        },
        exit: {
          opacity: 0,
          ...slideVariants[direction],
          transition: slideConfig
        }
      }

    case 'scale':
      return {
        enter: {
          opacity: 1,
          scale: 1,
          transition: createScaleAnimation(1, duration)
        },
        exit: {
          opacity: 0,
          scale: 0.8,
          transition: createScaleAnimation(0.8, duration)
        }
      }

    case 'flip':
      return {
        enter: {
          opacity: 1,
          rotateY: 0,
          transition: {
            duration,
            ease,
            type: 'tween'
          }
        },
        exit: {
          opacity: 0,
          rotateY: 90,
          transition: {
            duration,
            ease,
            type: 'tween'
          }
        }
      }

    case 'rotate':
      return {
        enter: {
          opacity: 1,
          rotate: 0,
          scale: 1,
          transition: createRotateAnimation(0, duration)
        },
        exit: {
          opacity: 0,
          rotate: 180,
          scale: 0.8,
          transition: createRotateAnimation(180, duration)
        }
      }

    default:
      return {
        enter: {
          opacity: 1,
          transition: createFadeAnimation(duration, 0)
        },
        exit: {
          opacity: 0,
          transition: createFadeAnimation(duration, 0)
        }
      }
  }
}

// Page transition component
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  config = pageTransitionPresets.fade,
  className = '',
  style = {}
}) => {
  const pathname = usePathname()
  const shouldReduce = shouldReduceMotion()
  const isMobile = isMobileDevice()

  // Use reduced motion variants if needed
  const variants = shouldReduce 
    ? {
        enter: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : createPageTransitionVariants(config)

  // Mobile optimizations
  const mobileOptimizedConfig = isMobile 
    ? {
        ...config,
        duration: Math.min(config.duration || 0.3, 0.2)
      }
    : config

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="exit"
        animate="enter"
        exit="exit"
        variants={variants}
        className={`page-transition ${className}`}
        style={{
          willChange: 'transform, opacity',
          ...style
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Slide transition component
export const SlideTransition: React.FC<Omit<PageTransitionProps, 'config'> & { 
  direction?: 'up' | 'down' | 'left' | 'right' 
}> = ({ 
  children, 
  direction = 'up', 
  className = '', 
  style = {} 
}) => {
  const config = pageTransitionPresets[`slide${direction.charAt(0).toUpperCase() + direction.slice(1)}` as keyof typeof pageTransitionPresets]
  
  return (
    <PageTransition
      config={config}
      className={className}
      style={style}
    >
      {children}
    </PageTransition>
  )
}

// Fade transition component
export const FadeTransition: React.FC<Omit<PageTransitionProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <PageTransition
      config={pageTransitionPresets.fade}
      className={className}
      style={style}
    >
      {children}
    </PageTransition>
  )
}

// Scale transition component
export const ScaleTransition: React.FC<Omit<PageTransitionProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <PageTransition
      config={pageTransitionPresets.scale}
      className={className}
      style={style}
    >
      {children}
    </PageTransition>
  )
}

// Flip transition component
export const FlipTransition: React.FC<Omit<PageTransitionProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <PageTransition
      config={pageTransitionPresets.flip}
      className={className}
      style={style}
    >
      {children}
    </PageTransition>
  )
}

// Rotate transition component
export const RotateTransition: React.FC<Omit<PageTransitionProps, 'config'>> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <PageTransition
      config={pageTransitionPresets.rotate}
      className={className}
      style={style}
    >
      {children}
    </PageTransition>
  )
}

// Custom transition component
export const CustomTransition: React.FC<PageTransitionProps> = ({
  children,
  config,
  className = '',
  style = {}
}) => {
  return (
    <PageTransition
      config={config}
      className={className}
      style={style}
    >
      {children}
    </PageTransition>
  )
}

// Route-based transition component
export const RouteTransition: React.FC<{
  children: React.ReactNode
  route: string
  config?: PageTransitionConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  route,
  config = pageTransitionPresets.fade,
  className = '',
  style = {}
}) => {
  const pathname = usePathname()
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        enter: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : createPageTransitionVariants(config)

  return (
    <AnimatePresence mode="wait">
      {pathname === route && (
        <motion.div
          key={route}
          initial="exit"
          animate="enter"
          exit="exit"
          variants={variants}
          className={`route-transition ${className}`}
          style={{
            willChange: 'transform, opacity',
            ...style
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Tab transition component
export const TabTransition: React.FC<{
  children: React.ReactNode
  activeTab: string | number
  tabKey: string | number
  config?: PageTransitionConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  activeTab,
  tabKey,
  config = pageTransitionPresets.fade,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        enter: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : createPageTransitionVariants(config)

  return (
    <AnimatePresence mode="wait">
      {activeTab === tabKey && (
        <motion.div
          key={tabKey}
          initial="exit"
          animate="enter"
          exit="exit"
          variants={variants}
          className={`tab-transition ${className}`}
          style={{
            willChange: 'transform, opacity',
            ...style
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Modal transition component
export const ModalTransition: React.FC<{
  children: React.ReactNode
  isOpen: boolean
  config?: PageTransitionConfig
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  isOpen,
  config = pageTransitionPresets.scale,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        enter: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : {
        enter: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: 'ease-out'
          }
        },
        exit: {
          opacity: 0,
          scale: 0.8,
          y: 20,
          transition: {
            duration: 0.2,
            ease: 'ease-in'
          }
        }
      }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="exit"
          animate="enter"
          exit="exit"
          variants={variants}
          className={`modal-transition ${className}`}
          style={{
            willChange: 'transform, opacity',
            ...style
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Drawer transition component
export const DrawerTransition: React.FC<{
  children: React.ReactNode
  isOpen: boolean
  direction?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  isOpen,
  direction = 'right',
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()

  const getDrawerVariants = () => {
    if (shouldReduce) {
      return {
        enter: { opacity: 1 },
        exit: { opacity: 0 }
      }
    }

    const slideDistance = 300
    
    switch (direction) {
      case 'left':
        return {
          enter: {
            x: 0,
            transition: {
              duration: 0.3,
              ease: 'ease-out'
            }
          },
          exit: {
            x: -slideDistance,
            transition: {
              duration: 0.2,
              ease: 'ease-in'
            }
          }
        }
      case 'right':
        return {
          enter: {
            x: 0,
            transition: {
              duration: 0.3,
              ease: 'ease-out'
            }
          },
          exit: {
            x: slideDistance,
            transition: {
              duration: 0.2,
              ease: 'ease-in'
            }
          }
        }
      case 'top':
        return {
          enter: {
            y: 0,
            transition: {
              duration: 0.3,
              ease: 'ease-out'
            }
          },
          exit: {
            y: -slideDistance,
            transition: {
              duration: 0.2,
              ease: 'ease-in'
            }
          }
        }
      case 'bottom':
        return {
          enter: {
            y: 0,
            transition: {
              duration: 0.3,
              ease: 'ease-out'
            }
          },
          exit: {
            y: slideDistance,
            transition: {
              duration: 0.2,
              ease: 'ease-in'
            }
          }
        }
      default:
        return {
          enter: { opacity: 1 },
          exit: { opacity: 0 }
        }
    }
  }

  const variants = getDrawerVariants()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="exit"
          animate="enter"
          exit="exit"
          variants={variants}
          className={`drawer-transition drawer-${direction} ${className}`}
          style={{
            willChange: 'transform, opacity',
            ...style
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Accordion transition component
export const AccordionTransition: React.FC<{
  children: React.ReactNode
  isOpen: boolean
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  isOpen,
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        open: { opacity: 1 },
        closed: { opacity: 0 }
      }
    : {
        open: {
          height: 'auto',
          opacity: 1,
          transition: {
            duration: 0.3,
            ease: 'ease-out'
          }
        },
        closed: {
          height: 0,
          opacity: 0,
          transition: {
            duration: 0.2,
            ease: 'ease-in'
          }
        }
      }

  return (
    <motion.div
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={variants}
      className={`accordion-transition ${className}`}
      style={{
        overflow: 'hidden',
        willChange: 'height, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Collapse transition component
export const CollapseTransition: React.FC<{
  children: React.ReactNode
  isOpen: boolean
  direction?: 'vertical' | 'horizontal'
  className?: string
  style?: React.CSSProperties
}> = ({
  children,
  isOpen,
  direction = 'vertical',
  className = '',
  style = {}
}) => {
  const shouldReduce = shouldReduceMotion()

  const variants = shouldReduce 
    ? {
        open: { opacity: 1 },
        closed: { opacity: 0 }
      }
    : direction === 'vertical' 
      ? {
          open: {
            height: 'auto',
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'ease-out'
            }
          },
          closed: {
            height: 0,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'ease-in'
            }
          }
        }
      : {
          open: {
            width: 'auto',
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'ease-out'
            }
          },
          closed: {
            width: 0,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'ease-in'
            }
          }
        }

  return (
    <motion.div
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={variants}
      className={`collapse-transition collapse-${direction} ${className}`}
      style={{
        overflow: 'hidden',
        willChange: direction === 'vertical' ? 'height, opacity' : 'width, opacity',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}

// Export all components
export {
  PageTransition,
  SlideTransition,
  FadeTransition,
  ScaleTransition,
  FlipTransition,
  RotateTransition,
  CustomTransition,
  RouteTransition,
  TabTransition,
  ModalTransition,
  DrawerTransition,
  AccordionTransition,
  CollapseTransition
}

// Export utilities
export {
  createPageTransitionVariants
}

// Export default
export default PageTransition
