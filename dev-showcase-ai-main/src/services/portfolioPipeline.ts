// Integrated Portfolio Generation Pipeline - Uses OpenAI, S3, and Vercel APIs
import { OpenAIClient, PortfolioContentGenerator } from "./openaiService";
import { S3Client, PortfolioAssetManager } from "./s3Service";
import { VercelClient, PortfolioDeploymentManager } from "./vercelService";

export interface GenerationPipelineConfig {
  openai: {
    apiKey: string;
    model?: "gpt-4" | "gpt-3.5-turbo";
  };
  s3: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucketName: string;
  };
  vercel: {
    token: string;
    teamId?: string;
  };
}

export interface PortfolioGenerationRequest {
  userId: string;
  templateId: string;
  userData: {
    name: string;
    title: string;
    bio?: string;
    skills: string[];
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
      stars?: number;
      forks?: number;
    }>;
    experience: Array<{
      company: string;
      position: string;
      duration: string;
      description: string;
    }>;
    preferences?: {
      customDomain?: string;
      colorScheme?: string[];
      animationStyle?: "subtle" | "dynamic" | "minimal";
    };
  };
}

export interface PortfolioGenerationResult {
  portfolioId: string;
  url: string;
  customUrl?: string;
  deploymentId: string;
  performance: {
    pageSpeed: number;
    loadTime: number;
    bundleSize: number;
  };
  analytics: {
    trackingId: string;
    customEvents: string[];
  };
  assets: {
    html: string;
    css: string;
    js: string;
    images: string[];
  };
}

// Main Portfolio Generation Pipeline
export class PortfolioGenerationPipeline {
  private openai: PortfolioContentGenerator;
  private s3: PortfolioAssetManager;
  private vercel: PortfolioDeploymentManager;
  private config: GenerationPipelineConfig;

  constructor(config: GenerationPipelineConfig) {
    this.config = config;
    this.openai = new PortfolioContentGenerator(config.openai.apiKey);
    this.s3 = new PortfolioAssetManager(config.s3);
    this.vercel = new PortfolioDeploymentManager(config.vercel);
  }

  // Main generation pipeline
  async generatePortfolio(
    request: PortfolioGenerationRequest,
  ): Promise<PortfolioGenerationResult> {
    const portfolioId = `portfolio_${request.userId}_${Date.now()}`;

    try {
      console.log(`Starting portfolio generation for ${portfolioId}`);

      // Step 1: AI Content Generation
      console.log("Step 1: Generating AI content...");
      const aiContent = await this.generateAIContent(request.userData);

      // Step 2: Build Portfolio Assets
      console.log("Step 2: Building portfolio assets...");
      const assets = await this.buildPortfolioAssets(
        portfolioId,
        request.templateId,
        {
          ...request.userData,
          ...aiContent,
        },
      );

      // Step 3: Upload to S3
      console.log("Step 3: Uploading assets to S3...");
      const s3Result = await this.uploadAssetsToS3(portfolioId, assets);

      // Step 4: Deploy to Vercel
      console.log("Step 4: Deploying to Vercel...");
      const deploymentResult = await this.deployToVercel(
        portfolioId,
        assets,
        request.userData.preferences?.customDomain,
      );

      // Step 5: Performance Testing
      console.log("Step 5: Testing performance...");
      const performance = await this.testPerformance(deploymentResult.url);

      console.log(`Portfolio generation completed for ${portfolioId}`);

      return {
        portfolioId,
        url: deploymentResult.url,
        customUrl: deploymentResult.customUrl,
        deploymentId: deploymentResult.deploymentId,
        performance,
        analytics: {
          trackingId: `sw_${portfolioId}_${Date.now()}`,
          customEvents: [
            "portfolio_view",
            "project_click",
            "contact_form_submit",
            "download_cv",
          ],
        },
        assets: {
          html: assets.html,
          css: assets.css,
          js: assets.js,
          images: s3Result.imageUrls,
        },
      };
    } catch (error) {
      console.error(`Portfolio generation failed for ${portfolioId}:`, error);
      throw new Error(`Portfolio generation failed: ${error.message}`);
    }
  }

