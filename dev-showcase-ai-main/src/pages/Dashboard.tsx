import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RefreshCw,
  Brain,
  Eye,
  Heart,
  Box,
  Calendar,
  Share2,
  Target,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PortfolioHealthScore from "../components/PortfolioHealth/PortfolioHealthScore";
import ContentCalendar from "../components/ContentManagement/ContentCalendar";
import { UnifiedSidebar } from "../components/UnifiedSidebar";
import { usePortfolioHealth } from "../hooks/usePortfolioHealth";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [analytics, setAnalytics] = useState({
    totalReach: 0,
    engagement: 0,
    totalViews: 0,
    recentProjects: [],
    publishedProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  // Portfolio health hook
  const {
    health: portfolioHealth,
    loading: healthLoading,
    error: healthError,
    refresh: refreshHealth,
    recompute: recomputeHealth,
  } = usePortfolioHealth();

  // Re-fetch projects on dashboard mount and route changes
  useEffect(() => {
    const getProjects = async () => {
      try {
        setLoading(true);

        // Fetch published projects from localStorage
        const showcaseProjects = JSON.parse(
          localStorage.getItem("showcase-projects") || "[]",
        );
        const publishedProjects = showcaseProjects.filter(
          (project) =>
            project.status === "published" ||
            project.published === true ||
            !project.status,
        );

        console.log(
          "Fetching projects on route change:",
          publishedProjects.length,
          "projects found",
        );

        setAnalytics((prev) => ({
          ...prev,
          recentProjects: publishedProjects.slice(0, 5),
          publishedProjects: publishedProjects.length,
        }));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    getProjects();
  }, [location.pathname]); // Triggers refetch every time route changes

  // Load analytics data (separate from projects)
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Fetch analytics data from API (with fallback)
        const [analyticsResponse] = await Promise.allSettled([
          fetch("/api/dashboard/portfolio-metrics", { credentials: "include" }),
        ]);

        // Handle analytics data
        if (
          analyticsResponse.status === "fulfilled" &&
          analyticsResponse.value.ok
        ) {
          const analyticsData = await analyticsResponse.value.json();
          setAnalytics((prev) => ({
            ...prev,
            totalReach: analyticsData.data?.totalReach || 0,
            engagement: analyticsData.data?.engagementRate || 0,
            totalViews: analyticsData.data?.profileViews || 0,
          }));
        }
      } catch (error) {
        console.error("Failed to load analytics:", error);
      }
    };

    loadAnalytics();
  }, []);

  // Listen for changes to showcase projects in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "showcase-projects") {
        refreshPublishedProjects();
      }
    };

    // Also listen for focus events to refresh data when returning to the page
    const handleFocus = () => {
      refreshPublishedProjects();
    };

    // Refresh immediately when component mounts
    refreshPublishedProjects();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Refresh data when component becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshPublishedProjects();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Function to refresh published projects count
  const refreshPublishedProjects = () => {
    try {
      const showcaseProjects = JSON.parse(
        localStorage.getItem("showcase-projects") || "[]",
      );
      const publishedProjects = showcaseProjects.filter(
        (project) =>
          project.status === "published" ||
          project.published === true ||
          !project.status,
      );

      console.log(
        "Refreshing published projects:",
        publishedProjects.length,
        "projects found",
      );
      console.log("Published projects data:", publishedProjects);

      setAnalytics((prev) => ({
        ...prev,
        recentProjects: publishedProjects.slice(0, 5),
        publishedProjects: publishedProjects.length,
      }));
    } catch (error) {
      console.error("Error refreshing published projects:", error);
      // Fallback to empty state if localStorage is corrupted
      setAnalytics((prev) => ({
        ...prev,
        recentProjects: [],
        publishedProjects: 0,
      }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Unified Sidebar */}
      <UnifiedSidebar currentPage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col w-full p-3 space-y-3 bg-gray-50">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="text-xs text-gray-500">
              Your portfolio performance and AI-driven insights.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Top Metrics Row */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  {
                    title: "Total Reach",
                    value: analytics.totalReach.toLocaleString(),
                    change: "+12%",
                    icon: <Eye className="text-blue-500" />,
                  },
                  {
                    title: "Engagement",
                    value: `${analytics.engagement.toFixed(1)}%`,
                    change: "+8%",
                    icon: <Heart className="text-pink-500" />,
                  },
                  {
                    title: "Total Views",
                    value: analytics.totalViews.toLocaleString(),
                    change: "+15%",
                    icon: <BarChart3 className="text-green-500" />,
                  },
                  {
                    title: "Active Projects",
                    value: analytics.publishedProjects.toString(),
                    change: "Published",
                    icon: <Box className="text-purple-500" />,
                  },
                ].map((item, idx) => (
                  <Card
                    key={idx}
                    className="rounded-2xl hover:shadow-md transition-all"
                  >
                    <CardContent className="flex items-center justify-between p-3">
                      <div>
                        <p className="text-sm text-gray-500">{item.title}</p>
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.value}
                        </h3>
                        <span className="text-xs text-green-600">
                          {item.change}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.title === "Active Projects" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={refreshPublishedProjects}
                            className="p-1 h-6 w-6"
                            title="Refresh published projects count"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        )}
                        <div className="p-2 bg-gray-100 rounded-xl">
                          {item.icon}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Middle Section: Projects + Health */}
              <div className="grid grid-cols-2 gap-3">
                {/* Recent Projects */}
                <Card className="rounded-2xl hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-900">
                      Recent Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {loading ? (
                      <div className="flex items-center justify-center h-[120px]">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : analytics.recentProjects.length > 0 ? (
                      <div className="space-y-2">
                        {analytics.recentProjects
                          .slice(0, 3)
                          .map((project, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Box className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900 text-sm">
                                    {project.name || project.title}
                                  </h3>
                                  <p className="text-xs text-gray-600 truncate max-w-xs">
                                    {project.description}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/showcase/view/${project._id || project.id}`,
                                  )
                                }
                                className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1"
                          onClick={() => navigate("/showcase")}
                        >
                          View All Projects
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[120px] text-gray-400">
                        <Box className="h-6 w-6 mb-1 text-gray-300" />
                        <p className="text-xs">No projects yet</p>
                        <Button
                          size="sm"
                          className="mt-1 text-xs"
                          onClick={() => navigate("/showcase")}
                        >
                          Create Project
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Portfolio Health Score */}
                <PortfolioHealthScore
                  health={portfolioHealth}
                  loading={healthLoading}
                  onRefresh={refreshHealth}
                  onRecompute={recomputeHealth}
                />
              </div>

              {/* Bottom Section: Content Calendar + Network Activity + AI Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Content Calendar */}
                <Card className="rounded-2xl hover:shadow-md transition-all">
                  <CardHeader className="flex items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-sm text-gray-900">
                        Content Calendar
                      </CardTitle>
                      <p className="text-xs text-gray-500">
                        Upcoming content and deadlines
                      </p>
                    </div>
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="max-h-48 overflow-y-auto">
                      <ContentCalendar />
                    </div>
                  </CardContent>
                </Card>

                {/* Network Activity */}
                <Card className="rounded-2xl hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-900">
                      Network Activity
                    </CardTitle>
                    <p className="text-xs text-gray-500">
                      Recent connections and interactions
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            New Connection
                          </p>
                          <p className="text-xs text-gray-600">
                            John Doe connected with you
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">2h ago</span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                          <Heart className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Project Liked
                          </p>
                          <p className="text-xs text-gray-600">
                            Your React project got 5 new likes
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">4h ago</span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                          <Share2 className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Project Shared
                          </p>
                          <p className="text-xs text-gray-600">
                            Your portfolio was shared 3 times
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">6h ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI-Driven Insights */}
                <Card className="rounded-2xl hover:shadow-md transition-all">
                  <CardHeader className="flex items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-sm text-gray-900">
                        AI Insights
                      </CardTitle>
                      <p className="text-xs text-gray-500">
                        Smart recommendations for your portfolio
                      </p>
                    </div>
                    <Brain className="w-4 h-4 text-purple-600" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-start space-x-2">
                          <Target className="w-3.5 h-3.5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              Optimization Tip
                            </p>
                            <p className="text-xs text-blue-700">
                              Add more React projects to increase your
                              visibility
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <div className="flex items-start space-x-2">
                          <TrendingUp className="w-3.5 h-3.5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-900">
                              Growth Opportunity
                            </p>
                            <p className="text-xs text-green-700">
                              Your JavaScript skills are trending - showcase
                              more!
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <div className="flex items-start space-x-2">
                          <Clock className="w-3.5 h-3.5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-900">
                              Action Required
                            </p>
                            <p className="text-xs text-yellow-700">
                              Update your profile description for better SEO
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
