// Core Portfolio Generation API - Ties together all systems
import {
  TemplateMetadata,
  TEMPLATE_DATABASE,
  selectOptimalTemplate,
} from "./templateEngine";
import {
  EnhancedContent,
  processUserDataWithAI,
  RawUserData,
} from "./aiProcessor";
import { PortfolioCanvas } from "../components/3D/PortfolioCanvas";
import {
  DeploymentConfig,
  deployPortfolio,
  DeploymentResult,
} from "./deploymentService";

export interface GenerationRequest {
  userId: string;
  templateId?: string;
  userData?: RawUserData;
  preferences?: {
    customDomain?: string;
    cdnProvider?: "aws" | "cloudflare" | "vercel";
    enableAnalytics?: boolean;
  };
}

export interface GenerationResponse {
  jobId: string;
  estimatedTime: number;
  statusUrl: string;
  portfolioUrl?: string;
}

export interface GenerationStatus {
  jobId: string;
  status:
    | "queued"
    | "processing"
    | "generating"
    | "deploying"
    | "completed"
    | "failed";
  progress: number;
  currentStep: string;
  result?: {
    portfolioUrl: string;
    customUrl?: string;
    performance: any;
  };
  error?: string;
}

// Core generation API
export class PortfolioGenerationAPI {
  private jobs: Map<string, GenerationStatus> = new Map();
  private deploymentService: any;

  constructor() {
    this.deploymentService = {
      deployPortfolio: async (config: DeploymentConfig) => {
        // Simulate deployment
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return {
          url: `https://portfolio.showwork.com/p/${config.portfolioId}`,
          customUrl: config.customDomain
            ? `https://${config.customDomain}`
            : undefined,
          status: "completed" as const,
          performance: {
            pageSpeed: 95,
            loadTime: 1.5,
            bundleSize: 300,
          },
          analytics: {
            trackingId: `sw_${config.portfolioId}_${Date.now()}`,
            customEvents: [
              "portfolio_view",
              "project_click",
              "contact_form_submit",
            ],
          },
        };
      },
    };
  }

  async generatePortfolio(
    request: GenerationRequest,
  ): Promise<GenerationResponse> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize job status
    this.jobs.set(jobId, {
      jobId,
      status: "queued",
      progress: 0,
      currentStep: "Initializing generation...",
    });

    // Start generation process asynchronously
    this.processGeneration(jobId, request);

