// Vercel Deployment API Integration - Deploys static sites with HTTPS and custom domains
export interface VercelConfig {
  token: string;
  teamId?: string;
  baseUrl?: string;
}

export interface VercelDeploymentRequest {
  name: string;
  files: Array<{
    file: string;
    data: string | Buffer;
  }>;
  projectSettings?: {
    framework?: string;
    buildCommand?: string;
    outputDirectory?: string;
    installCommand?: string;
  };
  target?: "production" | "preview";
  regions?: string[];
}

export interface VercelDeploymentResponse {
  id: string;
  url: string;
  name: string;
  meta: {
    [key: string]: any;
  };
  regions: string[];
  target: string;
  alias: string[];
  projectId: string;
  projectSettings: {
    framework?: string;
    buildCommand?: string;
    outputDirectory?: string;
    installCommand?: string;
  };
  createdAt: number;
  buildingAt: number;
  readyAt: number;
  state: "BUILDING" | "READY" | "ERROR";
  type: string;
  creator: {
    uid: string;
    email: string;
    username: string;
  };
}

export interface VercelDomainRequest {
  name: string;
  projectId: string;
  redirect?: string;
  redirectStatusCode?: number;
}

export interface VercelDomainResponse {
  id: string;
  name: string;
  projectId: string;
  createdAt: number;
  updatedAt: number;
  verified: boolean;
  redirect?: string;
  redirectStatusCode?: number;
}

export interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  createdAt: number;
  updatedAt: number;
  settings: {
    framework?: string;
    buildCommand?: string;
    outputDirectory?: string;
    installCommand?: string;
  };
}

// Vercel API Client
export class VercelClient {
  private config: VercelConfig;
  private baseUrl: string;

  constructor(config: VercelConfig) {
    this.config = {
      baseUrl: "https://api.vercel.com",
      ...config,
    };
    this.baseUrl = this.config.baseUrl!;
  }

  // Create Deployment - POST /v13/deployments
  async createDeployment(
    request: VercelDeploymentRequest,
  ): Promise<VercelDeploymentResponse> {
    const url = `${this.baseUrl}/v13/deployments`;

    // Prepare form data
    const formData = new FormData();

    // Add files
    request.files.forEach((file) => {
      formData.append("files", new Blob([file.data]), file.file);
    });

    // Add project settings
    if (request.projectSettings) {
      formData.append(
        "projectSettings",
        JSON.stringify(request.projectSettings),
      );
    }

    // Add other parameters
    formData.append("name", request.name);
    if (request.target) formData.append("target", request.target);
    if (request.regions)
      formData.append("regions", JSON.stringify(request.regions));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        ...(this.config.teamId && { "x-vercel-team-id": this.config.teamId }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Vercel API error: ${error.error?.message || response.statusText}`,
      );
    }

    return await response.json();
  }

  // Get Deployment Status
  async getDeploymentStatus(
    deploymentId: string,
  ): Promise<VercelDeploymentResponse> {
    const url = `${this.baseUrl}/v13/deployments/${deploymentId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        ...(this.config.teamId && { "x-vercel-team-id": this.config.teamId }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Vercel API error: ${error.error?.message || response.statusText}`,
      );
    }

    return await response.json();
  }

  // Configure Custom Domain - PUT /v9/projects/:id/domains
  async configureDomain(
    projectId: string,
    domainRequest: VercelDomainRequest,
  ): Promise<VercelDomainResponse> {
    const url = `${this.baseUrl}/v9/projects/${projectId}/domains`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        "Content-Type": "application/json",
        ...(this.config.teamId && { "x-vercel-team-id": this.config.teamId }),
      },
      body: JSON.stringify(domainRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Vercel API error: ${error.error?.message || response.statusText}`,
      );
    }

    return await response.json();
  }

  // Get Project
  async getProject(projectId: string): Promise<VercelProject> {
    const url = `${this.baseUrl}/v9/projects/${projectId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        ...(this.config.teamId && { "x-vercel-team-id": this.config.teamId }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Vercel API error: ${error.error?.message || response.statusText}`,
      );
    }

