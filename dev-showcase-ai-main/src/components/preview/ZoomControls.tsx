"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minus,
  Plus,
  Search,
  Eye,
  Target,
  Move,
  Hand,
  MousePointer
} from 'lucide-react'
import { usePreview } from '../../lib/preview/context'

interface ZoomControlsProps {
  className?: string
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ className = '' }) => {
  const { state, actions } = usePreview()
  const [isDragging, setIsDragging] = useState(false)
  const [showZoomLevel, setShowZoomLevel] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const zoomLevels = [
    { label: '25%', value: 0.25 },
    { label: '50%', value: 0.5 },
    { label: '75%', value: 0.75 },
    { label: '100%', value: 1 },
    { label: '125%', value: 1.25 },
    { label: '150%', value: 1.5 },
    { label: '200%', value: 2 },
    { label: '300%', value: 3 }
  ]

  const handleZoomIn = () => {
    actions.zoomIn()
    showZoomLevelTemporarily()
  }

  const handleZoomOut = () => {
    actions.zoomOut()
    showZoomLevelTemporarily()
  }

  const handleResetZoom = () => {
    actions.resetZoom()
    showZoomLevelTemporarily()
  }

  const handleFitToScreen = () => {
    actions.fitToScreen()
    showZoomLevelTemporarily()
  }

  const showZoomLevelTemporarily = () => {
    setShowZoomLevel(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setShowZoomLevel(false)
    }, 2000)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    actions.setZoom(value)
    showZoomLevelTemporarily()
  }

  const handleSliderMouseDown = () => {
    setIsDragging(true)
  }

  const handleSliderMouseUp = () => {
    setIsDragging(false)
  }

  const getCurrentZoomLabel = () => {
    const level = zoomLevels.find(level => level.value === state.zoom)
    return level ? level.label : `${Math.round(state.zoom * 100)}%`
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        disabled={state.zoom <= 0.1}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Zoom Slider */}
      <div className="flex items-center space-x-2 min-w-[120px]">
        <div className="flex-1 relative">
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={state.zoom}
            onChange={handleSliderChange}
            onMouseDown={handleSliderMouseDown}
            onMouseUp={handleSliderMouseUp}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(state.zoom - 0.1) / (3 - 0.1) * 100}%, #e5e7eb ${(state.zoom - 0.1) / (3 - 0.1) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <AnimatePresence>
              {showZoomLevel && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap"
                >
                  {getCurrentZoomLabel()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Zoom In Button */}
      <button
        onClick={handleZoomIn}
        disabled={state.zoom >= 3}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Reset Zoom Button */}
      <button
        onClick={handleResetZoom}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
        title="Reset Zoom (100%)"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* Fit to Screen Button */}
      <button
        onClick={handleFitToScreen}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
        title="Fit to Screen"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {/* Zoom Level Display */}
      <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded text-sm text-gray-700 min-w-[60px] justify-center">
        <Target className="w-3 h-3" />
        <span className="font-mono">{getCurrentZoomLabel()}</span>
      </div>

      {/* Zoom Presets Dropdown */}
      <div className="relative group">
        <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
          <Search className="w-4 h-4" />
        </button>
        <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <div className="p-2">
            {zoomLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => {
                  actions.setZoom(level.value)
                  showZoomLevelTemporarily()
                }}
                className={`w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100 ${
                  state.zoom === level.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider:focus {
          outline: none;
        }

        .slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  )
}

export default ZoomControls
