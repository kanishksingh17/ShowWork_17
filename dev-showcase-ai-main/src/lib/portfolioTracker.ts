/**
 * Portfolio Tracking Script
 * This script should be embedded in portfolio pages to track user interactions
 */

interface TrackingConfig {
  portfolioId: string;
  userId?: string;
  apiEndpoint: string;
  enableCrossDeviceTracking: boolean;
  enablePerformanceTracking: boolean;
  enableGoalTracking: boolean;
}

interface TrackingEvent {
  type: string;
  properties: Record<string, any>;
  timestamp: Date;
}

class PortfolioTracker {
  private config: TrackingConfig;
  private eventQueue: TrackingEvent[] = [];
  private sessionId: string;
  private crossDeviceId: string;
  private isOnline: boolean;

  constructor(config: TrackingConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.crossDeviceId = this.getCrossDeviceId();
    this.isOnline = navigator.onLine;

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

    // Track page load
    this.trackPageLoad();

    // Set up performance monitoring
    if (this.config.enablePerformanceTracking) {
      this.setupPerformanceTracking();
    }

    // Set up cross-device tracking
    if (this.config.enableCrossDeviceTracking) {
      this.setupCrossDeviceTracking();
    }

    // Set up goal tracking
    if (this.config.enableGoalTracking) {
      this.setupGoalTracking();
    }
  }

  private trackPageLoad() {
    const pageLoadData = {
      type: "portfolio_view",
      properties: {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date(),
        sessionId: this.sessionId,
        crossDeviceId: this.crossDeviceId,
      },
    };

    this.trackEvent(pageLoadData);
  }

  private setupPerformanceTracking() {
    // Track Core Web Vitals
    if ("web-vitals" in window) {
      // This would be implemented with the web-vitals library
      this.trackWebVitals();
    }

    // Track page load time
    window.addEventListener("load", () => {
      const loadTime = performance.now();
      this.trackEvent({
        type: "performance_metric",
        properties: {
          metric: "page_load_time",
          value: loadTime,
          timestamp: new Date(),
        },
      });
    });

    // Track resource loading times
    this.trackResourceTiming();
  }

  private setupCrossDeviceTracking() {
    // Store cross-device identifier
    localStorage.setItem("portfolio_cross_device_id", this.crossDeviceId);

    // Track cross-device session
    this.trackEvent({
      type: "cross_device_session",
      properties: {
        crossDeviceId: this.crossDeviceId,
        sessionId: this.sessionId,
        timestamp: new Date(),
      },
    });
  }

  private setupGoalTracking() {
    // Track CV downloads
    this.trackCVDownloads();

    // Track project interactions
    this.trackProjectInteractions();

    // Track contact form submissions
    this.trackContactSubmissions();

    // Track social media clicks
    this.trackSocialMediaClicks();
  }

  private trackCVDownloads() {
    // Track CV download buttons
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.matches("[data-cv-download]")) {
        const cvType = target.getAttribute("data-cv-type") || "default";
        const format = target.getAttribute("data-cv-format") || "pdf";

        this.trackEvent({
          type: "cv_download",
          properties: {
            cvType,
            format,
            timestamp: new Date(),
          },
        });
      }
    });
  }

  private trackProjectInteractions() {
    // Track project clicks
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.matches("[data-project-id]")) {
        const projectId = target.getAttribute("data-project-id");
        const interactionType =
          target.getAttribute("data-interaction-type") || "click";

        this.trackEvent({
          type: "project_interaction",
          properties: {
            projectId,
            interactionType,
            timestamp: new Date(),
          },
        });
      }
    });

    // Track demo clicks
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.matches("[data-demo-link]")) {
        const projectId = target.getAttribute("data-project-id");

        this.trackEvent({
          type: "demo_click",
          properties: {
            projectId,
            demoUrl: target.getAttribute("href"),
            timestamp: new Date(),
          },
        });
      }
    });

    // Track GitHub clicks
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.matches("[data-github-link]")) {
        const projectId = target.getAttribute("data-project-id");

        this.trackEvent({
          type: "github_click",
          properties: {
            projectId,
            githubUrl: target.getAttribute("href"),
            timestamp: new Date(),
          },
        });
      }
    });
  }

  private trackContactSubmissions() {
    // Track contact form submissions
    document.addEventListener("submit", (event) => {
      const form = event.target as HTMLFormElement;
      if (form.matches("[data-contact-form]")) {
        const formType = form.getAttribute("data-form-type") || "contact";

        this.trackEvent({
          type: "contact_submission",
          properties: {
            formType,
            timestamp: new Date(),
          },
        });
      }
    });
  }

  private trackSocialMediaClicks() {
    // Track social media clicks
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.matches("[data-social-link]")) {
        const platform = target.getAttribute("data-social-platform");
        const linkType = target.getAttribute("data-link-type") || "profile";

        this.trackEvent({
          type: "social_media_click",
          properties: {
            platform,
            linkType,
            url: target.getAttribute("href"),
            timestamp: new Date(),
          },
        });
      }
    });
  }

  private trackWebVitals() {
    // Implementation for Core Web Vitals tracking
    // This would typically use the web-vitals library
    console.log("Web Vitals tracking initialized");
  }

  private trackResourceTiming() {
    // Track resource loading performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "resource") {
          this.trackEvent({
            type: "resource_timing",
            properties: {
              name: entry.name,
              duration: entry.duration,
              size: (entry as any).transferSize || 0,
              timestamp: new Date(),
            },
          });
        }
      }
    });

    observer.observe({ entryTypes: ["resource"] });
  }

  private trackEvent(event: TrackingEvent) {
    const enrichedEvent = {
      ...event,
      properties: {
        ...event.properties,
        portfolioId: this.config.portfolioId,
        userId: this.config.userId,
        sessionId: this.sessionId,
        crossDeviceId: this.crossDeviceId,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date(),
      },
    };

    if (this.isOnline) {
      this.sendEvent(enrichedEvent);
    } else {
      this.eventQueue.push(enrichedEvent);
    }
  }

  private async sendEvent(event: TrackingEvent) {
    try {
      await fetch(`${this.config.apiEndpoint}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error("Failed to send tracking event:", error);
      this.eventQueue.push(event);
    }
  }

  private async flushEventQueue() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch(`${this.config.apiEndpoint}/events/batch`, {
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

  private generateSessionId(): string {
    return (
      "session_" +
      Math.random().toString(36).substr(2, 9) +
      Date.now().toString(36)
    );
  }

  private getCrossDeviceId(): string {
    let crossDeviceId = localStorage.getItem("portfolio_cross_device_id");
    if (!crossDeviceId) {
      crossDeviceId =
        "cd_" +
        Math.random().toString(36).substr(2, 9) +
        Date.now().toString(36);
    }
    return crossDeviceId;
  }

  // Public methods for manual tracking
  public trackCustomEvent(type: string, properties: Record<string, any>) {
    this.trackEvent({
      type,
      properties,
      timestamp: new Date(),
    });
  }

  public trackGoal(goalType: string, goalValue: number) {
    this.trackEvent({
      type: "goal_completion",
      properties: {
        goalType,
        goalValue,
        timestamp: new Date(),
      },
    });
  }

  public trackConversion(conversionType: string, conversionValue?: number) {
    this.trackEvent({
      type: "conversion",
      properties: {
        conversionType,
        conversionValue,
        timestamp: new Date(),
      },
    });
  }
}

// Initialize tracking when script loads
export function initializePortfolioTracking(config: TrackingConfig) {
  return new PortfolioTracker(config);
}

// Export for use in React components
export { PortfolioTracker };
