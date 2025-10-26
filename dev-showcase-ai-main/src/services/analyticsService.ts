import {
  AnalyticsData,
  OverviewMetrics,
  TrafficData,
  EngagementData,
  PerformanceData,
  ConversionData,
  DemographicData,
  DeviceData,
  ReferrerData,
  ContentData,
  GoalData,
} from "@/types/analytics";

interface AnalyticsConfig {
  enableRealTimeTracking: boolean;
  enableCrossPlatformAnalytics: boolean;
  enableGoalTracking: boolean;
  enablePerformanceMonitoring: boolean;
}

class AnalyticsService {
  private config: AnalyticsConfig;
  private baseUrl = "/api/analytics";

  constructor() {
    this.config = {
      enableRealTimeTracking: true,
      enableCrossPlatformAnalytics: true,
      enableGoalTracking: true,
      enablePerformanceMonitoring: true,
    };
  }

  // Get comprehensive portfolio analytics
  async getPortfolioMetrics(dateRange?: {
    start: Date;
    end: Date;
  }): Promise<AnalyticsData> {
    try {
      const params = new URLSearchParams();
      if (dateRange) {
        params.append("start", dateRange.start.toISOString());
        params.append("end", dateRange.end.toISOString());
      }

      const response = await fetch(`${this.baseUrl}/portfolio?${params}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch portfolio analytics");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch portfolio analytics:", error);
      return this.getMockAnalyticsData();
    }
  }

  // Get real-time analytics
  async getRealTimeAnalytics(): Promise<{
    activeUsers: number;
    currentViews: number;
    recentEvents: any[];
    liveActivity: any[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/realtime`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch real-time analytics");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch real-time analytics:", error);
      return this.getMockRealTimeAnalytics();
    }
  }

