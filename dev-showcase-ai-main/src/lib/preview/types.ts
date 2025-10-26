// Live Preview System Types

export interface PreviewState {
  isConnected: boolean;
  isFullscreen: boolean;
  deviceViewport: DeviceViewport;
  zoom: number;
  pan: { x: number; y: number };
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  performanceMetrics: PerformanceMetrics;
  exportStatus: ExportStatus;
}

export interface DeviceViewport {
  type: "desktop" | "tablet" | "mobile" | "custom";
  width: number;
  height: number;
  name: string;
  orientation: "portrait" | "landscape";
  pixelRatio: number;
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  fps: number;
  componentCount: number;
  bundleSize: number;
  loadTime: number;
  lastUpdated: Date;
}

export interface ExportStatus {
  isExporting: boolean;
  exportType: ExportType | null;
  progress: number;
  error: string | null;
  downloadUrl: string | null;
}

export type ExportType = "html" | "nextjs" | "pdf" | "image";

export interface WebSocketMessage {
  type: "update" | "error" | "performance" | "export" | "ping" | "pong";
  payload: any;
  timestamp: Date;
  id: string;
}

export interface PreviewUpdate {
  componentId: string;
  changes: {
    content?: any;
    styles?: any;
    animations?: any;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
  };
  timestamp: Date;
}

export interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  type: "desktop" | "tablet" | "mobile";
  orientation: "portrait" | "landscape";
  pixelRatio: number;
  category: "popular" | "custom" | "legacy";
}

export interface ZoomLevel {
  level: number;
  label: string;
  value: number;
}

export interface PanState {
  x: number;
  y: number;
  isDragging: boolean;
  startPosition: { x: number; y: number };
  lastPosition: { x: number; y: number };
}

export interface FullscreenState {
  isFullscreen: boolean;
  element: HTMLElement | null;
  originalStyle: string | null;
  originalParent: HTMLElement | null;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  lastError: Date | null;
}

export interface LoadingState {
  isLoading: boolean;
  loadingType:
    | "initial"
    | "update"
    | "export"
    | "device-switch"
    | "zoom"
    | "pan";
  progress: number;
  message: string;
  startTime: Date | null;
  estimatedDuration: number | null;
}

export interface ExportOptions {
  type: ExportType;
  quality?: "low" | "medium" | "high" | "ultra";
  format?: "png" | "jpg" | "webp" | "svg";
  includeAssets?: boolean;
  optimizeImages?: boolean;
  minifyCode?: boolean;
  includeSourceMaps?: boolean;
  customDomain?: string;
  seoOptimized?: boolean;
  responsive?: boolean;
  darkMode?: boolean;
  analytics?: boolean;
}

export interface ExportResult {
  success: boolean;
  downloadUrl?: string;
  fileSize?: number;
  error?: string;
  metadata?: {
    components: number;
    assets: number;
    optimization: string;
    generatedAt: Date;
  };
}

export interface PreviewConfig {
  websocketUrl: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  updateDebounceMs: number;
  performanceMonitoring: boolean;
  errorReporting: boolean;
  autoSave: boolean;
  defaultZoom: number;
  defaultDevice: DeviceViewport;
  enableFullscreen: boolean;
  enableExport: boolean;
  enablePerformanceOverlay: boolean;
}

export interface ComponentRenderProps {
  component: any;
  viewport: DeviceViewport;
  zoom: number;
  pan: { x: number; y: number };
  isPreview: boolean;
  performanceMode: "high" | "medium" | "low";
  errorBoundary: boolean;
}

export interface PreviewContextType {
  state: PreviewState;
  actions: PreviewActions;
  config: PreviewConfig;
}

export interface PreviewActions {
  // WebSocket actions
  connect: () => void;
  disconnect: () => void;
  sendUpdate: (update: PreviewUpdate) => void;

  // Viewport actions
  setDeviceViewport: (viewport: DeviceViewport) => void;
  addCustomViewport: (viewport: Omit<DeviceViewport, "type">) => void;
  removeCustomViewport: (id: string) => void;

  // Zoom and pan actions
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setPan: (pan: { x: number; y: number }) => void;
  resetPan: () => void;
  fitToScreen: () => void;

  // Fullscreen actions
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  toggleFullscreen: () => void;

  // Performance actions
  enablePerformanceMonitoring: () => void;
  disablePerformanceMonitoring: () => void;
  updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => void;

  // Export actions
  exportPortfolio: (options: ExportOptions) => Promise<ExportResult>;
  cancelExport: () => void;

  // Error handling
  clearError: () => void;
  retryConnection: () => void;

  // Loading actions
  setLoading: (loading: Partial<LoadingState>) => void;
  clearLoading: () => void;
}

export interface PreviewProviderProps {
  children: React.ReactNode;
  config?: Partial<PreviewConfig>;
  onUpdate?: (update: PreviewUpdate) => void;
  onError?: (error: Error) => void;
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
  onExportComplete?: (result: ExportResult) => void;
}

export interface PreviewComponentProps {
  component: any;
  viewport: DeviceViewport;
  zoom: number;
  pan: { x: number; y: number };
  isPreview?: boolean;
  performanceMode?: "high" | "medium" | "low";
  onError?: (error: Error) => void;
  onLoad?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface DeviceSelectorProps {
  currentViewport: DeviceViewport;
  onViewportChange: (viewport: DeviceViewport) => void;
  customViewports: DeviceViewport[];
  onAddCustomViewport: (viewport: Omit<DeviceViewport, "type">) => void;
  onRemoveCustomViewport: (id: string) => void;
  className?: string;
}

export interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitToScreen: () => void;
  className?: string;
}

export interface PanControlsProps {
  pan: { x: number; y: number };
  onPanChange: (pan: { x: number; y: number }) => void;
  onResetPan: () => void;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  className?: string;
}

export interface PerformanceOverlayProps {
  metrics: PerformanceMetrics;
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

export interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
  currentViewport: DeviceViewport;
  className?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  retryLimit?: number;
}

export interface LoadingIndicatorProps {
  loading: LoadingState;
  className?: string;
}

export interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggle: () => void;
  className?: string;
}

export interface PreviewToolbarProps {
  viewport: DeviceViewport;
  zoom: number;
  pan: { x: number; y: number };
  isFullscreen: boolean;
  isConnected: boolean;
  performanceMetrics: PerformanceMetrics;
  onViewportChange: (viewport: DeviceViewport) => void;
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
  onFullscreenToggle: () => void;
  onExportClick: () => void;
  onPerformanceToggle: () => void;
  className?: string;
}
