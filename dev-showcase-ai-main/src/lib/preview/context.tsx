"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { PreviewWebSocket, websocketManager } from "./websocket";
import {
  PreviewState,
  PreviewActions,
  PreviewContextType,
  PreviewProviderProps,
  PreviewConfig,
  DeviceViewport,
  PerformanceMetrics,
  ExportOptions,
  ExportResult,
  PreviewUpdate,
  LoadingState,
  ErrorBoundaryState,
  DevicePreset,
} from "./types";

// Default configuration
const defaultConfig: PreviewConfig = {
  websocketUrl: "ws://localhost:3001/preview",
  reconnectInterval: 3000,
  maxReconnectAttempts: 10,
  updateDebounceMs: 100,
  performanceMonitoring: true,
  errorReporting: true,
  autoSave: true,
  defaultZoom: 1,
  defaultDevice: {
    type: "desktop",
    width: 1200,
    height: 800,
    name: "Desktop",
    orientation: "landscape",
    pixelRatio: 1,
  },
  enableFullscreen: true,
  enableExport: true,
  enablePerformanceOverlay: true,
};

// Device presets
const devicePresets: DevicePreset[] = [
  // Desktop
  {
    id: "desktop-1920",
    name: "Desktop 1920x1080",
    width: 1920,
    height: 1080,
    type: "desktop",
    orientation: "landscape",
    pixelRatio: 1,
    category: "popular",
  },
  {
    id: "desktop-1440",
    name: "Desktop 1440x900",
    width: 1440,
    height: 900,
    type: "desktop",
    orientation: "landscape",
    pixelRatio: 1,
    category: "popular",
  },
  {
    id: "desktop-1200",
    name: "Desktop 1200x800",
    width: 1200,
    height: 800,
    type: "desktop",
    orientation: "landscape",
    pixelRatio: 1,
    category: "popular",
  },

  // Tablet
  {
    id: "ipad-pro",
    name: "iPad Pro",
    width: 1024,
    height: 1366,
    type: "tablet",
    orientation: "portrait",
    pixelRatio: 2,
    category: "popular",
  },
  {
    id: "ipad",
    name: "iPad",
    width: 768,
    height: 1024,
    type: "tablet",
    orientation: "portrait",
    pixelRatio: 2,
    category: "popular",
  },
  {
    id: "surface-pro",
    name: "Surface Pro",
    width: 912,
    height: 1368,
    type: "tablet",
    orientation: "portrait",
    pixelRatio: 2,
    category: "popular",
  },

  // Mobile
  {
    id: "iphone-14-pro",
    name: "iPhone 14 Pro",
    width: 393,
    height: 852,
    type: "mobile",
    orientation: "portrait",
    pixelRatio: 3,
    category: "popular",
  },
  {
    id: "iphone-12",
    name: "iPhone 12",
    width: 390,
    height: 844,
    type: "mobile",
    orientation: "portrait",
    pixelRatio: 3,
    category: "popular",
  },
  {
    id: "pixel-7",
    name: "Pixel 7",
    width: 412,
    height: 915,
    type: "mobile",
    orientation: "portrait",
    pixelRatio: 2.75,
    category: "popular",
  },
  {
    id: "galaxy-s21",
    name: "Galaxy S21",
    width: 384,
    height: 854,
    type: "mobile",
    orientation: "portrait",
    pixelRatio: 2.75,
    category: "popular",
  },
];

// Initial state
const initialState: PreviewState = {
  isConnected: false,
  isFullscreen: false,
  deviceViewport: defaultConfig.defaultDevice,
  zoom: defaultConfig.defaultZoom,
  pan: { x: 0, y: 0 },
  isLoading: false,
  error: null,
  lastUpdate: null,
  performanceMetrics: {
    renderTime: 0,
    memoryUsage: 0,
    fps: 60,
    componentCount: 0,
    bundleSize: 0,
    loadTime: 0,
    lastUpdated: new Date(),
  },
  exportStatus: {
    isExporting: false,
    exportType: null,
    progress: 0,
    error: null,
    downloadUrl: null,
  },
};