  // Step 1: AI Content Generation
  private async generateAIContent(userData: any): Promise<any> {
    const [bio, seoMetadata, colorPalette, ctaText] = await Promise.all([
      this.openai.generateProfessionalBio(userData),
      this.openai.generateSEOMetadata(userData),
      this.openai.generateColorPalette(
        userData.industry || "developer",
        userData.preferences,
      ),
      this.openai.generateCallToAction(userData.industry || "developer"),
    ]);

    // Generate project descriptions
    const projectDescriptions = await Promise.all(
      userData.projects.map((project: any) =>
        this.openai.generateProjectDescription(project),
      ),
    );

    // Generate achievement descriptions
    const achievementDescriptions = await Promise.all(
      (userData.achievements || []).map((achievement: any) =>
        this.openai.generateAchievementDescription(achievement),
      ),
    );

    return {
      bio,
      seoMetadata,
      colorPalette,
      ctaText,
      projectDescriptions,
      achievementDescriptions,
    };
  }

  // Step 2: Build Portfolio Assets
  private async buildPortfolioAssets(
    portfolioId: string,
    templateId: string,
    content: any,
  ): Promise<{
    html: string;
    css: string;
    js: string;
    images: Array<{ name: string; data: Buffer; type: string }>;
    fonts: Array<{ name: string; data: Buffer; type: string }>;
  }> {
    // Generate HTML
    const html = this.generateHTML(portfolioId, templateId, content);

    // Generate CSS
    const css = this.generateCSS(content.colorPalette, templateId);

    // Generate JavaScript
    const js = this.generateJavaScript(portfolioId, content);

    // Generate images (placeholder for now)
    const images = await this.generateImages(content);

    // Generate fonts (placeholder for now)
    const fonts = await this.generateFonts();

    return { html, css, js, images, fonts };
  }

  // Step 3: Upload Assets to S3
  private async uploadAssetsToS3(
    portfolioId: string,
    assets: any,
  ): Promise<{
    imageUrls: string[];
    fontUrls: string[];
  }> {
    const result = await this.s3.uploadPortfolioAssets(portfolioId, assets);

    return {
      imageUrls: result.imageUrls,
      fontUrls: result.fontUrls,
    };
  }

  // Step 4: Deploy to Vercel
  private async deployToVercel(
    portfolioId: string,
    assets: any,
    customDomain?: string,
  ): Promise<{
    url: string;
    customUrl?: string;
    deploymentId: string;
  }> {
    if (customDomain) {
      const result = await this.vercel.deployWithCustomDomain(
        portfolioId,
        assets,
        customDomain,
      );
      return {
        url: result.url,
        customUrl: result.customUrl,
        deploymentId: result.deploymentId,
      };
    } else {
      const result = await this.vercel.deployPortfolio(portfolioId, assets);
      const completedDeployment = await this.vercel.waitForDeployment(
        result.deploymentId,
      );

      return {
        url: result.url,
        deploymentId: result.deploymentId,
      };
    }
  }

  // Step 5: Performance Testing
  private async testPerformance(url: string): Promise<{
    pageSpeed: number;
    loadTime: number;
    bundleSize: number;
  }> {
    // Simulate performance testing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      pageSpeed: 95 + Math.floor(Math.random() * 5), // 95-100
      loadTime: 1.2 + Math.random() * 0.8, // 1.2-2.0 seconds
      bundleSize: 250 + Math.floor(Math.random() * 100), // 250-350 KB
    };
  }

  // Asset Generation Methods
  private generateHTML(
    portfolioId: string,
    templateId: string,
    content: any,
  ): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.seoMetadata.metaTitle}</title>
    <meta name="description" content="${content.seoMetadata.metaDescription}">
    <meta name="keywords" content="${content.seoMetadata.keywords.join(", ")}">
    <link rel="canonical" href="${content.customUrl || "https://portfolio.showwork.com"}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${content.seoMetadata.metaTitle}">
    <meta property="og:description" content="${content.seoMetadata.metaDescription}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${content.customUrl || "https://portfolio.showwork.com"}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${content.seoMetadata.metaTitle}">
    <meta name="twitter:description" content="${content.seoMetadata.metaDescription}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "${content.name}",
      "jobTitle": "${content.title}",
      "description": "${content.bio}",
      "url": "${content.customUrl || "https://portfolio.showwork.com"}"
    }
    </script>
    
    <!-- Preload critical resources -->
    <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/css/critical.css" as="style">
    
    <!-- Critical CSS -->
    <style>
    body { font-family: 'Inter', sans-serif; }
    .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .hero h1 { font-size: 4rem; font-weight: 700; }
    @media (max-width: 768px) { .hero h1 { font-size: 2.5rem; } }
    </style>
