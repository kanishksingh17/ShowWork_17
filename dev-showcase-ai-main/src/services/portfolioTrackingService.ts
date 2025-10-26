import {
  PortfolioMetrics,
  DeviceAnalytics,
  CVDownload,
  PortfolioView,
  EngagementEvent,
} from "@/types/portfolioTracking";

interface TrackingConfig {
  enableRealTimeTracking: boolean;
  enableCrossDeviceTracking: boolean;
  enableGoalTracking: boolean;
  enablePerformanceMonitoring: boolean;
}

class PortfolioTrackingService {
  private config: TrackingConfig;
  private baseUrl = "/api/portfolio-tracking";
  private eventQueue: EngagementEvent[] = [];
  private isOnline = navigator.onLine;

  constructor() {
    this.config = {
      enableRealTimeTracking: true,
      enableCrossDeviceTracking: true,
      enableGoalTracking: true,
      enablePerformanceMonitoring: true,
    };

    this.initializeTracking();
  }

  private initializeTracking() {
    // Set up online/offline detection
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.flushEventQueue();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
    });

    // Set up performance monitoring
    if (this.config.enablePerformanceMonitoring) {
      this.setupPerformanceMonitoring();
    }

    // Set up cross-device tracking
    if (this.config.enableCrossDeviceTracking) {
      this.setupCrossDeviceTracking();
    }
  }

  // Track portfolio views
  async trackPortfolioView(viewData: {
    portfolioId: string;
    userId?: string;
    device: string;
    browser: string;
    os: string;
    country: string;
    city: string;
    referrer?: string;
    source?: string;
    medium?: string;
    campaign?: string;
  }): Promise<void> {
    const event: EngagementEvent = {
      id: this.generateEventId(),
      type: "portfolio_view",
      portfolioId: viewData.portfolioId,
      userId: viewData.userId,
      properties: {
        device: viewData.device,
        browser: viewData.browser,
        os: viewData.os,
        country: viewData.country,
        city: viewData.city,
        referrer: viewData.referrer,
        source: viewData.source,
        medium: viewData.medium,
        campaign: viewData.campaign,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };

    await this.trackEvent(event);
  }

  // Track CV downloads
  async trackCVDownload(downloadData: {
    portfolioId: string;
    userId?: string;
    cvType: string;
    format: string;
    device: string;
    browser: string;
    country: string;
    city: string;
  }): Promise<void> {
    const event: EngagementEvent = {
      id: this.generateEventId(),
      type: "cv_download",
      portfolioId: downloadData.portfolioId,
      userId: downloadData.userId,
      properties: {
        cvType: downloadData.cvType,
        format: downloadData.format,
        device: downloadData.device,
        browser: downloadData.browser,
        country: downloadData.country,
        city: downloadData.city,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };

    await this.trackEvent(event);
  }

  // Track project interactions
  async trackProjectInteraction(interactionData: {
    portfolioId: string;
    projectId: string;
    userId?: string;
    interactionType:
      | "view"
      | "click"
      | "like"
      | "share"
      | "demo_click"
      | "github_click";
    device: string;
    browser: string;
    country: string;
    city: string;
  }): Promise<void> {
    const event: EngagementEvent = {
      id: this.generateEventId(),
      type: "project_interaction",
      portfolioId: interactionData.portfolioId,
      userId: interactionData.userId,
      properties: {
        projectId: interactionData.projectId,
        interactionType: interactionData.interactionType,
        device: interactionData.device,
        browser: interactionData.browser,
        country: interactionData.country,
        city: interactionData.city,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };

    await this.trackEvent(event);
  }

  // Track contact form submissions
  async trackContactSubmission(contactData: {
    portfolioId: string;
    userId?: string;
    formType: string;
    device: string;
    browser: string;
    country: string;
    city: string;
  }): Promise<void> {
    const event: EngagementEvent = {
      id: this.generateEventId(),
      type: "contact_submission",
      portfolioId: contactData.portfolioId,
      userId: contactData.userId,
      properties: {
        formType: contactData.formType,
        device: contactData.device,
        browser: contactData.browser,
        country: contactData.country,
        city: contactData.city,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };

    await this.trackEvent(event);
  }

  // Track social media clicks
  async trackSocialMediaClick(socialData: {
    portfolioId: string;
    userId?: string;
    platform: string;
    linkType: string;
    device: string;
    browser: string;
    country: string;
    city: string;
  }): Promise<void> {
    const event: EngagementEvent = {
      id: this.generateEventId(),
      type: "social_media_click",
      portfolioId: socialData.portfolioId,
      userId: socialData.userId,
      properties: {
        platform: socialData.platform,
        linkType: socialData.linkType,
        device: socialData.device,
        browser: socialData.browser,
        country: socialData.country,
        city: socialData.city,
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };

    await this.trackEvent(event);
  }

  // Get comprehensive portfolio metrics
  async getPortfolioMetrics(
    portfolioId: string,
    dateRange?: { start: Date; end: Date },
  ): Promise<PortfolioMetrics> {
    try {
      const params = new URLSearchParams();
      params.append("portfolioId", portfolioId);
      if (dateRange) {
        params.append("start", dateRange.start.toISOString());
        params.append("end", dateRange.end.toISOString());
      }

      const response = await fetch(`${this.baseUrl}/metrics?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio metrics");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch portfolio metrics:", error);
      return this.getMockPortfolioMetrics();
    }
  }

  // Get device analytics
  async getDeviceAnalytics(portfolioId: string): Promise<DeviceAnalytics> {
    try {
      const response = await fetch(
        `${this.baseUrl}/devices?portfolioId=${portfolioId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch device analytics");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch device analytics:", error);
      return this.getMockDeviceAnalytics();
    }
  }

  // Get CV download analytics
  async getCVDownloadAnalytics(portfolioId: string): Promise<CVDownload[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/cv-downloads?portfolioId=${portfolioId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch CV download analytics");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch CV download analytics:", error);
      return this.getMockCVDownloads();
    }
  }

  // Get portfolio views
  async getPortfolioViews(portfolioId: string): Promise<PortfolioView[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/views?portfolioId=${portfolioId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio views");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch portfolio views:", error);
      return this.getMockPortfolioViews();
    }
  }

  // Get real-time analytics
  async getRealTimeAnalytics(portfolioId: string): Promise<{
    activeUsers: number;
    currentViews: number;
    recentEvents: EngagementEvent[];
    liveActivity: LiveActivity[];
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/realtime?portfolioId=${portfolioId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch real-time analytics");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch real-time analytics:", error);
      return this.getMockRealTimeAnalytics();
    }
  }

  // Get goal tracking data
  async getGoalTracking(portfolioId: string): Promise<{
    goals: Goal[];
    progress: GoalProgress[];
    achievements: Achievement[];
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/goals?portfolioId=${portfolioId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch goal tracking");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch goal tracking:", error);
      return this.getMockGoalTracking();
    }
  }

  // Private methods
  private async trackEvent(event: EngagementEvent): Promise<void> {
    if (this.isOnline) {
      try {
        await fetch(`${this.baseUrl}/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        });
      } catch (error) {
        console.error("Failed to track event:", error);
        this.eventQueue.push(event);
      }
    } else {
      this.eventQueue.push(event);
    }
  }

  private async flushEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch(`${this.baseUrl}/events/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.error("Failed to flush event queue:", error);
      this.eventQueue.unshift(...events);
    }
  }

  private setupPerformanceMonitoring(): void {
    // Monitor page load times
    window.addEventListener("load", () => {
      const loadTime = performance.now();
      this.trackPerformanceMetric("page_load_time", loadTime);
    });

    // Monitor Core Web Vitals
    if ("web-vitals" in window) {
      // This would be implemented with the web-vitals library
      this.trackWebVitals();
    }
  }

  private setupCrossDeviceTracking(): void {
    // Generate or retrieve cross-device identifier
    const crossDeviceId = this.getCrossDeviceId();

    // Store in localStorage for cross-device tracking
    localStorage.setItem("cross_device_id", crossDeviceId);
  }

  private getCrossDeviceId(): string {
    let crossDeviceId = localStorage.getItem("cross_device_id");
    if (!crossDeviceId) {
      crossDeviceId = this.generateCrossDeviceId();
    }
    return crossDeviceId;
  }

  private generateCrossDeviceId(): string {
    return (
      "cd_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
    );
  }

  private generateEventId(): string {
    return (
      "evt_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
    );
  }

  private trackPerformanceMetric(metric: string, value: number): void {
    // Track performance metrics
    console.log(`Performance metric: ${metric} = ${value}ms`);
  }

  private trackWebVitals(): void {
    // Implementation for Core Web Vitals tracking
    console.log("Web Vitals tracking initialized");
  }

  // Mock data methods
  private getMockPortfolioMetrics(): PortfolioMetrics {
    return {
      totalViews: 12340,
      uniqueVisitors: 5670,
      totalDownloads: 234,
      totalInteractions: 4560,
      averageSessionDuration: 245,
      bounceRate: 23.4,
      conversionRate: 4.2,
      topCountries: [
        { country: "United States", visitors: 2340, percentage: 41.3 },
        { country: "Canada", visitors: 1890, percentage: 33.3 },
        { country: "United Kingdom", visitors: 890, percentage: 15.7 },
        { country: "Germany", visitors: 340, percentage: 6.0 },
        { country: "Australia", visitors: 200, percentage: 3.5 },
      ],
      topDevices: [
        { device: "Desktop", visitors: 3450, percentage: 60.8 },
        { device: "Mobile", visitors: 1890, percentage: 33.3 },
        { device: "Tablet", visitors: 330, percentage: 5.8 },
      ],
      topBrowsers: [
        { browser: "Chrome", visitors: 3450, percentage: 60.8 },
        { browser: "Safari", visitors: 1890, percentage: 33.3 },
        { browser: "Firefox", visitors: 234, percentage: 4.1 },
        { browser: "Edge", visitors: 96, percentage: 1.7 },
      ],
      topOperatingSystems: [
        { os: "Windows", visitors: 2340, percentage: 41.3 },
        { os: "macOS", visitors: 1890, percentage: 33.3 },
        { os: "iOS", visitors: 890, percentage: 15.7 },
        { os: "Android", visitors: 340, percentage: 6.0 },
        { os: "Linux", visitors: 200, percentage: 3.5 },
      ],
      trafficSources: [
        { source: "Direct", visitors: 2340, percentage: 41.3 },
        { source: "Google", visitors: 1890, percentage: 33.3 },
        { source: "LinkedIn", visitors: 890, percentage: 15.7 },
        { source: "GitHub", visitors: 340, percentage: 6.0 },
        { source: "Twitter", visitors: 200, percentage: 3.5 },
      ],
      lastUpdated: new Date(),
    };
  }

  private getMockDeviceAnalytics(): DeviceAnalytics {
    return {
      totalDevices: 12340,
      deviceBreakdown: [
        { device: "Desktop", count: 7500, percentage: 60.8 },
        { device: "Mobile", count: 4100, percentage: 33.2 },
        { device: "Tablet", count: 740, percentage: 6.0 },
      ],
      browserBreakdown: [
        { browser: "Chrome", count: 7500, percentage: 60.8 },
        { browser: "Safari", count: 4100, percentage: 33.2 },
        { browser: "Firefox", count: 500, percentage: 4.1 },
        { browser: "Edge", count: 240, percentage: 1.9 },
      ],
      osBreakdown: [
        { os: "Windows", count: 5100, percentage: 41.3 },
        { os: "macOS", count: 4100, percentage: 33.2 },
        { os: "iOS", count: 2000, percentage: 16.2 },
        { os: "Android", count: 900, percentage: 7.3 },
        { os: "Linux", count: 240, percentage: 1.9 },
      ],
      screenSizes: [
        { size: "1920x1080", count: 3000, percentage: 24.3 },
        { size: "1366x768", count: 2500, percentage: 20.3 },
        { size: "375x667", count: 2000, percentage: 16.2 },
        { size: "414x896", count: 1500, percentage: 12.2 },
        { size: "1440x900", count: 1000, percentage: 8.1 },
      ],
      lastUpdated: new Date(),
    };
  }

  private getMockCVDownloads(): CVDownload[] {
    return [
      {
        id: "1",
        portfolioId: "portfolio-1",
        cvType: "Professional",
        format: "PDF",
        downloadedAt: new Date(Date.now() - 86400000),
        device: "Desktop",
        browser: "Chrome",
        country: "United States",
        city: "San Francisco",
        ipAddress: "192.168.1.1",
      },
      {
        id: "2",
        portfolioId: "portfolio-1",
        cvType: "Creative",
        format: "PDF",
        downloadedAt: new Date(Date.now() - 172800000),
        device: "Mobile",
        browser: "Safari",
        country: "Canada",
        city: "Toronto",
        ipAddress: "192.168.1.2",
      },
    ];
  }

  private getMockPortfolioViews(): PortfolioView[] {
    return [
      {
        id: "1",
        portfolioId: "portfolio-1",
        viewedAt: new Date(Date.now() - 3600000),
        device: "Desktop",
        browser: "Chrome",
        os: "Windows",
        country: "United States",
        city: "San Francisco",
        referrer: "https://google.com",
        source: "Google",
        medium: "organic",
        campaign: null,
        sessionDuration: 245,
        pagesViewed: 3,
        ipAddress: "192.168.1.1",
      },
    ];
  }

  private getMockRealTimeAnalytics() {
    return {
      activeUsers: 23,
      currentViews: 156,
      recentEvents: [],
      liveActivity: [
        {
          id: "1",
          type: "portfolio_view",
          portfolioId: "portfolio-1",
          timestamp: new Date(Date.now() - 300000),
          location: "San Francisco, CA",
          device: "Desktop",
        },
        {
          id: "2",
          type: "cv_download",
          portfolioId: "portfolio-1",
          timestamp: new Date(Date.now() - 600000),
          location: "New York, NY",
          device: "Mobile",
        },
      ],
    };
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
}

export const portfolioTrackingService = new PortfolioTrackingService();
