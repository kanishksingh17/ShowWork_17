import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  Star,
  Target,
  Code,
  Briefcase,
  User,
  TrendingUp,
  Sparkles,
  Shield,
  Wand2,
  Eye,
  Save,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PortfolioSelector } from "../components/portfolio/PortfolioSelector";
import { PortfolioCustomizer } from "../components/portfolio/PortfolioCustomizer";
import { PortfolioPreview } from "../components/portfolio/PortfolioPreview";
import { PortfolioTemplate, UserPortfolio, JobRole } from "../types/portfolio";

type BuilderStep = "landing" | "selector" | "customizer" | "preview";

export default function PortfolioBuilder() {
  const [currentStep, setCurrentStep] = useState<BuilderStep>("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PortfolioTemplate | null>(null);
  const [detectedJobRole, setDetectedJobRole] = useState<JobRole | null>(null);
  const [userPortfolio, setUserPortfolio] = useState<UserPortfolio | null>(
    null,
  );

  // Mock user data - in real app, this would come from authentication
  const userData = {
    id: "current-user",
    name: "John Doe",
    email: "john@example.com",
    bio: "Passionate developer with 5 years of experience",
    skills: ["React", "Node.js", "Python", "TypeScript"],
    experience: "5 years",
  };

  // Mock projects data - in real app, this would come from your showcase
  const projects = [
    {
      id: "1",
      name: "E-commerce Platform",
      description:
        "Full-stack e-commerce solution built with React and Node.js",
      technologies: ["React", "Node.js", "MongoDB"],
      githubUrl: "https://github.com/johndoe/ecommerce",
      liveUrl: "https://ecommerce-demo.com",
      featured: true,
    },
    {
      id: "2",
      name: "Task Management App",
      description: "Collaborative task management tool with real-time updates",
      technologies: ["React", "Socket.io", "Express"],
      githubUrl: "https://github.com/johndoe/taskapp",
      liveUrl: "https://taskapp-demo.com",
      featured: true,
    },
  ];

  const handleStartBuilding = () => {
    setCurrentStep("selector");
  };

  const handleTemplateSelect = (template: PortfolioTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep("customizer");
  };

  const handleJobRoleDetected = (jobRole: JobRole) => {
    setDetectedJobRole(jobRole);
  };

  const handlePortfolioSave = (portfolio: UserPortfolio) => {
    setUserPortfolio(portfolio);
    setCurrentStep("preview");
  };

  const handlePortfolioPreview = (portfolio: UserPortfolio) => {
    setUserPortfolio(portfolio);
    setCurrentStep("preview");
  };

  const handleBackToCustomizer = () => {
    setCurrentStep("customizer");
  };

  const handleBackToSelector = () => {
    setCurrentStep("selector");
  };

  const handleStartOver = () => {
    setCurrentStep("landing");
    setSelectedTemplate(null);
    setDetectedJobRole(null);
    setUserPortfolio(null);
  };

  // Render different steps
  const renderStep = () => {
    switch (currentStep) {
      case "landing":
        return (
          <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Build Your Dream Portfolio with AI
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Our AI analyzes your profile, projects, and career goals to
                create a personalized portfolio that maximizes your chances of
                landing your dream job.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={handleStartBuilding}>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Start Building
                </Button>
                <Button size="lg" variant="outline">
                  View Examples
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Job Role Detection</CardTitle>
                  <CardDescription>
                    AI analyzes your skills and projects to identify your ideal
                    job role and industry.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Smart Templates</CardTitle>
                  <CardDescription>
                    Get AI-recommended portfolio templates tailored to your role
                    and industry.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Content Generation</CardTitle>
                  <CardDescription>
                    AI generates compelling content for your about section,
                    project descriptions, and more.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Auto Social Integration</CardTitle>
                  <CardDescription>
                    Automatically fetch and integrate your GitHub, LinkedIn, and
                    other social profiles.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>ATS Optimization</CardTitle>
                  <CardDescription>
                    Content is optimized for Applicant Tracking Systems to
                    maximize interview chances.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle>100% Success Rate</CardTitle>
                  <CardDescription>
                    Our AI ensures your portfolio is perfectly tailored to your
                    target role and company.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        );

      case "selector":
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleStartOver}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h2 className="text-3xl font-bold">
                Choose Your Portfolio Template
              </h2>
              <p className="text-muted-foreground">
                AI-powered recommendations based on your profile
              </p>
            </div>
            <PortfolioSelector
              userData={userData}
              projects={projects}
              onTemplateSelect={handleTemplateSelect}
              onJobRoleDetected={handleJobRoleDetected}
            />
          </div>
        );

      case "customizer":
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleBackToSelector}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
              </Button>
              <h2 className="text-3xl font-bold">Customize Your Portfolio</h2>
              <p className="text-muted-foreground">
                AI-powered content generation and manual customization
              </p>
            </div>
            {selectedTemplate && (
              <PortfolioCustomizer
                template={selectedTemplate}
                userData={userData}
                projects={projects}
                jobRole={detectedJobRole}
                onSave={handlePortfolioSave}
                onPreview={handlePortfolioPreview}
              />
            )}
          </div>
        );

      case "preview":
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleBackToCustomizer}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Customizer
              </Button>
              <h2 className="text-3xl font-bold">Portfolio Preview</h2>
              <p className="text-muted-foreground">
                Review your AI-generated portfolio
              </p>
            </div>
            {userPortfolio && <PortfolioPreview portfolio={userPortfolio} />}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">
                  AI-Powered Portfolio Builder
                </h1>
                <p className="text-muted-foreground">
                  Create your perfect portfolio in minutes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                AI-Powered
              </Badge>
              {currentStep !== "landing" && (
                <Button variant="outline" size="sm" onClick={handleStartOver}>
                  Start Over
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step Progress Indicator */}
      {currentStep !== "landing" && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center space-x-8">
              <div
                className={`flex items-center space-x-2 ${currentStep === "selector" ? "text-blue-600" : currentStep === "customizer" || currentStep === "preview" ? "text-green-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "selector" ? "bg-blue-100" : currentStep === "customizer" || currentStep === "preview" ? "bg-green-100" : "bg-gray-100"}`}
                >
                  {currentStep === "customizer" || currentStep === "preview"
                    ? "✓"
                    : "1"}
                </div>
                <span className="font-medium">Choose Template</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${currentStep === "customizer" ? "text-blue-600" : currentStep === "preview" ? "text-green-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "customizer" ? "bg-blue-100" : currentStep === "preview" ? "bg-green-100" : "bg-gray-100"}`}
                >
                  {currentStep === "preview" ? "✓" : "2"}
                </div>
                <span className="font-medium">Customize</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${currentStep === "preview" ? "text-blue-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "preview" ? "bg-blue-100" : "bg-gray-100"}`}
                >
                  3
                </div>
                <span className="font-medium">Preview</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderStep()}
    </div>
  );
}
