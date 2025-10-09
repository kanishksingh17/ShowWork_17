"use client"

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react'
import { 
  PortfolioBuilderState, 
  PortfolioBuilderActions, 
  PortfolioBuilderContextType,
  PortfolioBuilderProps,
  PortfolioCanvas,
  PortfolioComponent,
  DragItem,
  DropResult,
  SearchFilters,
  AISuggestion,
  PropertiesPanelState,
  UndoRedoState,
  AutoSaveState,
  CanvasSettings,
  KeyboardShortcuts,
  ComponentContent,
  ComponentStyle,
  ComponentAnimation
} from './types'

// Initial state
const initialState: PortfolioBuilderState = {
  canvas: {
    id: '',
    name: 'Untitled Portfolio',
    description: '',
    components: [],
    settings: {
      width: 1200,
      height: 800,
      backgroundColor: '#ffffff',
      padding: 20,
      margin: 0
    },
    metadata: {
      version: '1.0.0',
      lastModified: new Date(),
      createdBy: 'user'
    }
  },
  selectedComponentId: undefined,
  hoveredComponentId: undefined,
  draggedComponent: undefined,
  isDragging: false,
  searchFilters: {
    query: '',
    category: '',
    tags: [],
    isPopular: false,
    isNew: false,
    sortBy: 'name',
    sortOrder: 'asc'
  },
  aiSuggestions: [],
  propertiesPanel: {
    activeTab: 'content',
    isExpanded: true
  },
  undoRedo: {
    history: [],
    currentIndex: -1,
    maxHistorySize: 50,
    canUndo: false,
    canRedo: false
  },
  autoSave: {
    isEnabled: true,
    interval: 30000, // 30 seconds
    lastSaved: new Date(),
    isSaving: false,
    hasUnsavedChanges: false
  },
  canvasSettings: {
    zoom: 1,
    showGrid: true,
    showRulers: true,
    snapToGrid: true,
    gridSize: 20,
    showComponentBorders: true,
    showComponentLabels: false,
    previewMode: false,
    devicePreview: 'desktop'
  },
  keyboardShortcuts: {
    undo: 'Ctrl+Z',
    redo: 'Ctrl+Y',
    save: 'Ctrl+S',
    duplicate: 'Ctrl+D',
    delete: 'Delete',
    selectAll: 'Ctrl+A',
    copy: 'Ctrl+C',
    paste: 'Ctrl+V',
    cut: 'Ctrl+X',
    zoomIn: 'Ctrl+Plus',
    zoomOut: 'Ctrl+Minus',
    resetZoom: 'Ctrl+0',
    toggleGrid: 'Ctrl+G',
    toggleRulers: 'Ctrl+R'
  },
  isLoading: false
}

// Action types
type PortfolioBuilderAction =
  | { type: 'SET_CANVAS'; payload: PortfolioCanvas }
  | { type: 'UPDATE_CANVAS'; payload: Partial<PortfolioCanvas> }
  | { type: 'SET_SELECTED_COMPONENT'; payload: string | undefined }
  | { type: 'SET_HOVERED_COMPONENT'; payload: string | undefined }
  | { type: 'SET_DRAGGED_COMPONENT'; payload: DragItem | undefined }
  | { type: 'SET_IS_DRAGGING'; payload: boolean }
  | { type: 'UPDATE_SEARCH_FILTERS'; payload: Partial<SearchFilters> }
  | { type: 'CLEAR_SEARCH_FILTERS' }
  | { type: 'SET_AI_SUGGESTIONS'; payload: AISuggestion[] }
  | { type: 'UPDATE_PROPERTIES_PANEL'; payload: Partial<PropertiesPanelState> }
  | { type: 'SET_UNDO_REDO'; payload: UndoRedoState }
  | { type: 'UPDATE_AUTO_SAVE'; payload: Partial<AutoSaveState> }
  | { type: 'UPDATE_CANVAS_SETTINGS'; payload: Partial<CanvasSettings> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }

// Reducer
function portfolioBuilderReducer(
  state: PortfolioBuilderState,
  action: PortfolioBuilderAction
): PortfolioBuilderState {
  switch (action.type) {
    case 'SET_CANVAS':
      return {
        ...state,
        canvas: action.payload,
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: true
        }
      }
    
    case 'UPDATE_CANVAS':
      return {
        ...state,
        canvas: {
          ...state.canvas,
          ...action.payload,
          metadata: {
            ...state.canvas.metadata,
            lastModified: new Date()
          }
        },
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: true
        }
      }
    
    case 'SET_SELECTED_COMPONENT':
      return {
        ...state,
        selectedComponentId: action.payload,
        propertiesPanel: {
          ...state.propertiesPanel,
          selectedComponentId: action.payload,
          selectedComponent: action.payload 
            ? state.canvas.components.find(c => c.id === action.payload)
            : undefined
        }
      }
    
    case 'SET_HOVERED_COMPONENT':
      return {
        ...state,
        hoveredComponentId: action.payload
      }
    
    case 'SET_DRAGGED_COMPONENT':
      return {
        ...state,
        draggedComponent: action.payload
      }
    
    case 'SET_IS_DRAGGING':
      return {
        ...state,
        isDragging: action.payload
      }
    
    case 'UPDATE_SEARCH_FILTERS':
      return {
        ...state,
        searchFilters: {
          ...state.searchFilters,
          ...action.payload
        }
      }
    
    case 'CLEAR_SEARCH_FILTERS':
      return {
        ...state,
        searchFilters: {
          query: '',
          category: '',
          tags: [],
          isPopular: false,
          isNew: false,
          sortBy: 'name',
          sortOrder: 'asc'
        }
      }
    
    case 'SET_AI_SUGGESTIONS':
      return {
        ...state,
        aiSuggestions: action.payload
      }
    
    case 'UPDATE_PROPERTIES_PANEL':
      return {
        ...state,
        propertiesPanel: {
          ...state.propertiesPanel,
          ...action.payload
        }
      }
    
    case 'SET_UNDO_REDO':
      return {
        ...state,
        undoRedo: action.payload
      }
    
    case 'UPDATE_AUTO_SAVE':
      return {
        ...state,
        autoSave: {
          ...state.autoSave,
          ...action.payload
        }
      }
    
    case 'UPDATE_CANVAS_SETTINGS':
      return {
        ...state,
        canvasSettings: {
          ...state.canvasSettings,
          ...action.payload
        }
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    
    default:
      return state
  }
}

// Context
const PortfolioBuilderContext = createContext<PortfolioBuilderContextType | undefined>(undefined)

