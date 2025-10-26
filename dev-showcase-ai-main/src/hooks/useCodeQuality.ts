// Custom hook for code quality analysis

import { useState, useCallback, useRef } from "react";
import { CodeQualityMetrics, GitHubRepositoryInfo } from "@/types/project";
import { codeQualityService } from "@/services/codeQualityService";

interface UseCodeQualityOptions {
  onError?: (error: string) => void;
  onSuccess?: (metrics: CodeQualityMetrics) => void;
}

interface UseCodeQualityReturn {
  metrics: CodeQualityMetrics | null;
  repositoryInfo: GitHubRepositoryInfo | null;
  isAnalyzing: boolean;
  lastAnalyzed: Date | null;
  analyzeRepository: (githubUrl: string) => Promise<CodeQualityMetrics>;
  getRepositoryInfo: (githubUrl: string) => Promise<GitHubRepositoryInfo>;
  clearCache: () => void;
  getCacheSize: () => number;
}

export function useCodeQuality({
  onError,
  onSuccess,
}: UseCodeQualityOptions = {}): UseCodeQualityReturn {
  const [metrics, setMetrics] = useState<CodeQualityMetrics | null>(null);
  const [repositoryInfo, setRepositoryInfo] =
    useState<GitHubRepositoryInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const analysisCacheRef = useRef<
    Map<string, { metrics: CodeQualityMetrics; timestamp: number }>
  >(new Map());
  const cacheTimeout = 5 * 60 * 1000; // 5 minutes

  // Analyze repository
  const analyzeRepository = useCallback(
    async (githubUrl: string): Promise<CodeQualityMetrics> => {
      try {
        setIsAnalyzing(true);

        // Check cache first
        const cached = analysisCacheRef.current.get(githubUrl);
        if (cached && Date.now() - cached.timestamp < cacheTimeout) {
          setMetrics(cached.metrics);
          setLastAnalyzed(new Date(cached.timestamp));
          onSuccess?.(cached.metrics);
          return cached.metrics;
        }

        // Analyze repository
        const result = await codeQualityService.analyzeCodeQuality(githubUrl);

        // Cache the result
        analysisCacheRef.current.set(githubUrl, {
          metrics: result,
          timestamp: Date.now(),
        });

        setMetrics(result);
        setLastAnalyzed(new Date());
        onSuccess?.(result);

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Analysis failed";
        onError?.(errorMessage);
        throw error;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [onError, onSuccess, cacheTimeout],
  );

  // Get repository information
  const getRepositoryInfo = useCallback(
    async (githubUrl: string): Promise<GitHubRepositoryInfo> => {
      try {
        const info = await codeQualityService.getRepositoryInfo(githubUrl);
        setRepositoryInfo(info);
        return info;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to get repository info";
        onError?.(errorMessage);
        throw error;
      }
    },
    [onError],
  );

  // Clear cache
  const clearCache = useCallback(() => {
    analysisCacheRef.current.clear();
    codeQualityService.clearCache();
  }, []);

  // Get cache size
  const getCacheSize = useCallback(() => {
    return analysisCacheRef.current.size + codeQualityService.getCacheSize();
  }, []);

  return {
    metrics,
    repositoryInfo,
    isAnalyzing,
    lastAnalyzed,
    analyzeRepository,
    getRepositoryInfo,
    clearCache,
    getCacheSize,
  };
}
