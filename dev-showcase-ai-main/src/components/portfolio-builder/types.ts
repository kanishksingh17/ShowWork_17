// Portfolio builder types and interfaces
export interface PortfolioComponent {
  id: string
  type: 'hero' | 'about' | 'skills' | 'projects' | 'contact' | 'experience' | 'education' | 'testimonials'
  name: string
  description: string
  icon: string
  category: 'layout' | 'content' | 'interactive' | 'media'
  tags: string[]
  defaultProps: Record<string, any>
  styles: Record<string, any>
  animations: Record<string, any>
  isDraggable: boolean
  isNestable: boolean
  children?: PortfolioComponent[]
  parentId?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioCanvas {
  id: string
  name: string
  description: string
  components: PortfolioComponent[]
  settings: {
    width: number
    height: number
    backgroundColor: string
    backgroundImage?: string
    padding: number
    margin: number
  }
  metadata: {
    version: string
    lastModified: Date
    createdBy: string
  }
}

export interface DragItem {
  id: string
  type: 'component' | 'canvas-item'
  component?: PortfolioComponent
  source: 'library' | 'canvas'
}

export interface DropResult {
  id: string
  type: 'component' | 'canvas-item'
  targetId?: string
  position: 'before' | 'after' | 'inside'
  parentId?: string
}

export interface ComponentLibraryItem {
  id: string
  name: string
  description: string
  icon: string
  category: string
  tags: string[]
  preview: string
  component: React.ComponentType<any>
  defaultProps: Record<string, any>
  isPopular: boolean
  isNew: boolean
  usage: number
}

export interface AISuggestion {
  id: string
  type: 'component' | 'layout' | 'content' | 'style'
  title: string
  description: string
  confidence: number
  component?: ComponentLibraryItem
  reason: string
  category: string
}

export interface PropertiesPanelState {
  selectedComponentId?: string
  selectedComponent?: PortfolioComponent
  activeTab: 'content' | 'styles' | 'animations' | 'settings'
  isExpanded: boolean
}

export interface UndoRedoState {
  history: PortfolioCanvas[]
  currentIndex: number
  maxHistorySize: number
  canUndo: boolean
  canRedo: boolean
}

export interface AutoSaveState {
  isEnabled: boolean
  interval: number
  lastSaved: Date
  isSaving: boolean
  hasUnsavedChanges: boolean
  error?: string
}

export interface KeyboardShortcuts {
  undo: string
  redo: string
  save: string
  duplicate: string
  delete: string
  selectAll: string
  copy: string
  paste: string
  cut: string
  zoomIn: string
  zoomOut: string
  resetZoom: string
  toggleGrid: string
  toggleRulers: string
}

export interface CanvasSettings {
  zoom: number
  showGrid: boolean
  showRulers: boolean
  snapToGrid: boolean
  gridSize: number
  showComponentBorders: boolean
  showComponentLabels: boolean
  previewMode: boolean
  devicePreview: 'desktop' | 'tablet' | 'mobile'
}

export interface SearchFilters {
  query: string
  category: string
  tags: string[]
  isPopular: boolean
  isNew: boolean
  sortBy: 'name' | 'usage' | 'date' | 'popularity'
  sortOrder: 'asc' | 'desc'
}

export interface ComponentStyle {
  position: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  top?: number
  right?: number
  bottom?: number
  left?: number
  width?: number | string
  height?: number | string
  minWidth?: number | string
  minHeight?: number | string
  maxWidth?: number | string
  maxHeight?: number | string
  margin?: number | string
  padding?: number | string
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: 'cover' | 'contain' | 'auto'
  backgroundPosition?: string
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y'
  border?: string
  borderRadius?: number | string
  boxShadow?: string
  opacity?: number
  transform?: string
  zIndex?: number
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none'
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  gap?: number | string
  gridTemplateColumns?: string
  gridTemplateRows?: string
  gridGap?: number | string
  fontSize?: number | string
  fontFamily?: string
  fontWeight?: number | string
  color?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  lineHeight?: number | string
  letterSpacing?: number | string
  textDecoration?: string
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
}

export interface ComponentAnimation {
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'elastic' | 'spring'
  duration: number
  delay: number
  easing: string
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode: 'none' | 'forwards' | 'backwards' | 'both'
  iterationCount: number | 'infinite'
  trigger: 'onLoad' | 'onHover' | 'onClick' | 'onScroll' | 'onFocus'
  stagger?: {
    enabled: boolean
    delay: number
    direction: 'forward' | 'reverse'
  }
}

export interface ComponentContent {
  title?: string
  subtitle?: string
  description?: string
  text?: string
  image?: {
    src: string
    alt: string
    caption?: string
  }
  video?: {
    src: string
    poster?: string
    autoplay?: boolean
    muted?: boolean
    loop?: boolean
  }
  links?: Array<{
    text: string
    url: string
    type: 'internal' | 'external' | 'email' | 'phone'
  }>
  buttons?: Array<{
    text: string
    action: 'link' | 'modal' | 'scroll' | 'custom'
    target?: string
    style: 'primary' | 'secondary' | 'outline' | 'ghost'
  }>
  form?: {
    fields: Array<{
      name: string
      type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
      label: string
      placeholder?: string
      required?: boolean
      options?: string[]
    }>
    submitText: string
    action: string
    method: 'GET' | 'POST'
  }
  social?: Array<{
    platform: string
    url: string
    icon: string
  }>
}

export interface PortfolioBuilderState {
  canvas: PortfolioCanvas
  selectedComponentId?: string
  hoveredComponentId?: string
  draggedComponent?: DragItem
  isDragging: boolean
  searchFilters: SearchFilters
  aiSuggestions: AISuggestion[]
  propertiesPanel: PropertiesPanelState
  undoRedo: UndoRedoState
  autoSave: AutoSaveState
  canvasSettings: CanvasSettings
  keyboardShortcuts: KeyboardShortcuts
  isLoading: boolean
  error?: string
}

export interface PortfolioBuilderActions {
  // Canvas actions
  createCanvas: (name: string, description?: string) => void
  updateCanvas: (updates: Partial<PortfolioCanvas>) => void
  deleteCanvas: (id: string) => void
  
