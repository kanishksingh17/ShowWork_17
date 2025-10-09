import OpenAI from 'openai'
import { z } from 'zod'
import { 
  TemplateComponent, 
  TemplateSelectionCriteria, 
  UserProfile, 
  ContentProfile, 
  UserPreferences, 
  TemplateConstraints,
  GeneratedTemplate,
  TemplateScore,
  TemplateGenerationMetadata,
  ComponentRegistry,
  StyleTransferConfig,
  StyleReference,
  ContentReference,
  ExtractedStyles
} from './types'
import { atoms, atomRegistry } from './atoms'
import { molecules, moleculeRegistry } from './molecules'
import { organisms, organismRegistry } from './organisms'
import { templates, templateRegistry } from './templates'

// Schema for template generation request
export const TemplateGenerationSchema = z.object({
  userProfile: z.object({
    role: z.string(),
    industry: z.string(),
    experience: z.number(),
    skills: z.array(z.string()),
    portfolio: z.object({
      type: z.enum(['developer', 'designer', 'business', 'creative', 'academic']),
      style: z.enum(['modern', 'minimal', 'creative', 'professional', 'corporate']),
      complexity: z.enum(['simple', 'intermediate', 'advanced']),
      sections: z.array(z.string())
    })
  }),
  content: z.object({
    projects: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      images: z.array(z.string()),
      url: z.string().optional(),
      githubUrl: z.string().optional()
    })),
    skills: z.array(z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      level: z.number(),
      years: z.number()
    })),
    experience: z.array(z.object({
      id: z.string(),
      company: z.string(),
      position: z.string(),
      description: z.string(),
      startDate: z.date(),
      endDate: z.date().optional(),
      technologies: z.array(z.string())
    })),
    education: z.array(z.object({
      id: z.string(),
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      startDate: z.date(),
      endDate: z.date().optional()
    })),
    testimonials: z.array(z.object({
      id: z.string(),
      name: z.string(),
      position: z.string(),
      company: z.string(),
      content: z.string(),
      rating: z.number(),
      imageUrl: z.string().optional()
    })),
    blog: z.array(z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      excerpt: z.string(),
      publishedAt: z.date(),
      tags: z.array(z.string()),
      readTime: z.number()
    }))
  }),
  preferences: z.object({
    colorScheme: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      background: z.string(),
      text: z.string()
    }),
    layoutStyle: z.object({
      type: z.enum(['grid', 'flex', 'masonry', 'stack']),
      columns: z.number(),
      spacing: z.number(),
      alignment: z.enum(['left', 'center', 'right'])
    }),
    animationStyle: z.object({
      level: z.enum(['none', 'subtle', 'moderate', 'dynamic']),
      duration: z.enum(['fast', 'normal', 'slow']),
      easing: z.enum(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'])
    }),
    accessibility: z.object({
      reducedMotion: z.boolean(),
      highContrast: z.boolean(),
      largeText: z.boolean(),
      keyboardNavigation: z.boolean()
    })
  }),
  constraints: z.object({
    performance: z.object({
      maxBundleSize: z.number(),
      maxRenderTime: z.number(),
      targetLighthouseScore: z.number()
    }),
    compatibility: z.object({
      browsers: z.array(z.string()),
      devices: z.array(z.string()),
      screenSizes: z.array(z.string())
    }),
    budget: z.object({
      maxCost: z.number(),
      premiumFeatures: z.boolean(),
      thirdPartyServices: z.boolean()
    })
  })
})

export type TemplateGenerationRequest = z.infer<typeof TemplateGenerationSchema>

