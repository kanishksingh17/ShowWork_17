import {
  MoleculeComponent,
  ComponentProp,
  ComponentStyle,
  AccessibilityConfig,
  ResponsiveConfig,
  ComponentMetadata,
  PerformanceMetrics,
  SEOConfig,
  MoleculeLayout,
  Interaction,
  AnimationConfig,
} from "./types";
import { atoms, atomRegistry } from "./atoms";

// Base molecule configuration
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
  bundleSize: 2,
  renderTime: 2,
  memoryUsage: 2,
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

// Button Group Molecule
export const buttonGroupMolecule: MoleculeComponent = {
  id: "button-group",
  type: "molecule",
  name: "Button Group",
  description: "Group of related buttons with consistent spacing and alignment",
  category: "interactive",
  tags: ["buttons", "group", "interactive"],
  atoms: ["button"],
  layout: {
    type: "flex",
    direction: "row",
    gap: 0.5,
    alignment: "center",
    wrap: false,
  },
  interactions: [
    {
      trigger: "click",
      action: "navigate",
      target: "button",
    },
  ],
  props: [
    {
      name: "buttons",
      type: "array",
      required: true,
      description: "Array of button configurations",
    },
    {
      name: "variant",
      type: "string",
      required: false,
      defaultValue: "default",
      description: "Button group variant",
    },
    {
      name: "orientation",
      type: "string",
      required: false,
      defaultValue: "horizontal",
      description: "Button group orientation",
    },
    {
      name: "attached",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether buttons are attached",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "layout",
      properties: ["borderRadius", "border"],
      defaultValue: "default",
      description: "Button group variant",
    },
    {
      name: "spacing",
      type: "spacing",
      properties: ["gap"],
      defaultValue: 0.5,
      description: "Button spacing",
    },
    {
      name: "orientation",
      type: "layout",
      properties: ["flexDirection"],
      defaultValue: "row",
      description: "Button group orientation",
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Search Input Molecule
export const searchInputMolecule: MoleculeComponent = {
  id: "search-input",
  type: "molecule",
  name: "Search Input",
  description: "Search input with icon and clear button",
  category: "form",
  tags: ["search", "input", "form"],
  atoms: ["input", "icon", "button"],
  layout: {
    type: "flex",
    direction: "row",
    gap: 0.5,
    alignment: "center",
    wrap: false,
  },
  interactions: [
    {
      trigger: "click",
      action: "submit",
      target: "button",
    },
    {
      trigger: "focus",
      action: "animate",
      target: "input",
      animation: {
        type: "scale",
        duration: 200,
        easing: "ease-out",
      },
    },
  ],
  props: [
    {
      name: "value",
      type: "string",
      required: false,
      description: "Search input value",
    },
    {
      name: "placeholder",
      type: "string",
      required: false,
      defaultValue: "Search...",
      description: "Search input placeholder",
    },
    {
      name: "onSearch",
      type: "function",
      required: false,
      description: "Search handler function",
    },
    {
      name: "onClear",
      type: "function",
      required: false,
      description: "Clear handler function",
    },
    {
      name: "loading",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether search is loading",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "layout",
      properties: ["borderRadius", "border"],
      defaultValue: "default",
      description: "Search input variant",
    },
    {
      name: "size",
      type: "spacing",
      properties: ["padding", "fontSize"],
      defaultValue: "md",
      description: "Search input size",
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Card Molecule
export const cardMolecule: MoleculeComponent = {
  id: "card",
  type: "molecule",
  name: "Card",
  description: "Content card with header, body, and footer sections",
  category: "layout",
  tags: ["card", "content", "layout"],
  atoms: ["text", "image", "button"],
  layout: {
    type: "stack",
    direction: "vertical",
    gap: 1,
    alignment: "stretch",
    wrap: false,
  },
  interactions: [
    {
      trigger: "hover",
      action: "animate",
      target: "card",
      animation: {
        type: "scale",
        duration: 200,
        easing: "ease-out",
      },
    },
  ],
  props: [
    {
      name: "title",
      type: "string",
      required: false,
      description: "Card title",
    },
    {
      name: "content",
      type: "string",
      required: false,
      description: "Card content",
    },
    {
      name: "image",
      type: "string",
      required: false,
      description: "Card image URL",
    },
    {
      name: "actions",
      type: "array",
      required: false,
      description: "Card action buttons",
    },
    {
      name: "variant",
      type: "string",
      required: false,
      defaultValue: "default",
      description: "Card variant",
    },
    {
      name: "elevated",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether card is elevated",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "color",
      properties: ["backgroundColor", "borderColor"],
      defaultValue: "default",
      description: "Card color variant",
    },
    {
      name: "elevation",
      type: "effect",
      properties: ["boxShadow"],
      defaultValue: "none",
      description: "Card elevation level",
    },
    {
      name: "radius",
      type: "layout",
      properties: ["borderRadius"],
      defaultValue: "md",
      description: "Card border radius",
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Navigation Item Molecule
export const navigationItemMolecule: MoleculeComponent = {
  id: "navigation-item",
  type: "molecule",
  name: "Navigation Item",
  description: "Navigation item with icon, text, and active state",
  category: "navigation",
  tags: ["navigation", "menu", "link"],
  atoms: ["link", "icon", "text"],
  layout: {
    type: "flex",
    direction: "row",
    gap: 0.5,
    alignment: "center",
    wrap: false,
  },
  interactions: [
    {
      trigger: "click",
      action: "navigate",
      target: "link",
    },
    {
      trigger: "hover",
      action: "animate",
      target: "item",
      animation: {
        type: "fade",
        duration: 150,
        easing: "ease-in-out",
      },
    },
  ],
  props: [
    {
      name: "href",
      type: "string",
      required: true,
      description: "Navigation item URL",
    },
    {
      name: "label",
      type: "string",
      required: true,
      description: "Navigation item label",
    },
    {
      name: "icon",
      type: "string",
      required: false,
      description: "Navigation item icon",
    },
    {
      name: "active",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether item is active",
    },
    {
      name: "badge",
      type: "string",
      required: false,
      description: "Navigation item badge",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "color",
      properties: ["color", "backgroundColor"],
      defaultValue: "default",
      description: "Navigation item variant",
    },
    {
      name: "state",
      type: "color",
      properties: ["color", "backgroundColor"],
      defaultValue: "default",
      description: "Navigation item state",
    },
    {
      name: "spacing",
      type: "spacing",
      properties: ["padding"],
      defaultValue: "md",
      description: "Navigation item padding",
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Form Field Molecule
export const formFieldMolecule: MoleculeComponent = {
  id: "form-field",
  type: "molecule",
  name: "Form Field",
  description: "Form field with label, input, and validation message",
  category: "form",
  tags: ["form", "field", "validation"],
  atoms: ["input", "text", "icon"],
  layout: {
    type: "stack",
    direction: "vertical",
    gap: 0.25,
    alignment: "stretch",
    wrap: false,
  },
  interactions: [
    {
      trigger: "focus",
      action: "animate",
      target: "input",
      animation: {
        type: "scale",
        duration: 200,
        easing: "ease-out",
      },
    },
  ],
  props: [
    {
      name: "label",
      type: "string",
      required: true,
      description: "Field label",
    },
    {
      name: "name",
      type: "string",
      required: true,
      description: "Field name",
    },
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
      description: "Input placeholder",
    },
    {
      name: "required",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether field is required",
    },
    {
      name: "error",
      type: "string",
      required: false,
      description: "Field error message",
    },
    {
      name: "help",
      type: "string",
      required: false,
      description: "Field help text",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "color",
      properties: ["color"],
      defaultValue: "default",
      description: "Field variant",
    },
    {
      name: "state",
      type: "color",
      properties: ["color", "borderColor"],
      defaultValue: "default",
      description: "Field state",
    },
    {
      name: "spacing",
      type: "spacing",
      properties: ["marginBottom"],
      defaultValue: "md",
      description: "Field spacing",
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Avatar Group Molecule
export const avatarGroupMolecule: MoleculeComponent = {
  id: "avatar-group",
  type: "molecule",
  name: "Avatar Group",
  description: "Group of avatars with overlap and count indicator",
  category: "ui",
  tags: ["avatar", "group", "user"],
  atoms: ["avatar", "text"],
  layout: {
    type: "flex",
    direction: "row",
    gap: -0.5,
    alignment: "center",
    wrap: false,
  },
  interactions: [
    {
      trigger: "hover",
      action: "animate",
      target: "avatar",
      animation: {
        type: "scale",
        duration: 200,
        easing: "ease-out",
      },
    },
  ],
  props: [
    {
      name: "avatars",
      type: "array",
      required: true,
      description: "Array of avatar configurations",
    },
    {
      name: "maxVisible",
      type: "number",
      required: false,
      defaultValue: 3,
      description: "Maximum visible avatars",
    },
    {
      name: "size",
      type: "string",
      required: false,
      defaultValue: "md",
      description: "Avatar size",
    },
    {
      name: "showCount",
      type: "boolean",
      required: false,
      defaultValue: true,
      description: "Whether to show count indicator",
    },
  ],
  styles: [
    {
      name: "overlap",
      type: "spacing",
      properties: ["marginLeft"],
      defaultValue: -0.5,
      description: "Avatar overlap amount",
    },
    {
      name: "size",
      type: "spacing",
      properties: ["width", "height"],
      defaultValue: "md",
      description: "Avatar size",
    },
    {
      name: "border",
      type: "layout",
      properties: ["border", "borderRadius"],
      defaultValue: "2px solid white",
      description: "Avatar border",
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Progress Bar Molecule
export const progressBarMolecule: MoleculeComponent = {
  id: "progress-bar",
  type: "molecule",
  name: "Progress Bar",
  description: "Progress bar with label and percentage display",
  category: "ui",
  tags: ["progress", "loading", "indicator"],
  atoms: ["progress", "text"],
  layout: {
    type: "stack",
    direction: "vertical",
    gap: 0.25,
    alignment: "stretch",
    wrap: false,
  },
  interactions: [
    {
      trigger: "scroll",
      action: "animate",
      target: "progress",
      animation: {
        type: "scale",
        duration: 500,
        easing: "ease-out",
      },
    },
  ],
  props: [
    {
      name: "value",
      type: "number",
      required: true,
      description: "Progress value (0-100)",
    },
    {
      name: "label",
      type: "string",
      required: false,
      description: "Progress label",
    },
    {
      name: "showPercentage",
      type: "boolean",
      required: false,
      defaultValue: true,
      description: "Whether to show percentage",
    },
    {
      name: "variant",
      type: "string",
      required: false,
      defaultValue: "default",
      description: "Progress bar variant",
    },
    {
      name: "animated",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether progress is animated",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "color",
      properties: ["backgroundColor", "color"],
      defaultValue: "default",
      description: "Progress bar variant",
    },
    {
      name: "size",
      type: "spacing",
      properties: ["height"],
      defaultValue: "md",
      description: "Progress bar height",
    },
    {
      name: "animation",
      type: "animation",
      properties: ["transition"],
      defaultValue: "none",
      description: "Progress animation",
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Toggle Switch Molecule
export const toggleSwitchMolecule: MoleculeComponent = {
  id: "toggle-switch",
  type: "molecule",
  name: "Toggle Switch",
  description: "Toggle switch with label and state management",
  category: "interactive",
  tags: ["toggle", "switch", "interactive"],
  atoms: ["button", "text"],
  layout: {
    type: "flex",
    direction: "row",
    gap: 0.5,
    alignment: "center",
    wrap: false,
  },
  interactions: [
    {
      trigger: "click",
      action: "toggle",
      target: "switch",
    },
    {
      trigger: "focus",
      action: "animate",
      target: "switch",
      animation: {
        type: "scale",
        duration: 150,
        easing: "ease-out",
      },
    },
  ],
  props: [
    {
      name: "checked",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether switch is checked",
    },
    {
      name: "label",
      type: "string",
      required: false,
      description: "Switch label",
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      defaultValue: false,
      description: "Whether switch is disabled",
    },
    {
      name: "onChange",
      type: "function",
      required: false,
      description: "Change handler function",
    },
    {
      name: "size",
      type: "string",
      required: false,
      defaultValue: "md",
      description: "Switch size",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "color",
      properties: ["backgroundColor", "color"],
      defaultValue: "default",
      description: "Switch variant",
    },
    {
      name: "size",
      type: "spacing",
      properties: ["width", "height"],
      defaultValue: "md",
      description: "Switch size",
    },
    {
      name: "animation",
      type: "animation",
      properties: ["transition"],
      defaultValue: "all 0.2s ease-in-out",
      description: "Switch animation",
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Modal Trigger Molecule
export const modalTriggerMolecule: MoleculeComponent = {
  id: "modal-trigger",
  type: "molecule",
  name: "Modal Trigger",
  description: "Button or link that opens a modal dialog",
  category: "interactive",
  tags: ["modal", "trigger", "dialog"],
  atoms: ["button", "icon"],
  layout: {
    type: "flex",
    direction: "row",
    gap: 0.5,
    alignment: "center",
    wrap: false,
  },
  interactions: [
    {
      trigger: "click",
      action: "navigate",
      target: "modal",
    },
  ],
  props: [
    {
      name: "children",
      type: "string",
      required: true,
      description: "Trigger content",
    },
    {
      name: "modalId",
      type: "string",
      required: true,
      description: "Modal ID to open",
    },
    {
      name: "variant",
      type: "string",
      required: false,
      defaultValue: "primary",
      description: "Trigger variant",
    },
    {
      name: "size",
      type: "string",
      required: false,
      defaultValue: "md",
      description: "Trigger size",
    },
    {
      name: "icon",
      type: "string",
      required: false,
      description: "Trigger icon",
    },
  ],
  styles: [
    {
      name: "variant",
      type: "color",
      properties: ["backgroundColor", "color"],
      defaultValue: "primary",
      description: "Trigger variant",
    },
    {
      name: "size",
      type: "spacing",
      properties: ["padding", "fontSize"],
      defaultValue: "md",
      description: "Trigger size",
    },
  ],
  accessibility: baseAccessibility,
  responsive: baseResponsive,
  metadata: baseMetadata,
};

// Export all molecules
export const molecules: MoleculeComponent[] = [
  buttonGroupMolecule,
  searchInputMolecule,
  cardMolecule,
  navigationItemMolecule,
  formFieldMolecule,
  avatarGroupMolecule,
  progressBarMolecule,
  toggleSwitchMolecule,
  modalTriggerMolecule,
];

// Molecule registry
export const moleculeRegistry = new Map<string, MoleculeComponent>();
molecules.forEach((molecule) => {
  moleculeRegistry.set(molecule.id, molecule);
});

// Utility functions
export function getMolecule(id: string): MoleculeComponent | undefined {
  return moleculeRegistry.get(id);
}

export function getMoleculesByCategory(category: string): MoleculeComponent[] {
  return molecules.filter((molecule) => molecule.category === category);
}

export function getMoleculesByTag(tag: string): MoleculeComponent[] {
  return molecules.filter((molecule) => molecule.tags.includes(tag));
}

export function getMoleculesByAtom(atomId: string): MoleculeComponent[] {
  return molecules.filter((molecule) => molecule.atoms.includes(atomId));
}

export function validateMoleculeProps(
  molecule: MoleculeComponent,
  props: Record<string, any>,
): boolean {
  for (const prop of molecule.props) {
    if (prop.required && !(prop.name in props)) {
      return false;
    }
  }
  return true;
}

export function createMoleculeLayout(
  type: "flex" | "grid" | "stack" | "inline",
  direction?: "row" | "column",
  gap?: number,
  alignment?: "start" | "center" | "end" | "stretch",
  wrap?: boolean,
): MoleculeLayout {
  return {
    type,
    direction,
    gap,
    alignment,
    wrap,
  };
}

export function createMoleculeInteraction(
  trigger: "click" | "hover" | "focus" | "scroll",
  action: "navigate" | "toggle" | "animate" | "submit",
  target?: string,
  animation?: AnimationConfig,
): Interaction {
  return {
    trigger,
    action,
    target,
    animation,
  };
}
