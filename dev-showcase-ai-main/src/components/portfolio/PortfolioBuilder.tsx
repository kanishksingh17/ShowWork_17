import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Wand2,
  Eye,
  Download,
  Share,
  Settings,
} from "lucide-react";
import {
  PortfolioTemplate,
  UserPortfolio,
  JobRole,
} from "../../types/portfolio";
import { PortfolioSelector } from "./PortfolioSelector";
import { PortfolioCustomizer } from "./PortfolioCustomizer";
import { PortfolioPreview } from "./PortfolioPreview";

interface PortfolioBuilderProps {
  userData: any;
  projects: any[];
  onPortfolioComplete: (portfolio: UserPortfolio) => void;
}

type BuilderStep = "select" | "customize" | "preview" | "complete";

export const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({
  userData,
  projects,
  onPortfolioComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<BuilderStep>("select");
  const [selectedTemplate, setSelectedTemplate] =
    useState<PortfolioTemplate | null>(null);
  const [detectedJobRole, setDetectedJobRole] = useState<JobRole | null>(null);
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      id: "select",
      title: "Choose Template",
      description: "Select your portfolio template",
    },
    {
      id: "customize",
      title: "Customize",
      description: "AI-powered content generation",
    },
    { id: "preview", title: "Preview", description: "Review your portfolio" },
    {
      id: "complete",
      title: "Complete",
      description: "Your portfolio is ready!",
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleTemplateSelect = (template: PortfolioTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep("customize");
  };

  const handleJobRoleDetected = (jobRole: JobRole) => {
    setDetectedJobRole(jobRole);
  };

  const handlePortfolioSave = (savedPortfolio: UserPortfolio) => {
    setPortfolio(savedPortfolio);
    setCurrentStep("preview");
  };

  const handlePortfolioPreview = (previewPortfolio: UserPortfolio) => {
    setPortfolio(previewPortfolio);
    setCurrentStep("preview");
  };

  const handlePortfolioComplete = () => {
    if (portfolio) {
      onPortfolioComplete(portfolio);
      setCurrentStep("complete");
    }
  };

  const handleShare = (url: string) => {
    // Implement sharing functionality
    if (navigator.share) {
      navigator.share({
        title: "My Portfolio",
        text: "Check out my portfolio!",
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      // Show toast notification
    }
  };

  const handleExport = () => {
    // Implement export functionality (PDF, HTML, etc.)
    console.log("Exporting portfolio...");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "select":
        return (
          <PortfolioSelector
            userData={userData}
            projects={projects}
            onTemplateSelect={handleTemplateSelect}
            onJobRoleDetected={handleJobRoleDetected}
          />
        );

      case "customize":
        return selectedTemplate && detectedJobRole ? (
          <PortfolioCustomizer
            template={selectedTemplate}
            userData={userData}
            projects={projects}
            jobRole={detectedJobRole}
            onSave={handlePortfolioSave}
            onPreview={handlePortfolioPreview}
          />
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              Loading customization options...
            </p>
          </div>
        );

      case "preview":
        return portfolio ? (
          <PortfolioPreview
            portfolio={portfolio}
            projects={projects}
            onEdit={() => setCurrentStep("customize")}
            onShare={handleShare}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No portfolio to preview</p>
          </div>
        );

      case "complete":
        return (
          <div className="text-center py-12 space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Portfolio Complete!</h2>
              <p className="text-muted-foreground text-lg">
                Your AI-optimized portfolio is ready to help you land your dream
                job.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => setCurrentStep("preview")}>
                <Eye className="h-5 w-5 mr-2" />
                View Portfolio
              </Button>
              <Button size="lg" variant="outline" onClick={handleExport}>
                <Download className="h-5 w-5 mr-2" />
                Export
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleShare(portfolio?.id || "")}
              >
                <Share className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="portfolio-builder min-h-screen bg-gray-50">
      {/* Progress Header */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Portfolio Builder</h1>
              <Badge variant="outline" className="flex items-center gap-1">
                <Wand2 className="h-3 w-3" />
                AI-Powered
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {currentStep !== "select" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const stepIndex = steps.findIndex(
                      (step) => step.id === currentStep,
                    );
                    if (stepIndex > 0) {
                      setCurrentStep(steps[stepIndex - 1].id as BuilderStep);
                    }
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              {currentStep === "preview" && (
                <Button size="sm" onClick={handlePortfolioComplete}>
                  Complete
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 text-sm ${
                  index <= currentStepIndex
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    index < currentStepIndex
                      ? "bg-primary text-white"
                      : index === currentStepIndex
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">{renderStepContent()}</div>

      {/* AI Insights Sidebar */}
      {detectedJobRole && currentStep !== "complete" && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
          <Card className="w-80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  Detected Role
                </h4>
                <p className="text-sm font-medium">{detectedJobRole.title}</p>
                <p className="text-xs text-muted-foreground">
                  {detectedJobRole.industry} • {detectedJobRole.experienceLevel}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  Key Skills
                </h4>
                <div className="flex flex-wrap gap-1">
                  {detectedJobRole.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {detectedJobRole.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{detectedJobRole.skills.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  Optimization Tips
                </h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Highlight {detectedJobRole.skills[0]} experience</li>
                  <li>• Showcase relevant projects</li>
                  <li>• Use industry keywords</li>
                  <li>• Quantify your achievements</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
