import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import {
  Palette,
  Type,
  Layout,
  Link,
  Wand2,
  Save,
  Eye,
  Download,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Globe,
} from "lucide-react";
import {
  PortfolioTemplate,
  UserPortfolio,
  PortfolioCustomization,
  SocialLink,
} from "../../types/portfolio";
import { PortfolioAIService } from "../../services/portfolio-ai-service";
import { SocialIntegrationService } from "../../services/social-integration-service";

interface PortfolioCustomizerProps {
  template: PortfolioTemplate;
  userData: any;
  projects: any[];
  jobRole: any;
  onSave: (portfolio: UserPortfolio) => void;
  onPreview: (portfolio: UserPortfolio) => void;
}

export const PortfolioCustomizer: React.FC<PortfolioCustomizerProps> = ({
  template,
  userData,
  projects,
  jobRole,
  onSave,
  onPreview,
}) => {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [customization, setCustomization] = useState<PortfolioCustomization>({
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#f59e0b",
      background: "#ffffff",
      text: "#1f2937",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    layout: {
      spacing: "normal",
      alignment: "left",
    },
    socialLinks: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  const socialPlatforms = [
    { platform: "github", label: "GitHub", icon: Github, color: "#333" },
    {
      platform: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      color: "#0077b5",
    },
    { platform: "twitter", label: "Twitter", icon: Twitter, color: "#1da1f2" },
    { platform: "email", label: "Email", icon: Mail, color: "#ea4335" },
    { platform: "website", label: "Website", icon: Globe, color: "#34a853" },
  ];

  useEffect(() => {
    initializePortfolio();
    autoFetchSocialLinks();
  }, [template, userData, projects, jobRole]);

  const initializePortfolio = () => {
    const newPortfolio: UserPortfolio = {
      id: `portfolio-${Date.now()}`,
      userId: userData.id || "current-user",
      templateId: template.id,
      jobRole: jobRole,
      sections: template.sections.map((section) => ({
        ...section,
        content: "", // Will be filled by AI
      })),
      customizations: customization,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPortfolio(newPortfolio);
  };

  const autoFetchSocialLinks = async () => {
    try {
      const socialService = new SocialIntegrationService({
        github: process.env.REACT_APP_GITHUB_TOKEN,
        linkedin: process.env.REACT_APP_LINKEDIN_TOKEN,
      });

      const socialLinks =
        await socialService.autoDetectSocialProfiles(userData);
      setCustomization((prev) => ({
        ...prev,
        socialLinks,
      }));
    } catch (error) {
      console.error("Error fetching social links:", error);
    }
  };

  const generateAIContent = async (sectionId: string) => {
    if (!portfolio) return;

    setIsGenerating(true);
    try {
      const aiService = new PortfolioAIService(
        process.env.REACT_APP_OPENAI_API_KEY || "",
      );
      const section = portfolio.sections.find((s) => s.id === sectionId);

      if (section) {
        const content = await aiService.generatePortfolioContent(
          section.type,
          jobRole,
          userData,
          projects,
        );

        setPortfolio((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            sections: prev.sections.map((s) =>
              s.id === sectionId ? { ...s, content } : s,
            ),
          };
        });
      }
    } catch (error) {
      console.error("Error generating AI content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllContent = async () => {
    if (!portfolio) return;

    setIsGenerating(true);
    try {
      const aiService = new PortfolioAIService(
        process.env.REACT_APP_OPENAI_API_KEY || "",
      );

      for (const section of portfolio.sections) {
        const content = await aiService.generatePortfolioContent(
          section.type,
          jobRole,
          userData,
          projects,
        );

        setPortfolio((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            sections: prev.sections.map((s) =>
              s.id === section.id ? { ...s, content } : s,
            ),
          };
        });
      }
    } catch (error) {
      console.error("Error generating all content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateSectionContent = (sectionId: string, content: string) => {
    setPortfolio((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId ? { ...s, content } : s,
        ),
      };
    });
  };

  const updateCustomization = (updates: Partial<PortfolioCustomization>) => {
    setCustomization((prev) => ({ ...prev, ...updates }));
    setPortfolio((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        customizations: { ...prev.customizations, ...updates },
      };
    });
  };

  const updateSocialLink = (
    platform: string,
    url: string,
    isVisible: boolean,
  ) => {
    setCustomization((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks
        .map((link) =>
          link.platform === platform ? { ...link, url, isVisible } : link,
        )
        .concat(
          !prev.socialLinks.some((link) => link.platform === platform)
            ? [
                {
                  platform: platform as any,
                  url,
                  isAutoFetched: false,
                  isVisible,
                },
              ]
            : [],
        ),
    }));
  };

  const handleSave = () => {
    if (portfolio) {
      onSave(portfolio);
    }
  };

  const handlePreview = () => {
    if (portfolio) {
      onPreview(portfolio);
    }
  };

  if (!portfolio) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customize Your Portfolio</h2>
          <p className="text-muted-foreground">
            AI-powered content generation and manual customization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Portfolio
          </Button>
        </div>
      </div>

      {/* AI Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Content Generation
          </CardTitle>
          <CardDescription>
            Let AI generate optimized content for your portfolio based on your
            job role and experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              onClick={generateAllContent}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? "Generating..." : "Generate All Content"}
            </Button>
            <Button variant="outline" disabled={isGenerating}>
              <Download className="h-4 w-4 mr-2" />
              Export Resume
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {portfolio.sections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateAIContent(section.id)}
                        disabled={isGenerating}
                      >
                        <Wand2 className="h-4 w-4 mr-1" />
                        AI Generate
                      </Button>
                      {section.isRequired && (
                        <Badge variant="secondary">Required</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor={`content-${section.id}`}>Content</Label>
                    <Textarea
                      id={`content-${section.id}`}
                      value={section.content}
                      onChange={(e) =>
                        updateSectionContent(section.id, e.target.value)
                      }
                      placeholder={`Enter your ${section.title.toLowerCase()} content...`}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Design Tab */}
        <TabsContent value="design" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Primary</Label>
                    <Input
                      id="primary-color"
                      type="color"
                      value={customization.colors.primary}
                      onChange={(e) =>
                        updateCustomization({
                          colors: {
                            ...customization.colors,
                            primary: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondary-color">Secondary</Label>
                    <Input
                      id="secondary-color"
                      type="color"
                      value={customization.colors.secondary}
                      onChange={(e) =>
                        updateCustomization({
                          colors: {
                            ...customization.colors,
                            secondary: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="accent-color">Accent</Label>
                    <Input
                      id="accent-color"
                      type="color"
                      value={customization.colors.accent}
                      onChange={(e) =>
                        updateCustomization({
                          colors: {
                            ...customization.colors,
                            accent: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="background-color">Background</Label>
                    <Input
                      id="background-color"
                      type="color"
                      value={customization.colors.background}
                      onChange={(e) =>
                        updateCustomization({
                          colors: {
                            ...customization.colors,
                            background: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fonts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="heading-font">Heading Font</Label>
                  <Select
                    value={customization.fonts.heading}
                    onValueChange={(value) =>
                      updateCustomization({
                        fonts: { ...customization.fonts, heading: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="body-font">Body Font</Label>
                  <Select
                    value={customization.fonts.body}
                    onValueChange={(value) =>
                      updateCustomization({
                        fonts: { ...customization.fonts, body: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Layout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  Layout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="spacing">Spacing</Label>
                  <Select
                    value={customization.layout.spacing}
                    onValueChange={(value: any) =>
                      updateCustomization({
                        layout: { ...customization.layout, spacing: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="alignment">Alignment</Label>
                  <Select
                    value={customization.layout.alignment}
                    onValueChange={(value: any) =>
                      updateCustomization({
                        layout: { ...customization.layout, alignment: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Social Links
              </CardTitle>
              <CardDescription>
                Manage your social media profiles and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialPlatforms.map((platform) => {
                const existingLink = customization.socialLinks.find(
                  (link) => link.platform === platform.platform,
                );
                const IconComponent = platform.icon;

                return (
                  <div
                    key={platform.platform}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent
                        className="h-5 w-5"
                        style={{ color: platform.color }}
                      />
                      <span className="font-medium">{platform.label}</span>
                      {existingLink?.isAutoFetched && (
                        <Badge variant="secondary" className="text-xs">
                          Auto-detected
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder={`Enter your ${platform.label} URL`}
                        value={existingLink?.url || ""}
                        onChange={(e) =>
                          updateSocialLink(
                            platform.platform,
                            e.target.value,
                            existingLink?.isVisible || false,
                          )
                        }
                      />
                    </div>
                    <Switch
                      checked={existingLink?.isVisible || false}
                      onCheckedChange={(checked) =>
                        updateSocialLink(
                          platform.platform,
                          existingLink?.url || "",
                          checked,
                        )
                      }
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
