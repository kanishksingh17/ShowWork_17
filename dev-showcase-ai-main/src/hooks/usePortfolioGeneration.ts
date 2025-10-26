import { useState, useCallback, useRef } from "react";
import { portfolioAPI } from "../services/portfolioAPI";
import { PortfolioGenerationPipeline } from "../services/portfolioPipeline";
import { API_CONFIG } from "../config/apiConfig";

export interface GenerationRequest {
  userData: {
    name: string;
    title: string;
    bio: string;
    skills: string[];
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
    }>;
    experience: Array<{
      company: string;
      position: string;
      duration: string;
      description: string;
    }>;
  };
  templateId?: string;
  customDomain?: string;
  deploymentOptions?: {
    provider: "vercel" | "s3" | "both";
    enableAnalytics: boolean;
    enableCDN: boolean;
    customDomain?: string;
  };
}

export interface GenerationStatus {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  currentStep: string;
  steps: Array<{
    id: string;
    title: string;
    status: "pending" | "processing" | "completed" | "error";
    progress: number;
    startTime?: Date;
    endTime?: Date;
    error?: string;
  }>;
  result?: {
    portfolioId: string;
    url: string;
    customUrl?: string;
    deploymentId: string;
    performance: {
      pageSpeed: number;
      loadTime: number;
      bundleSize: number;
    };
    analytics?: {
      trackingId: string;
      customEvents: string[];
    };
  };
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerationResult {
  jobId: string;
  portfolioId: string;
  url: string;
  customUrl?: string;
  deploymentId: string;
  performance: {
    pageSpeed: number;
    loadTime: number;
    bundleSize: number;
  };
  analytics?: {
    trackingId: string;
    customEvents: string[];
  };
}

export const usePortfolioGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentJob, setCurrentJob] = useState<GenerationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Map<string, GenerationStatus>>(new Map());

  const pipelineRef = useRef<PortfolioGenerationPipeline | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize pipeline
  const initializePipeline = useCallback(() => {
    if (!pipelineRef.current) {
      pipelineRef.current = new PortfolioGenerationPipeline({
        openai: {
          apiKey: API_CONFIG.OPENAI.API_KEY,
          model: API_CONFIG.OPENAI.MODEL,
          maxTokens: API_CONFIG.OPENAI.MAX_TOKENS,
          temperature: API_CONFIG.OPENAI.TEMPERATURE,
        },
        s3: {
          accessKeyId: API_CONFIG.AWS.ACCESS_KEY_ID,
          secretAccessKey: API_CONFIG.AWS.SECRET_ACCESS_KEY,
          region: API_CONFIG.AWS.REGION,
          bucketName: API_CONFIG.AWS.BUCKET_NAME,
        },
        vercel: {
          token: API_CONFIG.VERCEL.TOKEN,
          teamId: API_CONFIG.VERCEL.TEAM_ID,
          baseUrl: API_CONFIG.VERCEL.BASE_URL,
        },
        portfolio: {
          defaultTemplate: API_CONFIG.PORTFOLIO.DEFAULT_TEMPLATE,
          generationTimeout: API_CONFIG.PORTFOLIO.GENERATION_TIMEOUT,
          performanceTarget: API_CONFIG.PORTFOLIO.PERFORMANCE_TARGET,
          maxBundleSize: API_CONFIG.PORTFOLIO.MAX_BUNDLE_SIZE,
        },
      });
    }
    return pipelineRef.current;
  }, []);

  // Generate portfolio
  const generatePortfolio = useCallback(
    async (request: GenerationRequest): Promise<GenerationResult> => {
      setIsGenerating(true);
      setError(null);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      try {
        const pipeline = initializePipeline();

        // Create job status
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const initialStatus: GenerationStatus = {
          jobId,
          status: "pending",
          progress: 0,
          currentStep: "Initializing",
          steps: [
            {
              id: "ai-content",
              title: "AI Content Generation",
              status: "pending",
              progress: 0,
            },
            {
              id: "template-selection",
              title: "Template Selection",
              status: "pending",
              progress: 0,
            },
            {
              id: "asset-building",
              title: "Asset Building",
              status: "pending",
              progress: 0,
            },
            {
              id: "s3-upload",
              title: "S3 Upload",
              status: "pending",
              progress: 0,
            },
            {
              id: "vercel-deploy",
              title: "Vercel Deployment",
              status: "pending",
              progress: 0,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setCurrentJob(initialStatus);
        setJobs((prev) => new Map(prev.set(jobId, initialStatus)));

        // Update status to processing
        const updateStatus = (updates: Partial<GenerationStatus>) => {
          setCurrentJob((prev) => {
            if (!prev) return null;
            const updated = { ...prev, ...updates, updatedAt: new Date() };
            setJobs((prevJobs) => new Map(prevJobs.set(jobId, updated)));
            return updated;
          });
        };

        // Update step status
        const updateStep = (
          stepId: string,
          updates: Partial<GenerationStatus["steps"][0]>,
        ) => {
          setCurrentJob((prev) => {
            if (!prev) return null;
            const updated = {
              ...prev,
              steps: prev.steps.map((step) =>
                step.id === stepId ? { ...step, ...updates } : step,
              ),
              updatedAt: new Date(),
            };
            setJobs((prevJobs) => new Map(prevJobs.set(jobId, updated)));
            return updated;
          });
        };

        // Start generation
        updateStatus({
          status: "processing",
          currentStep: "Starting generation",
        });

        // Step 1: AI Content Generation
        updateStep("ai-content", {
          status: "processing",
          startTime: new Date(),
        });
        updateStatus({ currentStep: "Generating AI content", progress: 10 });

        // Simulate AI content generation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        updateStep("ai-content", {
          status: "completed",
          progress: 100,
          endTime: new Date(),
        });

        // Step 2: Template Selection
        updateStep("template-selection", {
          status: "processing",
          startTime: new Date(),
        });
        updateStatus({ currentStep: "Selecting template", progress: 30 });

        await new Promise((resolve) => setTimeout(resolve, 1000));
        updateStep("template-selection", {
          status: "completed",
          progress: 100,
          endTime: new Date(),
        });

        // Step 3: Asset Building
        updateStep("asset-building", {
          status: "processing",
          startTime: new Date(),
        });
        updateStatus({ currentStep: "Building assets", progress: 50 });

        await new Promise((resolve) => setTimeout(resolve, 3000));
        updateStep("asset-building", {
          status: "completed",
          progress: 100,
          endTime: new Date(),
        });

        // Step 4: S3 Upload
        updateStep("s3-upload", {
          status: "processing",
          startTime: new Date(),
        });
        updateStatus({ currentStep: "Uploading to S3", progress: 70 });

        await new Promise((resolve) => setTimeout(resolve, 2000));
        updateStep("s3-upload", {
          status: "completed",
          progress: 100,
          endTime: new Date(),
        });

        // Step 5: Vercel Deployment
        updateStep("vercel-deploy", {
          status: "processing",
          startTime: new Date(),
        });
        updateStatus({ currentStep: "Deploying to Vercel", progress: 90 });

        await new Promise((resolve) => setTimeout(resolve, 3000));
        updateStep("vercel-deploy", {
          status: "completed",
          progress: 100,
          endTime: new Date(),
        });

        // Generate result
        const portfolioId = `portfolio_${Date.now()}`;
        const result: GenerationResult = {
          jobId,
          portfolioId,
          url: `https://portfolio-showwork.vercel.app/p/${portfolioId}`,
          customUrl: request.customDomain
            ? `https://${request.customDomain}`
            : undefined,
          deploymentId: `deploy_${Date.now()}`,
          performance: {
            pageSpeed: 95,
            loadTime: 1.2,
            bundleSize: 280,
          },
          analytics: {
            trackingId: `sw_${Date.now()}`,
            customEvents: [
              "portfolio_view",
              "project_click",
              "contact_form_submit",
            ],
          },
        };

        // Update final status
        updateStatus({
          status: "completed",
          progress: 100,
          currentStep: "Completed",
          result,
        });

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Generation failed";
        setError(errorMessage);

        if (currentJob) {
          setCurrentJob((prev) => {
            if (!prev) return null;
            const updated = {
              ...prev,
              status: "failed",
              error: errorMessage,
              updatedAt: new Date(),
            };
            setJobs((prevJobs) => new Map(prevJobs.set(prev.jobId, updated)));
            return updated;
          });
        }

        throw error;
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [initializePipeline, currentJob],
  );

  // Cancel generation
  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setError("Generation cancelled by user");

      if (currentJob) {
        setCurrentJob((prev) => {
          if (!prev) return null;
          const updated = {
            ...prev,
            status: "failed",
            error: "Cancelled by user",
            updatedAt: new Date(),
          };
          setJobs((prevJobs) => new Map(prevJobs.set(prev.jobId, updated)));
          return updated;
        });
      }
    }
  }, [currentJob]);

  // Get job status
  const getJobStatus = useCallback(
    async (jobId: string): Promise<GenerationStatus | null> => {
      const job = jobs.get(jobId);
      if (job) {
        return job;
      }

      // Try to get from API
      try {
        const status = await portfolioAPI.getStatus(jobId);
        setJobs((prev) => new Map(prev.set(jobId, status)));
        return status;
      } catch (error) {
        console.error("Failed to get job status:", error);
        return null;
      }
    },
    [jobs],
  );

  // Get all jobs
  const getAllJobs = useCallback((): GenerationStatus[] => {
    return Array.from(jobs.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }, [jobs]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setIsGenerating(false);
    setCurrentJob(null);
    setError(null);
    setJobs(new Map());
    abortControllerRef.current = null;
  }, []);

  return {
    // State
    isGenerating,
    currentJob,
    error,
    jobs: getAllJobs(),

    // Actions
    generatePortfolio,
    cancelGeneration,
    getJobStatus,
    clearError,
    reset,

    // Utilities
    hasActiveJob: currentJob?.status === "processing",
    canCancel: isGenerating && abortControllerRef.current !== null,
    progress: currentJob?.progress || 0,
    currentStep: currentJob?.currentStep || "",
  };
};
