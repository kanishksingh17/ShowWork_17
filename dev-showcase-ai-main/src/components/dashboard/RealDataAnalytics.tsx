import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Download,
  MousePointer,
  Globe,
  Smartphone,
  Monitor,
  Target,
  Activity,
  RefreshCw,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { analyticsService } from "@/services/analyticsService";

interface RealDataAnalyticsProps {
  portfolioId: string;
}

export function RealDataAnalytics({ portfolioId }: RealDataAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadRealData();
    const interval = setInterval(loadRealData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [portfolioId]);

  const loadRealData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load real analytics data
      const [metricsData, projectsData] = await Promise.all([
        analyticsService.getPortfolioMetrics(),
        fetch("/api/dashboard/projects?limit=10", {
          credentials: "include",
        }).then((res) => res.json()),
      ]);

      setAnalytics(metricsData);
      setProjects(projectsData.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load real data:", err);
      setError("Failed to load analytics data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getDataStatus = () => {
    if (loading) return { status: "loading", message: "Loading real data..." };
    if (error) return { status: "error", message: error };
    if (!analytics || analytics.totalReach === 0)
      return { status: "empty", message: "No data available yet" };
    return { status: "success", message: "Real data loaded successfully" };
  };

  const dataStatus = getDataStatus();

  if (loading && !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-medium">
              Loading your real analytics data...
            </p>
            <p className="text-sm text-muted-foreground">
              This may take a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Status */}
      <Card
        className={
          dataStatus.status === "error" ? "border-red-200 bg-red-50" : ""
        }
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {dataStatus.status === "loading" && (
              <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
            )}
            {dataStatus.status === "error" && (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            {dataStatus.status === "success" && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {dataStatus.status === "empty" && (
              <Activity className="h-5 w-5 text-yellow-500" />
            )}

            <div>
              <p className="font-medium">{dataStatus.message}</p>
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadRealData}
              disabled={loading}
              className="ml-auto"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(analytics.totalReach || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Portfolio views + Social reach
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Profile Views
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(analytics.profileViews || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Unique portfolio visitors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Projects
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.activeProjects || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Projects in your portfolio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Engagement Rate
              </CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.engagementRate?.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Likes + Shares / Views
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Real Projects Data */}
      {projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Your Projects Performance
              <Badge variant="secondary" className="ml-auto">
                {projects.length} projects
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div
                  key={project._id || index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {project.name || project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {project.description?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {project.views || 0} views
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MousePointer className="h-4 w-4" />
                        {project.likes || 0} likes
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Download className="h-4 w-4" />
                        {project.downloads || 0} downloads
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Badge variant="outline">
                      {project.technologies?.length || 0} techs
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tech Stack Popularity */}
      {analytics?.techStackPopularity?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Technology Stack Popularity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.techStackPopularity.map((tech: any, index: number) => (
                <div key={tech.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{tech.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {tech.projects} projects
                      </span>
                      <Badge variant="outline">
                        {tech.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={tech.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Code Quality Score</span>
                <div className="flex items-center gap-2">
                  <Progress
                    value={analytics.codeQualityScore || 0}
                    className="w-20"
                  />
                  <span className="text-sm font-medium">
                    {analytics.codeQualityScore || 0}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Average Session Duration
                </span>
                <span className="text-sm font-medium">
                  {Math.round((analytics.averageSessionDuration || 0) / 60)}{" "}
                  minutes
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bounce Rate</span>
                <span className="text-sm font-medium">
                  {analytics.bounceRate?.toFixed(1) || 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Likes</span>
                <span className="text-sm font-medium">
                  {formatNumber(analytics.totalLikes || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Shares</span>
                <span className="text-sm font-medium">
                  {formatNumber(analytics.totalShares || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Engagement Rate</span>
                <span className="text-sm font-medium">
                  {analytics.engagementRate?.toFixed(1) || 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {dataStatus.status === "empty" && (
        <Card>
          <CardContent className="text-center py-12">
            <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Analytics Data Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start using your portfolio to see real analytics data here.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Add projects to your portfolio</p>
              <p>• Share your portfolio with others</p>
              <p>• Track views, downloads, and interactions</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
