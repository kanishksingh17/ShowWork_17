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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, Star, Eye, Palette, Code, Briefcase } from "lucide-react";
import {
  PortfolioTemplate,
  JobRole,
  AIRecommendation,
} from "../../types/portfolio";
import { PortfolioAIService } from "../../services/portfolio-ai-service";

interface PortfolioSelectorProps {
  userData: any;
  projects: any[];
  onTemplateSelect: (template: PortfolioTemplate) => void;
  onJobRoleDetected: (jobRole: JobRole) => void;
}

export const PortfolioSelector: React.FC<PortfolioSelectorProps> = ({
  userData,
  projects,
  onTemplateSelect,
  onJobRoleDetected,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedLayout, setSelectedLayout] = useState<string>("all");
  const [aiRecommendations, setAiRecommendations] = useState<
    AIRecommendation[]
  >([]);
  const [detectedJobRole, setDetectedJobRole] = useState<JobRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<PortfolioTemplate[]>([]);

  const industries = [
    "Technology",
    "Design",
    "Marketing",
    "Finance",
    "Healthcare",
    "Education",
    "E-commerce",
    "Gaming",
    "Media",
    "Consulting",
  ];

  const layouts = [
    { value: "modern", label: "Modern", icon: Code },
    { value: "creative", label: "Creative", icon: Palette },
    { value: "professional", label: "Professional", icon: Briefcase },
    { value: "minimal", label: "Minimal", icon: Eye },
  ];

  useEffect(() => {
    loadTemplates();
    detectJobRole();
  }, [userData, projects]);

  const loadTemplates = async () => {
    // Load portfolio templates from API or local data
    const mockTemplates: PortfolioTemplate[] = [
      {
        id: "modern-dev",
        name: "Modern Developer",
        description:
          "Clean, professional template perfect for software developers",
        jobRoles: [
          "Software Developer",
          "Full Stack Developer",
          "Frontend Developer",
        ],
        industries: ["Technology", "Software"],
        layout: "modern",
        sections: [
          {
            id: "hero",
            type: "hero",
            title: "Hero Section",
            content: "",
            isRequired: true,
            order: 1,
          },
          {
            id: "about",
            type: "about",
            title: "About Me",
            content: "",
            isRequired: true,
            order: 2,
          },
          {
            id: "projects",
            type: "projects",
            title: "Projects",
            content: "",
            isRequired: true,
            order: 3,
          },
          {
            id: "skills",
            type: "skills",
            title: "Skills",
            content: "",
            isRequired: true,
            order: 4,
          },
          {
            id: "contact",
            type: "contact",
            title: "Contact",
            content: "",
            isRequired: true,
            order: 5,
          },
        ],
        preview: "/templates/modern-dev-preview.jpg",
        isPopular: true,
      },
      {
        id: "creative-designer",
        name: "Creative Designer",
        description: "Bold, creative template for designers and artists",
        jobRoles: ["UI/UX Designer", "Graphic Designer", "Creative Director"],
        industries: ["Design", "Creative", "Marketing"],
        layout: "creative",
        sections: [
          {
            id: "hero",
            type: "hero",
            title: "Hero Section",
            content: "",
            isRequired: true,
            order: 1,
          },
          {
            id: "portfolio",
            type: "projects",
            title: "Portfolio",
            content: "",
            isRequired: true,
            order: 2,
          },
          {
            id: "about",
            type: "about",
            title: "About",
            content: "",
            isRequired: true,
            order: 3,
          },
          {
            id: "skills",
            type: "skills",
            title: "Skills",
            content: "",
            isRequired: true,
            order: 4,
          },
          {
            id: "testimonials",
            type: "testimonials",
            title: "Testimonials",
            content: "",
            isRequired: false,
            order: 5,
          },
        ],
        preview: "/templates/creative-designer-preview.jpg",
        isPopular: true,
      },
      {
        id: "professional-exec",
        name: "Executive Professional",
        description:
          "Sophisticated template for executives and senior professionals",
        jobRoles: ["CEO", "CTO", "VP Engineering", "Senior Manager"],
        industries: ["Technology", "Finance", "Consulting", "Healthcare"],
        layout: "professional",
        sections: [
          {
            id: "hero",
            type: "hero",
            title: "Executive Summary",
            content: "",
            isRequired: true,
            order: 1,
          },
          {
            id: "experience",
            type: "experience",
            title: "Experience",
            content: "",
            isRequired: true,
            order: 2,
          },
          {
            id: "achievements",
            type: "projects",
            title: "Key Achievements",
            content: "",
            isRequired: true,
            order: 3,
          },
          {
            id: "education",
            type: "education",
            title: "Education",
            content: "",
            isRequired: true,
            order: 4,
          },
          {
            id: "contact",
            type: "contact",
            title: "Contact",
            content: "",
            isRequired: true,
            order: 5,
          },
        ],
        preview: "/templates/professional-exec-preview.jpg",
        isPopular: false,
      },
    ];

    setTemplates(mockTemplates);
  };

  const detectJobRole = async () => {
    if (!userData || !projects.length) return;

    setIsLoading(true);
    try {
      const aiService = new PortfolioAIService(
        process.env.REACT_APP_OPENAI_API_KEY || "",
      );
      const jobRole = await aiService.extractJobRole(userData, projects);
      setDetectedJobRole(jobRole);
      onJobRoleDetected(jobRole);

      // Get AI recommendations
      const recommendations = await aiService.getPortfolioRecommendations(
        jobRole,
        userData,
        projects,
      );
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error("Error detecting job role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry =
      selectedIndustry === "all" ||
      template.industries.includes(selectedIndustry);
    const matchesLayout =
      selectedLayout === "all" || template.layout === selectedLayout;

    return matchesSearch && matchesIndustry && matchesLayout;
  });

  const getRecommendationForTemplate = (
    templateId: string,
  ): AIRecommendation | undefined => {
    return aiRecommendations.find((rec) => rec.templateId === templateId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Portfolio Template</h2>
        <p className="text-muted-foreground">
          AI-powered recommendations based on your profile and job goals
        </p>
      </div>

      {/* Job Role Detection */}
      {detectedJobRole && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Detected Job Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold text-green-900">
                {detectedJobRole.title}
              </h3>
              <p className="text-green-700">{detectedJobRole.description}</p>
              <div className="flex flex-wrap gap-2">
                {detectedJobRole.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLayout} onValueChange={setSelectedLayout}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Layouts</SelectItem>
            {layouts.map((layout) => (
              <SelectItem key={layout.value} value={layout.value}>
                <div className="flex items-center gap-2">
                  <layout.icon className="h-4 w-4" />
                  {layout.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            AI Recommendations
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aiRecommendations.slice(0, 3).map((recommendation) => {
              const template = templates.find(
                (t) => t.id === recommendation.templateId,
              );
              if (!template) return null;

              return (
                <Card
                  key={template.id}
                  className="border-yellow-200 bg-yellow-50 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-yellow-900">
                        {template.name}
                      </CardTitle>
                      <Badge className="bg-yellow-200 text-yellow-800">
                        {Math.round(recommendation.confidence * 100)}% Match
                      </Badge>
                    </div>
                    <CardDescription className="text-yellow-700">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-yellow-900 mb-1">
                          Why this template?
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {recommendation.reasons.map((reason, index) => (
                            <li key={index}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        onClick={() => onTemplateSelect(template)}
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                      >
                        Use This Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">All Templates</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => {
            const recommendation = getRecommendationForTemplate(template.id);
            const LayoutIcon =
              layouts.find((l) => l.value === template.layout)?.icon || Code;

            return (
              <Card
                key={template.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <LayoutIcon className="h-5 w-5" />
                      {template.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {template.isPopular && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          Popular
                        </Badge>
                      )}
                      {recommendation && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          AI Recommended
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Suitable for:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.jobRoles.slice(0, 3).map((role) => (
                          <Badge
                            key={role}
                            variant="outline"
                            className="text-xs"
                          >
                            {role}
                          </Badge>
                        ))}
                        {template.jobRoles.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.jobRoles.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Industries:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.industries.map((industry) => (
                          <Badge
                            key={industry}
                            variant="secondary"
                            className="text-xs"
                          >
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {recommendation && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium text-yellow-900 mb-1">
                          AI Insights:
                        </h4>
                        <p className="text-sm text-yellow-700">
                          {recommendation.reasons[0]}
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={() => onTemplateSelect(template)}
                      className="w-full"
                    >
                      Select Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Analyzing your profile...
          </p>
        </div>
      )}
    </div>
  );
};
