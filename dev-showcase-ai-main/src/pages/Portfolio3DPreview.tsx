import React, { useState, useRef, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Stats,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Settings,
  Download,
  Share2,
  Eye,
  Zap,
  Monitor,
  Smartphone,
  Tablet,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize,
  Minimize,
  Camera,
  Video,
  Palette,
  Layers,
  Box,
  Globe,
  Sparkles,
} from "lucide-react";

// 3D Components
import { ProfessionalHero3D } from "../components/3D/Professional3DComponents";
import { InteractiveProjectShowcase } from "../components/3D/Professional3DComponents";
import { SkillsVisualization } from "../components/3D/Professional3DComponents";

interface SceneConfig {
  performance: "high" | "medium" | "low";
  device: "desktop" | "tablet" | "mobile";
  showStats: boolean;
  showGrid: boolean;
  showAxes: boolean;
  autoRotate: boolean;
  enableShadows: boolean;
  enablePostProcessing: boolean;
  backgroundColor: string;
  lighting: "studio" | "outdoor" | "neon" | "warm";
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

interface ScenePreset {
  id: string;
  name: string;
  description: string;
  config: Partial<SceneConfig>;
  thumbnail: string;
}

const scenePresets: ScenePreset[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean, corporate-friendly 3D scene",
    config: {
      performance: "high",
      lighting: "studio",
      backgroundColor: "#f8fafc",
      autoRotate: false,
      enableShadows: true,
    },
    thumbnail: "🎯",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Dynamic, artistic 3D showcase",
    config: {
      performance: "medium",
      lighting: "neon",
      backgroundColor: "#0f0f23",
      autoRotate: true,
      enableShadows: true,
      enablePostProcessing: true,
    },
    thumbnail: "🎨",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Simple, elegant 3D presentation",
    config: {
      performance: "high",
      lighting: "warm",
      backgroundColor: "#ffffff",
      autoRotate: false,
      enableShadows: false,
    },
    thumbnail: "✨",
  },
  {
    id: "tech",
    name: "Tech Showcase",
    description: "Futuristic, high-tech 3D environment",
    config: {
      performance: "medium",
      lighting: "neon",
      backgroundColor: "#000000",
      autoRotate: true,
      enableShadows: true,
      enablePostProcessing: true,
    },
    thumbnail: "🚀",
  },
];

