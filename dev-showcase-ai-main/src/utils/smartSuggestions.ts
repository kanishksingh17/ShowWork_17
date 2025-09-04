// Smart Suggestions and Personalization Engine
// Provides AI-powered recommendations, auto-complete, and personalized content

import { ProfileSetupState, TechCategory, ExperienceLevel, CareerGoal, LearningGoal } from '../types/profileSetup';

export interface SmartSuggestion {
  id: string;
  type: 'company' | 'role' | 'skill' | 'goal' | 'platform' | 'learning_path';
  value: string;
  confidence: number;
  reasoning: string;
  category?: string;
  metadata?: {
    description?: string;
    icon?: string;
    popularity?: number;
    trend?: 'rising' | 'stable' | 'declining';
  };
}

export interface PersonalizationContext {
  userProfile: Partial<ProfileSetupState['userProfile']>;
  currentStep: number;
  selectedCategories: TechCategory[];
  sessionBehavior: {
    timeSpent: number;
    interactionPattern: 'thorough' | 'quick' | 'exploratory';
    preferences: string[];
  };
}

export class SmartSuggestionsEngine {
  private companyDatabase: string[] = [];
  private roleDatabase: Record<TechCategory, string[]> = {} as Record<TechCategory, string[]>;
  private skillDatabase: Record<TechCategory, string[]> = {} as Record<TechCategory, string[]>;
  private learningPaths: Record<string, string[]> = {};

  constructor() {
    this.initializeDatabase();
  }

