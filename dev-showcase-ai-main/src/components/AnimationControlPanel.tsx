"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Download, 
  Upload, 
  Save, 
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
  Info
} from 'lucide-react'
import { 
  AnimationConfig, 
  AnimationVariants, 
  Transition,
  PerformanceConfig,
  AccessibilityConfig
} from '../lib/animations/types'

// Animation control panel types
interface AnimationControlPanelProps {
  isOpen: boolean
  onClose: () => void
  onAnimationChange: (config: AnimationConfig) => void
  initialConfig?: AnimationConfig
  className?: string
}

interface AnimationPreset {
  id: string
  name: string
  description: string
  config: AnimationConfig
  category: 'page' | 'scroll' | 'hover' | 'stagger' | 'floating' | 'hero'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface AnimationPreviewProps {
  config: AnimationConfig
  triggerType: 'hover' | 'click' | 'scroll' | 'auto'
  isPlaying: boolean
  onPlayStateChange: (playing: boolean) => void
}

// Animation control panel component
export const AnimationControlPanel: React.FC<AnimationControlPanelProps> = ({
  isOpen,
  onClose,
  onAnimationChange,
  initialConfig,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'timing' | 'easing' | 'trigger' | 'stagger' | 'responsive' | 'accessibility' | 'presets'>('timing')
  const [config, setConfig] = useState<AnimationConfig>(initialConfig || {
    duration: 0.3,
    delay: 0,
    ease: 'ease-out',
    repeat: 0,
    repeatType: 'loop',
    repeatDelay: 0
  })
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const [triggerType, setTriggerType] = useState<'hover' | 'click' | 'scroll' | 'auto'>('auto')
  const [presets, setPresets] = useState<AnimationPreset[]>([])
  const [showPresetModal, setShowPresetModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [responsiveSettings, setResponsiveSettings] = useState({
    mobile: { duration: 0.2, ease: 'ease-out' },
    tablet: { duration: 0.25, ease: 'ease-out' },
    desktop: { duration: 0.3, ease: 'ease-out' }
  })
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilityConfig>({
    respectReducedMotion: true,
    announceChanges: false,
    focusManagement: true
  })
  const [performanceSettings, setPerformanceSettings] = useState<PerformanceConfig>({
    reduceMotion: false,
    willChange: true,
    transform3d: true,
    gpuAcceleration: true,
    optimizeForMobile: true
  })

  // Load presets from localStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem('animation-presets')
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets))
    }
  }, [])

  // Save presets to localStorage
  useEffect(() => {
    localStorage.setItem('animation-presets', JSON.stringify(presets))
  }, [presets])

  // Update animation when config changes
  useEffect(() => {
    onAnimationChange(config)
  }, [config, onAnimationChange])

  const handleConfigChange = (updates: Partial<AnimationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const handlePresetSave = (preset: Omit<AnimationPreset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPreset: AnimationPreset = {
      ...preset,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setPresets(prev => [...prev, newPreset])
    setShowPresetModal(false)
  }

  const handlePresetLoad = (preset: AnimationPreset) => {
    setConfig(preset.config)
    setActiveTab('timing')
  }

  const handlePresetDelete = (presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId))
  }

  const handleExport = () => {
    const exportData = {
      config,
      responsiveSettings,
      accessibilitySettings,
      performanceSettings,
      presets,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `animation-config-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.config) setConfig(data.config)
        if (data.responsiveSettings) setResponsiveSettings(data.responsiveSettings)
        if (data.accessibilitySettings) setAccessibilitySettings(data.accessibilitySettings)
        if (data.performanceSettings) setPerformanceSettings(data.performanceSettings)
        if (data.presets) setPresets(data.presets)
        setShowImportModal(false)
      } catch (error) {
        console.error('Failed to import animation config:', error)
      }
    }
    reader.readAsText(file)
  }

  const tabs = [
    { id: 'timing', label: 'Timing', icon: Clock },
    { id: 'easing', label: 'Easing', icon: Zap },
    { id: 'trigger', label: 'Trigger', icon: Target },
    { id: 'stagger', label: 'Stagger', icon: Layers },
    { id: 'responsive', label: 'Responsive', icon: Monitor },
    { id: 'accessibility', label: 'Accessibility', icon: Keyboard },
    { id: 'presets', label: 'Presets', icon: Palette }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${className}`}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Animation Control Panel</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="Import Configuration"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={handleExport}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="Export Configuration"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 border-r">
                <nav className="p-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                {/* Preview Area */}
                <div className="h-48 bg-gray-100 border-b p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Live Preview</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {isPreviewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setIsPreviewPlaying(false)}
                        className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <AnimationPreview
                    config={config}
                    triggerType={triggerType}
                    isPlaying={isPreviewPlaying}
                    onPlayStateChange={setIsPreviewPlaying}
                  />
                </div>

                {/* Control Panels */}
                <div className="flex-1 overflow-auto p-4">
                  {activeTab === 'timing' && (
                    <TimingControls
                      config={config}
                      onChange={handleConfigChange}
                    />
                  )}
                  {activeTab === 'easing' && (
                    <EasingControls
                      config={config}
                      onChange={handleConfigChange}
                    />
                  )}
                  {activeTab === 'trigger' && (
                    <TriggerControls
                      triggerType={triggerType}
                      onChange={setTriggerType}
                    />
                  )}
                  {activeTab === 'stagger' && (
                    <StaggerControls
                      config={config}
                      onChange={handleConfigChange}
                    />
                  )}
                  {activeTab === 'responsive' && (
                    <ResponsiveControls
                      settings={responsiveSettings}
                      onChange={setResponsiveSettings}
                    />
                  )}
                  {activeTab === 'accessibility' && (
                    <AccessibilityControls
                      settings={accessibilitySettings}
                      performanceSettings={performanceSettings}
                      onAccessibilityChange={setAccessibilitySettings}
                      onPerformanceChange={setPerformanceSettings}
                    />
                  )}
                  {activeTab === 'presets' && (
                    <PresetControls
                      presets={presets}
                      onLoad={handlePresetLoad}
                      onSave={() => setShowPresetModal(true)}
                      onDelete={handlePresetDelete}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Timing controls component
const TimingControls: React.FC<{
  config: AnimationConfig
  onChange: (updates: Partial<AnimationConfig>) => void
}> = ({ config, onChange }) => {
  const timingPresets = [
    { label: 'Fast', duration: 0.15 },
    { label: 'Normal', duration: 0.3 },
    { label: 'Slow', duration: 0.6 },
    { label: 'Slower', duration: 1.2 }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Timing Controls</h3>
      
      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration (seconds)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={config.duration || 0.3}
            onChange={(e) => onChange({ duration: parseFloat(e.target.value) })}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-12">
            {config.duration?.toFixed(1)}s
          </span>
        </div>
        <div className="flex space-x-2 mt-2">
          {timingPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onChange({ duration: preset.duration })}
              className={`px-3 py-1 text-xs rounded ${
                config.duration === preset.duration
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Delay */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delay (seconds)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={config.delay || 0}
            onChange={(e) => onChange({ delay: parseFloat(e.target.value) })}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-12">
            {config.delay?.toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Repeat */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Repeat
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={config.repeat || 0}
            onChange={(e) => onChange({ repeat: parseInt(e.target.value) })}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-8">
            {config.repeat || 0}
          </span>
        </div>
        {config.repeat && config.repeat > 0 && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat Type
            </label>
            <select
              value={config.repeatType || 'loop'}
              onChange={(e) => onChange({ repeatType: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="loop">Loop</option>
              <option value="reverse">Reverse</option>
              <option value="mirror">Mirror</option>
            </select>
          </div>
        )}
      </div>

      {/* Repeat Delay */}
      {config.repeat && config.repeat > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repeat Delay (seconds)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.repeatDelay || 0}
              onChange={(e) => onChange({ repeatDelay: parseFloat(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12">
              {config.repeatDelay?.toFixed(1)}s
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Easing controls component
const EasingControls: React.FC<{
  config: AnimationConfig
  onChange: (updates: Partial<AnimationConfig>) => void
}> = ({ config, onChange }) => {
  const easingPresets = [
    { label: 'Linear', value: 'linear' },
    { label: 'Ease', value: 'ease' },
    { label: 'Ease In', value: 'ease-in' },
    { label: 'Ease Out', value: 'ease-out' },
    { label: 'Ease In Out', value: 'ease-in-out' },
    { label: 'Spring', value: [0.25, 0.46, 0.45, 0.94] },
    { label: 'Bounce', value: [0.68, -0.55, 0.265, 1.55] },
    { label: 'Elastic', value: [0.175, 0.885, 0.32, 1.275] }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Easing Controls</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {easingPresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChange({ ease: preset.value })}
            className={`p-3 rounded-lg border text-left transition-colors ${
              JSON.stringify(config.ease) === JSON.stringify(preset.value)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{preset.label}</div>
            <div className="text-sm text-gray-600">
              {typeof preset.value === 'string' ? preset.value : 'Custom'}
            </div>
          </button>
        ))}
      </div>

      {/* Custom easing curve */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Easing Curve
        </label>
        <div className="grid grid-cols-4 gap-2">
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="0.25"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="0.46"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="0.45"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="0.94"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  )
}

// Trigger controls component
const TriggerControls: React.FC<{
  triggerType: 'hover' | 'click' | 'scroll' | 'auto'
  onChange: (type: 'hover' | 'click' | 'scroll' | 'auto') => void
}> = ({ triggerType, onChange }) => {
  const triggerTypes = [
    { id: 'auto', label: 'Auto', description: 'Animation plays automatically' },
    { id: 'hover', label: 'Hover', description: 'Animation triggers on hover' },
    { id: 'click', label: 'Click', description: 'Animation triggers on click' },
    { id: 'scroll', label: 'Scroll', description: 'Animation triggers on scroll' }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Trigger Controls</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {triggerTypes.map((trigger) => (
          <button
            key={trigger.id}
            onClick={() => onChange(trigger.id as any)}
            className={`p-4 rounded-lg border text-left transition-colors ${
              triggerType === trigger.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{trigger.label}</div>
            <div className="text-sm text-gray-600">{trigger.description}</div>
          </button>
        ))}
      </div>

      {/* Trigger-specific settings */}
      {triggerType === 'scroll' && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Scroll Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Threshold
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.1"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Root Margin
              </label>
              <input
                type="text"
                defaultValue="0px"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Stagger controls component
const StaggerControls: React.FC<{
  config: AnimationConfig
  onChange: (updates: Partial<AnimationConfig>) => void
}> = ({ config, onChange }) => {
  const [staggerEnabled, setStaggerEnabled] = useState(false)
  const [staggerConfig, setStaggerConfig] = useState({
    delayChildren: 0.1,
    staggerChildren: 0.1,
    staggerDirection: 1
  })

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Stagger Controls</h3>
      
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="stagger-enabled"
          checked={staggerEnabled}
          onChange={(e) => setStaggerEnabled(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="stagger-enabled" className="text-sm font-medium text-gray-700">
          Enable Stagger Animation
        </label>
      </div>

      {staggerEnabled && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delay Children (seconds)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={staggerConfig.delayChildren}
                onChange={(e) => setStaggerConfig(prev => ({ 
                  ...prev, 
                  delayChildren: parseFloat(e.target.value) 
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12">
                {staggerConfig.delayChildren.toFixed(2)}s
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stagger Children (seconds)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={staggerConfig.staggerChildren}
                onChange={(e) => setStaggerConfig(prev => ({ 
                  ...prev, 
                  staggerChildren: parseFloat(e.target.value) 
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12">
                {staggerConfig.staggerChildren.toFixed(2)}s
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stagger Direction
            </label>
            <select
              value={staggerConfig.staggerDirection}
              onChange={(e) => setStaggerConfig(prev => ({ 
                ...prev, 
                staggerDirection: parseInt(e.target.value) 
              }))}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="1">Forward</option>
              <option value="-1">Reverse</option>
            </select>
          </div>
        </div>
      )}

      {/* Stagger presets */}
      <div>
        <h4 className="font-medium mb-3">Stagger Presets</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Fast', delayChildren: 0.05, staggerChildren: 0.05 },
            { label: 'Normal', delayChildren: 0.1, staggerChildren: 0.1 },
            { label: 'Slow', delayChildren: 0.2, staggerChildren: 0.2 },
            { label: 'Reverse', delayChildren: 0.1, staggerChildren: 0.1, staggerDirection: -1 }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setStaggerEnabled(true)
                setStaggerConfig({
                  delayChildren: preset.delayChildren,
                  staggerChildren: preset.staggerChildren,
                  staggerDirection: preset.staggerDirection || 1
                })
              }}
              className="p-3 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-left"
            >
              <div className="font-medium">{preset.label}</div>
              <div className="text-sm text-gray-600">
                Delay: {preset.delayChildren}s, Stagger: {preset.staggerChildren}s
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Responsive controls component
const ResponsiveControls: React.FC<{
  settings: any
  onChange: (settings: any) => void
}> = ({ settings, onChange }) => {
  const breakpoints = [
    { id: 'mobile', label: 'Mobile', icon: Smartphone, maxWidth: '768px' },
    { id: 'tablet', label: 'Tablet', icon: Tablet, maxWidth: '1024px' },
    { id: 'desktop', label: 'Desktop', icon: Monitor, maxWidth: '∞' }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Responsive Animation Settings</h3>
      
      <div className="space-y-4">
        {breakpoints.map((breakpoint) => {
          const Icon = breakpoint.icon
          const setting = settings[breakpoint.id]
          
          return (
            <div key={breakpoint.id} className="p-4 border border-gray-300 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Icon className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">{breakpoint.label}</div>
                  <div className="text-sm text-gray-600">Max width: {breakpoint.maxWidth}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={setting.duration}
                    onChange={(e) => onChange({
                      ...settings,
                      [breakpoint.id]: {
                        ...setting,
                        duration: parseFloat(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600 mt-1">
                    {setting.duration.toFixed(1)}s
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Easing
                  </label>
                  <select
                    value={setting.ease}
                    onChange={(e) => onChange({
                      ...settings,
                      [breakpoint.id]: {
                        ...setting,
                        ease: e.target.value
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="ease-out">Ease Out</option>
                    <option value="ease-in">Ease In</option>
                    <option value="ease-in-out">Ease In Out</option>
                    <option value="linear">Linear</option>
                  </select>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Accessibility controls component
const AccessibilityControls: React.FC<{
  settings: AccessibilityConfig
  performanceSettings: PerformanceConfig
  onAccessibilityChange: (settings: AccessibilityConfig) => void
  onPerformanceChange: (settings: PerformanceConfig) => void
}> = ({ settings, performanceSettings, onAccessibilityChange, onPerformanceChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Accessibility & Performance</h3>
      
      {/* Accessibility Settings */}
      <div className="p-4 border border-gray-300 rounded-lg">
        <h4 className="font-medium mb-3">Accessibility Settings</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="respect-reduced-motion"
              checked={settings.respectReducedMotion}
              onChange={(e) => onAccessibilityChange({
                ...settings,
                respectReducedMotion: e.target.checked
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="respect-reduced-motion" className="text-sm font-medium text-gray-700">
              Respect Reduced Motion Preference
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="announce-changes"
              checked={settings.announceChanges}
              onChange={(e) => onAccessibilityChange({
                ...settings,
                announceChanges: e.target.checked
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="announce-changes" className="text-sm font-medium text-gray-700">
              Announce Animation Changes
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="focus-management"
              checked={settings.focusManagement}
              onChange={(e) => onAccessibilityChange({
                ...settings,
                focusManagement: e.target.checked
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="focus-management" className="text-sm font-medium text-gray-700">
              Focus Management
            </label>
          </div>
        </div>
      </div>

      {/* Performance Settings */}
      <div className="p-4 border border-gray-300 rounded-lg">
        <h4 className="font-medium mb-3">Performance Settings</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="will-change"
              checked={performanceSettings.willChange}
              onChange={(e) => onPerformanceChange({
                ...performanceSettings,
                willChange: e.target.checked
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="will-change" className="text-sm font-medium text-gray-700">
              Enable will-change Property
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="transform3d"
              checked={performanceSettings.transform3d}
              onChange={(e) => onPerformanceChange({
                ...performanceSettings,
                transform3d: e.target.checked
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="transform3d" className="text-sm font-medium text-gray-700">
              Use 3D Transforms
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="gpu-acceleration"
              checked={performanceSettings.gpuAcceleration}
              onChange={(e) => onPerformanceChange({
                ...performanceSettings,
                gpuAcceleration: e.target.checked
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="gpu-acceleration" className="text-sm font-medium text-gray-700">
              GPU Acceleration
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="optimize-mobile"
              checked={performanceSettings.optimizeForMobile}
              onChange={(e) => onPerformanceChange({
                ...performanceSettings,
                optimizeForMobile: e.target.checked
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="optimize-mobile" className="text-sm font-medium text-gray-700">
              Optimize for Mobile
            </label>
          </div>
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div className="p-4 border border-gray-300 rounded-lg">
        <h4 className="font-medium mb-3">Keyboard Navigation</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded">Space</kbd> - Play/Pause animation</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded">R</kbd> - Reset animation</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded">Tab</kbd> - Navigate controls</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded">Enter</kbd> - Activate control</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-100 rounded">Esc</kbd> - Close panel</div>
        </div>
      </div>
    </div>
  )
}

// Preset controls component
const PresetControls: React.FC<{
  presets: AnimationPreset[]
  onLoad: (preset: AnimationPreset) => void
  onSave: () => void
  onDelete: (presetId: string) => void
}> = ({ presets, onLoad, onSave, onDelete }) => {
  const categories = ['page', 'scroll', 'hover', 'stagger', 'floating', 'hero']
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredPresets = selectedCategory === 'all' 
    ? presets 
    : presets.filter(preset => preset.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Animation Presets</h3>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Save Preset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded text-sm ${
            selectedCategory === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded text-sm capitalize ${
              selectedCategory === category
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPresets.map((preset) => (
          <div
            key={preset.id}
            className="p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium">{preset.name}</h4>
                <p className="text-sm text-gray-600">{preset.description}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onLoad(preset)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title="Load Preset"
                >
                  <Play className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(preset.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Delete Preset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {preset.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="text-xs text-gray-500">
              Duration: {preset.config.duration}s | Ease: {preset.config.ease}
            </div>
          </div>
        ))}
      </div>

      {filteredPresets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Palette className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No presets found for this category.</p>
          <p className="text-sm">Create your first preset to get started.</p>
        </div>
      )}
    </div>
  )
}

// Animation preview component
const AnimationPreview: React.FC<AnimationPreviewProps> = ({
  config,
  triggerType,
  isPlaying,
  onPlayStateChange
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isInView, setIsInView] = useState(false)

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

  return (
    <div className="h-full flex items-center justify-center">
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
        className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl cursor-pointer"
      >
        A
      </motion.div>
    </div>
  )
}

export default AnimationControlPanel
