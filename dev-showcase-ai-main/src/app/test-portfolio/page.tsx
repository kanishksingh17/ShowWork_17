"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TestPortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="h-4 w-4" />
            Portfolio Route Working!
          </div>
          <h1 className="text-4xl font-bold mb-4">Portfolio System Test</h1>
          <p className="text-xl text-muted-foreground">
            This confirms that the portfolio routing is working correctly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                AI Portfolio Builder
              </CardTitle>
              <CardDescription>
                Test the main portfolio builder functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This page confirms that the portfolio routing is working. You
                  can now access the full AI-powered portfolio builder.
                </p>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/portfolio">Go to Portfolio Builder</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current system status and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Portfolio Routing</span>
                  <Badge className="bg-green-100 text-green-800">Working</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Navigation</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">UI Components</span>
                  <Badge className="bg-green-100 text-green-800">Loaded</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next.js App Router</span>
                  <Badge className="bg-green-100 text-green-800">
                    Configured
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/portfolio">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Main Portfolio Page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
