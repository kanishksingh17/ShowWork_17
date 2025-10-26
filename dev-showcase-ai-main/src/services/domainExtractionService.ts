/**
 * Domain Extraction Service
 * Extracts domain/industry from project data using rule-based and AI approaches
 */

export interface DomainExtractionResult {
  domain: string;
  confidence: number;
  method: "rule-based" | "ai";
}

export interface ProjectData {
  name: string;
  description: string;
  technologies: string[];
  tags: string[];
  category?: string;
}

class DomainExtractionService {
  private readonly DOMAIN_KEYWORDS = {
    "web-development": [
      "react",
      "vue",
      "angular",
      "javascript",
      "typescript",
      "html",
      "css",
      "sass",
      "scss",
      "node",
      "express",
      "next",
      "nuxt",
      "gatsby",
      "webpack",
      "vite",
      "frontend",
      "backend",
      "api",
      "rest",
      "graphql",
      "websocket",
      "jwt",
      "oauth",
      "authentication",
      "authorization",
      "responsive",
      "mobile-first",
      "pwa",
      "spa",
      "ssr",
      "csr",
      "seo",
      "accessibility",
    ],
    "mobile-development": [
      "react-native",
      "flutter",
      "dart",
      "swift",
      "kotlin",
      "android",
      "ios",
      "xcode",
      "android-studio",
      "expo",
      "cordova",
      "phonegap",
      "ionic",
      "xamarin",
      "mobile",
      "app",
      "ios-app",
      "android-app",
      "cross-platform",
      "native",
      "hybrid",
    ],
    "data-science": [
      "python",
      "r",
      "jupyter",
      "pandas",
      "numpy",
      "scipy",
      "scikit-learn",
      "tensorflow",
      "pytorch",
      "keras",
      "opencv",
      "matplotlib",
      "seaborn",
      "plotly",
      "dash",
      "streamlit",
      "machine-learning",
      "ml",
      "deep-learning",
      "ai",
      "artificial-intelligence",
      "neural-network",
      "data-analysis",
      "data-visualization",
      "statistics",
      "regression",
      "classification",
      "clustering",
      "nlp",
      "natural-language-processing",
      "computer-vision",
      "recommendation-system",
    ],
    devops: [
      "docker",
      "kubernetes",
      "jenkins",
      "gitlab-ci",
      "github-actions",
      "azure-devops",
      "aws",
      "gcp",
      "azure",
      "terraform",
      "ansible",
      "chef",
      "puppet",
      "vagrant",
      "nginx",
      "apache",
      "load-balancer",
      "monitoring",
      "logging",
      "prometheus",
      "grafana",
      "elk-stack",
      "elasticsearch",
      "logstash",
      "kibana",
      "ci-cd",
      "deployment",
      "infrastructure",
    ],
    blockchain: [
      "ethereum",
      "bitcoin",
      "solidity",
      "web3",
      "smart-contract",
      "defi",
      "nft",
      "blockchain",
      "cryptocurrency",
      "crypto",
      "dapp",
      "metamask",
      "wallet",
      "token",
      "erc-20",
      "erc-721",
      "erc-1155",
      "ipfs",
      "consensus",
      "mining",
      "staking",
    ],
    "game-development": [
      "unity",
      "unreal",
      "c#",
      "c++",
      "game-development",
      "gamedev",
      "2d",
      "3d",
      "physics",
      "animation",
      "rigging",
      "texturing",
      "lighting",
      "shader",
      "opengl",
      "directx",
      "vulkan",
      "game-engine",
      "indie-game",
      "mobile-game",
      "pc-game",
    ],
    cybersecurity: [
      "security",
      "penetration-testing",
      "pen-testing",
      "vulnerability",
      "exploit",
      "malware",
      "virus",
      "firewall",
      "encryption",
      "cryptography",
      "ssl",
      "tls",
      "authentication",
      "authorization",
      "oauth",
      "jwt",
      "xss",
      "csrf",
      "sql-injection",
      "owasp",
      "kali-linux",
      "metasploit",
      "burp-suite",
      "nmap",
      "wireshark",
    ],
  };

  /**
   * Extract domain from project data using rule-based approach
   */
  extractDomainRuleBased(projectData: ProjectData): DomainExtractionResult {
    const allText = [
      projectData.name,
      projectData.description,
      ...projectData.technologies,
      ...projectData.tags,
      projectData.category || "",
    ]
      .join(" ")
      .toLowerCase();

    const domainScores: Record<string, number> = {};

    // Score each domain based on keyword matches
    Object.entries(this.DOMAIN_KEYWORDS).forEach(([domain, keywords]) => {
      let score = 0;
      keywords.forEach((keyword) => {
        if (allText.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });
      domainScores[domain] = score;
    });

    // Find the domain with highest score
    const bestDomain = Object.entries(domainScores).reduce((a, b) =>
      domainScores[a[0]] > domainScores[b[0]] ? a : b,
    );

    const confidence = Math.min(bestDomain[1] / 5, 1); // Normalize to 0-1, cap at 5 matches

    return {
      domain: bestDomain[1] > 0 ? bestDomain[0] : "general",
      confidence,
      method: "rule-based",
    };
  }

  /**
   * Extract domain using AI (OpenAI) if available
   */
  async extractDomainAI(
    projectData: ProjectData,
  ): Promise<DomainExtractionResult> {
    // Check if OpenAI is available
    if (!process.env.OPENAI_API_KEY) {
      return this.extractDomainRuleBased(projectData);
    }

    try {
      const { OpenAI } = await import("openai");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const prompt = `
Analyze this project and determine its primary domain/industry:

Project Name: ${projectData.name}
Description: ${projectData.description}
Technologies: ${projectData.technologies.join(", ")}
Tags: ${projectData.tags.join(", ")}

Choose the most appropriate domain from these options:
- web-development
- mobile-development  
- data-science
- devops
- blockchain
- game-development
- cybersecurity
- general

Respond with only the domain name and a confidence score (0-1) in this format:
domain: [domain-name]
confidence: [0.0-1.0]
`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 50,
      });

      const content = response.choices[0]?.message?.content || "";
      const domainMatch = content.match(/domain:\s*([a-z-]+)/);
      const confidenceMatch = content.match(/confidence:\s*([0-9.]+)/);

      if (domainMatch && confidenceMatch) {
        return {
          domain: domainMatch[1],
          confidence: parseFloat(confidenceMatch[1]),
          method: "ai",
        };
      }
    } catch (error) {
      console.warn(
        "AI domain extraction failed, falling back to rule-based:",
        error,
      );
    }

    return this.extractDomainRuleBased(projectData);
  }

  /**
   * Main extraction method - tries AI first, falls back to rule-based
   */
  async extractDomain(
    projectData: ProjectData,
  ): Promise<DomainExtractionResult> {
    // Try AI first if enabled
    if (
      process.env.PORTFOLIO_HEALTH_ENABLED === "true" &&
      process.env.OPENAI_API_KEY
    ) {
      return this.extractDomainAI(projectData);
    }

    // Fall back to rule-based
    return this.extractDomainRuleBased(projectData);
  }

  /**
   * Get domain display name for UI
   */
  getDomainDisplayName(domain: string): string {
    const displayNames: Record<string, string> = {
      "web-development": "Web Development",
      "mobile-development": "Mobile Development",
      "data-science": "Data Science",
      devops: "DevOps",
      blockchain: "Blockchain",
      "game-development": "Game Development",
      cybersecurity: "Cybersecurity",
      general: "General",
    };

    return displayNames[domain] || "General";
  }
}

export const domainExtractionService = new DomainExtractionService();
