import { useEffect, useRef } from "react";
import { PortfolioTracker } from "@/lib/portfolioTracker";

interface UsePortfolioTrackingProps {
  portfolioId: string;
  userId?: string;
  apiEndpoint?: string;
  enableCrossDeviceTracking?: boolean;
  enablePerformanceTracking?: boolean;
  enableGoalTracking?: boolean;
}

export function usePortfolioTracking({
  portfolioId,
  userId,
  apiEndpoint = "/api/portfolio-tracking",
  enableCrossDeviceTracking = true,
  enablePerformanceTracking = true,
  enableGoalTracking = true,
}: UsePortfolioTrackingProps) {
  const trackerRef = useRef<PortfolioTracker | null>(null);

  useEffect(() => {
    // Initialize tracker
    trackerRef.current = new PortfolioTracker({
      portfolioId,
      userId,
      apiEndpoint,
      enableCrossDeviceTracking,
      enablePerformanceTracking,
      enableGoalTracking,
    });

    return () => {
      // Cleanup if needed
      trackerRef.current = null;
    };
  }, [
    portfolioId,
    userId,
    apiEndpoint,
    enableCrossDeviceTracking,
    enablePerformanceTracking,
    enableGoalTracking,
  ]);

  const trackCustomEvent = (type: string, properties: Record<string, any>) => {
    if (trackerRef.current) {
      trackerRef.current.trackCustomEvent(type, properties);
    }
  };

  const trackGoal = (goalType: string, goalValue: number) => {
    if (trackerRef.current) {
      trackerRef.current.trackGoal(goalType, goalValue);
    }
  };

  const trackConversion = (
    conversionType: string,
    conversionValue?: number,
  ) => {
    if (trackerRef.current) {
      trackerRef.current.trackConversion(conversionType, conversionValue);
    }
  };

  return {
    trackCustomEvent,
    trackGoal,
    trackConversion,
  };
}
