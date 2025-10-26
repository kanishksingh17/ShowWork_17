"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  X,
  RotateCw,
  Settings,
  ChevronDown,
  ChevronUp,
  Check,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { usePreview, useDevicePresets } from "../../lib/preview/context";
import { DeviceViewport, DevicePreset } from "../../lib/preview/types";

interface DeviceSelectorProps {
  className?: string;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  className = "",
}) => {
  const { state, actions } = usePreview();
  const devicePresets = useDevicePresets();
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customViewport, setCustomViewport] = useState({
    name: "",
    width: 1200,
    height: 800,
    orientation: "landscape" as "portrait" | "landscape",
    pixelRatio: 1,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowCustomForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeviceSelect = (preset: DevicePreset) => {
    const viewport: DeviceViewport = {
      type: preset.type,
      width: preset.width,
      height: preset.height,
      name: preset.name,
      orientation: preset.orientation,
      pixelRatio: preset.pixelRatio,
    };
    actions.setDeviceViewport(viewport);
    setIsOpen(false);
  };

  const handleCustomViewportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      customViewport.name &&
      customViewport.width > 0 &&
      customViewport.height > 0
    ) {
      actions.addCustomViewport(customViewport);
      setShowCustomForm(false);
      setCustomViewport({
        name: "",
        width: 1200,
        height: 800,
        orientation: "landscape",
        pixelRatio: 1,
      });
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "desktop":
        return <Monitor className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getCurrentDeviceIcon = () => {
    return getDeviceIcon(state.deviceViewport.type);
  };

  const groupedPresets = devicePresets.reduce(
    (acc, preset) => {
      if (!acc[preset.type]) {
        acc[preset.type] = [];
      }
      acc[preset.type].push(preset);
      return acc;
    },
    {} as Record<string, DevicePreset[]>,
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Current Device Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {getCurrentDeviceIcon()}
        <span className="text-sm font-medium text-gray-700">
          {state.deviceViewport.name}
        </span>
        <span className="text-xs text-gray-500">
          {state.deviceViewport.width}×{state.deviceViewport.height}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Device Viewport
                </h3>
                <button
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                >
                  <Plus className="w-3 h-3" />
                  <span>Custom</span>
                </button>
              </div>

              {/* Custom Viewport Form */}
              <AnimatePresence>
                {showCustomForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <form
                      onSubmit={handleCustomViewportSubmit}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={customViewport.name}
                          onChange={(e) =>
                            setCustomViewport((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Custom Device"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Width
                          </label>
                          <input
                            type="number"
                            value={customViewport.width}
                            onChange={(e) =>
                              setCustomViewport((prev) => ({
                                ...prev,
                                width: parseInt(e.target.value) || 0,
                              }))
                            }
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Height
                          </label>
                          <input
                            type="number"
                            value={customViewport.height}
                            onChange={(e) =>
                              setCustomViewport((prev) => ({
                                ...prev,
                                height: parseInt(e.target.value) || 0,
                              }))
                            }
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="submit"
                          className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCustomForm(false)}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                        >
                          <X className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Device Presets */}
              <div className="space-y-4">
                {Object.entries(groupedPresets).map(([type, presets]) => (
                  <div key={type}>
                    <div className="flex items-center space-x-2 mb-2">
                      {getDeviceIcon(type)}
                      <h4 className="text-xs font-medium text-gray-700 capitalize">
                        {type}
                      </h4>
                    </div>
                    <div className="space-y-1">
                      {presets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => handleDeviceSelect(preset)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-gray-50 ${
                            state.deviceViewport.name === preset.name
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "text-gray-700"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <span className="font-medium">{preset.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">
                              {preset.width}×{preset.height}
                            </span>
                            {preset.orientation === "portrait" && (
                              <RotateCw className="w-3 h-3 text-gray-400" />
                            )}
                            {state.deviceViewport.name === preset.name && (
                              <Check className="w-3 h-3 text-blue-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Viewport Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Current Viewport</span>
                  <span>
                    {state.deviceViewport.width}×{state.deviceViewport.height}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                  <span>Pixel Ratio</span>
                  <span>{state.deviceViewport.pixelRatio}x</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                  <span>Orientation</span>
                  <span className="capitalize">
                    {state.deviceViewport.orientation}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeviceSelector;
