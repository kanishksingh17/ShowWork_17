"use client";

import React, { useState, useEffect } from "react";
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
  Star,
  Target,
  Code,
  Briefcase,
  User,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Portfolio Builder</h2>
          <p className="text-muted-foreground">
            Preparing your AI-powered experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b">
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Build Your Dream Portfolio with AI
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Our AI analyzes your profile, projects, and career goals to create a
            personalized portfolio that maximizes your chances of landing your
            dream job.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">Start Building</Button>
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
                AI analyzes your skills and projects to identify your ideal job
                role and industry.
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
                Get AI-recommended portfolio templates tailored to your role and
                industry.
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
                AI generates compelling content for your about section, project
                descriptions, and more.
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
                Content is optimized for Applicant Tracking Systems to maximize
                interview chances.
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

        {/* Success Message */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Portfolio System Active!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">
              Your AI-powered portfolio builder is now ready. The system
              includes job role detection, smart templates, content generation,
              and social integration features.
            </p>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Build Your Portfolio?
          </h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of professionals who have landed their dream jobs
            with AI-optimized portfolios.
          </p>
          <Button size="lg">Start Building Now</Button>
        </div>
      </div>
    </div>
  );
}
