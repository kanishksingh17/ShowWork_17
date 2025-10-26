import { useEffect, useRef } from "react";
import { initializeTracker, getTracker } from "@/lib/realTimeTracker";

interface UseRealTimeTrackingProps {
  userId?: string;
  autoInitialize?: boolean;
}

export function useRealTimeTracking({
  userId,
  autoInitialize = true,
}: UseRealTimeTrackingProps = {}) {
  const trackerRef = useRef<any>(null);

  useEffect(() => {
    if (autoInitialize) {
      trackerRef.current = initializeTracker(userId);
    }
  }, [userId, autoInitialize]);

  const trackEvent = (
    type: string,
    element: string,
    properties: Record<string, any> = {},
  ) => {
    const tracker = getTracker();
    if (tracker) {
      tracker.trackCustomEvent(type, element, properties);
    }
  };

  const trackProjectView = (projectId: string, projectName: string) => {
    trackEvent("view", "project", { projectId, projectName });
  };

  const trackProjectClick = (projectId: string, projectName: string) => {
    trackEvent("click", "project", { projectId, projectName });
  };

  const trackCVDownload = (cvType: string, format: string) => {
    trackEvent("download", "cv", { cvType, format });
  };

  const trackContactSubmission = (formType: string) => {
    trackEvent("contact", "contact-form", { formType });
  };

  const trackSocialClick = (platform: string, url: string) => {
    trackEvent("click", "social-media", { platform, url });
  };

  const trackDemoClick = (projectId: string, demoUrl: string) => {
    trackEvent("click", "demo", { projectId, demoUrl });
  };

  return {
    trackEvent,
    trackProjectView,
    trackProjectClick,
    trackCVDownload,
    trackContactSubmission,
    trackSocialClick,
    trackDemoClick,
    tracker: trackerRef.current,
  };
}
