"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Code,
  Image,
  FileImage,
  X,
  Settings,
  Check,
  AlertCircle,
  Info,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  EyeOff,
  BarChart3,
  Palette,
  Layers,
  Sparkles,
  Rocket,
  Target,
  Gauge,
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
  FileImage as FileImageIcon,
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
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  RotateCcw,
  Copy,
  Trash2,
  Save,
  Upload,
  Share2,
  HelpCircle,
  Lightbulb,
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
  Grid,
  List,
  Star,
  TrendingUp,
  Box,
  MousePointer,
  Hand,
  GripVertical,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react";
import { usePreview } from "../../lib/preview/context";
import { ExportOptions, ExportType } from "../../lib/preview/types";
import {
  PortfolioExporter,
  exportPresets,
  downloadFile,
} from "../../lib/preview/export";

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  isOpen,
  onClose,
  className = "",
}) => {
  const { state, actions } = usePreview();
  const [selectedType, setSelectedType] = useState<ExportType>("html");
  const [options, setOptions] = useState<ExportOptions>(exportPresets.html);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const exporter = new PortfolioExporter();

  const exportTypes = [
    {
      id: "html" as const,
      name: "Static HTML",
      description: "Complete HTML website with all assets",
      icon: FileText,
      color: "blue",
      features: ["SEO Optimized", "Responsive", "Fast Loading"],
    },
    {
      id: "nextjs" as const,
      name: "Next.js App",
      description: "React/Next.js application with components",
      icon: Code,
      color: "green",
      features: ["React Components", "Server-Side Rendering", "Modern Stack"],
    },
    {
      id: "pdf" as const,
      name: "PDF Document",
      description: "High-quality PDF for printing or sharing",
      icon: FilePdf,
      color: "red",
      features: ["Print Ready", "High Quality", "Portable"],
    },
    {
      id: "image" as const,
      name: "Image Export",
      description: "PNG or JPG image of your portfolio",
      icon: Image,
      color: "purple",
      features: ["High Resolution", "Multiple Formats", "Social Ready"],
    },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Get the preview element
      const previewElement = document.querySelector(
        "[data-preview]",
      ) as HTMLElement;
      if (!previewElement) {
        throw new Error("Preview element not found");
      }

      let result;
      switch (selectedType) {
        case "html":
          result = await exporter.exportHTML(previewElement, options);
          break;
        case "nextjs":
          result = await exporter.exportNextJS(previewElement, options);
          break;
        case "pdf":
          result = await exporter.exportPDF(previewElement, options);
          break;
        case "image":
          result = await exporter.exportImage(previewElement, options);
          break;
        default:
          throw new Error("Invalid export type");
      }

      clearInterval(progressInterval);
      setExportProgress(100);

      if (result.success && result.downloadUrl) {
        const extension =
          selectedType === "html"
            ? "html"
            : selectedType === "nextjs"
              ? "jsx"
              : selectedType === "pdf"
                ? "pdf"
                : "png";
        const filename = `portfolio-${Date.now()}.${extension}`;
        downloadFile(result.downloadUrl, filename);
      } else {
        throw new Error(result.error || "Export failed");
      }
    } catch (error) {
      console.error("Export failed:", error);
      // Handle error
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleTypeChange = (type: ExportType) => {
    setSelectedType(type);
    setOptions(exportPresets[type]);
  };

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Download className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Export Portfolio
                </h2>
                <p className="text-sm text-gray-600">
                  Choose your export format and options
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex h-[600px]">
            {/* Export Types */}
            <div className="w-1/3 border-r border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Export Format</h3>
              <div className="space-y-3">
                {exportTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;

                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeChange(type.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? "bg-blue-100" : "bg-gray-100"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              isSelected ? "text-blue-600" : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {type.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {type.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {type.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Export Options */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Export Options</h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <Settings className="w-4 h-4" />
                  <span>Advanced</span>
                  {showAdvanced ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality
                  </label>
                  <select
                    value={options.quality}
                    onChange={(e) =>
                      handleOptionChange("quality", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low (Fast)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="high">High (Quality)</option>
                    <option value="ultra">Ultra (Best)</option>
                  </select>
                </div>

                {/* Format (for image exports) */}
                {selectedType === "image" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format
                    </label>
                    <select
                      value={options.format}
                      onChange={(e) =>
                        handleOptionChange("format", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="png">PNG</option>
                      <option value="jpg">JPG</option>
                      <option value="webp">WebP</option>
                      <option value="svg">SVG</option>
                    </select>
                  </div>
                )}

                {/* Advanced Options */}
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="includeAssets"
                            checked={options.includeAssets}
                            onChange={(e) =>
                              handleOptionChange(
                                "includeAssets",
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="includeAssets"
                            className="text-sm text-gray-700"
                          >
                            Include Assets
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="optimizeImages"
                            checked={options.optimizeImages}
                            onChange={(e) =>
                              handleOptionChange(
                                "optimizeImages",
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="optimizeImages"
                            className="text-sm text-gray-700"
                          >
                            Optimize Images
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="minifyCode"
                            checked={options.minifyCode}
                            onChange={(e) =>
                              handleOptionChange("minifyCode", e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="minifyCode"
                            className="text-sm text-gray-700"
                          >
                            Minify Code
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="seoOptimized"
                            checked={options.seoOptimized}
                            onChange={(e) =>
                              handleOptionChange(
                                "seoOptimized",
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="seoOptimized"
                            className="text-sm text-gray-700"
                          >
                            SEO Optimized
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="responsive"
                            checked={options.responsive}
                            onChange={(e) =>
                              handleOptionChange("responsive", e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="responsive"
                            className="text-sm text-gray-700"
                          >
                            Responsive
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="analytics"
                            checked={options.analytics}
                            onChange={(e) =>
                              handleOptionChange("analytics", e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="analytics"
                            className="text-sm text-gray-700"
                          >
                            Analytics
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Export Progress */}
                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Exporting...</span>
                      <span className="text-gray-900">{exportProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Current viewport: {state.deviceViewport.name} (
              {state.deviceViewport.width}×{state.deviceViewport.height})
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? "Exporting..." : "Export"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportPanel;
