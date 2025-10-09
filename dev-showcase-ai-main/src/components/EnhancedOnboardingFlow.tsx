import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ShowWorkLogo from './ShowWorkLogo';
import { User, ChevronLeft, ChevronRight, CheckCircle, Code2, Sparkles, Activity, Monitor, Server, Database, Smartphone, Cloud, Users, Globe, Star, Terminal, Heart, Brain, BarChart3, Gamepad2, Shield, Upload, Plus, X, AlertCircle, Loader2, Clock } from 'lucide-react';
import { LinkedInIcon, TwitterIcon, GitHubIcon, InstagramIcon, RedditIcon } from './BrandIcons';
import { Question, getQuestionsForTechStacks, hasTechStackQuestions, getEnhancedQuestionsForTechStacks, getEnhancedQuestionsForTechStack } from '../utils/questionBank';
import { getAPIStatus, testAPIConnections } from '../utils/webQuestionService';
// Comprehensive Tech Stack Data matching the screenshot
const TECH_STACKS = [
  // Frontend Frameworks
  { id: 'react', name: 'React', category: 'frontend' },
  { id: 'vuejs', name: 'Vue.js', category: 'frontend' },
  { id: 'angular', name: 'Angular', category: 'frontend' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend' },
  
  // Backend & Languages
  { id: 'nodejs', name: 'Node.js', category: 'backend' },
  { id: 'html', name: 'HTML', category: 'language' },
  { id: 'python', name: 'Python', category: 'language' },
  { id: 'javascript', name: 'JavaScript', category: 'language' },
  { id: 'typescript', name: 'TypeScript', category: 'language' },
  { id: 'go', name: 'Go', category: 'language' },
  { id: 'rust', name: 'Rust', category: 'language' },
  { id: 'java', name: 'Java', category: 'language' },
  { id: 'cpp', name: 'C++', category: 'language' },
  { id: 'swift', name: 'Swift', category: 'language' },
  { id: 'kotlin', name: 'Kotlin', category: 'language' },
  
  // Mobile & Native
  { id: 'flutter', name: 'Flutter', category: 'mobile' },
  { id: 'react-native', name: 'React Native', category: 'mobile' },
  
  // Backend Frameworks
  { id: 'django', name: 'Django', category: 'backend' },
  { id: 'flask', name: 'Flask', category: 'backend' },
  { id: 'expressjs', name: 'Express.js', category: 'backend' },
  { id: 'fastapi', name: 'FastAPI', category: 'backend' },
  { id: 'spring-boot', name: 'Spring Boot', category: 'backend' },
  { id: 'rails', name: 'Rails', category: 'backend' },
  { id: 'laravel', name: 'Laravel', category: 'backend' },
  
  // Cloud & DevOps
  { id: 'firebase', name: 'Firebase', category: 'cloud' },
  { id: 'aws', name: 'AWS', category: 'cloud' },
  { id: 'azure', name: 'Azure', category: 'cloud' },
  { id: 'google-cloud', name: 'Google Cloud', category: 'cloud' },
  { id: 'docker', name: 'Docker', category: 'devops' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops' },
  
  // Databases
  { id: 'postgresql', name: 'PostgreSQL', category: 'database' },
  { id: 'mongodb', name: 'MongoDB', category: 'database' },
  { id: 'redis', name: 'Redis', category: 'database' },
];

// Enhanced Platforms Data matching the screenshot
const PLATFORMS_DATA = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional networking and career content',
    icon: <LinkedInIcon className="w-6 h-6" />,
    color: 'bg-blue-600'
  },
  {
    id: 'twitter',
    name: 'Twitter/X', 
    description: 'Quick updates and tech discussions',
    icon: <TwitterIcon className="w-6 h-6" />,
    color: 'bg-black'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code repositories and developer community',
    icon: <GitHubIcon className="w-6 h-6" />,
    color: 'bg-gray-800'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Visual content and behind-the-scenes',
    icon: <InstagramIcon className="w-6 h-6" />,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    description: 'Community discussions and feedback',
    icon: <RedditIcon className="w-6 h-6" />,
    color: 'bg-orange-600'
  }
];
interface ProfileSetupState {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  userProfile: {
    basicInfo?: {
      username?: string;
      fullName?: string;
      experienceLevel?: ExperienceLevel;
      location?: string;
      professionalBio?: string;
      profilePicture?: string;
    };
    techStack?: {
      primaryCategory?: TechCategory;
      technologies?: any[];
      manualTechStacks?: string[];
    };
    platforms?: any;
    goals?: any;
    quiz?: {
      questions: Question[];
      answers: Record<string, number>;
      score: number;
      completedTechStacks: string[];
    };
  };
  dynamicQuestions: any[];
  progress: {
    completionPercentage: number;
    timeSpentPerStep: Record<number, number>;
    questionsAnswered: number;
    questionsSkipped: number;
    mostDetailedAreas: string[];
    engagementScore: number;
  };
  sessionData: {
    startTime: Date;
    lastActivity: Date;
    deviceType: string;
  };
}

enum TechCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  MOBILE = 'mobile',
  CLOUD_DEVOPS = 'cloud_devops',
  AI_ML = 'ai_ml',
  DATA_SCIENCE = 'data_science',
  GAME_DEV = 'game_dev',
  CYBERSECURITY = 'cybersecurity',
  DATABASE = 'database',
  DESKTOP = 'desktop'
}

enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

interface ProgressInsights {
  completionRate: number;
  engagementScore: number;
  sessionQuality: 'high' | 'medium' | 'low';
}

interface SmartSuggestion {
  id: string;
  type: string;
  value: string;
  reasoning: string;
  metadata?: {
    icon?: string;
  };
}

const TECH_CATEGORY_CONFIG = {
  [TechCategory.FRONTEND]: {
    icon: '🎨',
    title: 'Frontend Development',
    description: 'User interfaces, web experiences, and client-side applications'
  },
  [TechCategory.BACKEND]: {
    icon: '⚙️',
    title: 'Backend Development', 
    description: 'Server-side logic, APIs, and system architecture'
  },
  [TechCategory.MOBILE]: {
    icon: '📱',
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile applications'
  },
  [TechCategory.CLOUD_DEVOPS]: {
    icon: '☁️',
    title: 'Cloud & DevOps',
    description: 'Infrastructure, deployment, and scalable systems'
  },
  [TechCategory.AI_ML]: {
    icon: '🤖',
    title: 'AI/Machine Learning',
    description: 'Artificial intelligence, machine learning, and data modeling'
  },
  [TechCategory.DATA_SCIENCE]: {
    icon: '📊',
    title: 'Data Science & Analytics',
    description: 'Data analysis, visualization, and business intelligence'
  }
};

