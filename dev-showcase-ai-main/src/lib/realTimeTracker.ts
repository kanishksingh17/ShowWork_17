/**
 * Real-Time Portfolio Tracker
 * This tracks actual user interactions with your portfolio
 */

interface TrackingEvent {
  type: "view" | "click" | "download" | "like" | "share" | "contact";
  element: string;
  projectId?: string;
  userId?: string;
  timestamp: Date;
  properties: Record<string, any>;
}

class RealTimeTracker {
  private events: TrackingEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private isOnline: boolean;

  constructor(userId?: string) {
    this.userId = userId;
    this.sessionId = this.generateSessionId();
    this.isOnline = navigator.onLine;

    this.initializeTracking();
  }

  private initializeTracking() {
    // Track page views
    this.trackPageView();

    // Track clicks on portfolio elements
    this.trackPortfolioClicks();

    // Track downloads
    this.trackDownloads();

    // Track contact form submissions
    this.trackContactForms();

    // Set up online/offline detection
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.flushEvents();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
    });
  }

  private trackPageView() {
    this.trackEvent({
      type: "view",
      element: "portfolio-page",
      properties: {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      },
    });
  }

  private trackPortfolioClicks() {
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      // Track project clicks
      if (target.closest("[data-project-id]")) {
        const projectElement = target.closest("[data-project-id]");
        const projectId = projectElement?.getAttribute("data-project-id");

        this.trackEvent({
          type: "click",
          element: "project",
          projectId: projectId || undefined,
          properties: {
            projectName:
              projectElement?.querySelector("h3, h2, .title")?.textContent,
            clickTarget: target.tagName,
          },
        });
      }

      // Track CV download clicks
      if (target.matches("[data-cv-download], .cv-download, .download-cv")) {
        this.trackEvent({
          type: "download",
          element: "cv",
          properties: {
            cvType: target.getAttribute("data-cv-type") || "default",
            format: target.getAttribute("data-format") || "pdf",
          },
        });
      }

      // Track social media clicks
      if (
        target.matches(
          '[data-social], .social-link, a[href*="linkedin"], a[href*="github"], a[href*="twitter"]',
        )
      ) {
        const href = target.getAttribute("href") || "";
        let platform = "unknown";

        if (href.includes("linkedin")) platform = "linkedin";
        else if (href.includes("github")) platform = "github";
        else if (href.includes("twitter")) platform = "twitter";
        else if (href.includes("instagram")) platform = "instagram";

        this.trackEvent({
          type: "click",
          element: "social-media",
          properties: {
            platform,
            url: href,
          },
        });
      }

      // Track demo/live link clicks
      if (target.matches("[data-demo], .demo-link, .live-link")) {
        this.trackEvent({
          type: "click",
          element: "demo",
          properties: {
            demoUrl: target.getAttribute("href"),
          },
        });
      }
    });
  }

  private trackDownloads() {
    // Track any download events
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (target.matches("[data-download], .download, a[download]")) {
        this.trackEvent({
          type: "download",
          element: "file",
          properties: {
            fileName: target.getAttribute("download") || target.textContent,
            fileType: target.getAttribute("data-file-type") || "unknown",
          },
        });
      }
    });
  }

  private trackContactForms() {
    document.addEventListener("submit", (event) => {
      const form = event.target as HTMLFormElement;

      if (form.matches("[data-contact], .contact-form, form")) {
        this.trackEvent({
          type: "contact",
          element: "contact-form",
          properties: {
            formType: form.getAttribute("data-form-type") || "contact",
            formId: form.id || "unknown",
          },
        });
      }
    });
  }

  private trackEvent(event: Omit<TrackingEvent, "timestamp">) {
    const fullEvent: TrackingEvent = {
      ...event,
      userId: this.userId,
      timestamp: new Date(),
    };

    this.events.push(fullEvent);

    // Send to server if online
    if (this.isOnline) {
      this.sendEventToServer(fullEvent);
    }
  }

  private async sendEventToServer(event: TrackingEvent) {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error("Failed to send tracking event:", error);
    }
  }

  private async flushEvents() {
    if (this.events.length === 0) return;

    try {
      await fetch("/api/analytics/track-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events: this.events }),
      });

      this.events = [];
    } catch (error) {
      console.error("Failed to flush events:", error);
    }
  }

  private generateSessionId(): string {
    return (
      "session_" +
      Math.random().toString(36).substr(2, 9) +
      Date.now().toString(36)
    );
  }

  // Public methods
  public trackCustomEvent(
    type: string,
    element: string,
    properties: Record<string, any> = {},
  ) {
    this.trackEvent({
      type: type as any,
      element,
      properties,
    });
  }

  public getEvents(): TrackingEvent[] {
    return [...this.events];
  }

  public getSessionId(): string {
    return this.sessionId;
  }
}

// Initialize global tracker
let globalTracker: RealTimeTracker | null = null;

export function initializeTracker(userId?: string): RealTimeTracker {
  if (!globalTracker) {
    globalTracker = new RealTimeTracker(userId);
  }
  return globalTracker;
}

export function getTracker(): RealTimeTracker | null {
  return globalTracker;
}

export { RealTimeTracker };
