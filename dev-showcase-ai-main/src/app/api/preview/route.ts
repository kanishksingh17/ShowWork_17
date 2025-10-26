// Real-time Preview Generation API Route

import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  createErrorResponse,
  createSuccessResponse,
  trackUsage,
} from "../../../lib/api/middleware";
import { PreviewRequestSchema } from "../../../lib/api/schemas";
import {
  Portfolio,
  AuthUser,
  PreviewRequest,
  PreviewResponse,
} from "../../../lib/api/types";

// Mock database (in production, use a real database)
const portfolios = new Map<string, Portfolio>();
const previewCache = new Map<string, PreviewResponse>();

// Initialize with sample data
if (portfolios.size === 0) {
  const samplePortfolio: Portfolio = {
    id: "1",
    userId: "user-1",
    title: "Sample Portfolio",
    description: "A sample portfolio for demonstration",
    template: "modern",
    content: {
      hero: {
        title: "John Doe",
        subtitle: "Full Stack Developer",
        description: "Building amazing web experiences",
        cta: "View My Work",
      },
      about: {
        text: "Passionate developer with 5+ years of experience in creating scalable web applications. I love turning complex problems into simple, beautiful solutions.",
        image: "https://via.placeholder.com/400x300",
      },
      skills: [
        { name: "React", level: 90 },
        { name: "Node.js", level: 85 },
        { name: "TypeScript", level: 80 },
        { name: "Python", level: 75 },
      ],
      projects: [
        {
          title: "E-commerce Platform",
          description: "Full-stack e-commerce solution with React and Node.js",
          image: "https://via.placeholder.com/300x200",
          technologies: ["React", "Node.js", "MongoDB"],
          url: "https://example.com",
        },
        {
          title: "Task Management App",
          description: "Collaborative task management with real-time updates",
          image: "https://via.placeholder.com/300x200",
          technologies: ["Vue.js", "Express", "Socket.io"],
          url: "https://example.com",
        },
      ],
      contact: {
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        social: {
          linkedin: "https://linkedin.com/in/johndoe",
          github: "https://github.com/johndoe",
          twitter: "https://twitter.com/johndoe",
        },
      },
    },
    settings: {
      theme: "light",
      colors: ["#3B82F6", "#1E40AF", "#F59E0B"],
      fonts: ["Inter", "Roboto"],
      animations: true,
      responsive: true,
    },
    status: "published",
    visibility: "public",
    seo: {
      title: "John Doe - Full Stack Developer",
      description:
        "Portfolio of John Doe, a full stack developer specializing in React and Node.js",
      keywords: [
        "developer",
        "portfolio",
        "web development",
        "react",
        "node.js",
      ],
    },
    analytics: {
      views: 0,
      uniqueViews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  portfolios.set("1", samplePortfolio);
}

// Template renderers
const templateRenderers = {
  modern: (portfolio: Portfolio, device: any, options: any) => {
    return {
      html: generateModernHTML(portfolio, device, options),
      css: generateModernCSS(portfolio, device, options),
      js: generateModernJS(portfolio, device, options),
    };
  },
  creative: (portfolio: Portfolio, device: any, options: any) => {
    return {
      html: generateCreativeHTML(portfolio, device, options),
      css: generateCreativeCSS(portfolio, device, options),
      js: generateCreativeJS(portfolio, device, options),
    };
  },
  minimalist: (portfolio: Portfolio, device: any, options: any) => {
    return {
      html: generateMinimalistHTML(portfolio, device, options),
      css: generateMinimalistCSS(portfolio, device, options),
      js: generateMinimalistJS(portfolio, device, options),
    };
  },
};

// Generate modern template HTML
function generateModernHTML(
  portfolio: Portfolio,
  device: any,
  options: any,
): string {
  const { content, seo } = portfolio;
  const { hero, about, skills, projects, contact } = content;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <meta name="keywords" content="${seo.keywords.join(", ")}">
    ${options.seoOptimized ? generateSEOTags(seo) : ""}
    ${options.analytics ? generateAnalytics() : ""}
    <style>
        ${generateModernCSS(portfolio, device, options)}
    </style>
</head>
<body>
    <div class="portfolio-container" style="width: ${device.width}px; height: ${device.height}px;">
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1 class="hero-title">${hero.title}</h1>
                <h2 class="hero-subtitle">${hero.subtitle}</h2>
                <p class="hero-description">${hero.description}</p>
                <button class="cta-button">${hero.cta}</button>
            </div>
        </section>

        <!-- About Section -->
        <section class="about">
            <div class="about-content">
                <h2>About Me</h2>
                <p>${about.text}</p>
                ${about.image ? `<img src="${about.image}" alt="About" class="about-image">` : ""}
            </div>
        </section>

        <!-- Skills Section -->
        <section class="skills">
            <h2>Skills</h2>
            <div class="skills-grid">
                ${skills
                  .map(
                    (skill) => `
                    <div class="skill-item">
                        <span class="skill-name">${skill.name}</span>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: ${skill.level}%"></div>
                        </div>
                        <span class="skill-level">${skill.level}%</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </section>

        <!-- Projects Section -->
        <section class="projects">
            <h2>Projects</h2>
            <div class="projects-grid">
                ${projects
                  .map(
                    (project) => `
                    <div class="project-card">
                        <img src="${project.image}" alt="${project.title}" class="project-image">
                        <div class="project-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="project-tech">
                                ${project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
                            </div>
                            ${project.url ? `<a href="${project.url}" class="project-link" target="_blank">View Project</a>` : ""}
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </section>

        <!-- Contact Section -->
        <section class="contact">
            <h2>Contact</h2>
            <div class="contact-info">
                <div class="contact-item">
                    <strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a>
                </div>
                <div class="contact-item">
                    <strong>Phone:</strong> ${contact.phone}
                </div>
                <div class="contact-item">
                    <strong>Location:</strong> ${contact.location}
                </div>
                <div class="social-links">
                    ${Object.entries(contact.social)
                      .map(
                        ([platform, url]) =>
                          `<a href="${url}" class="social-link" target="_blank">${platform}</a>`,
                      )
                      .join("")}
                </div>
            </div>
        </section>
    </div>

    <script>
        ${generateModernJS(portfolio, device, options)}
    </script>
</body>
</html>
  `.trim();
}

// Generate modern template CSS
function generateModernCSS(
  portfolio: Portfolio,
  device: any,
  options: any,
): string {
  const { settings } = portfolio;
  const [primaryColor, secondaryColor, accentColor] = settings.colors;

  return `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: ${settings.fonts[0]}, sans-serif;
        line-height: 1.6;
        color: #333;
        background: linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20);
    }

    .portfolio-container {
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .hero {
        text-align: center;
        padding: 60px 20px;
        background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
        color: white;
        border-radius: 10px;
        margin-bottom: 40px;
    }

    .hero-title {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 10px;
        ${settings.animations ? "animation: fadeInUp 1s ease-out;" : ""}
    }

    .hero-subtitle {
        font-size: 1.5rem;
        margin-bottom: 20px;
        opacity: 0.9;
        ${settings.animations ? "animation: fadeInUp 1s ease-out 0.2s both;" : ""}
    }

    .hero-description {
        font-size: 1.1rem;
        margin-bottom: 30px;
        opacity: 0.8;
        ${settings.animations ? "animation: fadeInUp 1s ease-out 0.4s both;" : ""}
    }

    .cta-button {
        background: ${accentColor};
        color: white;
        padding: 15px 30px;
        border: none;
        border-radius: 25px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: transform 0.3s ease;
        ${settings.animations ? "animation: fadeInUp 1s ease-out 0.6s both;" : ""}
    }

    .cta-button:hover {
        transform: translateY(-2px);
    }

    .about, .skills, .projects, .contact {
        margin-bottom: 40px;
        padding: 20px;
    }

    .about h2, .skills h2, .projects h2, .contact h2 {
        color: ${primaryColor};
        margin-bottom: 20px;
        font-size: 2rem;
    }

    .about-image {
        max-width: 100%;
        height: auto;
        border-radius: 10px;
        margin-top: 20px;
    }

    .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }

    .skill-item {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        border-left: 4px solid ${primaryColor};
    }

    .skill-name {
        font-weight: bold;
        display: block;
        margin-bottom: 10px;
    }

    .skill-bar {
        background: #e9ecef;
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 5px;
    }

    .skill-progress {
        background: ${primaryColor};
        height: 100%;
        transition: width 1s ease;
    }

    .skill-level {
        font-size: 0.9rem;
        color: #666;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
    }

    .project-card {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }

    .project-card:hover {
        transform: translateY(-5px);
    }

    .project-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .project-content {
        padding: 20px;
    }

    .project-content h3 {
        color: ${primaryColor};
        margin-bottom: 10px;
    }

    .project-tech {
        margin: 15px 0;
    }

    .tech-tag {
        background: ${primaryColor}20;
        color: ${primaryColor};
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.9rem;
        margin-right: 10px;
    }

    .project-link {
        color: ${primaryColor};
        text-decoration: none;
        font-weight: bold;
    }

    .contact-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }

    .contact-item {
        margin-bottom: 15px;
    }

    .social-links {
        margin-top: 20px;
    }

    .social-link {
        display: inline-block;
        margin-right: 15px;
        color: ${primaryColor};
        text-decoration: none;
        font-weight: bold;
    }

    ${
      settings.animations
        ? `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    `
        : ""
    }

    ${
      options.responsive
        ? `
    @media (max-width: 768px) {
        .hero-title { font-size: 2rem; }
        .hero-subtitle { font-size: 1.2rem; }
        .portfolio-container { padding: 10px; }
        .skills-grid, .projects-grid { grid-template-columns: 1fr; }
    }
    `
        : ""
    }
  `.trim();
}

// Generate modern template JavaScript
function generateModernJS(
  portfolio: Portfolio,
  device: any,
  options: any,
): string {
  return `
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Animate skill bars on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target.querySelector('.skill-progress');
                if (skillBar) {
                    const width = skillBar.style.width;
                    skillBar.style.width = '0%';
                    setTimeout(() => {
                        skillBar.style.width = width;
                    }, 100);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-item').forEach(skill => {
        skillObserver.observe(skill);
    });

    // Add click tracking for analytics
    ${
      options.analytics
        ? `
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            gtag('event', 'click', {
                event_category: 'link',
                event_label: e.target.href
            });
        }
    });
    `
        : ""
    }

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
  `.trim();
}

// Generate creative template HTML
function generateCreativeHTML(
  portfolio: Portfolio,
  device: any,
  options: any,
): string {
  // Simplified creative template
  return generateModernHTML(portfolio, device, options);
}

// Generate creative template CSS
function generateCreativeCSS(
  portfolio: Portfolio,
  device: any,
  options: any,
): string {
  // Simplified creative template
  return generateModernCSS(portfolio, device, options);
}

// Generate creative template JavaScript
function generateCreativeJS(
  portfolio: Portfolio,
  device: any,
  options: any,
): string {
  // Simplified creative template
  return generateModernJS(portfolio, device, options);
}

// Generate minimalist template HTML
function generateMinimalistHTML(
  portfolio: Portfolio,
  device: any,
  options: any,
): string {
  // Simplified minimalist template
  return generateModernHTML(portfolio, device, options);
}

// Generate minimalist template CSS
function generateMinimalistCSS(
  portfolio: Portfolio,
  device: any,
  options: any,
): string {
  // Simplified minimalist template
  return generateModernCSS(portfolio, device, options);
}

// Generate minimalist template JavaScript
function generateMinimalistJS(
  portfolio: Portfolio,
  device: any,
  options: any,
): string {
  // Simplified minimalist template
  return generateModernJS(portfolio, device, options);
}

// Generate SEO tags
function generateSEOTags(seo: any): string {
  return `
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seo.title}">
    <meta name="twitter:description" content="${seo.description}">
    <link rel="canonical" href="https://example.com">
  `.trim();
}

// Generate analytics code
function generateAnalytics(): string {
  return `
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    </script>
  `.trim();
}

// Generate preview assets
function generateAssets(
  portfolio: Portfolio,
  options: any,
): Array<{ type: string; url: string; size: number; optimized: boolean }> {
  const assets = [];

  // Add images from content
  if (portfolio.content.about?.image) {
    assets.push({
      type: "image",
      url: portfolio.content.about.image,
      size: 1024 * 1024, // 1MB estimate
      optimized: options.optimizeImages,
    });
  }

  if (portfolio.content.projects) {
    portfolio.content.projects.forEach((project: any) => {
      if (project.image) {
        assets.push({
          type: "image",
          url: project.image,
          size: 512 * 1024, // 512KB estimate
          optimized: options.optimizeImages,
        });
      }
    });
  }

  return assets;
}

// Calculate performance metrics
function calculatePerformanceMetrics(
  html: string,
  css: string,
  js: string,
): any {
  const renderTime = Math.random() * 50 + 10; // 10-60ms
  const bundleSize = html.length + css.length + js.length;
  const componentCount = (html.match(/<[^>]+>/g) || []).length;
  const performanceScore = Math.min(
    100,
    Math.max(60, 100 - bundleSize / 10000),
  );

  return {
    renderTime,
    bundleSize,
    componentCount,
    performanceScore,
  };
}

// Main API handler
async function handlePreviewGeneration(
  request: NextRequest,
  user: AuthUser,
): Promise<NextResponse> {
  const startTime = Date.now();
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = PreviewRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
          requestId,
        },
        { status: 400 },
      );
    }

    const { portfolioId, device, zoom, pan, options } = validationResult.data;

    // Find portfolio
    const portfolio = portfolios.get(portfolioId);

    if (!portfolio) {
      return createErrorResponse(
        {
          code: "PORTFOLIO_NOT_FOUND",
          message: "Portfolio not found",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        404,
      );
    }

    // Check access
    if (portfolio.userId !== user.id && portfolio.visibility !== "public") {
      return createErrorResponse(
        {
          code: "ACCESS_DENIED",
          message: "Access denied",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        403,
      );
    }

    // Check cache
    const cacheKey = `${portfolioId}-${device.type}-${device.width}-${device.height}-${JSON.stringify(options)}`;
    const cachedPreview = previewCache.get(cacheKey);

    if (cachedPreview && new Date(cachedPreview.expiresAt) > new Date()) {
      // Track usage
      const duration = Date.now() - startTime;
      trackUsage(
        user.id,
        "/api/preview",
        "POST",
        duration,
        200,
        JSON.stringify(body).length,
        JSON.stringify(cachedPreview).length,
        request.headers.get("user-agent") || "unknown",
        request.ip || "unknown",
        ["preview_generation", "cached"],
      );

      return createSuccessResponse(
        cachedPreview,
        "Preview generated successfully (cached)",
      );
    }

    // Generate preview
    const renderer =
      templateRenderers[portfolio.template as keyof typeof templateRenderers];
    if (!renderer) {
      return createErrorResponse(
        {
          code: "INVALID_TEMPLATE",
          message: "Invalid template type",
          timestamp: new Date().toISOString(),
          requestId,
          userId: user.id,
        },
        400,
      );
    }

    const { html, css, js } = renderer(portfolio, device, options);
    const assets = generateAssets(portfolio, options);
    const metadata = calculatePerformanceMetrics(html, css, js);

    // Generate preview URL
    const previewUrl = `https://preview.example.com/${portfolioId}?device=${device.type}&width=${device.width}&height=${device.height}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const previewResponse: PreviewResponse = {
      html,
      css,
      js,
      assets,
      metadata,
      previewUrl,
      expiresAt,
    };

    // Cache the preview
    previewCache.set(cacheKey, previewResponse);

    // Track usage
    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      "/api/preview",
      "POST",
      duration,
      200,
      JSON.stringify(body).length,
      JSON.stringify(previewResponse).length,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["preview_generation", portfolio.template],
    );

    return createSuccessResponse(
      previewResponse,
      "Preview generated successfully",
    );
  } catch (error) {
    console.error("Preview generation error:", error);

    const duration = Date.now() - startTime;
    trackUsage(
      user.id,
      "/api/preview",
      "POST",
      duration,
      500,
      0,
      0,
      request.headers.get("user-agent") || "unknown",
      request.ip || "unknown",
      ["preview_generation"],
    );

    return createErrorResponse(
      {
        code: "PREVIEW_FAILED",
        message: "Failed to generate preview",
        timestamp: new Date().toISOString(),
        requestId,
        userId: user.id,
      },
      500,
    );
  }
}

// Export the handler with authentication and rate limiting
export const POST = withAuth(handlePreviewGeneration, {
  requiredRole: "user",
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
  },
});

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Request-ID",
      "Access-Control-Max-Age": "86400",
    },
  });
}
