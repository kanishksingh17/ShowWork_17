// Dynamic Template Generation System - Creates Unique Templates Every Time
export interface DynamicTemplateConfig {
  baseTemplate: string;
  userProfile: {
    profession: string;
    industry: string;
    experience: string;
    skills: string[];
    personality: string[];
    preferences: {
      colorScheme?: string[];
      layoutStyle?: "minimal" | "modern" | "creative" | "corporate";
      animationStyle?: "subtle" | "dynamic" | "minimal";
    };
  };
  generationOptions: {
    randomizeColors: boolean;
    randomizeLayout: boolean;
    randomizeAnimations: boolean;
    randomizeComponents: boolean;
    aiEnhancement: boolean;
  };
}

export interface GeneratedTemplate {
  id: string;
  name: string;
  baseTemplate: string;
  uniqueId: string;
  generatedAt: string;
  customization: {
    colors: ColorPalette;
    layout: LayoutConfig;
    animations: AnimationConfig;
    components: ComponentConfig[];
    typography: TypographyConfig;
    spacing: SpacingConfig;
  };
  metadata: {
    generationSeed: string;
    aiEnhanced: boolean;
    uniquenessScore: number;
    performanceScore: number;
  };
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  success: string;
  warning: string;
  error: string;
}

export interface LayoutConfig {
  container: "full-width" | "centered" | "sidebar" | "grid";
  sections: SectionLayout[];
  spacing: "tight" | "normal" | "loose" | "custom";
  alignment: "left" | "center" | "right" | "justify";
}

export interface AnimationConfig {
  enabled: boolean;
  style: "fade" | "slide" | "zoom" | "rotate" | "bounce" | "custom";
  duration: number;
  easing: string;
  stagger: boolean;
  reducedMotion: boolean;
}

export interface ComponentConfig {
  id: string;
  type:
    | "hero"
    | "about"
    | "projects"
    | "skills"
    | "experience"
    | "contact"
    | "3d"
    | "interactive";
  position: number;
  enabled: boolean;
  customization: any;
}

export interface TypographyConfig {
  fontFamily: string;
  headingFont: string;
  bodyFont: string;
  sizes: {
    h1: string;
    h2: string;
    h3: string;
    body: string;
    small: string;
  };
  weights: {
    light: number;
    normal: number;
    medium: number;
    bold: number;
  };
}

export interface SpacingConfig {
  section: string;
  component: string;
  element: string;
  custom: Record<string, string>;
}

export interface SectionLayout {
  id: string;
  type: string;
  order: number;
  width: "full" | "half" | "third" | "quarter";
  alignment: "left" | "center" | "right";
  padding: string;
  margin: string;
}

// Dynamic Template Generator
export class DynamicTemplateGenerator {
  private colorSchemes = {
    professional: [
      { primary: "#1E40AF", secondary: "#3B82F6", accent: "#8B5CF6" },
      { primary: "#059669", secondary: "#10B981", accent: "#34D399" },
      { primary: "#DC2626", secondary: "#EF4444", accent: "#F87171" },
      { primary: "#7C3AED", secondary: "#A855F7", accent: "#C084FC" },
      { primary: "#EA580C", secondary: "#F97316", accent: "#FB923C" },
    ],
    creative: [
      { primary: "#F59E0B", secondary: "#EF4444", accent: "#10B981" },
      { primary: "#8B5CF6", secondary: "#EC4899", accent: "#F59E0B" },
      { primary: "#06B6D4", secondary: "#3B82F6", accent: "#8B5CF6" },
      { primary: "#F97316", secondary: "#EF4444", accent: "#EC4899" },
      { primary: "#10B981", secondary: "#059669", accent: "#34D399" },
    ],
    corporate: [
      { primary: "#374151", secondary: "#6B7280", accent: "#1F2937" },
      { primary: "#1E40AF", secondary: "#3B82F6", accent: "#60A5FA" },
      { primary: "#059669", secondary: "#10B981", accent: "#34D399" },
      { primary: "#7C3AED", secondary: "#A855F7", accent: "#C084FC" },
      { primary: "#DC2626", secondary: "#EF4444", accent: "#F87171" },
    ],
  };

