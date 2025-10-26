/**
 * Hook for managing portfolio health data
 */

import { useState, useEffect, useCallback } from "react";

export interface PortfolioHealthData {
  overall: number;
  status: "Excellent" | "Good" | "Fair" | "Needs Work";
  breakdown: {
    technicalSkills: number;
    projectQuality: number;
    portfolioPresentation: number;
    experience: number;
    industryAlignment: number;
    certifications: number;
  };
  recommendedImprovements: string[];
  lastComputedAt: string;
}

export interface UsePortfolioHealthReturn {
  health: PortfolioHealthData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  recompute: () => Promise<void>;
}

export function usePortfolioHealth(): UsePortfolioHealthReturn {
  const [health, setHealth] = useState<PortfolioHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/portfolio/health", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch portfolio health");
      }

      const data = await response.json();
      setHealth(data.data);
    } catch (err) {
      console.error("Error fetching portfolio health:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch portfolio health",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const recomputeHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/portfolio/health/recompute", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to recompute portfolio health",
        );
      }

      const data = await response.json();
      setHealth(data.data);
    } catch (err) {
      console.error("Error recomputing portfolio health:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to recompute portfolio health",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchHealth();
  }, [fetchHealth]);

  const recompute = useCallback(async () => {
    await recomputeHealth();
  }, [recomputeHealth]);

  // Fetch health data on mount
  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return {
    health,
    loading,
    error,
    refresh,
    recompute,
  };
}