// Action types
type PreviewAction =
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "SET_FULLSCREEN"; payload: boolean }
  | { type: "SET_DEVICE_VIEWPORT"; payload: DeviceViewport }
  | { type: "SET_ZOOM"; payload: number }
  | { type: "SET_PAN"; payload: { x: number; y: number } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_LAST_UPDATE"; payload: Date }
  | { type: "UPDATE_PERFORMANCE_METRICS"; payload: Partial<PerformanceMetrics> }
  | {
      type: "SET_EXPORT_STATUS";
      payload: Partial<PreviewState["exportStatus"]>;
    }
  | { type: "RESET_STATE" };

// Reducer
function previewReducer(
  state: PreviewState,
  action: PreviewAction,
): PreviewState {
  switch (action.type) {
    case "SET_CONNECTED":
      return { ...state, isConnected: action.payload };

    case "SET_FULLSCREEN":
      return { ...state, isFullscreen: action.payload };

    case "SET_DEVICE_VIEWPORT":
      return { ...state, deviceViewport: action.payload };

    case "SET_ZOOM":
      return { ...state, zoom: Math.max(0.1, Math.min(3, action.payload)) };

    case "SET_PAN":
      return { ...state, pan: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_LAST_UPDATE":
      return { ...state, lastUpdate: action.payload };

    case "UPDATE_PERFORMANCE_METRICS":
      return {
        ...state,
        performanceMetrics: {
          ...state.performanceMetrics,
          ...action.payload,
          lastUpdated: new Date(),
        },
      };

    case "SET_EXPORT_STATUS":
      return {
        ...state,
        exportStatus: {
          ...state.exportStatus,
          ...action.payload,
        },
      };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
}

// Context
const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

// Provider component
export const PreviewProvider: React.FC<PreviewProviderProps> = ({
  children,
  config = {},
  onUpdate,
  onError,
  onPerformanceUpdate,
  onExportComplete,
}) => {
  const [state, dispatch] = useReducer(previewReducer, initialState);
  const [loadingState, setLoadingState] = React.useState<LoadingState>({
    isLoading: false,
    loadingType: "initial",
    progress: 0,
    message: "",
    startTime: null,
    estimatedDuration: null,
  });
  const [errorBoundaryState, setErrorBoundaryState] =
    React.useState<ErrorBoundaryState>({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastError: null,
    });

  const finalConfig = { ...defaultConfig, ...config };
  const wsRef = useRef<PreviewWebSocket | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const performanceMonitoringRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket connection
  const connect = useCallback(async () => {
    try {
      setLoadingState((prev) => ({
        ...prev,
        isLoading: true,
        loadingType: "initial",
        message: "Connecting...",
      }));

      wsRef.current = websocketManager.createConnection(
        "preview",
        finalConfig.websocketUrl,
        {
          reconnectInterval: finalConfig.reconnectInterval,
          maxReconnectAttempts: finalConfig.maxReconnectAttempts,
        },
      );

      wsRef.current.setOnOpen(() => {
        dispatch({ type: "SET_CONNECTED", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
      });

      wsRef.current.setOnClose(() => {
        dispatch({ type: "SET_CONNECTED", payload: false });
      });

      wsRef.current.setOnError((error) => {
        dispatch({ type: "SET_ERROR", payload: "WebSocket connection failed" });
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
        onError?.(new Error("WebSocket connection failed"));
      });

      wsRef.current.setOnUpdate((update) => {
        dispatch({ type: "SET_LAST_UPDATE", payload: new Date() });
        onUpdate?.(update);
      });

      wsRef.current.setOnPerformance((metrics) => {
        dispatch({ type: "UPDATE_PERFORMANCE_METRICS", payload: metrics });
        onPerformanceUpdate?.(metrics);
      });

      wsRef.current.setOnExport((data) => {
        if (data.success) {
          dispatch({
            type: "SET_EXPORT_STATUS",
            payload: { downloadUrl: data.downloadUrl, progress: 100 },
          });
          onExportComplete?.(data);
        } else {
          dispatch({
            type: "SET_EXPORT_STATUS",
            payload: { error: data.error },
          });
        }
      });

      await wsRef.current.connect();
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Connection failed",
      });
      setLoadingState((prev) => ({ ...prev, isLoading: false }));
      onError?.(
        error instanceof Error ? error : new Error("Connection failed"),
      );
    }
  }, [finalConfig, onUpdate, onError, onPerformanceUpdate, onExportComplete]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }
    dispatch({ type: "SET_CONNECTED", payload: false });
  }, []);

  const sendUpdate = useCallback((update: PreviewUpdate) => {
    if (wsRef.current?.isConnected) {
      wsRef.current.sendUpdate(update);
    }
  }, []);

  // Viewport actions
  const setDeviceViewport = useCallback((viewport: DeviceViewport) => {
    dispatch({ type: "SET_DEVICE_VIEWPORT", payload: viewport });
    setLoadingState((prev) => ({
      ...prev,
      isLoading: true,
      loadingType: "device-switch",
      message: "Switching device...",
    }));

    setTimeout(() => {
      setLoadingState((prev) => ({ ...prev, isLoading: false }));
    }, 300);
  }, []);

  const addCustomViewport = useCallback(
    (viewport: Omit<DeviceViewport, "type">) => {
      const customViewport: DeviceViewport = {
        ...viewport,
        type: "custom",
      };
      // In a real app, you'd save this to localStorage or backend
      console.log("Adding custom viewport:", customViewport);
    },
    [],
  );

  const removeCustomViewport = useCallback((id: string) => {
    // In a real app, you'd remove this from localStorage or backend
    console.log("Removing custom viewport:", id);
  }, []);

  // Zoom and pan actions
  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: "SET_ZOOM", payload: zoom });
  }, []);

  const zoomIn = useCallback(() => {
    dispatch({ type: "SET_ZOOM", payload: state.zoom * 1.2 });
  }, [state.zoom]);

  const zoomOut = useCallback(() => {
    dispatch({ type: "SET_ZOOM", payload: state.zoom / 1.2 });
  }, [state.zoom]);

  const resetZoom = useCallback(() => {
    dispatch({ type: "SET_ZOOM", payload: 1 });
  }, []);

  const setPan = useCallback((pan: { x: number; y: number }) => {
    dispatch({ type: "SET_PAN", payload: pan });
  }, []);

  const resetPan = useCallback(() => {
    dispatch({ type: "SET_PAN", payload: { x: 0, y: 0 } });
  }, []);

  const fitToScreen = useCallback(() => {
    dispatch({ type: "SET_ZOOM", payload: 1 });
    dispatch({ type: "SET_PAN", payload: { x: 0, y: 0 } });
  }, []);

  // Fullscreen actions
  const enterFullscreen = useCallback(() => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
    dispatch({ type: "SET_FULLSCREEN", payload: true });
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    dispatch({ type: "SET_FULLSCREEN", payload: false });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (state.isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [state.isFullscreen, enterFullscreen, exitFullscreen]);

  // Performance monitoring
  const enablePerformanceMonitoring = useCallback(() => {
    if (performanceMonitoringRef.current) return;

    performanceMonitoringRef.current = setInterval(() => {
      if (finalConfig.performanceMonitoring) {
        const metrics: Partial<PerformanceMetrics> = {
          renderTime: performance.now(),
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
          fps: 60, // This would be calculated from actual frame timing
          componentCount: document.querySelectorAll("[data-component]").length,
          bundleSize: 0, // This would be calculated from actual bundle size
          loadTime: performance.now(),
        };
        dispatch({ type: "UPDATE_PERFORMANCE_METRICS", payload: metrics });
      }
    }, 1000);
  }, [finalConfig.performanceMonitoring]);

  const disablePerformanceMonitoring = useCallback(() => {
    if (performanceMonitoringRef.current) {
      clearInterval(performanceMonitoringRef.current);
      performanceMonitoringRef.current = null;
    }
  }, []);

  const updatePerformanceMetrics = useCallback(
    (metrics: Partial<PerformanceMetrics>) => {
      dispatch({ type: "UPDATE_PERFORMANCE_METRICS", payload: metrics });
    },
    [],
  );

  // Export actions
  const exportPortfolio = useCallback(
    async (options: ExportOptions): Promise<ExportResult> => {
      dispatch({
        type: "SET_EXPORT_STATUS",
        payload: { isExporting: true, exportType: options.type, progress: 0 },
      });

      try {
        setLoadingState((prev) => ({
          ...prev,
          isLoading: true,
          loadingType: "export",
          message: `Exporting ${options.type}...`,
        }));

        // Simulate export process
        for (let i = 0; i <= 100; i += 10) {
          dispatch({ type: "SET_EXPORT_STATUS", payload: { progress: i } });
          setLoadingState((prev) => ({ ...prev, progress: i }));
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        const result: ExportResult = {
          success: true,
          downloadUrl: `https://example.com/downloads/portfolio.${options.type}`,
          fileSize: 1024 * 1024, // 1MB
          metadata: {
            components: 5,
            assets: 10,
            optimization: "high",
            generatedAt: new Date(),
          },
        };

        dispatch({
          type: "SET_EXPORT_STATUS",
          payload: {
            isExporting: false,
            downloadUrl: result.downloadUrl || null,
          },
        });
        setLoadingState((prev) => ({ ...prev, isLoading: false }));

        return result;
      } catch (error) {
        const result: ExportResult = {
          success: false,
          error: error instanceof Error ? error.message : "Export failed",
        };

        dispatch({
          type: "SET_EXPORT_STATUS",
          payload: { isExporting: false, error: result.error || null },
        });
        setLoadingState((prev) => ({ ...prev, isLoading: false }));

        return result;
      }
    },
    [],
  );

  const cancelExport = useCallback(() => {
    dispatch({
      type: "SET_EXPORT_STATUS",
      payload: { isExporting: false, progress: 0 },
    });
    setLoadingState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  // Error handling
  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
    setErrorBoundaryState((prev) => ({
      ...prev,
      hasError: false,
      error: null,
      errorInfo: null,
    }));
  }, []);

  const retryConnection = useCallback(() => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  }, [connect, disconnect]);

  // Loading actions
  const setLoading = useCallback((loading: Partial<LoadingState>) => {
    setLoadingState((prev) => ({ ...prev, ...loading }));
  }, []);

  const clearLoading = useCallback(() => {
    setLoadingState((prev) => ({
      ...prev,
      isLoading: false,
      progress: 0,
      message: "",
    }));
  }, []);

  // Effects
  useEffect(() => {
    connect();
    return () => {
      disconnect();
      disablePerformanceMonitoring();
    };
  }, [connect, disconnect, disablePerformanceMonitoring]);

  useEffect(() => {
    if (finalConfig.performanceMonitoring) {
      enablePerformanceMonitoring();
    } else {
      disablePerformanceMonitoring();
    }
  }, [
    finalConfig.performanceMonitoring,
    enablePerformanceMonitoring,
    disablePerformanceMonitoring,
  ]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      dispatch({ type: "SET_FULLSCREEN", payload: isFullscreen });
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Actions object
  const actions: PreviewActions = {
    connect,
    disconnect,
    sendUpdate,
    setDeviceViewport,
    addCustomViewport,
    removeCustomViewport,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setPan,
    resetPan,
    fitToScreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    enablePerformanceMonitoring,
    disablePerformanceMonitoring,
    updatePerformanceMetrics,
    exportPortfolio,
    cancelExport,
    clearError,
    retryConnection,
    setLoading,
    clearLoading,
  };

  const contextValue: PreviewContextType = {
    state,
    actions,
    config: finalConfig,
  };

  return (
    <PreviewContext.Provider value={contextValue}>
      {children}
    </PreviewContext.Provider>
  );
};

// Hook to use the context
export const usePreview = (): PreviewContextType => {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }
  return context;
};

// Utility hooks
export const useDevicePresets = (): DevicePreset[] => {
  return devicePresets;
};

export const useCustomViewports = (): DeviceViewport[] => {
  // In a real app, this would come from localStorage or backend
  return [];
};

export default PreviewProvider;