  private fontFamilies = [
    "Inter",
    "Poppins",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Nunito",
    "Source Sans Pro",
    "Raleway",
    "Ubuntu",
  ];

  private layoutStyles = [
    "minimal",
    "modern",
    "creative",
    "corporate",
    "grid",
    "masonry",
    "timeline",
  ];

  private animationStyles = [
    "fade",
    "slide",
    "zoom",
    "rotate",
    "bounce",
    "elastic",
    "back",
  ];

  // Generate a unique template
  async generateUniqueTemplate(
    config: DynamicTemplateConfig,
  ): Promise<GeneratedTemplate> {
    const uniqueId = this.generateUniqueId();
    const generationSeed = this.generateSeed();
    const timestamp = new Date().toISOString();

    // Generate unique customization
    const customization = await this.generateCustomization(
      config,
      generationSeed,
    );

    // Calculate uniqueness score
    const uniquenessScore = this.calculateUniquenessScore(customization);

    // Calculate performance score
    const performanceScore = this.calculatePerformanceScore(customization);

    return {
      id: `${config.baseTemplate}-${uniqueId}`,
      name: `${this.generateTemplateName(config.userProfile)} ${uniqueId}`,
      baseTemplate: config.baseTemplate,
      uniqueId,
      generatedAt: timestamp,
      customization,
      metadata: {
        generationSeed,
        aiEnhanced: config.generationOptions.aiEnhancement,
        uniquenessScore,
        performanceScore,
      },
    };
  }

  // Generate unique customization
  private async generateCustomization(
    config: DynamicTemplateConfig,
    seed: string,
  ): Promise<GeneratedTemplate["customization"]> {
    const random = this.createSeededRandom(seed);

    return {
      colors: this.generateColorPalette(config, random),
      layout: this.generateLayout(config, random),
      animations: this.generateAnimations(config, random),
      components: this.generateComponents(config, random),
      typography: this.generateTypography(config, random),
      spacing: this.generateSpacing(config, random),
    };
  }

  // Generate unique color palette
  private generateColorPalette(
    config: DynamicTemplateConfig,
    random: () => number,
  ): ColorPalette {
    const schemeType = this.getColorSchemeType(config.userProfile.industry);
    const schemes = this.colorSchemes[schemeType];
    const baseScheme = schemes[Math.floor(random() * schemes.length)];

    // Add randomization if enabled
    if (config.generationOptions.randomizeColors) {
      return {
        primary: this.randomizeColor(baseScheme.primary, random),
        secondary: this.randomizeColor(baseScheme.secondary, random),
        accent: this.randomizeColor(baseScheme.accent, random),
        background: this.generateBackgroundColor(random),
        surface: this.generateSurfaceColor(random),
        text: this.generateTextColor(random),
        textMuted: this.generateMutedTextColor(random),
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      };
    }

    return {
      ...baseScheme,
      background: "#0F172A",
      surface: "#1E293B",
      text: "#FFFFFF",
      textMuted: "#94A3B8",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    };
  }

  // Generate unique layout
  private generateLayout(
    config: DynamicTemplateConfig,
    random: () => number,
  ): LayoutConfig {
    const layoutStyle =
      config.userProfile.preferences?.layoutStyle ||
      this.layoutStyles[Math.floor(random() * this.layoutStyles.length)];

    return {
      container: this.selectContainerType(layoutStyle, random),
      sections: this.generateSections(config, random),
      spacing: this.selectSpacing(layoutStyle, random),
      alignment: this.selectAlignment(layoutStyle, random),
    };
  }

  // Generate unique animations
  private generateAnimations(
    config: DynamicTemplateConfig,
    random: () => number,
  ): AnimationConfig {
    const animationStyle =
      config.userProfile.preferences?.animationStyle ||
      this.animationStyles[Math.floor(random() * this.animationStyles.length)];

    return {
      enabled: config.generationOptions.randomizeAnimations
        ? random() > 0.3
        : true,
      style: animationStyle as any,
      duration: this.generateDuration(animationStyle, random),
      easing: this.generateEasing(animationStyle, random),
      stagger: random() > 0.5,
      reducedMotion: true,
    };
  }

