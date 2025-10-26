import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
  Cloud,
  Rocket,
  Brain,
  Database,
  Globe,
  Settings,
  TestTube,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Code,
  Palette,
  Layers,
  Box,
  Sparkles,
  Target,
  TrendingUp,
  Activity,
  Wifi,
  WifiOff,
  Clock,
  Star,
  Award,
  Shield,
  Key,
  Lock,
  Unlock,
} from "lucide-react";

interface APITest {
  id: string;
  name: string;
  description: string;
  provider: "openai" | "aws" | "vercel";
  status: "pending" | "testing" | "success" | "error";
  progress: number;
  result?: any;
  error?: string;
  duration?: number;
  lastTested?: Date;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: APITest[];
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
}

export default function APIIntegrationTest() {
  const navigate = useNavigate();
  const [activeSuite, setActiveSuite] = useState<string>("all");
  const [isRunning, setIsRunning] = useState(false);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      id: "openai",
      name: "OpenAI Integration",
      description: "Test AI content generation and processing",
      status: "pending",
      progress: 0,
      tests: [
        {
          id: "openai-connection",
          name: "API Connection",
          description: "Test OpenAI API connectivity and authentication",
          provider: "openai",
          status: "pending",
          progress: 0,
        },
        {
          id: "openai-content-generation",
          name: "Content Generation",
          description: "Generate portfolio content using GPT models",
          provider: "openai",
          status: "pending",
          progress: 0,
        },
        {
          id: "openai-image-generation",
          name: "Image Generation",
          description: "Generate portfolio images using DALL-E",
          provider: "openai",
          status: "pending",
          progress: 0,
        },
        {
          id: "openai-embeddings",
          name: "Text Embeddings",
          description: "Generate text embeddings for search and similarity",
          provider: "openai",
          status: "pending",
          progress: 0,
        },
      ],
    },
    {
      id: "aws",
      name: "AWS S3 Integration",
      description: "Test cloud storage and asset management",
      status: "pending",
      progress: 0,
      tests: [
        {
          id: "s3-connection",
          name: "S3 Connection",
          description: "Test AWS S3 connectivity and credentials",
          provider: "aws",
          status: "pending",
          progress: 0,
        },
        {
          id: "s3-bucket-operations",
          name: "Bucket Operations",
          description: "Create, list, and manage S3 buckets",
          provider: "aws",
          status: "pending",
          progress: 0,
        },
        {
          id: "s3-upload-download",
          name: "File Upload/Download",
          description: "Upload and download files to/from S3",
          provider: "aws",
          status: "pending",
          progress: 0,
        },
        {
          id: "s3-static-hosting",
          name: "Static Website Hosting",
          description: "Configure S3 for static website hosting",
          provider: "aws",
          status: "pending",
          progress: 0,
        },
        {
          id: "s3-cdn",
          name: "CloudFront CDN",
          description: "Test CloudFront CDN integration",
          provider: "aws",
          status: "pending",
          progress: 0,
        },
      ],
    },
    {
      id: "vercel",
      name: "Vercel Integration",
      description: "Test deployment and hosting platform",
      status: "pending",
      progress: 0,
      tests: [
        {
          id: "vercel-connection",
          name: "API Connection",
          description: "Test Vercel API connectivity and authentication",
          provider: "vercel",
          status: "pending",
          progress: 0,
        },
        {
          id: "vercel-project-creation",
          name: "Project Creation",
          description: "Create and manage Vercel projects",
          provider: "vercel",
          status: "pending",
          progress: 0,
        },
        {
          id: "vercel-deployment",
          name: "Deployment",
          description: "Deploy applications to Vercel",
          provider: "vercel",
          status: "pending",
          progress: 0,
        },
        {
          id: "vercel-domains",
          name: "Custom Domains",
          description: "Configure custom domains and SSL",
          provider: "vercel",
          status: "pending",
          progress: 0,
        },
        {
          id: "vercel-analytics",
          name: "Analytics",
          description: "Test Vercel Analytics integration",
          provider: "vercel",
          status: "pending",
          progress: 0,
        },
      ],
    },
  ]);

  const [overallStats, setOverallStats] = useState({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    successRate: 0,
    averageResponseTime: 0,
  });

  // Simulate API test execution
  const runTest = async (suiteId: string, testId: string): Promise<void> => {
    return new Promise((resolve) => {
      const test = testSuites
        .find((s) => s.id === suiteId)
        ?.tests.find((t) => t.id === testId);
      if (!test) return resolve();

      // Update test status to testing
      setTestSuites((prev) =>
        prev.map((suite) =>
          suite.id === suiteId
            ? {
                ...suite,
                tests: suite.tests.map((t) =>
                  t.id === testId
                    ? { ...t, status: "testing", progress: 0 }
                    : t,
                ),
              }
            : suite,
        ),
      );

      // Simulate test progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Simulate test result
          const success = Math.random() > 0.2; // 80% success rate
          const duration = Math.random() * 2000 + 500; // 500-2500ms

          setTestSuites((prev) =>
            prev.map((suite) =>
              suite.id === suiteId
                ? {
                    ...suite,
                    tests: suite.tests.map((t) =>
                      t.id === testId
                        ? {
                            ...t,
                            status: success ? "success" : "error",
                            progress: 100,
                            duration,
                            result: success
                              ? { message: "Test passed successfully" }
                              : null,
                            error: success
                              ? undefined
                              : "Test failed: Connection timeout",
                            lastTested: new Date(),
                          }
                        : t,
                    ),
                  }
                : suite,
            ),
          );

          resolve();
        } else {
          setTestSuites((prev) =>
            prev.map((suite) =>
              suite.id === suiteId
                ? {
                    ...suite,
                    tests: suite.tests.map((t) =>
                      t.id === testId ? { ...t, progress } : t,
                    ),
                  }
                : suite,
            ),
          );
        }
      }, 100);
    });
  };

  const runTestSuite = async (suiteId: string): Promise<void> => {
    const suite = testSuites.find((s) => s.id === suiteId);
    if (!suite) return;

    // Update suite status
    setTestSuites((prev) =>
      prev.map((s) =>
        s.id === suiteId ? { ...s, status: "running", progress: 0 } : s,
      ),
    );

    // Run all tests in the suite
    for (let i = 0; i < suite.tests.length; i++) {
      await runTest(suiteId, suite.tests[i].id);

      // Update suite progress
      const progress = ((i + 1) / suite.tests.length) * 100;
      setTestSuites((prev) =>
        prev.map((s) => (s.id === suiteId ? { ...s, progress } : s)),
      );
    }

    // Mark suite as completed
    setTestSuites((prev) =>
      prev.map((s) =>
        s.id === suiteId ? { ...s, status: "completed", progress: 100 } : s,
      ),
    );
  };

  const runAllTests = async (): Promise<void> => {
    setIsRunning(true);

    for (const suite of testSuites) {
      await runTestSuite(suite.id);
    }

    setIsRunning(false);
  };

  const resetTests = (): void => {
    setTestSuites((prev) =>
      prev.map((suite) => ({
        ...suite,
        status: "pending",
        progress: 0,
        tests: suite.tests.map((test) => ({
          ...test,
          status: "pending",
          progress: 0,
          result: undefined,
          error: undefined,
          duration: undefined,
          lastTested: undefined,
        })),
      })),
    );
  };

  // Update overall stats
  useEffect(() => {
    const allTests = testSuites.flatMap((suite) => suite.tests);
    const totalTests = allTests.length;
    const passedTests = allTests.filter(
      (test) => test.status === "success",
    ).length;
    const failedTests = allTests.filter(
      (test) => test.status === "error",
    ).length;
    const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    const completedTests = allTests.filter((test) => test.duration);
    const averageResponseTime =
      completedTests.length > 0
        ? completedTests.reduce((sum, test) => sum + (test.duration || 0), 0) /
          completedTests.length
        : 0;

    setOverallStats({
      totalTests,
      passedTests,
      failedTests,
      successRate,
      averageResponseTime,
    });
  }, [testSuites]);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "openai":
        return Brain;
      case "aws":
        return Cloud;
      case "vercel":
        return Rocket;
      default:
        return Settings;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "testing":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle;
      case "error":
        return AlertCircle;
      case "testing":
        return Loader2;
      default:
        return Clock;
    }
  };

  const filteredSuites =
    activeSuite === "all"
      ? testSuites
      : testSuites.filter((suite) => suite.id === activeSuite);

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
                API Integration Test Suite
              </h1>
              <p className="text-sm text-gray-500">
                Test and validate all external API integrations
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={resetTests}
              disabled={isRunning}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Tests</span>
            </Button>

            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4" />
              )}
              <span>{isRunning ? "Running Tests..." : "Run All Tests"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TestTube className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overallStats.totalTests}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {overallStats.passedTests}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {overallStats.failedTests}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {overallStats.successRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Response</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {overallStats.averageResponseTime.toFixed(0)}ms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Suite Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeSuite === "all" ? "default" : "outline"}
            onClick={() => setActiveSuite("all")}
            className="flex items-center space-x-2"
          >
            <Layers className="w-4 h-4" />
            <span>All Tests</span>
          </Button>

          {testSuites.map((suite) => {
            const Icon = getProviderIcon(suite.id);
            return (
              <Button
                key={suite.id}
                variant={activeSuite === suite.id ? "default" : "outline"}
                onClick={() => setActiveSuite(suite.id)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{suite.name}</span>
                <Badge variant="secondary" className="ml-1">
                  {suite.tests.length}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Test Suites */}
        <div className="space-y-6">
          {filteredSuites.map((suite) => {
            const ProviderIcon = getProviderIcon(suite.id);

            return (
              <Card key={suite.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <ProviderIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{suite.name}</CardTitle>
                        <p className="text-sm text-gray-500">
                          {suite.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(suite.status)}>
                        {suite.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runTestSuite(suite.id)}
                        disabled={isRunning}
                        className="flex items-center space-x-1"
                      >
                        <TestTube className="w-3 h-3" />
                        <span>Run Suite</span>
                      </Button>
                    </div>
                  </div>

                  {suite.status === "running" && (
                    <div className="mt-4">
                      <Progress value={suite.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {suite.progress.toFixed(1)}% complete
                      </p>
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {suite.tests.map((test) => {
                      const StatusIcon = getStatusIcon(test.status);

                      return (
                        <div
                          key={test.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg ${getStatusColor(test.status)}`}
                            >
                              <StatusIcon
                                className={`w-4 h-4 ${
                                  test.status === "testing"
                                    ? "animate-spin"
                                    : ""
                                }`}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {test.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {test.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            {test.status === "testing" && (
                              <div className="w-24">
                                <Progress
                                  value={test.progress}
                                  className="h-2"
                                />
                              </div>
                            )}

                            {test.duration && (
                              <span className="text-xs text-gray-500">
                                {test.duration.toFixed(0)}ms
                              </span>
                            )}

                            {test.lastTested && (
                              <span className="text-xs text-gray-500">
                                {test.lastTested.toLocaleTimeString()}
                              </span>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => runTest(suite.id, test.id)}
                              disabled={isRunning}
                              className="flex items-center space-x-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Retest</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>OpenAI Tests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Test AI content generation, image creation, and text processing
                capabilities.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/test/openai")}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Detailed Tests
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cloud className="w-5 h-5" />
                <span>AWS S3 Tests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Test cloud storage, file management, and static website hosting.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/test/s3")}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Detailed Tests
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="w-5 h-5" />
                <span>Vercel Tests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Test deployment, custom domains, and hosting platform
                integration.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/test/vercel")}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Detailed Tests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
