// Comprehensive Analytics Dashboard - Professional Portfolio Insights
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Eye,
  MousePointer,
  Clock,
  Download,
  Globe,
  Smartphone,
  Monitor,
  Target,
  Zap,
  Activity,
  RefreshCw,
  Calendar,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { analyticsService } from "@/services/analyticsService";
import { AnalyticsData } from "@/types/analytics";
// Temporarily commenting out problematic imports
// import { RealDataAnalytics } from './dashboard/RealDataAnalytics';
// import { ContentCalendar } from './dashboard/ContentCalendar';
// import { ProjectLeaderboard } from './dashboard/ProjectLeaderboard';
// import { GoalTracking } from './dashboard/GoalTracking';
// import { AudienceAnalytics } from './dashboard/AudienceAnalytics';
// import { CustomMetrics } from './dashboard/CustomMetrics';
// import { AdvancedVisualizations } from './dashboard/AdvancedVisualizations';

// All interfaces are now imported from @/types/analytics

// Mock Analytics Data Generator
export const generateMockAnalyticsData = (): AnalyticsData => {
  return {
    overview: {
      totalViews: 1250,
      uniqueVisitors: 890,
      bounceRate: 32.5,
      avgSessionDuration: 245,
      pageViews: 2100,
      newVisitors: 650,
      returningVisitors: 240,
      conversionRate: 8.5,
    },
    traffic: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date:
          new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0] || "",
        views: Math.floor(Math.random() * 100) + 20,
        visitors: Math.floor(Math.random() * 80) + 15,
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        week: `Week ${i + 1}`,
        views: Math.floor(Math.random() * 500) + 100,
        visitors: Math.floor(Math.random() * 400) + 80,
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        month: new Date(
          Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        views: Math.floor(Math.random() * 2000) + 500,
        visitors: Math.floor(Math.random() * 1500) + 300,
      })),
      sources: [
        { source: "Direct", views: 450, percentage: 36 },
        { source: "Google Search", views: 380, percentage: 30.4 },
        { source: "LinkedIn", views: 200, percentage: 16 },
        { source: "Twitter", views: 120, percentage: 9.6 },
        { source: "Other", views: 100, percentage: 8 },
      ],
    },
    engagement: {
      pageViews: 2100,
      avgTimeOnPage: 245,
      scrollDepth: 68.5,
      clickThroughRate: 12.3,
      socialShares: 45,
      downloads: 23,
      contactFormSubmissions: 8,
    },
    performance: {
      pageLoadTime: 1.2,
      lighthouseScore: 95,
      coreWebVitals: {
        lcp: 1.1,
        fid: 45,
        cls: 0.05,
      },
      mobileScore: 92,
      desktopScore: 98,
      seoScore: 96,
      accessibilityScore: 94,
    },
    conversions: {
      totalConversions: 12,
      conversionRate: 8.5,
      goalCompletions: [
        { goal: "Contact Form", completions: 8, rate: 5.3 },
        { goal: "CV Download", completions: 4, rate: 2.7 },
        { goal: "Project View", completions: 15, rate: 10.2 },
      ],
      funnelData: [
        { step: "Landing", visitors: 150, dropoff: 0 },
        { step: "About", visitors: 120, dropoff: 20 },
        { step: "Projects", visitors: 95, dropoff: 36.7 },
        { step: "Contact", visitors: 12, dropoff: 92 },
      ],
    },
    demographics: {
      countries: [
        { country: "United States", visitors: 350, percentage: 39.3 },
        { country: "United Kingdom", visitors: 180, percentage: 20.2 },
        { country: "Canada", visitors: 120, percentage: 13.5 },
        { country: "Germany", visitors: 85, percentage: 9.6 },
        { country: "Other", visitors: 155, percentage: 17.4 },
      ],
      cities: [
        { city: "New York", visitors: 85, percentage: 9.6 },
        { city: "London", visitors: 65, percentage: 7.3 },
        { city: "San Francisco", visitors: 55, percentage: 6.2 },
        { city: "Toronto", visitors: 45, percentage: 5.1 },
        { city: "Other", visitors: 640, percentage: 71.8 },
      ],
      languages: [
        { language: "English", visitors: 720, percentage: 80.9 },
        { language: "German", visitors: 85, percentage: 9.6 },
        { language: "French", visitors: 45, percentage: 5.1 },
        { language: "Other", visitors: 40, percentage: 4.4 },
      ],
      ageGroups: [
        { age: "25-34", visitors: 350, percentage: 39.3 },
        { age: "35-44", visitors: 280, percentage: 31.5 },
        { age: "18-24", visitors: 150, percentage: 16.9 },
        { age: "45-54", visitors: 80, percentage: 9 },
        { age: "55+", visitors: 30, percentage: 3.3 },
      ],
    },
    devices: {
      devices: [
        { device: "Desktop", visitors: 450, percentage: 50.6 },
        { device: "Mobile", visitors: 320, percentage: 36 },
        { device: "Tablet", visitors: 120, percentage: 13.4 },
      ],
      browsers: [
        { browser: "Chrome", visitors: 420, percentage: 47.2 },
        { browser: "Safari", visitors: 180, percentage: 20.2 },
        { browser: "Firefox", visitors: 120, percentage: 13.5 },
        { browser: "Edge", visitors: 90, percentage: 10.1 },
        { browser: "Other", visitors: 80, percentage: 9 },
      ],
      operatingSystems: [
        { os: "Windows", visitors: 380, percentage: 42.7 },
        { os: "macOS", visitors: 250, percentage: 28.1 },
        { os: "iOS", visitors: 150, percentage: 16.9 },
        { os: "Android", visitors: 80, percentage: 9 },
        { os: "Linux", visitors: 30, percentage: 3.3 },
      ],
      screenSizes: [
        { size: "1920x1080", count: 200, percentage: 22.5 },
        { size: "1366x768", count: 150, percentage: 16.9 },
        { size: "1440x900", count: 120, percentage: 13.5 },
        { size: "Mobile", count: 320, percentage: 36 },
        { size: "Other", count: 100, percentage: 11.1 },
      ],
    },
    referrers: {
      direct: 450,
      search: 380,
      social: 320,
      email: 80,
      other: 120,
    },
    content: {
      topPages: [
        { page: "/", views: 450, percentage: 21.4 },
        { page: "/projects", views: 320, percentage: 15.2 },
        { page: "/about", views: 280, percentage: 13.3 },
        { page: "/contact", views: 150, percentage: 7.1 },
      ],
      topProjects: [
        { project: "E-commerce App", views: 180, percentage: 8.6 },
        { project: "Portfolio Website", views: 120, percentage: 5.7 },
        { project: "Task Manager", views: 95, percentage: 4.5 },
      ],
      contentPerformance: [
        { content: "Homepage", views: 450, engagement: 85 },
        { content: "Projects Page", views: 320, engagement: 78 },
        { content: "About Page", views: 280, engagement: 72 },
      ],
    },
    goals: {
      goals: [
        {
          id: "1",
          name: "Contact Form Submissions",
          target: 20,
          current: 8,
          completion: 40,
        },
        {
          id: "2",
          name: "CV Downloads",
          target: 50,
          current: 23,
          completion: 46,
        },
        {
          id: "3",
          name: "Project Views",
          target: 500,
          current: 320,
          completion: 64,
        },
      ],
      achievements: [
        { id: "1", name: "First Contact", unlockedAt: new Date("2024-01-15") },
        { id: "2", name: "Portfolio Star", unlockedAt: new Date("2024-01-20") },
      ],
    },
  };
};

