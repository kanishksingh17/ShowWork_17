import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Brain,
  Monitor,
  Smartphone,
  Search,
  Plus,
  Edit3,
  RefreshCw,
  Link,
  Upload,
  Save,
  Undo,
  Redo,
  Eye,
  Code,
  Palette,
  Settings,
  Zap,
  ArrowLeft,
  ArrowRight,
  Send,
  Bot,
  Wand2,
  Lightbulb,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  Heart,
  Share2,
  Download,
  Copy,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  Square,
  Box,
  Users,
  FileText,
  Paperclip,
  Image,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedSidebar } from "../components/UnifiedSidebar";
import ManualProjectForm from "../components/ManualProjectForm";
import { useGitHubAnalysis } from "../hooks/useGitHubAnalysis";
import { User } from "lucide-react";

interface AIAssistant {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
}

interface ChatMessage {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
}

interface Command {
  id: string;
  name: string;
  description: string;
  shortcut: string;
  icon: React.ReactNode;
  action: () => void;
}

interface ProjectData {
  name: string;
  description: string;
  category: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  tags: string[];
  status: string;
  visibility: string;
}

export default function EnhancedProjectCreation() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState("ai-assistant");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // GitHub analysis hook
  const { isAnalyzing, analysis, error, analyzeRepository, clearAnalysis } =
    useGitHubAnalysis();

  // Handle GitHub analysis results
  useEffect(() => {
    if (analysis) {
      // Update project data with GitHub analysis results
      setProjectData((prev) => ({
        ...prev,
        name: analysis.repo.name,
        description: analysis.description || analysis.repo.description || "",
        technologies: analysis.techStack,
        githubUrl: analysis.repo.html_url,
      }));

      // Add AI message about the analysis
      const analysisMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "ai",
        content: `🎉 Repository analysis complete! I found:\n\n**${analysis.repo.name}**\n${analysis.description || analysis.repo.description || "No description available"}\n\n**Tech Stack:** ${analysis.techStack.join(", ")}\n**Primary Language:** ${analysis.analysis.primaryLanguage}\n**Stars:** ${analysis.stats.stars} | **Forks:** ${analysis.stats.forks}\n\nI've automatically filled in your project details!`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, analysisMessage]);
    }
  }, [analysis]);
  const [aiAssistant, setAiAssistant] = useState<AIAssistant>({
    id: "sparky",
    name: "Sparky",
    avatar: "🤖",
    isActive: true,
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "👋 Hey there! Ready to add your new project? What's the project name?",
      timestamp: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    description: "",
    category: "Web Development",
    technologies: [],
    githubUrl: "",
    liveUrl: "",
    tags: [],
    status: "Draft",
    visibility: "Public",
  });

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, newMessage]);

    // Enhanced AI response logic
    let aiResponse = "";
    const input = chatInput.toLowerCase();

    // Check for GitHub URL and analyze if found
    const githubUrlMatch = input.match(/github\.com\/[^\s]+/);

    if (githubUrlMatch) {
      const githubUrl = githubUrlMatch[0];
      const fullUrl = githubUrl.startsWith("http")
        ? githubUrl
        : `https://${githubUrl}`;

      setProjectData((prev) => ({ ...prev, githubUrl: fullUrl }));

      // Analyze the GitHub repository
      try {
        await analyzeRepository(fullUrl);
        aiResponse =
          "🔍 Analyzing your GitHub repository... This will help me understand your project better!";
      } catch (error) {
        aiResponse =
          "⚠️ I couldn't access that repository. Make sure it's public or you have the correct URL.";
      }
    } else if (input.includes("github")) {
      aiResponse =
        "🔗 Great! I've detected a GitHub link. Let me analyze your repository...";
      setProjectData((prev) => ({ ...prev, githubUrl: chatInput }));
    } else if (
      input.includes("tech") ||
      input.includes("stack") ||
      input.includes("react") ||
      input.includes("vue") ||
      input.includes("angular") ||
      input.includes("javascript") ||
      input.includes("typescript") ||
      input.includes("node") ||
      input.includes("next")
    ) {
      aiResponse =
        "⚡ Nice tech stack! I've added those technologies to your project.";
      // Extract technologies from the input
      const techKeywords = [
        "react",
        "typescript",
        "javascript",
        "node",
        "next.js",
        "html",
        "css",
        "vue",
        "angular",
        "python",
        "java",
        "php",
      ];
      const foundTechs = techKeywords.filter((tech) => input.includes(tech));
      if (foundTechs.length > 0) {
        setProjectData((prev) => ({
          ...prev,
          technologies: [...new Set([...prev.technologies, ...foundTechs])],
        }));
      }
    } else if (
      input.includes("showwork") ||
      input.includes("project") ||
      input.includes("app") ||
      input.includes("application")
    ) {
      aiResponse = `✨ Got it! "${chatInput}" - tell me more about your project.`;
      if (!projectData.name) {
        setProjectData((prev) => ({ ...prev, name: chatInput }));
      }
      // If it's a description, update description
      if (
        input.includes("basically") ||
        input.includes("description") ||
        input.includes("about")
      ) {
        setProjectData((prev) => ({ ...prev, description: chatInput }));
      }
    } else {
      aiResponse = `✨ Got it! "${chatInput}" - tell me more about your project.`;
      if (!projectData.name) {
        setProjectData((prev) => ({ ...prev, name: chatInput }));
      }
    }

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: aiResponse,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, aiMessage]);
    setChatInput("");
  };

  const commands: Command[] = [
    {
      id: "publish",
      name: "Publish Project",
      description: "Publish your project to the showcase",
      shortcut: "⌘P",
      icon: <Upload className="w-4 h-4" />,
      action: () => console.log("Publishing project..."),
    },
    {
      id: "upload-media",
      name: "Upload Media",
      description: "Add images and videos to your project",
      shortcut: "⌘U",
      icon: <Upload className="w-4 h-4" />,
      action: () => console.log("Opening media upload..."),
    },
    {
      id: "generate-seo",
      name: "Generate SEO Tags",
      description: "Auto-generate SEO metadata",
      shortcut: "⌘S",
      icon: <Settings className="w-4 h-4" />,
      action: () => console.log("Generating SEO tags..."),
    },
    {
      id: "preview",
      name: "Toggle Preview",
      description: "Switch between desktop and mobile view",
      shortcut: "⌘M",
      icon: <Monitor className="w-4 h-4" />,
      action: () =>
        setPreviewMode((prev) => (prev === "desktop" ? "mobile" : "desktop")),
    },
  ];

  const filteredCommands = commands.filter(
    (command) =>
      command.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      command.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "k":
            e.preventDefault();
            setCommandPaletteOpen(true);
            break;
          case "p":
            e.preventDefault();
            console.log("Publishing project...");
            break;
          case "s":
            e.preventDefault();
            console.log("Saving project...");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar currentPage="showcase" />

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">
                Showcase / Add New Project
              </p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Add New Project
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span>Draft saved automatically</span>
                <span className="mx-1">•</span>
                <button className="hover:underline">Version History</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Undo className="w-4 h-4" />
                Undo
              </Button>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <span>Publish</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Left Column - Chat Interface & AI Summary */}
            <div className="flex-1">
              {/* Sparky Chat Interface */}
              <div className="relative flex flex-col max-w-3xl w-full mx-auto mb-4">
                {/* Main Chat Container */}
                <div className="relative flex flex-col bg-gradient-to-b from-[#1B2B50] to-[#0F1A33] rounded-2xl p-1.5 overflow-hidden shadow-2xl">
                  {/* Glow Effect */}
                  <div className="absolute -top-2.5 -left-2.5 w-8 h-8 bg-gradient-radial from-[#3B82F6] via-[#3B82F6]/30 to-transparent rounded-full blur-sm pointer-events-none" />

                  {/* Chat Input Area */}
                  <div className="flex flex-col bg-[#24345A]/80 backdrop-blur-sm rounded-2xl w-full overflow-hidden border border-[#3B82F6]/20">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-[#3B82F6]/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center border border-[#3B82F6]/30">
                          <Bot className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#E4E9F7]">
                            Sparky
                          </h3>
                          <p className="text-sm text-[#A0AEC0]">AI Assistant</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#3B82F6]/20 rounded-full flex items-center justify-center border border-[#3B82F6]/30">
                          <div className="w-2 h-2 bg-[#3B82F6] rounded-full"></div>
                        </div>
                        <div className="w-6 h-6 bg-[#24345A]/50 rounded-full flex items-center justify-center border border-[#3B82F6]/20">
                          <X className="w-3 h-3 text-[#A0AEC0]" />
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-3 space-y-3 max-h-48 overflow-y-auto">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-2 rounded-lg ${
                              message.type === "ai"
                                ? "bg-[#24345A]/60 border border-[#3B82F6]/20"
                                : "bg-[#3B82F6] border border-[#3B82F6]/30"
                            }`}
                          >
                            <p className="text-xs text-[#E4E9F7]">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input Area */}
                    <div className="flex relative">
                      <textarea
                        placeholder="Describe your project... ✦˚"
                        className="w-full h-10 bg-[#24345A]/60 border border-[#3B82F6]/30 rounded-2xl text-[#E4E9F7] text-xs font-normal p-2 resize-none outline-none placeholder:text-[#A0AEC0] placeholder:transition-all placeholder:duration-300 focus:placeholder:text-[#E4E9F7] focus:border-[#3B82F6] focus:bg-[#24345A]/80 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3B82F6] scrollbar-thumb-rounded-md hover:scrollbar-thumb-[#3B82F6]/80"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          handleSendMessage()
                        }
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "#3B82F6 transparent",
                        }}
                      />
                    </div>

                    {/* Options Row */}
                    <div className="flex justify-between items-end p-2">
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="flex text-[#A0AEC0] bg-transparent border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-[#3B82F6]"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="flex text-[#A0AEC0] bg-transparent border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-[#3B82F6]"
                        >
                          <Image className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="flex text-[#A0AEC0] bg-transparent border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-[#3B82F6]"
                        >
                          <Globe className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        className="flex p-0.5 bg-gradient-to-t from-[#243B6B] to-[#1B2B50] rounded-xl shadow-[inset_0_6px_2px_-4px_rgba(59,130,246,0.3)] cursor-pointer border border-[#3B82F6]/30 outline-none transition-all duration-150 hover:scale-105 hover:shadow-[0_0_8px_#3B82F6] active:scale-95"
                      >
                        <div className="w-7 h-7 p-1 bg-[#3B82F6]/20 rounded-xl backdrop-blur-sm text-[#3B82F6] flex items-center justify-center">
                          <Send className="w-3.5 h-3.5 transition-all duration-300 hover:text-[#E4E9F7] hover:drop-shadow-[0_0_5px_#3B82F6] focus:text-[#E4E9F7] focus:drop-shadow-[0_0_5px_#3B82F6] focus:scale-110 focus:rotate-45 focus:translate-x-[-2px] focus:translate-y-[1px]" />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Manual Form Option */}
                  <div className="mt-3 pt-3 border-t border-[#3B82F6]/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#A0AEC0]">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="text-xs">
                          Prefer to fill out manually?
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log("Navigating to manual form from chat...");
                          navigate("/showcase/manual-add");
                        }}
                        className="bg-[#1A233B] border-[#3B82F6]/30 text-[#E4E9F7] hover:bg-[#24345A] hover:border-[#3B82F6] hover:text-[#E4E9F7] text-xs px-2 py-1 transition-all duration-200"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" />
                        Manual Form
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Action Tags */}
                <div className="mt-2 flex gap-1 text-[#E4E9F7] text-xs">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-[#243B6B] to-[#1B2B50] border border-[#3B82F6]/30 rounded-xl cursor-pointer hover:from-[#2A4A7A] hover:to-[#243B6B] hover:border-[#3B82F6] hover:shadow-[0_0_8px_#3B82F6] transition-all duration-200 text-xs font-medium">
                    Create Project
                  </span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-[#243B6B] to-[#1B2B50] border border-[#3B82F6]/30 rounded-xl cursor-pointer hover:from-[#2A4A7A] hover:to-[#243B6B] hover:border-[#3B82F6] hover:shadow-[0_0_8px_#3B82F6] transition-all duration-200 text-xs font-medium">
                    Analyze Code
                  </span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-[#243B6B] to-[#1B2B50] border border-[#3B82F6]/30 rounded-xl cursor-pointer hover:from-[#2A4A7A] hover:to-[#243B6B] hover:border-[#3B82F6] hover:shadow-[0_0_8px_#3B82F6] transition-all duration-200 text-xs font-medium">
                    More Options
                  </span>
                </div>
              </div>

              {/* AI Summary & Quick Edits */}
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    AI Summary & Quick Edits
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Code className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">Tech Stack</span>
                      </div>
                      <div className="space-y-2">
                        {projectData.technologies.length > 0 ? (
                          projectData.technologies
                            .slice(0, 3)
                            .map((tech, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                              >
                                <span className="text-sm">{tech}</span>
                                <Edit3 className="w-4 h-4 text-gray-400" />
                              </div>
                            ))
                        ) : (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-500">
                              {isAnalyzing
                                ? "Analyzing repository..."
                                : "No technologies detected"}
                            </span>
                            {isAnalyzing && (
                              <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse" />
                            )}
                          </div>
                        )}
                        {projectData.technologies.length > 3 && (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-500">
                              +{projectData.technologies.length - 3} more
                              technologies
                            </span>
                            <Edit3 className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <FileText className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm font-medium">Description</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm">
                            {projectData.description ||
                              "No description available"}
                          </span>
                          <Edit3 className="w-4 h-4 text-gray-400" />
                        </div>
                        {!projectData.description && (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-500">
                              {isAnalyzing
                                ? "Analyzing repository..."
                                : "No description available"}
                            </span>
                            {isAnalyzing && (
                              <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Link className="w-3 h-3 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium">Demo</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm">
                            {projectData.githubUrl ? (
                              <a
                                href={projectData.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {projectData.githubUrl}
                              </a>
                            ) : (
                              "Add demo URL"
                            )}
                          </span>
                          <Edit3 className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Live Preview & Command Palette */}
            <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
              {/* Live Preview */}
              <div className="p-6">
                <Card className="shadow-lg border-0 mb-4">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        Live Preview
                      </h3>
                      <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-1">
                        <Button
                          variant={
                            previewMode === "desktop" ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => setPreviewMode("desktop")}
                          className="p-1"
                        >
                          <Monitor className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={
                            previewMode === "mobile" ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => setPreviewMode("mobile")}
                          className="p-1"
                        >
                          <Smartphone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 bg-white">
                    <div
                      className={`w-full bg-white rounded-lg overflow-hidden border border-gray-200 ${
                        previewMode === "mobile"
                          ? "aspect-[9/16] max-w-xs mx-auto"
                          : "aspect-[16/9]"
                      }`}
                    >
                      <div className="p-4">
                        {projectData.name ? (
                          <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900">
                              {projectData.name}
                            </h3>
                            {projectData.description && (
                              <p className="text-sm text-gray-600">
                                {projectData.description}
                              </p>
                            )}
                            {projectData.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {projectData.technologies.map((tech, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                            {projectData.githubUrl && (
                              <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Link className="w-4 h-4" />
                                <a
                                  href={projectData.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View on GitHub
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                            <div className="text-center text-gray-400 text-sm mt-4">
                              Start chatting to see your project preview
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Command Palette */}
              <div className="p-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Command Palette (.ttx)
                    </h3>
                  </CardHeader>
                  <CardContent className="p-4 bg-white">
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Type a command or search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          onFocus={() => setCommandPaletteOpen(true)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {filteredCommands.map((command) => (
                        <div
                          key={command.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          onClick={command.action}
                        >
                          <span className="text-sm font-medium text-gray-900">
                            {command.name}
                          </span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                            {command.shortcut}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