    return {
      jobId,
      estimatedTime: 25, // seconds
      statusUrl: `/api/portfolios/status/${jobId}`,
    };
  }

  async getGenerationStatus(jobId: string): Promise<GenerationStatus> {
    const status = this.jobs.get(jobId);
    if (!status) {
      throw new Error("Job not found");
    }
    return status;
  }

  private async processGeneration(jobId: string, request: GenerationRequest) {
    try {
      const status = this.jobs.get(jobId)!;

      // Step 1: Data Collection & Processing
      status.status = "processing";
      status.progress = 10;
      status.currentStep = "Collecting user data...";
      this.updateJobStatus(jobId, status);

      const userData = await this.collectUserData(request);

      // Step 2: AI Content Enhancement
      status.progress = 30;
      status.currentStep = "Enhancing content with AI...";
      this.updateJobStatus(jobId, status);

      const enhancedContent = await processUserDataWithAI(userData);

      // Step 3: Template Selection
      status.progress = 50;
      status.currentStep = "Selecting optimal template...";
      this.updateJobStatus(jobId, status);

      const template = await this.selectTemplate(
        request.templateId,
        enhancedContent,
      );

      // Step 4: 3D Scene Generation
      status.status = "generating";
      status.progress = 70;
      status.currentStep = "Generating 3D portfolio scene...";
      this.updateJobStatus(jobId, status);

      const portfolioId = `portfolio_${request.userId}_${Date.now()}`;

      // Step 5: Deployment
      status.status = "deploying";
      status.progress = 90;
      status.currentStep = "Deploying portfolio...";
      this.updateJobStatus(jobId, status);

      const deploymentConfig: DeploymentConfig = {
        portfolioId,
        templateId: template.id,
        content: enhancedContent,
        customDomain: request.preferences?.customDomain,
        cdnProvider: request.preferences?.cdnProvider || "cloudflare",
        optimization: {
          enableWebP: true,
          enableCompression: true,
          enableMinification: true,
          enableCaching: true,
        },
      };

      const deploymentResult =
        await this.deploymentService.deployPortfolio(deploymentConfig);

      // Step 6: Completion
      status.status = "completed";
      status.progress = 100;
      status.currentStep = "Portfolio generated successfully!";
      status.result = {
        portfolioUrl: deploymentResult.url,
        customUrl: deploymentResult.customUrl,
        performance: deploymentResult.performance,
      };
      this.updateJobStatus(jobId, status);
    } catch (error) {
      const status = this.jobs.get(jobId)!;
      status.status = "failed";
      status.error = error.message;
      this.updateJobStatus(jobId, status);
    }
  }

  private async collectUserData(
    request: GenerationRequest,
  ): Promise<RawUserData> {
    // Simulate data collection
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (request.userData) {
      return request.userData;
    }

    // Mock data collection from external platforms
    return {
      linkedin: {
        name: "John Doe",
        title: "Senior Software Engineer",
        bio: "Experienced developer with expertise in React and Node.js",
        skills: ["React", "Node.js", "TypeScript", "AWS"],
        experience: [
          {
            company: "Tech Corp",
            position: "Senior Software Engineer",
            duration: "2022 - Present",
            description: "Leading development of scalable web applications",
          },
        ],
      },
      github: {
        projects: [
          {
            name: "ecommerce-platform",
            description: "Full-stack e-commerce solution",
            technologies: ["React", "Node.js", "MongoDB"],
            stars: 45,
            forks: 12,
            language: "JavaScript",
          },
        ],
      },
    };
  }

  private async selectTemplate(
    templateId?: string,
    content?: EnhancedContent,
  ): Promise<TemplateMetadata> {
    if (templateId) {
      const template = TEMPLATE_DATABASE.find((t) => t.id === templateId);
      if (template) return template;
    }

    if (content) {
      const recommendations = selectOptimalTemplate(content, TEMPLATE_DATABASE);
      return recommendations[0].template;
    }

    // Default template
    return TEMPLATE_DATABASE[0];
  }

  private updateJobStatus(jobId: string, status: GenerationStatus) {
    this.jobs.set(jobId, status);

    // In a real implementation, this would emit WebSocket events
    console.log(
      `Job ${jobId}: ${status.status} - ${status.currentStep} (${status.progress}%)`,
    );
  }
}

// WebSocket for real-time generation updates
export class GenerationWebSocket {
  private ws: WebSocket | null = null;
  private callbacks: Map<string, Function[]> = new Map();

  connect(jobId: string) {
    this.ws = new WebSocket(`wss://api.showwork.com/generation/${jobId}`);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit("progress", data);
    };

    this.ws.onclose = () => {
      console.log("Generation tracking disconnected");
    };
  }

  on(event: string, callback: Function) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  private emit(event: string, data: any) {
    const callbacks = this.callbacks.get(event) || [];
    callbacks.forEach((callback) => callback(data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Performance tracking system
export const trackPortfolioMetrics = {
  generationSpeed: async (startTime: number) => {
    const duration = Date.now() - startTime;
    console.log(`Generation completed in ${duration}ms`);

    // Alert if generation takes >30 seconds
    if (duration > 30000) {
      console.warn("Slow generation detected:", duration);
    }
  },

  userSatisfaction: async (portfolioId: string, rating: number) => {
    console.log(`User rating for portfolio ${portfolioId}: ${rating}/5`);
  },
};

// Main API endpoints (simulated)
export const portfolioAPI = {
  // POST /api/portfolios/generate
  generate: async (request: GenerationRequest): Promise<GenerationResponse> => {
    const api = new PortfolioGenerationAPI();
    return await api.generatePortfolio(request);
  },

  // GET /api/portfolios/status/:jobId
  getStatus: async (jobId: string): Promise<GenerationStatus> => {
    const api = new PortfolioGenerationAPI();
    return await api.getGenerationStatus(jobId);
  },

  // GET /api/portfolios/:portfolioId
  getPortfolio: async (portfolioId: string) => {
    // Return portfolio data
    return {
      id: portfolioId,
      name: "John Doe",
      title: "Senior Software Engineer",
      url: `https://portfolio.showwork.com/p/${portfolioId}`,
      performance: {
        pageSpeed: 95,
        loadTime: 1.5,
        bundleSize: 300,
      },
    };
  },
};

// Export the main generation function
export const generatePortfolio = async (
  request: GenerationRequest,
): Promise<GenerationResponse> => {
  return await portfolioAPI.generate(request);
};
