import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Star,
  Code,
  Briefcase,
  Users,
  Award,
  Lightbulb,
  BarChart3,
  Zap,
  Brain,
  FileText,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'ai' | 'data' | 'backend' | 'frontend' | 'fullstack';
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  projects: number;
  certifications?: string[];
}

export interface JobRole {
  title: string;
  industry: string;
  requiredSkills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  salaryRange: string;
  location: string;
  companySize: 'startup' | 'mid' | 'enterprise';
}

export interface HealthScore {
  overall: number;
  breakdown: {
    technicalSkills: number;
    projectQuality: number;
    portfolioPresentation: number;
    industryAlignment: number;
    experience: number;
    certifications: number;
  };
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  jobMatchScore: number;
  targetRole: string;
}

export interface AIInsights {
  skillGaps: Array<{
    skill: string;
    importance: number;
    currentLevel: string;
    targetLevel: string;
    learningPath: string[];
  }>;
  projectSuggestions: Array<{
    title: string;
    description: string;
    technologies: string[];
    difficulty: string;
    estimatedTime: string;
    impact: number;
  }>;
  careerPath: Array<{
    role: string;
    timeline: string;
    requirements: string[];
    salary: string;
    probability: number;
  }>;
  marketTrends: Array<{
    technology: string;
    demand: number;
    growth: number;
    salary: string;
  }>;
}

// Mock data generator
const generateMockData = (): {
  projects: Project[];
  skills: Skill[];
  targetRole: JobRole;
  healthScore: HealthScore;
  aiInsights: AIInsights;
} => {
  const projects: Project[] = [
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce platform with React, Node.js, and MongoDB',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT'],
      category: 'fullstack',
      complexity: 'advanced',
      githubUrl: 'https://github.com/user/ecommerce',
      liveUrl: 'https://ecommerce-demo.com',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-20'),
    },
    {
      id: '2',
      title: 'AI Chatbot',
      description: 'Intelligent chatbot using OpenAI API and React',
      technologies: ['React', 'OpenAI API', 'Node.js', 'WebSocket'],
      category: 'ai',
      complexity: 'intermediate',
      githubUrl: 'https://github.com/user/ai-chatbot',
      liveUrl: 'https://chatbot-demo.com',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-15'),
    },
    {
      id: '3',
      title: 'Mobile Weather App',
      description: 'Cross-platform weather app with React Native',
      technologies: ['React Native', 'TypeScript', 'Weather API'],
      category: 'mobile',
      complexity: 'intermediate',
      githubUrl: 'https://github.com/user/weather-app',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-02-10'),
    },
  ];

  const skills: Skill[] = [
    { name: 'JavaScript', level: 'advanced', yearsOfExperience: 3, projects: 8 },
    { name: 'React', level: 'advanced', yearsOfExperience: 2, projects: 6 },
    { name: 'Node.js', level: 'intermediate', yearsOfExperience: 1, projects: 4 },
    { name: 'Python', level: 'intermediate', yearsOfExperience: 2, projects: 3 },
    { name: 'TypeScript', level: 'intermediate', yearsOfExperience: 1, projects: 5 },
    { name: 'MongoDB', level: 'intermediate', yearsOfExperience: 1, projects: 3 },
    { name: 'AWS', level: 'beginner', yearsOfExperience: 0.5, projects: 1 },
    { name: 'Docker', level: 'beginner', yearsOfExperience: 0.5, projects: 2 },
  ];

  const targetRole: JobRole = {
    title: 'AI Engineer',
    industry: 'Technology',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'AWS', 'Docker'],
    experienceLevel: 'mid',
    salaryRange: '$80,000 - $120,000',
    location: 'Remote',
    companySize: 'mid',
  };

  const healthScore: HealthScore = {
    overall: 72,
    breakdown: {
      technicalSkills: 68,
      projectQuality: 75,
      portfolioPresentation: 80,
      industryAlignment: 65,
      experience: 70,
      certifications: 45,
    },
    recommendations: [
      'Add more AI/ML projects to your portfolio',
      'Get certified in cloud platforms (AWS, GCP)',
      'Contribute to open-source AI projects',
      'Complete machine learning courses',
      'Build a comprehensive AI project with real-world data',
    ],
    strengths: [
      'Strong full-stack development skills',
      'Good project presentation',
      'Active GitHub profile',
      'Modern technology stack',
    ],
    weaknesses: [
      'Limited AI/ML experience',
      'No cloud certifications',
      'Missing advanced AI projects',
      'Limited experience with ML frameworks',
    ],
    jobMatchScore: 65,
    targetRole: 'AI Engineer',
  };

  const aiInsights: AIInsights = {
    skillGaps: [
      {
        skill: 'Machine Learning',
        importance: 95,
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        learningPath: ['Python basics', 'NumPy/Pandas', 'Scikit-learn', 'TensorFlow', 'Real projects'],
      },
      {
        skill: 'AWS',
        importance: 85,
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        learningPath: ['AWS Fundamentals', 'EC2/S3', 'Lambda', 'SageMaker', 'Certification'],
      },
      {
        skill: 'Docker',
        importance: 80,
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        learningPath: ['Docker basics', 'Containerization', 'Docker Compose', 'Production deployment'],
      },
    ],
    projectSuggestions: [
      {
        title: 'AI-Powered Recommendation System',
        description: 'Build a recommendation engine using collaborative filtering and content-based filtering',
        technologies: ['Python', 'TensorFlow', 'Pandas', 'Flask', 'PostgreSQL'],
        difficulty: 'Advanced',
        estimatedTime: '4-6 weeks',
        impact: 90,
      },
      {
        title: 'Computer Vision Project',
        description: 'Image classification or object detection project using CNN',
        technologies: ['Python', 'TensorFlow', 'OpenCV', 'Keras', 'Jupyter'],
        difficulty: 'Advanced',
        estimatedTime: '3-4 weeks',
        impact: 85,
      },
      {
        title: 'NLP Chatbot',
        description: 'Advanced chatbot with sentiment analysis and intent recognition',
        technologies: ['Python', 'NLTK', 'spaCy', 'Transformers', 'FastAPI'],
        difficulty: 'Intermediate',
        estimatedTime: '2-3 weeks',
        impact: 80,
      },
    ],
    careerPath: [
      {
        role: 'Junior AI Engineer',
        timeline: '3-6 months',
        requirements: ['Complete ML course', 'Build 2 AI projects', 'Get AWS certification'],
        salary: '$70,000 - $90,000',
        probability: 75,
      },
      {
        role: 'Mid-level AI Engineer',
        timeline: '1-2 years',
        requirements: ['Advanced ML skills', 'Production experience', 'Team leadership'],
        salary: '$90,000 - $130,000',
        probability: 60,
      },
      {
        role: 'Senior AI Engineer',
        timeline: '3-5 years',
        requirements: ['Expert ML knowledge', 'Research experience', 'Mentoring skills'],
        salary: '$130,000 - $180,000',
        probability: 40,
      },
    ],
    marketTrends: [
      { technology: 'Machine Learning', demand: 95, growth: 25, salary: '$95,000' },
      { technology: 'Deep Learning', demand: 90, growth: 30, salary: '$105,000' },
      { technology: 'Natural Language Processing', demand: 85, growth: 20, salary: '$100,000' },
      { technology: 'Computer Vision', demand: 80, growth: 22, salary: '$98,000' },
      { technology: 'AWS', demand: 88, growth: 15, salary: '$92,000' },
    ],
  };

  return { projects, skills, targetRole, healthScore, aiInsights };
};

