import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Code2,
  Globe,
  Users,
  Star,
  Zap,
  Database,
  Server,
  Layers,
  Terminal,
  Brain,
  Shield,
  ArrowLeft,
  Loader,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  LinkedInIcon,
  TwitterIcon,
  GitHubIcon,
  InstagramIcon,
  RedditIcon,
} from "./BrandIcons";
import {
  QUESTION_BANK,
  Question as QuizQuestion,
  getEnhancedQuestionsForTechStacks,
} from "@/utils/questionBank";
import { getHybridQuestions } from "@/utils/webQuestionService";

// Types
interface TechStack {
  id: string;
  name: string;
  icon: React.ReactNode;
  category:
    | "frontend"
    | "backend"
    | "database"
    | "mobile"
    | "devops"
    | "language";
  color: string;
}

interface Question {
  id: string;
  techId: string;
  question: string;
  type: "multiple-choice" | "slider" | "input";
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
}

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface Answer {
  questionId: string;
  value: string | number;
}

interface ProfileData {
  username: string;
  fullName: string;
  bio: string;
}

interface DeveloperProfileSetupProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    username?: string;
  };
  onComplete?: (setupData?: ProfileData) => void;
}

// Tech Stack Data - Enhanced with more technologies
const TECH_STACKS: TechStack[] = [
  // Frontend Frameworks
  {
    id: "react",
    name: "React",
    icon: <Code2 className="w-5 h-5" />,
    category: "frontend",
    color: "bg-blue-500",
  },
  {
    id: "vue",
    name: "Vue.js",
    icon: <Layers className="w-5 h-5" />,
    category: "frontend",
    color: "bg-green-500",
  },
  {
    id: "angular",
    name: "Angular",
    icon: <Shield className="w-5 h-5" />,
    category: "frontend",
    color: "bg-red-500",
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: <Zap className="w-5 h-5" />,
    category: "frontend",
    color: "bg-gray-800",
  },
  {
    id: "svelte",
    name: "Svelte",
    icon: <Layers className="w-5 h-5" />,
    category: "frontend",
    color: "bg-orange-500",
  },
  {
    id: "nuxt",
    name: "Nuxt.js",
    icon: <Layers className="w-5 h-5" />,
    category: "frontend",
    color: "bg-green-600",
  },

  // Backend Technologies
  {
    id: "nodejs",
    name: "Node.js",
    icon: <Server className="w-5 h-5" />,
    category: "backend",
    color: "bg-green-600",
  },
  {
    id: "express",
    name: "Express.js",
    icon: <Server className="w-5 h-5" />,
    category: "backend",
    color: "bg-gray-700",
  },
  {
    id: "nestjs",
    name: "NestJS",
    icon: <Shield className="w-5 h-5" />,
    category: "backend",
    color: "bg-red-600",
  },
  {
    id: "django",
    name: "Django",
    icon: <Server className="w-5 h-5" />,
    category: "backend",
    color: "bg-green-700",
  },
  {
    id: "flask",
    name: "Flask",
    icon: <Server className="w-5 h-5" />,
    category: "backend",
    color: "bg-gray-600",
  },
  {
    id: "fastapi",
    name: "FastAPI",
    icon: <Zap className="w-5 h-5" />,
    category: "backend",
    color: "bg-teal-600",
  },
  {
    id: "spring",
    name: "Spring Boot",
    icon: <Layers className="w-5 h-5" />,
    category: "backend",
    color: "bg-green-500",
  },
  {
    id: "dotnet",
    name: ".NET Core",
    icon: <Server className="w-5 h-5" />,
    category: "backend",
    color: "bg-purple-600",
  },

  // Programming Languages
  {
    id: "html",
    name: "HTML",
    icon: <Globe className="w-5 h-5" />,
    category: "language",
    color: "bg-orange-500",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: <Terminal className="w-5 h-5" />,
    category: "language",
    color: "bg-yellow-400",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: <Code2 className="w-5 h-5" />,
    category: "language",
    color: "bg-blue-600",
  },
  {
    id: "python",
    name: "Python",
    icon: <Brain className="w-5 h-5" />,
    category: "language",
    color: "bg-yellow-500",
  },
  {
    id: "java",
    name: "Java",
    icon: <Code2 className="w-5 h-5" />,
    category: "language",
    color: "bg-red-600",
  },
  {
    id: "csharp",
    name: "C#",
    icon: <Code2 className="w-5 h-5" />,
    category: "language",
    color: "bg-purple-500",
  },
  {
    id: "go",
    name: "Go",
    icon: <Zap className="w-5 h-5" />,
    category: "language",
    color: "bg-cyan-500",
  },
  {
    id: "rust",
    name: "Rust",
    icon: <Shield className="w-5 h-5" />,
    category: "language",
    color: "bg-orange-600",
  },
  {
    id: "php",
    name: "PHP",
    icon: <Globe className="w-5 h-5" />,
    category: "language",
    color: "bg-indigo-600",
  },

  // Mobile Development
  {
    id: "reactnative",
    name: "React Native",
    icon: <Code2 className="w-5 h-5" />,
    category: "mobile",
    color: "bg-blue-400",
  },
  {
    id: "flutter",
    name: "Flutter",
    icon: <Layers className="w-5 h-5" />,
    category: "mobile",
    color: "bg-blue-300",
  },
  {
    id: "swift",
    name: "Swift",
    icon: <Code2 className="w-5 h-5" />,
    category: "mobile",
    color: "bg-orange-500",
  },
  {
    id: "kotlin",
    name: "Kotlin",
    icon: <Code2 className="w-5 h-5" />,
    category: "mobile",
    color: "bg-purple-400",
  },

  // Databases
  {
    id: "mongodb",
    name: "MongoDB",
    icon: <Database className="w-5 h-5" />,
    category: "database",
    color: "bg-green-700",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: <Database className="w-5 h-5" />,
    category: "database",
    color: "bg-blue-700",
  },
  {
    id: "mysql",
    name: "MySQL",
    icon: <Database className="w-5 h-5" />,
    category: "database",
    color: "bg-orange-600",
  },
  {
    id: "redis",
    name: "Redis",
    icon: <Database className="w-5 h-5" />,
    category: "database",
    color: "bg-red-500",
  },
  {
    id: "firebase",
    name: "Firebase",
    icon: <Zap className="w-5 h-5" />,
    category: "database",
    color: "bg-yellow-600",
  },

  // DevOps & Cloud
  {
    id: "docker",
    name: "Docker",
    icon: <Layers className="w-5 h-5" />,
    category: "devops",
    color: "bg-blue-400",
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    icon: <Server className="w-5 h-5" />,
    category: "devops",
    color: "bg-blue-600",
  },
  {
    id: "aws",
    name: "AWS",
    icon: <Globe className="w-5 h-5" />,
    category: "devops",
    color: "bg-orange-500",
  },
  {
    id: "gcp",
    name: "Google Cloud",
    icon: <Globe className="w-5 h-5" />,
    category: "devops",
    color: "bg-blue-500",
  },
  {
    id: "azure",
    name: "Azure",
    icon: <Globe className="w-5 h-5" />,
    category: "devops",
    color: "bg-blue-600",
  },
  {
    id: "vercel",
    name: "Vercel",
    icon: <Zap className="w-5 h-5" />,
    category: "devops",
    color: "bg-gray-800",
  },
  {
    id: "netlify",
    name: "Netlify",
    icon: <Globe className="w-5 h-5" />,
    category: "devops",
    color: "bg-teal-500",
  },
];

