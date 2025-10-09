"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2,
  Clock,
  Zap,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  RotateCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Timer,
  Gauge,
  Target,
  Rocket,
  Sparkles,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { LoadingState } from '../../lib/preview/types'

interface LoadingIndicatorProps {
  loading: LoadingState
  className?: string
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  loading, 
  className = '' 
}) => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<Date | null>(null)

  // Update elapsed time
  useEffect(() => {
    if (loading.isLoading && loading.startTime) {
      startTimeRef.current = loading.startTime
      intervalRef.current = setInterval(() => {
        const now = new Date()
        const elapsed = now.getTime() - loading.startTime!.getTime()
        setElapsedTime(elapsed)

        // Calculate estimated time remaining
        if (loading.estimatedDuration && loading.progress > 0) {
          const progressRatio = loading.progress / 100
          const estimatedTotal = elapsed / progressRatio
          const remaining = Math.max(0, estimatedTotal - elapsed)
          setEstimatedTimeRemaining(remaining)
        }
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setElapsedTime(0)
      setEstimatedTimeRemaining(null)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [loading.isLoading, loading.startTime, loading.estimatedDuration, loading.progress])

  const getLoadingIcon = () => {
    switch (loading.loadingType) {
      case 'initial':
        return <Loader2 className="w-5 h-5 animate-spin" />
      case 'update':
        return <RefreshCw className="w-5 h-5 animate-spin" />
      case 'export':
        return <Download className="w-5 h-5" />
      case 'device-switch':
        return <Monitor className="w-5 h-5" />
      case 'zoom':
        return <Eye className="w-5 h-5" />
      case 'pan':
        return <RotateCw className="w-5 h-5" />
      default:
        return <Loader2 className="w-5 h-5 animate-spin" />
    }
  }

  const getLoadingColor = () => {
    switch (loading.loadingType) {
      case 'initial':
        return 'text-blue-600'
      case 'update':
        return 'text-green-600'
      case 'export':
        return 'text-purple-600'
      case 'device-switch':
        return 'text-orange-600'
      case 'zoom':
        return 'text-indigo-600'
      case 'pan':
        return 'text-pink-600'
      default:
        return 'text-gray-600'
    }
  }

  const getLoadingBgColor = () => {
    switch (loading.loadingType) {
      case 'initial':
        return 'bg-blue-50 border-blue-200'
      case 'update':
        return 'bg-green-50 border-green-200'
      case 'export':
        return 'bg-purple-50 border-purple-200'
      case 'device-switch':
        return 'bg-orange-50 border-orange-200'
      case 'zoom':
        return 'bg-indigo-50 border-indigo-200'
      case 'pan':
        return 'bg-pink-50 border-pink-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
  }

  const getProgressColor = () => {
    if (loading.progress < 30) return 'bg-red-500'
    if (loading.progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (!loading.isLoading) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
      >
        <div className={`${getLoadingBgColor()} border rounded-lg shadow-lg p-4 min-w-[300px]`}>
          {/* Header */}
          <div className="flex items-center space-x-3 mb-3">
            <div className={getLoadingColor()}>
              {getLoadingIcon()}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                {loading.message || 'Loading...'}
              </h3>
              <p className="text-xs text-gray-600 capitalize">
                {loading.loadingType.replace('-', ' ')}
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {formatTime(elapsedTime)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{loading.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${getProgressColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${loading.progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Time Information */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Timer className="w-3 h-3" />
              <span>Elapsed: {formatTime(elapsedTime)}</span>
            </div>
            {estimatedTimeRemaining !== null && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Remaining: {formatTime(estimatedTimeRemaining)}</span>
              </div>
            )}
          </div>

          {/* Loading Steps */}
          {loading.loadingType === 'export' && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Export Steps</span>
                <span className="text-gray-500">{loading.progress}/100</span>
              </div>
              <div className="mt-2 space-y-1">
                {[
                  { label: 'Preparing assets', progress: 20 },
                  { label: 'Generating code', progress: 50 },
                  { label: 'Optimizing images', progress: 80 },
                  { label: 'Finalizing export', progress: 100 }
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      loading.progress >= step.progress ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className={`text-xs ${
                      loading.progress >= step.progress ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Device Switch Animation */}
          {loading.loadingType === 'device-switch' && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2">
                <Monitor className="w-4 h-4 text-gray-400" />
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </motion.div>
                <Smartphone className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Switching device viewport...
              </p>
            </div>
          )}

          {/* Performance Metrics */}
          {loading.loadingType === 'update' && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-gray-900">FPS</div>
                  <div className="text-gray-600">60</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Memory</div>
                  <div className="text-gray-600">45MB</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Render</div>
                  <div className="text-gray-600">12ms</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Inline Loading Indicator
export const InlineLoadingIndicator: React.FC<{
  loading: LoadingState
  className?: string
}> = ({ loading, className = '' }) => {
  if (!loading.isLoading) return null

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
      <span className="text-sm text-gray-600">{loading.message}</span>
      {loading.progress > 0 && (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${loading.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{loading.progress}%</span>
        </div>
      )}
    </div>
  )
}

// Skeleton Loading
export const SkeletonLoading: React.FC<{
  className?: string
  lines?: number
}> = ({ className = '', lines = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded h-4 mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  )
}

// Spinner Component
export const Spinner: React.FC<{
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'red' | 'gray'
  className?: string
}> = ({ size = 'md', color = 'blue', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  }

  return (
    <Loader2
      className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin ${className}`}
    />
  )
}

export default LoadingIndicator
