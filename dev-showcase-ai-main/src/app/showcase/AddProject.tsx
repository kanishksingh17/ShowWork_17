import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Users,
  FolderOpen,
  Zap,
  Settings,
  LogOut,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Code,
  Image,
  Upload,
  Plus,
  X,
  Star,
  Eye,
  Play,
  Mic,
  FileText,
  Search,
  Lightbulb,
  TrendingUp,
  Save,
  Github,
  ExternalLink,
  Tag,
  Calendar,
  Target,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Technology, MediaFile, CodeQualityMetrics } from "@/types/project";
import { CreateProjectRequestSchema } from "@/lib/validation/projectSchema";
import TechnologySelector from "@/components/project/TechnologySelector";
import MediaUploader from "@/components/media/MediaUploader";
import CodeQualityWidget from "@/components/project/CodeQualityWidget";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useCodeQuality } from "@/hooks/useCodeQuality";

export default function AddProject() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    longDescription: "",
    category: "Web Development",
    status: "draft" as "draft" | "in-progress" | "completed" | "archived",
    visibility: "private" as "public" | "private" | "unlisted",
    githubUrl: "",
    liveUrl: "",
    tags: [] as string[],
  });
  const [selectedTechnologies, setSelectedTechnologies] = useState<
    Technology[]
  >([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [codeQualityMetrics, setCodeQualityMetrics] =
    useState<CodeQualityMetrics | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");

  // Custom hooks
  const mediaUpload = useMediaUpload({
    projectId: "temp-project-id",
    userId: "current-user-id",
    onFilesUploaded: setMediaFiles,
    onError: (error) => setErrors((prev) => ({ ...prev, media: error })),
  });

  const codeQuality = useCodeQuality({
    onError: (error) => setErrors((prev) => ({ ...prev, codeQuality: error })),
    onSuccess: setCodeQualityMetrics,
  });

  // Auto-save to localStorage
  useEffect(() => {
    const draftData = {
      formData,
      selectedTechnologies,
      mediaFiles,
      codeQualityMetrics,
      currentStep,
    };
    localStorage.setItem("project-draft", JSON.stringify(draftData));
  }, [
    formData,
    selectedTechnologies,
    mediaFiles,
    codeQualityMetrics,
    currentStep,
  ]);

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem("project-draft");
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft.formData || formData);
        setSelectedTechnologies(draft.selectedTechnologies || []);
        setMediaFiles(draft.mediaFiles || []);
        setCodeQualityMetrics(draft.codeQualityMetrics || null);
        setCurrentStep(draft.currentStep || 1);
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("showcase-projects");
    localStorage.removeItem("project-draft");
    navigate("/login");
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string> = {};

      switch (step) {
        case 1:
          if (!formData.name.trim()) {
            newErrors.name = "Project name is required";
          }
          if (!formData.description.trim()) {
            newErrors.description = "Project description is required";
          }
          if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
            newErrors.githubUrl = "Please enter a valid GitHub URL";
          }
          if (formData.liveUrl && !isValidUrl(formData.liveUrl)) {
            newErrors.liveUrl = "Please enter a valid URL";
          }
          break;
        case 2:
          if (selectedTechnologies.length === 0) {
            newErrors.technologies = "Please select at least one technology";
          }
          break;
        case 3:
          // Media upload is optional
          break;
        case 4:
          // Code quality is optional
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData, selectedTechnologies],
  );

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  }, [tagInput, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleAddProject = async () => {
    if (!validateStep(currentStep)) return;

    setIsSaving(true);
    try {
      // Validate final form data
      const validationResult = CreateProjectRequestSchema.safeParse({
        name: formData.name,
        description: formData.description,
        longDescription: formData.longDescription,
        category: formData.category,
        status: formData.status,
        visibility: formData.visibility,
        technologies: selectedTechnologies,
        githubUrl: formData.githubUrl || undefined,
        liveUrl: formData.liveUrl || undefined,
        tags: formData.tags,
      });

      if (!validationResult.success) {
        setErrors(
          validationResult.error.errors.reduce(
            (acc, error) => {
              acc[error.path[0] as string] = error.message;
              return acc;
            },
            {} as Record<string, string>,
          ),
        );
        return;
      }

      // Create project object
      const project = {
        id: `project-${Date.now()}`,
        ...validationResult.data,
        media: {
          images: mediaFiles.filter((f) => f.category === "images"),
          videos: mediaFiles.filter((f) => f.category === "videos"),
          audio: mediaFiles.filter((f) => f.category === "audio"),
          documents: mediaFiles.filter((f) => f.category === "documents"),
        },
        codeQuality: codeQualityMetrics || {
          overallScore: 0,
          testCoverage: 0,
          openIssues: 0,
          criticalBugs: 0,
          complexity: "medium" as const,
          lastCommit: new Date(),
          contributors: 0,
          dependencies: { outdated: 0, vulnerable: 0 },
          languages: [],
          insights: [],
        },
        teamMembers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        likes: 0,
        userId: "current-user-id",
      };

      // Save to localStorage (in real app, this would be an API call)
      const existingProjects = JSON.parse(
        localStorage.getItem("showcase-projects") || "[]",
      );
      existingProjects.push(project);
      localStorage.setItem(
        "showcase-projects",
        JSON.stringify(existingProjects),
      );

      // Clear draft
      localStorage.removeItem("project-draft");

      // Navigate to showcase
      navigate("/showcase");
    } catch (error) {
      console.error("Failed to create project:", error);
      setErrors({ general: "Failed to create project. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  // Step components
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-600">Tasks Completed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-red-600">Bugs Found</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-green-600">Code Quality</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
                className={cn(errors.name && "border-red-500")}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Desktop Application">Desktop Application</option>
                <option value="Data Science">Data Science</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="DevOps">DevOps</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your project..."
              rows={4}
              className={cn(errors.description && "border-red-500")}
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <Textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              placeholder="Provide more details about your project..."
              rows={6}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.longDescription.length}/5000 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Github className="w-4 h-4 inline mr-1" />
                GitHub URL
              </label>
              <Input
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
                className={cn(errors.githubUrl && "border-red-500")}
              />
              {errors.githubUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.githubUrl}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ExternalLink className="w-4 h-4 inline mr-1" />
                Live URL
              </label>
              <Input
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleInputChange}
                placeholder="https://your-project.com"
                className={cn(errors.liveUrl && "border-red-500")}
              />
              {errors.liveUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.liveUrl}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Project Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button onClick={addTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <TechnologySelector
      selectedTechnologies={selectedTechnologies}
      onTechnologiesChange={setSelectedTechnologies}
      onError={(error) =>
        setErrors((prev) => ({ ...prev, technologies: error }))
      }
    />
  );

  const renderStep3 = () => (
    <MediaUploader
      projectId="temp-project-id"
      onFilesUploaded={setMediaFiles}
      onError={(error) => setErrors((prev) => ({ ...prev, media: error }))}
    />
  );

  const renderStep4 = () => (
    <CodeQualityWidget
      githubUrl={formData.githubUrl}
      metrics={codeQualityMetrics}
      onAnalyze={codeQuality.analyzeRepository}
      onError={(error) =>
        setErrors((prev) => ({ ...prev, codeQuality: error }))
      }
    />
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      {/* Project Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Project Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Project Information
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {formData.name}
                </div>
                <div>
                  <span className="font-medium">Category:</span>{" "}
                  {formData.category}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {formData.status}
                </div>
                <div>
                  <span className="font-medium">Visibility:</span>{" "}
                  {formData.visibility}
                </div>
                <div>
                  <span className="font-medium">Description:</span>{" "}
                  {formData.description}
                </div>
                {formData.githubUrl && (
                  <div>
                    <span className="font-medium">GitHub:</span>{" "}
                    {formData.githubUrl}
                  </div>
                )}
                {formData.liveUrl && (
                  <div>
                    <span className="font-medium">Live URL:</span>{" "}
                    {formData.liveUrl}
                  </div>
                )}
                {formData.tags.length > 0 && (
                  <div>
                    <span className="font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Technologies ({selectedTechnologies.length})
              </h4>
              <div className="space-y-2">
                {selectedTechnologies.map((tech) => (
                  <div
                    key={tech.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{tech.name}</span>
                    <Badge variant="outline">{tech.proficiency}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {mediaFiles.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Media Files ({mediaFiles.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {mediaFiles.map((file) => (
                  <div key={file.id} className="text-sm text-gray-600">
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {codeQualityMetrics && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Code Quality</h4>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  Overall Score:{" "}
                  <span className="font-medium">
                    {codeQualityMetrics.overallScore}/100
                  </span>
                </div>
                <div>
                  Open Issues:{" "}
                  <span className="font-medium">
                    {codeQualityMetrics.openIssues}
                  </span>
                </div>
                <div>
                  Contributors:{" "}
                  <span className="font-medium">
                    {codeQualityMetrics.contributors}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ready to Submit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Ready to Submit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Project information completed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Technology stack selected</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Media files uploaded</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Code quality analyzed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Main render
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white flex flex-col rounded-xl shadow-lg m-4">
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
          <div className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200">
            <Zap className="w-5 h-5 mr-3" />
            Integrations
          </div>
        </nav>

        <div className="px-4 py-2 border-t border-white/10">
          <div className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm text-gray-500 mb-1">
                <button
                  onClick={() => navigate("/showcase")}
                  className="hover:text-gray-700"
                >
                  Showcase
                </button>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Add Project</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Project
              </h1>
              <p className="text-sm text-gray-500">Step {currentStep} of 5</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  localStorage.setItem(
                    "project-draft",
                    JSON.stringify({
                      formData,
                      selectedTechnologies,
                      mediaFiles,
                      codeQualityMetrics,
                      currentStep,
                    }),
                  )
                }
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Step Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        step <= currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600",
                      )}
                    >
                      {step}
                    </div>
                    {step < 5 && (
                      <div
                        className={cn(
                          "w-16 h-1 mx-2",
                          step < currentStep ? "bg-blue-600" : "bg-gray-200",
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Project Info</span>
                <span>Tech Stack</span>
                <span>Media</span>
                <span>Code Quality</span>
                <span>Submit</span>
              </div>
            </div>

            {/* Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Step Content */}
            <div className="mb-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {currentStep < 5 ? (
                  <Button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddProject}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Add Project
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