  // Component actions
  addComponent: (component: PortfolioComponent, targetId?: string, position?: 'before' | 'after' | 'inside') => void
  updateComponent: (id: string, updates: Partial<PortfolioComponent>) => void
  deleteComponent: (id: string) => void
  duplicateComponent: (id: string) => void
  moveComponent: (id: string, targetId: string, position: 'before' | 'after' | 'inside') => void
  
  // Selection actions
  selectComponent: (id: string) => void
  deselectComponent: () => void
  selectMultiple: (ids: string[]) => void
  
  // Drag and drop actions
  startDrag: (item: DragItem) => void
  endDrag: () => void
  handleDrop: (result: DropResult) => void
  
  // Search and filter actions
  updateSearchFilters: (filters: Partial<SearchFilters>) => void
  clearSearchFilters: () => void
  
  // AI suggestions actions
  loadAISuggestions: (query?: string) => void
  applyAISuggestion: (suggestion: AISuggestion) => void
  dismissAISuggestion: (id: string) => void
  
  // Properties panel actions
  updatePropertiesPanel: (updates: Partial<PropertiesPanelState>) => void
  updateComponentContent: (id: string, content: Partial<ComponentContent>) => void
  updateComponentStyles: (id: string, styles: Partial<ComponentStyle>) => void
  updateComponentAnimations: (id: string, animations: Partial<ComponentAnimation>) => void
  
  // Undo/Redo actions
  undo: () => void
  redo: () => void
  saveToHistory: () => void
  
  // Auto-save actions
  enableAutoSave: (interval?: number) => void
  disableAutoSave: () => void
  save: () => Promise<void>
  load: (id: string) => Promise<void>
  
  // Canvas settings actions
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void
  resetCanvasSettings: () => void
  
  // Keyboard shortcuts actions
  updateKeyboardShortcuts: (shortcuts: Partial<KeyboardShortcuts>) => void
  handleKeyboardShortcut: (key: string) => void
}

export interface PortfolioBuilderContextType {
  state: PortfolioBuilderState
  actions: PortfolioBuilderActions
}

export interface PortfolioBuilderProps {
  initialCanvas?: PortfolioCanvas
  onSave?: (canvas: PortfolioCanvas) => Promise<void>
  onLoad?: (id: string) => Promise<PortfolioCanvas>
  autoSaveInterval?: number
  maxHistorySize?: number
  keyboardShortcuts?: Partial<KeyboardShortcuts>
  className?: string
  style?: React.CSSProperties
}
