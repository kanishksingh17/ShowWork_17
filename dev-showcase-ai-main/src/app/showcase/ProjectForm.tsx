import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Github,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  Eye,
  GitFork,
  Calendar,
  Code,
  Image,
  FileText,
  Tag,
  Plus,
  X,
  Save,
  Zap,
  Target,
  Package,
  BarChart3,
  Users,
  FolderOpen,
  Settings,
  LogOut,
  LayoutDashboard,
  Lock,
  Edit3,
  Archive,
  Play,
  Pause,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProjectData {
  id?: string;
  name: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  category: string;
  tags: string[];
  technologies: string[];
  status: "draft" | "in-progress" | "completed";
  visibility: "public" | "private" | "unlisted";
}

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
}

interface EditRestrictions {
  canEditBasicInfo: boolean;
  canEditTechnologies: boolean;
  canEditGitHub: boolean;
  canChangeStatus: boolean;
  canDelete: boolean;
  reason?: string;
}

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editRestrictions, setEditRestrictions] = useState<EditRestrictions>({
    canEditBasicInfo: true,
    canEditTechnologies: true,
    canEditGitHub: true,
    canChangeStatus: true,
    canDelete: true,
  });

  // Project data with auto-save
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    category: "Web Development",
    tags: [],
    technologies: [],
    status: "draft",
    visibility: "public",
  });

  // GitHub integration
  const [githubRepo, setGithubRepo] = useState<GitHubRepo | null>(null);
  const [githubLanguages, setGithubLanguages] = useState<
    Record<string, number>
  >({});
  const [isFetchingRepo, setIsFetchingRepo] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Load existing project for editing
  useEffect(() => {
    if (isEdit && id) {
      const loadExistingProject = () => {
        try {
          const savedProjects = localStorage.getItem("showcase-projects");
          if (savedProjects) {
            const projects = JSON.parse(savedProjects);
            const existingProject = projects.find((p: any) => p.id === id);

            if (existingProject) {
              setProjectData({
                id: existingProject.id,
                name: existingProject.name || "",
                description: existingProject.description || "",
                githubUrl: existingProject.githubUrl || "",
                liveUrl: existingProject.liveUrl || "",
                category: existingProject.category || "Web Development",
                tags: existingProject.tags || [],
                technologies: existingProject.technologies || [],
                status: existingProject.status || "draft",
                visibility: existingProject.visibility || "public",
              });

              // Load GitHub data if available
              if (existingProject.githubRepo) {
                setGithubRepo(existingProject.githubRepo);
              }
              if (existingProject.githubLanguages) {
                setGithubLanguages(existingProject.githubLanguages);
              }

              // Set edit restrictions based on status
              setEditRestrictions(getEditRestrictions(existingProject.status));
            }
          }
        } catch (error) {
          console.error("Failed to load project:", error);
          setErrors({ general: "Failed to load project data" });
        }
      };

      loadExistingProject();
    }
  }, [isEdit, id]);

  // Get edit restrictions based on project status
  const getEditRestrictions = (status: string): EditRestrictions => {
    switch (status) {
      case "completed":
        return {
          canEditBasicInfo: true,
          canEditTechnologies: false,
          canEditGitHub: false,
          canChangeStatus: true,
          canDelete: true,
          reason:
            "Completed projects: Can edit basic info and status, but not technical details",
        };
      case "in-progress":
        return {
          canEditBasicInfo: true,
          canEditTechnologies: true,
          canEditGitHub: true,
          canChangeStatus: true,
          canDelete: true,
          reason: "In-progress projects: Full editing allowed",
        };
      case "draft":
        return {
          canEditBasicInfo: true,
          canEditTechnologies: true,
          canEditGitHub: true,
          canChangeStatus: true,
          canDelete: true,
          reason: "Draft projects: Full editing allowed",
        };
      default:
        return {
          canEditBasicInfo: true,
          canEditTechnologies: true,
          canEditGitHub: true,
          canChangeStatus: true,
          canDelete: true,
        };
    }
  };

  // Auto-save to localStorage
  useEffect(() => {
    const draftData = {
      projectData,
      currentStep,
      githubRepo,
      githubLanguages,
      isEdit,
      editRestrictions,
    };
    localStorage.setItem("project-draft-unified", JSON.stringify(draftData));
  }, [
    projectData,
    currentStep,
    githubRepo,
    githubLanguages,
    isEdit,
    editRestrictions,
  ]);

  // Load draft from localStorage
  useEffect(() => {
    if (!isEdit) {
      const savedDraft = localStorage.getItem("project-draft-unified");
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (!draft.isEdit) {
            // Only load draft for new projects
            setProjectData(draft.projectData || projectData);
            setCurrentStep(draft.currentStep || 1);
            setGithubRepo(draft.githubRepo || null);
            setGithubLanguages(draft.githubLanguages || {});
          }
        } catch (error) {
          console.error("Failed to load draft:", error);
        }
      }
    }
  }, [isEdit]);

  // Extract GitHub repo info from URL
  const extractGitHubInfo = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(".git", ""),
      };
    }
    return null;
  };

  // Fetch GitHub repository data
  const fetchGitHubRepo = async (url: string) => {
    if (!editRestrictions.canEditGitHub) return;

    const repoInfo = extractGitHubInfo(url);
    if (!repoInfo) return;

    setIsFetchingRepo(true);
    try {
      // Fetch repo data
      const repoResponse = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`,
      );
      if (!repoResponse.ok) throw new Error("Repository not found");

      const repoData: GitHubRepo = await repoResponse.json();
      setGithubRepo(repoData);

      // Fetch languages
      const languagesResponse = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/languages`,
      );
      if (languagesResponse.ok) {
        const languages = await languagesResponse.json();
        setGithubLanguages(languages);

        // Auto-populate technologies from GitHub languages (only if allowed)
        if (editRestrictions.canEditTechnologies) {
          const techNames = Object.keys(languages);
          setProjectData((prev) => ({
            ...prev,
            technologies: [...new Set([...prev.technologies, ...techNames])],
          }));
        }
      }

      // Auto-populate project data from GitHub (only if allowed)
      if (editRestrictions.canEditBasicInfo) {
        setProjectData((prev) => ({
          ...prev,
          name: prev.name || repoData.name,
          description: prev.description || repoData.description || "",
          liveUrl: prev.liveUrl || repoData.homepage || "",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        github: "Failed to fetch repository data",
      }));
    } finally {
      setIsFetchingRepo(false);
    }
  };

  // Handle GitHub URL change
  const handleGitHubUrlChange = (url: string) => {
    if (!editRestrictions.canEditGitHub) return;

    setProjectData((prev) => ({ ...prev, githubUrl: url }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.github;
      return newErrors;
    });

    if (url && url.includes("github.com")) {
      fetchGitHubRepo(url);
    }
  };

  // Handle input changes with restrictions
  const handleInputChange = (field: keyof ProjectData, value: any) => {
    // Check if field can be edited
    if (
      field === "name" ||
      field === "description" ||
      field === "liveUrl" ||
      field === "category" ||
      field === "tags"
    ) {
      if (!editRestrictions.canEditBasicInfo) return;
    }
    if (field === "technologies") {
      if (!editRestrictions.canEditTechnologies) return;
    }
    if (field === "githubUrl") {
      if (!editRestrictions.canEditGitHub) return;
    }
    if (field === "status") {
      if (!editRestrictions.canChangeStatus) return;
    }

    setProjectData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Add tag
  const addTag = () => {
    if (!editRestrictions.canEditBasicInfo) return;

    const tag = tagInput.trim();
    if (tag && !projectData.tags.includes(tag)) {
      setProjectData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    if (!editRestrictions.canEditBasicInfo) return;

    setProjectData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Add technology
  const addTechnology = (tech: string) => {
    if (!editRestrictions.canEditTechnologies) return;

    if (tech && !projectData.technologies.includes(tech)) {
      setProjectData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tech],
      }));
    }
  };

  // Remove technology
  const removeTechnology = (techToRemove: string) => {
    if (!editRestrictions.canEditTechnologies) return;

    setProjectData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((tech) => tech !== techToRemove),
    }));
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!projectData.name.trim()) {
          newErrors.name = "Project name is required";
        }
        if (!projectData.description.trim()) {
          newErrors.description = "Project description is required";
        }
        break;
      case 2:
        if (projectData.technologies.length === 0) {
          newErrors.technologies = "Please select at least one technology";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Save project
  const handleSaveProject = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      const project = {
        id: isEdit ? projectData.id : `project-${Date.now()}`,
        ...projectData,
        githubRepo,
        githubLanguages,
        createdAt: isEdit
          ? new Date(projectData.id ? Date.now() - 86400000 : Date.now())
          : new Date(),
        updatedAt: new Date(),
        views: isEdit ? 0 : 0,
        likes: isEdit ? 0 : 0,
        userId: "current-user-id",
      };

      // Save to localStorage
      const existingProjects = JSON.parse(
        localStorage.getItem("showcase-projects") || "[]",
      );

      if (isEdit) {
        // Update existing project
        const projectIndex = existingProjects.findIndex(
          (p: any) => p.id === projectData.id,
        );
        if (projectIndex !== -1) {
          existingProjects[projectIndex] = project;
        }
      } else {
        // Add new project
        existingProjects.push(project);
      }

      localStorage.setItem(
        "showcase-projects",
        JSON.stringify(existingProjects),
      );

      // Clear draft
      localStorage.removeItem("project-draft-unified");

      // Navigate to showcase
      navigate("/showcase");
    } catch (error) {
      setErrors({ general: "Failed to save project. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete project
  const handleDeleteProject = () => {
    if (!editRestrictions.canDelete) return;

    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      const existingProjects = JSON.parse(
        localStorage.getItem("showcase-projects") || "[]",
      );
      const updatedProjects = existingProjects.filter(
        (p: any) => p.id !== projectData.id,
      );
      localStorage.setItem(
        "showcase-projects",
        JSON.stringify(updatedProjects),
      );
      navigate("/showcase");
    }
  };

  // Step 1: Project Information
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Edit Restrictions Notice */}
      {editRestrictions.reason && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-blue-800">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {editRestrictions.reason}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Project Information
            {!editRestrictions.canEditBasicInfo && (
              <Lock className="w-4 h-4 text-gray-400" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <Input
                value={projectData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter project name"
                className={cn(errors.name && "border-red-500")}
                disabled={!editRestrictions.canEditBasicInfo}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={projectData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!editRestrictions.canEditBasicInfo}
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
              value={projectData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your project..."
              rows={4}
              className={cn(errors.description && "border-red-500")}
              disabled={!editRestrictions.canEditBasicInfo}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Github className="w-4 h-4 inline mr-1" />
                GitHub URL
                {!editRestrictions.canEditGitHub && (
                  <Lock className="w-3 h-3 inline ml-1 text-gray-400" />
                )}
              </label>
              <Input
                value={projectData.githubUrl}
                onChange={(e) => handleGitHubUrlChange(e.target.value)}
                placeholder="https://github.com/username/repo"
                className={cn(errors.github && "border-red-500")}
                disabled={!editRestrictions.canEditGitHub}
              />
              {errors.github && (
                <p className="text-sm text-red-500 mt-1">{errors.github}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ExternalLink className="w-4 h-4 inline mr-1" />
                Live URL
              </label>
              <Input
                value={projectData.liveUrl}
                onChange={(e) => handleInputChange("liveUrl", e.target.value)}
                placeholder="https://your-project.com"
                disabled={!editRestrictions.canEditBasicInfo}
              />
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
                disabled={!editRestrictions.canEditBasicInfo}
              />
              <Button
                onClick={addTag}
                size="sm"
                disabled={!editRestrictions.canEditBasicInfo}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {projectData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-500"
                    disabled={!editRestrictions.canEditBasicInfo}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Status and Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
                {!editRestrictions.canChangeStatus && (
                  <Lock className="w-3 h-3 inline ml-1 text-gray-400" />
                )}
              </label>
              <select
                value={projectData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!editRestrictions.canChangeStatus}
              >
                <option value="draft">Draft</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                value={projectData.visibility}
                onChange={(e) =>
                  handleInputChange("visibility", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!editRestrictions.canEditBasicInfo}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GitHub Repository Info */}
      {githubRepo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Repository
              {isFetchingRepo && <Loader2 className="w-4 h-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{githubRepo.name}</h3>
                  <p className="text-gray-600">{githubRepo.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {githubRepo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    {githubRepo.forks_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {githubRepo.watchers_count}
                  </div>
                </div>
              </div>

              {Object.keys(githubLanguages).length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(githubLanguages).map(([lang, bytes]) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Step 2: Technologies
  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Technology Stack
            {!editRestrictions.canEditTechnologies && (
              <Lock className="w-4 h-4 text-gray-400" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto-suggested technologies from GitHub */}
          {Object.keys(githubLanguages).length > 0 &&
            editRestrictions.canEditTechnologies && (
              <div>
                <h4 className="font-medium mb-2">Suggested from GitHub</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(githubLanguages).map((lang) => (
                    <Button
                      key={lang}
                      variant="outline"
                      size="sm"
                      onClick={() => addTechnology(lang)}
                      disabled={projectData.technologies.includes(lang)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>
            )}

          {/* Popular technologies */}
          {editRestrictions.canEditTechnologies && (
            <div>
              <h4 className="font-medium mb-2">Popular Technologies</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "React",
                  "Vue.js",
                  "Angular",
                  "Node.js",
                  "Python",
                  "JavaScript",
                  "TypeScript",
                  "Java",
                  "C++",
                  "Go",
                  "Rust",
                  "PHP",
                  "Ruby",
                  "Swift",
                  "Kotlin",
                  "Dart",
                  "Flutter",
                  "React Native",
                ].map((tech) => (
                  <Button
                    key={tech}
                    variant="outline"
                    size="sm"
                    onClick={() => addTechnology(tech)}
                    disabled={projectData.technologies.includes(tech)}
                    className="justify-start"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {tech}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Selected technologies */}
          <div>
            <h4 className="font-medium mb-2">Selected Technologies</h4>
            {projectData.technologies.length === 0 ? (
              <p className="text-gray-500 text-sm">No technologies selected</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {projectData.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(tech)}
                      className="ml-1 hover:text-red-500"
                      disabled={!editRestrictions.canEditTechnologies}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {errors.technologies && (
              <p className="text-sm text-red-500 mt-1">{errors.technologies}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 3: Review & Submit
  const renderStep3 = () => (
    <div className="space-y-6">
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
                  <span className="font-medium">Name:</span> {projectData.name}
                </div>
                <div>
                  <span className="font-medium">Category:</span>{" "}
                  {projectData.category}
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge
                    variant={
                      projectData.status === "completed"
                        ? "default"
                        : "secondary"
                    }
                    className="ml-2"
                  >
                    {projectData.status}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Visibility:</span>{" "}
                  {projectData.visibility}
                </div>
                <div>
                  <span className="font-medium">Description:</span>{" "}
                  {projectData.description}
                </div>
                {projectData.githubUrl && (
                  <div>
                    <span className="font-medium">GitHub:</span>{" "}
                    {projectData.githubUrl}
                  </div>
                )}
                {projectData.liveUrl && (
                  <div>
                    <span className="font-medium">Live URL:</span>{" "}
                    {projectData.liveUrl}
                  </div>
                )}
                {projectData.tags.length > 0 && (
                  <div>
                    <span className="font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {projectData.tags.map((tag) => (
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
                Technologies ({projectData.technologies.length})
              </h4>
              <div className="space-y-2">
                {projectData.technologies.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{tech}</span>
                    <Badge variant="outline">Selected</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {githubRepo && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                GitHub Repository
              </h4>
              <div className="flex items-center justify-between text-sm">
                <span>{githubRepo.full_name}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {githubRepo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    {githubRepo.forks_count}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Ready to {isEdit ? "Update" : "Submit"}
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
            {githubRepo && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">GitHub repository connected</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
        </nav>

        <div className="px-4 py-2 border-t border-white/10">
          <div className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("project-draft-unified");
              navigate("/login");
            }}
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
                <span className="text-gray-900">
                  {isEdit ? "Edit Project" : "Add Project"}
                </span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? "Edit Project" : "Add New Project"}
              </h1>
              <p className="text-sm text-gray-500">Step {currentStep} of 3</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const draftData = {
                    projectData,
                    currentStep,
                    githubRepo,
                    githubLanguages,
                    isEdit,
                    editRestrictions,
                  };
                  localStorage.setItem(
                    "project-draft-unified",
                    JSON.stringify(draftData),
                  );
                }}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              {isEdit && editRestrictions.canDelete && (
                <Button
                  variant="outline"
                  onClick={handleDeleteProject}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Step Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
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
                    {step < 3 && (
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
                <span>Technologies</span>
                <span>Review</span>
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
                {currentStep < 3 ? (
                  <Button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSaveProject}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isEdit ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {isEdit ? "Update Project" : "Create Project"}
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