// Questions Data - Enhanced with more comprehensive questions
const QUESTIONS: Question[] = [
  // React Questions
  {
    id: "react-1",
    techId: "react",
    question: "How would you rate your React experience?",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: "react-2",
    techId: "react",
    question: "Which React patterns do you use most frequently?",
    type: "multiple-choice",
    options: [
      "Hooks",
      "Context API",
      "Higher-Order Components",
      "Render Props",
      "Custom Hooks",
    ],
  },
  {
    id: "react-3",
    techId: "react",
    question: "What type of React projects do you prefer building?",
    type: "multiple-choice",
    options: [
      "Single Page Applications",
      "E-commerce Sites",
      "Admin Dashboards",
      "Social Media Apps",
      "Portfolio Sites",
    ],
  },

  // Node.js Questions
  {
    id: "nodejs-1",
    techId: "nodejs",
    question: "Rate your Node.js proficiency",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: "nodejs-2",
    techId: "nodejs",
    question: "Which Node.js frameworks do you prefer?",
    type: "multiple-choice",
    options: ["Express.js", "Fastify", "Koa.js", "NestJS", "Hapi.js"],
  },
  {
    id: "nodejs-3",
    techId: "nodejs",
    question: "What do you primarily use Node.js for?",
    type: "multiple-choice",
    options: [
      "REST APIs",
      "GraphQL APIs",
      "Microservices",
      "Real-time Applications",
      "CLI Tools",
    ],
  },

  // Python Questions
  {
    id: "python-1",
    techId: "python",
    question: "Your Python experience level?",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: "python-2",
    techId: "python",
    question: "Which Python areas interest you most?",
    type: "multiple-choice",
    options: [
      "Web Development",
      "Data Science",
      "Machine Learning",
      "Automation/Scripting",
      "API Development",
    ],
  },
  {
    id: "python-3",
    techId: "python",
    question: "Which Python frameworks do you use?",
    type: "multiple-choice",
    options: ["Django", "Flask", "FastAPI", "Pyramid", "Tornado"],
  },

  // TypeScript Questions
  {
    id: "typescript-1",
    techId: "typescript",
    question: "How comfortable are you with TypeScript?",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: "typescript-2",
    techId: "typescript",
    question: "Which TypeScript features do you use most?",
    type: "multiple-choice",
    options: [
      "Type Annotations",
      "Interfaces",
      "Generics",
      "Union Types",
      "Decorators",
    ],
  },

  // HTML Questions
  {
    id: "html-1",
    techId: "html",
    question: "How would you rate your HTML experience?",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: "html-2",
    techId: "html",
    question: "Which HTML features do you work with most?",
    type: "multiple-choice",
    options: [
      "Semantic Elements",
      "Forms & Validation",
      "APIs (Canvas, Geolocation)",
      "Accessibility (ARIA)",
      "Web Components",
    ],
  },
  {
    id: "html-3",
    techId: "html",
    question: "What type of HTML projects do you build?",
    type: "multiple-choice",
    options: [
      "Landing Pages",
      "Web Applications",
      "Email Templates",
      "Documentation Sites",
      "E-commerce Sites",
    ],
  },

  // MongoDB Questions
  {
    id: "mongodb-1",
    techId: "mongodb",
    question: "Rate your MongoDB skills",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: "mongodb-2",
    techId: "mongodb",
    question: "Which MongoDB features do you work with?",
    type: "multiple-choice",
    options: [
      "Aggregation Pipeline",
      "Indexing",
      "Sharding",
      "Replication",
      "GridFS",
    ],
  },

  // Vue.js Questions
  {
    id: "vue-1",
    techId: "vue",
    question: "How experienced are you with Vue.js?",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: "vue-2",
    techId: "vue",
    question: "Which Vue.js features do you prefer?",
    type: "multiple-choice",
    options: ["Composition API", "Options API", "Vuex", "Vue Router", "Pinia"],
  },

  // Docker Questions
  {
    id: "docker-1",
    techId: "docker",
    question: "How familiar are you with Docker?",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: "docker-2",
    techId: "docker",
    question: "What do you use Docker for?",
    type: "multiple-choice",
    options: [
      "Development Environment",
      "Production Deployment",
      "CI/CD Pipelines",
      "Microservices",
      "Testing",
    ],
  },

  // AWS Questions
  {
    id: "aws-1",
    techId: "aws",
    question: "Rate your AWS experience",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: "aws-2",
    techId: "aws",
    question: "Which AWS services do you use most?",
    type: "multiple-choice",
    options: ["EC2", "S3", "Lambda", "RDS", "CloudFormation"],
  },

  // Next.js Questions
  {
    id: "nextjs-1",
    techId: "nextjs",
    question: "How comfortable are you with Next.js?",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: "nextjs-2",
    techId: "nextjs",
    question: "Which Next.js features do you use?",
    type: "multiple-choice",
    options: [
      "Server-Side Rendering",
      "Static Site Generation",
      "API Routes",
      "Image Optimization",
      "App Router",
    ],
  },
];

