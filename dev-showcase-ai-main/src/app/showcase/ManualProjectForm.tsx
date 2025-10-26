import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Users,
  FolderOpen,
  Settings,
  LogOut,
  CheckCircle,
  Info,
  Image,
  Code,
  Zap,
  Group,
  Cloud,
  Upload,
  X,
  Plus,
  UserPlus,
  Search,
  Monitor,
  Smartphone,
  Github,
  Sparkles,
  Bot,
  ArrowLeft,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import MediaUploader from "@/components/media/MediaUploader";
import { MediaFile } from "@/types/project";

interface ProjectFormData {
  name: string;
  description: string;
  githubUrl: string;
  techStack: string;
  features: string[];
  teamMembers: string[];
}

// MediaFile interface is now imported from @/types/project

export default function ManualProjectForm() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    githubUrl: "",
    techStack: "",
    features: [],
    teamMembers: [],
  });
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [newTeamMember, setNewTeamMember] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; delay: number }>
  >([]);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const sections = [
    { id: "project-info", label: "Project Info", icon: Info },
    { id: "media-demo", label: "Media & Demo", icon: Image },
    { id: "tech-stack", label: "Tech Stack", icon: Code },
    { id: "features", label: "Features", icon: Zap },
    { id: "team", label: "Team", icon: Group },
  ];

  // Enhanced auto-save functionality with immediate save on changes
  useEffect(() => {
    const autoSave = () => {
      const draftData = {
        formData,
        mediaFiles,
        currentSection,
        completedSections,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("manual-project-draft", JSON.stringify(draftData));
    };

    // Save immediately on any change
    autoSave();

    // Also save periodically as backup
    const interval = setInterval(autoSave, 3000);
    return () => clearInterval(interval);
  }, [formData, mediaFiles, currentSection, completedSections]);

  // Load draft on mount with enhanced restoration
  useEffect(() => {
    const savedDraft = localStorage.getItem("manual-project-draft");
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft.formData || formData);
        setMediaFiles(draft.mediaFiles || []);
        setCurrentSection(draft.currentSection || 0);
        setCompletedSections(draft.completedSections || []);

        // Show a subtle notification that draft was restored
        if (draft.timestamp) {
          const draftAge =
            new Date().getTime() - new Date(draft.timestamp).getTime();
          const hoursAgo = Math.floor(draftAge / (1000 * 60 * 60));
          if (hoursAgo > 0) {
            console.log(`Draft restored from ${hoursAgo} hour(s) ago`);
          }
        }
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  // Manual save function for immediate persistence
  const saveDraft = () => {
    const draftData = {
      formData,
      mediaFiles,
      currentSection,
      completedSections,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("manual-project-draft", JSON.stringify(draftData));
  };

  const handleInputChange = (
    field: keyof ProjectFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Save immediately on any input change
    setTimeout(() => saveDraft(), 100);

    // Remove auto-advance logic to prevent unwanted jumping between sections
    // Users can manually navigate between sections using the step buttons
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");

      // Save immediately after adding feature
      setTimeout(() => saveDraft(), 100);

      // Create particle effect
      createParticleBurst(300, 150);
    }
  };

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
    // Save immediately after removing feature
    setTimeout(() => saveDraft(), 100);
  };

  const addTeamMember = () => {
    if (
      newTeamMember.trim() &&
      !formData.teamMembers.includes(newTeamMember.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newTeamMember.trim()],
      }));
      setNewTeamMember("");

      // Save immediately after adding team member
      setTimeout(() => saveDraft(), 100);

      // Create particle effect
      createParticleBurst(350, 180);
    }
  };

  const removeTeamMember = (member: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((m) => m !== member),
    }));
    // Save immediately after removing team member
    setTimeout(() => saveDraft(), 100);
  };

  const handleMediaUpload = (files: MediaFile[]) => {
    setMediaFiles(files);
    // Save immediately after adding media files
    setTimeout(() => saveDraft(), 100);

    // Create particle effect on upload
    createParticleBurst(400, 200);
  };

  const removeMediaFile = (id: string) => {
    setMediaFiles((prev) => prev.filter((f) => f.id !== id));
    // Save immediately after removing media file
    setTimeout(() => saveDraft(), 100);
  };

  const createParticleBurst = (x: number, y: number) => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      x,
      y,
      delay: i * 50,
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id)),
      );
    }, 1000);
  };

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setIsAnimating(true);
      setCompletedSections((prev) => [...prev, currentSection]);
      setCurrentSection((prev) => prev + 1);

      // Create particle burst effect
      setTimeout(() => {
        createParticleBurst(200, 100);
        setIsAnimating(false);
      }, 300);
    } else {
      setShowPublishModal(true);
    }
  };

  const handlePublish = () => {
    // Save project to localStorage
    const project = {
      id: `project-${Date.now()}`,
      ...formData,
      mediaFiles,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existingProjects = JSON.parse(
      localStorage.getItem("showcase-projects") || "[]",
    );
    existingProjects.push(project);
    localStorage.setItem("showcase-projects", JSON.stringify(existingProjects));

    // Clear draft
    localStorage.removeItem("manual-project-draft");

    // Navigate to showcase
    navigate("/showcase");
  };

  const goToSection = (sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < sections.length) {
      setCurrentSection(sectionIndex);
      // Save the navigation change
      setTimeout(() => saveDraft(), 100);
    }
  };

  const renderStepper = () => (
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className="relative flex-1 text-center cursor-pointer"
          onClick={() => goToSection(index)}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-all duration-500 relative z-10 hover:scale-110",
              completedSections.includes(index)
                ? "bg-green-500 text-white shadow-lg shadow-green-500/50 animate-bounce"
                : index === currentSection
                  ? "bg-blue-500 text-white animate-pulse shadow-lg shadow-blue-500/30"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600",
            )}
          >
            {completedSections.includes(index) ? (
              <CheckCircle className="w-5 h-5 animate-pulse" />
            ) : (
              <section.icon className="w-5 h-5" />
            )}
          </div>
          <p
            className={cn(
              "text-xs mt-2 transition-colors duration-300",
              completedSections.includes(index)
                ? "text-primary font-semibold"
                : index === currentSection
                  ? "text-primary font-medium"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
            )}
          >
            {section.label}
          </p>
          {index < sections.length - 1 && (
            <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10">
              {completedSections.includes(index) && (
                <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full animate-pulse" />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderProjectInfo = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl">Project Info</h3>
      <div className="relative">
        <Input
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="peer"
          placeholder=" "
        />
        <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">
          Project Name *
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">
          Project Description (Markdown Supported)
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Write your project description using Markdown..."
          rows={8}
          className="font-mono text-sm"
        />
        <div className="flex justify-end text-xs text-gray-500 mt-1">
          <FileText className="w-4 h-4 mr-1" />
          Markdown support
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Github className="w-6 h-6 text-gray-400" />
        </div>
        <Input
          value={formData.githubUrl}
          onChange={(e) => handleInputChange("githubUrl", e.target.value)}
          className="pl-12 pr-20"
          placeholder=" "
        />
        <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-10">
          GitHub URL
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-0 pr-3"
        >
          Scrape
        </Button>
      </div>
    </div>
  );

  const renderMediaDemo = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl">Media & Demo</h3>
      <MediaUploader
        projectId="manual-project-form"
        onFilesUploaded={handleMediaUpload}
        onError={(error) => console.error("Media upload error:", error)}
        maxFiles={10}
        maxFileSize={100}
        allowedTypes={["image/*", "video/*", "audio/*", "application/pdf"]}
        className="w-full"
      />
    </div>
  );

  const renderTechStack = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl">Tech Stack</h3>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">
          List technologies (one per line, supports JSON/YAML)
        </label>
        <Textarea
          value={formData.techStack}
          onChange={(e) => handleInputChange("techStack", e.target.value)}
          placeholder='Example:
- React
- TailwindCSS
Or JSON: {"frontend": ["React", "Vue"]}'
          rows={10}
          className="bg-gray-900 text-green-300 font-mono text-sm border border-gray-700"
        />
        <div className="flex justify-end text-xs text-gray-500 mt-1">
          <Code className="w-4 h-4 mr-1" />
          Inline Code Editor
        </div>
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl">Features</h3>
      <div className="space-y-4">
        {formData.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={true}
              readOnly
              className="h-5 w-5 text-primary rounded-md"
            />
            <label className="text-base">{feature}</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFeature(feature)}
              className="text-gray-500 hover:text-red-500 ml-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <div className="relative">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder=" "
            className="peer"
          />
          <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">
            Add new feature...
          </label>
          <Button
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 pr-3"
            onClick={addFeature}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl">Team</h3>
      <div className="space-y-4">
        {formData.teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium">
                {member.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{member}</p>
              <p className="text-xs text-gray-500">Team Member</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeTeamMember(member)}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <div className="relative">
          <Input
            value={newTeamMember}
            onChange={(e) => setNewTeamMember(e.target.value)}
            placeholder=" "
            className="peer"
          />
          <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">
            Add team member by email...
          </label>
          <Button
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 pr-3"
            onClick={addTeamMember}
          >
            <UserPlus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl">SEO & Settings</h3>
      <div className="relative">
        <Input
          value={formData.customUrl}
          onChange={(e) => handleInputChange("customUrl", e.target.value)}
          placeholder=" "
          className="peer"
        />
        <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">
          Custom URL (Optional)
        </label>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-base">Enable Comments</label>
        <input
          type="checkbox"
          checked={formData.commentsEnabled}
          onChange={(e) =>
            handleInputChange("commentsEnabled", e.target.checked)
          }
          className="relative peer h-6 w-11 cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-gray-700 outline-none transition-colors before:absolute before:left-1 before:top-1 before:h-4 before:w-4 before:rounded-full before:bg-white dark:before:bg-gray-400 before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-6 peer-checked:before:bg-white"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-base">Public Visibility</label>
        <input
          type="checkbox"
          checked={formData.publicVisibility}
          onChange={(e) =>
            handleInputChange("publicVisibility", e.target.checked)
          }
          className="relative peer h-6 w-11 cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-gray-700 outline-none transition-colors before:absolute before:left-1 before:top-1 before:h-4 before:w-4 before:rounded-full before:bg-white dark:before:bg-gray-400 before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-6 peer-checked:before:bg-white"
        />
      </div>
    </div>
  );

  const renderLivePreview = () => (
    <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-200/20 dark:border-gray-700/20 p-4 shadow-lg mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Live Preview</h3>
        <div className="flex items-center gap-1 bg-gray-200/50 dark:bg-gray-900/50 p-1 rounded-lg">
          <Button
            variant={previewMode === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPreviewMode("desktop")}
            className="p-1.5"
          >
            <Monitor className="w-5 h-5" />
          </Button>
          <Button
            variant={previewMode === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPreviewMode("mobile")}
            className="p-1.5"
          >
            <Smartphone className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700",
          previewMode === "mobile"
            ? "aspect-[9/16] max-w-xs mx-auto"
            : "aspect-[16/9]",
        )}
      >
        <div className="p-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse">
            {formData.name && (
              <span className="text-lg font-bold">{formData.name}</span>
            )}
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
        </div>
        <div className="px-4">
          <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  );

  const renderCommandPalette = () => (
    <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-200/20 dark:border-gray-700/20 p-4 shadow-lg flex-1 flex flex-col">
      <h3 className="font-semibold mb-3">
        Command Palette (
        <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          ⌘K
        </kbd>
        )
      </h3>
      <div className="relative mb-3">
        <Input placeholder="Type a command or search..." className="pl-10" />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 text-sm">
        {[
          { command: "Publish Project", shortcut: "⌘P" },
          { command: "Upload Media", shortcut: "⌘U" },
          { command: "Open Version History", shortcut: "⌘L" },
          { command: "Toggle Preview Mode", shortcut: "⌘M" },
          { command: "Scrape GitHub URL", shortcut: "⌘G" },
          { command: "Save Draft", shortcut: "⌘S" },
          { command: "Undo", shortcut: "⌘Z" },
          { command: "Redo", shortcut: "⌘⇧Z" },
          { command: "Add New Feature", shortcut: "⌘F" },
          { command: "Add Team Member", shortcut: "⌘T" },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <span>{item.command}</span>
            <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              {item.shortcut}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden gap-0">
      {/* Particle Effects */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none animate-ping"
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: `${particle.delay}ms`,
            animationDuration: "1s",
          }}
        />
      ))}
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white flex flex-col rounded-xl shadow-lg m-4 mr-0 flex-shrink-0">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-mono text-sm font-bold">
              &lt;/&gt;
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white">ShowWork</h1>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </div>
          <div className="flex items-center px-4 py-3 text-sm font-medium bg-blue-600 text-white rounded-lg shadow-sm">
            <Package className="w-5 h-5 mr-3" />
            Showcase
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/analytics")}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/community")}
          >
            <Users className="w-5 h-5 mr-3" />
            Community
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/portfolio")}
          >
            <FolderOpen className="w-5 h-5 mr-3" />
            Portfolio
          </div>
        </nav>

        <div className="px-4 py-2 border-t border-gray-700">
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/login")}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pl-2 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-2 flex flex-col h-full">
            {/* Header */}
            <header className="flex justify-between items-center mb-4 relative">
              <div>
                <div className="flex items-center gap-4 mb-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/showcase/add")}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to AI Assistant
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Showcase / Add New Project
                </p>
                <h2 className="text-3xl font-bold">Add New Project</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <Cloud className="w-4 h-4" />
                  <span>Draft saved automatically</span>
                  <span className="mx-1">•</span>
                  <button className="hover:underline">Version History</button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/showcase/add")}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Bot className="w-4 h-4" />
                  Try AI Assistant
                </Button>
                <Button
                  onClick={() => setShowPublishModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                >
                  <span>Publish Project</span>
                </Button>
              </div>
              <div className="absolute -top-8 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(currentSection / (sections.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </header>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                {renderStepper()}

                <div className="space-y-4">
                  {currentSection === 0 && renderProjectInfo()}
                  {currentSection === 1 && renderMediaDemo()}
                  {currentSection === 2 && renderTechStack()}
                  {currentSection === 3 && renderFeatures()}
                  {currentSection === 4 && renderTeam()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentSection((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentSection === 0}
                    className="flex items-center gap-2 px-6 py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Step {currentSection + 1} of {sections.length}
                    </span>
                  </div>

                  {currentSection < sections.length - 1 ? (
                    <Button
                      onClick={() =>
                        setCurrentSection((prev) =>
                          Math.min(prev + 1, sections.length - 1),
                        )
                      }
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowPublishModal(true)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Publish Project
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 lg:sticky top-8 self-start flex flex-col h-full">
            {renderLivePreview()}
            {renderCommandPalette()}
          </div>
        </div>
      </main>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300">
            <h3 className="text-xl font-bold text-center">Ready to Publish?</h3>
            <p className="text-center text-gray-500 mt-2">
              Let's double-check a few things first.
            </p>
            <ul className="space-y-3 mt-6">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Project Name & Description</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>At least one media file</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-orange-400" />
                <span>Tech stack added</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-gray-400" />
                <span>Custom URL (Optional)</span>
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              <Button
                onClick={handlePublish}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
              >
                Publish Now
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPublishModal(false)}
                className="w-full"
              >
                Continue Editing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