const EXPERIENCE_LEVEL_CONFIG = {
  [ExperienceLevel.BEGINNER]: {
    label: 'Beginner',
    description: 'Less than 1 year',
    color: '#10B981'
  },
  [ExperienceLevel.INTERMEDIATE]: {
    label: 'Intermediate',
    description: '1-3 years', 
    color: '#F59E0B'
  },
  [ExperienceLevel.ADVANCED]: {
    label: 'Advanced',
    description: '3+ years',
    color: '#3B82F6'
  },
  [ExperienceLevel.EXPERT]: {
    label: 'Expert',
    description: 'Teaching/Contributing',
    color: '#8B5CF6'
  }
};

// Mock implementations for missing utilities
const progressTracker = {
  trackStepTransition: (fromStep: number, toStep: number) => {},
  trackFieldInteraction: (step: number, field: string) => {},
  generateProgressInsights: (): ProgressInsights => ({
    completionRate: 75,
    engagementScore: 85,
    sessionQuality: 'high' as const
  })
};

const smartSuggestionsEngine = {
  getContextualSuggestions: (field: string, context: any): SmartSuggestion[] => [
    {
      id: 'suggest1',
      type: 'role',
      value: 'Senior Frontend Developer',
      reasoning: 'Popular role for your experience level',
      metadata: { icon: '💻' }
    }
  ]
};

interface OnboardingData {
  profilePicture: string;
  name: string;
  username: string;
  role: string;
  bio: string;
  skills: Array<{ name: string; percentage: number }>;
}

interface EnhancedOnboardingFlowProps {
  user: any;
  onComplete: (data: OnboardingData) => void;
}

const TECH_CATEGORY_ICONS = {
  [TechCategory.FRONTEND]: Code2,
  [TechCategory.BACKEND]: Server,
  [TechCategory.MOBILE]: Smartphone,
  [TechCategory.CLOUD_DEVOPS]: Cloud,
  [TechCategory.AI_ML]: Brain,
  [TechCategory.DATA_SCIENCE]: BarChart3,
  [TechCategory.GAME_DEV]: Gamepad2,
  [TechCategory.CYBERSECURITY]: Shield,
  [TechCategory.DATABASE]: Database,
  [TechCategory.DESKTOP]: Monitor
};

