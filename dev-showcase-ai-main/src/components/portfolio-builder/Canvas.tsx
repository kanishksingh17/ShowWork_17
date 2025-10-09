"use client"

import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  Active,
  Over
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Grid,
  Ruler,
  Eye,
  EyeOff,
  Smartphone,
  Tablet,
  Monitor,
  Move,
  RotateCw,
  Copy,
  Trash2,
  Settings,
  Layers,
  Box,
  MousePointer,
  Hand,
  GripVertical,
  MoreHorizontal,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  RefreshCw,
  Save,
  Download,
  Upload,
  Share2,
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
  ParIcon
} from 'lucide-react'
import { usePortfolioBuilder } from './context'
import { PortfolioComponent, DragItem, DropResult } from './types'

// Sortable Component Item
interface SortableComponentProps {
  component: PortfolioComponent
  isSelected: boolean
  isHovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | undefined) => void
  onUpdate: (id: string, updates: Partial<PortfolioComponent>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

const SortableComponent: React.FC<SortableComponentProps> = ({
  component,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: component.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(component.id)
  }

  const handleMouseEnter = () => {
    onHover(component.id)
  }

  const handleMouseLeave = () => {
    onHover(undefined)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative group cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${isHovered ? 'ring-1 ring-gray-300' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Component Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[100px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <h3 className="font-medium text-gray-900">{component.name}</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {component.type}
            </span>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate(component.id)
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(component.id)
              }}
              className="p-1 text-gray-400 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Component Preview */}
        <div className="bg-gray-50 rounded p-3 min-h-[60px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Box className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">{component.description}</p>
          </div>
        </div>

        {/* Component Children */}
        {component.children && component.children.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-gray-200">
            <div className="space-y-2">
              {component.children.map((child) => (
                <div
                  key={child.id}
                  className="bg-gray-50 rounded p-2 text-sm text-gray-600"
                >
                  {child.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <MousePointer className="w-3 h-3 text-white" />
        </div>
      )}
    </motion.div>
  )
}

// Canvas Component
export const Canvas: React.FC = () => {
  const { state, actions } = usePortfolioBuilder()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    actions.startDrag({
      id: event.active.id as string,
      type: 'component',
      source: 'library'
    })
  }

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    setDragOverId(over ? over.id as string : null)
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setDragOverId(null)
    actions.endDrag()

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId !== overId) {
      // Handle component reordering
      const activeIndex = state.canvas.components.findIndex(c => c.id === activeId)
      const overIndex = state.canvas.components.findIndex(c => c.id === overId)

      if (activeIndex !== -1 && overIndex !== -1) {
        const newComponents = arrayMove(state.canvas.components, activeIndex, overIndex)
        actions.updateCanvas({ components: newComponents })
      }
    }
  }

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      actions.deselectComponent()
    }
  }

  // Handle zoom
  const handleZoomIn = () => {
    actions.updateCanvasSettings({ zoom: Math.min(state.canvasSettings.zoom * 1.1, 3) })
  }

  const handleZoomOut = () => {
    actions.updateCanvasSettings({ zoom: Math.max(state.canvasSettings.zoom / 1.1, 0.1) })
  }

  const handleResetZoom = () => {
    actions.updateCanvasSettings({ zoom: 1 })
  }

  // Handle device preview
  const handleDevicePreview = (device: 'desktop' | 'tablet' | 'mobile') => {
    actions.updateCanvasSettings({ devicePreview: device })
  }

  // Get device dimensions
  const getDeviceDimensions = () => {
    switch (state.canvasSettings.devicePreview) {
      case 'mobile':
        return { width: 375, height: 667 }
      case 'tablet':
        return { width: 768, height: 1024 }
      default:
        return { width: 1200, height: 800 }
    }
  }

  const deviceDimensions = getDeviceDimensions()

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Canvas Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {state.canvas.name}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {Math.round(state.canvasSettings.zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Canvas Settings */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => actions.updateCanvasSettings({ showGrid: !state.canvasSettings.showGrid })}
                className={`p-2 rounded ${
                  state.canvasSettings.showGrid ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Toggle Grid"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => actions.updateCanvasSettings({ showRulers: !state.canvasSettings.showRulers })}
                className={`p-2 rounded ${
                  state.canvasSettings.showRulers ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Toggle Rulers"
              >
                <Ruler className="w-4 h-4" />
              </button>
              <button
                onClick={() => actions.updateCanvasSettings({ showComponentBorders: !state.canvasSettings.showComponentBorders })}
                className={`p-2 rounded ${
                  state.canvasSettings.showComponentBorders ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Toggle Component Borders"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>

            {/* Device Preview */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDevicePreview('desktop')}
                className={`p-2 rounded ${
                  state.canvasSettings.devicePreview === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Desktop Preview"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDevicePreview('tablet')}
                className={`p-2 rounded ${
                  state.canvasSettings.devicePreview === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Tablet Preview"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDevicePreview('mobile')}
                className={`p-2 rounded ${
                  state.canvasSettings.devicePreview === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Mobile Preview"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Mode */}
            <button
              onClick={() => actions.updateCanvasSettings({ previewMode: !state.canvasSettings.previewMode })}
              className={`p-2 rounded ${
                state.canvasSettings.previewMode ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Toggle Preview Mode"
            >
              {state.canvasSettings.previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div
            ref={canvasRef}
            className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
            style={{
              width: deviceDimensions.width * state.canvasSettings.zoom,
              height: deviceDimensions.height * state.canvasSettings.zoom,
              transform: `scale(${state.canvasSettings.zoom})`,
              transformOrigin: 'top center'
            }}
            onClick={handleCanvasClick}
          >
            {/* Grid Background */}
            {state.canvasSettings.showGrid && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                  `,
                  backgroundSize: `${state.canvasSettings.gridSize}px ${state.canvasSettings.gridSize}px`
                }}
              />
            )}

            {/* Canvas Content */}
            <div
              className="relative w-full h-full p-4"
              style={{
                backgroundColor: state.canvas.settings.backgroundColor,
                backgroundImage: state.canvas.settings.backgroundImage
                  ? `url(${state.canvas.settings.backgroundImage})`
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <SortableContext
                items={state.canvas.components.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  <AnimatePresence>
                    {state.canvas.components.map((component) => (
                      <SortableComponent
                        key={component.id}
                        component={component}
                        isSelected={state.selectedComponentId === component.id}
                        isHovered={state.hoveredComponentId === component.id}
                        onSelect={actions.selectComponent}
                        onHover={actions.updatePropertiesPanel}
                        onUpdate={actions.updateComponent}
                        onDelete={actions.deleteComponent}
                        onDuplicate={actions.duplicateComponent}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>

              {/* Drop Zone Indicator */}
              {state.isDragging && (
                <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 flex items-center justify-center">
                  <div className="text-blue-600 font-medium">
                    Drop components here
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg opacity-90">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {state.draggedComponent?.component?.name || 'Component'}
                  </span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Canvas Status */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              {state.canvas.components.length} components
            </span>
            <span>
              {deviceDimensions.width} × {deviceDimensions.height}
            </span>
            <span>
              Zoom: {Math.round(state.canvasSettings.zoom * 100)}%
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {state.autoSave.hasUnsavedChanges && (
              <span className="text-orange-600">Unsaved changes</span>
            )}
            {state.autoSave.isSaving && (
              <span className="text-blue-600">Saving...</span>
            )}
            {state.autoSave.lastSaved && !state.autoSave.hasUnsavedChanges && (
              <span>
                Last saved: {state.autoSave.lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Canvas