    return await response.json();
  }

  // List Projects
  async listProjects(): Promise<VercelProject[]> {
    const url = `${this.baseUrl}/v9/projects`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        ...(this.config.teamId && { "x-vercel-team-id": this.config.teamId }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Vercel API error: ${error.error?.message || response.statusText}`,
      );
    }

    const data = await response.json();
    return data.projects || [];
  }

  // Delete Deployment
  async deleteDeployment(deploymentId: string): Promise<void> {
    const url = `${this.baseUrl}/v13/deployments/${deploymentId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        ...(this.config.teamId && { "x-vercel-team-id": this.config.teamId }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Vercel API error: ${error.error?.message || response.statusText}`,
      );
    }
  }
}

// Portfolio Deployment Manager
export class PortfolioDeploymentManager {
  private vercel: VercelClient;
  private projectName: string;

  constructor(
    config: VercelConfig,
    projectName: string = "showwork-portfolio",
  ) {
    this.vercel = new VercelClient(config);
    this.projectName = projectName;
  }

  // Deploy portfolio to Vercel
  async deployPortfolio(
    portfolioId: string,
    assets: {
      html: string;
      css: string;
      js: string;
      images: Array<{ name: string; data: Buffer }>;
      fonts: Array<{ name: string; data: Buffer }>;
    },
  ): Promise<{
    deploymentId: string;
    url: string;
    status: string;
  }> {
    // Prepare files for deployment
    const files = [
      {
        file: "index.html",
        data: assets.html,
      },
      {
        file: "styles.css",
        data: assets.css,
      },
      {
        file: "script.js",
        data: assets.js,
      },
      // Add images
      ...assets.images.map((img) => ({
        file: `images/${img.name}`,
        data: img.data,
      })),
      // Add fonts
      ...assets.fonts.map((font) => ({
        file: `fonts/${font.name}`,
        data: font.data,
      })),
    ];

    // Create deployment
    const deployment = await this.vercel.createDeployment({
      name: `${this.projectName}-${portfolioId}`,
      files,
      projectSettings: {
        framework: "static",
        buildCommand: undefined,
        outputDirectory: ".",
        installCommand: undefined,
      },
      target: "production",
      regions: ["iad1", "sfo1", "lhr1"], // Multiple regions for global performance
    });

    return {
      deploymentId: deployment.id,
      url: deployment.url,
      status: deployment.state,
    };
  }

  // Wait for deployment to complete
  async waitForDeployment(
    deploymentId: string,
    timeout: number = 300000,
  ): Promise<VercelDeploymentResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const deployment = await this.vercel.getDeploymentStatus(deploymentId);

      if (deployment.state === "READY") {
        return deployment;
      }

      if (deployment.state === "ERROR") {
        throw new Error("Deployment failed");
      }

      // Wait 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    throw new Error("Deployment timeout");
  }

  // Configure custom domain
  async configureCustomDomain(
    projectId: string,
    domain: string,
  ): Promise<VercelDomainResponse> {
    return await this.vercel.configureDomain(projectId, {
      name: domain,
      projectId,
    });
  }

  // Deploy with custom domain
  async deployWithCustomDomain(
    portfolioId: string,
    assets: any,
    customDomain: string,
  ): Promise<{
    deploymentId: string;
    url: string;
    customUrl: string;
    status: string;
  }> {
    // First deploy the portfolio
    const deployment = await this.deployPortfolio(portfolioId, assets);

    // Wait for deployment to complete
    const completedDeployment = await this.waitForDeployment(
      deployment.deploymentId,
    );

    // Configure custom domain
    const domainConfig = await this.configureCustomDomain(
      completedDeployment.projectId,
      customDomain,
    );

    return {
      deploymentId: deployment.deploymentId,
      url: deployment.url,
      customUrl: `https://${customDomain}`,
      status: completedDeployment.state,
    };
  }

  // Get deployment analytics
  async getDeploymentAnalytics(deploymentId: string): Promise<{
    views: number;
    uniqueVisitors: number;
    bandwidth: number;
    regions: { [region: string]: number };
  }> {
    // This would typically use Vercel's analytics API
    // For now, return mock data
    return {
      views: Math.floor(Math.random() * 1000) + 100,
      uniqueVisitors: Math.floor(Math.random() * 500) + 50,
      bandwidth: Math.floor(Math.random() * 10000) + 1000,
      regions: {
        iad1: Math.floor(Math.random() * 300) + 50,
        sfo1: Math.floor(Math.random() * 200) + 30,
        lhr1: Math.floor(Math.random() * 150) + 20,
      },
    };
  }

  // Clean up old deployments
  async cleanupOldDeployments(
    projectId: string,
    keepCount: number = 5,
  ): Promise<void> {
    const deployments = await this.vercel.listProjects();
    const project = deployments.find((p) => p.id === projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // In a real implementation, you would list deployments for the project
    // and delete old ones, keeping only the most recent ones
    console.log(
      `Cleaning up old deployments for project ${projectId}, keeping ${keepCount} most recent`,
    );
  }
}

// Export the main deployment functions
export const deployPortfolioToVercel = async (
  portfolioId: string,
  assets: any,
  config: VercelConfig,
  customDomain?: string,
): Promise<{
  url: string;
  customUrl?: string;
  deploymentId: string;
  status: string;
}> => {
  const deploymentManager = new PortfolioDeploymentManager(config);

  if (customDomain) {
    const result = await deploymentManager.deployWithCustomDomain(
      portfolioId,
      assets,
      customDomain,
    );

    return {
      url: result.url,
      customUrl: result.customUrl,
      deploymentId: result.deploymentId,
      status: result.status,
    };
  } else {
    const result = await deploymentManager.deployPortfolio(portfolioId, assets);
    const completedDeployment = await deploymentManager.waitForDeployment(
      result.deploymentId,
    );

    return {
      url: result.url,
      deploymentId: result.deploymentId,
      status: completedDeployment.state,
    };
  }
};

export const getDeploymentStatus = async (
  deploymentId: string,
  config: VercelConfig,
): Promise<VercelDeploymentResponse> => {
  const vercel = new VercelClient(config);
  return await vercel.getDeploymentStatus(deploymentId);
};

export const configureDomain = async (
  projectId: string,
  domain: string,
  config: VercelConfig,
): Promise<VercelDomainResponse> => {
  const vercel = new VercelClient(config);
  return await vercel.configureDomain(projectId, {
    name: domain,
    projectId,
  });
};
