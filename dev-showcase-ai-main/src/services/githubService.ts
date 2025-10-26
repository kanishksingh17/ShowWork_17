interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  clone_url: string;
  language: string;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  default_branch: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

interface GitHubLanguages {
  [key: string]: number;
}

interface GitHubReadme {
  content: string;
  encoding: string;
  download_url: string;
}

interface RepositoryAnalysis {
  repo: GitHubRepo;
  languages: GitHubLanguages;
  readme: string;
  techStack: string[];
  description: string;
  stats: {
    stars: number;
    forks: number;
    issues: number;
    lastUpdated: string;
  };
  analysis: {
    primaryLanguage: string;
    framework: string | null;
    database: string | null;
    buildTool: string | null;
    testingFramework: string | null;
  };
}

class GitHubService {
  private baseURL = "https://api.github.com";
  private token: string | null = null;

  constructor(token?: string) {
    this.token = token || null;
  }

  private async fetchWithAuth(url: string): Promise<Response> {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "ShowWork-App",
    };

    if (this.token) {
      headers["Authorization"] = `token ${this.token}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Repository not found");
      } else if (response.status === 403) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else {
        throw new Error(`GitHub API error: ${response.status}`);
      }
    }

    return response;
  }

  private extractRepoInfo(url: string): { owner: string; repo: string } | null {
    // Handle various GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)(?:\/.*)?$/,
      /github\.com\/([^\/]+)\/([^\/]+)\.git$/,
      /^([^\/]+)\/([^\/]+)$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(".git", ""),
        };
      }
    }

    return null;
  }

  async analyzeRepository(url: string): Promise<RepositoryAnalysis> {
    try {
      const repoInfo = this.extractRepoInfo(url);
      if (!repoInfo) {
        throw new Error("Invalid GitHub repository URL");
      }

      // Fetch repository data
      const repoResponse = await this.fetchWithAuth(
        `${this.baseURL}/repos/${repoInfo.owner}/${repoInfo.repo}`,
      );
      const repo: GitHubRepo = await repoResponse.json();

      // Fetch languages
      const languagesResponse = await this.fetchWithAuth(repo.languages_url);
      const languages: GitHubLanguages = await languagesResponse.json();

      // Fetch README
      let readme = "";
      try {
        const readmeResponse = await this.fetchWithAuth(
          `${this.baseURL}/repos/${repoInfo.owner}/${repoInfo.repo}/readme`,
        );
        const readmeData: GitHubReadme = await readmeResponse.json();
        readme = atob(readmeData.content);
      } catch (error) {
        console.log("No README found for this repository");
      }

      // Analyze the repository
      const analysis = this.analyzeRepositoryData(repo, languages, readme);

      return {
        repo,
        languages,
        readme,
        techStack: analysis.techStack,
        description: analysis.description,
        stats: {
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          issues: repo.open_issues_count,
          lastUpdated: repo.updated_at,
        },
        analysis: analysis.analysis,
      };
    } catch (error) {
      throw new Error(
        `Failed to analyze repository: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private analyzeRepositoryData(
    repo: GitHubRepo,
    languages: GitHubLanguages,
    readme: string,
  ): {
    techStack: string[];
    description: string;
    analysis: {
      primaryLanguage: string;
      framework: string | null;
      database: string | null;
      buildTool: string | null;
      testingFramework: string | null;
    };
  } {
    // Get primary language
    const primaryLanguage = Object.keys(languages).reduce((a, b) =>
      languages[a] > languages[b] ? a : b,
    );

    // Detect technologies from languages and README
    const techStack: string[] = [];
    const allText = `${repo.description || ""} ${readme}`.toLowerCase();

    // Framework detection
    const frameworks = {
      React: ["react", "jsx", "tsx"],
      "Vue.js": ["vue", "nuxt"],
      Angular: ["angular", "ng-"],
      "Next.js": ["next.js", "nextjs"],
      Svelte: ["svelte"],
      Express: ["express"],
      FastAPI: ["fastapi"],
      Django: ["django"],
      Flask: ["flask"],
      Spring: ["spring boot", "springboot"],
      Laravel: ["laravel"],
      Rails: ["rails", "ruby on rails"],
    };

    // Database detection
    const databases = {
      PostgreSQL: ["postgresql", "postgres", "pg"],
      MySQL: ["mysql"],
      MongoDB: ["mongodb", "mongo"],
      Redis: ["redis"],
      SQLite: ["sqlite"],
      Firebase: ["firebase"],
      Supabase: ["supabase"],
    };

    // Build tools detection
    const buildTools = {
      Webpack: ["webpack"],
      Vite: ["vite"],
      Parcel: ["parcel"],
      Rollup: ["rollup"],
      ESBuild: ["esbuild"],
      Turbo: ["turbo"],
    };

    // Testing frameworks
    const testingFrameworks = {
      Jest: ["jest"],
      Vitest: ["vitest"],
      Cypress: ["cypress"],
      Playwright: ["playwright"],
      "Testing Library": ["@testing-library"],
      Mocha: ["mocha"],
      Chai: ["chai"],
    };

    // Add languages to tech stack
    Object.keys(languages).forEach((lang) => {
      if (lang !== "Other" && !techStack.includes(lang)) {
        techStack.push(lang);
      }
    });

    // Detect frameworks
    Object.entries(frameworks).forEach(([framework, keywords]) => {
      if (keywords.some((keyword) => allText.includes(keyword))) {
        techStack.push(framework);
      }
    });

    // Detect databases
    Object.entries(databases).forEach(([database, keywords]) => {
      if (keywords.some((keyword) => allText.includes(keyword))) {
        techStack.push(database);
      }
    });

    // Detect build tools
    Object.entries(buildTools).forEach(([tool, keywords]) => {
      if (keywords.some((keyword) => allText.includes(keyword))) {
        techStack.push(tool);
      }
    });

    // Detect testing frameworks
    Object.entries(testingFrameworks).forEach(([framework, keywords]) => {
      if (keywords.some((keyword) => allText.includes(keyword))) {
        techStack.push(framework);
      }
    });

    // Extract description from README if repo description is empty
    let description = repo.description || "";
    if (!description && readme) {
      const lines = readme.split("\n");
      for (const line of lines) {
        if (
          line.trim() &&
          !line.startsWith("#") &&
          !line.startsWith("!") &&
          line.length > 10
        ) {
          description = line.trim();
          break;
        }
      }
    }

    // Detect specific technologies
    const detectedFramework =
      Object.entries(frameworks).find(([_, keywords]) =>
        keywords.some((keyword) => allText.includes(keyword)),
      )?.[0] || null;

    const detectedDatabase =
      Object.entries(databases).find(([_, keywords]) =>
        keywords.some((keyword) => allText.includes(keyword)),
      )?.[0] || null;

    const detectedBuildTool =
      Object.entries(buildTools).find(([_, keywords]) =>
        keywords.some((keyword) => allText.includes(keyword)),
      )?.[0] || null;

    const detectedTestingFramework =
      Object.entries(testingFrameworks).find(([_, keywords]) =>
        keywords.some((keyword) => allText.includes(keyword)),
      )?.[0] || null;

    return {
      techStack: [...new Set(techStack)], // Remove duplicates
      description,
      analysis: {
        primaryLanguage,
        framework: detectedFramework,
        database: detectedDatabase,
        buildTool: detectedBuildTool,
        testingFramework: detectedTestingFramework,
      },
    };
  }

  // Get repository statistics
  async getRepositoryStats(owner: string, repo: string) {
    try {
      const response = await this.fetchWithAuth(
        `${this.baseURL}/repos/${owner}/${repo}/stats/contributors`,
      );
      return await response.json();
    } catch (error) {
      console.log("Could not fetch contributor stats");
      return null;
    }
  }

  // Check if repository is accessible
  async checkRepositoryAccess(url: string): Promise<boolean> {
    try {
      const repoInfo = this.extractRepoInfo(url);
      if (!repoInfo) return false;

      await this.fetchWithAuth(
        `${this.baseURL}/repos/${repoInfo.owner}/${repoInfo.repo}`,
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default GitHubService;
export type { RepositoryAnalysis, GitHubRepo, GitHubLanguages };
