import { useState, useCallback } from "react";
import GitHubService, { RepositoryAnalysis } from "../services/githubService";

interface UseGitHubAnalysisReturn {
  isAnalyzing: boolean;
  analysis: RepositoryAnalysis | null;
  error: string | null;
  analyzeRepository: (url: string) => Promise<void>;
  clearAnalysis: () => void;
}

export const useGitHubAnalysis = (): UseGitHubAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeRepository = useCallback(async (url: string) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const githubService = new GitHubService();
      const result = await githubService.analyzeRepository(url);
      setAnalysis(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze repository";
      setError(errorMessage);
      console.error("GitHub analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    analysis,
    error,
    analyzeRepository,
    clearAnalysis,
  };
};
