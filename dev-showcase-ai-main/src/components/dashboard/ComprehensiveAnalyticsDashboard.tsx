import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Filter,
} from "lucide-react";
import { RealTimeAnalytics } from "./RealTimeAnalytics";
import { GoalTracking } from "./GoalTracking";
import { analyticsService } from "@/services/analyticsService";
import { socialMediaService } from "@/services/socialMediaService";
import { portfolioTrackingService } from "@/services/portfolioTrackingService";

interface ComprehensiveAnalyticsDashboardProps {
  portfolioId: string;
}

export function ComprehensiveAnalyticsDashboard({
  portfolioId,
}: ComprehensiveAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [analytics, setAnalytics] = useState<any>(null);
  const [socialMedia, setSocialMedia] = useState<any>(null);
  const [portfolioMetrics, setPortfolioMetrics] = useState<any>(null);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [portfolioId, dateRange]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [analyticsData, socialMediaData, portfolioData] = await Promise.all(
        [
          analyticsService.getPortfolioMetrics(getDateRange()),
          socialMediaService.getAllSocialMediaMetrics(),
          portfolioTrackingService.getPortfolioMetrics(
            portfolioId,
            getDateRange(),
          ),
        ],
      );

      setAnalytics(analyticsData);
      setSocialMedia(socialMediaData);
      setPortfolioMetrics(portfolioData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    const days = parseInt(dateRange.replace("d", ""));
    return {
      start: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
      end: now,
    };
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getEngagementTrend = () => {
    // This would typically come from historical data
    return [
      { date: "2024-01-01", engagement: 4.2 },
      { date: "2024-01-02", engagement: 4.5 },
      { date: "2024-01-03", engagement: 4.8 },
      { date: "2024-01-04", engagement: 5.1 },
      { date: "2024-01-05", engagement: 5.3 },
    ];
  };

  if (loading && !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights into your portfolio performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAllData}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Badge variant="outline" className="text-xs">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Time period:</span>
        <div className="flex gap-1">
          {["7d", "30d", "90d", "1y"].map((period) => (
            <Button
              key={period}
              variant={dateRange === period ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(socialMedia?.total?.reach || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Views
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(portfolioMetrics?.totalViews || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique visitors:{" "}
              {formatNumber(portfolioMetrics?.uniqueVisitors || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CV Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(portfolioMetrics?.totalDownloads || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Conversion rate:{" "}
              {portfolioMetrics?.conversionRate?.toFixed(1) || 0}%
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
              {analytics?.engagementRate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across platforms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Real-time
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Devices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Social Media Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {socialMedia &&
                  Object.entries(socialMedia.platforms || {}).map(
                    ([platform, data]: [string, any]) => (
                      <div key={platform} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium capitalize">{platform}</h3>
                          <Badge variant="outline">
                            {data.followers?.toLocaleString() || 0} followers
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Posts</span>
                            <span>{data.posts || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Engagement
                            </span>
                            <span>{data.engagementRate?.toFixed(1) || 0}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reach</span>
                            <span>{formatNumber(data.reach || 0)}</span>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioMetrics?.trafficSources?.map(
                  (source: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {source.visitors} visitors
                        </span>
                        <span className="text-sm font-medium">
                          {source.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioMetrics?.topCountries?.map(
                  (country: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {country.visitors} visitors
                        </span>
                        <span className="text-sm font-medium">
                          {country.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime">
          <RealTimeAnalytics portfolioId={portfolioId} />
        </TabsContent>

        <TabsContent value="goals">
          <GoalTracking portfolioId={portfolioId} />
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          {/* Device Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Device Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Monitor className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Desktop</p>
                    <p className="text-xs text-muted-foreground">
                      {portfolioMetrics?.topDevices?.[0]?.percentage?.toFixed(
                        1,
                      ) || 0}
                      % of traffic
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Smartphone className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Mobile</p>
                    <p className="text-xs text-muted-foreground">
                      {portfolioMetrics?.topDevices?.[1]?.percentage?.toFixed(
                        1,
                      ) || 0}
                      % of traffic
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Tablet</p>
                    <p className="text-xs text-muted-foreground">
                      {portfolioMetrics?.topDevices?.[2]?.percentage?.toFixed(
                        1,
                      ) || 0}
                      % of traffic
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Browser Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Browser Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioMetrics?.topBrowsers?.map(
                  (browser: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="font-medium">{browser.browser}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {browser.visitors} visitors
                        </span>
                        <span className="text-sm font-medium">
                          {browser.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
