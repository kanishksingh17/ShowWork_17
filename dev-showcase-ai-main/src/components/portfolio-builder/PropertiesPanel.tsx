"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Type,
  Palette,
  Zap,
  Layout,
  Image,
  Video,
  Music,
  FileText,
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
  Facebook,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Minus,
  RotateCcw,
  Copy,
  Trash2,
  Eye,
  EyeOff,
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
  Save,
  Download,
  Upload,
  Share2,
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
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react'
import { usePortfolioBuilder } from './context'
import { ComponentContent, ComponentStyle, ComponentAnimation } from './types'

// Content Editor Component
const ContentEditor: React.FC = () => {
  const { state, actions } = usePortfolioBuilder()
  const selectedComponent = state.propertiesPanel.selectedComponent

  if (!selectedComponent) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select a component to edit its content</p>
        </div>
      </div>
    )
  }

  const handleContentUpdate = (updates: Partial<ComponentContent>) => {
    actions.updateComponentContent(selectedComponent.id, updates)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Content</h3>
      
      {/* Basic Content */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={selectedComponent.content?.title || ''}
            onChange={(e) => handleContentUpdate({ title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={selectedComponent.content?.subtitle || ''}
            onChange={(e) => handleContentUpdate({ subtitle: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter subtitle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={selectedComponent.content?.description || ''}
            onChange={(e) => handleContentUpdate({ description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text
          </label>
          <textarea
            value={selectedComponent.content?.text || ''}
            onChange={(e) => handleContentUpdate({ text: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Enter text content"
          />
        </div>
      </div>

      {/* Image Content */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Image</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={selectedComponent.content?.image?.src || ''}
            onChange={(e) => handleContentUpdate({
              image: {
                ...selectedComponent.content?.image,
                src: e.target.value,
                alt: selectedComponent.content?.image?.alt || ''
              }
            })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alt Text
          </label>
          <input
            type="text"
            value={selectedComponent.content?.image?.alt || ''}
            onChange={(e) => handleContentUpdate({
              image: {
                ...selectedComponent.content?.image,
                src: selectedComponent.content?.image?.src || '',
                alt: e.target.value
              }
            })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the image"
          />
        </div>
      </div>

      {/* Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Links</h4>
          <button
            onClick={() => handleContentUpdate({
              links: [
                ...(selectedComponent.content?.links || []),
                { text: '', url: '', type: 'external' }
              ]
            })}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {selectedComponent.content?.links?.map((link, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={link.text}
              onChange={(e) => {
                const updatedLinks = [...(selectedComponent.content?.links || [])]
                updatedLinks[index] = { ...link, text: e.target.value }
                handleContentUpdate({ links: updatedLinks })
              }}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Link text"
            />
            <input
              type="url"
              value={link.url}
              onChange={(e) => {
                const updatedLinks = [...(selectedComponent.content?.links || [])]
                updatedLinks[index] = { ...link, url: e.target.value }
                handleContentUpdate({ links: updatedLinks })
              }}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="URL"
            />
            <select
              value={link.type}
              onChange={(e) => {
                const updatedLinks = [...(selectedComponent.content?.links || [])]
                updatedLinks[index] = { ...link, type: e.target.value as any }
                handleContentUpdate({ links: updatedLinks })
              }}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="external">External</option>
              <option value="internal">Internal</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
            <button
              onClick={() => {
                const updatedLinks = selectedComponent.content?.links?.filter((_, i) => i !== index) || []
                handleContentUpdate({ links: updatedLinks })
              }}
              className="p-2 text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Styles Editor Component
const StylesEditor: React.FC = () => {
  const { state, actions } = usePortfolioBuilder()
  const selectedComponent = state.propertiesPanel.selectedComponent

  if (!selectedComponent) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select a component to edit its styles</p>
        </div>
      </div>
    )
  }

  const handleStyleUpdate = (updates: Partial<ComponentStyle>) => {
    actions.updateComponentStyles(selectedComponent.id, updates)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Styles</h3>
      
      {/* Layout */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Layout</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width
            </label>
            <input
              type="text"
              value={selectedComponent.styles?.width || ''}
              onChange={(e) => handleStyleUpdate({ width: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="auto, 100%, 300px"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height
            </label>
            <input
              type="text"
              value={selectedComponent.styles?.height || ''}
              onChange={(e) => handleStyleUpdate({ height: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="auto, 100%, 200px"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display
          </label>
          <select
            value={selectedComponent.styles?.display || 'block'}
            onChange={(e) => handleStyleUpdate({ display: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="block">Block</option>
            <option value="inline">Inline</option>
            <option value="inline-block">Inline Block</option>
            <option value="flex">Flex</option>
            <option value="grid">Grid</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Spacing</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margin
            </label>
            <input
              type="text"
              value={selectedComponent.styles?.margin || ''}
              onChange={(e) => handleStyleUpdate({ margin: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10px, 1rem, auto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padding
            </label>
            <input
              type="text"
              value={selectedComponent.styles?.padding || ''}
              onChange={(e) => handleStyleUpdate({ padding: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10px, 1rem"
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Colors</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={selectedComponent.styles?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleUpdate({ backgroundColor: e.target.value })}
              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedComponent.styles?.backgroundColor || ''}
              onChange={(e) => handleStyleUpdate({ backgroundColor: e.target.value })}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="#ffffff, rgb(255,255,255), white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={selectedComponent.styles?.color || '#000000'}
              onChange={(e) => handleStyleUpdate({ color: e.target.value })}
              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedComponent.styles?.color || ''}
              onChange={(e) => handleStyleUpdate({ color: e.target.value })}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="#000000, rgb(0,0,0), black"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Typography</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <input
              type="text"
              value={selectedComponent.styles?.fontSize || ''}
              onChange={(e) => handleStyleUpdate({ fontSize: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="16px, 1rem, 1.2em"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Weight
            </label>
            <select
              value={selectedComponent.styles?.fontWeight || 'normal'}
              onChange={(e) => handleStyleUpdate({ fontWeight: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="100">Thin</option>
              <option value="200">Extra Light</option>
              <option value="300">Light</option>
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semi Bold</option>
              <option value="700">Bold</option>
              <option value="800">Extra Bold</option>
              <option value="900">Black</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Align
          </label>
          <select
            value={selectedComponent.styles?.textAlign || 'left'}
            onChange={(e) => handleStyleUpdate({ textAlign: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
      </div>

      {/* Border */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Border</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Border
          </label>
          <input
            type="text"
            value={selectedComponent.styles?.border || ''}
            onChange={(e) => handleStyleUpdate({ border: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="1px solid #ccc, 2px dashed red"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Border Radius
          </label>
          <input
            type="text"
            value={selectedComponent.styles?.borderRadius || ''}
            onChange={(e) => handleStyleUpdate({ borderRadius: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="4px, 0.5rem, 50%"
          />
        </div>
      </div>
    </div>
  )
}

// Animations Editor Component
const AnimationsEditor: React.FC = () => {
  const { state, actions } = usePortfolioBuilder()
  const selectedComponent = state.propertiesPanel.selectedComponent

  if (!selectedComponent) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select a component to edit its animations</p>
        </div>
      </div>
    )
  }

  const handleAnimationUpdate = (updates: Partial<ComponentAnimation>) => {
    actions.updateComponentAnimations(selectedComponent.id, updates)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Animations</h3>
      
      {/* Animation Type */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Animation Type
          </label>
          <select
            value={selectedComponent.animations?.type || 'fade'}
            onChange={(e) => handleAnimationUpdate({ type: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="scale">Scale</option>
            <option value="rotate">Rotate</option>
            <option value="bounce">Bounce</option>
            <option value="elastic">Elastic</option>
            <option value="spring">Spring</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (ms)
            </label>
            <input
              type="number"
              value={selectedComponent.animations?.duration || 300}
              onChange={(e) => handleAnimationUpdate({ duration: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="5000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delay (ms)
            </label>
            <input
              type="number"
              value={selectedComponent.animations?.delay || 0}
              onChange={(e) => handleAnimationUpdate({ delay: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="5000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Easing
          </label>
          <select
            value={selectedComponent.animations?.easing || 'ease-out'}
            onChange={(e) => handleAnimationUpdate({ easing: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="linear">Linear</option>
            <option value="ease">Ease</option>
            <option value="ease-in">Ease In</option>
            <option value="ease-out">Ease Out</option>
            <option value="ease-in-out">Ease In Out</option>
            <option value="cubic-bezier(0.25, 0.46, 0.45, 0.94)">Spring</option>
            <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">Bounce</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trigger
          </label>
          <select
            value={selectedComponent.animations?.trigger || 'onLoad'}
            onChange={(e) => handleAnimationUpdate({ trigger: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="onLoad">On Load</option>
            <option value="onHover">On Hover</option>
            <option value="onClick">On Click</option>
            <option value="onScroll">On Scroll</option>
            <option value="onFocus">On Focus</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Iteration Count
          </label>
          <input
            type="number"
            value={selectedComponent.animations?.iterationCount === 'infinite' ? 0 : selectedComponent.animations?.iterationCount || 1}
            onChange={(e) => handleAnimationUpdate({ 
              iterationCount: parseInt(e.target.value) === 0 ? 'infinite' : parseInt(e.target.value)
            })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="10"
          />
          <p className="text-xs text-gray-500 mt-1">0 = infinite</p>
        </div>
      </div>

      {/* Stagger Animation */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="stagger-enabled"
            checked={selectedComponent.animations?.stagger?.enabled || false}
            onChange={(e) => handleAnimationUpdate({
              stagger: {
                ...selectedComponent.animations?.stagger,
                enabled: e.target.checked
              }
            })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="stagger-enabled" className="text-sm font-medium text-gray-700">
            Enable Stagger Animation
          </label>
        </div>

        {selectedComponent.animations?.stagger?.enabled && (
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stagger Delay (ms)
              </label>
              <input
                type="number"
                value={selectedComponent.animations?.stagger?.delay || 100}
                onChange={(e) => handleAnimationUpdate({
                  stagger: {
                    ...selectedComponent.animations?.stagger,
                    delay: parseInt(e.target.value)
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Direction
              </label>
              <select
                value={selectedComponent.animations?.stagger?.direction || 'forward'}
                onChange={(e) => handleAnimationUpdate({
                  stagger: {
                    ...selectedComponent.animations?.stagger,
                    direction: e.target.value as any
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="forward">Forward</option>
                <option value="reverse">Reverse</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Properties Panel Component
export const PropertiesPanel: React.FC = () => {
  const { state, actions } = usePortfolioBuilder()
  const [isExpanded, setIsExpanded] = useState(true)

  const tabs = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'styles', label: 'Styles', icon: Palette },
    { id: 'animations', label: 'Animations', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const selectedComponent = state.propertiesPanel.selectedComponent

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Selected Component Info */}
        {selectedComponent && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Box className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-gray-900">{selectedComponent.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{selectedComponent.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {selectedComponent.type}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                ID: {selectedComponent.id.slice(-6)}
              </span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => actions.updatePropertiesPanel({ activeTab: tab.id as any })}
                className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                  state.propertiesPanel.activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          {state.propertiesPanel.activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ContentEditor />
            </motion.div>
          )}
          {state.propertiesPanel.activeTab === 'styles' && (
            <motion.div
              key="styles"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <StylesEditor />
            </motion.div>
          )}
          {state.propertiesPanel.activeTab === 'animations' && (
            <motion.div
              key="animations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <AnimationsEditor />
            </motion.div>
          )}
          {state.propertiesPanel.activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Component Name
                    </label>
                    <input
                      type="text"
                      value={selectedComponent?.name || ''}
                      onChange={(e) => selectedComponent && actions.updateComponent(selectedComponent.id, { name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={selectedComponent?.description || ''}
                      onChange={(e) => selectedComponent && actions.updateComponent(selectedComponent.id, { description: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-draggable"
                      checked={selectedComponent?.isDraggable || false}
                      onChange={(e) => selectedComponent && actions.updateComponent(selectedComponent.id, { isDraggable: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is-draggable" className="text-sm font-medium text-gray-700">
                      Draggable
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-nestable"
                      checked={selectedComponent?.isNestable || false}
                      onChange={(e) => selectedComponent && actions.updateComponent(selectedComponent.id, { isNestable: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is-nestable" className="text-sm font-medium text-gray-700">
                      Nestable
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PropertiesPanel