  // Generate unique components
  private generateComponents(
    config: DynamicTemplateConfig,
    random: () => number,
  ): ComponentConfig[] {
    const baseComponents = [
      { id: "hero", type: "hero", position: 1, enabled: true },
      { id: "about", type: "about", position: 2, enabled: true },
      { id: "projects", type: "projects", position: 3, enabled: true },
      { id: "skills", type: "skills", position: 4, enabled: random() > 0.3 },
      {
        id: "experience",
        type: "experience",
        position: 5,
        enabled: random() > 0.4,
      },
      { id: "contact", type: "contact", position: 6, enabled: true },
    ];

    // Add 3D components based on profession
    if (
      config.userProfile.profession.toLowerCase().includes("developer") ||
      config.userProfile.profession.toLowerCase().includes("designer")
    ) {
      baseComponents.push({
        id: "3d-showcase",
        type: "3d",
        position: Math.floor(random() * 3) + 2,
        enabled: random() > 0.5,
      });
    }

    // Randomize component order and customization
    return baseComponents
      .filter((comp) => comp.enabled)
      .map((comp) => ({
        ...comp,
        position: comp.position + (random() - 0.5) * 2,
        customization: this.generateComponentCustomization(comp.type, random),
      }))
      .sort((a, b) => a.position - b.position);
  }

  // Generate unique typography
  private generateTypography(
    config: DynamicTemplateConfig,
    random: () => number,
  ): TypographyConfig {
    const fontFamily =
      this.fontFamilies[Math.floor(random() * this.fontFamilies.length)];

    return {
      fontFamily,
      headingFont: fontFamily,
      bodyFont: fontFamily,
      sizes: {
        h1: `${3 + random() * 2}rem`,
        h2: `${2 + random() * 1.5}rem`,
        h3: `${1.5 + random() * 1}rem`,
        body: `${0.875 + random() * 0.25}rem`,
        small: `${0.75 + random() * 0.125}rem`,
      },
      weights: {
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700,
      },
    };
  }

  // Generate unique spacing
  private generateSpacing(
    config: DynamicTemplateConfig,
    random: () => number,
  ): SpacingConfig {
    const baseSpacing = 1 + random() * 2; // 1-3rem base spacing

    return {
      section: `${baseSpacing * 4}rem`,
      component: `${baseSpacing * 2}rem`,
      element: `${baseSpacing}rem`,
      custom: {
        hero: `${baseSpacing * 6}rem`,
        footer: `${baseSpacing * 3}rem`,
        sidebar: `${baseSpacing * 2}rem`,
      },
    };
  }