export default function EnhancedOnboardingFlow({ user, onComplete }: EnhancedOnboardingFlowProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [selectedTechCategories, setSelectedTechCategories] = useState<TechCategory[]>([]);
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [manualTechStack, setManualTechStack] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [usernameAvailability, setUsernameAvailability] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    message: string;
  }>({ isChecking: false, isAvailable: null, message: '' });
  const [progressInsights, setProgressInsights] = useState<ProgressInsights | null>(null);
  const [focusedField, setFocusedField] = useState<string>('');
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [completionData, setCompletionData] = useState<OnboardingData | null>(null);
  
  // Quiz state management
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState(0);
  const [currentTechStackIndex, setCurrentTechStackIndex] = useState(0);
  const [questionsPerTechStack, setQuestionsPerTechStack] = useState<Record<string, Question[]>>({});
  const [orderedTechStacks, setOrderedTechStacks] = useState<string[]>([]);
  const [currentTechStackQuestions, setCurrentTechStackQuestions] = useState<Question[]>([]);
  const [currentTechStackQuestionIndex, setCurrentTechStackQuestionIndex] = useState(0);
  const [countdownTimer, setCountdownTimer] = useState<number | null>(null);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [platformsCountdown, setPlatformsCountdown] = useState<number | null>(null);
  
  // Auto-advance from platforms step after 5 seconds of inactivity (reduced for better UX)
  useEffect(() => {
    if (currentStep === 3) { // Platforms step
      console.log('📋 Platforms step reached, setting 5-second auto-advance timer');
      setPlatformsCountdown(5);
      
      const countdownInterval = setInterval(() => {
        setPlatformsCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      const autoAdvanceTimer = setTimeout(() => {
        console.log('⏰ Platforms step timeout - auto-advancing to completion');
        setPlatformsCountdown(null);
        console.log('🚀 About to call nextStep() from platforms auto-advance');
        nextStep();
      }, 5000); // 5 seconds (reduced from 10)
      
      return () => {
        clearTimeout(autoAdvanceTimer);
        clearInterval(countdownInterval);
        setPlatformsCountdown(null);
      };
    }
  }, [currentStep, nextStep]);
  
  // Clean up timers when question changes or component unmounts
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
      setCountdownTimer(null);
    };
  }, [currentTechStackIndex, currentTechStackQuestionIndex]);
  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, []);
  
  const [profileState, setProfileState] = useState<ProfileSetupState>({
    currentStep: 0,
    completedSteps: [],
    totalSteps: 4, // Updated to include quiz step
    userProfile: {
      basicInfo: {
        username: '',
        fullName: user?.name || '',
        experienceLevel: ExperienceLevel.INTERMEDIATE,
        location: '',
        professionalBio: '',
        profilePicture: ''
      },
      techStack: { 
        primaryCategory: TechCategory.FRONTEND, 
        technologies: [],
        manualTechStacks: []
      },
      platforms: { professional: [], social: [], community: [] },
      goals: { career: [], learning: [], content: [] },
      quiz: {
        questions: [],
        answers: {},
        score: 0,
        completedTechStacks: []
      }
    },
    dynamicQuestions: [],
    progress: {
      completionPercentage: 0,
      timeSpentPerStep: {},
      questionsAnswered: 0,
      questionsSkipped: 0,
      mostDetailedAreas: [],
      engagementScore: 0
    },
    sessionData: {
      startTime: new Date(),
      lastActivity: new Date(),
      deviceType: 'desktop'
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (focusedField) {
      const context = {
        userProfile: profileState.userProfile,
        currentStep,
        selectedCategories: selectedTechCategories,
        sessionBehavior: {
          timeSpent: 60000,
          interactionPattern: 'exploratory' as const,
          preferences: []
        }
      };
      
      const newSuggestions = smartSuggestionsEngine.getContextualSuggestions(focusedField, context);
      setSuggestions(newSuggestions);
    }
  }, [focusedField, profileState, selectedTechCategories, currentStep]);

  const updateUserProfile = (section: keyof ProfileSetupState['userProfile'], data: any) => {
    setProfileState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, [section]: { ...prev.userProfile[section], ...data } }
    }));
  };

  const nextStep = useCallback(() => {
    if (currentStep < profileState.totalSteps - 1) {
      // Initialize quiz when moving to quiz step (step 2)
      if (currentStep === 1) {
        const allTechStacks = [...selectedTechStacks, ...(profileState.userProfile.techStack?.manualTechStacks || [])];
        const availableTechStacks = allTechStacks.filter(tech => {
          // Check if we have questions for this tech stack
          const techName = TECH_STACKS.find(t => t.id === tech)?.name || tech;
          const hasQuestions = hasTechStackQuestions(techName) || hasTechStackQuestions(tech);
          console.log(`🔍 Checking ${tech} (${techName}): ${hasQuestions ? '✅ Has questions' : '❌ No questions'}`);
          return hasQuestions;
        });
        
        if (availableTechStacks.length > 0) {
          console.log('🚀 Initializing enhanced quiz with hybrid question system...');
          
          // Set loading state before starting async operations
          setIsQuizLoading(true);
          
          // Check API status
          const apiStatus = getAPIStatus();
          console.log('🔧 API Status:', apiStatus);
          
          // Test API connections in background
          testAPIConnections().then(results => {
            console.log('🌐 API Connection Test Results:', results);
          }).catch(error => {
            console.log('⚠️ API connection test failed:', error);
          });
          
          // Create ordered list of tech stacks for sequential questioning
          const orderedStacks = availableTechStacks.map(tech => {
            return TECH_STACKS.find(t => t.id === tech)?.name || tech;
          });
          setOrderedTechStacks(orderedStacks);
          
          console.log('🎯 Enhanced quiz initialized with tech stacks:', orderedStacks);
          
          // Use enhanced question fetching with web integration
          getEnhancedQuestionsForTechStacks(orderedStacks, 3)
            .then(allQuestions => {
              console.log('🧠 Total enhanced questions generated:', allQuestions.length);
              
              // Group questions by tech stack for organized presentation
              const groupedQuestions: Record<string, Question[]> = {};
              
              orderedStacks.forEach(techName => {
                const techQuestions = allQuestions.filter(q => 
                  q.techStack.toLowerCase() === techName.toLowerCase()
                );
                if (techQuestions.length > 0) {
                  groupedQuestions[techName] = techQuestions;
                  console.log(`📚 Enhanced: ${techQuestions.length} questions for ${techName}`);
                }
              });
              
              console.log('📋 Enhanced questions per tech stack:', groupedQuestions);
              
              setQuestionsPerTechStack(groupedQuestions);
              setQuizQuestions(allQuestions);
              
              // Initialize with first tech stack
              if (orderedStacks.length > 0) {
                const firstTechStack = orderedStacks[0];
                setCurrentTechStackQuestions(groupedQuestions[firstTechStack] || []);
                setCurrentTechStackIndex(0);
                setCurrentTechStackQuestionIndex(0);
              }
              
              setCurrentQuestionIndex(0);
              setQuizAnswers({});
              setQuizScore(0);
              
              updateUserProfile('quiz', {
                questions: allQuestions,
                answers: {},
                score: 0,
                completedTechStacks: []
              });
              
              // Quiz data loaded successfully, now transition to quiz step
              setIsQuizLoading(false);
              progressTracker.trackStepTransition(currentStep, currentStep + 1);
              setCurrentStep(currentStep + 1);
              setFocusedField('');
            })
            .catch(error => {
              console.error('❌ Enhanced quiz initialization failed, falling back to local questions:', error);
              
              // Fallback to local questions
              const fallbackQuestions = getQuestionsForTechStacks(orderedStacks, 3);
              const groupedQuestions: Record<string, Question[]> = {};
              
              orderedStacks.forEach(techName => {
                const techQuestions = fallbackQuestions.filter(q => 
                  q.techStack.toLowerCase() === techName.toLowerCase()
                );
                if (techQuestions.length > 0) {
                  groupedQuestions[techName] = techQuestions;
                }
              });
              
              setQuestionsPerTechStack(groupedQuestions);
              setQuizQuestions(fallbackQuestions);
              
              if (orderedStacks.length > 0) {
                const firstTechStack = orderedStacks[0];
                setCurrentTechStackQuestions(groupedQuestions[firstTechStack] || []);
                setCurrentTechStackIndex(0);
                setCurrentTechStackQuestionIndex(0);
              }
              
              updateUserProfile('quiz', {
                questions: fallbackQuestions,
                answers: {},
                score: 0,
                completedTechStacks: []
              });
              
              // Fallback questions loaded, now transition to quiz step
              setIsQuizLoading(false);
              progressTracker.trackStepTransition(currentStep, currentStep + 1);
              setCurrentStep(currentStep + 1);
              setFocusedField('');
            });
          
          // Don't advance step yet - wait for quiz initialization to complete
          return;
        }
      }
      
      // For all other steps, advance normally
      progressTracker.trackStepTransition(currentStep, currentStep + 1);
      setCurrentStep(currentStep + 1);
      setFocusedField('');
    } else {
      // Handle completion when we're at the last step (step 3 -> completion)
      if (currentStep === profileState.totalSteps - 1) {
        console.log('🎉 Profile setup complete! Moving to completion step...');
        console.log('📊 Current step:', currentStep, 'Total steps:', profileState.totalSteps);
        console.log('📋 Selected tech stacks:', selectedTechStacks);
        console.log('🎯 Selected platforms:', selectedPlatforms);
        
        const allTechStacks = [...selectedTechStacks, ...(profileState.userProfile.techStack?.manualTechStacks || [])];
        const legacyData: OnboardingData = {
          profilePicture: profileState.userProfile.basicInfo?.profilePicture || '',
          name: profileState.userProfile.basicInfo?.fullName || '',
          username: profileState.userProfile.basicInfo?.username || '',
          role: '', // Role field removed from setup
          bio: profileState.userProfile.basicInfo?.professionalBio || '',
          skills: allTechStacks.map(techId => {
            const tech = TECH_STACKS.find(t => t.id === techId);
            return {
              name: tech?.name || techId,
              percentage: Math.floor(Math.random() * 40) + 60
            };
          })
        };
        
        console.log('💾 Completion data prepared:', legacyData);
        
        // Store completion data and show transition page
        setCompletionData(legacyData);
        setShowTransition(true);
        console.log('🚀 Transition page should now show! showTransition set to true');
      }
    }
  }, [currentStep, profileState.totalSteps, selectedTechStacks, profileState.userProfile.techStack?.manualTechStacks, profileState.userProfile.basicInfo]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      progressTracker.trackStepTransition(currentStep, currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleFieldFocus = useCallback((fieldName: string) => {
    setFocusedField(fieldName);
    progressTracker.trackFieldInteraction(currentStep, fieldName);
  }, [currentStep]);

  // Debounced username availability check
  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!username) {
      setUsernameAvailability({ 
        isChecking: false, 
        isAvailable: null, 
        message: 'Username is required' 
      });
      return;
    }
    
    if (username.length < 3) {
      setUsernameAvailability({ 
        isChecking: false, 
        isAvailable: false, 
        message: 'Username must be at least 3 characters' 
      });
      return;
    }

    setUsernameAvailability({ isChecking: true, isAvailable: null, message: 'Checking availability...' });

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // For now, simulate some taken usernames
      const takenUsernames = ['admin', 'user', 'test', 'demo', 'api', 'www', 'mail', 'support'];
      const isAvailable = !takenUsernames.includes(username.toLowerCase());
      
      setUsernameAvailability({
        isChecking: false,
        isAvailable,
        message: isAvailable ? 'Username is available!' : 'Username is already taken'
      });
    } catch (error) {
      setUsernameAvailability({
        isChecking: false,
        isAvailable: null,
        message: 'Unable to check availability'
      });
    }
  }, []);

  // Username validation function
  const validateUsername = useCallback((username: string) => {
    if (!username) {
      return { isValid: false, message: '' };
    }
    
    if (username.length < 3) {
      return { isValid: false, message: 'Username must be at least 3 characters long' };
    }
    
    if (username.length > 20) {
      return { isValid: false, message: 'Username must be less than 20 characters' };
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return { isValid: false, message: 'Username can only contain letters, numbers, underscore (_) and dash (-)' };
    }
    
    if (/^[0-9]/.test(username)) {
      return { isValid: false, message: 'Username cannot start with a number' };
    }
    
    return { isValid: true, message: 'Valid username format' };
  }, []);

  // Debounce the username check
  useEffect(() => {
    const username = profileState.userProfile.basicInfo?.username;
    if (!username) {
      setUsernameAvailability({ isChecking: false, isAvailable: null, message: '' });
      return;
    }

    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [profileState.userProfile.basicInfo?.username, checkUsernameAvailability]);

  const applySuggestion = useCallback((suggestion: SmartSuggestion) => {
    // Remove role suggestion logic since currentRole field is removed
    setSuggestions([]);
    setFocusedField('');
  }, []);

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateUserProfile('basicInfo', { profilePicture: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const canProceed = () => {
    const allTechStacks = [...selectedTechStacks, ...(profileState.userProfile.techStack?.manualTechStacks || [])];
    const username = profileState.userProfile.basicInfo?.username;
    
    switch (currentStep) {
      case 0: 
        // Must have full name AND a valid and available username (both are mandatory)
        if (!username) {
          return false; // Username is required
        }
        const validation = validateUsername(username);
        const hasValidUsername = validation.isValid && usernameAvailability.isAvailable === true;
        return profileState.userProfile.basicInfo?.fullName && hasValidUsername;
      case 1: return allTechStacks.length > 0;
      case 2: return quizQuestions.length === 0 || Object.keys(quizAnswers).length === quizQuestions.length;
      case 3: return true; // Platforms are optional
      default: return true;
    }
  };

  if (showLogo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-fade-in-up mb-8">
            <ShowWorkLogo size="lg" variant="icon" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white text-xl font-medium">Creating your personalized experience...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderBasicInfoStep = () => (
    <div className="space-y-2">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome! Let's build your professional profile</h2>
        <p className="text-gray-600 text-sm">Tell us about yourself to create a personalized experience</p>
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold overflow-hidden">
            {profileState.userProfile.basicInfo?.profilePicture ? (
              <img src={profileState.userProfile.basicInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
              id="profile-picture-enhanced"
            />
          </div>
          <div className="mt-2">
            <label
              htmlFor="profile-picture-enhanced"
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md cursor-pointer hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Upload className="w-3 h-3 mr-1" />
              Add Photo
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload a professional image—recommended size: 400x400px
          </p>
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">Username *</label>
          <div className="relative">
            <input
              type="text"
              value={profileState.userProfile.basicInfo?.username || ''}
              onChange={(e) => {
                const value = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '');
                updateUserProfile('basicInfo', { username: value });
              }}
              onFocus={() => handleFieldFocus('username')}
              className={`w-full px-3 py-2 pr-10 text-sm border rounded-md focus:ring-2 transition-all duration-300 ${
                usernameAvailability.isAvailable === true
                  ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                  : usernameAvailability.isAvailable === false
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Choose a unique username"
              required
              maxLength={20}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {usernameAvailability.isChecking ? (
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              ) : usernameAvailability.isAvailable === true ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : usernameAvailability.isAvailable === false ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : null}
            </div>
          </div>
          
          {/* Character count and validation */}
          {profileState.userProfile.basicInfo?.username && (
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500">
                {(() => {
                  const username = profileState.userProfile.basicInfo?.username || '';
                  const validation = validateUsername(username);
                  if (!validation.isValid && validation.message) {
                    return (
                      <span className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validation.message}
                      </span>
                    );
                  }
                  return null;
                })()} 
              </div>
              <span className={`text-xs ${
                (profileState.userProfile.basicInfo?.username?.length || 0) > 15 
                  ? 'text-orange-600' 
                  : 'text-gray-500'
              }`}>
                {profileState.userProfile.basicInfo?.username?.length || 0}/20
              </span>
            </div>
          )}
          
          {/* Availability status */}
          {usernameAvailability.message && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${
              usernameAvailability.isAvailable === true
                ? 'text-green-600'
                : usernameAvailability.isAvailable === false
                ? 'text-red-600'
                : 'text-gray-500'
            }`}>
              {usernameAvailability.isChecking ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : usernameAvailability.isAvailable === true ? (
                <CheckCircle className="w-3 h-3" />
              ) : usernameAvailability.isAvailable === false ? (
                <AlertCircle className="w-3 h-3" />
              ) : null}
              {usernameAvailability.message}
            </p>
          )}
          
          {/* Help text */}
          <div className="mt-1 space-y-1">
            <p className="text-xs text-gray-500">
              Username is required and will be displayed in your public profile. It must be unique.
            </p>
            {(!profileState.userProfile.basicInfo?.username || profileState.userProfile.basicInfo?.username.length < 3) && (
              <p className="text-xs text-gray-400">
                💡 Tips: Use 3-20 characters, letters, numbers, underscore (_) or dash (-)
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={profileState.userProfile.basicInfo?.fullName || ''}
            onChange={(e) => updateUserProfile('basicInfo', { fullName: e.target.value })}
            onFocus={() => handleFieldFocus('fullName')}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Professional Bio</label>
          <textarea
            value={profileState.userProfile.basicInfo?.professionalBio || ''}
            onChange={(e) => updateUserProfile('basicInfo', { professionalBio: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
            placeholder="Tell us about your professional journey..."
          />
        </div>
      </div>
    </div>
  );

  const renderTechStackStep = () => {
    const allTechStacks = [...selectedTechStacks, ...(profileState.userProfile.techStack?.manualTechStacks || [])];
    
    const addManualTechStack = () => {
      if (manualTechStack.trim() && !allTechStacks.includes(manualTechStack.trim())) {
        updateUserProfile('techStack', { 
          manualTechStacks: [...(profileState.userProfile.techStack?.manualTechStacks || []), manualTechStack.trim()]
        });
        setManualTechStack('');
      }
    };

    const removeManualTechStack = (techStack: string) => {
      updateUserProfile('techStack', {
        manualTechStacks: (profileState.userProfile.techStack?.manualTechStacks || []).filter(t => t !== techStack)
      });
    };

    return (
      <div className="bg-gray-900 rounded-xl p-4 text-white min-h-[350px]">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-1">Tech Stack</h2>
          <h3 className="text-lg font-semibold text-white mb-2">What's your tech stack?</h3>
          <p className="text-gray-400 text-sm">Select the technologies you work with or add your own. This helps us personalize your quiz.</p>
        </div>

        {/* Predefined Tech Stacks */}
        <div className="flex flex-wrap gap-2 mb-4">
          {TECH_STACKS.map((tech) => {
            const isSelected = selectedTechStacks.includes(tech.id);
            return (
              <button
                key={tech.id}
                onClick={() => {
                  setSelectedTechStacks(prev => 
                    isSelected 
                      ? prev.filter(id => id !== tech.id)
                      : [...prev, tech.id]
                  );
                }}
                className={`px-3 py-1.5 text-sm rounded-full border-2 transition-all duration-300 hover:scale-105 ${
                  isSelected 
                    ? 'border-blue-400 bg-blue-500/20 text-blue-300' 
                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                {tech.name}
              </button>
            );
          })}
        </div>

        {/* Manual Tech Stack Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Add Custom Tech Stack</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualTechStack}
              onChange={(e) => setManualTechStack(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addManualTechStack()}
              className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a technology (e.g., Svelte, Laravel, etc.)"
            />
            <button
              onClick={addManualTechStack}
              disabled={!manualTechStack.trim()}
              className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                manualTechStack.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Manual Tech Stacks Display */}
        {profileState.userProfile.techStack?.manualTechStacks && profileState.userProfile.techStack.manualTechStacks.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-300 mb-2">Custom Tech Stacks:</p>
            <div className="flex flex-wrap gap-2">
              {profileState.userProfile.techStack.manualTechStacks.map((tech) => (
                <div
                  key={tech}
                  className="px-3 py-1.5 text-sm rounded-full border-2 border-green-400 bg-green-500/20 text-green-300 flex items-center gap-2"
                >
                  {tech}
                  <button
                    onClick={() => removeManualTechStack(tech)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            className="flex items-center px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          
          <button
            onClick={nextStep}
            disabled={allTechStacks.length === 0 || isQuizLoading}
            className={`px-6 py-2 text-sm rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              allTechStacks.length > 0 && !isQuizLoading
                ? 'bg-gray-600 text-white hover:bg-gray-500'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isQuizLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading Quiz...
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderPlatformsStep = () => (
    <div className="bg-gray-900 rounded-xl p-4 text-white min-h-[350px]">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-1">Platforms</h2>
        <h3 className="text-lg font-semibold text-white mb-2">Which platforms do you want to use?</h3>
        <p className="text-gray-400 text-sm">Select the social platforms where you'd like to share your work. You can always change this later.</p>
      </div>

      <div className="space-y-2 mb-4">
        {PLATFORMS_DATA.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => {
                setSelectedPlatforms(prev => 
                  isSelected 
                    ? prev.filter(id => id !== platform.id)
                    : [...prev, platform.id]
                );
              }}
              className={`w-full p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 text-left ${
                isSelected 
                  ? 'border-blue-400 bg-blue-500/20' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                    {React.cloneElement(platform.icon as React.ReactElement, { className: "w-4 h-4" })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">{platform.name}</h3>
                    <p className="text-gray-400 text-xs">{platform.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          className="flex items-center px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        
        <div className="flex items-center gap-4">
          {platformsCountdown && (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Auto-completing in</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{platformsCountdown}</span>
                </div>
                <span className="text-gray-400 text-sm">seconds</span>
              </div>
            </div>
          )}
          
          <button
            onClick={nextStep}
            className="px-6 py-2 text-sm bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-500 transition-all duration-300"
          >
            Continue to Complete Setup
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuizStep = () => {
    // Show loading state while quiz is being initialized
    if (isQuizLoading) {
      return (
        <div className="bg-gray-900 rounded-xl p-6 text-white min-h-[450px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Preparing Your Quiz</h3>
            <p className="text-gray-400 text-sm mb-4">
              We're generating personalized questions for your selected tech stacks...
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-400 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>
      );
    }

    if (orderedTechStacks.length === 0 || Object.keys(questionsPerTechStack).length === 0) {
      return (
        <div className="bg-gray-900 rounded-xl p-6 text-white min-h-[350px] flex items-center justify-center">
          <div className="text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Questions Available</h3>
            <p className="text-gray-400 text-sm mb-4">
              We don't have quiz questions for your selected tech stacks yet.
            </p>
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-500 transition-colors"
            >
              Skip Quiz
            </button>
          </div>
        </div>
      );
    }

    const currentTechStackName = orderedTechStacks[currentTechStackIndex];
    const techStackQuestions = questionsPerTechStack[currentTechStackName] || [];
    
    if (techStackQuestions.length === 0) {
      // Move to next tech stack if current one has no questions
      const nextTechStackIndex = currentTechStackIndex + 1;
      if (nextTechStackIndex < orderedTechStacks.length) {
        setCurrentTechStackIndex(nextTechStackIndex);
        setCurrentTechStackQuestionIndex(0);
        const nextTechStackQuestions = questionsPerTechStack[orderedTechStacks[nextTechStackIndex]] || [];
        setCurrentTechStackQuestions(nextTechStackQuestions);
      }
      return null; // Will re-render with next tech stack
    }

    const currentQuestion = techStackQuestions[currentTechStackQuestionIndex];
    const totalQuestionsForCurrentTech = techStackQuestions.length;
    const totalTechStacks = orderedTechStacks.length;
    const answeredQuestionsForCurrentTech = techStackQuestions.filter(q => quizAnswers[q.id] !== undefined).length;
    
    // Calculate overall progress
    const completedTechStacks = currentTechStackIndex;
    const currentTechProgress = currentTechStackQuestionIndex / totalQuestionsForCurrentTech;
    const overallProgress = (completedTechStacks + currentTechProgress) / totalTechStacks;
    const progressPercentage = overallProgress * 100;

    const handleAnswerSelect = (answerIndex: number) => {
      if (selectedAnswer !== undefined) {
        return; // Prevent multiple selections
      }
      
      // Show immediate feedback
      setSelectedAnswerIndex(answerIndex);
      
      // Short delay before processing answer
      setTimeout(() => {
        const questionId = currentQuestion.id;
        const newAnswers = { ...quizAnswers, [questionId]: answerIndex };
        setQuizAnswers(newAnswers);
        
        // Calculate score
        let score = 0;
        quizQuestions.forEach(q => {
          if (newAnswers[q.id] === q.correctAnswer) {
            score++;
          }
        });
        setQuizScore(score);
        
        // Update profile state
        updateUserProfile('quiz', {
          ...profileState.userProfile.quiz,
          answers: newAnswers,
          score
        });
        
        console.log('✅ Answer selected, starting 2-second auto-continue timer');
        
        // Start countdown from 2 seconds
        setCountdownTimer(2);
        const countdownInterval = setInterval(() => {
          setCountdownTimer(prev => {
            if (prev === null || prev <= 1) {
              clearInterval(countdownInterval);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
        
        // Auto advance after 2 seconds
        const timer = setTimeout(() => {
          console.log('🚀 Auto-advancing to next question');
          setCountdownTimer(null);
          setSelectedAnswerIndex(null);
          
          if (currentTechStackQuestionIndex < totalQuestionsForCurrentTech - 1) {
            // Move to next question in current tech stack
            console.log('➡️ Moving to next question in current tech stack');
            setCurrentTechStackQuestionIndex(prev => prev + 1);
          } else {
            // Move to next tech stack
            const nextTechStackIndex = currentTechStackIndex + 1;
            if (nextTechStackIndex < orderedTechStacks.length) {
              console.log(`🔄 Moving to next tech stack: ${orderedTechStacks[nextTechStackIndex]} (${nextTechStackIndex + 1}/${orderedTechStacks.length})`);
              setCurrentTechStackIndex(nextTechStackIndex);
              setCurrentTechStackQuestionIndex(0);
              const nextTechStackQuestions = questionsPerTechStack[orderedTechStacks[nextTechStackIndex]] || [];
              setCurrentTechStackQuestions(nextTechStackQuestions);
            } else {
              console.log('🏁 All tech stacks completed! Quiz should be finished.');
              console.log('📊 Current step should advance to platforms (step 3)');
              // Auto-advance to next step when quiz is complete
              setTimeout(() => {
                console.log('🚀 Auto-advancing from quiz to platforms step');
                nextStep();
              }, 2000);
            }
          }
        }, 2000);
        
        setAutoAdvanceTimer(timer);
      }, 300); // 300ms delay for immediate feedback
    };

    const goToPrevQuestion = () => {
      if (currentTechStackQuestionIndex > 0) {
        setCurrentTechStackQuestionIndex(prev => prev - 1);
      } else if (currentTechStackIndex > 0) {
        // Go to previous tech stack's last question
        const prevTechStackIndex = currentTechStackIndex - 1;
        const prevTechStackName = orderedTechStacks[prevTechStackIndex];
        const prevTechStackQuestions = questionsPerTechStack[prevTechStackName] || [];
        setCurrentTechStackIndex(prevTechStackIndex);
        setCurrentTechStackQuestionIndex(prevTechStackQuestions.length - 1);
        setCurrentTechStackQuestions(prevTechStackQuestions);
      }
    };

    const goToNextQuestion = () => {
      if (currentTechStackQuestionIndex < totalQuestionsForCurrentTech - 1) {
        setCurrentTechStackQuestionIndex(prev => prev + 1);
      } else {
        // Move to next tech stack
        const nextTechStackIndex = currentTechStackIndex + 1;
        if (nextTechStackIndex < orderedTechStacks.length) {
          setCurrentTechStackIndex(nextTechStackIndex);
          setCurrentTechStackQuestionIndex(0);
          const nextTechStackQuestions = questionsPerTechStack[orderedTechStacks[nextTechStackIndex]] || [];
          setCurrentTechStackQuestions(nextTechStackQuestions);
        }
      }
    };

    const isLastTechStack = currentTechStackIndex === orderedTechStacks.length - 1;
    const isLastQuestionInTechStack = currentTechStackQuestionIndex === totalQuestionsForCurrentTech - 1;
    const isQuizComplete = isLastTechStack && isLastQuestionInTechStack && quizAnswers[currentQuestion.id] !== undefined;
    const selectedAnswer = quizAnswers[currentQuestion.id];
    const isFirstQuestion = currentTechStackIndex === 0 && currentTechStackQuestionIndex === 0;

    return (
      <div className="bg-gray-900 rounded-xl p-6 text-white min-h-[450px]">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Skill Assessment</h2>
              <p className="text-gray-400 text-sm">
                {currentTechStackName} • Question {currentTechStackQuestionIndex + 1} of {totalQuestionsForCurrentTech}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Tech Stack {currentTechStackIndex + 1} of {totalTechStacks}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Overall Progress</p>
              <p className="text-lg font-semibold text-blue-400">
                {Math.round(progressPercentage)}%
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Tech Stack Progress Indicators */}
          <div className="flex items-center gap-2 mb-4">
            {orderedTechStacks.map((techStack, index) => {
              const isCompleted = index < currentTechStackIndex;
              const isCurrent = index === currentTechStackIndex;
              const techQuestions = questionsPerTechStack[techStack] || [];
              const answeredInTech = techQuestions.filter(q => quizAnswers[q.id] !== undefined).length;
              
              return (
                <div key={techStack} className="flex flex-col items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${
                    isCompleted ? 'bg-green-500' : 
                    isCurrent ? 'bg-blue-500' : 'bg-gray-600'
                  }`} />
                  <span className={`text-xs px-2 py-1 rounded ${
                    isCurrent ? 'bg-blue-500/20 text-blue-300' :
                    isCompleted ? 'bg-green-500/20 text-green-300' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {techStack}
                  </span>
                  {isCurrent && (
                    <span className="text-xs text-gray-400">
                      {answeredInTech}/{techQuestions.length}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">Q</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 leading-relaxed">
                {currentQuestion.question}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="px-2 py-1 bg-gray-800 rounded-full">{currentQuestion.difficulty}</span>
                <span className="px-2 py-1 bg-gray-800 rounded-full">{currentQuestion.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showResult = selectedAnswer !== undefined;
            const isSelectedButNotAnswered = selectedAnswerIndex === index && !showResult;
            
            let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-300 transform hover:scale-[1.02]";
            
            if (showResult) {
              if (isSelected && isCorrect) {
                buttonClass += " border-green-400 bg-green-500/20 text-green-300 shadow-green-200 shadow-lg";
              } else if (isSelected && !isCorrect) {
                buttonClass += " border-red-400 bg-red-500/20 text-red-300 shadow-red-200 shadow-lg";
              } else if (!isSelected && isCorrect) {
                buttonClass += " border-green-400 bg-green-500/10 text-green-400";
              } else {
                buttonClass += " border-gray-600 text-gray-400";
              }
            } else if (isSelectedButNotAnswered) {
              buttonClass += " border-blue-400 bg-blue-500/20 text-blue-300 animate-pulse";
            } else {
              buttonClass += " border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800/50 hover:shadow-lg";
            }
            
            return (
              <button
                key={index}
                onClick={() => !showResult && selectedAnswerIndex === null && handleAnswerSelect(index)}
                disabled={showResult || selectedAnswerIndex !== null}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      showResult && isSelected 
                        ? (isCorrect ? 'border-green-400 bg-green-500 text-white' : 'border-red-400 bg-red-500 text-white')
                        : isSelectedButNotAnswered
                        ? 'border-blue-400 bg-blue-500 text-white'
                        : 'border-gray-500 text-gray-300'
                    }`}>
                      <span>{String.fromCharCode(65 + index)}</span>
                    </div>
                    <span className="text-sm font-medium">{option}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {showResult && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-400 animate-bounce" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <X className="w-5 h-5 text-red-400 animate-pulse" />
                    )}
                    {isSelectedButNotAnswered && (
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={isFirstQuestion ? prevStep : goToPrevQuestion}
            className="flex items-center px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {isFirstQuestion ? 'Back' : 'Previous'}
          </button>
          
          {isQuizComplete ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Your Score</p>
                <p className="text-lg font-bold text-blue-400">{quizScore}/{quizQuestions.length}</p>
              </div>
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ) : selectedAnswer !== undefined && countdownTimer !== null ? (
            <div className="text-center">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-lg text-gray-300 font-medium">
                    {isLastTechStack && isLastQuestionInTechStack 
                      ? `🎉 Quiz completed! Advancing to platforms in ${countdownTimer} second${countdownTimer !== 1 ? 's' : ''}...` 
                      : `⏭️ Next question in ${countdownTimer} second${countdownTimer !== 1 ? 's' : ''}...`}
                  </span>
                </div>
                
                {/* Visual countdown circle */}
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gray-700 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-400">{countdownTimer}</span>
                  </div>
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#3B82F6"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${((2 - (countdownTimer || 0)) / 2) * 175.93} 175.93`}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                </div>
                
                {/* Progress bar */}
                <div className="w-48 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((2 - (countdownTimer || 0)) / 2) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={goToNextQuestion}
              disabled={selectedAnswer === undefined}
              className={`flex items-center px-6 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
                selectedAnswer !== undefined
                  ? 'bg-gray-600 text-white hover:bg-gray-500'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLastTechStack && isLastQuestionInTechStack ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return renderBasicInfoStep();
      case 1: return renderTechStackStep();
      case 2: return renderQuizStep();
      case 3: return renderPlatformsStep();
      default: 
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Profile Complete!</h2>
            <button
              onClick={() => {
                const allTechStacks = [...selectedTechStacks, ...(profileState.userProfile.techStack?.manualTechStacks || [])];
                const legacyData: OnboardingData = {
                  profilePicture: profileState.userProfile.basicInfo?.profilePicture || '',
                  name: profileState.userProfile.basicInfo?.fullName || '',
                  username: profileState.userProfile.basicInfo?.username || '',
                  role: '', // Role field removed from setup
                  bio: profileState.userProfile.basicInfo?.professionalBio || '',
                  skills: allTechStacks.map(techId => {
                    const tech = TECH_STACKS.find(t => t.id === techId);
                    return {
                      name: tech?.name || techId,
                      percentage: Math.floor(Math.random() * 40) + 60
                    };
                  })
                };
                
                // Store completion data and show transition page
                setCompletionData(legacyData);
                setShowTransition(true);
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Complete Setup
            </button>
          </div>
        );
    }
  };

  // Go directly to completion without transition page
  if (showTransition && completionData) {
    console.log('🎬 Completion data ready, calling onComplete callback directly');
    onComplete(completionData);
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      {/* Left Panel - White Background */}
      <div className="flex-1 bg-white flex flex-col p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            {/* Logo - positioned closer to content */}
            <div className="flex items-center space-x-2 mb-6">
              <span className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="text-xl font-bold text-foreground">ShowWork</span>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-gray-500">
                  Step {currentStep + 1} of {profileState.totalSteps}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(((currentStep + 1) / profileState.totalSteps) * 100)}% Complete
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                {Array.from({ length: profileState.totalSteps }, (_, i) => (
                  <div 
                    key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                      i <= currentStep 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="relative h-1.5 bg-gray-200 rounded-full">
                <div 
                  className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / profileState.totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px] py-6">
              {currentStep === 0 ? (
                <div className="max-w-lg mx-auto">
                  {renderStep()}
                </div>
              ) : (
                renderStep()
              )}
            </div>

            {/* Navigation - Only show for basic info step */}
            {currentStep === 0 && (
              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`flex items-center px-6 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
                    canProceed()
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Dark Gradient Background */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated Particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
          <div className="absolute bottom-32 left-40 w-3 h-3 bg-cyan-400 rounded-full animate-bounce opacity-50"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-50"></div>
          <div className="absolute top-16 right-16 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-40"></div>
          <div className="absolute bottom-16 right-20 w-1 h-1 bg-red-400 rounded-full animate-pulse opacity-50"></div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute top-1/2 left-1/5 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-md animate-pulse" style={{animationDelay: '1s'}}></div>

          {/* Floating Code Lines */}
          <div className="absolute top-24 left-1/3 text-blue-300/40 font-mono text-sm animate-float" style={{animationDelay: '0.5s'}}>
            const skills = [];
          </div>
          <div className="absolute top-1/2 right-1/5 text-purple-300/40 font-mono text-xs animate-float" style={{animationDelay: '2s'}}>
            function buildProfile() &lcub;
          </div>
          <div className="absolute bottom-1/3 left-1/4 text-cyan-300/40 font-mono text-sm animate-float" style={{animationDelay: '1.5s'}}>
            return success;
          </div>
          <div className="absolute top-3/4 right-1/3 text-green-300/40 font-mono text-xs animate-float" style={{animationDelay: '3s'}}>
            &rcub;
          </div>

          {/* Animated Code Symbols */}
          <div className="absolute top-32 left-16 p-2 bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-400/20 animate-bounce" style={{animationDelay: '0.5s'}}>
            <span className="text-blue-300 font-mono text-lg">&lt;</span>
          </div>
          <div className="absolute top-20 right-24 p-2 bg-purple-500/10 backdrop-blur-sm rounded-lg border border-purple-400/20 animate-pulse" style={{animationDelay: '1s'}}>
            <span className="text-purple-300 font-mono text-lg">/&gt;</span>
          </div>
          <div className="absolute bottom-24 left-16 p-2 bg-cyan-500/10 backdrop-blur-sm rounded-lg border border-cyan-400/20 animate-bounce" style={{animationDelay: '2s'}}>
            <span className="text-cyan-300 font-mono text-lg">{'{'}</span>
          </div>
          <div className="absolute bottom-40 right-12 p-2 bg-green-500/10 backdrop-blur-sm rounded-lg border border-green-400/20 animate-pulse" style={{animationDelay: '1.5s'}}>
            <span className="text-green-300 font-mono text-lg">{'}'}</span>
          </div>
          <div className="absolute top-1/2 left-8 p-2 bg-pink-500/10 backdrop-blur-sm rounded-lg border border-pink-400/20 animate-bounce" style={{animationDelay: '2.5s'}}>
            <span className="text-pink-300 font-mono text-lg">=&gt;</span>
          </div>
          <div className="absolute top-2/3 right-8 p-2 bg-yellow-500/10 backdrop-blur-sm rounded-lg border border-yellow-400/20 animate-pulse" style={{animationDelay: '0.8s'}}>
            <span className="text-yellow-300 font-mono text-lg">[]</span>
          </div>

          {/* Coding Platform Logos */}
          <div className="absolute top-16 left-1/2 p-3 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/10 animate-float" style={{animationDelay: '1s'}}>
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <div className="absolute bottom-20 left-1/2 p-3 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/10 animate-float" style={{animationDelay: '2.5s'}}>
            <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 0h-9L6 1.9v3.7H4.4L2 8.1v15.8h14.5L19 21.4v-3.6H21l2.2-2.5V0h-5.7zm-3 20.6H3.8V10.5L6 8.1h8.5v12.5zm5.1-14.4L17.3 8.5h-4.4V1.9h6.7v4.3z"/>
            </svg>
          </div>
          <div className="absolute top-1/3 left-12 p-3 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/10 animate-float" style={{animationDelay: '0.3s'}}>
            <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
            </svg>
          </div>
          <div className="absolute bottom-1/3 right-12 p-3 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/10 animate-float" style={{animationDelay: '1.8s'}}>
            <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
            </svg>
          </div>
          <div className="absolute top-2/3 left-20 p-3 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/10 animate-float" style={{animationDelay: '3.2s'}}>
            <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L2.46,6.68C2.376,6.729,2.322,6.825,2.322,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.570,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.272-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/>
            </svg>
          </div>

          {/* Connecting Lines Animation */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
            <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="url(#lineGradient1)" strokeWidth="1" className="animate-pulse" />
            <line x1="70%" y1="30%" x2="90%" y2="50%" stroke="url(#lineGradient1)" strokeWidth="1" className="animate-pulse" style={{animationDelay: '1s'}} />
            <line x1="20%" y1="70%" x2="50%" y2="80%" stroke="url(#lineGradient2)" strokeWidth="1" className="animate-pulse" style={{animationDelay: '2s'}} />
            <line x1="60%" y1="15%" x2="80%" y2="35%" stroke="url(#lineGradient2)" strokeWidth="1" className="animate-pulse" style={{animationDelay: '1.5s'}} />
            <line x1="15%" y1="50%" x2="35%" y2="70%" stroke="url(#lineGradient1)" strokeWidth="1" className="animate-pulse" style={{animationDelay: '0.5s'}} />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 ml-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4 text-center ml-8">
            Your professional journey
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              starts here
            </span>
          </h2>
          
          <p className="text-lg text-gray-300 max-w-md leading-relaxed mb-6 text-center ml-8">
            Create a personalized profile that showcases your unique skills and connects you with opportunities.
          </p>

          {/* Progress Insights */}
          {progressInsights && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-sm text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Your Progress</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">Completion</span>
                  <span className="text-blue-400 font-medium">{progressInsights.completionRate}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">Engagement</span>
                  <span className="text-green-400 font-medium">{progressInsights.engagementScore}/100</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Session Quality: <span className="capitalize text-blue-300">{progressInsights.sessionQuality}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