export class AITemplateGenerator {
  private openai: OpenAI
  private componentRegistry: ComponentRegistry
  private cache: Map<string, GeneratedTemplate> = new Map()
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Initialize component registry
    this.componentRegistry = {
      atoms: atomRegistry,
      molecules: moleculeRegistry,
      organisms: organismRegistry,
      templates: templateRegistry
    }
  }

  /**
   * Generate a custom template based on user criteria
   */
  async generateTemplate(criteria: TemplateSelectionCriteria): Promise<GeneratedTemplate> {
    try {
      console.log('🎨 Generating AI-powered template...')
      
      // Check cache
      const cacheKey = this.generateCacheKey(criteria)
      const cached = this.getCachedTemplate(cacheKey)
      if (cached) {
        console.log('🎯 Using cached template')
        return cached
      }

      // Analyze user profile and content
      const analysis = await this.analyzeUserProfile(criteria)
      
      // Select optimal components
      const selectedComponents = await this.selectComponents(analysis)
      
      // Generate template structure
      const templateStructure = await this.generateTemplateStructure(selectedComponents, analysis)
      
      // Apply style preferences
      const styledTemplate = await this.applyStylePreferences(templateStructure, criteria.preferences)
      
      // Optimize for performance and accessibility
      const optimizedTemplate = await this.optimizeTemplate(styledTemplate, criteria.constraints)
      
      // Generate template metadata
      const metadata = await this.generateTemplateMetadata(optimizedTemplate, criteria)
      
      // Calculate template score
      const score = await this.calculateTemplateScore(optimizedTemplate, criteria)
      
      // Create generated template
      const generatedTemplate: GeneratedTemplate = {
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: this.generateTemplateName(criteria.userProfile),
        description: this.generateTemplateDescription(criteria.userProfile),
        template: optimizedTemplate,
        score,
        metadata
      }

      // Cache the result
      this.setCachedTemplate(cacheKey, generatedTemplate)

      console.log('✅ Template generated successfully')
      return generatedTemplate

    } catch (error) {
      console.error('❌ Template generation failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Analyze user profile and content to determine optimal template characteristics
   */
  private async analyzeUserProfile(criteria: TemplateSelectionCriteria): Promise<any> {
    const prompt = `
Analyze this user profile and content to determine optimal template characteristics:

User Profile:
- Role: ${criteria.userProfile.role}
- Industry: ${criteria.userProfile.industry}
- Experience: ${criteria.userProfile.experience} years
- Skills: ${criteria.userProfile.skills.join(', ')}
- Portfolio Type: ${criteria.userProfile.portfolio.type}
- Style Preference: ${criteria.userProfile.portfolio.style}
- Complexity Level: ${criteria.userProfile.portfolio.complexity}

Content Analysis:
- Projects: ${criteria.content.projects.length} projects
- Skills: ${criteria.content.skills.length} skills
- Experience: ${criteria.content.experience.length} positions
- Education: ${criteria.content.education.length} degrees
- Testimonials: ${criteria.content.testimonials.length} testimonials
- Blog Posts: ${criteria.content.blog.length} posts

Based on this analysis, determine:
1. Optimal layout structure (header, hero, sections, footer)
2. Best component combinations for each section
3. Color scheme recommendations
4. Typography preferences
5. Animation level appropriate for the user
6. Accessibility requirements
7. Performance optimizations needed

Return a JSON object with your analysis.
`

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert web design analyst. Analyze user profiles and content to determine optimal template characteristics for portfolio websites.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })

      return JSON.parse(response.choices[0]?.message?.content || '{}')
    } catch (error) {
      console.error('Profile analysis failed:', error)
      return this.getDefaultAnalysis(criteria)
    }
  }

  /**
   * Select optimal components based on analysis
   */
  private async selectComponents(analysis: any): Promise<any> {
    const selectedComponents = {
      atoms: [],
      molecules: [],
      organisms: [],
      templates: []
    }

    // Select atoms based on user profile
    if (analysis.userType === 'developer') {
      selectedComponents.atoms.push(
        atoms.find(a => a.id === 'button'),
        atoms.find(a => a.id === 'input'),
        atoms.find(a => a.id === 'text'),
        atoms.find(a => a.id === 'icon'),
        atoms.find(a => a.id === 'badge')
      )
    } else if (analysis.userType === 'designer') {
      selectedComponents.atoms.push(
        atoms.find(a => a.id === 'button'),
        atoms.find(a => a.id === 'image'),
        atoms.find(a => a.id === 'text'),
        atoms.find(a => a.id === 'icon'),
        atoms.find(a => a.id === 'avatar')
      )
    } else {
      selectedComponents.atoms.push(
        atoms.find(a => a.id === 'button'),
        atoms.find(a => a.id === 'text'),
        atoms.find(a => a.id === 'image'),
        atoms.find(a => a.id === 'icon')
      )
    }

    // Select molecules based on content needs
    if (analysis.hasProjects) {
      selectedComponents.molecules.push(molecules.find(m => m.id === 'card'))
    }
    if (analysis.hasSkills) {
      selectedComponents.molecules.push(molecules.find(m => m.id === 'progress-bar'))
    }
    if (analysis.hasContact) {
      selectedComponents.molecules.push(molecules.find(m => m.id === 'form-field'))
    }
    if (analysis.hasNavigation) {
      selectedComponents.molecules.push(molecules.find(m => m.id === 'navigation-item'))
    }

    // Select organisms based on layout structure
    if (analysis.layoutStructure.includes('header')) {
      selectedComponents.organisms.push(organisms.find(o => o.id === 'header'))
    }
    if (analysis.layoutStructure.includes('hero')) {
      selectedComponents.organisms.push(organisms.find(o => o.id === 'hero'))
    }
    if (analysis.layoutStructure.includes('projects')) {
      selectedComponents.organisms.push(organisms.find(o => o.id === 'project-gallery'))
    }
    if (analysis.layoutStructure.includes('skills')) {
      selectedComponents.organisms.push(organisms.find(o => o.id === 'skills-section'))
    }
    if (analysis.layoutStructure.includes('about')) {
      selectedComponents.organisms.push(organisms.find(o => o.id === 'about-section'))
    }
    if (analysis.layoutStructure.includes('contact')) {
      selectedComponents.organisms.push(organisms.find(o => o.id === 'contact-form'))
    }
    if (analysis.layoutStructure.includes('footer')) {
      selectedComponents.organisms.push(organisms.find(o => o.id === 'footer'))
    }

    return selectedComponents
  }

  /**
   * Generate template structure using selected components
   */
  private async generateTemplateStructure(selectedComponents: any, analysis: any): Promise<TemplateComponent> {
    // Start with a base template
    const baseTemplate = templates.find(t => t.id === 'portfolio')
    if (!baseTemplate) {
      throw new Error('Base template not found')
    }

    // Customize template based on analysis
    const customTemplate: TemplateComponent = {
      ...baseTemplate,
      id: `custom_${Date.now()}`,
      name: `Custom ${analysis.userType} Portfolio`,
      description: `Customized portfolio template for ${analysis.userType}s`,
      organisms: selectedComponents.organisms.map((o: any) => o.id).filter(Boolean),
      layout: {
        ...baseTemplate.layout,
        structure: {
          header: analysis.layoutStructure.includes('header'),
          hero: analysis.layoutStructure.includes('hero'),
          sidebar: analysis.layoutStructure.includes('sidebar'),
          main: true,
          footer: analysis.layoutStructure.includes('footer'),
          sections: analysis.layoutStructure.filter((s: string) => s !== 'header' && s !== 'footer')
        }
      },
      theme: {
        ...baseTemplate.theme,
        name: `Custom ${analysis.userType} Theme`,
        colors: this.generateColorScheme(analysis.colorScheme),
        typography: this.generateTypography(analysis.typography),
        spacing: this.generateSpacing(analysis.spacing),
        shadows: this.generateShadows(analysis.shadows),
        animations: this.generateAnimations(analysis.animations)
      }
    }

    return customTemplate
  }

  /**
   * Apply style preferences to template
   */
  private async applyStylePreferences(template: TemplateComponent, preferences: UserPreferences): Promise<TemplateComponent> {
    // Update color scheme
    template.theme.colors.primary[500] = preferences.colorScheme.primary
    template.theme.colors.secondary[500] = preferences.colorScheme.secondary
    template.theme.colors.accent[500] = preferences.colorScheme.accent

    // Update layout style
    if (preferences.layoutStyle.type === 'grid') {
      template.layout.structure.sections = template.layout.structure.sections.map(() => 'grid')
    } else if (preferences.layoutStyle.type === 'masonry') {
      template.layout.structure.sections = template.layout.structure.sections.map(() => 'masonry')
    }

    // Update animation style
    if (preferences.animationStyle.level === 'none') {
      template.theme.animations.duration.fast = 0
      template.theme.animations.duration.normal = 0
      template.theme.animations.duration.slow = 0
    } else if (preferences.animationStyle.level === 'subtle') {
      template.theme.animations.duration.fast = 150
      template.theme.animations.duration.normal = 300
      template.theme.animations.duration.slow = 500
    }

    // Update accessibility preferences
    if (preferences.accessibility.highContrast) {
      // Increase color contrast
      template.theme.colors.primary[900] = '#000000'
      template.theme.colors.secondary[900] = '#000000'
    }

    if (preferences.accessibility.largeText) {
      // Increase font sizes
      template.theme.typography.fontSize.base = '1.125rem'
      template.theme.typography.fontSize.lg = '1.25rem'
    }

    return template
  }

  /**
   * Optimize template for performance and accessibility
   */
  private async optimizeTemplate(template: TemplateComponent, constraints: TemplateConstraints): Promise<TemplateComponent> {
    // Performance optimizations
    if (constraints.performance.maxBundleSize < 100) {
      // Reduce component complexity
      template.organisms = template.organisms.slice(0, 5)
    }

    if (constraints.performance.targetLighthouseScore > 90) {
      // Optimize for performance
      template.theme.animations.duration.fast = 100
      template.theme.animations.duration.normal = 200
      template.theme.animations.duration.slow = 300
    }

    // Accessibility optimizations
    template.accessibility.colorContrast = 'AAA'
    template.accessibility.keyboardNavigation = true
    template.accessibility.screenReaderSupport = true
    template.accessibility.focusManagement = true
    template.accessibility.semanticHTML = true

    // Compatibility optimizations
    if (constraints.compatibility.browsers.includes('ie11')) {
      // Remove modern features
      template.theme.animations.transitions = {}
    }

    return template
  }

  /**
   * Generate template metadata
   */
  private async generateTemplateMetadata(template: TemplateComponent, criteria: TemplateSelectionCriteria): Promise<TemplateGenerationMetadata> {
    return {
      generatedAt: new Date(),
      criteria,
      components: [template],
      aiModel: 'gpt-4-turbo-preview',
      generationTime: Date.now(),
      cacheHit: false
    }
  }

  /**
   * Calculate template score based on various factors
   */
  private async calculateTemplateScore(template: TemplateComponent, criteria: TemplateSelectionCriteria): Promise<TemplateScore> {
    let overallScore = 0
    let performanceScore = 0
    let accessibilityScore = 0
    let responsivenessScore = 0
    let aestheticsScore = 0
    let usabilityScore = 0

    // Performance score (0-100)
    performanceScore = Math.min(100, Math.max(0, 100 - (template.metadata.performance.bundleSize / 10)))
    overallScore += performanceScore * 0.25

    // Accessibility score (0-100)
    accessibilityScore = template.accessibility.colorContrast === 'AAA' ? 100 : 80
    if (template.accessibility.keyboardNavigation) accessibilityScore += 10
    if (template.accessibility.screenReaderSupport) accessibilityScore += 10
    if (template.accessibility.focusManagement) accessibilityScore += 10
    if (template.accessibility.semanticHTML) accessibilityScore += 10
    overallScore += Math.min(100, accessibilityScore) * 0.2

    // Responsiveness score (0-100)
    responsivenessScore = template.responsive.mobileFirst ? 100 : 80
    if (template.responsive.fluidLayout) responsivenessScore += 10
    if (template.responsive.adaptiveImages) responsivenessScore += 10
    overallScore += Math.min(100, responsivenessScore) * 0.2

    // Aesthetics score (0-100)
    aestheticsScore = 80 // Base score
    if (template.theme.colors.primary[500]) aestheticsScore += 10
    if (template.theme.typography.fontFamily.primary) aestheticsScore += 10
    overallScore += Math.min(100, aestheticsScore) * 0.15

    // Usability score (0-100)
    usabilityScore = 80 // Base score
    if (template.layout.structure.header) usabilityScore += 5
    if (template.layout.structure.footer) usabilityScore += 5
    if (template.navigation.items.length > 0) usabilityScore += 10
    overallScore += Math.min(100, usabilityScore) * 0.2

    return {
      overall: Math.round(overallScore),
      performance: Math.round(performanceScore),
      accessibility: Math.round(accessibilityScore),
      responsiveness: Math.round(responsivenessScore),
      aesthetics: Math.round(aestheticsScore),
      usability: Math.round(usabilityScore)
    }
  }

  /**
   * Generate template name based on user profile
   */
  private generateTemplateName(userProfile: UserProfile): string {
    const role = userProfile.role.toLowerCase()
    const industry = userProfile.industry.toLowerCase()
    const experience = userProfile.experience > 5 ? 'Senior' : userProfile.experience > 2 ? 'Mid' : 'Junior'
    
    return `${experience} ${role} Portfolio - ${industry}`
  }

  /**
   * Generate template description based on user profile
   */
  private generateTemplateDescription(userProfile: UserProfile): string {
    return `Customized portfolio template for ${userProfile.role}s in the ${userProfile.industry} industry with ${userProfile.experience} years of experience. Features ${userProfile.portfolio.style} design style with ${userProfile.portfolio.complexity} complexity level.`
  }

  /**
   * Generate color scheme based on analysis
   */
  private generateColorScheme(colorScheme: any): any {
    // Default color scheme
    const defaultColors = {
      primary: { 500: '#3B82F6' },
      secondary: { 500: '#64748B' },
      accent: { 500: '#F59E0B' },
      neutral: { 500: '#71717A' },
      success: { 500: '#22C55E' },
      warning: { 500: '#F59E0B' },
      error: { 500: '#EF4444' },
      info: { 500: '#0EA5E9' }
    }

    return colorScheme || defaultColors
  }

  /**
   * Generate typography based on analysis
   */
  private generateTypography(typography: any): any {
    // Default typography
    const defaultTypography = {
      fontFamily: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Georgia, serif',
        mono: 'JetBrains Mono, monospace'
      },
      fontSize: {
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem'
      }
    }

    return typography || defaultTypography
  }

  /**
   * Generate spacing based on analysis
   */
  private generateSpacing(spacing: any): any {
    // Default spacing
    const defaultSpacing = {
      xs: 0.25,
      sm: 0.5,
      md: 1,
      lg: 1.5,
      xl: 2
    }

    return spacing || defaultSpacing
  }

  /**
   * Generate shadows based on analysis
   */
  private generateShadows(shadows: any): any {
    // Default shadows
    const defaultShadows = {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
    }

    return shadows || defaultShadows
  }

  /**
   * Generate animations based on analysis
   */
  private generateAnimations(animations: any): any {
    // Default animations
    const defaultAnimations = {
      duration: {
        fast: 150,
        normal: 300,
        slow: 500
      },
      easing: {
        linear: 'linear',
        ease: 'ease',
        easeOut: 'ease-out'
      },
      transitions: {
        fade: {
          duration: 300,
          easing: 'ease-in-out',
          properties: ['opacity']
        }
      }
    }

    return animations || defaultAnimations
  }

  /**
   * Get default analysis when AI analysis fails
   */
  private getDefaultAnalysis(criteria: TemplateSelectionCriteria): any {
    return {
      userType: criteria.userProfile.portfolio.type,
      layoutStructure: ['header', 'hero', 'about', 'projects', 'skills', 'contact', 'footer'],
      hasProjects: criteria.content.projects.length > 0,
      hasSkills: criteria.content.skills.length > 0,
      hasContact: true,
      hasNavigation: true,
      colorScheme: criteria.preferences.colorScheme,
      typography: criteria.preferences.layoutStyle,
      spacing: criteria.preferences.layoutStyle,
      shadows: {},
      animations: criteria.preferences.animationStyle
    }
  }

  /**
   * Generate cache key for template
   */
  private generateCacheKey(criteria: TemplateSelectionCriteria): string {
    const keyData = {
      role: criteria.userProfile.role,
      industry: criteria.userProfile.industry,
      experience: criteria.userProfile.experience,
      portfolioType: criteria.userProfile.portfolio.type,
      style: criteria.userProfile.portfolio.style,
      complexity: criteria.userProfile.portfolio.complexity,
      projectsCount: criteria.content.projects.length,
      skillsCount: criteria.content.skills.length,
      colorScheme: criteria.preferences.colorScheme,
      layoutStyle: criteria.preferences.layoutStyle.type,
      animationLevel: criteria.preferences.animationStyle.level
    }
    return Buffer.from(JSON.stringify(keyData)).toString('base64')
  }

  /**
   * Get cached template
   */
  private getCachedTemplate(key: string): GeneratedTemplate | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.metadata.generatedAt.getTime() > this.CACHE_DURATION
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return cached
  }

  /**
   * Set cached template
   */
  private setCachedTemplate(key: string, template: GeneratedTemplate): void {
    this.cache.set(key, template)
  }

  /**
   * Handle errors
   */
  private handleError(error: any): Error {
    if (error instanceof z.ZodError) {
      return new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
    }
    
    if (error instanceof OpenAI.APIError) {
      return new Error(`OpenAI API error: ${error.message}`)
    }
    
    return error instanceof Error ? error : new Error('Unknown error occurred')
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
    console.log('🗑️ Template cache cleared')
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number; entries: Array<{ key: string; generatedAt: Date }> } {
    const entries = Array.from(this.cache.entries()).map(([key, template]) => ({
      key,
      generatedAt: template.metadata.generatedAt
    }))
    
    return {
      size: this.cache.size,
      entries
    }
  }
}

// Export singleton instance
export const aiTemplateGenerator = new AITemplateGenerator()
