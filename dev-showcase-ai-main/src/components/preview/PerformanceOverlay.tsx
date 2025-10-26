"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Cpu,
  MemoryStick,
  Gauge,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Rocket,
  Timer,
  HardDrive,
  Network,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { usePreview } from "../../lib/preview/context";
import { PerformanceMetrics } from "../../lib/preview/types";

interface PerformanceOverlayProps {
  className?: string;
}

export const PerformanceOverlay: React.FC<PerformanceOverlayProps> = ({
  className = "",
}) => {
  const { state, actions } = usePreview();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "metrics" | "charts" | "settings"
  >("overview");
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);
  const historyRef = useRef<PerformanceMetrics[]>([]);

  // Update history
  useEffect(() => {
    const newHistory = [...historyRef.current, state.performanceMetrics];
    if (newHistory.length > 100) {
      newHistory.shift();
    }
    historyRef.current = newHistory;
    setHistory(newHistory);
  }, [state.performanceMetrics]);

  const getPerformanceStatus = () => {
    const { fps, renderTime, memoryUsage } = state.performanceMetrics;

    if (fps < 30 || renderTime > 100 || memoryUsage > 100 * 1024 * 1024) {
      return { status: "poor", color: "red", icon: XCircle };
    } else if (fps < 50 || renderTime > 50 || memoryUsage > 50 * 1024 * 1024) {
      return { status: "fair", color: "yellow", icon: AlertTriangle };
    } else {
      return { status: "good", color: "green", icon: CheckCircle };
    }
  };

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return "text-green-600";
    if (fps >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getMemoryColor = (memory: number) => {
    const mb = memory / 1024 / 1024;
    if (mb < 50) return "text-green-600";
    if (mb < 100) return "text-yellow-600";
    return "text-red-600";
  };

  const getRenderTimeColor = (time: number) => {
    if (time < 16) return "text-green-600";
    if (time < 33) return "text-yellow-600";
    return "text-red-600";
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTime = (ms: number) => {
    return `${ms.toFixed(2)}ms`;
  };

  const performanceStatus = getPerformanceStatus();
  const StatusIcon = performanceStatus.icon;

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed top-4 right-4 z-50 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all ${className}`}
        title="Show Performance Overlay"
      >
        <Activity className="w-5 h-5" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`fixed top-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 ${
          isMinimized ? "w-64" : "w-80"
        } ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-900">Performance</span>
            <StatusIcon
              className={`w-4 h-4 text-${performanceStatus.color}-600`}
            />
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {isMinimized ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "metrics", label: "Metrics", icon: Gauge },
                { id: "charts", label: "Charts", icon: LineChart },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium ${
                      selectedTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-3">
              {selectedTab === "overview" && (
                <div className="space-y-3">
                  {/* Performance Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <div className="flex items-center space-x-1">
                      <StatusIcon
                        className={`w-4 h-4 text-${performanceStatus.color}-600`}
                      />
                      <span
                        className={`text-sm font-medium capitalize text-${performanceStatus.color}-600`}
                      >
                        {performanceStatus.status}
                      </span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded p-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <Zap className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">FPS</span>
                      </div>
                      <div
                        className={`text-lg font-bold ${getFPSColor(state.performanceMetrics.fps)}`}
                      >
                        {state.performanceMetrics.fps}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <MemoryStick className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">Memory</span>
                      </div>
                      <div
                        className={`text-sm font-bold ${getMemoryColor(state.performanceMetrics.memoryUsage)}`}
                      >
                        {formatBytes(state.performanceMetrics.memoryUsage)}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">Render</span>
                      </div>
                      <div
                        className={`text-sm font-bold ${getRenderTimeColor(state.performanceMetrics.renderTime)}`}
                      >
                        {formatTime(state.performanceMetrics.renderTime)}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <Target className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">
                          Components
                        </span>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {state.performanceMetrics.componentCount}
                      </div>
                    </div>
                  </div>

                  {/* Device Info */}
                  <div className="bg-gray-50 rounded p-2">
                    <div className="flex items-center space-x-1 mb-1">
                      <Monitor className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">Device</span>
                    </div>
                    <div className="text-sm text-gray-900">
                      {state.deviceViewport.name} ({state.deviceViewport.width}×
                      {state.deviceViewport.height})
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "metrics" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">FPS</span>
                      <span
                        className={`font-medium ${getFPSColor(state.performanceMetrics.fps)}`}
                      >
                        {state.performanceMetrics.fps}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          state.performanceMetrics.fps >= 55
                            ? "bg-green-500"
                            : state.performanceMetrics.fps >= 30
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(100, (state.performanceMetrics.fps / 60) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Memory Usage</span>
                      <span
                        className={`font-medium ${getMemoryColor(state.performanceMetrics.memoryUsage)}`}
                      >
                        {formatBytes(state.performanceMetrics.memoryUsage)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          state.performanceMetrics.memoryUsage <
                          50 * 1024 * 1024
                            ? "bg-green-500"
                            : state.performanceMetrics.memoryUsage <
                                100 * 1024 * 1024
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(100, (state.performanceMetrics.memoryUsage / (200 * 1024 * 1024)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Render Time</span>
                      <span
                        className={`font-medium ${getRenderTimeColor(state.performanceMetrics.renderTime)}`}
                      >
                        {formatTime(state.performanceMetrics.renderTime)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          state.performanceMetrics.renderTime < 16
                            ? "bg-green-500"
                            : state.performanceMetrics.renderTime < 33
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(100, (state.performanceMetrics.renderTime / 100) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {state.performanceMetrics.componentCount}
                      </div>
                      <div className="text-xs text-gray-600">Components</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {formatBytes(state.performanceMetrics.bundleSize)}
                      </div>
                      <div className="text-xs text-gray-600">Bundle Size</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "charts" && (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-2">
                    Performance History
                  </div>

                  {/* FPS Chart */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">FPS</span>
                      <span
                        className={getFPSColor(state.performanceMetrics.fps)}
                      >
                        {state.performanceMetrics.fps}
                      </span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded flex items-end space-x-px p-1">
                      {history.slice(-20).map((metric, index) => (
                        <div
                          key={index}
                          className={`flex-1 ${
                            metric.fps >= 55
                              ? "bg-green-500"
                              : metric.fps >= 30
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ height: `${(metric.fps / 60) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Memory Chart */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Memory</span>
                      <span
                        className={getMemoryColor(
                          state.performanceMetrics.memoryUsage,
                        )}
                      >
                        {formatBytes(state.performanceMetrics.memoryUsage)}
                      </span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded flex items-end space-x-px p-1">
                      {history.slice(-20).map((metric, index) => (
                        <div
                          key={index}
                          className={`flex-1 ${
                            metric.memoryUsage < 50 * 1024 * 1024
                              ? "bg-green-500"
                              : metric.memoryUsage < 100 * 1024 * 1024
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{
                            height: `${Math.min(100, (metric.memoryUsage / (200 * 1024 * 1024)) * 100)}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Render Time Chart */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Render Time</span>
                      <span
                        className={getRenderTimeColor(
                          state.performanceMetrics.renderTime,
                        )}
                      >
                        {formatTime(state.performanceMetrics.renderTime)}
                      </span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded flex items-end space-x-px p-1">
                      {history.slice(-20).map((metric, index) => (
                        <div
                          key={index}
                          className={`flex-1 ${
                            metric.renderTime < 16
                              ? "bg-green-500"
                              : metric.renderTime < 33
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{
                            height: `${Math.min(100, (metric.renderTime / 100) * 100)}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "settings" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Performance Monitoring
                      </span>
                      <button
                        onClick={() => {
                          if (state.performanceMetrics) {
                            actions.disablePerformanceMonitoring();
                          } else {
                            actions.enablePerformanceMonitoring();
                          }
                        }}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full ${
                          state.performanceMetrics
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                            state.performanceMetrics
                              ? "translate-x-5"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Error Reporting
                      </span>
                      <button
                        className={`relative inline-flex h-5 w-9 items-center rounded-full ${
                          state.error ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                            state.error ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Last Updated:{" "}
                      {state.performanceMetrics.lastUpdated.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PerformanceOverlay;
