import {
  AtomComponent,
  AtomVariant,
  ComponentProp,
  ComponentStyle,
  AccessibilityConfig,
  ResponsiveConfig,
  ComponentMetadata,
  PerformanceMetrics,
  SEOConfig,
} from "./types";

// Base atom configuration
const baseAccessibility: AccessibilityConfig = {
  keyboardNavigation: true,
  screenReaderSupport: true,
  colorContrast: "AA",
  focusManagement: true,
  semanticHTML: true,
};

const baseResponsive: ResponsiveConfig = {
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
  mobileFirst: true,
  fluidLayout: true,
  adaptiveImages: true,
};

const basePerformance: PerformanceMetrics = {
  bundleSize: 1,
  renderTime: 1,
  memoryUsage: 1,
  lighthouseScore: 95,
};

const baseSEO: SEOConfig = {
  semanticHTML: true,
  metaTags: true,
  structuredData: true,
  socialSharing: true,
};

const baseMetadata: ComponentMetadata = {
  version: "1.0.0",
  author: "ShowWork Team",
  createdAt: new Date(),
  updatedAt: new Date(),
  dependencies: [],
  compatibility: ["modern"],
  performance: basePerformance,
  seo: baseSEO,
};

// Button Atom
export const buttonAtom: AtomComponent = {
  id: "button",
  type: "atom",
  element: "button",
  name: "Button",
  description: "Interactive button element with multiple variants and states",
  category: "interactive",
  tags: ["ui", "interactive", "form"],
  props: [
    {
      name: "children",
      type: "string",
      required: true,
      description: "Button text content",
    },
    {
      name: "variant",
      type: "string",
      required: false,
      defaultValue: "primary",
      description: "Button style variant",
    },
    {
      name: "size",
      type: "string",
      required: false,
      defaultValue: "md",
      description: "Button size",
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether button is disabled",
    },
    {
      name: "loading",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether button is in loading state",
    },
    {
      name: "onClick",
      type: "function",
      required: false,
      description: "Click handler function",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "color",
      properties: ["backgroundColor", "color", "borderColor"],
      defaultValue: "primary",
      description: "Button color variant",
    },
    {
      name: "size",
      type: "spacing",
      properties: ["padding", "fontSize", "borderRadius"],
      defaultValue: "md",
      description: "Button size",
    },
    {
      name: "shape",
      type: "layout",
      properties: ["borderRadius"],
      defaultValue: "rounded",
      description: "Button shape",
    },
  ],
  variants: [
    {
      name: "primary",
      styles: {
        backgroundColor: "#3B82F6",
        color: "#FFFFFF",
        borderColor: "#3B82F6",
      },
      props: {},
    },
    {
      name: "secondary",
      styles: {
        backgroundColor: "#F3F4F6",
        color: "#374151",
        borderColor: "#D1D5DB",
      },
      props: {},
    },
    {
      name: "outline",
      styles: {
        backgroundColor: "transparent",
        color: "#3B82F6",
        borderColor: "#3B82F6",
      },
      props: {},
    },
    {
      name: "ghost",
      styles: {
        backgroundColor: "transparent",
        color: "#3B82F6",
        borderColor: "transparent",
      },
      props: {},
    },
    {
      name: "danger",
      styles: {
        backgroundColor: "#EF4444",
        color: "#FFFFFF",
        borderColor: "#EF4444",
      },
      props: {},
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Input Atom
export const inputAtom: AtomComponent = {
  id: "input",
  type: "atom",
  element: "input",
  name: "Input",
  description: "Form input element with validation and styling",
  category: "form",
  tags: ["form", "input", "validation"],
  props: [
    {
      name: "type",
      type: "string",
      required: false,
      defaultValue: "text",
      description: "Input type",
    },
    {
      name: "placeholder",
      type: "string",
      required: false,
      description: "Placeholder text",
    },
    {
      name: "value",
      type: "string",
      required: false,
      description: "Input value",
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether input is disabled",
    },
    {
      name: "required",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether input is required",
    },
    {
      name: "onChange",
      type: "function",
      required: false,
      description: "Change handler function",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "color",
      properties: ["backgroundColor", "color", "borderColor"],
      defaultValue: "default",
      description: "Input color variant",
    },
    {
      name: "size",
      type: "spacing",
      properties: ["padding", "fontSize", "borderRadius"],
      defaultValue: "md",
      description: "Input size",
    },
    {
      name: "state",
      type: "color",
      properties: ["borderColor", "boxShadow"],
      defaultValue: "default",
      description: "Input state (error, success, etc.)",
    },
  ],
  variants: [
    {
      name: "default",
      styles: {
        backgroundColor: "#FFFFFF",
        color: "#374151",
        borderColor: "#D1D5DB",
      },
      props: {},
    },
    {
      name: "filled",
      styles: {
        backgroundColor: "#F9FAFB",
        color: "#374151",
        borderColor: "#E5E7EB",
      },
      props: {},
    },
    {
      name: "error",
      styles: {
        backgroundColor: "#FFFFFF",
        color: "#374151",
        borderColor: "#EF4444",
      },
      props: {},
    },
    {
      name: "success",
      styles: {
        backgroundColor: "#FFFFFF",
        color: "#374151",
        borderColor: "#10B981",
      },
      props: {},
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Text Atom
export const textAtom: AtomComponent = {
  id: "text",
  type: "atom",
  element: "text",
  name: "Text",
  description: "Typography element with semantic meaning",
  category: "typography",
  tags: ["text", "typography", "semantic"],
  props: [
    {
      name: "children",
      type: "string",
      required: true,
      description: "Text content",
    },
    {
      name: "variant",
      type: "string",
      required: false,
      defaultValue: "body",
      description: "Text variant (heading, body, caption, etc.)",
    },
    {
      name: "color",
      type: "string",
      required: false,
      defaultValue: "inherit",
      description: "Text color",
    },
    {
      name: "align",
      type: "string",
      required: false,
      defaultValue: "left",
      description: "Text alignment",
    },
    {
      name: "truncate",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether to truncate overflow text",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "typography",
      properties: ["fontSize", "fontWeight", "lineHeight"],
      defaultValue: "body",
      description: "Text typography variant",
    },
    {
      name: "color",
      type: "color",
      properties: ["color"],
      defaultValue: "inherit",
      description: "Text color",
    },
    {
      name: "align",
      type: "layout",
      properties: ["textAlign"],
      defaultValue: "left",
      description: "Text alignment",
    },
  ],
  variants: [
    {
      name: "h1",
      styles: {
        fontSize: "2.25rem",
        fontWeight: 700,
        lineHeight: 1.2,
      },
      props: {},
    },
    {
      name: "h2",
      styles: {
        fontSize: "1.875rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      props: {},
    },
    {
      name: "h3",
      styles: {
        fontSize: "1.5rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      props: {},
    },
    {
      name: "body",
      styles: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.5,
      },
      props: {},
    },
    {
      name: "caption",
      styles: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.4,
      },
      props: {},
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Icon Atom
export const iconAtom: AtomComponent = {
  id: "icon",
  type: "atom",
  element: "icon",
  name: "Icon",
  description: "Icon component with consistent sizing and styling",
  category: "ui",
  tags: ["icon", "ui", "visual"],
  props: [
    {
      name: "name",
      type: "string",
      required: true,
      description: "Icon name",
    },
    {
      name: "size",
      type: "string",
      required: false,
      defaultValue: "md",
      description: "Icon size",
    },
    {
      name: "color",
      type: "string",
      required: false,
      defaultValue: "currentColor",
      description: "Icon color",
    },
    {
      name: "strokeWidth",
      type: "number",
      required: false,
      defaultValue: 2,
      description: "Icon stroke width",
    },
    {
      name: "animated",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether icon has animation",
    },
  ],
  styles: [
    {
      name: "size",
      type: "spacing",
      properties: ["width", "height"],
      defaultValue: "md",
      description: "Icon size",
    },
    {
      name: "color",
      type: "color",
      properties: ["color"],
      defaultValue: "currentColor",
      description: "Icon color",
    },
    {
      name: "animation",
      type: "animation",
      properties: ["animation", "transition"],
      defaultValue: "none",
      description: "Icon animation",
    },
  ],
  variants: [
    {
      name: "sm",
      styles: {
        width: "1rem",
        height: "1rem",
      },
      props: {},
    },
    {
      name: "md",
      styles: {
        width: "1.5rem",
        height: "1.5rem",
      },
      props: {},
    },
    {
      name: "lg",
      styles: {
        width: "2rem",
        height: "2rem",
      },
      props: {},
    },
    {
      name: "xl",
      styles: {
        width: "2.5rem",
        height: "2.5rem",
      },
      props: {},
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Image Atom
export const imageAtom: AtomComponent = {
  id: "image",
  type: "atom",
  element: "image",
  name: "Image",
  description: "Responsive image component with lazy loading and optimization",
  category: "media",
  tags: ["image", "media", "responsive"],
  props: [
    {
      name: "src",
      type: "string",
      required: true,
      description: "Image source URL",
    },
    {
      name: "alt",
      type: "string",
      required: true,
      description: "Image alt text for accessibility",
    },
    {
      name: "width",
      type: "number",
      required: false,
      description: "Image width",
    },
    {
      name: "height",
      type: "number",
      required: false,
      description: "Image height",
    },
    {
      name: "lazy",
      type: "boolean",
      required: false,
      defaultValue: true,
      description: "Whether to lazy load the image",
    },
    {
      name: "placeholder",
      type: "string",
      required: false,
      description: "Placeholder image URL",
    },
  ],
  styles: [
    {
      name: "fit",
      type: "layout",
      properties: ["objectFit"],
      defaultValue: "cover",
      description: "How image fits container",
    },
    {
      name: "position",
      type: "layout",
      properties: ["objectPosition"],
      defaultValue: "center",
      description: "Image position in container",
    },
    {
      name: "radius",
      type: "layout",
      properties: ["borderRadius"],
      defaultValue: "none",
      description: "Image border radius",
    },
  ],
  variants: [
    {
      name: "cover",
      styles: {
        objectFit: "cover",
      },
      props: {},
    },
    {
      name: "contain",
      styles: {
        objectFit: "contain",
      },
      props: {},
    },
    {
      name: "fill",
      styles: {
        objectFit: "fill",
      },
      props: {},
    },
    {
      name: "rounded",
      styles: {
        borderRadius: "0.5rem",
      },
      props: {},
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Link Atom
export const linkAtom: AtomComponent = {
  id: "link",
  type: "atom",
  element: "link",
  name: "Link",
  description: "Accessible link component with external link handling",
  category: "navigation",
  tags: ["link", "navigation", "interactive"],
  props: [
    {
      name: "href",
      type: "string",
      required: true,
      description: "Link destination URL",
    },
    {
      name: "children",
      type: "string",
      required: true,
      description: "Link text content",
    },
    {
      name: "external",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether link opens in new tab",
    },
    {
      name: "variant",
      type: "string",
      required: false,
      defaultValue: "default",
      description: "Link style variant",
    },
    {
      name: "underline",
      type: "boolean",
      required: false,
      defaultValue: true,
      description: "Whether to show underline",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "color",
      properties: ["color", "textDecoration"],
      defaultValue: "default",
      description: "Link color variant",
    },
    {
      name: "underline",
      type: "layout",
      properties: ["textDecoration"],
      defaultValue: "underline",
      description: "Link underline style",
    },
    {
      name: "hover",
      type: "color",
      properties: ["color", "textDecoration"],
      defaultValue: "hover",
      description: "Link hover state",
    },
  ],
  variants: [
    {
      name: "default",
      styles: {
        color: "#3B82F6",
        textDecoration: "underline",
      },
      props: {},
    },
    {
      name: "subtle",
      styles: {
        color: "#6B7280",
        textDecoration: "none",
      },
      props: {},
    },
    {
      name: "button",
      styles: {
        color: "#FFFFFF",
        backgroundColor: "#3B82F6",
        padding: "0.5rem 1rem",
        borderRadius: "0.375rem",
        textDecoration: "none",
      },
      props: {},
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Badge Atom
export const badgeAtom: AtomComponent = {
  id: "badge",
  type: "atom",
  element: "text",
  name: "Badge",
  description: "Small status indicator with color variants",
  category: "ui",
  tags: ["badge", "status", "indicator"],
  props: [
    {
      name: "children",
      type: "string",
      required: true,
      description: "Badge text content",
    },
    {
      name: "variant",
      type: "string",
      required: false,
      defaultValue: "default",
      description: "Badge color variant",
    },
    {
      name: "size",
      type: "string",
      required: false,
      defaultValue: "sm",
      description: "Badge size",
    },
    {
      name: "pill",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether badge is pill-shaped",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "color",
      properties: ["backgroundColor", "color"],
      defaultValue: "default",
      description: "Badge color variant",
    },
    {
      name: "size",
      type: "spacing",
      properties: ["padding", "fontSize", "borderRadius"],
      defaultValue: "sm",
      description: "Badge size",
    },
    {
      name: "shape",
      type: "layout",
      properties: ["borderRadius"],
      defaultValue: "rounded",
      description: "Badge shape",
    },
  ],
  variants: [
    {
      name: "default",
      styles: {
        backgroundColor: "#F3F4F6",
        color: "#374151",
      },
      props: {},
    },
    {
      name: "primary",
      styles: {
        backgroundColor: "#DBEAFE",
        color: "#1E40AF",
      },
      props: {},
    },
    {
      name: "success",
      styles: {
        backgroundColor: "#D1FAE5",
        color: "#065F46",
      },
      props: {},
    },
    {
      name: "warning",
      styles: {
        backgroundColor: "#FEF3C7",
        color: "#92400E",
      },
      props: {},
    },
    {
      name: "error",
      styles: {
        backgroundColor: "#FEE2E2",
        color: "#991B1B",
      },
      props: {},
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Avatar Atom
export const avatarAtom: AtomComponent = {
  id: "avatar",
  type: "atom",
  element: "image",
  name: "Avatar",
  description: "User profile image with fallback and status indicator",
  category: "ui",
  tags: ["avatar", "profile", "user"],
  props: [
    {
      name: "src",
      type: "string",
      required: false,
      description: "Avatar image URL",
    },
    {
      name: "alt",
      type: "string",
      required: true,
      description: "Avatar alt text",
    },
    {
      name: "name",
      type: "string",
      required: false,
      description: "User name for fallback initials",
    },
    {
      name: "size",
      type: "string",
      required: false,
      defaultValue: "md",
      description: "Avatar size",
    },
    {
      name: "status",
      type: "string",
      required: false,
      description: "Status indicator (online, offline, away)",
    },
  ],
  styles: [
    {
      name: "size",
      type: "spacing",
      properties: ["width", "height"],
      defaultValue: "md",
      description: "Avatar size",
    },
    {
      name: "shape",
      type: "layout",
      properties: ["borderRadius"],
      defaultValue: "rounded-full",
      description: "Avatar shape",
    },
    {
      name: "status",
      type: "color",
      properties: ["borderColor"],
      defaultValue: "none",
      description: "Status indicator color",
    },
  ],
  variants: [
    {
      name: "sm",
      styles: {
        width: "2rem",
        height: "2rem",
      },
      props: {},
    },
    {
      name: "md",
      styles: {
        width: "3rem",
        height: "3rem",
      },
      props: {},
    },
    {
      name: "lg",
      styles: {
        width: "4rem",
        height: "4rem",
      },
      props: {},
    },
    {
      name: "xl",
      styles: {
        width: "6rem",
        height: "6rem",
      },
      props: {},
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Progress Atom
export const progressAtom: AtomComponent = {
  id: "progress",
  type: "atom",
  element: "progress",
  name: "Progress",
  description: "Progress indicator with customizable styling",
  category: "ui",
  tags: ["progress", "loading", "indicator"],
  props: [
    {
      name: "value",
      type: "number",
      required: false,
      defaultValue: 0,
      description: "Progress value (0-100)",
    },
    {
      name: "max",
      type: "number",
      required: false,
      defaultValue: 100,
      description: "Maximum progress value",
    },
    {
      name: "variant",
      type: "string",
      required: false,
      defaultValue: "default",
      description: "Progress variant",
    },
    {
      name: "size",
      type: "string",
      required: false,
      defaultValue: "md",
      description: "Progress size",
    },
    {
      name: "animated",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether progress has animation",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "color",
      properties: ["backgroundColor", "color"],
      defaultValue: "default",
      description: "Progress color variant",
    },
    {
      name: "size",
      type: "spacing",
      properties: ["height"],
      defaultValue: "md",
      description: "Progress size",
    },
    {
      name: "animation",
      type: "animation",
      properties: ["transition"],
      defaultValue: "none",
      description: "Progress animation",
    },
  ],
  variants: [
    {
      name: "default",
      styles: {
        backgroundColor: "#E5E7EB",
        color: "#3B82F6",
      },
      props: {},
    },
    {
      name: "success",
      styles: {
        backgroundColor: "#E5E7EB",
        color: "#10B981",
      },
      props: {},
    },
    {
      name: "warning",
      styles: {
        backgroundColor: "#E5E7EB",
        color: "#F59E0B",
      },
      props: {},
    },
    {
      name: "error",
      styles: {
        backgroundColor: "#E5E7EB",
        color: "#EF4444",
      },
      props: {},
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Export all atoms
export const atoms: AtomComponent[] = [
  buttonAtom,
  inputAtom,
  textAtom,
  iconAtom,
  imageAtom,
  linkAtom,
  badgeAtom,
  avatarAtom,
  progressAtom,
];

// Atom registry
export const atomRegistry = new Map<string, AtomComponent>();
atoms.forEach((atom) => {
  atomRegistry.set(atom.id, atom);
});

// Utility functions
export function getAtom(id: string): AtomComponent | undefined {
  return atomRegistry.get(id);
}

export function getAtomsByCategory(category: string): AtomComponent[] {
  return atoms.filter((atom) => atom.category === category);
}

export function getAtomsByTag(tag: string): AtomComponent[] {
  return atoms.filter((atom) => atom.tags.includes(tag));
}

export function createAtomVariant(
  atom: AtomComponent,
  variantName: string,
  styles: Record<string, any>,
  props: Record<string, any> = {},
): AtomVariant {
  return {
    name: variantName,
    styles,
    props,
  };
}

export function validateAtomProps(
  atom: AtomComponent,
  props: Record<string, any>,
): boolean {
  for (const prop of atom.props) {
    if (prop.required && !(prop.name in props)) {
      return false;
    }
  }
  return true;
}
