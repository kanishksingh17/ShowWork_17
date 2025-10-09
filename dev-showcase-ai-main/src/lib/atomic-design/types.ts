import { z } from 'zod'

// Base component interface
export interface BaseComponent {
  id: string
  type: 'atom' | 'molecule' | 'organism' | 'template'
  name: string
  description: string
  category: string
  tags: string[]
  props: ComponentProp[]
  styles: ComponentStyle[]
  accessibility: AccessibilityConfig
  responsive: ResponsiveConfig
  metadata: ComponentMetadata
}

// Component properties
export interface ComponentProp {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'function'
  required: boolean
  defaultValue?: any
  description: string
  validation?: z.ZodSchema
}

// Component styles
export interface ComponentStyle {
  name: string
  type: 'color' | 'spacing' | 'typography' | 'layout' | 'animation' | 'effect'
  properties: string[]
  defaultValue: any
  description: string
}

// Accessibility configuration
export interface AccessibilityConfig {
  ariaLabels?: string[]
  keyboardNavigation: boolean
  screenReaderSupport: boolean
  colorContrast: 'AA' | 'AAA'
  focusManagement: boolean
  semanticHTML: boolean
}

// Responsive configuration
export interface ResponsiveConfig {
  breakpoints: {
    mobile: number
    tablet: number
    desktop: number
    wide: number
  }
  mobileFirst: boolean
  fluidLayout: boolean
  adaptiveImages: boolean
}

// Component metadata
export interface ComponentMetadata {
  version: string
  author: string
  createdAt: Date
  updatedAt: Date
  dependencies: string[]
  compatibility: string[]
  performance: PerformanceMetrics
  seo: SEOConfig
}

// Performance metrics
export interface PerformanceMetrics {
  bundleSize: number
  renderTime: number
  memoryUsage: number
  lighthouseScore: number
}

// SEO configuration
export interface SEOConfig {
  semanticHTML: boolean
  metaTags: boolean
  structuredData: boolean
  socialSharing: boolean
}

// Atom component
export interface AtomComponent extends BaseComponent {
  type: 'atom'
  element: 'button' | 'input' | 'text' | 'icon' | 'image' | 'link'
  variants: AtomVariant[]
}

// Atom variants
export interface AtomVariant {
  name: string
  styles: Record<string, any>
  props: Record<string, any>
}

// Molecule component
export interface MoleculeComponent extends BaseComponent {
  type: 'molecule'
  atoms: string[] // References to atom IDs
  layout: MoleculeLayout
  interactions: Interaction[]
}

// Molecule layout
export interface MoleculeLayout {
  type: 'flex' | 'grid' | 'stack' | 'inline'
  direction?: 'row' | 'column'
  gap?: number
  alignment?: 'start' | 'center' | 'end' | 'stretch'
  wrap?: boolean
}

// Interactions
export interface Interaction {
  trigger: 'click' | 'hover' | 'focus' | 'scroll'
  action: 'navigate' | 'toggle' | 'animate' | 'submit'
  target?: string
  animation?: AnimationConfig
}

// Animation configuration
export interface AnimationConfig {
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'custom'
  duration: number
  easing: string
  delay?: number
  iteration?: number | 'infinite'
}

// Organism component
export interface OrganismComponent extends BaseComponent {
  type: 'organism'
  molecules: string[] // References to molecule IDs
  sections: OrganismSection[]
  layout: OrganismLayout
}

// Organism sections
export interface OrganismSection {
  id: string
  name: string
  molecules: string[]
  layout: SectionLayout
  responsive: ResponsiveSection
}

// Organism layout
export interface OrganismLayout {
  type: 'header' | 'hero' | 'content' | 'sidebar' | 'footer' | 'grid' | 'masonry'
  columns?: number
  spacing?: number
  alignment?: 'left' | 'center' | 'right' | 'justify'
}

// Section layout
export interface SectionLayout {
  type: 'stack' | 'grid' | 'flex' | 'masonry'
  direction?: 'horizontal' | 'vertical'
  gap?: number
  columns?: number
}

// Responsive section
export interface ResponsiveSection {
  mobile: SectionLayout
  tablet: SectionLayout
  desktop: SectionLayout
}

// Template component
export interface TemplateComponent extends BaseComponent {
  type: 'template'
  organisms: string[] // References to organism IDs
  layout: TemplateLayout
  pages: TemplatePage[]
  navigation: NavigationConfig
  theme: ThemeConfig
}

