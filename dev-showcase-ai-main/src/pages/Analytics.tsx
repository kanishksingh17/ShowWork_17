import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedSidebar } from "../components/UnifiedSidebar";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface ProjectAnalytics {
  id: string;
  name: string;
  views: number;
  likes: number;
  shares: number;
  downloads: number;
  viewsChange: number;
  likesChange: number;
  sharesChange: number;
  downloadsChange: number;
  lastUpdated: string;
}

interface OverallStats {
  totalViews: number;
  totalProjects: number;
  totalLikes: number;
  totalFollowers: number;
  viewsChange: number;
  projectsChange: number;
  likesChange: number;
  followersChange: number;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<ProjectAnalytics[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalViews: 0,
    totalProjects: 0,
    totalLikes: 0,
    totalFollowers: 0,
    viewsChange: 0,
    projectsChange: 0,
    likesChange: 0,
    followersChange: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [sortBy, setSortBy] = useState("views");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch projects from localStorage
      const projects = JSON.parse(localStorage.getItem("showcase-projects") || "[]");
      
      // Generate mock analytics data
      const mockAnalytics: ProjectAnalytics[] = projects.map((project: any) => ({
        id: project.id,
        name: project.name,
        views: Math.floor(Math.random() * 5000) + 100,
        likes: Math.floor(Math.random() * 500) + 10,
        shares: Math.floor(Math.random() * 100) + 5,
        downloads: Math.floor(Math.random() * 200) + 1,
        viewsChange: Math.floor(Math.random() * 40) - 20,
        likesChange: Math.floor(Math.random() * 30) - 15,
        sharesChange: Math.floor(Math.random() * 25) - 12,
        downloadsChange: Math.floor(Math.random() * 20) - 10,
        lastUpdated: project.lastUpdated,
      }));

      setAnalytics(mockAnalytics);

      // Calculate overall stats
      const totalViews = mockAnalytics.reduce((sum, project) => sum + project.views, 0);
      const totalLikes = mockAnalytics.reduce((sum, project) => sum + project.likes, 0);
      const totalShares = mockAnalytics.reduce((sum, project) => sum + project.shares, 0);
      const totalDownloads = mockAnalytics.reduce((sum, project) => sum + project.downloads, 0);

      setOverallStats({
        totalViews,
        totalProjects: projects.length,
        totalLikes,
        totalFollowers: Math.floor(Math.random() * 2000) + 500,
        viewsChange: Math.floor(Math.random() * 40) - 20,
        projectsChange: projects.length > 0 ? Math.floor(Math.random() * 20) + 5 : 0,
        likesChange: Math.floor(Math.random() * 30) - 15,
        followersChange: Math.floor(Math.random() * 25) - 12,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedAnalytics = [...analytics].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return b.views - a.views;
      case "likes":
        return b.likes - a.likes;
      case "shares":
        return b.shares - a.shares;
      case "downloads":
        return b.downloads - a.downloads;
      default:
        return 0;
    }
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600 dark:text-green-400";
    if (change < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-3 h-3" />;
    if (change < 0) return <ArrowDown className="w-3 h-3" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedSidebar currentPage="analytics" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar currentPage="analytics" />

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your portfolio and content performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalytics}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Range:
            </span>
            <div className="flex gap-2">
              {["7d", "30d", "90d", "1y"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>

          {/* Overall Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Views
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(overallStats.totalViews)}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`flex items-center gap-1 mt-1 ${getChangeColor(overallStats.viewsChange)}`}>
                  {getChangeIcon(overallStats.viewsChange)}
                  <p className="text-xs">
                    {overallStats.viewsChange > 0 ? "+" : ""}{overallStats.viewsChange}% from last period
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Projects
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {overallStats.totalProjects}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <div className={`flex items-center gap-1 mt-1 ${getChangeColor(overallStats.projectsChange)}`}>
                  {getChangeIcon(overallStats.projectsChange)}
                  <p className="text-xs">
                    {overallStats.projectsChange > 0 ? "+" : ""}{overallStats.projectsChange}% from last period
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Likes
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(overallStats.totalLikes)}
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <div className={`flex items-center gap-1 mt-1 ${getChangeColor(overallStats.likesChange)}`}>
                  {getChangeIcon(overallStats.likesChange)}
                  <p className="text-xs">
                    {overallStats.likesChange > 0 ? "+" : ""}{overallStats.likesChange}% from last period
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Followers
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(overallStats.totalFollowers)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className={`flex items-center gap-1 mt-1 ${getChangeColor(overallStats.followersChange)}`}>
                  {getChangeIcon(overallStats.followersChange)}
                  <p className="text-xs">
                    {overallStats.followersChange > 0 ? "+" : ""}{overallStats.followersChange}% from last period
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Analytics Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Project Performance</CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="views">Sort by Views</option>
                    <option value="likes">Sort by Likes</option>
                    <option value="shares">Sort by Shares</option>
                    <option value="downloads">Sort by Downloads</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedAnalytics.length > 0 ? (
                  sortedAnalytics.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Last updated: {new Date(project.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="grid grid-cols-4 gap-8 text-center">
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatNumber(project.views)}
                          </p>
                          <p className="text-xs text-gray-500">Views</p>
                          <div className={`flex items-center justify-center gap-1 ${getChangeColor(project.viewsChange)}`}>
                            {getChangeIcon(project.viewsChange)}
                            <span className="text-xs">
                              {project.viewsChange > 0 ? "+" : ""}{project.viewsChange}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatNumber(project.likes)}
                          </p>
                          <p className="text-xs text-gray-500">Likes</p>
                          <div className={`flex items-center justify-center gap-1 ${getChangeColor(project.likesChange)}`}>
                            {getChangeIcon(project.likesChange)}
                            <span className="text-xs">
                              {project.likesChange > 0 ? "+" : ""}{project.likesChange}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatNumber(project.shares)}
                          </p>
                          <p className="text-xs text-gray-500">Shares</p>
                          <div className={`flex items-center justify-center gap-1 ${getChangeColor(project.sharesChange)}`}>
                            {getChangeIcon(project.sharesChange)}
                            <span className="text-xs">
                              {project.sharesChange > 0 ? "+" : ""}{project.sharesChange}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatNumber(project.downloads)}
                          </p>
                          <p className="text-xs text-gray-500">Downloads</p>
                          <div className={`flex items-center justify-center gap-1 ${getChangeColor(project.downloadsChange)}`}>
                            {getChangeIcon(project.downloadsChange)}
                            <span className="text-xs">
                              {project.downloadsChange > 0 ? "+" : ""}{project.downloadsChange}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No projects found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Create some projects to see analytics data
                    </p>
                    <Button onClick={() => window.location.href = "/showcase/add"}>
                      Create Project
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}