  // Helper methods
  private generateUniqueId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private generateSeed(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private createSeededRandom(seed: string): () => number {
    let x = 0;
    for (let i = 0; i < seed.length; i++) {
      x = ((x << 5) - x + seed.charCodeAt(i)) & 0xffffffff;
    }

    return () => {
      x = (x * 1664525 + 1013904223) & 0xffffffff;
      return (x >>> 0) / 0x100000000;
    };
  }

  private getColorSchemeType(industry: string): keyof typeof this.colorSchemes {
    if (
      ["technology", "software", "startups"].includes(industry.toLowerCase())
    ) {
      return "professional";
    }
    if (
      ["design", "art", "creative", "marketing"].includes(
        industry.toLowerCase(),
      )
    ) {
      return "creative";
    }
    return "corporate";
  }

  private randomizeColor(baseColor: string, random: () => number): string {
    // Convert hex to HSL, randomize, convert back
    const hex = baseColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    // Randomize hue slightly
    h = (h + (random() - 0.5) * 0.2) % 1;
    s = Math.max(0.3, Math.min(0.8, s + (random() - 0.5) * 0.2));
    l = Math.max(0.2, Math.min(0.8, l + (random() - 0.5) * 0.1));

    return this.hslToHex(h, s, l);
  }

  private hslToHex(h: number, s: number, l: number): string {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 1 / 6) {
      r = c;
      g = x;
      b = 0;
    } else if (1 / 6 <= h && h < 1 / 3) {
      r = x;
      g = c;
      b = 0;
    } else if (1 / 3 <= h && h < 1 / 2) {
      r = 0;
      g = c;
      b = x;
    } else if (1 / 2 <= h && h < 2 / 3) {
      r = 0;
      g = x;
      b = c;
    } else if (2 / 3 <= h && h < 5 / 6) {
      r = x;
      g = 0;
      b = c;
    } else if (5 / 6 <= h && h < 1) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  private generateBackgroundColor(random: () => number): string {
    const backgrounds = ["#0F172A", "#1E293B", "#FFFFFF", "#F8FAFC", "#000000"];
    return backgrounds[Math.floor(random() * backgrounds.length)];
  }

  private generateSurfaceColor(random: () => number): string {
    const surfaces = ["#1E293B", "#374151", "#F1F5F9", "#E2E8F0", "#1F2937"];
    return surfaces[Math.floor(random() * surfaces.length)];
  }

  private generateTextColor(random: () => number): string {
    const texts = ["#FFFFFF", "#1F2937", "#000000", "#374151", "#F8FAFC"];
    return texts[Math.floor(random() * texts.length)];
  }

  private generateMutedTextColor(random: () => number): string {
    const muted = ["#94A3B8", "#6B7280", "#9CA3AF", "#64748B", "#A1A1AA"];
    return muted[Math.floor(random() * muted.length)];
  }

  private selectContainerType(
    layoutStyle: string,
    random: () => number,
  ): LayoutConfig["container"] {
    const containers = {
      minimal: ["centered", "full-width"],
      modern: ["centered", "grid"],
      creative: ["full-width", "grid"],
      corporate: ["centered", "sidebar"],
    };

    const options = containers[layoutStyle as keyof typeof containers] || [
      "centered",
    ];
    return options[
      Math.floor(random() * options.length)
    ] as LayoutConfig["container"];
  }

  private generateSections(
    config: DynamicTemplateConfig,
    random: () => number,
  ): SectionLayout[] {
    const sections = [
      {
        id: "hero",
        type: "hero",
        order: 1,
        width: "full",
        alignment: "center",
        padding: "6rem",
        margin: "0",
      },
      {
        id: "about",
        type: "about",
        order: 2,
        width: "full",
        alignment: "left",
        padding: "4rem",
        margin: "2rem 0",
      },
      {
        id: "projects",
        type: "projects",
        order: 3,
        width: "full",
        alignment: "center",
        padding: "4rem",
        margin: "2rem 0",
      },
      {
        id: "skills",
        type: "skills",
        order: 4,
        width: "full",
        alignment: "center",
        padding: "3rem",
        margin: "1rem 0",
      },
      {
        id: "contact",
        type: "contact",
        order: 5,
        width: "full",
        alignment: "center",
        padding: "4rem",
        margin: "2rem 0",
      },
    ];

    // Randomize section properties
    return sections.map((section) => ({
      ...section,
      width: ["full", "half", "third"][Math.floor(random() * 3)] as any,
      alignment: ["left", "center", "right"][Math.floor(random() * 3)] as any,
      padding: `${2 + random() * 4}rem`,
      margin: `${random() * 2}rem 0`,
    }));
  }

  private selectSpacing(
    layoutStyle: string,
    random: () => number,
  ): LayoutConfig["spacing"] {
    const spacings = {
      minimal: ["tight", "normal"],
      modern: ["normal", "loose"],
      creative: ["loose", "custom"],
      corporate: ["normal", "tight"],
    };

    const options = spacings[layoutStyle as keyof typeof spacings] || [
      "normal",
    ];
    return options[
      Math.floor(random() * options.length)
    ] as LayoutConfig["spacing"];
  }

  private selectAlignment(
    layoutStyle: string,
    random: () => number,
  ): LayoutConfig["alignment"] {
    const alignments = {
      minimal: ["center", "left"],
      modern: ["center", "left"],
      creative: ["center", "justify"],
      corporate: ["left", "center"],
    };

    const options = alignments[layoutStyle as keyof typeof alignments] || [
      "center",
    ];
    return options[
      Math.floor(random() * options.length)
    ] as LayoutConfig["alignment"];
  }

  private generateDuration(
    animationStyle: string,
    random: () => number,
  ): number {
    const durations = {
      fade: 300 + random() * 500,
      slide: 400 + random() * 600,
      zoom: 200 + random() * 400,
      rotate: 500 + random() * 1000,
      bounce: 600 + random() * 800,
      elastic: 800 + random() * 1200,
      back: 400 + random() * 600,
    };

    return durations[animationStyle as keyof typeof durations] || 500;
  }

  private generateEasing(animationStyle: string, random: () => number): string {
    const easings = {
      fade: ["ease-in-out", "ease-out", "ease-in"],
      slide: ["ease-out", "ease-in-out", "cubic-bezier(0.4, 0, 0.2, 1)"],
      zoom: [
        "ease-out",
        "ease-in-out",
        "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      ],
      rotate: [
        "ease-in-out",
        "linear",
        "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      ],
      bounce: ["cubic-bezier(0.68, -0.55, 0.265, 1.55)", "ease-out"],
      elastic: [
        "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      ],
      back: ["cubic-bezier(0.68, -0.55, 0.265, 1.55)", "ease-out"],
    };

    const options = easings[animationStyle as keyof typeof easings] || [
      "ease-in-out",
    ];
    return options[Math.floor(random() * options.length)];
  }

  private generateComponentCustomization(
    type: string,
    random: () => number,
  ): any {
    const customizations = {
      hero: {
        background: ["gradient", "solid", "image", "3d"][
          Math.floor(random() * 4)
        ],
        layout: ["centered", "split", "full-width"][Math.floor(random() * 3)],
        animation: ["fade", "slide", "zoom"][Math.floor(random() * 3)],
      },
      about: {
        layout: ["text-only", "image-text", "cards"][Math.floor(random() * 3)],
        alignment: ["left", "center", "justify"][Math.floor(random() * 3)],
      },
      projects: {
        layout: ["grid", "masonry", "carousel"][Math.floor(random() * 3)],
        columns: Math.floor(random() * 3) + 2, // 2-4 columns
        animation: ["fade", "slide", "zoom"][Math.floor(random() * 3)],
      },
      skills: {
        visualization: ["bars", "circles", "tags"][Math.floor(random() * 3)],
        layout: ["grid", "list", "cloud"][Math.floor(random() * 3)],
      },
      contact: {
        layout: ["form-only", "form-info", "split"][Math.floor(random() * 3)],
        fields: ["name", "email", "message", "phone"][Math.floor(random() * 4)],
      },
    };

    return customizations[type as keyof typeof customizations] || {};
  }

  private generateTemplateName(userProfile: any): string {
    const adjectives = [
      "Dynamic",
      "Modern",
      "Creative",
      "Professional",
      "Innovative",
      "Elegant",
      "Bold",
      "Minimal",
    ];
    const nouns = [
      "Portfolio",
      "Showcase",
      "Profile",
      "Presence",
      "Hub",
      "Space",
      "Studio",
      "Works",
    ];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adjective} ${noun}`;
  }

  private calculateUniquenessScore(
    customization: GeneratedTemplate["customization"],
  ): number {
    let score = 0;

    // Color uniqueness
    const colorHash = Object.values(customization.colors).join("");
    score += this.hashToScore(colorHash);

    // Layout uniqueness
    const layoutHash = JSON.stringify(customization.layout);
    score += this.hashToScore(layoutHash);

    // Animation uniqueness
    const animationHash = JSON.stringify(customization.animations);
    score += this.hashToScore(animationHash);

    return Math.min(100, score / 3);
  }

  private calculatePerformanceScore(
    customization: GeneratedTemplate["customization"],
  ): number {
    let score = 100;

    // Reduce score for complex animations
    if (
      customization.animations.enabled &&
      customization.animations.style === "bounce"
    ) {
      score -= 10;
    }

    // Reduce score for complex layouts
    if (
      customization.layout.container === "grid" &&
      customization.layout.sections.length > 5
    ) {
      score -= 5;
    }

    // Reduce score for too many components
    if (customization.components.length > 6) {
      score -= 5;
    }

    return Math.max(70, score);
  }

  private hashToScore(hash: string): number {
    let score = 0;
    for (let i = 0; i < hash.length; i++) {
      score += hash.charCodeAt(i);
    }
    return score % 100;
  }
}

// Export the generator
export const dynamicTemplateGenerator = new DynamicTemplateGenerator();