// Template layout
export interface TemplateLayout {
  type: 'single-page' | 'multi-page' | 'blog' | 'portfolio' | 'landing' | 'dashboard'
  structure: LayoutStructure
  responsive: ResponsiveTemplate
}

// Layout structure
export interface LayoutStructure {
  header: boolean
  hero: boolean
  sidebar: boolean
  main: boolean
  footer: boolean
  sections: string[]
}

// Responsive template
export interface ResponsiveTemplate {
  mobile: TemplateLayout
  tablet: TemplateLayout
  desktop: TemplateLayout
}

// Template pages
export interface TemplatePage {
  id: string
  name: string
  path: string
  organisms: string[]
  layout: PageLayout
  seo: PageSEO
}

// Page layout
export interface PageLayout {
  type: 'full-width' | 'container' | 'sidebar' | 'grid'
  maxWidth?: number
  padding?: number
  margin?: number
}

// Page SEO
export interface PageSEO {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonical?: string
}

// Navigation configuration
export interface NavigationConfig {
  type: 'header' | 'sidebar' | 'footer' | 'breadcrumb'
  items: NavigationItem[]
  responsive: ResponsiveNavigation
}

// Navigation items
export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: string
  children?: NavigationItem[]
}

// Responsive navigation
export interface ResponsiveNavigation {
  mobile: 'hamburger' | 'tabs' | 'accordion'
  tablet: 'horizontal' | 'vertical' | 'dropdown'
  desktop: 'horizontal' | 'vertical' | 'mega'
}

// Theme configuration
export interface ThemeConfig {
  name: string
  colors: ColorPalette
  typography: TypographyConfig
  spacing: SpacingConfig
  shadows: ShadowConfig
  animations: AnimationTheme
}

// Color palette
export interface ColorPalette {
  primary: ColorScale
  secondary: ColorScale
  accent: ColorScale
  neutral: ColorScale
  success: ColorScale
  warning: ColorScale
  error: ColorScale
  info: ColorScale
}

// Color scale
export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

// Typography configuration
export interface TypographyConfig {
  fontFamily: FontFamily
  fontSize: FontSize
  fontWeight: FontWeight
  lineHeight: LineHeight
  letterSpacing: LetterSpacing
}

// Font family
export interface FontFamily {
  primary: string
  secondary: string
  mono: string
}

// Font size
export interface FontSize {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
}

// Font weight
export interface FontWeight {
  light: number
  normal: number
  medium: number
  semibold: number
  bold: number
  extrabold: number
}

// Line height
export interface LineHeight {
  none: number
  tight: number
  snug: number
  normal: number
  relaxed: number
  loose: number
}

// Letter spacing
export interface LetterSpacing {
  tighter: string
  tight: string
  normal: string
  wide: string
  wider: string
  widest: string
}

// Spacing configuration
export interface SpacingConfig {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
  '3xl': number
}

// Shadow configuration
export interface ShadowConfig {
  sm: string
  base: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
  none: string
}

// Animation theme
export interface AnimationTheme {
  duration: AnimationDuration
  easing: AnimationEasing
  transitions: TransitionConfig
}

// Animation duration
export interface AnimationDuration {
  fast: number
  normal: number
  slow: number
}

// Animation easing
export interface AnimationEasing {
  linear: string
  ease: string
  easeIn: string
  easeOut: string
  easeInOut: string
}

// Transition configuration
export interface TransitionConfig {
  fade: Transition
  slide: Transition
  scale: Transition
  rotate: Transition
}

// Transition
export interface Transition {
  duration: number
  easing: string
  properties: string[]
}

// Component registry
export interface ComponentRegistry {
  atoms: Map<string, AtomComponent>
  molecules: Map<string, MoleculeComponent>
  organisms: Map<string, OrganismComponent>
  templates: Map<string, TemplateComponent>
}

// Template selection criteria
export interface TemplateSelectionCriteria {
  userProfile: UserProfile
  content: ContentProfile
  preferences: UserPreferences
  constraints: TemplateConstraints
}

// User profile
export interface UserProfile {
  role: string
  industry: string
  experience: number
  skills: string[]
  portfolio: PortfolioProfile
}

// Portfolio profile
export interface PortfolioProfile {
  type: 'developer' | 'designer' | 'business' | 'creative' | 'academic'
  style: 'modern' | 'minimal' | 'creative' | 'professional' | 'corporate'
  complexity: 'simple' | 'intermediate' | 'advanced'
  sections: string[]
}

