"use client";

import React, { useState, useEffect } from "react";
import { PortfolioSystem } from "../../components/portfolio/PortfolioSystem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  Home,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Users,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function AIPortfolioPage() {
  const [userData, setUserData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSystem, setShowSystem] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load user data from localStorage or API
      const savedUserData = localStorage.getItem("userData");
      const savedProjects = localStorage.getItem("userProjects");

      if (savedUserData && savedProjects) {
        setUserData(JSON.parse(savedUserData));
        setProjects(JSON.parse(savedProjects));
      } else {
        // Create comprehensive mock data for demonstration
        const mockUserData = {
          id: "demo-user-123",
          name: "Alex Johnson",
          email: "alex.johnson@email.com",
          title: "Full Stack Developer",
          bio: "Passionate developer with 5+ years of experience building scalable web applications using modern technologies. Specialized in React, Node.js, and cloud architecture.",
          skills: [
            "React",
            "Node.js",
            "TypeScript",
            "Python",
            "AWS",
            "Docker",
            "PostgreSQL",
            "MongoDB",
            "GraphQL",
            "Next.js",
          ],
          experience: "5+ years",
          location: "San Francisco, CA",
          industry: "Technology",
          github: "alexjohnson",
          linkedin: "alex-johnson-dev",
          twitter: "alexjohnson_dev",
          website: "https://alexjohnson.dev",
          education: "BS Computer Science, Stanford University",
          certifications: [
            "AWS Solutions Architect",
            "Google Cloud Professional",
          ],
        };

        const mockProjects = [
          {
            id: "project-1",
            title: "E-commerce Platform",
            description:
              "Built a full-stack e-commerce platform serving 10,000+ users with React, Node.js, and PostgreSQL. Implemented payment processing, inventory management, and real-time analytics.",
            technologies: [
              "React",
              "Node.js",
              "PostgreSQL",
              "Stripe",
              "Redis",
              "Docker",
            ],
            githubUrl: "https://github.com/alexjohnson/ecommerce",
            liveUrl: "https://ecommerce-demo.com",
            imageUrl: "/projects/ecommerce.jpg",
            isFeatured: true,
            relevanceScore: 0.95,
            metrics: {
              users: "10,000+",
              revenue: "$50K+",
              performance: "99.9% uptime",
            },
          },
          {
            id: "project-2",
            title: "Task Management App",
            description:
              "Real-time collaborative task management application with Socket.io, supporting team collaboration and project tracking with advanced filtering and analytics.",
            technologies: [
              "React",
              "Socket.io",
              "MongoDB",
              "Express",
              "TypeScript",
            ],
            githubUrl: "https://github.com/alexjohnson/taskmanager",
            liveUrl: "https://taskmanager-demo.com",
            imageUrl: "/projects/taskmanager.jpg",
            isFeatured: true,
            relevanceScore: 0.88,
            metrics: {
              teams: "500+",
              tasks: "1M+",
              satisfaction: "4.8/5",
            },
          },
          {
            id: "project-3",
            title: "AI Chatbot Platform",
            description:
              "Intelligent chatbot platform using OpenAI API with natural language processing, supporting multiple languages and custom training.",
            technologies: ["Python", "OpenAI API", "Flask", "NLTK", "Docker"],
            githubUrl: "https://github.com/alexjohnson/ai-chatbot",
            liveUrl: "https://ai-chatbot-demo.com",
            imageUrl: "/projects/chatbot.jpg",
            isFeatured: false,
            relevanceScore: 0.75,
            metrics: {
              conversations: "100K+",
              accuracy: "92%",
              languages: "15+",
            },
          },
          {
            id: "project-4",
            title: "Cloud Infrastructure Dashboard",
            description:
              "Comprehensive dashboard for monitoring cloud infrastructure with real-time metrics, alerting, and cost optimization recommendations.",
            technologies: [
              "React",
              "AWS",
              "Terraform",
              "Grafana",
              "Prometheus",
            ],
            githubUrl: "https://github.com/alexjohnson/cloud-dashboard",
            liveUrl: "https://cloud-dashboard-demo.com",
            imageUrl: "/projects/cloud-dashboard.jpg",
            isFeatured: true,
            relevanceScore: 0.92,
            metrics: {
              servers: "500+",
              savings: "$20K/month",
              uptime: "99.99%",
            },
          },
        ];

        setUserData(mockUserData);
        setProjects(mockProjects);

        // Save to localStorage for persistence
        localStorage.setItem("userData", JSON.stringify(mockUserData));
        localStorage.setItem("userProjects", JSON.stringify(mockProjects));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-2xl font-bold">Loading AI Portfolio System</h2>
          <p className="text-muted-foreground">
            Preparing your personalized experience...
          </p>
        </div>
      </div>
    );
  }

  if (showSystem) {
    return <PortfolioSystem userData={userData} projects={projects} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered Portfolio Builder
                </h1>
                <p className="text-muted-foreground">
                  Create your perfect portfolio in minutes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Secure
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            Trusted by 10,000+ professionals
          </div>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Build Your Dream Portfolio with AI
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Our advanced AI analyzes your profile, projects, and career goals to
            create a personalized portfolio that maximizes your chances of
            landing your dream job. Get 100% success rate with AI optimization.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setShowSystem(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start Building Now
            </Button>
            <Button size="lg" variant="outline">
              <TrendingUp className="h-5 w-5 mr-2" />
              View Success Stories
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Smart Job Role Detection</CardTitle>
              <CardDescription>
                AI analyzes your skills, projects, and experience to identify
                your ideal job role and career path.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Automatic role identification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Industry alignment analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Skills gap assessment</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle>AI Content Generation</CardTitle>
              <CardDescription>
                Generate compelling, job-specific content for your portfolio
                sections using advanced AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Personalized about sections</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Project descriptions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>ATS-optimized content</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Auto Social Integration</CardTitle>
              <CardDescription>
                Automatically fetch and integrate your GitHub, LinkedIn, and
                other social profiles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>GitHub profile integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>LinkedIn auto-fetch</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Privacy-first approach</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Metrics */}
        <Card className="mb-16 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Proven Success Metrics
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Our AI-powered portfolios deliver real results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  95%
                </div>
                <div className="text-sm text-muted-foreground">
                  Job Application Success Rate
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Successful Placements
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  4.9/5
                </div>
                <div className="text-sm text-muted-foreground">
                  User Satisfaction
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  100%
                </div>
                <div className="text-sm text-muted-foreground">
                  ATS Compatibility
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Data Preview */}
        {userData && (
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Your Profile Data
              </CardTitle>
              <CardDescription>
                We'll use this information to create your personalized portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Personal Information</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Name:</strong> {userData.name}
                      </p>
                      <p>
                        <strong>Title:</strong> {userData.title}
                      </p>
                      <p>
                        <strong>Experience:</strong> {userData.experience}
                      </p>
                      <p>
                        <strong>Location:</strong> {userData.location}
                      </p>
                      <p>
                        <strong>Industry:</strong> {userData.industry}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Skills & Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {userData.skills.slice(0, 8).map((skill: string) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {userData.skills.length > 8 && (
                        <Badge variant="outline" className="text-xs">
                          +{userData.skills.length - 8} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      Projects & Achievements
                    </h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Total Projects:</strong> {projects.length}{" "}
                        projects
                      </p>
                      <p>
                        <strong>Featured Projects:</strong>{" "}
                        {projects.filter((p) => p.isFeatured).length} featured
                      </p>
                      <p>
                        <strong>Technologies:</strong>{" "}
                        {
                          [...new Set(projects.flatMap((p) => p.technologies))]
                            .length
                        }{" "}
                        unique
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Social Profiles</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>GitHub:</strong> @{userData.github}
                      </p>
                      <p>
                        <strong>LinkedIn:</strong> {userData.linkedin}
                      </p>
                      <p>
                        <strong>Website:</strong> {userData.website}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Build Your Perfect Portfolio?
            </h3>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of professionals who have landed their dream jobs
              with AI-optimized portfolios. Our system guarantees 100% success
              rate when you follow our AI recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setShowSystem(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Building Now
              </Button>
              <Button size="lg" variant="outline">
                <TrendingUp className="h-5 w-5 mr-2" />
                View Success Stories
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              ✨ Free to start • 🚀 AI-powered • 🛡️ Secure & Private
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
