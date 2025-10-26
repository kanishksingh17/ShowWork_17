import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create sample templates
  const templates = [
    {
      id: "modern-developer",
      name: "Modern Developer",
      category: "Developer",
      description: "Clean, professional layout perfect for developers",
      preview: "/templates/modern-developer.jpg",
      features: ["GitHub Integration", "Code Highlighting", "Project Showcase"],
      colors: ["#1E40AF", "#3B82F6", "#60A5FA"],
      layout: "grid",
      animations: ["fade", "slide", "bounce"],
    },
    {
      id: "creative-designer",
      name: "Creative Designer",
      category: "Designer",
      description: "Bold, artistic design for creative professionals",
      preview: "/templates/creative-designer.jpg",
      features: [
        "Portfolio Gallery",
        "Interactive Elements",
        "Visual Showcase",
      ],
      colors: ["#7C3AED", "#A855F7", "#C084FC"],
      layout: "masonry",
      animations: ["parallax", "zoom", "rotate"],
    },
    {
      id: "business-professional",
      name: "Business Professional",
      category: "Business",
      description: "Corporate layout for business professionals",
      preview: "/templates/business-professional.jpg",
      features: ["Resume Integration", "Achievement Timeline", "Contact Forms"],
      colors: ["#059669", "#10B981", "#34D399"],
      layout: "linear",
      animations: ["fade", "slide"],
    },
    {
      id: "minimal-portfolio",
      name: "Minimal Portfolio",
      category: "Minimal",
      description: "Clean, minimal design focusing on content",
      preview: "/templates/minimal-portfolio.jpg",
      features: ["Typography Focus", "White Space", "Simple Navigation"],
      colors: ["#374151", "#6B7280", "#9CA3AF"],
      layout: "centered",
      animations: ["fade"],
    },
    {
      id: "tech-startup",
      name: "Tech Startup",
      category: "Startup",
      description: "Modern, dynamic design for tech entrepreneurs",
      preview: "/templates/tech-startup.jpg",
      features: ["Dynamic Animations", "Tech Stack Showcase", "Team Section"],
      colors: ["#DC2626", "#EF4444", "#F87171"],
      layout: "dynamic",
      animations: ["particle", "glow", "morph"],
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

  // Create sample users
  const users = [
    {
      email: "demo@showwork.com",
      name: "Demo User",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      email: "john@example.com",
      name: "John Doe",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
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

  // Seed users (only if they don't exist)
  console.log("👤 Creating demo users...");
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: user,
      });
    }
  }

  // Create sample portfolios
  console.log("💼 Creating sample portfolios...");
  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@showwork.com" },
  });

  if (demoUser) {
    const portfolios = [
      {
        title: "John Doe - Full Stack Developer",
        description: "Modern portfolio showcasing web development projects",
        template: "modern-developer",
        content: {
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
        userId: demoUser.id,
      },
      {
        title: "Sarah Smith - UI/UX Designer",
        description: "Creative portfolio highlighting design projects",
        template: "creative-designer",
        content: {
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
        userId: demoUser.id,
      },
    ];

    for (const portfolio of portfolios) {
      await prisma.portfolio.upsert({
        where: {
          title_userId: {
            title: portfolio.title,
            userId: portfolio.userId,
          },
        },
        update: portfolio,
        create: portfolio,
      });
    }
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
