"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Maximize2,
  Minimize2,
  X,
  Monitor,
  Smartphone,
  Tablet,
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Move,
  Hand,
  MousePointer,
  Keyboard,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Home
} from 'lucide-react'
import { usePreview } from '../../lib/preview/context'
import { DeviceSelector } from './DeviceSelector'
import { ZoomControls } from './ZoomControls'
import { PanControls } from './PanControls'

interface FullscreenPreviewProps {
  children: React.ReactNode
  className?: string
}

export const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({ 
  children, 
  className = '' 
}) => {
  const { state, actions } = usePreview()
  const [showControls, setShowControls] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)

  // Auto-hide controls in fullscreen
  useEffect(() => {
    if (state.isFullscreen) {
      const handleMouseMove = () => {
        setShowControls(true)
        
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
        }
        
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          actions.exitFullscreen()
        } else if (e.key === 'F11') {
          e.preventDefault()
          actions.toggleFullscreen()
        }
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('keydown', handleKeyDown)
      
      // Initial show controls
      setShowControls(true)
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('keydown', handleKeyDown)
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
        }
      }
    }
  }, [state.isFullscreen, actions])

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement
      if (isFullscreen !== state.isFullscreen) {
        actions.toggleFullscreen()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [state.isFullscreen, actions])

  const handleEnterFullscreen = useCallback(async () => {
    setIsTransitioning(true)
    try {
      await actions.enterFullscreen()
    } finally {
      setIsTransitioning(false)
    }
  }, [actions])

  const handleExitFullscreen = useCallback(async () => {
    setIsTransitioning(true)
    try {
      await actions.exitFullscreen()
    } finally {
      setIsTransitioning(false)
    }
  }, [actions])

  const handleToggleFullscreen = useCallback(async () => {
    if (state.isFullscreen) {
      await handleExitFullscreen()
    } else {
      await handleEnterFullscreen()
    }
  }, [state.isFullscreen, handleEnterFullscreen, handleExitFullscreen])

  const getDeviceIcon = () => {
    switch (state.deviceViewport.type) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />
      case 'tablet':
        return <Tablet className="w-4 h-4" />
      case 'mobile':
        return <Smartphone className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  return (
    <div className={`relative ${className}`} ref={fullscreenRef}>
      {/* Fullscreen Toggle Button */}
      {!state.isFullscreen && (
        <button
          onClick={handleToggleFullscreen}
          disabled={isTransitioning}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all disabled:opacity-50"
          title="Enter Fullscreen (F11)"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      )}

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {state.isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >
            {/* Fullscreen Header */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-700"
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    {/* Left Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-white">
                        {getDeviceIcon()}
                        <span className="text-sm font-medium">
                          {state.deviceViewport.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {state.deviceViewport.width}×{state.deviceViewport.height}
                        </span>
                      </div>
                      
                      <div className="h-4 w-px bg-gray-600" />
                      
                      <DeviceSelector />
                    </div>

                    {/* Center Controls */}
                    <div className="flex items-center space-x-4">
                      <ZoomControls />
                      <div className="h-4 w-px bg-gray-600" />
                      <PanControls />
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={actions.fitToScreen}
                        className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
                        title="Fit to Screen"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      
                      <div className="h-4 w-px bg-gray-600" />
                      
                      <button
                        onClick={handleExitFullscreen}
                        className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
                        title="Exit Fullscreen (Esc)"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-black bg-opacity-60 text-xs text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span>Zoom: {Math.round(state.zoom * 100)}%</span>
                      <span>Pan: {state.pan.x}, {state.pan.y}</span>
                      <span>FPS: {state.performanceMetrics.fps}</span>
                      <span>Memory: {Math.round(state.performanceMetrics.memoryUsage / 1024 / 1024)}MB</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>Last Update: {state.lastUpdate?.toLocaleTimeString() || 'Never'}</span>
                      <div className={`w-2 h-2 rounded-full ${state.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span>{state.isConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fullscreen Content */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div
                className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
                style={{
                  width: state.deviceViewport.width * state.zoom,
                  height: state.deviceViewport.height * state.zoom,
                  transform: `translate(${state.pan.x}px, ${state.pan.y}px)`
                }}
              >
                {children}
              </div>
            </div>

            {/* Fullscreen Footer */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-80 backdrop-blur-sm border-t border-gray-700"
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Keyboard className="w-3 h-3" />
                        <span>Keyboard Shortcuts</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Esc</kbd>
                        <span>Exit</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">F11</kbd>
                        <span>Toggle</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Mouse</kbd>
                        <span>Pan</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Wheel</kbd>
                        <span>Zoom</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Preview Mode</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-500 rounded-full" />
                      <span>Live Updates</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Overlay */}
            <AnimatePresence>
              {state.isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
                >
                  <div className="bg-white rounded-lg p-6 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                      <span className="text-gray-900">Loading preview...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Overlay */}
            <AnimatePresence>
              {state.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
                >
                  <div className="bg-white rounded-lg p-6 shadow-xl max-w-md">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-gray-900 font-medium">Preview Error</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{state.error}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={actions.retryConnection}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Retry
                      </button>
                      <button
                        onClick={actions.clearError}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regular Preview Content */}
      {!state.isFullscreen && (
        <div className="relative">
          {children}
        </div>
      )}
    </div>
  )
}

export default FullscreenPreview
