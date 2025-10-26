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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Wand2,
  Target,
  TrendingUp,
  Shield,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { PortfolioBuilder } from "./PortfolioBuilder";
import { PrivacyPolicy } from "../privacy/PrivacyPolicy";
import { securityManager } from "../../lib/security";
import { PortfolioAIService } from "../../services/portfolio-ai-service";
import { SocialIntegrationService } from "../../services/social-integration-service";

interface PortfolioSystemProps {
  userData: any;
  projects: any[];
}

export const PortfolioSystem: React.FC<PortfolioSystemProps> = ({
  userData,
  projects,
}) => {
  const [activeTab, setActiveTab] = useState("builder");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkPrivacyStatus();
    loadAiInsights();
  }, [userData, projects]);

  const checkPrivacyStatus = async () => {
    try {
      const accepted =
        await securityManager.secureStorageGet("privacyAccepted");
      setPrivacyAccepted(accepted || false);
    } catch (error) {
      console.error("Error checking privacy status:", error);
    }
  };

  const loadAiInsights = async () => {
    if (!userData || !projects.length) return;

    setIsLoading(true);
    try {
      const aiService = new PortfolioAIService(
        process.env.REACT_APP_OPENAI_API_KEY || "",
      );
      const jobRole = await aiService.extractJobRole(userData, projects);

      // Calculate success probability
      const successProbability = calculateSuccessProbability(
        jobRole,
        userData,
        projects,
      );

      setAiInsights({
        jobRole,
        successProbability,
        recommendations: await aiService.getPortfolioRecommendations(
          jobRole,
          userData,
          projects,
        ),
      });
    } catch (error) {
      console.error("Error loading AI insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSuccessProbability = (
    jobRole: any,
    userData: any,
    projects: any[],
  ) => {
    // AI-calculated success probability based on various factors
    let score = 0;

    // Skills match (40% weight)
    const skillsMatch = calculateSkillsMatch(jobRole.skills, userData.skills);
    score += skillsMatch * 0.4;

    // Project relevance (30% weight)
    const projectRelevance = calculateProjectRelevance(projects, jobRole);
    score += projectRelevance * 0.3;

    // Experience level (20% weight)
    const experienceMatch = calculateExperienceMatch(
      userData.experience,
      jobRole.experienceLevel,
    );
    score += experienceMatch * 0.2;

    // Industry alignment (10% weight)
    const industryAlignment = calculateIndustryAlignment(
      userData,
      jobRole.industry,
    );
    score += industryAlignment * 0.1;

    return Math.min(Math.max(score, 0), 1);
  };

  const calculateSkillsMatch = (
    requiredSkills: string[],
    userSkills: string[],
  ) => {
    const matchedSkills = requiredSkills.filter((skill) =>
      userSkills.some(
        (userSkill) =>
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase()),
      ),
    );
    return matchedSkills.length / requiredSkills.length;
  };

  const calculateProjectRelevance = (projects: any[], jobRole: any) => {
    const relevantProjects = projects.filter((project) =>
      project.technologies.some((tech: string) =>
        jobRole.skills.some((skill: string) =>
          tech.toLowerCase().includes(skill.toLowerCase()),
        ),
      ),
    );
    return relevantProjects.length / projects.length;
  };

  const calculateExperienceMatch = (
    userExperience: string,
    requiredLevel: string,
  ) => {
    const experienceMap = {
      entry: 0,
      mid: 0.5,
      senior: 0.8,
      lead: 1,
    };

    const userLevel = userExperience.includes("5+")
      ? 0.8
      : userExperience.includes("3+")
        ? 0.6
        : userExperience.includes("1+")
          ? 0.4
          : 0.2;

    const requiredLevelValue =
      experienceMap[requiredLevel as keyof typeof experienceMap] || 0.5;

    return Math.min(userLevel / requiredLevelValue, 1);
  };

  const calculateIndustryAlignment = (
    userData: any,
    targetIndustry: string,
  ) => {
    // Simple industry alignment calculation
    const userIndustry = userData.industry || "Technology";
    return userIndustry.toLowerCase() === targetIndustry.toLowerCase()
      ? 1
      : 0.5;
  };

  const handlePrivacyAccept = async () => {
    try {
      await securityManager.secureStorageSet("privacyAccepted", true);
      setPrivacyAccepted(true);
    } catch (error) {
      console.error("Error accepting privacy policy:", error);
    }
  };

  const handlePortfolioComplete = async (portfolio: any) => {
    try {
      // Save portfolio securely
      await securityManager.secureStorageSet("userPortfolio", portfolio);

      // Track success metrics
      const metrics = {
        portfolioCreated: true,
        timestamp: new Date().toISOString(),
        jobRole: portfolio.jobRole?.title,
        templateUsed: portfolio.templateId,
      };

      await securityManager.secureStorageSet("portfolioMetrics", metrics);

      console.log("Portfolio completed and saved securely");
    } catch (error) {
      console.error("Error saving portfolio:", error);
    }
  };

  if (!privacyAccepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto p-6">
          <PrivacyPolicy />
          <div className="text-center mt-8">
            <Button size="lg" onClick={handlePrivacyAccept}>
              <CheckCircle className="h-5 w-5 mr-2" />
              Accept Privacy Policy & Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">AI Portfolio System</h1>
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Secure
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="builder">Portfolio Builder</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Portfolio Builder Tab */}
          <TabsContent value="builder">
            <PortfolioBuilder
              userData={userData}
              projects={projects}
              onPortfolioComplete={handlePortfolioComplete}
            />
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  Analyzing your profile...
                </p>
              </div>
            ) : aiInsights ? (
              <div className="space-y-6">
                {/* Success Probability */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <TrendingUp className="h-5 w-5" />
                      Job Application Success Probability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-green-600">
                        {Math.round(aiInsights.successProbability * 100)}%
                      </div>
                      <p className="text-green-700">
                        Based on your profile, skills, and projects, you have a{" "}
                        <strong>
                          {Math.round(aiInsights.successProbability * 100)}%
                        </strong>{" "}
                        chance of landing your target role:{" "}
                        <strong>{aiInsights.jobRole.title}</strong>
                      </p>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${aiInsights.successProbability * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Role Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Detected Job Role
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-semibold mb-2">Role Details</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Title:</strong> {aiInsights.jobRole.title}
                          </p>
                          <p>
                            <strong>Industry:</strong>{" "}
                            {aiInsights.jobRole.industry}
                          </p>
                          <p>
                            <strong>Level:</strong>{" "}
                            {aiInsights.jobRole.experienceLevel}
                          </p>
                          <p>
                            <strong>Description:</strong>{" "}
                            {aiInsights.jobRole.description}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {aiInsights.jobRole.skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription>
                      Personalized suggestions to maximize your job application
                      success
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiInsights.recommendations
                        .slice(0, 3)
                        .map((rec: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">
                                Template: {rec.templateId}
                              </h4>
                              <Badge className="bg-blue-100 text-blue-800">
                                {Math.round(rec.confidence * 100)}% Match
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm">
                                Why this template?
                              </h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {rec.reasons.map(
                                  (reason: string, i: number) => (
                                    <li key={i}>• {reason}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No AI Insights Available
                  </h3>
                  <p className="text-muted-foreground">
                    Please ensure you have provided your profile data and
                    projects.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Portfolio Performance
                </CardTitle>
                <CardDescription>
                  Track your portfolio's effectiveness and optimization
                  opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-muted-foreground">
                      ATS Compatibility
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      8.5/10
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Content Quality
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      92%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Job Match Score
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Content Optimization
                    </h4>
                    <p className="text-sm text-blue-700">
                      Add more quantifiable achievements to your project
                      descriptions. Use numbers and metrics to demonstrate
                      impact.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Skills Enhancement
                    </h4>
                    <p className="text-sm text-green-700">
                      Consider adding certifications or projects in React and
                      TypeScript to better match your target role requirements.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      Social Integration
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Update your LinkedIn profile to match your portfolio
                      content for better consistency across platforms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security Settings</CardTitle>
                <CardDescription>
                  Manage your data privacy and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Data Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      All your data is encrypted before storage
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Auto Social Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically fetch and integrate social profiles
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Analytics Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Help us improve by sharing anonymous usage data
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Opt-in
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline">Export My Data</Button>
                  <Button variant="outline">Download Portfolio</Button>
                  <Button variant="destructive">Delete All Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
