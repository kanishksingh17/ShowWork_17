import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Share2,
  Download,
  Globe,
  Clock,
  Star,
  TrendingUp,
  Users,
  Calendar,
  MoreVertical,
  Copy,
  ExternalLink,
  Settings,
  Palette,
  Zap,
  Rocket,
  Cloud,
  CheckCircle,
  AlertCircle,
  Loader2,
  Heart,
  MessageCircle,
  BarChart3,
} from "lucide-react";

interface Portfolio {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  status: "draft" | "published" | "archived";
  visibility: "public" | "private" | "unlisted";
  createdAt: Date;
  updatedAt: Date;
  lastViewed?: Date;
  views: number;
  likes: number;
  comments: number;
  url?: string;
  customDomain?: string;
  performance: {
    pageSpeed: number;
    loadTime: number;
    bundleSize: number;
  };
  analytics: {
    totalViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
  tags: string[];
  template: string;
  isAI: boolean;
  is3D: boolean;
}

export default function MyPortfolios() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updated");
  const [isLoading, setIsLoading] = useState(true);

  // Mock portfolio data
  useEffect(() => {
    const mockPortfolios: Portfolio[] = [
      {
        id: "portfolio-1",
        name: "John Doe - Software Engineer",
        description:
          "Full-stack developer portfolio showcasing React, Node.js, and cloud technologies",
        thumbnail: "/thumbnails/portfolio-1.jpg",
        status: "published",
        visibility: "public",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20"),
        lastViewed: new Date("2024-01-21"),
        views: 1250,
        likes: 45,
        comments: 12,
        url: "https://johndoe-portfolio.vercel.app",
        customDomain: "https://johndoe.dev",
        performance: {
          pageSpeed: 95,
          loadTime: 1.2,
          bundleSize: 280,
        },
        analytics: {
          totalViews: 1250,
          uniqueVisitors: 890,
          bounceRate: 35,
          avgSessionDuration: 180,
        },
        tags: ["React", "TypeScript", "Node.js", "AWS"],
        template: "modern",
        isAI: true,
        is3D: false,
      },
      {
        id: "portfolio-2",
        name: "Creative Designer Portfolio",
        description: "Interactive 3D portfolio with immersive design showcase",
        thumbnail: "/thumbnails/portfolio-2.jpg",
        status: "published",
        visibility: "public",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-18"),
        lastViewed: new Date("2024-01-19"),
        views: 890,
        likes: 67,
        comments: 23,
        url: "https://creative-designer.vercel.app",
        performance: {
          pageSpeed: 88,
          loadTime: 1.5,
          bundleSize: 420,
        },
        analytics: {
          totalViews: 890,
          uniqueVisitors: 650,
          bounceRate: 28,
          avgSessionDuration: 240,
        },
        tags: ["3D", "Design", "Interactive", "Creative"],
        template: "creative",
        isAI: false,
        is3D: true,
      },
      {
        id: "portfolio-3",
        name: "Data Scientist Portfolio",
        description:
          "AI-powered portfolio showcasing machine learning projects and data visualizations",
        thumbnail: "/thumbnails/portfolio-3.jpg",
        status: "draft",
        visibility: "private",
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-19"),
        views: 0,
        likes: 0,
        comments: 0,
        performance: {
          pageSpeed: 92,
          loadTime: 1.1,
          bundleSize: 350,
        },
        analytics: {
          totalViews: 0,
          uniqueVisitors: 0,
          bounceRate: 0,
          avgSessionDuration: 0,
        },
        tags: ["Python", "Machine Learning", "Data Science", "AI"],
        template: "professional",
        isAI: true,
        is3D: false,
      },
      {
        id: "portfolio-4",
        name: "Mobile App Developer",
        description:
          "Cross-platform mobile development portfolio with live demos",
        thumbnail: "/thumbnails/portfolio-4.jpg",
        status: "published",
        visibility: "unlisted",
        createdAt: new Date("2024-01-08"),
        updatedAt: new Date("2024-01-16"),
        lastViewed: new Date("2024-01-17"),
        views: 450,
        likes: 23,
        comments: 8,
        url: "https://mobile-dev-portfolio.vercel.app",
        performance: {
          pageSpeed: 90,
          loadTime: 1.3,
          bundleSize: 320,
        },
        analytics: {
          totalViews: 450,
          uniqueVisitors: 320,
          bounceRate: 42,
          avgSessionDuration: 150,
        },
        tags: ["React Native", "Flutter", "iOS", "Android"],
        template: "mobile",
        isAI: false,
        is3D: false,
      },
    ];

    setTimeout(() => {
      setPortfolios(mockPortfolios);
      setFilteredPortfolios(mockPortfolios);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and search portfolios
  useEffect(() => {
    let filtered = portfolios;

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (portfolio) =>
          portfolio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          portfolio.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          portfolio.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply status filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(
        (portfolio) => portfolio.status === selectedFilter,
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "created":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "updated":
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case "views":
          return b.views - a.views;
        case "performance":
          return b.performance.pageSpeed - a.performance.pageSpeed;
        default:
          return 0;
      }
    });

    setFilteredPortfolios(filtered);
  }, [portfolios, searchQuery, selectedFilter, sortBy]);

  const handleCreatePortfolio = () => {
    navigate("/portfolio/generate");
  };

  const handleEditPortfolio = (portfolioId: string) => {
    navigate(`/portfolio/builder/${portfolioId}`);
  };

  const handleViewPortfolio = (portfolio: Portfolio) => {
    if (portfolio.url) {
      window.open(portfolio.url, "_blank");
    } else {
      navigate(`/p/${portfolio.id}`);
    }
  };

  const handlePreview3D = (portfolio: Portfolio) => {
    navigate("/portfolio/3d-preview", {
      state: {
        portfolio: {
          name: portfolio.name,
          title: "Portfolio Owner",
          bio: portfolio.description,
          skills: portfolio.tags,
          projects: [],
        },
      },
    });
  };

  const handleSharePortfolio = (portfolio: Portfolio) => {
    if (navigator.share && portfolio.url) {
      navigator.share({
        title: portfolio.name,
        text: portfolio.description,
        url: portfolio.url,
      });
    } else if (portfolio.url) {
      navigator.clipboard.writeText(portfolio.url);
      // Show toast notification
    }
  };

  const handleDeletePortfolio = (portfolioId: string) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== portfolioId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-600 bg-green-100";
      case "draft":
        return "text-yellow-600 bg-yellow-100";
      case "archived":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return Globe;
      case "private":
        return Settings;
      case "unlisted":
        return Eye;
      default:
        return Eye;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your portfolios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/portfolio")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Portfolios
              </h1>
              <p className="text-sm text-gray-500">
                Manage and organize your portfolio projects
              </p>
            </div>
          </div>

          <Button
            onClick={handleCreatePortfolio}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Create Portfolio</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Grid className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Portfolios</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {portfolios.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {portfolios.filter((p) => p.status === "published").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Views</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatNumber(
                      portfolios.reduce((sum, p) => sum + p.views, 0),
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Likes</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatNumber(
                      portfolios.reduce((sum, p) => sum + p.likes, 0),
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search portfolios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              {/* Status Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="updated">Last Updated</option>
                <option value="created">Date Created</option>
                <option value="name">Name</option>
                <option value="views">Most Viewed</option>
                <option value="performance">Best Performance</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolios Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPortfolios.map((portfolio) => (
                <Card
                  key={portfolio.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={portfolio.thumbnail}
                        alt={portfolio.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.svg";
                        }}
                      />
                      <div className="absolute top-3 left-3 flex space-x-2">
                        <Badge className={getStatusColor(portfolio.status)}>
                          {portfolio.status}
                        </Badge>
                        {portfolio.isAI && (
                          <Badge className="text-purple-600 bg-purple-100">
                            <Zap className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        )}
                        {portfolio.is3D && (
                          <Badge className="text-blue-600 bg-blue-100">
                            <Box className="w-3 h-3 mr-1" />
                            3D
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-white/80 hover:bg-white"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">
                          {portfolio.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {portfolio.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {portfolio.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {portfolio.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{portfolio.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{formatNumber(portfolio.views)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{formatNumber(portfolio.likes)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{portfolio.comments}</span>
                          </div>
                        </div>
                        <span>{formatDate(portfolio.updatedAt)}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPortfolio(portfolio)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPortfolio(portfolio.id)}
                            className="flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </Button>
                        </div>

                        <div className="flex items-center space-x-1">
                          {portfolio.is3D && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview3D(portfolio)}
                              className="p-1"
                            >
                              <Box className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSharePortfolio(portfolio)}
                            className="p-1"
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {filteredPortfolios.map((portfolio) => (
                <Card
                  key={portfolio.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={portfolio.thumbnail}
                        alt={portfolio.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.svg";
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {portfolio.name}
                          </h3>
                          <Badge className={getStatusColor(portfolio.status)}>
                            {portfolio.status}
                          </Badge>
                          {portfolio.isAI && (
                            <Badge className="text-purple-600 bg-purple-100">
                              <Zap className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                          {portfolio.is3D && (
                            <Badge className="text-blue-600 bg-blue-100">
                              <Box className="w-3 h-3 mr-1" />
                              3D
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {portfolio.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{formatNumber(portfolio.views)} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{formatNumber(portfolio.likes)} likes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{portfolio.comments} comments</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              Updated {formatDate(portfolio.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPortfolio(portfolio)}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPortfolio(portfolio.id)}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </Button>
                        {portfolio.is3D && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview3D(portfolio)}
                            className="flex items-center space-x-1"
                          >
                            <Box className="w-3 h-3" />
                            <span>3D</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSharePortfolio(portfolio)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredPortfolios.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No portfolios found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first portfolio to get started"}
            </p>
            <Button
              onClick={handleCreatePortfolio}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create Portfolio</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