  // Get content calendar data
  async getContentCalendar(): Promise<{
    events: Array<{
      id: string;
      title: string;
      type: "post" | "project" | "update" | "milestone";
      date: string;
      time: string;
      status: "scheduled" | "published" | "draft";
      performance?: {
        views: number;
        engagement: number;
        reach: number;
      };
    }>;
    optimalTimes: Array<{
      day: string;
      hour: number;
      performance: number;
    }>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/content-calendar`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch content calendar");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch content calendar:", error);
      return this.getMockContentCalendar();
    }
  }

  // Get project performance data
  async getProjectPerformance(): Promise<
    Array<{
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
    }>
  > {
    try {
      const response = await fetch(`${this.baseUrl}/project-performance`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project performance");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch project performance:", error);
      return this.getMockProjectPerformance();
    }
  }

  // Get goal tracking data
  async getGoalTracking(): Promise<{
    goals: Array<{
      id: string;
      name: string;
      type: string;
      target: number;
      current: number;
      deadline: Date;
      status: string;
    }>;
    progress: Array<{
      goalId: string;
      date: string;
      value: number;
      change: number;
      changePercentage: number;
    }>;
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      unlockedAt: Date;
      type: string;
    }>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/goals`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch goal tracking");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch goal tracking:", error);
      return this.getMockGoalTracking();
    }
  }

  // Get audience analytics
  async getAudienceAnalytics(): Promise<{
    demographics: {
      countries: Array<{
        country: string;
        visitors: number;
        percentage: number;
      }>;
      cities: Array<{ city: string; visitors: number; percentage: number }>;
      languages: Array<{
        language: string;
        visitors: number;
        percentage: number;
      }>;
      ageGroups: Array<{ age: string; visitors: number; percentage: number }>;
    };
    interests: Array<{ interest: string; percentage: number }>;
    behavior: {
      avgSessionDuration: number;
      bounceRate: number;
      pagesPerSession: number;
      returnVisitorRate: number;
    };
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/audience`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audience analytics");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch audience analytics:", error);
      return this.getMockAudienceAnalytics();
    }
  }

  // Get custom metrics
  async getCustomMetrics(): Promise<{
    metrics: Array<{
      id: string;
      name: string;
      value: number;
      target: number;
      unit: string;
      trend: "up" | "down" | "stable";
      change: number;
      changePercentage: number;
    }>;
    insights: Array<{
      id: string;
      type: "insight" | "recommendation" | "alert";
      title: string;
      description: string;
      priority: "low" | "medium" | "high";
      actionable: boolean;
    }>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/custom-metrics`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch custom metrics");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch custom metrics:", error);
      return this.getMockCustomMetrics();
    }
  }

  // Export analytics data
  async exportAnalytics(
    format: "csv" | "json" | "pdf",
    dateRange?: { start: Date; end: Date },
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append("format", format);
      if (dateRange) {
        params.append("start", dateRange.start.toISOString());
        params.append("end", dateRange.end.toISOString());
      }

      const response = await fetch(`${this.baseUrl}/export?${params}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to export analytics");
      }

      return await response.blob();
    } catch (error) {
      console.error("Failed to export analytics:", error);
      throw error;
    }
  }

  // Mock data methods
  private getMockAnalyticsData(): AnalyticsData {
    return {
      overview: {
        totalViews: 12340,
        uniqueVisitors: 5670,
        bounceRate: 23.4,
        avgSessionDuration: 245,
        pageViews: 18900,
        newVisitors: 3450,
        returningVisitors: 2220,
        conversionRate: 4.2,
      },
      traffic: {
        daily: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          views: Math.floor(Math.random() * 500) + 200,
          visitors: Math.floor(Math.random() * 300) + 100,
        })),
        weekly: Array.from({ length: 12 }, (_, i) => ({
          week: `Week ${i + 1}`,
          views: Math.floor(Math.random() * 2000) + 1000,
          visitors: Math.floor(Math.random() * 1200) + 600,
        })),
        monthly: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i).toLocaleDateString("en-US", {
            month: "long",
          }),
          views: Math.floor(Math.random() * 8000) + 4000,
          visitors: Math.floor(Math.random() * 5000) + 2500,
        })),
        sources: [
          { source: "Direct", views: 2340, percentage: 41.3 },
          { source: "Google", views: 1890, percentage: 33.3 },
          { source: "LinkedIn", views: 890, percentage: 15.7 },
          { source: "GitHub", views: 340, percentage: 6.0 },
          { source: "Twitter", views: 200, percentage: 3.5 },
        ],
      },
      engagement: {
        pageViews: 18900,
        avgTimeOnPage: 245,
        scrollDepth: 78.5,
        clickThroughRate: 12.3,
        socialShares: 456,
        downloads: 234,
        contactFormSubmissions: 89,
      },
      performance: {
        pageLoadTime: 1.2,
        lighthouseScore: 95,
        coreWebVitals: {
          lcp: 1.8,
          fid: 45,
          cls: 0.05,
        },
        mobileScore: 92,
        desktopScore: 98,
        seoScore: 96,
        accessibilityScore: 94,
      },
      conversions: {
        totalConversions: 234,
        conversionRate: 4.2,
        goalCompletions: [
          { goal: "CV Downloads", completions: 89, rate: 1.6 },
          { goal: "Contact Form", completions: 45, rate: 0.8 },
          { goal: "Project Views", completions: 100, rate: 1.8 },
        ],
        funnelData: [
          { step: "Landing Page", visitors: 5670, dropoff: 0 },
          { step: "Portfolio View", visitors: 4560, dropoff: 19.6 },
          { step: "Project Click", visitors: 2340, dropoff: 48.7 },
          { step: "Contact Form", visitors: 890, dropoff: 62.0 },
          { step: "CV Download", visitors: 234, dropoff: 73.7 },
        ],
      },
      demographics: {
        countries: [
          { country: "United States", visitors: 2340, percentage: 41.3 },
          { country: "Canada", visitors: 1890, percentage: 33.3 },
          { country: "United Kingdom", visitors: 890, percentage: 15.7 },
          { country: "Germany", visitors: 340, percentage: 6.0 },
          { country: "Australia", visitors: 200, percentage: 3.5 },
        ],
        cities: [
          { city: "San Francisco", visitors: 890, percentage: 15.7 },
          { city: "New York", visitors: 670, percentage: 11.8 },
          { city: "Toronto", visitors: 450, percentage: 7.9 },
          { city: "London", visitors: 340, percentage: 6.0 },
          { city: "Berlin", visitors: 200, percentage: 3.5 },
        ],
        languages: [
          { language: "English", visitors: 4560, percentage: 80.4 },
          { language: "Spanish", visitors: 670, percentage: 11.8 },
          { language: "French", visitors: 340, percentage: 6.0 },
          { language: "German", visitors: 100, percentage: 1.8 },
        ],
        ageGroups: [
          { age: "25-34", visitors: 2340, percentage: 41.3 },
          { age: "35-44", visitors: 1890, percentage: 33.3 },
          { age: "18-24", visitors: 890, percentage: 15.7 },
          { age: "45-54", visitors: 340, percentage: 6.0 },
          { age: "55+", visitors: 200, percentage: 3.5 },
        ],
      },
      devices: {
        devices: [
          { device: "Desktop", visitors: 3450, percentage: 60.8 },
          { device: "Mobile", visitors: 1890, percentage: 33.3 },
          { device: "Tablet", visitors: 330, percentage: 5.8 },
        ],
        browsers: [
          { browser: "Chrome", visitors: 3450, percentage: 60.8 },
          { browser: "Safari", visitors: 1890, percentage: 33.3 },
          { browser: "Firefox", visitors: 234, percentage: 4.1 },
          { browser: "Edge", visitors: 96, percentage: 1.7 },
        ],
        operatingSystems: [
          { os: "Windows", visitors: 2340, percentage: 41.3 },
          { os: "macOS", visitors: 1890, percentage: 33.3 },
          { os: "iOS", visitors: 890, percentage: 15.7 },
          { os: "Android", visitors: 340, percentage: 6.0 },
          { os: "Linux", visitors: 200, percentage: 3.5 },
        ],
        screenSizes: [
          { size: "1920x1080", count: 1500, percentage: 26.4 },
          { size: "1366x768", count: 1200, percentage: 21.1 },
          { size: "375x667", count: 800, percentage: 14.1 },
          { size: "414x896", count: 600, percentage: 10.6 },
          { size: "1440x900", count: 500, percentage: 8.8 },
        ],
      },
      referrers: {
        direct: 2340,
        search: 1890,
        social: 890,
        email: 340,
        other: 200,
      },
      content: {
        topPages: [
          { page: "/", views: 4560, percentage: 24.1 },
          { page: "/projects", views: 2340, percentage: 12.4 },
          { page: "/about", views: 1890, percentage: 10.0 },
          { page: "/contact", views: 890, percentage: 4.7 },
        ],
        topProjects: [
          { project: "E-commerce Platform", views: 890, percentage: 4.7 },
          { project: "Portfolio Website", views: 670, percentage: 3.5 },
          { project: "Task Management App", views: 450, percentage: 2.4 },
        ],
        contentPerformance: [
          { content: "Homepage Hero", views: 4560, engagement: 78.5 },
          { content: "Project Gallery", views: 2340, engagement: 65.2 },
          { content: "About Section", views: 1890, engagement: 45.8 },
        ],
      },
      goals: {
        goals: [
          {
            id: "goal-1",
            name: "Portfolio Views",
            target: 10000,
            current: 5670,
            completion: 56.7,
          },
          {
            id: "goal-2",
            name: "CV Downloads",
            target: 500,
            current: 234,
            completion: 46.8,
          },
          {
            id: "goal-3",
            name: "Contact Form Submissions",
            target: 100,
            current: 45,
            completion: 45.0,
          },
        ],
        achievements: [
          {
            id: "achievement-1",
            name: "First 1000 Views",
            unlockedAt: new Date(),
          },
          {
            id: "achievement-2",
            name: "50 CV Downloads",
            unlockedAt: new Date(),
          },
        ],
      },
    };
  }

  private getMockRealTimeAnalytics() {
    return {
      activeUsers: 23,
      currentViews: 156,
      recentEvents: [
        {
          id: "1",
          type: "portfolio_view",
          timestamp: new Date(Date.now() - 300000),
          location: "San Francisco, CA",
          device: "Desktop",
        },
        {
          id: "2",
          type: "cv_download",
          timestamp: new Date(Date.now() - 600000),
          location: "New York, NY",
          device: "Mobile",
        },
      ],
      liveActivity: [
        {
          id: "1",
          type: "portfolio_view",
          timestamp: new Date(Date.now() - 300000),
          location: "San Francisco, CA",
          device: "Desktop",
        },
        {
          id: "2",
          type: "cv_download",
          timestamp: new Date(Date.now() - 600000),
          location: "New York, NY",
          device: "Mobile",
        },
      ],
    };
  }

  private getMockContentCalendar() {
    return {
      events: [
        {
          id: "1",
          title: "New React Project Launch",
          type: "project",
          date: "2024-01-15",
          time: "10:00",
          status: "scheduled",
          performance: { views: 0, engagement: 0, reach: 0 },
        },
        {
          id: "2",
          title: "Weekly Update Post",
          type: "post",
          date: "2024-01-12",
          time: "14:00",
          status: "published",
          performance: { views: 234, engagement: 45, reach: 567 },
        },
      ],
      optimalTimes: [
        { day: "Tuesday", hour: 10, performance: 85 },
        { day: "Thursday", hour: 14, performance: 78 },
        { day: "Sunday", hour: 18, performance: 72 },
      ],
    };
  }

  private getMockProjectPerformance() {
    return [
      {
        id: "1",
        name: "E-commerce Platform",
        views: 2340,
        likes: 156,
        shares: 45,
        engagementRate: 8.6,
        qualityScore: 92,
        trend: "up",
        category: "Web Development",
        lastUpdated: "2024-01-10",
        status: "published",
      },
      {
        id: "2",
        name: "Portfolio Website",
        views: 1890,
        likes: 89,
        shares: 23,
        engagementRate: 5.9,
        qualityScore: 88,
        trend: "stable",
        category: "Web Development",
        lastUpdated: "2024-01-08",
        status: "published",
      },
    ];
  }

  private getMockGoalTracking() {
    return {
      goals: [
        {
          id: "goal-1",
          name: "Portfolio Views Target",
          type: "portfolio_views",
          target: 10000,
          current: 5670,
          deadline: new Date("2024-12-31"),
          status: "active",
        },
        {
          id: "goal-2",
          name: "CV Downloads Target",
          type: "cv_downloads",
          target: 500,
          current: 234,
          deadline: new Date("2024-11-30"),
          status: "active",
        },
      ],
      progress: [
        {
          goalId: "goal-1",
          date: new Date().toISOString().split("T")[0],
          value: 5670,
          change: 120,
          changePercentage: 2.2,
        },
      ],
      achievements: [
        {
          id: "achievement-1",
          name: "First 1000 Views",
          description: "Reached 1000 portfolio views",
          unlockedAt: new Date(Date.now() - 86400000),
          type: "milestone",
        },
      ],
    };
  }

  private getMockAudienceAnalytics() {
    return {
      demographics: {
        countries: [
          { country: "United States", visitors: 2340, percentage: 41.3 },
          { country: "Canada", visitors: 1890, percentage: 33.3 },
          { country: "United Kingdom", visitors: 890, percentage: 15.7 },
        ],
        cities: [
          { city: "San Francisco", visitors: 890, percentage: 15.7 },
          { city: "New York", visitors: 670, percentage: 11.8 },
          { city: "Toronto", visitors: 450, percentage: 7.9 },
        ],
        languages: [
          { language: "English", visitors: 4560, percentage: 80.4 },
          { language: "Spanish", visitors: 670, percentage: 11.8 },
          { language: "French", visitors: 340, percentage: 6.0 },
        ],
        ageGroups: [
          { age: "25-34", visitors: 2340, percentage: 41.3 },
          { age: "35-44", visitors: 1890, percentage: 33.3 },
          { age: "18-24", visitors: 890, percentage: 15.7 },
        ],
      },
      interests: [
        { interest: "Web Development", percentage: 45.2 },
        { interest: "Technology", percentage: 38.7 },
        { interest: "Design", percentage: 28.9 },
        { interest: "Programming", percentage: 22.1 },
      ],
      behavior: {
        avgSessionDuration: 245,
        bounceRate: 23.4,
        pagesPerSession: 3.2,
        returnVisitorRate: 35.6,
      },
    };
  }

  private getMockCustomMetrics() {
    return {
      metrics: [
        {
          id: "metric-1",
          name: "Code Quality Score",
          value: 92,
          target: 95,
          unit: "score",
          trend: "up",
          change: 3,
          changePercentage: 3.4,
        },
        {
          id: "metric-2",
          name: "Project Completion Rate",
          value: 78,
          target: 85,
          unit: "%",
          trend: "stable",
          change: 0,
          changePercentage: 0,
        },
      ],
      insights: [
        {
          id: "insight-1",
          type: "recommendation",
          title: "Improve Mobile Experience",
          description:
            "Your mobile bounce rate is 15% higher than desktop. Consider optimizing for mobile devices.",
          priority: "medium",
          actionable: true,
        },
        {
          id: "insight-2",
          type: "insight",
          title: "Peak Traffic Hours",
          description:
            "Most of your traffic comes between 10 AM - 2 PM EST. Consider scheduling content during these hours.",
          priority: "low",
          actionable: true,
        },
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();