const PortfolioHealthScore: React.FC = () => {
  const [data, setData] = useState<{
    projects: Project[];
    skills: Skill[];
    targetRole: JobRole;
    healthScore: HealthScore;
    aiInsights: AIInsights;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'skills' | 'projects' | 'insights'>('overview');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setData(generateMockData());
      setLoading(false);
    };

    loadData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-red-100 text-red-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Health Score</h2>
          <p className="text-gray-600">AI-powered analysis of your portfolio strength</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            Get AI Insights
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Overall Portfolio Health</h3>
              <p className="text-gray-600">Based on AI analysis of your projects and skills</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(data.healthScore.overall)}`}>
                {data.healthScore.overall}/100
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(data.healthScore.overall)}`}>
                {data.healthScore.overall >= 80 ? 'Excellent' : 
                 data.healthScore.overall >= 60 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(data.healthScore.breakdown).map(([key, score]) => (
          <Card key={key}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </span>
              </div>
              <Progress value={score} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Job Match Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Job Match Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{data.targetRole.title}</h4>
                <p className="text-sm text-gray-600">{data.targetRole.industry} • {data.targetRole.salaryRange}</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(data.healthScore.jobMatchScore)}`}>
                  {data.healthScore.jobMatchScore}% Match
                </div>
                <Progress value={data.healthScore.jobMatchScore} className="h-2 mt-2" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Required Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {data.targetRole.requiredSkills.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant={data.skills.some(s => s.name === skill) ? 'default' : 'secondary'}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Your Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {data.skills.slice(0, 6).map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.healthScore.strengths.map((strength, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.healthScore.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-gray-900">{weakness}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Skill Gaps to Address</h4>
              <div className="space-y-3">
                {data.aiInsights.skillGaps.map((gap, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{gap.skill}</span>
                      <Badge variant="secondary">Importance: {gap.importance}%</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Current: {gap.currentLevel} → Target: {gap.targetLevel}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Learning Path:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {gap.learningPath.map((step, stepIndex) => (
                          <Badge key={stepIndex} variant="outline" className="text-xs">
                            {step}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Suggested Projects</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.aiInsights.projectSuggestions.map((project, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">{project.title}</h5>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{project.estimatedTime}</span>
                      <Badge variant="outline">Impact: {project.impact}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Career Path</h4>
              <div className="space-y-3">
                {data.aiInsights.careerPath.map((role, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{role.role}</h5>
                      <Badge variant="secondary">Probability: {role.probability}%</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{role.timeline} • {role.salary}</p>
                    <div className="text-sm">
                      <span className="font-medium">Requirements:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {role.requirements.map((req, reqIndex) => (
                          <Badge key={reqIndex} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioHealthScore;
