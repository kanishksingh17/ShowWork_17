import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Users,
  FolderOpen,
  Zap,
  Settings,
  Plus,
  Edit3,
  Eye,
  CheckCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  LogOut,
  Search,
  Grid3X3,
  List,
  Download,
  Trash2,
  Star,
  Globe,
  Lock,
  EyeOff,
  Code,
  BarChart,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UnifiedSidebar } from "../components/UnifiedSidebar";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "draft" | "pending" | "published" | "in-progress" | "saved";
  lastUpdated: string;
  category: string;
  views?: number;
  submittedAt?: string;
  visibility?: "public" | "private" | "unlisted";
  tags?: string[];
  technologies?: string[];
  media?: any[];
  codeQualityScore?: number;
  likes?: number;
  githubUrl?: string;
  liveUrl?: string;
}

interface ShowcaseDashboardProps {
  onBackToDashboard?: () => void;
  onCreateProject?: () => void;
  onEditProject?: (projectId: string) => void;
}

const ShowcaseDashboard = ({
  onBackToDashboard,
  onCreateProject,
  onEditProject,
}: ShowcaseDashboardProps) => {
  // Props are available for future use
  console.log({ onBackToDashboard, onCreateProject, onEditProject });
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);

  // Determine current page based on route
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/analytics") return "analytics";
    if (path === "/community") return "community";
    if (path === "/dashboard") return "dashboard";
    if (path === "/showcase") return "showcase";
    return "showcase"; // default
  };

  const currentPage = getCurrentPage();

  // Sorting and filtering state
  const [sortField, setSortField] = useState<
    "name" | "lastUpdated" | "views" | "status" | "codeQualityScore" | "likes"
  >("lastUpdated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("showcase-projects");

    // Redirect to login page
    navigate("/login");
  };

  // Load projects from localStorage on component mount
  useEffect(() => {
    const loadProjects = () => {
      const storedProjects = localStorage.getItem("showcase-projects");
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        setProjects(parsedProjects);
        console.log("Loaded projects from localStorage:", parsedProjects);
      } else {
        // Create sample projects if none exist
        const sampleProjects: Project[] = [
          {
            id: "1",
            name: "E-commerce Platform",
            description: "A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.",
            status: "published",
            lastUpdated: "2024-01-15",
            category: "Web Development",
            views: 1250,
            submittedAt: "2024-01-10",
            visibility: "public",
            tags: ["ecommerce", "react", "nodejs", "mongodb"],
            technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
            codeQualityScore: 85,
            likes: 45,
            githubUrl: "https://github.com/example/ecommerce-platform",
            liveUrl: "https://ecommerce-demo.com"
          },
          {
            id: "2",
            name: "Portfolio Website",
            description: "A modern, responsive portfolio website showcasing my projects and skills. Built with Next.js and Tailwind CSS.",
            status: "published",
            lastUpdated: "2024-01-12",
            category: "Web Development",
            views: 890,
            submittedAt: "2024-01-08",
            visibility: "public",
            tags: ["portfolio", "nextjs", "tailwind", "responsive"],
            technologies: ["Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
            codeQualityScore: 92,
            likes: 32,
            githubUrl: "https://github.com/example/portfolio",
            liveUrl: "https://myportfolio.com"
          },
          {
            id: "3",
            name: "Task Management App",
            description: "A collaborative task management application with real-time updates, team collaboration features, and project tracking capabilities.",
            status: "published",
            lastUpdated: "2024-01-14",
            category: "Web Development",
            views: 2100,
            submittedAt: "2024-01-05",
            visibility: "public",
            tags: ["productivity", "collaboration", "realtime", "team"],
            technologies: ["Vue.js", "Socket.io", "PostgreSQL", "Redis"],
            codeQualityScore: 88,
            likes: 67,
            githubUrl: "https://github.com/example/task-manager",
            liveUrl: "https://taskmanager-demo.com"
          }
        ];
        
        setProjects(sampleProjects);
        localStorage.setItem("showcase-projects", JSON.stringify(sampleProjects));
        console.log("Created sample projects:", sampleProjects);
      }
    };

    loadProjects();

    // Listen for storage changes (when projects are added from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "showcase-projects") {
        loadProjects();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates by randomly updating view counts
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.status === "published" && Math.random() > 0.7) {
            return {
              ...project,
              views: (project.views || 0) + Math.floor(Math.random() * 5) + 1,
              lastUpdated: "Just now",
            };
          }
          return project;
        }),
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query) ||
          (project.tags &&
            project.tags.some((tag) => tag.toLowerCase().includes(query))) ||
          (project.technologies &&
            project.technologies.some((tech) =>
              tech.toLowerCase().includes(query),
            ));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all" && project.status !== statusFilter)
        return false;

      // Category filter
      if (categoryFilter !== "all" && project.category !== categoryFilter)
        return false;

      // Visibility filter
      if (visibilityFilter !== "all" && project.visibility !== visibilityFilter)
        return false;

      return true;
    });

    // Sort projects
    return filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "lastUpdated":
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        case "views":
          aValue = a.views || 0;
          bValue = b.views || 0;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "codeQualityScore":
          aValue = a.codeQualityScore || 0;
          bValue = b.codeQualityScore || 0;
          break;
        case "likes":
          aValue = a.likes || 0;
          bValue = b.likes || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [
    projects,
    searchQuery,
    statusFilter,
    categoryFilter,
    visibilityFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (
    field:
      | "name"
      | "lastUpdated"
      | "views"
      | "status"
      | "codeQualityScore"
      | "likes",
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId],
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredAndSortedProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredAndSortedProjects.map((p) => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedProjects.length === 0) return;

    const updatedProjects = projects.filter(
      (p) => !selectedProjects.includes(p.id),
    );
    setProjects(updatedProjects);
    localStorage.setItem("showcase-projects", JSON.stringify(updatedProjects));
    setSelectedProjects([]);
  };

  const handleBulkExport = () => {
    if (selectedProjects.length === 0) return;

    const selectedProjectsData = projects.filter((p) =>
      selectedProjects.includes(p.id),
    );
    const dataStr = JSON.stringify(selectedProjectsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "projects-export.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Reload projects from localStorage
    const storedProjects = localStorage.getItem("showcase-projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const savedProjects = filteredAndSortedProjects.filter(
    (p) => p.status === "draft",
  );
  const submittedProjects = filteredAndSortedProjects.filter(
    (p) => p.status !== "draft",
  );

  // Analytics data
  const analyticsData = useMemo(() => {
    const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalLikes = projects.reduce((sum, p) => sum + (p.likes || 0), 0);
    const avgCodeQuality =
      projects.length > 0
        ? projects.reduce((sum, p) => sum + (p.codeQualityScore || 0), 0) /
          projects.length
        : 0;

    const statusCounts = projects.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const categoryCounts = projects.reduce(
      (acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalViews,
      totalLikes,
      avgCodeQuality: Math.round(avgCodeQuality),
      statusCounts,
      categoryCounts,
      totalProjects: projects.length,
      publishedProjects: statusCounts.published || 0,
      draftProjects: statusCounts.draft || 0,
    };
  }, [projects]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge
            variant="secondary"
            className="bg-[#292e38] text-white hover:bg-[#3c4453]"
          >
            Draft
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10"
          >
            Pending Review
          </Badge>
        );
      case "published":
        return (
          <Badge
            variant="outline"
            className="border-[#10B981] text-[#10B981] bg-[#10B981]/10"
          >
            Published
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/10"
          >
            In Progress
          </Badge>
        );
      case "saved":
        return (
          <Badge
            variant="outline"
            className="border-[#6366F1] text-[#6366F1] bg-[#6366F1]/10"
          >
            Saved
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getVisibilityIcon = (visibility?: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="w-4 h-4 text-green-600" />;
      case "private":
        return <Lock className="w-4 h-4 text-gray-600" />;
      case "unlisted":
        return <EyeOff className="w-4 h-4 text-yellow-600" />;
      default:
        return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Unified Sidebar */}
      <UnifiedSidebar currentPage="showcase" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm text-gray-500 mb-1">
                <span>
                  {currentPage === "analytics"
                    ? "Analytics"
                    : currentPage === "community"
                      ? "Community"
                      : "Showcase"}
                </span>
                <span className="mx-2">/</span>
                <span className="text-gray-900">
                  {currentPage === "analytics"
                    ? "Dashboard"
                    : currentPage === "community"
                      ? "Community Hub"
                      : "My Projects"}
                </span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentPage === "analytics"
                  ? "Analytics Dashboard"
                  : currentPage === "community"
                    ? "Community Hub"
                    : "My Projects"}
              </h1>
              <p className="text-sm text-gray-500">
                {currentPage === "analytics"
                  ? "Track your project performance and insights"
                  : currentPage === "community"
                    ? "Connect with other developers and share your work"
                    : "Manage and showcase your portfolio projects"}
              </p>
            </div>
            {currentPage === "showcase" && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="flex items-center gap-2"
                >
                  <BarChart className="w-4 h-4" />
                  {showAnalytics ? "Hide Analytics" : "Show Analytics"}
                </Button>
                <Button
                  onClick={() => navigate("/showcase/quick-add")}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mr-2"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Add
                </Button>
                <Button
                  onClick={() => navigate("/showcase/add")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        {currentPage === "showcase" && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            {/* Debug Info */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Debug Info:</strong> Total projects: {projects.length} | 
                Filtered: {filteredAndSortedProjects.length} | 
                Status filter: {statusFilter} | 
                Category filter: {categoryFilter} | 
                Visibility filter: {visibilityFilter}
                {projects.length > 0 && (
                  <div className="mt-1">
                    Project statuses: {projects.map(p => p.status).join(", ")}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Web Development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                    <SelectItem value="Desktop App">Desktop App</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Machine Learning">
                      Machine Learning
                    </SelectItem>
                    <SelectItem value="Game Development">
                      Game Development
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {currentPage === "analytics" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Analytics Dashboard
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900">
                      Total Views
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">1,234</p>
                    <p className="text-xs text-blue-600">
                      +12% from last month
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-900">
                      Engagement Rate
                    </h3>
                    <p className="text-2xl font-bold text-green-600">85%</p>
                    <p className="text-xs text-green-600">
                      +5% from last month
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-900">
                      Active Projects
                    </h3>
                    <p className="text-2xl font-bold text-purple-600">12</p>
                    <p className="text-xs text-purple-600">3 new this week</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Performance Trends
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    Chart visualization coming soon...
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentPage === "community" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Community Hub
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
                    <h3 className="text-lg font-semibold mb-2">
                      Featured Projects
                    </h3>
                    <p className="text-sm opacity-90">
                      Discover amazing work from the community
                    </p>
                    <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                      Explore
                    </button>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-lg text-white">
                    <h3 className="text-lg font-semibold mb-2">
                      Developer Forums
                    </h3>
                    <p className="text-sm opacity-90">
                      Connect and discuss with fellow developers
                    </p>
                    <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                      Join Discussion
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        John Doe shared a new project
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      SM
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Sarah Miller commented on your project
                      </p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentPage === "showcase" && (
            <>
              {/* Analytics Section */}
              {showAnalytics && (
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Total Views
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {analyticsData.totalViews.toLocaleString()}
                            </p>
                          </div>
                          <Eye className="w-8 h-8 text-blue-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Total Likes
                            </p>
                            <p className="text-2xl font-bold text-red-600">
                              {analyticsData.totalLikes.toLocaleString()}
                            </p>
                          </div>
                          <Star className="w-8 h-8 text-red-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Avg Code Quality
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {analyticsData.avgCodeQuality}%
                            </p>
                          </div>
                          <Code className="w-8 h-8 text-green-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Published
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                              {analyticsData.publishedProjects}
                            </p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-purple-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="w-5 h-5" />
                          Projects by Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(analyticsData.statusCounts).map(
                            ([status, count]) => (
                              <div
                                key={status}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(status)}
                                  <span className="text-sm text-gray-600 capitalize">
                                    {status}
                                  </span>
                                </div>
                                <span className="text-sm font-medium">
                                  {count}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart className="w-5 h-5" />
                          Projects by Category
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(analyticsData.categoryCounts).map(
                            ([category, count]) => (
                              <div
                                key={category}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm text-gray-600">
                                  {category}
                                </span>
                                <span className="text-sm font-medium">
                                  {count}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Additional Filters */}
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="flex gap-2">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={visibilityFilter}
                        onValueChange={setVisibilityFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Visibility</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="unlisted">Unlisted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedProjects.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {selectedProjects.length} selected
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkExport}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkDelete}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Projects Display */}
              <div className="space-y-6">
                {/* All Projects */}
                {filteredAndSortedProjects.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-gray-900 text-2xl font-bold">
                        My Projects ({filteredAndSortedProjects.length})
                      </h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="text-sm"
                      >
                        {selectedProjects.length === filteredAndSortedProjects.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </div>

                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAndSortedProjects.map((project) => (
                          <Card
                            key={project.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedProjects.includes(
                                      project.id,
                                    )}
                                    onChange={() =>
                                      handleSelectProject(project.id)
                                    }
                                    className="rounded"
                                  />
                                  <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">
                                      {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      {project.category}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {getVisibilityIcon(project.visibility)}
                                  {getStatusBadge(project.status)}
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {project.description}
                              </p>

                              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                <div className="flex items-center gap-3">
                                  {project.views && (
                                    <span className="flex items-center gap-1">
                                      <Eye className="w-3 h-3" />
                                      {project.views}
                                    </span>
                                  )}
                                  {project.likes && (
                                    <span className="flex items-center gap-1">
                                      <Star className="w-3 h-3" />
                                      {project.likes}
                                    </span>
                                  )}
                                  {project.codeQualityScore && (
                                    <span className="flex items-center gap-1">
                                      <Code className="w-3 h-3" />
                                      {project.codeQualityScore}%
                                    </span>
                                  )}
                                </div>
                                <span>
                                  {new Date(
                                    project.lastUpdated,
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    navigate(
                                      `/showcase/create?draft=${project.id}`,
                                    )
                                  }
                                  className="flex-1"
                                >
                                  <Edit3 className="w-3 h-3 mr-1" />
                                  {project.status === "draft"
                                    ? "Continue"
                                    : "Edit"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/showcase/view/${project.id}`)
                                  }
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="px-6 py-4 text-left">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedProjects.length ===
                                      savedProjects.length &&
                                    savedProjects.length > 0
                                  }
                                  onChange={handleSelectAll}
                                  className="rounded"
                                />
                              </th>
                              <th
                                className="px-6 py-4 text-left text-gray-900 text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("name")}
                              >
                                <div className="flex items-center gap-2">
                                  Project
                                  {sortField === "name" &&
                                    (sortDirection === "asc" ? (
                                      <ArrowUp className="w-4 h-4" />
                                    ) : (
                                      <ArrowDown className="w-4 h-4" />
                                    ))}
                                  {sortField !== "name" && (
                                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </th>
                              <th className="px-6 py-4 text-left text-gray-900 text-sm font-medium">
                                Description
                              </th>
                              <th
                                className="px-6 py-4 text-left text-gray-900 text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("status")}
                              >
                                <div className="flex items-center gap-2">
                                  Status
                                  {sortField === "status" &&
                                    (sortDirection === "asc" ? (
                                      <ArrowUp className="w-4 h-4" />
                                    ) : (
                                      <ArrowDown className="w-4 h-4" />
                                    ))}
                                  {sortField !== "status" && (
                                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </th>
                              <th className="px-6 py-4 text-left text-gray-500 text-sm font-medium">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAndSortedProjects.map((project) => (
                              <tr
                                key={project.id}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedProjects.includes(
                                      project.id,
                                    )}
                                    onChange={() =>
                                      handleSelectProject(project.id)
                                    }
                                    className="rounded"
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    {getVisibilityIcon(project.visibility)}
                                    <div>
                                      <div className="text-gray-900 font-medium">
                                        {project.name}
                                      </div>
                                      <div className="text-gray-500 text-sm">
                                        {project.category}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm max-w-md">
                                  {project.description}
                                </td>
                                <td className="px-6 py-4">
                                  {getStatusBadge(project.status)}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/showcase/create?draft=${project.id}`,
                                        )
                                      }
                                      className="text-[#1E3A8A] hover:text-[#1D4ED8] font-medium text-sm transition-colors flex items-center gap-2"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                      {project.status === "draft"
                                        ? "Continue"
                                        : "Edit"}
                                    </button>
                                    <button
                                      onClick={() =>
                                        navigate(`/showcase/view/${project.id}`)
                                      }
                                      className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors flex items-center gap-2"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Published Projects */}
                {filteredAndSortedProjects.filter(p => p.status === 'published').length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-gray-900 text-2xl font-bold">
                        Published Projects ({filteredAndSortedProjects.filter(p => p.status === 'published').length})
                      </h2>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <RefreshCw
                            className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                          />
                          Refresh
                        </Button>
                      </div>
                    </div>

                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAndSortedProjects.filter(p => p.status === 'published').map((project) => (
                          <Card
                            key={project.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedProjects.includes(
                                      project.id,
                                    )}
                                    onChange={() =>
                                      handleSelectProject(project.id)
                                    }
                                    className="rounded"
                                  />
                                  <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">
                                      {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      {project.category}
                                    </p>
                                    {project.submittedAt && (
                                      <p className="text-xs text-gray-400">
                                        Submitted {project.submittedAt}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {getVisibilityIcon(project.visibility)}
                                  {getStatusBadge(project.status)}
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {project.description}
                              </p>

                              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                <div className="flex items-center gap-3">
                                  {project.views && (
                                    <span className="flex items-center gap-1">
                                      <Eye className="w-3 h-3" />
                                      {project.views.toLocaleString()}
                                    </span>
                                  )}
                                  {project.likes && (
                                    <span className="flex items-center gap-1">
                                      <Star className="w-3 h-3" />
                                      {project.likes}
                                    </span>
                                  )}
                                  {project.codeQualityScore && (
                                    <span className="flex items-center gap-1">
                                      <Code className="w-3 h-3" />
                                      {project.codeQualityScore}%
                                    </span>
                                  )}
                                </div>
                                <span>
                                  {new Date(
                                    project.lastUpdated,
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/showcase/view/${project.id}`)
                                  }
                                  className="flex-1"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    navigate(
                                      `/showcase/create?draft=${project.id}`,
                                    )
                                  }
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="px-6 py-4 text-left">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedProjects.length ===
                                      submittedProjects.length &&
                                    submittedProjects.length > 0
                                  }
                                  onChange={() =>
                                    setSelectedProjects(
                                      submittedProjects.map((p) => p.id),
                                    )
                                  }
                                  className="rounded"
                                />
                              </th>
                              <th
                                className="px-6 py-4 text-left text-gray-900 text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("name")}
                              >
                                <div className="flex items-center gap-2">
                                  Project
                                  {sortField === "name" &&
                                    (sortDirection === "asc" ? (
                                      <ArrowUp className="w-4 h-4" />
                                    ) : (
                                      <ArrowDown className="w-4 h-4" />
                                    ))}
                                  {sortField !== "name" && (
                                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </th>
                              <th className="px-6 py-4 text-left text-gray-900 text-sm font-medium">
                                Description
                              </th>
                              <th
                                className="px-6 py-4 text-left text-gray-900 text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("status")}
                              >
                                <div className="flex items-center gap-2">
                                  Status
                                  {sortField === "status" &&
                                    (sortDirection === "asc" ? (
                                      <ArrowUp className="w-4 h-4" />
                                    ) : (
                                      <ArrowDown className="w-4 h-4" />
                                    ))}
                                  {sortField !== "status" && (
                                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </th>
                              <th
                                className="px-6 py-4 text-left text-gray-900 text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("views")}
                              >
                                <div className="flex items-center gap-2">
                                  Views
                                  {sortField === "views" &&
                                    (sortDirection === "asc" ? (
                                      <ArrowUp className="w-4 h-4" />
                                    ) : (
                                      <ArrowDown className="w-4 h-4" />
                                    ))}
                                  {sortField !== "views" && (
                                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </th>
                              <th className="px-6 py-4 text-left text-gray-500 text-sm font-medium">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAndSortedProjects.filter(p => p.status === 'published').map((project) => (
                              <tr
                                key={project.id}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedProjects.includes(
                                      project.id,
                                    )}
                                    onChange={() =>
                                      handleSelectProject(project.id)
                                    }
                                    className="rounded"
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    {getVisibilityIcon(project.visibility)}
                                    <div>
                                      <div className="text-gray-900 font-medium">
                                        {project.name}
                                      </div>
                                      <div className="text-gray-500 text-sm">
                                        {project.category}
                                      </div>
                                      {project.submittedAt && (
                                        <div className="text-gray-500 text-xs mt-1">
                                          Submitted {project.submittedAt}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm max-w-md">
                                  {project.description}
                                </td>
                                <td className="px-6 py-4">
                                  {getStatusBadge(project.status)}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-gray-500 text-sm">
                                    {project.views ? (
                                      <span className="text-gray-900 font-medium">
                                        {project.views.toLocaleString()}
                                      </span>
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        navigate(`/showcase/view/${project.id}`)
                                      }
                                      className="text-[#1E3A8A] hover:text-[#1D4ED8] font-medium text-sm transition-colors flex items-center gap-2"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View
                                    </button>
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/showcase/create?draft=${project.id}`,
                                        )
                                      }
                                      className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors flex items-center gap-2"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                      Edit
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty State */}
                {filteredAndSortedProjects.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No projects found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery ||
                        statusFilter !== "all" ||
                        categoryFilter !== "all" ||
                        visibilityFilter !== "all"
                          ? "Try adjusting your filters or search terms."
                          : "Get started by creating your first project."}
                      </p>
                      <Button onClick={() => navigate("/showcase/add")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShowcaseDashboard;