// Analytics Dashboard Component
export const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  // const [portfolioId] = useState('default-portfolio'); // This would come from user context

  useEffect(() => {
    loadAnalyticsData();
    const interval = setInterval(loadAnalyticsData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const dateRange = getDateRange();
      const data = await analyticsService.getPortfolioMetrics(dateRange);
      setAnalyticsData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load analytics data:", error);
      // Fallback to mock data if real data fails
      setAnalyticsData(generateMockAnalyticsData());
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    const days = parseInt(selectedPeriod.replace("d", ""));
    return {
      start: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
      end: now,
    };
  };

  if (loading || !analyticsData) {
    return (
      <div className="h-full bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Professional portfolio performance insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Period:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm min-w-[140px]"
              >
                <option value="7d" className="bg-white text-gray-900">
                  Last 7 days
                </option>
                <option value="30d" className="bg-white text-gray-900">
                  Last 30 days
                </option>
                <option value="90d" className="bg-white text-gray-900">
                  Last 90 days
                </option>
                <option value="1y" className="bg-white text-gray-900">
                  Last year
                </option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAnalyticsData}
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Badge variant="outline" className="text-xs">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Real-time
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Views"
                value={analyticsData.overview.totalViews.toLocaleString()}
                change="+12.5%"
                icon={<Eye className="w-5 h-5" />}
                color="blue"
              />
              <MetricCard
                title="Unique Visitors"
                value={analyticsData.overview.uniqueVisitors.toLocaleString()}
                change="+8.3%"
                icon={<Users className="w-5 h-5" />}
                color="green"
              />
              <MetricCard
                title="Bounce Rate"
                value={`${analyticsData.overview.bounceRate}%`}
                change="-5.2%"
                icon={<MousePointer className="w-5 h-5" />}
                color="yellow"
              />
              <MetricCard
                title="Avg. Session"
                value={`${Math.floor(analyticsData.overview.avgSessionDuration / 60)}m ${analyticsData.overview.avgSessionDuration % 60}s`}
                change="+15.7%"
                icon={<Clock className="w-5 h-5" />}
                color="purple"
              />
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Performance Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Lighthouse Score</span>
                      <span className="text-gray-900 font-semibold">
                        {analyticsData.performance.lighthouseScore}/100
                      </span>
                    </div>
                    <Progress
                      value={analyticsData.performance.lighthouseScore}
                      className="h-2"
                    />

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {analyticsData.performance.mobileScore}
                        </div>
                        <div className="text-sm text-gray-600">Mobile</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {analyticsData.performance.desktopScore}
                        </div>
                        <div className="text-sm text-gray-600">Desktop</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Conversion Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.goals.goals.map((goal, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">
                            {goal.name}
                          </span>
                          <span className="text-gray-900 text-sm">
                            {goal.current}/{goal.target}
                          </span>
                        </div>
                        <Progress value={goal.completion} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Sources */}
            <Card className="bg-white border border-gray-200 shadow-sm mb-8">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.traffic.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-gray-900">{source.source}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">
                          {source.views} views
                        </span>
                        <Badge variant="secondary">{source.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Monitor className="w-5 h-5 mr-2" />
                    Device Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.devices.devices.map((device, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          {device.device === "Desktop" && (
                            <Monitor className="w-4 h-4 text-blue-600" />
                          )}
                          {device.device === "Mobile" && (
                            <Smartphone className="w-4 h-4 text-green-600" />
                          )}
                          {device.device === "Tablet" && (
                            <Monitor className="w-4 h-4 text-purple-600" />
                          )}
                          <span className="text-gray-900">{device.device}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-600">
                            {device.visitors}
                          </span>
                          <Badge variant="secondary">
                            {device.percentage}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Top Countries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.demographics.countries
                      .slice(0, 5)
                      .map((country, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-900">
                            {country.country}
                          </span>
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-600">
                              {country.visitors}
                            </span>
                            <Badge variant="secondary">
                              {country.percentage}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="realtime">
            <div className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Real-time Analytics
              </h3>
              <p className="text-gray-600">
                Real-time analytics component temporarily disabled
              </p>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Content Calendar
              </h3>
              <p className="text-gray-600">
                Content calendar component temporarily disabled
              </p>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Project Leaderboard
              </h3>
              <p className="text-gray-600">
                Project leaderboard component temporarily disabled
              </p>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Goal Tracking
              </h3>
              <p className="text-gray-600">
                Goal tracking component temporarily disabled
              </p>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-600">
                Advanced analytics components temporarily disabled
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "purple" | "red";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
}) => {
  const colorClasses = {
    blue: "text-blue-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    purple: "text-purple-400",
    red: "text-red-400",
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p
              className={`text-sm ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
            >
              {change} from last period
            </p>
          </div>
          <div className={`${colorClasses[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
