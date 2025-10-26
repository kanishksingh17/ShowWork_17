import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Sparkles,
  User,
  Briefcase,
  Code,
  Palette,
  Globe,
  Cloud,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
  Rocket,
  Eye,
  Download,
  Share2,
} from "lucide-react";

interface UserData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
}

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
}

export default function PortfolioGeneration() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    title: "",
    bio: "",
    skills: [],
    projects: [],
    experience: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    {
      id: "ai-content",
      title: "AI Content Generation",
      description:
        "Generating professional bio, SEO metadata, and color palette",
      status: "pending",
      progress: 0,
    },
    {
      id: "template-selection",
      title: "Template Selection",
      description: "Selecting optimal template based on your profile",
      status: "pending",
      progress: 0,
    },
    {
      id: "asset-building",
      title: "Asset Building",
      description: "Building HTML, CSS, and JavaScript files",
      status: "pending",
      progress: 0,
    },
    {
      id: "s3-upload",
      title: "S3 Upload",
      description: "Uploading assets to AWS S3 storage",
      status: "pending",
      progress: 0,
    },
    {
      id: "vercel-deploy",
      title: "Vercel Deployment",
      description: "Deploying to Vercel with custom domain",
      status: "pending",
      progress: 0,
    },
  ]);
  const [generatedPortfolio, setGeneratedPortfolio] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if we have portfolio data from navigation
  useEffect(() => {
    if (location.state?.portfolio) {
      setUserData({
        name: location.state.portfolio.name || "",
        title: "Portfolio Owner",
        bio: location.state.portfolio.description || "",
        skills: ["React", "TypeScript", "Node.js"],
        projects: [],
        experience: [],
      });
    }
  }, [location.state]);

  const handleInputChange = (field: keyof UserData, value: any) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !userData.skills.includes(skill)) {
      setUserData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setUserData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleProjectAdd = () => {
    setUserData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: "",
          description: "",
          technologies: [],
        },
      ],
    }));
  };

  const handleProjectUpdate = (index: number, field: string, value: any) => {
    setUserData((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project,
      ),
    }));
  };

  const simulateGenerationStep = async (stepIndex: number) => {
    const step = generationSteps[stepIndex];

    // Update step status
    setGenerationSteps((prev) =>
      prev.map((s, i) =>
        i === stepIndex ? { ...s, status: "processing", progress: 0 } : s,
      ),
    );

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setGenerationSteps((prev) =>
        prev.map((s, i) => (i === stepIndex ? { ...s, progress } : s)),
      );
    }

    // Mark as completed
    setGenerationSteps((prev) =>
      prev.map((s, i) =>
        i === stepIndex ? { ...s, status: "completed", progress: 100 } : s,
      ),
    );
  };

  const handleGeneratePortfolio = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Step 1: AI Content Generation
      await simulateGenerationStep(0);

      // Step 2: Template Selection
      await simulateGenerationStep(1);

      // Step 3: Asset Building
      await simulateGenerationStep(2);

      // Step 4: S3 Upload
      await simulateGenerationStep(3);

      // Step 5: Vercel Deployment
      await simulateGenerationStep(4);

      // Generate mock portfolio result
      const result = {
        id: `portfolio_${Date.now()}`,
        name: userData.name,
        url: `https://portfolio-showwork.vercel.app/p/${Date.now()}`,
        customUrl: `https://${userData.name.toLowerCase().replace(/\s+/g, "")}.dev`,
        deploymentId: `deploy_${Date.now()}`,
        performance: {
          pageSpeed: 95,
          loadTime: 1.2,
          bundleSize: 280,
        },
        analytics: {
          trackingId: `sw_${Date.now()}`,
          customEvents: [
            "portfolio_view",
            "project_click",
            "contact_form_submit",
          ],
        },
      };

      setGeneratedPortfolio(result);
    } catch (error) {
      setError("Portfolio generation failed. Please try again.");
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditInBuilder = () => {
    if (generatedPortfolio) {
      navigate("/portfolio/builder", {
        state: {
          portfolio: {
            ...generatedPortfolio,
            components: [],
            settings: {
              width: 1200,
              height: 800,
              backgroundColor: "#ffffff",
              padding: 20,
              margin: 0,
            },
          },
        },
      });
    }
  };

  const handleDeployToS3 = () => {
    // Navigate to S3 deployment
    navigate("/test/s3");
  };

  const handleDeployToVercel = () => {
    // Navigate to Vercel deployment
    navigate("/test/vercel");
  };

  const steps = [
    {
      id: "user-info",
      title: "Personal Information",
      icon: User,
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              value={userData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="John Doe"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Title
            </label>
            <Input
              value={userData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Senior Software Engineer"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <Textarea
              value={userData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full"
            />
          </div>
        </div>
      ),
    },
    {
      id: "skills",
      title: "Skills & Technologies",
      icon: Code,
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Skills
            </label>
            <div className="flex space-x-2">
              <Input
                placeholder="React, TypeScript, Node.js..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const skills = (e.target as HTMLInputElement).value
                      .split(",")
                      .map((s) => s.trim());
                    skills.forEach((skill) => handleSkillAdd(skill));
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector(
                    'input[placeholder*="React"]',
                  ) as HTMLInputElement;
                  if (input?.value) {
                    const skills = input.value.split(",").map((s) => s.trim());
                    skills.forEach((skill) => handleSkillAdd(skill));
                    input.value = "";
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleSkillRemove(skill)}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "projects",
      title: "Projects",
      icon: Briefcase,
      component: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Your Projects</h3>
            <Button onClick={handleProjectAdd} size="sm">
              Add Project
            </Button>
          </div>

          <div className="space-y-4">
            {userData.projects.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">
                    Project {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    value={project.name}
                    onChange={(e) =>
                      handleProjectUpdate(index, "name", e.target.value)
                    }
                    placeholder="Project Name"
                  />
                  <Textarea
                    value={project.description}
                    onChange={(e) =>
                      handleProjectUpdate(index, "description", e.target.value)
                    }
                    placeholder="Project Description"
                    rows={3}
                  />
                  <Input
                    value={project.technologies.join(", ")}
                    onChange={(e) =>
                      handleProjectUpdate(
                        index,
                        "technologies",
                        e.target.value.split(",").map((t) => t.trim()),
                      )
                    }
                    placeholder="Technologies (comma-separated)"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/portfolio")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Portfolio Generator
              </h1>
              <p className="text-sm text-gray-500">
                Create a professional portfolio with AI assistance
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>AI Powered</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!isGenerating && !generatedPortfolio ? (
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;

                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isActive
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "bg-white border-gray-300 text-gray-500"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-16 h-0.5 ${
                            isCompleted ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {steps[currentStep].title}
                </h2>
                <p className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>

            {/* Step Content */}
            <Card>
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {steps[currentStep].component}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              <div className="flex items-center space-x-3">
                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleGeneratePortfolio}
                    disabled={!userData.name || !userData.title}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Portfolio</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      setCurrentStep(
                        Math.min(steps.length - 1, currentStep + 1),
                      )
                    }
                    disabled={currentStep === steps.length - 1}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Your Portfolio</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {generationSteps.map((step, index) => (
                  <div key={step.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {step.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : step.status === "processing" ? (
                          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        ) : step.status === "error" ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {step.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {step.progress}%
                      </span>
                    </div>
                    <Progress value={step.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : generatedPortfolio ? (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Portfolio Generated Successfully!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Portfolio Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Portfolio URL
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a
                        href={generatedPortfolio.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {generatedPortfolio.url}
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Performance
                    </h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>PageSpeed Score:</span>
                        <span className="font-medium">
                          {generatedPortfolio.performance.pageSpeed}/100
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Load Time:</span>
                        <span className="font-medium">
                          {generatedPortfolio.performance.loadTime}s
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bundle Size:</span>
                        <span className="font-medium">
                          {generatedPortfolio.performance.bundleSize} KB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleEditInBuilder}
                    className="flex items-center space-x-2"
                  >
                    <Palette className="w-4 h-4" />
                    <span>Edit in Builder</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(generatedPortfolio.url, "_blank")
                    }
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview Live</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleDeployToS3}
                    className="flex items-center space-x-2"
                  >
                    <Cloud className="w-4 h-4" />
                    <span>Deploy to S3</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleDeployToVercel}
                    className="flex items-center space-x-2"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>Deploy to Vercel</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      navigator.share?.({
                        title: generatedPortfolio.name,
                        url: generatedPortfolio.url,
                      })
                    }
                    className="flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                </div>

                {/* Analytics Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Analytics Tracking
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tracking ID:{" "}
                    <code className="bg-gray-200 px-1 rounded">
                      {generatedPortfolio.analytics.trackingId}
                    </code>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Events:{" "}
                    {generatedPortfolio.analytics.customEvents.join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mt-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <h3 className="font-medium text-red-900">
                      Generation Failed
                    </h3>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setError(null);
                      setIsGenerating(false);
                      setGeneratedPortfolio(null);
                      setGenerationSteps((prev) =>
                        prev.map((step) => ({
                          ...step,
                          status: "pending",
                          progress: 0,
                        })),
                      );
                    }}
                    className="text-red-600 border-red-300 hover:bg-red-100"
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