  /**
   * Get auto-complete suggestions for company names
   */
  getCompanySuggestions(input: string, limit: number = 5): SmartSuggestion[] {
    if (!input || input.length < 2) return [];

    const matches = this.companyDatabase
      .filter(company => 
        company.toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, limit)
      .map((company, index) => ({
        id: `company_${index}`,
        type: 'company' as const,
        value: company,
        confidence: this.calculateStringMatchConfidence(input, company),
        reasoning: `Popular tech company matching "${input}"`,
        metadata: {
          icon: '🏢',
          popularity: this.getCompanyPopularity(company)
        }
      }));

    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get role suggestions based on tech categories and experience
   */
  getRoleSuggestions(
    context: PersonalizationContext, 
    input: string = '', 
    limit: number = 6
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    
    context.selectedCategories.forEach(category => {
      const roles = this.roleDatabase[category] || [];
      const filteredRoles = input 
        ? roles.filter(role => role.toLowerCase().includes(input.toLowerCase()))
        : roles;

      filteredRoles.slice(0, limit).forEach((role, index) => {
        const experienceLevel = context.userProfile.basicInfo?.experienceLevel || ExperienceLevel.INTERMEDIATE;
        const adjustedRole = this.adjustRoleForExperience(role, experienceLevel);
        
        suggestions.push({
          id: `role_${category}_${index}`,
          type: 'role',
          value: adjustedRole,
          confidence: this.calculateRoleConfidence(role, category, experienceLevel),
          reasoning: `${category} role matching your ${experienceLevel} experience`,
          category: category,
          metadata: {
            description: this.getRoleDescription(adjustedRole, category),
            icon: this.getCategoryIcon(category),
            trend: this.getRoleTrend(role)
          }
        });
      });
    });

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  /**
   * Get skill suggestions based on current selections
   */
  getSkillSuggestions(
    context: PersonalizationContext,
    currentCategory?: TechCategory,
    limit: number = 8
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    const targetCategories = currentCategory ? [currentCategory] : context.selectedCategories;

    targetCategories.forEach(category => {
      const skills = this.skillDatabase[category] || [];
      const alreadySelected = context.userProfile.techStack?.technologies?.map(t => t.name) || [];
      
      skills
        .filter(skill => !alreadySelected.includes(skill))
        .slice(0, limit)
        .forEach((skill, index) => {
          suggestions.push({
            id: `skill_${category}_${index}`,
            type: 'skill',
            value: skill,
            confidence: this.calculateSkillRelevance(skill, context),
            reasoning: this.generateSkillReasoning(skill, category, context),
            category: category,
            metadata: {
              description: this.getSkillDescription(skill),
              icon: this.getSkillIcon(skill),
              popularity: this.getSkillPopularity(skill),
              trend: this.getSkillTrend(skill)
            }
          });
        });
    });

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  /**
   * Get goal suggestions based on profile and industry trends
   */
  getGoalSuggestions(context: PersonalizationContext, limit: number = 6): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    const experienceLevel = context.userProfile.basicInfo?.experienceLevel || ExperienceLevel.INTERMEDIATE;

    // Career goals based on experience level
    const careerGoals = this.getCareerGoalsForExperience(experienceLevel);
    careerGoals.forEach((goal, index) => {
      suggestions.push({
        id: `career_${index}`,
        type: 'goal',
        value: goal.title,
        confidence: goal.relevance,
        reasoning: goal.reasoning,
        metadata: {
          description: goal.description,
          icon: '🎯'
        }
      });
    });

    // Learning goals based on tech stack
    context.selectedCategories.forEach(category => {
      const learningGoals = this.getLearningGoalsForCategory(category);
      learningGoals.forEach((goal, index) => {
        suggestions.push({
          id: `learning_${category}_${index}`,
          type: 'goal',
          value: goal.title,
          confidence: goal.relevance,
          reasoning: `Recommended for ${category} developers`,
          metadata: {
            description: goal.description,
            icon: '📚'
          }
        });
      });
    });

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  /**
   * Get learning path recommendations
   */
  getLearningPathSuggestions(context: PersonalizationContext): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    const currentSkills = context.userProfile.techStack?.technologies?.map(t => t.name) || [];

    context.selectedCategories.forEach(category => {
      const paths = this.learningPaths[category] || [];
      paths.forEach((path, index) => {
        const relevance = this.calculatePathRelevance(path, currentSkills, category);
        
        if (relevance > 0.6) {
          suggestions.push({
            id: `path_${category}_${index}`,
            type: 'learning_path',
            value: path,
            confidence: relevance,
            reasoning: `Recommended learning path for ${category}`,
            category: category,
            metadata: {
              description: this.getPathDescription(path),
              icon: '🛤️'
            }
          });
        }
      });
    });

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get contextual suggestions based on current field focus
   */
  getContextualSuggestions(
    fieldName: string, 
    context: PersonalizationContext, 
    input: string = ''
  ): SmartSuggestion[] {
    switch (fieldName) {
      case 'currentRole':
        return this.getRoleSuggestions(context, input);
      case 'location':
        return this.getLocationSuggestions(input);
      case 'company':
        return this.getCompanySuggestions(input);
      case 'skills':
        return this.getSkillSuggestions(context);
      default:
        return [];
    }
  }

  private initializeDatabase() {
    // Initialize company database
    this.companyDatabase = [
      'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla',
      'Spotify', 'Uber', 'Airbnb', 'GitHub', 'GitLab', 'Atlassian', 'Slack',
      'Zoom', 'Shopify', 'Stripe', 'Twilio', 'Cloudflare', 'Vercel', 'Netlify',
      'Docker', 'MongoDB', 'Redis Labs', 'Elastic', 'HashiCorp', 'JetBrains'
    ];

    // Initialize role database
    this.roleDatabase = {
      [TechCategory.FRONTEND]: [
        'Frontend Developer', 'React Developer', 'Vue.js Developer', 'Angular Developer',
        'UI/UX Developer', 'JavaScript Developer', 'TypeScript Developer',
        'Web Developer', 'Frontend Engineer', 'UI Engineer'
      ],
      [TechCategory.BACKEND]: [
        'Backend Developer', 'Node.js Developer', 'Python Developer', 'Java Developer',
        'API Developer', 'Backend Engineer', 'Server-side Developer',
        'Microservices Developer', 'Database Developer', 'Systems Engineer'
      ],
      [TechCategory.MOBILE]: [
        'Mobile Developer', 'iOS Developer', 'Android Developer', 'React Native Developer',
        'Flutter Developer', 'Mobile App Developer', 'Cross-platform Developer'
      ],
      [TechCategory.CLOUD_DEVOPS]: [
        'DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer', 'Platform Engineer',
        'Infrastructure Engineer', 'AWS Developer', 'Kubernetes Engineer'
      ],
      [TechCategory.AI_ML]: [
        'ML Engineer', 'Data Scientist', 'AI Developer', 'Machine Learning Engineer',
        'Deep Learning Engineer', 'AI Researcher', 'MLOps Engineer'
      ],
      [TechCategory.DATA_SCIENCE]: [
        'Data Scientist', 'Data Analyst', 'Business Intelligence Developer',
        'Data Engineer', 'Analytics Engineer', 'Quantitative Analyst'
      ]
    };

    // Initialize skill database
    this.skillDatabase = {
      [TechCategory.FRONTEND]: [
        'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3',
        'Tailwind CSS', 'Sass', 'Webpack', 'Vite', 'Next.js', 'Nuxt.js'
      ],
      [TechCategory.BACKEND]: [
        'Node.js', 'Python', 'Java', 'C#', 'Go', 'Rust', 'Express.js', 'Django',
        'Spring Boot', 'FastAPI', 'GraphQL', 'REST APIs', 'Microservices'
      ],
      [TechCategory.MOBILE]: [
        'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS Development',
        'Android Development', 'Xamarin', 'Ionic', 'Cordova'
      ],
      [TechCategory.CLOUD_DEVOPS]: [
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform',
        'Jenkins', 'CI/CD', 'Ansible', 'Prometheus', 'Grafana'
      ],
      [TechCategory.AI_ML]: [
        'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'OpenCV', 'NLTK',
        'Pandas', 'NumPy', 'Jupyter', 'MLflow', 'Kubeflow'
      ],
      [TechCategory.DATA_SCIENCE]: [
        'Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
        'Tableau', 'Power BI', 'Apache Spark', 'Hadoop', 'Snowflake'
      ]
    };

    // Initialize learning paths
    this.learningPaths = {
      [TechCategory.FRONTEND]: [
        'HTML/CSS Fundamentals → JavaScript → React → Advanced React Patterns',
        'Vue.js Ecosystem → Nuxt.js → Advanced State Management',
        'TypeScript → Modern Build Tools → Performance Optimization'
      ],
      [TechCategory.BACKEND]: [
        'Node.js Fundamentals → Express.js → Database Integration → Microservices',
        'Python → Django/FastAPI → Database Design → API Development',
        'Java → Spring Boot → Cloud Deployment → Scalability'
      ],
      // Add more categories as needed
    };
  }

  private calculateStringMatchConfidence(input: string, candidate: string): number {
    const inputLower = input.toLowerCase();
    const candidateLower = candidate.toLowerCase();
    
    if (candidateLower.startsWith(inputLower)) return 0.9;
    if (candidateLower.includes(inputLower)) return 0.7;
    
    // Fuzzy matching logic could go here
    return 0.1;
  }

  private getCompanyPopularity(company: string): number {
    const popularityMap: Record<string, number> = {
      'Google': 95, 'Microsoft': 92, 'Apple': 90, 'Amazon': 88, 'Meta': 85
    };
    return popularityMap[company] || 50;
  }

  private adjustRoleForExperience(role: string, experience: ExperienceLevel): string {
    switch (experience) {
      case ExperienceLevel.BEGINNER:
        return `Junior ${role}`;
      case ExperienceLevel.INTERMEDIATE:
        return role;
      case ExperienceLevel.ADVANCED:
        return `Senior ${role}`;
      case ExperienceLevel.EXPERT:
        return `Lead ${role}` || `Principal ${role}`;
      default:
        return role;
    }
  }

  private calculateRoleConfidence(role: string, category: TechCategory, experience: ExperienceLevel): number {
    let confidence = 0.7; // Base confidence
    
    // Boost for alignment between role and category
    if (role.toLowerCase().includes(category.toLowerCase())) confidence += 0.2;
    
    // Adjust for experience level appropriateness
    if (experience === ExperienceLevel.BEGINNER && role.includes('Senior')) confidence -= 0.3;
    if (experience === ExperienceLevel.EXPERT && !role.includes('Senior') && !role.includes('Lead')) confidence -= 0.1;
    
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  private getRoleDescription(role: string, category: TechCategory): string {
    const descriptions: Record<string, string> = {
      'Frontend Developer': 'Build user interfaces and web experiences',
      'Backend Developer': 'Develop server-side logic and APIs',
      'Full Stack Developer': 'Work on both frontend and backend systems'
    };
    return descriptions[role] || `${category} development role`;
  }

  private getCategoryIcon(category: TechCategory): string {
    const icons = {
      [TechCategory.FRONTEND]: '🎨',
      [TechCategory.BACKEND]: '⚙️',
      [TechCategory.MOBILE]: '📱',
      [TechCategory.CLOUD_DEVOPS]: '☁️',
      [TechCategory.AI_ML]: '🤖',
      [TechCategory.DATA_SCIENCE]: '📊'
    };
    return icons[category] || '💻';
  }

  private getRoleTrend(role: string): 'rising' | 'stable' | 'declining' {
    const risingRoles = ['ML Engineer', 'DevOps Engineer', 'React Native Developer'];
    const decliningRoles = ['jQuery Developer', 'Flash Developer'];
    
    if (risingRoles.some(r => role.includes(r))) return 'rising';
    if (decliningRoles.some(r => role.includes(r))) return 'declining';
    return 'stable';
  }

  private calculateSkillRelevance(skill: string, context: PersonalizationContext): number {
    let relevance = 0.5; // Base relevance
    
    // Check if skill complements existing skills
    const existingSkills = context.userProfile.techStack?.technologies?.map(t => t.name) || [];
    if (this.areComplementarySkills(skill, existingSkills)) {
      relevance += 0.3;
    }
    
    // Check market demand (simplified)
    if (this.getSkillPopularity(skill) > 70) relevance += 0.2;
    
    return Math.min(1.0, relevance);
  }

  private generateSkillReasoning(skill: string, category: TechCategory, context: PersonalizationContext): string {
    const reasons = [
      `Popular skill in ${category} development`,
      `Complements your existing tech stack`,
      `High market demand and growth potential`,
      `Essential for modern ${category} projects`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private getSkillDescription(skill: string): string {
    const descriptions: Record<string, string> = {
      'React': 'Popular JavaScript library for building user interfaces',
      'Node.js': 'JavaScript runtime for server-side development',
      'TypeScript': 'Typed superset of JavaScript',
      'Python': 'Versatile programming language for backend and data science'
    };
    return descriptions[skill] || `${skill} technology`;
  }

  private getSkillIcon(skill: string): string {
    const icons: Record<string, string> = {
      'React': '⚛️', 'Vue.js': '🖖', 'Angular': '🅰️', 'Node.js': '🟢',
      'Python': '🐍', 'JavaScript': '💛', 'TypeScript': '🔷'
    };
    return icons[skill] || '🔧';
  }

  private getSkillPopularity(skill: string): number {
    const popularityMap: Record<string, number> = {
      'React': 95, 'JavaScript': 90, 'Python': 88, 'Node.js': 85, 'TypeScript': 82
    };
    return popularityMap[skill] || 60;
  }

  private getSkillTrend(skill: string): 'rising' | 'stable' | 'declining' {
    const risingSkills = ['TypeScript', 'Rust', 'Go', 'Svelte', 'Next.js'];
    const decliningSkills = ['jQuery', 'Angular.js', 'Backbone.js'];
    
    if (risingSkills.includes(skill)) return 'rising';
    if (decliningSkills.includes(skill)) return 'declining';
    return 'stable';
  }

  private areComplementarySkills(newSkill: string, existingSkills: string[]): boolean {
    const complementaryPairs = [
      ['React', 'TypeScript'], ['Node.js', 'Express.js'], ['Python', 'Django'],
      ['JavaScript', 'HTML5'], ['CSS3', 'Sass'], ['Docker', 'Kubernetes']
    ];
    
    return complementaryPairs.some(pair => 
      (pair.includes(newSkill) && existingSkills.some(skill => pair.includes(skill))) ||
      (existingSkills.includes(newSkill) && pair.some(skill => existingSkills.includes(skill)))
    );
  }

  private getCareerGoalsForExperience(experience: ExperienceLevel) {
    const goalsByExperience = {
      [ExperienceLevel.BEGINNER]: [
        { title: 'Land first developer role', relevance: 0.9, reasoning: 'Perfect for entry-level developers', description: 'Focus on building portfolio and landing your first job' },
        { title: 'Build portfolio projects', relevance: 0.85, reasoning: 'Essential for beginners', description: 'Create projects to showcase your skills' },
        { title: 'Learn industry best practices', relevance: 0.8, reasoning: 'Foundation building', description: 'Establish good coding habits early' }
      ],
      [ExperienceLevel.INTERMEDIATE]: [
        { title: 'Get promoted to senior role', relevance: 0.9, reasoning: 'Natural career progression', description: 'Take on more responsibility and mentoring' },
        { title: 'Lead a project team', relevance: 0.8, reasoning: 'Leadership development', description: 'Develop project management skills' },
        { title: 'Contribute to open source', relevance: 0.75, reasoning: 'Community involvement', description: 'Give back and build reputation' }
      ],
      [ExperienceLevel.ADVANCED]: [
        { title: 'Become tech lead', relevance: 0.9, reasoning: 'Senior career path', description: 'Lead technical decisions and architecture' },
        { title: 'Start mentoring others', relevance: 0.85, reasoning: 'Share expertise', description: 'Help grow the next generation of developers' },
        { title: 'Speak at conferences', relevance: 0.7, reasoning: 'Thought leadership', description: 'Share knowledge with the community' }
      ],
      [ExperienceLevel.EXPERT]: [
        { title: 'Build thought leadership', relevance: 0.9, reasoning: 'Expert positioning', description: 'Establish yourself as an industry expert' },
        { title: 'Start a company', relevance: 0.75, reasoning: 'Entrepreneurial path', description: 'Use expertise to build your own venture' },
        { title: 'Write technical content', relevance: 0.8, reasoning: 'Knowledge sharing', description: 'Create books, courses, or blog content' }
      ]
    };
    
    return goalsByExperience[experience] || [];
  }

  private getLearningGoalsForCategory(category: TechCategory) {
    const goalsByCategory = {
      [TechCategory.FRONTEND]: [
        { title: 'Master React ecosystem', relevance: 0.9, description: 'Deep dive into React, Redux, and related tools' },
        { title: 'Learn advanced CSS techniques', relevance: 0.8, description: 'CSS Grid, Flexbox, animations, and responsive design' },
        { title: 'Performance optimization', relevance: 0.85, description: 'Web vitals, code splitting, and optimization techniques' }
      ],
      [TechCategory.BACKEND]: [
        { title: 'Microservices architecture', relevance: 0.9, description: 'Design and implement distributed systems' },
        { title: 'Database optimization', relevance: 0.8, description: 'Advanced SQL, NoSQL, and performance tuning' },
        { title: 'Cloud deployment strategies', relevance: 0.85, description: 'AWS, Docker, Kubernetes, and DevOps practices' }
      ]
      // Add more categories as needed
    };
    
    return goalsByCategory[category] || [];
  }

  private calculatePathRelevance(path: string, currentSkills: string[], category: TechCategory): number {
    // Simple relevance calculation based on skill overlap
    const pathSkills = path.toLowerCase().split(' → ').map(s => s.trim());
    const skillOverlap = pathSkills.filter(skill => 
      currentSkills.some(current => current.toLowerCase().includes(skill) || skill.includes(current.toLowerCase()))
    ).length;
    
    return Math.min(1.0, 0.4 + (skillOverlap / pathSkills.length) * 0.6);
  }

  private getPathDescription(path: string): string {
    return `Structured learning path: ${path.replace(' → ', ' → ')}`;
  }

  private getLocationSuggestions(input: string): SmartSuggestion[] {
    const locations = [
      'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote',
      'London, UK', 'Berlin, Germany', 'Toronto, Canada', 'Amsterdam, Netherlands'
    ];
    
    return locations
      .filter(location => location.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5)
      .map((location, index) => ({
        id: `location_${index}`,
        type: 'platform' as const,
        value: location,
        confidence: this.calculateStringMatchConfidence(input, location),
        reasoning: `Tech hub location`,
        metadata: { icon: '📍' }
      }));
  }
}

// Singleton instance
export const smartSuggestionsEngine = new SmartSuggestionsEngine();