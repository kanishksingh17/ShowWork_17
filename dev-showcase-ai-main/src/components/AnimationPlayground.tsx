"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Eye, 
  EyeOff,
  Keyboard,
  Monitor,
  Smartphone,
  Tablet,
  Palette,
  Clock,
  Zap,
  Layers,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
  Plus,
  Minus,
  Sliders,
  Target,
  Move,
  RotateCw,
  Scale,
  Opacity,
  Filter,
  Grid,
  List,
  Code,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  Upload,
  Save
} from 'lucide-react'
import { AnimationControlPanel } from './AnimationControlPanel'
import { PresetSaveModal, ImportExportModal, AnimationConfigViewer, AnimationPerformanceMonitor } from './AnimationModals'
import { 
  AnimationConfig, 
  AnimationVariants, 
  Transition,
  PerformanceConfig,
  AccessibilityConfig
} from '../lib/animations/types'

// Animation playground component
export const AnimationPlayground: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false)
  const [showPresetModal, setShowPresetModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [config, setConfig] = useState<AnimationConfig>({
    duration: 0.3,
    delay: 0,
    ease: 'ease-out',
    repeat: 0,
    repeatType: 'loop',
    repeatDelay: 0
  })
  const [triggerType, setTriggerType] = useState<'hover' | 'click' | 'scroll' | 'auto'>('auto')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [showPerformance, setShowPerformance] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case ' ':
          e.preventDefault()
          setIsPlaying(!isPlaying)
          break
        case 'r':
        case 'R':
          e.preventDefault()
          setIsPlaying(false)
          setIsHovered(false)
          setIsClicked(false)
          break
        case 'c':
        case 'C':
          e.preventDefault()
          setIsControlPanelOpen(true)
          break
        case 'Escape':
          e.preventDefault()
          setIsControlPanelOpen(false)
          setShowPresetModal(false)
          setShowImportModal(false)
          setShowExportModal(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isPlaying])

  const variants: AnimationVariants = {
    initial: { 
      opacity: 0, 
      y: 20, 
      scale: 0.9 
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: config.duration,
        ease: config.ease,
        delay: config.delay,
        repeat: config.repeat,
        repeatType: config.repeatType,
        repeatDelay: config.repeatDelay
      }
    },
    hover: {
      scale: 1.1,
      y: -5,
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

  const getAnimationState = () => {
    if (triggerType === 'hover') return isHovered ? 'hover' : 'initial'
    if (triggerType === 'click') return isClicked ? 'tap' : 'initial'
    if (triggerType === 'scroll') return isInView ? 'animate' : 'initial'
    return isPlaying ? 'animate' : 'initial'
  }

  const handlePresetSave = (preset: any) => {
    // This would typically save to localStorage or a backend
    console.log('Saving preset:', preset)
    setShowPresetModal(false)
  }

  const handleImport = (data: any) => {
    if (data.config) {
      setConfig(data.config)
    }
    setShowImportModal(false)
  }

  const handleExport = () => {
    const exportData = {
      config,
      triggerType,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `animation-config-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportModal(false)
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Animation Playground</h1>
              <div className="text-sm text-gray-500">
                Interactive animation testing and configuration
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className={`p-2 rounded-lg ${
                  showConfig ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Toggle Configuration View"
              >
                <Code className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setShowPerformance(!showPerformance)}
                className={`p-2 rounded-lg ${
                  showPerformance ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Toggle Performance Monitor"
              >
                <Monitor className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsControlPanelOpen(true)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                title="Open Control Panel"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Animation Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Animation Preview</h2>
                <p className="text-gray-600">
                  Configure your animation using the control panel and see it in action
                </p>
              </div>

              {/* Animation Preview */}
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg mb-8">
                <motion.div
                  variants={variants}
                  initial="initial"
                  animate={getAnimationState()}
                  whileHover={triggerType === 'hover' ? undefined : 'hover'}
                  whileTap={triggerType === 'click' ? undefined : 'tap'}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  onClick={() => {
                    if (triggerType === 'click') {
                      setIsClicked(!isClicked)
                    }
                  }}
                  className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl cursor-pointer shadow-lg"
                >
                  A
                </motion.div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                
                <button
                  onClick={() => {
                    setIsPlaying(false)
                    setIsHovered(false)
                    setIsClicked(false)
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Trigger Type Indicator */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <Target className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    Trigger: <span className="font-medium capitalize">{triggerType}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Configuration Viewer */}
            {showConfig && (
              <AnimationConfigViewer config={config} />
            )}

            {/* Performance Monitor */}
            {showPerformance && (
              <AnimationPerformanceMonitor />
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowPresetModal(true)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Preset</span>
                </button>
                
                <button
                  onClick={() => setShowImportModal(true)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Config</span>
                </button>
                
                <button
                  onClick={() => setShowExportModal(true)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Config</span>
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-gray-900 mb-3">Keyboard Shortcuts</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Play/Pause</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Space</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reset</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">R</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Control Panel</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">C</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Close</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
                </div>
              </div>
            </div>

            {/* Current Settings */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-gray-900 mb-3">Current Settings</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-mono">{config.duration}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Delay:</span>
                  <span className="font-mono">{config.delay}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Ease:</span>
                  <span className="font-mono">
                    {typeof config.ease === 'string' ? config.ease : 'Custom'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Repeat:</span>
                  <span className="font-mono">{config.repeat}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trigger:</span>
                  <span className="font-mono capitalize">{triggerType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimationControlPanel
        isOpen={isControlPanelOpen}
        onClose={() => setIsControlPanelOpen(false)}
        onAnimationChange={setConfig}
        initialConfig={config}
      />

      <PresetSaveModal
        isOpen={showPresetModal}
        onClose={() => setShowPresetModal(false)}
        onSave={handlePresetSave}
        config={config}
      />

      <ImportExportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        type="import"
        onImport={handleImport}
      />

      <ImportExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        type="export"
        onExport={handleExport}
      />
    </div>
  )
}

// Animation showcase component
export const AnimationShowcase: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  const [selectedAnimation, setSelectedAnimation] = useState<string>('fade')

  const animations = [
    {
      id: 'fade',
      name: 'Fade In',
      description: 'Simple opacity transition',
      config: { duration: 0.3, ease: 'ease-out' }
    },
    {
      id: 'slide',
      name: 'Slide Up',
      description: 'Slide in from bottom',
      config: { duration: 0.4, ease: 'ease-out' }
    },
    {
      id: 'scale',
      name: 'Scale In',
      description: 'Scale from small to normal',
      config: { duration: 0.3, ease: 'ease-out' }
    },
    {
      id: 'bounce',
      name: 'Bounce',
      description: 'Spring bounce effect',
      config: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] }
    },
    {
      id: 'elastic',
      name: 'Elastic',
      description: 'Elastic spring effect',
      config: { duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }
    }
  ]

  const getVariants = (animationId: string) => {
    switch (animationId) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 }
        }
      case 'slide':
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 }
        }
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 }
        }
      case 'bounce':
        return {
          initial: { opacity: 0, y: -20 },
          animate: { 
            opacity: 1, 
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 25
            }
          }
        }
      case 'elastic':
        return {
          initial: { opacity: 0, scale: 0.5 },
          animate: { 
            opacity: 1, 
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 20
            }
          }
        }
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 }
        }
    }
  }

  const selectedAnim = animations.find(anim => anim.id === selectedAnimation)

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Animation Showcase</h3>
      
      <div className="grid grid-cols-5 gap-3 mb-6">
        {animations.map((animation) => (
          <button
            key={animation.id}
            onClick={() => setSelectedAnimation(animation.id)}
            className={`p-3 rounded-lg border text-left transition-colors ${
              selectedAnimation === animation.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium text-sm">{animation.name}</div>
            <div className="text-xs text-gray-600">{animation.description}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg mb-4">
        <motion.div
          key={selectedAnimation}
          variants={getVariants(selectedAnimation)}
          initial="initial"
          animate="animate"
          className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl"
        >
          A
        </motion.div>
      </div>

      {selectedAnim && (
        <div className="text-center">
          <h4 className="font-medium text-gray-900">{selectedAnim.name}</h4>
          <p className="text-sm text-gray-600">{selectedAnim.description}</p>
          <div className="mt-2 text-xs text-gray-500">
            Duration: {selectedAnim.config.duration}s | Ease: {typeof selectedAnim.config.ease === 'string' ? selectedAnim.config.ease : 'Custom'}
          </div>
        </div>
      )}
    </div>
  )
}

export default AnimationPlayground
