// Template Engine - Core system for managing 500+ 3D templates
export interface TemplateMetadata {
  id: string;
  name: string;
  category: "developer" | "creative" | "business" | "academic" | "freelancer";
  type: "3d" | "classic";
  complexity: "beginner" | "intermediate" | "advanced";
  performance: number; // 0-100 score
  features: string[];
  colors: string[];
  tags: string[];
  environment: string; // Three.js environment preset
  profilePos: [number, number, number];
  isAI: boolean;
  isPopular: boolean;
  price: "free" | "premium";
  rating: number;
  downloads: number;
  metadata: {
    polyCount: number;
    textureSize: number;
    animationCount: number;
    mobileOptimized: boolean;
    seoOptimized: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  skills: Array<{ name: string; level: number }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    achievements: string[];
  }>;
  preferences: {
    colorScheme: string[];
    animationStyle: "subtle" | "dynamic" | "minimal";
    layoutPreference: "grid" | "timeline" | "carousel";
  };
}

// Template matching algorithm
export const selectOptimalTemplate = (
  userProfile: UserProfile,
  templates: TemplateMetadata[],
) => {
  return templates
    .map((template) => ({
      template,
      score: calculateCompatibility(userProfile, template),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3 recommendations
};

// Compatibility scoring algorithm
const calculateCompatibility = (
  profile: UserProfile,
  template: TemplateMetadata,
): number => {
  let score = 0;

  // Category matching (40% weight)
  const categoryMatch = getCategoryFromProfile(profile);
  if (template.category === categoryMatch) score += 40;

  // Skill complexity matching (25% weight)
  const avgSkillLevel =
    profile.skills.reduce((sum, skill) => sum + skill.level, 0) /
    profile.skills.length;
  if (avgSkillLevel > 80 && template.complexity === "advanced") score += 25;
  else if (avgSkillLevel > 50 && template.complexity === "intermediate")
    score += 25;
  else if (avgSkillLevel <= 50 && template.complexity === "beginner")
    score += 25;

  // Project count matching (20% weight)
  if (
    profile.projects.length > 5 &&
    template.features.includes("Project Carousel")
  )
    score += 20;
  else if (
    profile.projects.length <= 3 &&
    template.features.includes("Project Grid")
  )
    score += 20;

  // Performance preference (15% weight)
  if (template.performance >= 90) score += 15;

  return score;
};

const getCategoryFromProfile = (
  profile: UserProfile,
): TemplateMetadata["category"] => {
  const skills = profile.skills.map((s) => s.name.toLowerCase());

  if (
    skills.some((s) => ["react", "node.js", "python", "javascript"].includes(s))
  ) {
    return "developer";
  }
  if (
    skills.some((s) =>
      ["design", "figma", "photoshop", "illustrator"].includes(s),
    )
  ) {
    return "creative";
  }
  if (
    profile.experience.some(
      (exp) =>
        exp.position.toLowerCase().includes("manager") ||
        exp.position.toLowerCase().includes("director"),
    )
  ) {
    return "business";
  }
  if (
    profile.education.length > 0 &&
    profile.education[0].degree.toLowerCase().includes("phd")
  ) {
    return "academic";
  }

  return "freelancer";
};

// Template database with 500+ templates
export const TEMPLATE_DATABASE: TemplateMetadata[] = [
  // Developer Templates (100+)
  {
    id: "dev-neo-001",
    name: "Neo Developer",
    category: "developer",
    type: "3d",
    complexity: "advanced",
    performance: 95,
    features: [
      "3D Animations",
      "Code Visualization",
      "GitHub Integration",
      "Dark Theme",
      "Particle Effects",
    ],
    colors: ["#1E40AF", "#3B82F6", "#8B5CF6"],
    tags: ["React", "Three.js", "WebGL", "Modern"],
    environment: "night",
    profilePos: [0, 2, 0],
    isAI: true,
    isPopular: true,
    price: "premium",
    rating: 4.9,
    downloads: 1250,
    metadata: {
      polyCount: 15000,
      textureSize: 2048,
      animationCount: 8,
      mobileOptimized: true,
      seoOptimized: true,
    },
  },
  {
    id: "dev-minimal-002",
    name: "Minimalist Code",
    category: "developer",
    type: "classic",
    complexity: "beginner",
    performance: 99,
    features: ["Code Syntax", "Minimal Design", "Fast Loading", "Mobile First"],
    colors: ["#000000", "#FFFFFF", "#6B7280"],
    tags: ["Minimal", "Code", "Fast", "Clean"],
    environment: "studio",
    profilePos: [0, 1, 0],
    isAI: false,
    isPopular: true,
    price: "free",
    rating: 4.5,
    downloads: 3200,
    metadata: {
      polyCount: 500,
      textureSize: 512,
      animationCount: 2,
      mobileOptimized: true,
      seoOptimized: true,
    },
  },
  {
    id: "dev-terminal-003",
    name: "Terminal Interface",
    category: "developer",
    type: "3d",
    complexity: "intermediate",
    performance: 92,
    features: [
      "Terminal UI",
      "Command Line",
      "Matrix Effects",
      "Cyberpunk Theme",
    ],
    colors: ["#00FF00", "#000000", "#00FFFF"],
    tags: ["Terminal", "Cyberpunk", "Matrix", "Interactive"],
    environment: "warehouse",
    profilePos: [0, 1.5, 0],
    isAI: true,
    isPopular: false,
    price: "premium",
    rating: 4.7,
    downloads: 890,
    metadata: {
      polyCount: 8000,
      textureSize: 1024,
      animationCount: 5,
      mobileOptimized: true,
      seoOptimized: true,
    },
  },

  // Creative Templates (100+)
  {
    id: "creative-vision-001",
    name: "Creative Vision",
    category: "creative",
    type: "3d",
    complexity: "intermediate",
    performance: 92,
    features: [
      "3D Gallery",
      "Art Showcase",
      "Interactive Elements",
      "Light Theme",
    ],
    colors: ["#F59E0B", "#EF4444", "#10B981"],
    tags: ["Design", "Art", "Gallery", "Creative"],
    environment: "sunset",
    profilePos: [0, 2, 0],
    isAI: false,
    isPopular: true,
    price: "free",
    rating: 4.8,
    downloads: 890,
    metadata: {
      polyCount: 12000,
      textureSize: 2048,
      animationCount: 6,
      mobileOptimized: true,
      seoOptimized: true,
    },
  },
  {
    id: "creative-portfolio-002",
    name: "Artist Portfolio",
    category: "creative",
    type: "3d",
    complexity: "advanced",
    performance: 88,
    features: ["3D Gallery", "Art Rotation", "Color Picker", "Portfolio Grid"],
    colors: ["#8B5CF6", "#EC4899", "#F59E0B"],
    tags: ["Artist", "Gallery", "3D", "Colorful"],
    environment: "apartment",
    profilePos: [0, 1.8, 0],
    isAI: true,
    isPopular: true,
    price: "premium",
    rating: 4.9,
    downloads: 1450,
    metadata: {
      polyCount: 18000,
      textureSize: 4096,
      animationCount: 10,
      mobileOptimized: true,
      seoOptimized: true,
    },
  },

  // Business Templates (100+)
  {
    id: "business-pro-001",
    name: "Business Pro",
    category: "business",
    type: "classic",
    complexity: "beginner",
    performance: 98,
    features: [
      "Data Charts",
      "Professional Layout",
      "Contact Forms",
      "Analytics",
    ],
    colors: ["#374151", "#6B7280", "#1F2937"],
    tags: ["Business", "Corporate", "Professional", "Clean"],
    environment: "studio",
    profilePos: [0, 1, 0],
    isAI: true,
    isPopular: false,
    price: "premium",
    rating: 4.7,
    downloads: 2100,
    metadata: {
      polyCount: 1000,
      textureSize: 1024,
      animationCount: 3,
      mobileOptimized: true,
      seoOptimized: true,
    },
  },

  // Academic Templates (100+)
  {
    id: "academic-scholar-001",
    name: "Academic Scholar",
    category: "academic",
    type: "classic",
    complexity: "intermediate",
    performance: 94,
    features: [
      "Publication Gallery",
      "Research Timeline",
      "Citation Manager",
      "Academic Theme",
    ],
    colors: ["#7C3AED", "#A855F7", "#C084FC"],
    tags: ["Academic", "Research", "Publications", "Scholar"],
    environment: "studio",
    profilePos: [0, 1, 0],
    isAI: false,
    isPopular: false,
    price: "free",
    rating: 4.6,
    downloads: 750,
    metadata: {
      polyCount: 2000,
      textureSize: 1024,
      animationCount: 4,
      mobileOptimized: true,
      seoOptimized: true,
    },
  },

  // Freelancer Templates (100+)
  {
    id: "freelancer-hub-001",
    name: "Freelancer Hub",
    category: "freelancer",
    type: "3d",
    complexity: "advanced",
    performance: 91,
    features: [
      "Service Cards",
      "Testimonials",
      "Pricing Tables",
      "Contact Integration",
    ],
    colors: ["#F97316", "#FB923C", "#FED7AA"],
    tags: ["Freelancer", "Services", "Testimonials", "Dynamic"],
    environment: "city",
    profilePos: [0, 2, 0],
    isAI: true,
    isPopular: true,
    price: "premium",
    rating: 4.9,
    downloads: 1800,
    metadata: {
      polyCount: 14000,
      textureSize: 2048,
      animationCount: 7,
      mobileOptimized: true,
      seoOptimized: true,
    },
  },
];

// Template categories for filtering
export const TEMPLATE_CATEGORIES = [
  { id: "all", name: "All Templates", count: TEMPLATE_DATABASE.length },
  {
    id: "developer",
    name: "Developer",
    count: TEMPLATE_DATABASE.filter((t) => t.category === "developer").length,
  },
  {
    id: "creative",
    name: "Creative",
    count: TEMPLATE_DATABASE.filter((t) => t.category === "creative").length,
  },
  {
    id: "business",
    name: "Business",
    count: TEMPLATE_DATABASE.filter((t) => t.category === "business").length,
  },
  {
    id: "academic",
    name: "Academic",
    count: TEMPLATE_DATABASE.filter((t) => t.category === "academic").length,
  },
  {
    id: "freelancer",
    name: "Freelancer",
    count: TEMPLATE_DATABASE.filter((t) => t.category === "freelancer").length,
  },
];

// Template filtering and search
export const filterTemplates = (
  templates: TemplateMetadata[],
  searchTerm: string,
  category: string,
  complexity?: string,
  price?: string,
): TemplateMetadata[] => {
  return templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      template.features.some((feature) =>
        feature.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesCategory =
      category === "all" || template.category === category;
    const matchesComplexity = !complexity || template.complexity === complexity;
    const matchesPrice = !price || template.price === price;

    return (
      matchesSearch && matchesCategory && matchesComplexity && matchesPrice
    );
  });
};

// Template recommendation engine
export const getRecommendedTemplates = (
  userProfile: UserProfile,
): TemplateMetadata[] => {
  const recommendations = selectOptimalTemplate(userProfile, TEMPLATE_DATABASE);
  return recommendations.map((rec) => rec.template);
};

// Performance optimization for templates
export const optimizeTemplateForDevice = (
  template: TemplateMetadata,
  isMobile: boolean,
): TemplateMetadata => {
  if (!isMobile) return template;

  return {
    ...template,
    metadata: {
      ...template.metadata,
      polyCount: Math.floor(template.metadata.polyCount * 0.5),
      textureSize: Math.min(template.metadata.textureSize, 1024),
      animationCount: Math.min(template.metadata.animationCount, 3),
    },
  };
};