// Platforms Data
const PLATFORMS: Platform[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <LinkedInIcon className="w-6 h-6" />,
    description: "Professional networking and career opportunities",
    color: "bg-blue-600",
  },
  {
    id: "github",
    name: "GitHub",
    icon: <GitHubIcon className="w-6 h-6" />,
    description: "Code repositories and open source contributions",
    color: "bg-gray-800",
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: <TwitterIcon className="w-6 h-6" />,
    description: "Tech discussions and industry updates",
    color: "bg-black",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <InstagramIcon className="w-6 h-6" />,
    description: "Visual content and behind-the-scenes",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: <RedditIcon className="w-6 h-6" />,
    description: "Community discussions and knowledge sharing",
    color: "bg-orange-600",
  },
];

export default function DeveloperProfileSetup({
  user,
  onComplete,
}: DeveloperProfileSetupProps = {}) {
  console.log("🚀 DeveloperProfileSetup component is rendering!");
  console.log("👤 User prop received:", user);
  const navigate = useNavigate();

  // Add loading state to prevent blank page
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("🔧 DeveloperProfileSetup initializing...");
    setIsInitialized(true);
    console.log("✅ DeveloperProfileSetup initialized");
  }, []);

  // Update profile data when user prop changes
  useEffect(() => {
    if (user) {
      console.log("👤 Pre-populating form with user data:", user);

      // Generate a suggested username from Google name if no username exists
      const suggestedUsername =
        user.username ||
        (user.name
          ? user.name
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]/g, "")
              .substring(0, 15)
          : "");

      setProfileData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        username: suggestedUsername || prev.username,
      }));
    }
  }, [user]);

  // State declarations MUST come before any early returns
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentTechIndex, setCurrentTechIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSkillAssessmentIntro, setShowSkillAssessmentIntro] =
    useState(false);

  // Answer feedback state
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
  } | null>(null);

  // Dynamic questions from API
  const [dynamicQuestions, setDynamicQuestions] = useState<QuizQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Profile data state - pre-populate with Google data
  const [profileData, setProfileData] = useState<ProfileData>({
    username: user?.username || "",
    fullName: user?.name || "",
    bio: "",
  });

  // Username validation state
  const [usernameValidation, setUsernameValidation] = useState<{
    isChecking: boolean;
    isValid: boolean | null;
    message: string;
  }>({
    isChecking: false,
    isValid: null,
    message: "",
  });

  // Username validation function
  const validateUsername = useCallback(
    (username: string): { isValid: boolean; message: string } => {
      if (!username) {
        return { isValid: false, message: "Username is required" };
      }
      if (username.length < 3) {
        return {
          isValid: false,
          message: "Username must be at least 3 characters",
        };
      }
      if (username.length > 20) {
        return {
          isValid: false,
          message: "Username must be less than 20 characters",
        };
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return {
          isValid: false,
          message:
            "Username can only contain letters, numbers, underscore and dash",
        };
      }
      if (/^[0-9]/.test(username)) {
        return {
          isValid: false,
          message: "Username cannot start with a number",
        };
      }
      return { isValid: true, message: "Username format is valid" };
    },
    [],
  );

  // Check username availability
  const checkUsernameAvailability = useCallback(
    async (username: string): Promise<boolean> => {
      try {
        const response = await fetch(
          `/api/portfolio/check-username/${username}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.ok) {
          const data = await response.json();
          return data.available;
        }

        // Fallback: simulate check with some common usernames being taken
        const takenUsernames = [
          "admin",
          "user",
          "test",
          "demo",
          "john",
          "jane",
          "developer",
          "coder",
        ];
        return !takenUsernames.includes(username.toLowerCase());
      } catch (error) {
        console.error("Username check failed:", error);
        // Fallback: assume available if API fails
        return true;
      }
    },
    [],
  );

  // Debounced username validation
  useEffect(() => {
    if (!profileData.username) {
      setUsernameValidation({
        isChecking: false,
        isValid: false,
        message: "Username is required",
      });
      return;
    }

    const formatValidation = validateUsername(profileData.username);
    if (!formatValidation.isValid) {
      setUsernameValidation({
        isChecking: false,
        isValid: false,
        message: formatValidation.message,
      });
      return;
    }

    setUsernameValidation({
      isChecking: true,
      isValid: null,
      message: "Checking availability...",
    });

    const timeoutId = setTimeout(async () => {
      const isAvailable = await checkUsernameAvailability(profileData.username);
      setUsernameValidation({
        isChecking: false,
        isValid: isAvailable,
        message: isAvailable
          ? "Username is available!"
          : "Username is already taken",
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [profileData.username, validateUsername, checkUsernameAvailability]);

  // Handle profile data changes
  const handleProfileDataChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch dynamic questions when tech stacks are selected
  const fetchQuestionsForTechStacks = useCallback(async () => {
    if (selectedTechStacks.length === 0) return;

    setQuestionsLoading(true);
    console.log(
      "🔄 Fetching dynamic questions for tech stacks:",
      selectedTechStacks,
    );

    try {
      const allQuestions: QuizQuestion[] = [];

      // Fetch 2 questions per tech stack from API
      for (const techId of selectedTechStacks) {
        // Map tech stack IDs to question bank tech stacks
        const techStackMapping: { [key: string]: string } = {
          react: "react",
          nodejs: "node",
          python: "python",
          javascript: "javascript",
          typescript: "typescript",
          vue: "vue",
          angular: "angular",
          java: "java",
          go: "go",
          rust: "rust",
          swift: "swift",
          kotlin: "kotlin",
          php: "php",
          mongodb: "mongodb",
          postgresql: "postgresql",
          mysql: "mysql",
          redis: "redis",
          docker: "docker",
          kubernetes: "kubernetes",
          aws: "aws",
          gcp: "gcp",
        };

        const mappedTechStack = techStackMapping[techId] || techId;

        try {
          // First try to get questions from API
          const apiQuestions = await getHybridQuestions(mappedTechStack, 2, []);
          if (apiQuestions.length > 0) {
            allQuestions.push(...apiQuestions);
            console.log(
              `✅ Fetched ${apiQuestions.length} API questions for ${mappedTechStack}`,
            );
          } else {
            // Fallback to local questions
            const localQuestions = QUESTION_BANK.filter(
              (q) => q.techStack === mappedTechStack,
            ).slice(0, 2);
            allQuestions.push(...localQuestions);
            console.log(
              `📚 Using ${localQuestions.length} local questions for ${mappedTechStack}`,
            );
          }
        } catch (error) {
          console.log(
            `⚠️ API failed for ${mappedTechStack}, using local questions`,
          );
          // Fallback to local questions on error
          const localQuestions = QUESTION_BANK.filter(
            (q) => q.techStack === mappedTechStack,
          ).slice(0, 2);
          allQuestions.push(...localQuestions);
        }
      }

      // Shuffle questions for variety
      const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
      setDynamicQuestions(shuffledQuestions);
      console.log(`🎯 Total questions prepared: ${shuffledQuestions.length}`);
    } catch (error) {
      console.error("❌ Error fetching questions:", error);
      // Emergency fallback to local questions
      const fallbackQuestions = QUESTION_BANK.slice(
        0,
        selectedTechStacks.length * 2,
      );
      setDynamicQuestions(fallbackQuestions);
    } finally {
      setQuestionsLoading(false);
    }
  }, [selectedTechStacks]);

  // Fetch questions when tech stacks are selected and moving to quiz step
  useEffect(() => {
    if (
      currentStep === 2 &&
      !showSkillAssessmentIntro &&
      selectedTechStacks.length > 0 &&
      dynamicQuestions.length === 0
    ) {
      console.log("🎯 Fetching questions for quiz step...");
      fetchQuestionsForTechStacks();
    }
  }, [
    currentStep,
    showSkillAssessmentIntro,
    selectedTechStacks,
    dynamicQuestions.length,
    fetchQuestionsForTechStacks,
  ]);

  // Get questions for selected tech stacks
  const getQuestionsForSelectedTech = (): QuizQuestion[] => {
    return dynamicQuestions;
  };

  // Get current question
  const getCurrentQuestion = () => {
    const questions = getQuestionsForSelectedTech();
    return questions[currentQuestionIndex] || null;
  };

  // Calculate progress for Q&A step
  const calculateQAProgress = () => {
    const totalQuestions = getQuestionsForSelectedTech().length;
    return totalQuestions > 0
      ? (currentQuestionIndex / totalQuestions) * 100
      : 0;
  };

  // Handle tech stack selection
  const toggleTechStack = (techId: string) => {
    setSelectedTechStacks((prev) =>
      prev.includes(techId)
        ? prev.filter((id) => id !== techId)
        : [...prev, techId],
    );
  };

  // Handle platform selection
  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId],
    );
  };

  // Handle answer submission with feedback and auto-continue
  const handleAnswer = (selectedIndex: number) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion || showAnswerFeedback) return;

    const isCorrect = selectedIndex === currentQuestion.correctAnswer;

    // Store the answer feedback
    setLastAnswer({
      questionId: currentQuestion.id,
      selectedIndex,
      isCorrect,
    });

    // Store the answer
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === currentQuestion.id);
      if (existing) {
        return prev.map((a) =>
          a.questionId === currentQuestion.id
            ? { ...a, value: selectedIndex }
            : a,
        );
      }
      return [
        ...prev,
        { questionId: currentQuestion.id, value: selectedIndex },
      ];
    });

    // Show feedback immediately
    setShowAnswerFeedback(true);

    // Auto-continue after 1.5 seconds
    setTimeout(() => {
      setShowAnswerFeedback(false);
      setLastAnswer(null);
      nextQuestion();
    }, 1500);
  };

  // Auto-continue to next question
  const nextQuestion = () => {
    const questions = getQuestionsForSelectedTech();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentStep(3); // Move to platform selection
    }
  };

  // Navigation handlers
  const nextStep = () => {
    console.log(
      "🔄 nextStep called - currentStep:",
      currentStep,
      "selectedTechStacks:",
      selectedTechStacks.length,
    );
    if (currentStep === 0) {
      console.log("📝 Moving to step 1 (tech stack selection)");
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (selectedTechStacks.length > 0) {
        console.log("🎯 Showing quiz intro screen");
        setShowSkillAssessmentIntro(true);
      } else {
        console.log(
          "⏭️ Skipping quiz - no tech stacks selected, moving to step 3",
        );
        setCurrentStep(3);
      }
    } else if (currentStep === 2) {
      const questions = getQuestionsForSelectedTech();
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setCurrentStep(3);
      }
    }
  };

  const prevStep = () => {
    if (showSkillAssessmentIntro) {
      setShowSkillAssessmentIntro(false);
    } else if (currentStep === 2 && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentStep === 2 && currentQuestionIndex === 0) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      const questions = getQuestionsForSelectedTech();
      setCurrentStep(2);
      setCurrentQuestionIndex(questions.length - 1);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    console.log(
      "canProceed check - currentStep:",
      currentStep,
      "showSkillAssessmentIntro:",
      showSkillAssessmentIntro,
    );
    if (showSkillAssessmentIntro) {
      console.log("Cannot proceed: on intro screen");
      return false; // No next button on intro screen
    }
    if (currentStep === 0) {
      // Username and full name are both required, and username must be valid and available
      const canProceedStep0 =
        profileData.username &&
        profileData.fullName &&
        usernameValidation.isValid === true &&
        !usernameValidation.isChecking;
      console.log("Step 0 canProceed:", canProceedStep0, {
        username: profileData.username,
        fullName: profileData.fullName,
        usernameValid: usernameValidation.isValid,
        checking: usernameValidation.isChecking,
      });
      return canProceedStep0;
    }
    if (currentStep === 1) {
      const canProceedStep1 = selectedTechStacks.length > 0;
      console.log(
        "Step 1 canProceed:",
        canProceedStep1,
        "selectedTechStacks:",
        selectedTechStacks.length,
      );
      return canProceedStep1;
    }
    if (currentStep === 2) {
      const currentQuestion = getCurrentQuestion();
      const questions = getQuestionsForSelectedTech();

      // If no current question, it means all questions are completed
      if (!currentQuestion) {
        console.log(
          "Step 2 canProceed: All questions completed, allowing proceed",
        );
        return true;
      }

      const canProceedStep2 =
        currentQuestion &&
        answers.some((a) => a.questionId === currentQuestion.id);
      console.log(
        "Step 2 canProceed:",
        canProceedStep2,
        "currentQuestion:",
        currentQuestion?.id,
        "answers:",
        answers.length,
      );
      return canProceedStep2;
    }
    if (currentStep === 3) {
      // For the final step, allow proceeding even without platform selection for testing
      console.log(
        "Step 3 (final) - allowing proceed, selectedPlatforms:",
        selectedPlatforms.length,
      );
      return true; // Always allow completion of final step
    }
    console.log("Default: allowing proceed");
    return true;
  };

  // Render Step 0: Profile Setup
  const renderProfileStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-gray-600 text-lg">
          Let's start with your essential details
        </p>
        {user && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium text-sm">
                Pre-filled from Google
              </span>
            </div>
            <p className="text-green-600 text-xs">
              We've automatically filled in your details from your Google
              account to save you time!
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-6">
        {/* Username Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Username *
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Choose a unique username"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 pr-10 ${
                usernameValidation.isValid === false
                  ? "border-red-300 focus:border-red-500"
                  : usernameValidation.isValid === true
                    ? "border-green-300 focus:border-green-500"
                    : "border-gray-300"
              }`}
              required
              value={profileData.username}
              onChange={(e) => {
                const value = e.target.value
                  .toLowerCase()
                  .replace(/[^a-zA-Z0-9_-]/g, "");
                handleProfileDataChange("username", value);
              }}
              onBlur={() => {
                // Trigger validation when user leaves the field
                if (profileData.username) {
                  const validation = validateUsername(profileData.username);
                  if (!validation.isValid) {
                    setUsernameValidation({
                      isChecking: false,
                      isValid: false,
                      message: validation.message,
                    });
                  }
                }
              }}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {usernameValidation.isChecking && (
                <Loader className="h-4 w-4 text-gray-400 animate-spin" />
              )}
              {!usernameValidation.isChecking &&
                usernameValidation.isValid === true && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              {!usernameValidation.isChecking &&
                usernameValidation.isValid === false &&
                profileData.username && (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
            </div>
          </div>
          {usernameValidation.message && (
            <p
              className={`text-sm ${
                usernameValidation.isValid === false
                  ? "text-red-600"
                  : usernameValidation.isValid === true
                    ? "text-green-600"
                    : "text-blue-600"
              }`}
            >
              {usernameValidation.message}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Your username is required and will be displayed in your public
            profile. It must be unique.
          </p>
          {profileData.username && usernameValidation.isValid === true && (
            <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">
                Your profile will be available at:
              </p>
              <p className="text-base font-mono text-green-700 break-all">
                showwork.com/<strong>{profileData.username}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Full Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
            required
            value={profileData.fullName}
            onChange={(e) =>
              handleProfileDataChange("fullName", e.target.value)
            }
          />
        </div>

        {/* Bio Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Professional Bio
          </label>
          <textarea
            placeholder="Share a brief summary of your professional journey..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none text-gray-900 placeholder-gray-400"
            value={profileData.bio}
            onChange={(e) => handleProfileDataChange("bio", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  // Render Skill Assessment Introduction
  const renderSkillAssessmentIntro = () => {
    const questionCount = getQuestionsForSelectedTech().length;
    const selectedTechNames = selectedTechStacks
      .map((techId) => {
        const tech = TECH_STACKS.find((t) => t.id === techId);
        return tech?.name;
      })
      .filter(Boolean);

    return (
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Skill Assessment
            </h2>
            <h3 className="text-xl font-semibold text-green-600">
              Validate Your Expertise
            </h3>
          </div>

          <div className="space-y-6">
            <p className="text-gray-600 text-lg leading-relaxed">
              Thank you for sharing your tech stack. To further personalize your
              experience, we'd like to assess your skills in the technologies
              you selected.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              You'll be presented with one short question for each selected
              technology. Please answer to the best of your ability.
            </p>
          </div>
        </div>

        {/* Selected Technologies Preview */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Your Selected Technologies ({selectedTechStacks.length})
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {selectedTechStacks.map((techId) => {
              const tech = TECH_STACKS.find((t) => t.id === techId);
              if (!tech) return null;
              return (
                <div
                  key={tech.id}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${tech.color} text-white shadow-md`}
                >
                  <div className="bg-white/20 p-1 rounded-lg">{tech.icon}</div>
                  <span className="font-medium text-sm">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h5 className="text-lg font-semibold text-gray-900">
                One question at a time
              </h5>
            </div>
            <p className="text-gray-600">
              Each technology will have its own question.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h5 className="text-lg font-semibold text-gray-900">
                Tailored feedback
              </h5>
            </div>
            <p className="text-gray-600">
              Your responses help us curate content and opportunities that match
              your skills.
            </p>
          </div>
        </div>

        {/* Ready to Begin Section */}
        <div className="text-center space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h4 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to begin?
            </h4>
            <p className="text-gray-600 mb-6">Click "Start Quiz" to proceed.</p>

            <button
              onClick={() => {
                setShowSkillAssessmentIntro(false);
                setCurrentStep(2);
                setCurrentQuestionIndex(0);
                // Fetch fresh questions when starting quiz
                fetchQuestionsForTechStacks();
              }}
              disabled={questionsLoading}
              className={`group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto ${
                questionsLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1E40AF] text-white hover:bg-[#1D4ED8]"
              }`}
            >
              {questionsLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Preparing Questions...</span>
                </>
              ) : (
                <>
                  <span>Start Quiz</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </div>

          <p className="text-gray-500 text-sm">
            You can navigate back to update your tech stack at any time.
          </p>
        </div>

        {/* Progress Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-[#1E40AF] font-bold text-sm">
                  {selectedTechStacks.length * 2}
                </span>
              </div>
              <span className="text-gray-700">Questions Prepared</span>
            </div>
            <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 font-bold text-sm">0</span>
              </div>
              <span className="text-gray-500">Completed</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              🌐 Questions will be fetched fresh from our API for maximum
              variety
            </p>
          </div>
        </div>
      </div>
    );
  };
  const renderTechStackSelection = () => {
    const categories = {
      frontend: "Frontend Frameworks",
      backend: "Backend & APIs",
      language: "Programming Languages",
      mobile: "Mobile Development",
      database: "Databases",
      devops: "DevOps & Cloud",
    };

    const groupedTechStacks = Object.entries(categories).map(
      ([categoryKey, categoryName]) => ({
        name: categoryName,
        technologies: TECH_STACKS.filter(
          (tech) => tech.category === categoryKey,
        ),
      }),
    );

    return (
      <div className="space-y-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Tech Stack
          </h2>
          <p className="text-gray-600 text-lg">
            Select the technologies you work with. This helps us personalize
            your experience.
          </p>
        </div>

        <div className="space-y-8">
          {groupedTechStacks.map((category) => (
            <div key={category.name} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                {category.name}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {category.technologies.map((tech) => {
                  const isSelected = selectedTechStacks.includes(tech.id);
                  return (
                    <button
                      key={tech.id}
                      onClick={() => toggleTechStack(tech.id)}
                      className={`group relative px-6 py-3 rounded-full border-2 transition-all duration-300 hover:scale-105 transform flex items-center space-x-3 min-w-[140px] justify-center ${
                        isSelected
                          ? `${tech.color} border-white/30 shadow-lg scale-105`
                          : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-md"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-300 ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:text-gray-700"
                        }`}
                      >
                        {tech.icon}
                      </div>
                      <span
                        className={`font-medium text-sm transition-all duration-300 ${
                          isSelected
                            ? "text-white"
                            : "text-gray-700 group-hover:text-gray-800"
                        }`}
                      >
                        {tech.name}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-3 h-3 text-gray-900" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedTechStacks.length > 0 && (
          <div className="text-center bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-[#1E40AF] rounded-full animate-pulse"></div>
              <p className="text-[#1E40AF] font-semibold">
                {selectedTechStacks.length} technolog
                {selectedTechStacks.length === 1 ? "y" : "ies"} selected
              </p>
            </div>
            <p className="text-[#1E40AF] text-sm">
              🌐 Fresh questions will be fetched from our API for each
              technology
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Expected: {selectedTechStacks.length * 2} unique questions
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render Step 2: Q&A
  const renderQuestionsStep = () => {
    const currentQuestion = getCurrentQuestion();
    const questions = getQuestionsForSelectedTech();
    const currentTech = currentQuestion
      ? TECH_STACKS.find(
          (t) =>
            t.id === currentQuestion.techStack ||
            selectedTechStacks.find((ts) =>
              ts.includes(currentQuestion.techStack),
            ),
        )
      : null;
    const currentAnswer = answers.find(
      (a) => a.questionId === currentQuestion?.id,
    );
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Show loading state while questions are being fetched
    if (questionsLoading) {
      return (
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <Loader className="w-12 h-12 animate-spin text-[#1E40AF]" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Preparing Your Quiz
          </h3>
          <p className="text-gray-600">
            Fetching fresh questions from our database...
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-md mx-auto">
            <p className="text-[#1E40AF] text-sm font-medium">
              Getting {selectedTechStacks.length * 2} personalized questions for
              your selected technologies
            </p>
          </div>
        </div>
      );
    }

    if (!currentQuestion) {
      return (
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h3 className="text-2xl font-bold text-gray-900">Great job!</h3>
          <p className="text-gray-600">
            You've answered all the questions for your selected technologies.
          </p>
        </div>
      );
    }

    // Find the appropriate tech for display
    const displayTech = TECH_STACKS.find(
      (t) =>
        (currentQuestion.techStack === "react" && t.id === "react") ||
        (currentQuestion.techStack === "node" && t.id === "nodejs") ||
        (currentQuestion.techStack === "javascript" && t.id === "javascript") ||
        (currentQuestion.techStack === "python" && t.id === "python") ||
        (currentQuestion.techStack === "typescript" && t.id === "typescript") ||
        (currentQuestion.techStack === "vue" && t.id === "vue") ||
        (currentQuestion.techStack === "angular" && t.id === "angular"),
    ) || {
      id: currentQuestion.techStack,
      name:
        currentQuestion.techStack.charAt(0).toUpperCase() +
        currentQuestion.techStack.slice(1),
      icon: <Code2 className="w-4 h-4" />,
      color: "bg-blue-500",
    };

    return (
      <div className="space-y-8">
        {/* Progress Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center space-x-3 px-6 py-3 rounded-full ${displayTech.color} text-white shadow-lg`}
            >
              <div className="bg-white/20 p-2 rounded-lg">
                {displayTech.icon}
              </div>
              <span className="font-semibold text-lg">{displayTech.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[#1E40AF] font-medium">
                Question {currentQuestionIndex + 1}
              </span>
              <span className="text-gray-400">of</span>
              <span className="text-gray-700 font-medium">
                {questions.length}
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-[#1E40AF] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden">
          {/* Subtle Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-16 translate-x-16"></div>

          <div className="relative z-10 space-y-8">
            {/* Question */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-relaxed">
                {currentQuestion.question}
              </h3>
              <div className="w-16 h-1 bg-[#1E40AF] rounded-full mx-auto"></div>
            </div>

            {/* Answer Options */}
            <div className="space-y-6">
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = lastAnswer?.selectedIndex === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const isWrong =
                    showAnswerFeedback && isSelected && !isCorrect;
                  const showCorrect = showAnswerFeedback && isCorrect;

                  return (
                    <button
                      key={index}
                      onClick={() => !showAnswerFeedback && handleAnswer(index)}
                      disabled={showAnswerFeedback}
                      className={`group p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                        showAnswerFeedback
                          ? isCorrect
                            ? "border-green-500 bg-green-50 shadow-lg scale-[1.02]"
                            : isWrong
                              ? "border-red-500 bg-red-50 shadow-lg scale-[1.02]"
                              : "border-gray-200 bg-gray-100 opacity-75"
                          : isSelected
                            ? "border-[#1E40AF] bg-blue-50 shadow-lg scale-[1.02]"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:scale-[1.01]"
                      } ${showAnswerFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center space-x-4 relative z-10">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            showAnswerFeedback
                              ? isCorrect
                                ? "border-green-500 bg-green-500"
                                : isWrong
                                  ? "border-red-500 bg-red-500"
                                  : "border-gray-400 bg-gray-200"
                              : isSelected
                                ? "border-[#1E40AF] bg-[#1E40AF]"
                                : "border-gray-400 group-hover:border-gray-500"
                          }`}
                        >
                          {showAnswerFeedback ? (
                            isCorrect ? (
                              <Check className="w-3 h-3 text-white" />
                            ) : isWrong ? (
                              <X className="w-3 h-3 text-white" />
                            ) : null
                          ) : isSelected ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : null}
                        </div>
                        <span
                          className={`font-medium transition-all duration-300 ${
                            showAnswerFeedback
                              ? isCorrect
                                ? "text-green-800"
                                : isWrong
                                  ? "text-red-800"
                                  : "text-gray-500"
                              : isSelected
                                ? "text-gray-900"
                                : "text-gray-700 group-hover:text-gray-800"
                          }`}
                        >
                          {option}
                        </span>
                      </div>
                      {showAnswerFeedback && isCorrect && (
                        <div className="absolute inset-0 bg-green-100/30 rounded-2xl"></div>
                      )}
                      {showAnswerFeedback && isWrong && (
                        <div className="absolute inset-0 bg-red-100/30 rounded-2xl"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Step 3: Platform Selection
  const renderPlatformSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Connect Your Platforms
        </h2>
        <p className="text-gray-600 text-lg">
          Choose where you want to showcase your work
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 transform text-left ${
                isSelected
                  ? "border-green-500 bg-green-50 shadow-lg"
                  : "bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${platform.color} text-white`}>
                  {platform.icon}
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-[#1E40AF] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h3
                className={`font-semibold text-lg mb-2 ${
                  isSelected ? "text-gray-900" : "text-gray-800"
                }`}
              >
                {platform.name}
              </h3>
              <p
                className={`text-sm ${
                  isSelected ? "text-gray-700" : "text-gray-600"
                }`}
              >
                {platform.description}
              </p>
            </button>
          );
        })}
      </div>

      {selectedPlatforms.length > 0 && (
        <div className="text-center bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-[#1E40AF] font-medium">
            {selectedPlatforms.length} platform
            {selectedPlatforms.length === 1 ? "" : "s"} selected
          </p>
        </div>
      )}
    </div>
  );

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Loading Profile Setup
          </h2>
          <p className="text-gray-600">
            Preparing your personalized experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Progress Panel */}
      <div className="w-2/5 bg-gradient-to-br from-[#1E293B] via-[#1E40AF] to-[#0F172A] p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-white rounded-full"></div>
        </div>

        {/* Header */}
        <div className="relative z-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Profile Setup</h1>
            </div>
            <p className="text-white/80 text-lg leading-relaxed">
              Complete your developer profile in 4 easy steps to showcase your
              skills and connect with opportunities.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="relative z-10 space-y-6">
          {[
            {
              number: 1,
              title: "Basic Information",
              description: "Username and personal details",
              icon: <Users className="w-5 h-5" />,
            },
            {
              number: 2,
              title: "Tech Stack",
              description: "Select your technologies",
              icon: <Code2 className="w-5 h-5" />,
            },
            {
              number: 3,
              title: "Skill Assessment",
              description: "Quick skill evaluation",
              icon: <Brain className="w-5 h-5" />,
            },
            {
              number: 4,
              title: "Platform Selection",
              description: "Choose your platforms",
              icon: <Globe className="w-5 h-5" />,
            },
          ].map((step, index) => {
            const isActive = !showSkillAssessmentIntro && currentStep === index;
            const isCompleted =
              !showSkillAssessmentIntro && currentStep > index;
            const isIntroActive = showSkillAssessmentIntro && index === 2;

            return (
              <div key={step.number} className="flex items-start space-x-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    isCompleted
                      ? "bg-white text-[#1E40AF]"
                      : isActive || isIntroActive
                        ? "bg-white text-[#1E40AF] ring-4 ring-white/30"
                        : "bg-white/20 text-white/60"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : isActive || isIntroActive ? (
                    step.icon
                  ) : (
                    step.number
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold transition-colors duration-300 ${
                      isActive || isCompleted || isIntroActive
                        ? "text-white"
                        : "text-white/60"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      isActive || isCompleted || isIntroActive
                        ? "text-white/80"
                        : "text-white/40"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white/80 text-sm mb-2">
            <span>Progress</span>
            <span>
              {showSkillAssessmentIntro
                ? "50%"
                : currentStep === 0
                  ? "25%"
                  : currentStep === 1
                    ? "50%"
                    : currentStep === 2
                      ? `${50 + calculateQAProgress() * 0.25}%`
                      : "100%"}
            </span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{
                width: showSkillAssessmentIntro
                  ? "50%"
                  : currentStep === 0
                    ? "25%"
                    : currentStep === 1
                      ? "50%"
                      : currentStep === 2
                        ? `${50 + calculateQAProgress() * 0.25}%`
                        : "100%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {(() => {
              console.log(
                "🎨 Rendering content - showSkillAssessmentIntro:",
                showSkillAssessmentIntro,
                "currentStep:",
                currentStep,
              );
              if (showSkillAssessmentIntro) {
                console.log("📚 Rendering quiz intro screen");
                return renderSkillAssessmentIntro();
              } else if (currentStep === 0) {
                console.log("👤 Rendering profile step");
                return renderProfileStep();
              } else if (currentStep === 1) {
                console.log("⚙️ Rendering tech stack selection");
                return renderTechStackSelection();
              } else if (currentStep === 2) {
                console.log("❓ Rendering quiz questions");
                return renderQuestionsStep();
              } else if (currentStep === 3) {
                console.log("🌐 Rendering platform selection");
                return renderPlatformSelection();
              }
              return null;
            })()}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0 && !showSkillAssessmentIntro}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentStep === 0 && !showSkillAssessmentIntro
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {showSkillAssessmentIntro
                ? "Back to Tech Stack"
                : currentStep === 0
                  ? "Dashboard"
                  : "Previous"}
            </button>

            {!showSkillAssessmentIntro && (
              <button
                onClick={async () => {
                  console.log("Button clicked! Current step:", currentStep);
                  console.log("Selected platforms:", selectedPlatforms);
                  console.log("Can proceed:", canProceed());

                  if (currentStep === 3) {
                    // Handle completion - save data and redirect
                    setIsCompleting(true);
                    console.log("Starting completion process...");
                    console.log("Setup completed!", {
                      profileData,
                      selectedTechStacks,
                      answers,
                      selectedPlatforms,
                    });

                    // Go directly to dashboard for faster UX
                    console.log(
                      "🚀 Calling onComplete immediately for instant dashboard transition",
                    );
                    if (onComplete) {
                      onComplete(profileData);
                    } else {
                      navigate("/dashboard");
                    }

                    // Optionally try API call in background
                    setTimeout(async () => {
                      try {
                        // Save profile data to backend
                        const response = await fetch("/api/profile/update", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                          body: JSON.stringify({
                            username: profileData.username,
                            fullName: profileData.fullName,
                            bio: profileData.bio,
                            techStacks: selectedTechStacks,
                            platformPreferences: selectedPlatforms,
                            answers: answers,
                            profileCompleted: true,
                          }),
                        });

                        if (response.ok) {
                          const result = await response.json();
                          console.log("Background API call result:", result);
                        } else {
                          console.log(
                            "Background API call failed:",
                            response.status,
                          );
                        }
                      } catch (error) {
                        console.log("Background API call error:", error);
                      } finally {
                        setIsCompleting(false);
                      }
                    }, 100);
                  } else {
                    console.log("Going to next step...");
                    nextStep();
                  }
                }}
                disabled={!canProceed()}
                className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                  canProceed() && !isCompleting
                    ? "bg-[#1E40AF] text-white hover:bg-[#1D4ED8]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isCompleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving Profile...
                  </>
                ) : (
                  <>
                    {currentStep === 3 ? "Complete Setup" : "Continue"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Custom Slider Styles - using regular CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #1E40AF;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          }
          
          .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #1E40AF;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          }
        `,
        }}
      />
    </div>
  );
}