export default function Portfolio3DPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [sceneConfig, setSceneConfig] = useState<SceneConfig>({
    performance: "high",
    device: "desktop",
    showStats: false,
    showGrid: false,
    showAxes: false,
    autoRotate: false,
    enableShadows: true,
    enablePostProcessing: false,
    backgroundColor: "#f8fafc",
    lighting: "studio",
    cameraPosition: [5, 5, 5],
    cameraTarget: [0, 0, 0],
  });

  const [activePreset, setActivePreset] = useState("professional");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeScene, setActiveScene] = useState<
    "hero" | "projects" | "skills"
  >("hero");
  const [isLoading, setIsLoading] = useState(true);

  // Get portfolio data from navigation
  const portfolioData = location.state?.portfolio || {
    name: "John Doe",
    title: "Senior Software Engineer",
    bio: "Passionate developer with 5+ years of experience",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Full-stack e-commerce solution",
        technologies: ["React", "Node.js", "MongoDB"],
      },
      {
        name: "AI Chatbot",
        description: "Intelligent customer service bot",
        technologies: ["Python", "TensorFlow", "FastAPI"],
      },
    ],
  };

  const handlePresetChange = (presetId: string) => {
    const preset = scenePresets.find((p) => p.id === presetId);
    if (preset) {
      setSceneConfig((prev) => ({ ...prev, ...preset.config }));
      setActivePreset(presetId);
    }
  };

  const handleConfigChange = (key: keyof SceneConfig, value: any) => {
    setSceneConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleScreenshot = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement("a");
      link.download = `portfolio-3d-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleExportScene = () => {
    const sceneData = {
      config: sceneConfig,
      portfolio: portfolioData,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(sceneData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-3d-scene-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${portfolioData.name} - 3D Portfolio`,
        text: "Check out my interactive 3D portfolio!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  };

  const renderScene = () => {
    switch (activeScene) {
      case "hero":
        return (
          <ProfessionalHero3D
            title={portfolioData.name}
            subtitle={portfolioData.title}
            ctaText="View Portfolio"
            background="particles"
            performance={sceneConfig.performance}
          />
        );
      case "projects":
        return (
          <InteractiveProjectShowcase
            projects={portfolioData.projects.map((project, index) => ({
              id: `project-${index}`,
              name: project.name,
              description: project.description,
              technologies: project.technologies,
              image: project.image,
            }))}
            onProjectSelect={(project) =>
              console.log("Selected project:", project)
            }
          />
        );
      case "skills":
        return (
          <SkillsVisualization
            skills={portfolioData.skills.map((skill, index) => ({
              name: skill,
              level: Math.floor(Math.random() * 100) + 1,
              category: "Technical",
            }))}
            type="network"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/portfolio")}
              className="flex items-center space-x-2 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Button>

            <div>
              <h1 className="text-xl font-semibold text-white">
                3D Portfolio Preview
              </h1>
              <p className="text-sm text-gray-400">
                {portfolioData.name} - Interactive 3D Showcase
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Scene Selector */}
            <div className="flex items-center space-x-2">
              <Button
                variant={activeScene === "hero" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveScene("hero")}
                className="text-xs"
              >
                Hero
              </Button>
              <Button
                variant={activeScene === "projects" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveScene("projects")}
                className="text-xs"
              >
                Projects
              </Button>
              <Button
                variant={activeScene === "skills" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveScene("skills")}
                className="text-xs"
              >
                Skills
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleScreenshot}
                className="flex items-center space-x-1 text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                <Camera className="w-3 h-3" />
                <span>Screenshot</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportScene}
                className="flex items-center space-x-1 text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-1 text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                <Share2 className="w-3 h-3" />
                <span>Share</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleFullscreen}
                className="flex items-center space-x-1 text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                {isFullscreen ? (
                  <Minimize className="w-3 h-3" />
                ) : (
                  <Maximize className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas
            ref={canvasRef}
            style={{ background: sceneConfig.backgroundColor }}
            dpr={sceneConfig.performance === "high" ? [1, 2] : 1}
            performance={{ min: 0.5 }}
            gl={{
              antialias: sceneConfig.performance !== "low",
              alpha: true,
              powerPreference:
                sceneConfig.performance === "high"
                  ? "high-performance"
                  : "default",
            }}
          >
            <Suspense fallback={null}>
              {/* Camera */}
              <PerspectiveCamera
                makeDefault
                position={sceneConfig.cameraPosition}
                fov={75}
                near={0.1}
                far={1000}
              />

              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow={sceneConfig.enableShadows}
              />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />

              {/* Environment */}
              <Environment preset={sceneConfig.lighting} />

              {/* Controls */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={sceneConfig.autoRotate}
                autoRotateSpeed={1}
                target={sceneConfig.cameraTarget}
                minDistance={2}
                maxDistance={20}
              />

              {/* Grid */}
              {sceneConfig.showGrid && (
                <gridHelper args={[20, 20, "#666666", "#333333"]} />
              )}

              {/* Axes */}
              {sceneConfig.showAxes && <axesHelper args={[5]} />}

              {/* Main Scene */}
              {renderScene()}

              {/* Stats */}
              {sceneConfig.showStats && <Stats />}
            </Suspense>
          </Canvas>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-white">Loading 3D Scene...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls Panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Scene Presets */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">
                    Scene Presets
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {scenePresets.map((preset) => (
                      <Button
                        key={preset.id}
                        variant={
                          activePreset === preset.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePresetChange(preset.id)}
                        className="flex flex-col items-center space-y-1 h-16 text-xs"
                      >
                        <span className="text-lg">{preset.thumbnail}</span>
                        <span>{preset.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Performance Settings */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">
                    Performance
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Quality
                      </label>
                      <div className="flex space-x-2">
                        {(["low", "medium", "high"] as const).map((level) => (
                          <Button
                            key={level}
                            variant={
                              sceneConfig.performance === level
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleConfigChange("performance", level)
                            }
                            className="flex-1 text-xs capitalize"
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Device
                      </label>
                      <div className="flex space-x-2">
                        <Button
                          variant={
                            sceneConfig.device === "desktop"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleConfigChange("device", "desktop")
                          }
                          className="flex-1"
                        >
                          <Monitor className="w-3 h-3" />
                        </Button>
                        <Button
                          variant={
                            sceneConfig.device === "tablet"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleConfigChange("device", "tablet")}
                          className="flex-1"
                        >
                          <Tablet className="w-3 h-3" />
                        </Button>
                        <Button
                          variant={
                            sceneConfig.device === "mobile"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleConfigChange("device", "mobile")}
                          className="flex-1"
                        >
                          <Smartphone className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Settings */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">
                    Visual Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">
                        Auto Rotate
                      </label>
                      <Button
                        variant={sceneConfig.autoRotate ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          handleConfigChange(
                            "autoRotate",
                            !sceneConfig.autoRotate,
                          )
                        }
                        className="w-12"
                      >
                        {sceneConfig.autoRotate ? "ON" : "OFF"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">Shadows</label>
                      <Button
                        variant={
                          sceneConfig.enableShadows ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleConfigChange(
                            "enableShadows",
                            !sceneConfig.enableShadows,
                          )
                        }
                        className="w-12"
                      >
                        {sceneConfig.enableShadows ? "ON" : "OFF"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">
                        Post Processing
                      </label>
                      <Button
                        variant={
                          sceneConfig.enablePostProcessing
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleConfigChange(
                            "enablePostProcessing",
                            !sceneConfig.enablePostProcessing,
                          )
                        }
                        className="w-12"
                      >
                        {sceneConfig.enablePostProcessing ? "ON" : "OFF"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">
                        Show Stats
                      </label>
                      <Button
                        variant={sceneConfig.showStats ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          handleConfigChange(
                            "showStats",
                            !sceneConfig.showStats,
                          )
                        }
                        className="w-12"
                      >
                        {sceneConfig.showStats ? "ON" : "OFF"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lighting */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">
                    Lighting
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(["studio", "outdoor", "neon", "warm"] as const).map(
                      (lighting) => (
                        <Button
                          key={lighting}
                          variant={
                            sceneConfig.lighting === lighting
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleConfigChange("lighting", lighting)
                          }
                          className="text-xs capitalize"
                        >
                          {lighting}
                        </Button>
                      ),
                    )}
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">
                    Background
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {["#f8fafc", "#ffffff", "#000000", "#0f0f23"].map(
                      (color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded border-2 ${
                            sceneConfig.backgroundColor === color
                              ? "border-white"
                              : "border-gray-600"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            handleConfigChange("backgroundColor", color)
                          }
                        />
                      ),
                    )}
                  </div>
                </div>

                {/* Portfolio Info */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">
                    Portfolio Info
                  </h3>
                  <div className="space-y-2 text-xs text-gray-400">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {portfolioData.name}
                    </div>
                    <div>
                      <span className="font-medium">Title:</span>{" "}
                      {portfolioData.title}
                    </div>
                    <div>
                      <span className="font-medium">Skills:</span>{" "}
                      {portfolioData.skills.length}
                    </div>
                    <div>
                      <span className="font-medium">Projects:</span>{" "}
                      {portfolioData.projects.length}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Controls */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowControls(!showControls)}
        className="absolute top-20 right-4 z-10 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
}
