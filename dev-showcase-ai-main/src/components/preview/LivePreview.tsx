"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePreview } from '../../lib/preview/context'
import { DeviceSelector } from './DeviceSelector'
import { ZoomControls } from './ZoomControls'
import { PanControls } from './PanControls'
import { FullscreenPreview } from './FullscreenPreview'
import { PerformanceOverlay } from './PerformanceOverlay'
import { ErrorBoundary } from './ErrorBoundary'
import { LoadingIndicator } from './LoadingIndicator'
import { ExportPanel } from './ExportPanel'

interface LivePreviewProps {
  children: React.ReactNode
  className?: string
}

export const LivePreview: React.FC<LivePreviewProps> = ({ 
  children, 
  className = '' 
}) => {
  const { state, actions } = usePreview()
  const [showExportPanel, setShowExportPanel] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const previewRef = useRef<HTMLDivElement>(null)

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(0.1, Math.min(3, state.zoom * delta))
      actions.setZoom(newZoom)
    }
  }, [state.zoom, actions])

  // Handle mouse drag for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left mouse button
    
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    
    if (previewRef.current) {
      previewRef.current.style.cursor = 'grabbing'
    }
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    const newPan = {
      x: state.pan.x + deltaX,
      y: state.pan.y + deltaY
    }

    actions.setPan(newPan)
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [isDragging, dragStart, state.pan, actions])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    
    if (previewRef.current) {
      previewRef.current.style.cursor = 'grab'
    }
  }, [])

  // Event listeners
  useEffect(() => {
    const previewElement = previewRef.current
    if (previewElement) {
      previewElement.addEventListener('wheel', handleWheel, { passive: false })
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      if (previewElement) {
        previewElement.removeEventListener('wheel', handleWheel)
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleWheel, isDragging, handleMouseMove, handleMouseUp])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '0':
            e.preventDefault()
            actions.fitToScreen()
            break
          case '=':
          case '+':
            e.preventDefault()
            actions.zoomIn()
            break
          case '-':
            e.preventDefault()
            actions.zoomOut()
            break
        }
      } else if (e.key === 'Escape') {
        actions.resetPan()
        actions.resetZoom()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [actions])

  return (
    <ErrorBoundary>
      <div className={`relative h-full ${className}`}>
        {/* Loading Indicator */}
        <LoadingIndicator loading={{
          isLoading: state.isLoading,
          loadingType: 'update',
          progress: 0,
          message: 'Loading preview...',
          startTime: null,
          estimatedDuration: null
        }} />

        {/* Toolbar */}
        {!state.isFullscreen && (
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <DeviceSelector />
              <div className="h-4 w-px bg-gray-300" />
              <ZoomControls />
              <div className="h-4 w-px bg-gray-300" />
              <PanControls />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowExportPanel(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export</span>
              </button>
              
              <button
                onClick={actions.toggleFullscreen}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                title="Enter Fullscreen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Preview Area */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <FullscreenPreview>
            <div
              ref={previewRef}
              className="relative w-full h-full flex items-center justify-center p-4 cursor-grab"
              onMouseDown={handleMouseDown}
              data-preview
            >
              {/* Preview Container */}
              <div
                className="relative bg-white rounded-lg shadow-lg overflow-hidden"
                style={{
                  width: state.deviceViewport.width * state.zoom,
                  height: state.deviceViewport.height * state.zoom,
                  transform: `translate(${state.pan.x}px, ${state.pan.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
              >
                {/* Device Frame */}
                <div className="absolute inset-0 border-2 border-gray-300 rounded-lg pointer-events-none">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {state.deviceViewport.name}
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="w-full h-full overflow-auto">
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </div>

                {/* Zoom Indicator */}
                <AnimatePresence>
                  {state.zoom !== 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded"
                    >
                      {Math.round(state.zoom * 100)}%
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Connection Status */}
                <div className="absolute bottom-2 left-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                    state.isConnected 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      state.isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span>{state.isConnected ? 'Live' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              {/* Pan Indicator */}
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 left-4 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded"
                  >
                    Panning: {Math.round(state.pan.x)}, {Math.round(state.pan.y)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FullscreenPreview>
        </div>

        {/* Performance Overlay */}
        <PerformanceOverlay />

        {/* Export Panel */}
        <ExportPanel
          isOpen={showExportPanel}
          onClose={() => setShowExportPanel(false)}
        />

        {/* Error Display */}
        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 left-4 right-4 z-50"
            >
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">Preview Error</h3>
                    <p className="text-sm text-red-700 mt-1">{state.error}</p>
                  </div>
                  <button
                    onClick={actions.clearError}
                    className="text-red-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}

export default LivePreview
