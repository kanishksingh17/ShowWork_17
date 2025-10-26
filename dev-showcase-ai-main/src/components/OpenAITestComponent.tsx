// OpenAI API Test Component - Test your API key integration
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  OpenAIClient,
  PortfolioContentGenerator,
} from "../services/openaiService";
import { getOpenAIKey } from "../config/apiConfig";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Code,
  Palette,
  FileText,
  Search,
} from "lucide-react";

const OpenAITestComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [testInput, setTestInput] = useState(
    "Senior Software Engineer with React and Node.js expertise",
  );

  const runOpenAITests = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults(null);

    try {
      const apiKey = getOpenAIKey();
      console.log("Using OpenAI API Key:", apiKey.substring(0, 20) + "...");

      const generator = new PortfolioContentGenerator(apiKey);

      // Test 1: Professional Bio Generation
      console.log("Testing Professional Bio Generation...");
      const bio = await generator.generateProfessionalBio({
        name: "John Doe",
        title: "Senior Software Engineer",
        skills: ["React", "Node.js", "TypeScript"],
        experience: [{ duration: "5 years" }],
      });

      // Test 2: Project Description Generation
      console.log("Testing Project Description Generation...");
      const projectDesc = await generator.generateProjectDescription({
        name: "E-commerce Platform",
        technologies: ["React", "Node.js", "MongoDB"],
        description: "Full-stack e-commerce solution",
        stars: 45,
        forks: 12,
      });

      // Test 3: SEO Metadata Generation
      console.log("Testing SEO Metadata Generation...");
      const seoMetadata = await generator.generateSEOMetadata({
        name: "John Doe",
        title: "Senior Software Engineer",
        skills: ["React", "Node.js", "TypeScript"],
        location: "San Francisco, CA",
      });

      // Test 4: Color Palette Generation
      console.log("Testing Color Palette Generation...");
      const colorPalette = await generator.generateColorPalette("developer");

      // Test 5: Call-to-Action Generation
      console.log("Testing Call-to-Action Generation...");
      const ctaText = await generator.generateCallToAction("developer");

      setTestResults({
        bio,
        projectDesc,
        seoMetadata,
        colorPalette,
        ctaText,
        timestamp: new Date().toISOString(),
      });

      console.log("All OpenAI tests completed successfully!");
    } catch (error) {
      console.error("OpenAI API test failed:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testCustomInput = async () => {
    if (!testInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiKey = getOpenAIKey();
      const generator = new PortfolioContentGenerator(apiKey);

      const bio = await generator.generateProfessionalBio({
        name: "Custom User",
        title: testInput,
        skills: ["Various"],
        experience: [],
      });

      setTestResults({
        customBio: bio,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            OpenAI API Integration Test
          </h1>
          <p className="text-[#94A3B8] text-lg">
            Test your OpenAI API key integration with the portfolio generation
            system
          </p>
        </div>

        {/* API Key Status */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Code className="w-5 h-5 mr-2" />
              API Key Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94A3B8]">
                  OpenAI API Key:{" "}
                  <code className="bg-black/20 px-2 py-1 rounded">
                    {getOpenAIKey().substring(0, 20)}...
                  </code>
                </p>
                <p className="text-sm text-[#94A3B8] mt-1">
                  Status: {getOpenAIKey() ? "Configured" : "Not Found"}
                </p>
              </div>
              <Badge variant={getOpenAIKey() ? "default" : "destructive"}>
                {getOpenAIKey() ? "Ready" : "Error"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Full API Test Suite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#94A3B8] mb-4">
                Run comprehensive tests for all OpenAI API endpoints used in
                portfolio generation.
              </p>
              <Button
                onClick={runOpenAITests}
                disabled={isLoading}
                className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing API...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Run Full Test Suite
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Custom Input Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#94A3B8] mb-4">
                Test with your own professional title or description.
              </p>
              <Input
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Enter your professional title..."
                className="mb-4 bg-white/10 border-white/20 text-white"
              />
              <Button
                onClick={testCustomInput}
                disabled={isLoading || !testInput.trim()}
                className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Test Custom Input
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 bg-red-500/10 backdrop-blur-sm border-red-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-400">
                <XCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">API Error:</span>
              </div>
              <p className="text-red-300 mt-2">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResults && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Test Results</h2>

            {/* Professional Bio */}
            {testResults.bio && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Professional Bio Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#94A3B8]">{testResults.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Project Description */}
            {testResults.projectDesc && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Project Description Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#94A3B8]">{testResults.projectDesc}</p>
                </CardContent>
              </Card>
            )}

            {/* SEO Metadata */}
            {testResults.seoMetadata && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    SEO Metadata Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Title:</strong>{" "}
                      {testResults.seoMetadata.metaTitle}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Description:</strong>{" "}
                      {testResults.seoMetadata.metaDescription}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Keywords:</strong>{" "}
                      {testResults.seoMetadata.keywords.join(", ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Color Palette */}
            {testResults.colorPalette && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Color Palette Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    {testResults.colorPalette.map(
                      (color: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className="w-8 h-8 rounded border-2 border-white/20"
                            style={{ backgroundColor: color }}
                          />
                          <code className="text-[#94A3B8] text-sm">
                            {color}
                          </code>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call-to-Action */}
            {testResults.ctaText && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Call-to-Action Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Primary CTA:</strong>{" "}
                      {testResults.ctaText.primaryCTA}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Secondary CTA:</strong>{" "}
                      {testResults.ctaText.secondaryCTA}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Contact CTA:</strong>{" "}
                      {testResults.ctaText.contactCTA}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom Bio */}
            {testResults.customBio && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Custom Input Bio Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#94A3B8]">{testResults.customBio}</p>
                </CardContent>
              </Card>
            )}

            {/* Success Message */}
            <Card className="bg-green-500/10 backdrop-blur-sm border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    All tests completed successfully!
                  </span>
                </div>
                <p className="text-green-300 mt-2">
                  Your OpenAI API key is working correctly. Portfolio generation
                  is ready to use.
                </p>
                <p className="text-green-300 text-sm mt-1">
                  Test completed at:{" "}
                  {new Date(testResults.timestamp).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenAITestComponent;
