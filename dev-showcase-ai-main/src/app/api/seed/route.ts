import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log("🌱 Starting database seed...");

    // Create sample templates
    const templates = [
      {
        id: "modern-developer",
        name: "Modern Developer",
        category: "DEVELOPER",
        type: "MODERN",
        complexity: "INTERMEDIATE",
        industry: ["technology", "software"],
        description: "Clean, professional layout perfect for developers",
        config: {
          colors: ["#1E40AF", "#3B82F6", "#60A5FA"],
          layout: "grid",
          animations: ["fade", "slide", "bounce"],
        },
        isPublic: true,
        isPremium: false,
      },
      {
        id: "creative-designer",
        name: "Creative Designer",
        category: "CREATIVE",
        type: "CREATIVE",
        complexity: "ADVANCED",
        industry: ["design", "creative"],
        description: "Bold, artistic design for creative professionals",
        config: {
          colors: ["#7C3AED", "#A855F7", "#C084FC"],
          layout: "masonry",
          animations: ["parallax", "zoom", "rotate"],
        },
        isPublic: true,
        isPremium: true,
      },
      {
        id: "business-professional",
        name: "Business Professional",
        category: "BUSINESS",
        type: "CORPORATE",
        complexity: "BEGINNER",
        industry: ["business", "corporate"],
        description: "Corporate layout for business professionals",
        config: {
          colors: ["#059669", "#10B981", "#34D399"],
          layout: "linear",
          animations: ["fade", "slide"],
        },
        isPublic: true,
        isPremium: false,
      },
    ];

    // Create sample components
    const components = [
      {
        id: "hero-section",
        name: "Hero Section",
        type: "organism",
        category: "header",
        description: "Eye-catching hero section with call-to-action",
        code: `export const HeroSection = ({ title, subtitle, ctaText }) => (
  <section className="hero-section">
    <h1>{title}</h1>
    <p>{subtitle}</p>
    <button>{ctaText}</button>
  </section>
)`,
        props: ["title", "subtitle", "ctaText"],
        styles: ["gradient", "centered", "responsive"],
      },
      {
        id: "project-card",
        name: "Project Card",
        type: "molecule",
        category: "content",
        description: "Card component for showcasing projects",
        code: `export const ProjectCard = ({ title, description, image, link }) => (
  <div className="project-card">
    <img src={image} alt={title} />
    <h3>{title}</h3>
    <p>{description}</p>
    <a href={link}>View Project</a>
  </div>
)`,
        props: ["title", "description", "image", "link"],
        styles: ["card", "hover", "shadow"],
      },
      {
        id: "skill-badge",
        name: "Skill Badge",
        type: "atom",
        category: "ui",
        description: "Badge component for displaying skills",
        code: `export const SkillBadge = ({ skill, level }) => (
  <span className="skill-badge" data-level={level}>
    {skill}
  </span>
)`,
        props: ["skill", "level"],
        styles: ["badge", "colorful", "animated"],
      },
    ];

    // Seed templates
    console.log("📋 Creating templates...");
    for (const template of templates) {
      await prisma.template.upsert({
        where: { id: template.id },
        update: template,
        create: template,
      });
    }

    // Seed components
    console.log("🧩 Creating components...");
    for (const component of components) {
      await prisma.component.upsert({
        where: { id: component.id },
        update: component,
        create: component,
      });
    }

    // Create demo user
    console.log("👤 Creating demo user...");
    const demoUser = await prisma.user.upsert({
      where: { email: "demo@showwork.com" },
      update: {},
      create: {
        email: "demo@showwork.com",
        name: "Demo User",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
    });

    // Create sample portfolios
    console.log("💼 Creating sample portfolios...");
    const portfolios = [
      {
        name: "John Doe - Full Stack Developer",
        description: "Modern portfolio showcasing web development projects",
        url: "john-doe-portfolio",
        templateId: "modern-developer",
        config: {
          hero: {
            title: "John Doe",
            subtitle: "Full Stack Developer",
            description: "Passionate about creating amazing web experiences",
          },
          projects: [
            {
              title: "E-commerce Platform",
              description: "Built with React and Node.js",
              image:
                "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
            },
          ],
          skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
        },
        isPublic: true,
        isPublished: true,
        userId: demoUser.id,
      },
      {
        name: "Sarah Smith - UI/UX Designer",
        description: "Creative portfolio highlighting design projects",
        url: "sarah-smith-portfolio",
        templateId: "creative-designer",
        config: {
          hero: {
            title: "Sarah Smith",
            subtitle: "UI/UX Designer",
            description: "Creating beautiful and functional user experiences",
          },
          projects: [
            {
              title: "Mobile App Design",
              description: "Modern mobile app interface design",
              image:
                "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
            },
          ],
          skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
        },
        isPublic: false,
        isPublished: false,
        userId: demoUser.id,
      },
    ];

    for (const portfolio of portfolios) {
      await prisma.portfolio.upsert({
        where: {
          url: portfolio.url,
        },
        update: portfolio,
        create: portfolio,
      });
    }

    console.log("✅ Database seeded successfully!");

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        templates: templates.length,
        components: components.length,
        portfolios: portfolios.length,
      },
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
