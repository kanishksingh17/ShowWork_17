import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Share2,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Download,
  Target,
  Zap,
} from "lucide-react";

interface ProjectPerformance {
  id: string;
  name: string;
  views: number;
  likes: number;
  shares: number;
  engagementRate: number;
  qualityScore: number;
  trend: "up" | "down" | "stable";
  category: string;
  lastUpdated: string;
  status: "published" | "draft" | "archived";
}

interface ProjectLeaderboardProps {
  projects: ProjectPerformance[];
}

export const ProjectLeaderboard: React.FC<ProjectLeaderboardProps> = ({
  projects,
}) => {
  const [sortBy, setSortBy] = useState<
    "views" | "engagement" | "quality" | "trend"
  >("views");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <div className="w-5 h-5 flex items-center justify-center text-gray-600 font-bold text-sm">
            {index + 1}
          </div>
        );
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortedProjects = [...projects]
    .filter(
      (project) =>
        filterCategory === "all" || project.category === filterCategory,
    )
    .filter(
      (project) => filterStatus === "all" || project.status === filterStatus,
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.views - a.views;
        case "engagement":
          return b.engagementRate - a.engagementRate;
        case "quality":
          return b.qualityScore - a.qualityScore;
        case "trend":
          return a.trend === "up" ? -1 : b.trend === "up" ? 1 : 0;
        default:
          return b.views - a.views;
      }
    });

  const categories = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Project Performance Leaderboard
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: "views", label: "Views", icon: Eye },
            { id: "engagement", label: "Engagement", icon: Heart },
            { id: "quality", label: "Quality", icon: Star },
            { id: "trend", label: "Trend", icon: TrendingUp },
          ].map((sort) => {
            const Icon = sort.icon;
            return (
              <button
                key={sort.id}
                onClick={() => setSortBy(sort.id as any)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-all ${
                  sortBy === sort.id
                    ? "bg-white text-gray-800 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{sort.label}</span>
              </button>
            );
          })}
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Leaderboard */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Top Performing Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedProjects.map((project, index) => (
              <div
                key={project.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  index < 3
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(index)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {project.name}
                        </h3>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline">{project.category}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-600">
                            {project.views.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-gray-600">{project.likes}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Share2 className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">
                            {project.shares}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-600">
                            {project.qualityScore}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Engagement Rate
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {project.engagementRate.toFixed(1)}%
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getTrendIcon(project.trend)}
                      <div className="text-sm text-gray-600">
                        {project.trend === "up"
                          ? "Growing"
                          : project.trend === "down"
                            ? "Declining"
                            : "Stable"}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Boost
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedProjects.slice(0, 3).map((project, index) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getRankIcon(index)}
                    <div>
                      <div className="font-medium text-gray-800">
                        {project.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {project.views.toLocaleString()} views
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">
                      {project.engagementRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600">engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedProjects
                .filter((p) => p.trend === "down" || p.engagementRate < 5)
                .slice(0, 3)
                .map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex items-center space-x-3">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {project.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">
                        {project.engagementRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">engagement</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-semibold text-green-800 mb-2">
                High Impact
              </div>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Add project screenshots to increase engagement by 40%</li>
                <li>• Write detailed descriptions for better SEO</li>
                <li>• Add live demo links to boost conversions</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">Quick Wins</div>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Update project tags for better discoverability</li>
                <li>• Add GitHub repository links</li>
                <li>• Include technology stack badges</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
