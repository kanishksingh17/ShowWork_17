"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, 
  X, 
  Tag, 
  Calendar, 
  Clock, 
  Zap,
  Palette,
  Code,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  Download,
  Upload
} from 'lucide-react'
import { AnimationConfig } from '../lib/animations/types'

interface PresetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (preset: Omit<AnimationPreset, 'id' | 'createdAt' | 'updatedAt'>) => void
  config: AnimationConfig
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

// Preset save modal component
export const PresetSaveModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  config
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'page' as const,
    tags: [] as string[]
  })
  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        category: 'page',
        tags: []
      })
      setErrors({})
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      config,
      category: formData.category,
      tags: formData.tags
    })
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const categories = [
    { id: 'page', label: 'Page Transitions', description: 'Navigation and page changes' },
    { id: 'scroll', label: 'Scroll Animations', description: 'Scroll-triggered effects' },
    { id: 'hover', label: 'Hover Interactions', description: 'Mouse hover effects' },
    { id: 'stagger', label: 'Staggered Animations', description: 'Sequential element animations' },
    { id: 'floating', label: 'Floating Elements', description: 'Ambient and floating effects' },
    { id: 'hero', label: 'Hero Animations', description: 'Hero section and landing effects' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Save Animation Preset</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-4 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preset Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full p-2 border rounded ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter preset name"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full p-2 border rounded ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    rows={3}
                    placeholder="Describe what this preset does"
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: category.id as any }))}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          formData.category === category.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium text-sm">{category.label}</div>
                        <div className="text-xs text-gray-600">{category.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Config Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Configuration Preview
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm font-mono">
                    <div>Duration: {config.duration}s</div>
                    <div>Delay: {config.delay}s</div>
                    <div>Ease: {typeof config.ease === 'string' ? config.ease : 'Custom'}</div>
                    <div>Repeat: {config.repeat}</div>
                    {config.repeat && config.repeat > 0 && (
                      <div>Repeat Type: {config.repeatType}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Preset</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Import/Export modal component
export const ImportExportModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  type: 'import' | 'export'
  onImport?: (data: any) => void
  onExport?: () => void
}> = ({ isOpen, onClose, type, onImport, onExport }) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/json') {
      setError('Please select a valid JSON file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        onImport?.(data)
        setError('')
        onClose()
      } catch (err) {
        setError('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {type === 'import' ? 'Import Configuration' : 'Export Configuration'}
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {type === 'import' ? (
                <div>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop your configuration file here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-input"
                    />
                    <label
                      htmlFor="file-input"
                      className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                  
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-red-700 text-sm">{error}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-blue-700 text-sm">
                        <p className="font-medium">Supported file format:</p>
                        <p>JSON files exported from the Animation Control Panel</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Download className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Export your animation configuration
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    This will download a JSON file containing all your animation settings, presets, and configurations.
                  </p>
                  
                  <button
                    onClick={() => {
                      onExport?.()
                      onClose()
                    }}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2 mx-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Configuration</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Animation configuration viewer component
export const AnimationConfigViewer: React.FC<{
  config: AnimationConfig
  className?: string
}> = ({ config, className = '' }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-700">Configuration</h4>
        <button
          onClick={copyToClipboard}
          className="p-1 text-gray-600 hover:text-gray-800"
          title="Copy to clipboard"
        >
          {copied ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      
      <pre className="text-xs font-mono text-gray-600 bg-white p-3 rounded border overflow-auto max-h-32">
        {JSON.stringify(config, null, 2)}
      </pre>
    </div>
  )
}

// Animation performance monitor component
export const AnimationPerformanceMonitor: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  const [fps, setFps] = useState(60)
  const [frameTime, setFrameTime] = useState(16.67)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    if (!isMonitoring) return

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
      
      if (isMonitoring) {
        requestAnimationFrame(measurePerformance)
      }
    }
    
    requestAnimationFrame(measurePerformance)
  }, [isMonitoring])

  const getFpsColor = (fps: number) => {
    if (fps >= 50) return 'text-green-600'
    if (fps >= 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getFrameTimeColor = (frameTime: number) => {
    if (frameTime <= 20) return 'text-green-600'
    if (frameTime <= 33) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-700">Performance Monitor</h4>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-3 py-1 text-sm rounded ${
            isMonitoring
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isMonitoring ? 'Stop' : 'Start'}
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-gray-600">FPS</div>
          <div className={`font-mono font-bold ${getFpsColor(fps)}`}>
            {fps}
          </div>
        </div>
        
        <div>
          <div className="text-gray-600">Frame Time</div>
          <div className={`font-mono font-bold ${getFrameTimeColor(frameTime)}`}>
            {frameTime.toFixed(1)}ms
          </div>
        </div>
        
        <div>
          <div className="text-gray-600">Memory</div>
          <div className="font-mono font-bold text-blue-600">
            {memoryUsage.toFixed(1)}MB
          </div>
        </div>
      </div>
      
      {isMonitoring && (
        <div className="mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Monitoring performance...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PresetSaveModal