// Content profile
export interface ContentProfile {
  projects: Project[]
  skills: Skill[]
  experience: Experience[]
  education: Education[]
  testimonials: Testimonial[]
  blog: BlogPost[]
}

// Project
export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  images: string[]
  url?: string
  githubUrl?: string
}

// Skill
export interface Skill {
  id: string
  name: string
  category: string
  level: number
  years: number
}

// Experience
export interface Experience {
  id: string
  company: string
  position: string
  description: string
  startDate: Date
  endDate?: Date
  technologies: string[]
}

// Education
export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: Date
  endDate?: Date
}

// Testimonial
export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  content: string
  rating: number
  imageUrl?: string
}

// Blog post
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  publishedAt: Date
  tags: string[]
}

// User preferences
export interface UserPreferences {
  colorScheme: ColorScheme
  layoutStyle: LayoutStyle
  animationStyle: AnimationStyle
  accessibility: AccessibilityPreferences
}

// Color scheme
export interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

// Layout style
export interface LayoutStyle {
  type: 'grid' | 'flex' | 'masonry' | 'stack'
  columns: number
  spacing: number
  alignment: 'left' | 'center' | 'right'
}

// Animation style
export interface AnimationStyle {
  level: 'none' | 'subtle' | 'moderate' | 'dynamic'
  duration: 'fast' | 'normal' | 'slow'
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
}

// Accessibility preferences
export interface AccessibilityPreferences {
  reducedMotion: boolean
  highContrast: boolean
  largeText: boolean
  keyboardNavigation: boolean
}

// Template constraints
export interface TemplateConstraints {
  performance: PerformanceConstraints
  compatibility: CompatibilityConstraints
  budget: BudgetConstraints
}

// Performance constraints
export interface PerformanceConstraints {
  maxBundleSize: number
  maxRenderTime: number
  targetLighthouseScore: number
}

// Compatibility constraints
export interface CompatibilityConstraints {
  browsers: string[]
  devices: string[]
  screenSizes: string[]
}

// Budget constraints
export interface BudgetConstraints {
  maxCost: number
  premiumFeatures: boolean
  thirdPartyServices: boolean
}

// Generated template
export interface GeneratedTemplate {
  id: string
  name: string
  description: string
  template: TemplateComponent
  score: TemplateScore
  metadata: TemplateGenerationMetadata
}

// Template score
export interface TemplateScore {
  overall: number
  performance: number
  accessibility: number
  responsiveness: number
  aesthetics: number
  usability: number
}

// Template generation metadata
export interface TemplateGenerationMetadata {
  generatedAt: Date
  criteria: TemplateSelectionCriteria
  components: TemplateComponent[]
  aiModel: string
  generationTime: number
  cacheHit: boolean
}

// Style transfer configuration
export interface StyleTransferConfig {
  sourceStyle: StyleReference
  targetContent: ContentReference
  transferLevel: 'subtle' | 'moderate' | 'strong'
  preserveBranding: boolean
}

// Style reference
export interface StyleReference {
  type: 'image' | 'template' | 'palette'
  source: string
  extractedStyles: ExtractedStyles
}

// Content reference
export interface ContentReference {
  type: 'portfolio' | 'section' | 'component'
  source: string
  content: any
}

// Extracted styles
export interface ExtractedStyles {
  colors: ColorPalette
  typography: TypographyConfig
  spacing: SpacingConfig
  shadows: ShadowConfig
  animations: AnimationTheme
}

// Template metadata
export interface TemplateMetadata {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  version: string
  author: string
  createdAt: Date
  updatedAt: Date
  downloads: number
  rating: number
  reviews: number
  compatibility: string[]
  performance: PerformanceMetrics
  accessibility: AccessibilityScore
  responsive: ResponsiveScore
  seo: SEOScore
}

// Accessibility score
export interface AccessibilityScore {
  overall: number
  colorContrast: number
  keyboardNavigation: number
  screenReader: number
  semanticHTML: number
}

// Responsive score
export interface ResponsiveScore {
  overall: number
  mobile: number
  tablet: number
  desktop: number
  wide: number
}

// SEO score
export interface SEOScore {
  overall: number
  metaTags: number
  structuredData: number
  performance: number
  accessibility: number
}
