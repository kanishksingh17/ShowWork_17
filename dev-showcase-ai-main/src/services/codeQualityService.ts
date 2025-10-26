// Code Quality Service - GitHub metrics and quality analysis

import { CodeQualityMetrics, GitHubRepositoryInfo } from "@/types/project";

export interface GitHubApiResponse {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  default_branch: string;
  html_url: string;
}

export interface GitHubLanguageResponse {
  [language: string]: number;
}

export interface GitHubContributorResponse {
  login: string;
  contributions: number;
  avatar_url: string;
}

export interface GitHubIssueResponse {
  number: number;
  title: string;
  state: string;
  labels: Array<{
    name: string;
  }>;
  created_at: string;
  updated_at: string;
}

export class CodeQualityService {
  private githubToken: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(githubToken?: string) {
    this.githubToken = githubToken || process.env.GITHUB_TOKEN || "";
  }

  // Extract owner and repo from GitHub URL
  parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);

    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ""), // Remove .git suffix if present
      };
    }

    return null;
  }

  // Make authenticated GitHub API request
  private async githubRequest(endpoint: string): Promise<any> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "ShowWork-App",
    };

    if (this.githubToken) {
      headers["Authorization"] = `token ${this.githubToken}`;
    }

    try {
      const response = await fetch(`https://api.github.com${endpoint}`, {
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Repository not found");
        }
        if (response.status === 403) {
          throw new Error("Rate limit exceeded or repository is private");
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("GitHub API request failed:", error);
      throw error;
    }
  }

  // Get repository information
  async getRepositoryInfo(githubUrl: string): Promise<GitHubRepositoryInfo> {
    const parsed = this.parseGitHubUrl(githubUrl);
    if (!parsed) {
      throw new Error("Invalid GitHub URL");
    }

    const { owner, repo } = parsed;
    const repoData = await this.githubRequest(`/repos/${owner}/${repo}`);

    // Get languages
    const languages = await this.githubRequest(
      `/repos/${owner}/${repo}/languages`,
    );
    const totalBytes = Object.values(languages).reduce(
      (sum: number, bytes: any) => sum + bytes,
      0,
    );

    const languageList = Object.entries(languages).map(([name, bytes]) => ({
      name,
      percentage:
        totalBytes > 0 ? Math.round(((bytes as number) / totalBytes) * 100) : 0,
    }));

    // Get contributors count
    const contributors = await this.githubRequest(
      `/repos/${owner}/${repo}/contributors?per_page=1`,
    );
    const contributorsCount =
      contributors.length > 0 ? contributors[0].contributions : 0;

    return {
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description,
      language: repoData.language,
      languages: languageList,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      lastCommit: new Date(repoData.updated_at),
      contributors: contributorsCount,
      defaultBranch: repoData.default_branch,
      url: repoData.html_url,
    };
  }

  // Analyze code quality metrics
  async analyzeCodeQuality(githubUrl: string): Promise<CodeQualityMetrics> {
    try {
      const parsed = this.parseGitHubUrl(githubUrl);
      if (!parsed) {
        throw new Error("Invalid GitHub URL");
      }

      const { owner, repo } = parsed;

      // Get repository data
      const repoData = await this.githubRequest(`/repos/${owner}/${repo}`);

      // Get languages
      const languages = await this.githubRequest(
        `/repos/${owner}/${repo}/languages`,
      );
      const totalBytes = Object.values(languages).reduce(
        (sum: number, bytes: any) => sum + bytes,
        0,
      );

      const languageList = Object.entries(languages).map(([name, bytes]) => ({
        name,
        percentage:
          totalBytes > 0
            ? Math.round(((bytes as number) / totalBytes) * 100)
            : 0,
      }));

      // Get contributors
      const contributors = await this.githubRequest(
        `/repos/${owner}/${repo}/contributors?per_page=100`,
      );
      const contributorsCount = contributors.length;

      // Get issues (including bugs)
      const issues = await this.githubRequest(
        `/repos/${owner}/${repo}/issues?state=open&per_page=100`,
      );
      const bugs = issues.filter((issue: GitHubIssueResponse) =>
        issue.labels.some(
          (label) =>
            label.name.toLowerCase().includes("bug") ||
            label.name.toLowerCase().includes("critical"),
        ),
      );

      // Calculate quality score
      const qualityScore = this.calculateQualityScore({
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        bugs: bugs.length,
        contributors: contributorsCount,
        lastCommit: new Date(repoData.updated_at),
        languages: languageList,
      });

      // Generate insights
      const insights = this.generateInsights({
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        bugs: bugs.length,
        contributors: contributorsCount,
        lastCommit: new Date(repoData.updated_at),
        languages: languageList,
      });

      return {
        overallScore: qualityScore,
        testCoverage: 0, // Would need additional API calls or CI integration
        openIssues: repoData.open_issues_count,
        criticalBugs: bugs.length,
        complexity: this.determineComplexity(languageList, contributorsCount),
        lastCommit: new Date(repoData.updated_at),
        contributors: contributorsCount,
        dependencies: {
          outdated: 0, // Would need additional analysis
          vulnerable: 0, // Would need security scanning
        },
        languages: languageList,
        insights,
      };
    } catch (error) {
      console.error("Code quality analysis failed:", error);

      // Return default metrics on error
      return {
        overallScore: 0,
        testCoverage: 0,
        openIssues: 0,
        criticalBugs: 0,
        complexity: "medium",
        lastCommit: new Date(),
        contributors: 0,
        dependencies: {
          outdated: 0,
          vulnerable: 0,
        },
        languages: [],
        insights: [
          "Unable to analyze repository. Please check the GitHub URL and repository access.",
        ],
      };
    }
  }

  // Calculate overall quality score (0-100)
  private calculateQualityScore(metrics: {
    stars: number;
    forks: number;
    openIssues: number;
    bugs: number;
    contributors: number;
    lastCommit: Date;
    languages: Array<{ name: string; percentage: number }>;
  }): number {
    let score = 50; // Base score

    // Star rating (0-20 points)
    if (metrics.stars > 1000) score += 20;
    else if (metrics.stars > 500) score += 15;
    else if (metrics.stars > 100) score += 10;
    else if (metrics.stars > 10) score += 5;

    // Fork rating (0-10 points)
    if (metrics.forks > 100) score += 10;
    else if (metrics.forks > 50) score += 7;
    else if (metrics.forks > 10) score += 5;
    else if (metrics.forks > 0) score += 2;

    // Contributor rating (0-10 points)
    if (metrics.contributors > 10) score += 10;
    else if (metrics.contributors > 5) score += 7;
    else if (metrics.contributors > 2) score += 5;
    else if (metrics.contributors > 0) score += 2;

    // Recent activity (0-10 points)
    const daysSinceLastCommit =
      (Date.now() - metrics.lastCommit.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastCommit < 7) score += 10;
    else if (daysSinceLastCommit < 30) score += 7;
    else if (daysSinceLastCommit < 90) score += 5;
    else if (daysSinceLastCommit < 365) score += 2;

    // Issue penalty (-20 to 0 points)
    if (metrics.openIssues > 50) score -= 20;
    else if (metrics.openIssues > 20) score -= 15;
    else if (metrics.openIssues > 10) score -= 10;
    else if (metrics.openIssues > 5) score -= 5;

    // Bug penalty (-30 to 0 points)
    if (metrics.bugs > 10) score -= 30;
    else if (metrics.bugs > 5) score -= 20;
    else if (metrics.bugs > 2) score -= 10;
    else if (metrics.bugs > 0) score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  // Determine complexity level
  private determineComplexity(
    languages: Array<{ name: string; percentage: number }>,
    contributors: number,
  ): "low" | "medium" | "high" {
    const languageCount = languages.length;
    const topLanguagePercentage = languages[0]?.percentage || 0;

    if (languageCount > 5 || contributors > 10 || topLanguagePercentage < 60) {
      return "high";
    } else if (
      languageCount > 2 ||
      contributors > 3 ||
      topLanguagePercentage < 80
    ) {
      return "medium";
    } else {
      return "low";
    }
  }

  // Generate insights based on metrics
  private generateInsights(metrics: {
    stars: number;
    forks: number;
    openIssues: number;
    bugs: number;
    contributors: number;
    lastCommit: Date;
    languages: Array<{ name: string; percentage: number }>;
  }): string[] {
    const insights: string[] = [];

    // Star insights
    if (metrics.stars > 1000) {
      insights.push("Highly popular repository with strong community support");
    } else if (metrics.stars < 10) {
      insights.push(
        "Consider improving documentation and marketing to increase visibility",
      );
    }

    // Fork insights
    if (metrics.forks > 100) {
      insights.push("Active community with many contributors");
    } else if (metrics.forks === 0) {
      insights.push(
        "No forks yet - consider encouraging community contributions",
      );
    }

    // Issue insights
    if (metrics.openIssues > 20) {
      insights.push(
        "High number of open issues - consider prioritizing bug fixes",
      );
    } else if (metrics.openIssues === 0) {
      insights.push("No open issues - great maintenance!");
    }

    // Bug insights
    if (metrics.bugs > 5) {
      insights.push("Multiple critical bugs detected - prioritize fixes");
    } else if (metrics.bugs === 0) {
      insights.push("No critical bugs reported");
    }

    // Activity insights
    const daysSinceLastCommit =
      (Date.now() - metrics.lastCommit.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastCommit > 365) {
      insights.push(
        "Repository appears inactive - consider updating or archiving",
      );
    } else if (daysSinceLastCommit < 7) {
      insights.push("Very active repository with recent commits");
    }

    // Contributor insights
    if (metrics.contributors > 10) {
      insights.push("Large team with distributed development");
    } else if (metrics.contributors === 1) {
      insights.push("Single contributor project - consider building a team");
    }

    // Language insights
    if (metrics.languages.length > 5) {
      insights.push(
        "Multi-language project - consider simplifying the tech stack",
      );
    } else if (metrics.languages.length === 1) {
      insights.push("Focused technology stack");
    }

    return insights.length > 0 ? insights : ["Repository analysis completed"];
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }
}

// Create default instance
export const codeQualityService = new CodeQualityService();