// Provider component
export const PortfolioBuilderProvider: React.FC<PortfolioBuilderProps> = ({
  children,
  initialCanvas,
  onSave,
  onLoad,
  autoSaveInterval = 30000,
  maxHistorySize = 50,
  keyboardShortcuts = {}
}) => {
  const [state, dispatch] = useReducer(portfolioBuilderReducer, {
    ...initialState,
    canvas: initialCanvas || initialState.canvas,
    autoSave: {
      ...initialState.autoSave,
      interval: autoSaveInterval
    },
    undoRedo: {
      ...initialState.undoRedo,
      maxHistorySize
    },
    keyboardShortcuts: {
      ...initialState.keyboardShortcuts,
      ...keyboardShortcuts
    }
  })

  const autoSaveTimerRef = useRef<NodeJS.Timeout>()
  const lastSaveRef = useRef<PortfolioCanvas>()

  // Auto-save effect
  useEffect(() => {
    if (state.autoSave.isEnabled && state.autoSave.hasUnsavedChanges) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }

      autoSaveTimerRef.current = setTimeout(() => {
        if (onSave && state.autoSave.hasUnsavedChanges) {
          onSave(state.canvas).then(() => {
            dispatch({
              type: 'UPDATE_AUTO_SAVE',
              payload: {
                lastSaved: new Date(),
                hasUnsavedChanges: false,
                isSaving: false
              }
            })
          }).catch((error) => {
            dispatch({
              type: 'UPDATE_AUTO_SAVE',
              payload: {
                error: error.message,
                isSaving: false
              }
            })
          })
        }
      }, state.autoSave.interval)
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [state.canvas, state.autoSave.isEnabled, state.autoSave.hasUnsavedChanges, onSave, state.autoSave.interval])

  // Keyboard shortcuts effect
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = `${event.ctrlKey ? 'Ctrl+' : ''}${event.shiftKey ? 'Shift+' : ''}${event.altKey ? 'Alt+' : ''}${event.key}`
      
      if (state.keyboardShortcuts.undo === key) {
        event.preventDefault()
        actions.undo()
      } else if (state.keyboardShortcuts.redo === key) {
        event.preventDefault()
        actions.redo()
      } else if (state.keyboardShortcuts.save === key) {
        event.preventDefault()
        actions.save()
      } else if (state.keyboardShortcuts.duplicate === key && state.selectedComponentId) {
        event.preventDefault()
        actions.duplicateComponent(state.selectedComponentId)
      } else if (state.keyboardShortcuts.delete === key && state.selectedComponentId) {
        event.preventDefault()
        actions.deleteComponent(state.selectedComponentId)
      } else if (state.keyboardShortcuts.selectAll === key) {
        event.preventDefault()
        actions.selectMultiple(state.canvas.components.map(c => c.id))
      } else if (state.keyboardShortcuts.copy === key && state.selectedComponentId) {
        event.preventDefault()
        // Copy component logic
      } else if (state.keyboardShortcuts.paste === key) {
        event.preventDefault()
        // Paste component logic
      } else if (state.keyboardShortcuts.cut === key && state.selectedComponentId) {
        event.preventDefault()
        // Cut component logic
      } else if (state.keyboardShortcuts.zoomIn === key) {
        event.preventDefault()
        actions.updateCanvasSettings({ zoom: Math.min(state.canvasSettings.zoom * 1.1, 3) })
      } else if (state.keyboardShortcuts.zoomOut === key) {
        event.preventDefault()
        actions.updateCanvasSettings({ zoom: Math.max(state.canvasSettings.zoom / 1.1, 0.1) })
      } else if (state.keyboardShortcuts.resetZoom === key) {
        event.preventDefault()
        actions.updateCanvasSettings({ zoom: 1 })
      } else if (state.keyboardShortcuts.toggleGrid === key) {
        event.preventDefault()
        actions.updateCanvasSettings({ showGrid: !state.canvasSettings.showGrid })
      } else if (state.keyboardShortcuts.toggleRulers === key) {
        event.preventDefault()
        actions.updateCanvasSettings({ showRulers: !state.canvasSettings.showRulers })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.keyboardShortcuts, state.selectedComponentId, state.canvasSettings])

  // Actions
  const actions: PortfolioBuilderActions = {
    // Canvas actions
    createCanvas: useCallback((name: string, description?: string) => {
      const newCanvas: PortfolioCanvas = {
        id: Date.now().toString(),
        name,
        description: description || '',
        components: [],
        settings: initialState.canvas.settings,
        metadata: {
          version: '1.0.0',
          lastModified: new Date(),
          createdBy: 'user'
        }
      }
      dispatch({ type: 'SET_CANVAS', payload: newCanvas })
      actions.saveToHistory()
    }, []),

    updateCanvas: useCallback((updates: Partial<PortfolioCanvas>) => {
      dispatch({ type: 'UPDATE_CANVAS', payload: updates })
    }, []),

    deleteCanvas: useCallback((id: string) => {
      // Implementation depends on your backend
      console.log('Delete canvas:', id)
    }, []),

    // Component actions
    addComponent: useCallback((component: PortfolioComponent, targetId?: string, position: 'before' | 'after' | 'inside' = 'after') => {
      const newComponent = {
        ...component,
        id: Date.now().toString(),
        order: state.canvas.components.length,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      let updatedComponents = [...state.canvas.components]

      if (targetId) {
        const targetIndex = updatedComponents.findIndex(c => c.id === targetId)
        if (targetIndex !== -1) {
          if (position === 'before') {
            updatedComponents.splice(targetIndex, 0, newComponent)
          } else if (position === 'after') {
            updatedComponents.splice(targetIndex + 1, 0, newComponent)
          } else if (position === 'inside') {
            // Handle nesting logic
            updatedComponents[targetIndex].children = [
              ...(updatedComponents[targetIndex].children || []),
              newComponent
            ]
          }
        }
      } else {
        updatedComponents.push(newComponent)
      }

      dispatch({
        type: 'UPDATE_CANVAS',
        payload: {
          components: updatedComponents
        }
      })
      actions.saveToHistory()
    }, [state.canvas.components]),

    updateComponent: useCallback((id: string, updates: Partial<PortfolioComponent>) => {
      const updatedComponents = state.canvas.components.map(component => {
        if (component.id === id) {
          return {
            ...component,
            ...updates,
            updatedAt: new Date()
          }
        }
        return component
      })

      dispatch({
        type: 'UPDATE_CANVAS',
        payload: {
          components: updatedComponents
        }
      })
      actions.saveToHistory()
    }, [state.canvas.components]),

    deleteComponent: useCallback((id: string) => {
      const updatedComponents = state.canvas.components.filter(component => component.id !== id)
      dispatch({
        type: 'UPDATE_CANVAS',
        payload: {
          components: updatedComponents
        }
      })
      dispatch({ type: 'SET_SELECTED_COMPONENT', payload: undefined })
      actions.saveToHistory()
    }, [state.canvas.components]),

    duplicateComponent: useCallback((id: string) => {
      const component = state.canvas.components.find(c => c.id === id)
      if (component) {
        const duplicatedComponent: PortfolioComponent = {
          ...component,
          id: Date.now().toString(),
          name: `${component.name} (Copy)`,
          order: state.canvas.components.length,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        actions.addComponent(duplicatedComponent)
      }
    }, [state.canvas.components, actions]),

    moveComponent: useCallback((id: string, targetId: string, position: 'before' | 'after' | 'inside') => {
      // Implementation for moving components
      console.log('Move component:', id, 'to', targetId, position)
    }, []),

    // Selection actions
    selectComponent: useCallback((id: string) => {
      dispatch({ type: 'SET_SELECTED_COMPONENT', payload: id })
    }, []),

    deselectComponent: useCallback(() => {
      dispatch({ type: 'SET_SELECTED_COMPONENT', payload: undefined })
    }, []),

    selectMultiple: useCallback((ids: string[]) => {
      // Implementation for multi-select
      console.log('Select multiple:', ids)
    }, []),

    // Drag and drop actions
    startDrag: useCallback((item: DragItem) => {
      dispatch({ type: 'SET_DRAGGED_COMPONENT', payload: item })
      dispatch({ type: 'SET_IS_DRAGGING', payload: true })
    }, []),

    endDrag: useCallback(() => {
      dispatch({ type: 'SET_DRAGGED_COMPONENT', payload: undefined })
      dispatch({ type: 'SET_IS_DRAGGING', payload: false })
    }, []),

    handleDrop: useCallback((result: DropResult) => {
      // Implementation for handling drops
      console.log('Handle drop:', result)
      actions.endDrag()
    }, [actions]),

    // Search and filter actions
    updateSearchFilters: useCallback((filters: Partial<SearchFilters>) => {
      dispatch({ type: 'UPDATE_SEARCH_FILTERS', payload: filters })
    }, []),

    clearSearchFilters: useCallback(() => {
      dispatch({ type: 'CLEAR_SEARCH_FILTERS' })
    }, []),

    // AI suggestions actions
    loadAISuggestions: useCallback(async (query?: string) => {
      // Mock AI suggestions - replace with actual AI service
      const suggestions: AISuggestion[] = [
        {
          id: '1',
          type: 'component',
          title: 'Add Hero Section',
          description: 'A compelling hero section would improve user engagement',
          confidence: 0.85,
          reason: 'Based on your portfolio content, a hero section is recommended',
          category: 'layout'
        }
      ]
      dispatch({ type: 'SET_AI_SUGGESTIONS', payload: suggestions })
    }, []),

    applyAISuggestion: useCallback((suggestion: AISuggestion) => {
      // Implementation for applying AI suggestions
      console.log('Apply AI suggestion:', suggestion)
    }, []),

    dismissAISuggestion: useCallback((id: string) => {
      const updatedSuggestions = state.aiSuggestions.filter(s => s.id !== id)
      dispatch({ type: 'SET_AI_SUGGESTIONS', payload: updatedSuggestions })
    }, [state.aiSuggestions]),

    // Properties panel actions
    updatePropertiesPanel: useCallback((updates: Partial<PropertiesPanelState>) => {
      dispatch({ type: 'UPDATE_PROPERTIES_PANEL', payload: updates })
    }, []),

    updateComponentContent: useCallback((id: string, content: Partial<ComponentContent>) => {
      actions.updateComponent(id, { content: { ...state.canvas.components.find(c => c.id === id)?.content, ...content } })
    }, [state.canvas.components, actions]),

    updateComponentStyles: useCallback((id: string, styles: Partial<ComponentStyle>) => {
      actions.updateComponent(id, { styles: { ...state.canvas.components.find(c => c.id === id)?.styles, ...styles } })
    }, [state.canvas.components, actions]),

    updateComponentAnimations: useCallback((id: string, animations: Partial<ComponentAnimation>) => {
      actions.updateComponent(id, { animations: { ...state.canvas.components.find(c => c.id === id)?.animations, ...animations } })
    }, [state.canvas.components, actions]),

    // Undo/Redo actions
    undo: useCallback(() => {
      if (state.undoRedo.canUndo) {
        const previousCanvas = state.undoRedo.history[state.undoRedo.currentIndex - 1]
        dispatch({ type: 'SET_CANVAS', payload: previousCanvas })
        dispatch({
          type: 'SET_UNDO_REDO',
          payload: {
            ...state.undoRedo,
            currentIndex: state.undoRedo.currentIndex - 1,
            canUndo: state.undoRedo.currentIndex > 1,
            canRedo: true
          }
        })
      }
    }, [state.undoRedo]),

    redo: useCallback(() => {
      if (state.undoRedo.canRedo) {
        const nextCanvas = state.undoRedo.history[state.undoRedo.currentIndex + 1]
        dispatch({ type: 'SET_CANVAS', payload: nextCanvas })
        dispatch({
          type: 'SET_UNDO_REDO',
          payload: {
            ...state.undoRedo,
            currentIndex: state.undoRedo.currentIndex + 1,
            canUndo: true,
            canRedo: state.undoRedo.currentIndex < state.undoRedo.history.length - 2
          }
        })
      }
    }, [state.undoRedo]),

    saveToHistory: useCallback(() => {
      const newHistory = [...state.undoRedo.history.slice(0, state.undoRedo.currentIndex + 1), state.canvas]
      const trimmedHistory = newHistory.slice(-state.undoRedo.maxHistorySize)
      
      dispatch({
        type: 'SET_UNDO_REDO',
        payload: {
          ...state.undoRedo,
          history: trimmedHistory,
          currentIndex: trimmedHistory.length - 1,
          canUndo: trimmedHistory.length > 1,
          canRedo: false
        }
      })
    }, [state.undoRedo, state.canvas]),

    // Auto-save actions
    enableAutoSave: useCallback((interval?: number) => {
      dispatch({
        type: 'UPDATE_AUTO_SAVE',
        payload: {
          isEnabled: true,
          interval: interval || state.autoSave.interval
        }
      })
    }, [state.autoSave.interval]),

    disableAutoSave: useCallback(() => {
      dispatch({
        type: 'UPDATE_AUTO_SAVE',
        payload: {
          isEnabled: false
        }
      })
    }, []),

    save: useCallback(async () => {
      if (onSave) {
        dispatch({ type: 'UPDATE_AUTO_SAVE', payload: { isSaving: true } })
        try {
          await onSave(state.canvas)
          dispatch({
            type: 'UPDATE_AUTO_SAVE',
            payload: {
              lastSaved: new Date(),
              hasUnsavedChanges: false,
              isSaving: false
            }
          })
        } catch (error) {
          dispatch({
            type: 'UPDATE_AUTO_SAVE',
            payload: {
              error: error instanceof Error ? error.message : 'Save failed',
              isSaving: false
            }
          })
        }
      }
    }, [onSave, state.canvas]),

    load: useCallback(async (id: string) => {
      if (onLoad) {
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
          const canvas = await onLoad(id)
          dispatch({ type: 'SET_CANVAS', payload: canvas })
          actions.saveToHistory()
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Load failed' })
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }, [onLoad, actions]),

    // Canvas settings actions
    updateCanvasSettings: useCallback((settings: Partial<CanvasSettings>) => {
      dispatch({ type: 'UPDATE_CANVAS_SETTINGS', payload: settings })
    }, []),

    resetCanvasSettings: useCallback(() => {
      dispatch({ type: 'UPDATE_CANVAS_SETTINGS', payload: initialState.canvasSettings })
    }, []),

    // Keyboard shortcuts actions
    updateKeyboardShortcuts: useCallback((shortcuts: Partial<KeyboardShortcuts>) => {
      // Implementation for updating keyboard shortcuts
      console.log('Update keyboard shortcuts:', shortcuts)
    }, []),

    handleKeyboardShortcut: useCallback((key: string) => {
      // Implementation for handling custom keyboard shortcuts
      console.log('Handle keyboard shortcut:', key)
    }, [])
  }

  const contextValue: PortfolioBuilderContextType = {
    state,
    actions
  }

  return (
    <PortfolioBuilderContext.Provider value={contextValue}>
      {children}
    </PortfolioBuilderContext.Provider>
  )
}

// Hook to use the context
export const usePortfolioBuilder = (): PortfolioBuilderContextType => {
  const context = useContext(PortfolioBuilderContext)
  if (!context) {
    throw new Error('usePortfolioBuilder must be used within a PortfolioBuilderProvider')
  }
  return context
}

export default PortfolioBuilderProvider
