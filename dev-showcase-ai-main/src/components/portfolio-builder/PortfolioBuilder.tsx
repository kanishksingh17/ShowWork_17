"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save,
  Download,
  Upload,
  Share2,
  Undo,
  Redo,
  Settings,
  HelpCircle,
  Info,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Target,
  Rocket,
  Award,
  Briefcase,
  GraduationCap,
  Book,
  Camera,
  Mic,
  Headphones,
  Gamepad2,
  Paintbrush,
  PenTool,
  Scissors,
  Wrench,
  Hammer,
  Shield,
  Lock,
  Unlock,
  Key,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Power,
  PowerOff,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume1,
  MicOff,
  VideoOff,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Tv,
  Watch,
  HeadphonesIcon,
  Speaker,
  Radio,
  Disc,
  Vinyl,
  Cd,
  Cassette,
  Film,
  Clapperboard,
  CameraIcon,
  VideoIcon,
  ImageIcon,
  Picture,
  Photo,
  Gallery,
  Album,
  Folder,
  FolderOpen,
  File,
  FileText as FileTextIcon,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  Archive,
  Zip,
  Rar,
  Tar,
  Gz,
  Bz2,
  Xz,
  SevenZip,
  Iso,
  Dmg,
  Exe,
  Msi,
  Deb,
  Rpm,
  Apk,
  Ipa,
  Aab,
  Jar,
  War,
  Ear,
  Sar,
  Nar,
  Kar,
  Mar,
  Par,
  WarIcon,
  EarIcon,
  SarIcon,
  NarIcon,
  KarIcon,
  MarIcon,
  ParIcon,
  Grid,
  List,
  Star,
  TrendingUp,
  Code,
  Box,
  Layers,
  MousePointer,
  Hand,
  GripVertical,
  MoreHorizontal,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCcw,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  Filter,
  Zap,
  Palette,
  Type,
  Layout,
  Image,
  Video,
  Music,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Facebook
} from 'lucide-react'
import { PortfolioBuilderProvider, usePortfolioBuilder } from './context'
import { ComponentLibrary } from './ComponentLibrary'
import { Canvas } from './Canvas'
import { PropertiesPanel } from './PropertiesPanel'
import { PortfolioBuilderProps, PortfolioCanvas } from './types'

// Main Portfolio Builder Component
const PortfolioBuilderContent: React.FC = () => {
  const { state, actions } = usePortfolioBuilder()
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for our shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault()
            if (e.shiftKey) {
              actions.redo()
            } else {
              actions.undo()
            }
            break
          case 'y':
            e.preventDefault()
            actions.redo()
            break
          case 's':
            e.preventDefault()
            actions.save()
            break
          case 'd':
            e.preventDefault()
            if (state.selectedComponentId) {
              actions.duplicateComponent(state.selectedComponentId)
            }
            break
          case 'a':
            e.preventDefault()
            actions.selectMultiple(state.canvas.components.map(c => c.id))
            break
          case 'c':
            e.preventDefault()
            // Copy component logic
            break
          case 'v':
            e.preventDefault()
            // Paste component logic
            break
          case 'x':
            e.preventDefault()
            // Cut component logic
            break
          case 'delete':
          case 'backspace':
            e.preventDefault()
            if (state.selectedComponentId) {
              actions.deleteComponent(state.selectedComponentId)
            }
            break
          case '?':
            e.preventDefault()
            setShowKeyboardShortcuts(true)
            break
        }
      } else if (e.key === 'Escape') {
        actions.deselectComponent()
        setShowKeyboardShortcuts(false)
        setShowSettings(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [actions, state.selectedComponentId, state.canvas.components])

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Portfolio Builder
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={actions.undo}
                disabled={!state.undoRedo.canUndo}
                className={`p-2 rounded ${
                  state.undoRedo.canUndo
                    ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={actions.redo}
                disabled={!state.undoRedo.canRedo}
                className={`p-2 rounded ${
                  state.undoRedo.canRedo
                    ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Auto-save Status */}
            <div className="flex items-center space-x-2">
              {state.autoSave.isSaving && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Saving...</span>
                </div>
              )}
              {state.autoSave.hasUnsavedChanges && !state.autoSave.isSaving && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Unsaved changes</span>
                </div>
              )}
              {!state.autoSave.hasUnsavedChanges && !state.autoSave.isSaving && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Saved</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={actions.save}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                title="Save (Ctrl+S)"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(state.canvas, null, 2)
                  const dataBlob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `${state.canvas.name}.json`
                  link.click()
                  URL.revokeObjectURL(url)
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                title="Export Portfolio"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowKeyboardShortcuts(true)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Keyboard Shortcuts (?)"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Library Sidebar */}
        <div className="w-80 flex-shrink-0">
          <ComponentLibrary />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <Canvas />
        </div>

        {/* Properties Panel */}
        <div className="w-80 flex-shrink-0">
          <PropertiesPanel />
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
                  <button
                    onClick={() => setShowKeyboardShortcuts(false)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">General</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Save</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">Ctrl+S</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Undo</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">Ctrl+Z</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Redo</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">Ctrl+Y</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Select All</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">Ctrl+A</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Copy</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">Ctrl+C</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Paste</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">Ctrl+V</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Cut</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">Ctrl+X</kbd>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Components</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Duplicate</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">Ctrl+D</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Delete</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">Delete</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Deselect</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">Esc</kbd>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 mt-6">Help</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Show Shortcuts</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">?</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Auto-save Settings */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Auto-save</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Enable Auto-save</span>
                        <input
                          type="checkbox"
                          checked={state.autoSave.isEnabled}
                          onChange={(e) => {
                            if (e.target.checked) {
                              actions.enableAutoSave()
                            } else {
                              actions.disableAutoSave()
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      {state.autoSave.isEnabled && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Auto-save Interval (seconds)
                          </label>
                          <input
                            type="number"
                            value={state.autoSave.interval / 1000}
                            onChange={(e) => actions.enableAutoSave(parseInt(e.target.value) * 1000)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="5"
                            max="300"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Canvas Settings */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Canvas</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Show Grid</span>
                        <input
                          type="checkbox"
                          checked={state.canvasSettings.showGrid}
                          onChange={(e) => actions.updateCanvasSettings({ showGrid: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Show Rulers</span>
                        <input
                          type="checkbox"
                          checked={state.canvasSettings.showRulers}
                          onChange={(e) => actions.updateCanvasSettings({ showRulers: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Snap to Grid</span>
                        <input
                          type="checkbox"
                          checked={state.canvasSettings.snapToGrid}
                          onChange={(e) => actions.updateCanvasSettings({ snapToGrid: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reset Settings */}
                  <div>
                    <button
                      onClick={() => {
                        actions.resetCanvasSettings()
                        actions.disableAutoSave()
                        actions.enableAutoSave(30000)
                      }}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main Portfolio Builder Component with Provider
export const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({
  initialCanvas,
  onSave,
  onLoad,
  autoSaveInterval = 30000,
  maxHistorySize = 50,
  keyboardShortcuts = {},
  className = '',
  style = {}
}) => {
  return (
    <PortfolioBuilderProvider
      initialCanvas={initialCanvas}
      onSave={onSave}
      onLoad={onLoad}
      autoSaveInterval={autoSaveInterval}
      maxHistorySize={maxHistorySize}
      keyboardShortcuts={keyboardShortcuts}
    >
      <div className={`portfolio-builder ${className}`} style={style}>
        <PortfolioBuilderContent />
      </div>
    </PortfolioBuilderProvider>
  )
}

export default PortfolioBuilder