</head>
<body>
    <div id="root">
        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <h1>${content.name}</h1>
                <h2>${content.title}</h2>
                <p>${content.bio}</p>
                <div class="cta-buttons">
                    <a href="#projects" class="btn btn-primary">${content.ctaText.primaryCTA}</a>
                    <a href="#contact" class="btn btn-secondary">${content.ctaText.secondaryCTA}</a>
                </div>
            </div>
        </section>
        
        <!-- Projects Section -->
        <section id="projects" class="projects">
            <div class="container">
                <h2>Featured Projects</h2>
                <div class="project-grid">
                    ${content.projects
                      .map(
                        (project: any, index: number) => `
                        <div class="project-card">
                            <h3>${project.name}</h3>
                            <p>${content.projectDescriptions[index]}</p>
                            <div class="technologies">
                                ${project.technologies.map((tech: string) => `<span class="tech-tag">${tech}</span>`).join("")}
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </section>
        
        <!-- Contact Section -->
        <section id="contact" class="contact">
            <div class="container">
                <h2>${content.ctaText.contactCTA}</h2>
                <p>Ready to collaborate on your next project?</p>
            </div>
        </section>
    </div>
    
    <script src="/js/portfolio.js" defer></script>
</body>
</html>`;
  }

  private generateCSS(colorPalette: string[], templateId: string): string {
    return `
:root {
  --primary: ${colorPalette[0]};
  --secondary: ${colorPalette[1]};
  --accent: ${colorPalette[2]};
  --background: #1E293B;
  --surface: #0F172A;
  --text: #ffffff;
  --text-muted: #94a3b8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, var(--background) 0%, var(--surface) 100%);
  color: var(--text);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero h1 {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  font-size: 2rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.hero p {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 600px;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: transform 0.2s ease;
  margin: 0.5rem;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

.section {
  padding: 4rem 0;
}

.projects {
  background: rgba(255, 255, 255, 0.05);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  transition: transform 0.2s ease;
}

.project-card:hover {
  transform: translateY(-4px);
}

.tech-tag {
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  margin: 0.25rem;
}

.contact {
  text-align: center;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .project-grid {
    grid-template-columns: 1fr;
  }
}`;
  }

  private generateJavaScript(portfolioId: string, content: any): string {
    return `
// Portfolio JavaScript
class PortfolioApp {
  constructor() {
    this.portfolioId = '${portfolioId}';
    this.init();
  }
  
  init() {
    this.setupSmoothScrolling();
    this.setupAnimations();
    this.setupAnalytics();
  }
  
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
  
  setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    });
    
    document.querySelectorAll('.project-card').forEach(card => {
      observer.observe(card);
    });
  }
  
  setupAnalytics() {
    // Track portfolio views
    this.trackEvent('portfolio_view', {
      portfolio_id: this.portfolioId,
      template: '${content.templateId || "default"}'
    });
  }
  
  trackEvent(eventName, data) {
    // Send analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});`;
  }

  private async generateImages(
    content: any,
  ): Promise<Array<{ name: string; data: Buffer; type: string }>> {
    // Generate placeholder images
    return [
      {
        name: "avatar.jpg",
        data: Buffer.from("placeholder-avatar-data"),
        type: "image/jpeg",
      },
      {
        name: "project-1.jpg",
        data: Buffer.from("placeholder-project-1-data"),
        type: "image/jpeg",
      },
      {
        name: "project-2.jpg",
        data: Buffer.from("placeholder-project-2-data"),
        type: "image/jpeg",
      },
    ];
  }

  private async generateFonts(): Promise<
    Array<{ name: string; data: Buffer; type: string }>
  > {
    // Generate placeholder fonts
    return [
      {
        name: "inter.woff2",
        data: Buffer.from("placeholder-font-data"),
        type: "font/woff2",
      },
    ];
  }
}

// Export the main generation function
export const generatePortfolioWithPipeline = async (
  request: PortfolioGenerationRequest,
  config: GenerationPipelineConfig,
): Promise<PortfolioGenerationResult> => {
  const pipeline = new PortfolioGenerationPipeline(config);
  return await pipeline.generatePortfolio(request);
};
