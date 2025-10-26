/**
 * Portfolio Health Score Component
 * Displays portfolio health metrics with progress bars and recommendations
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  RefreshCw,
  TrendingUp,
  Target,
  Award,
  Briefcase,
  Code,
  Star,
  AlertCircle,
} from "lucide-react";
import { PortfolioHealthData } from "@/hooks/usePortfolioHealth";

interface PortfolioHealthScoreProps {
  health: PortfolioHealthData | null;
  loading: boolean;
  onRefresh: () => void;
  onRecompute: () => void;
}

export default function PortfolioHealthScore({
  health,
  loading,
  onRefresh,
  onRecompute,
}: PortfolioHealthScoreProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-green-100 text-green-800";
      case "Good":
        return "bg-blue-100 text-blue-800";
      case "Fair":
        return "bg-yellow-100 text-yellow-800";
      case "Needs Work":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading && !health) {
    return (
      <Card className="rounded-2xl hover:shadow-md transition-all">
        <CardHeader className="flex items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm text-gray-900">
              Portfolio Health Score
            </CardTitle>
            <p className="text-xs text-gray-500">
              AI-powered analysis of your portfolio strength
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button size="sm" disabled>
              <Brain className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!health) {
    return (
      <Card className="rounded-2xl hover:shadow-md transition-all">
        <CardHeader className="flex items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm text-gray-900">
              Portfolio Health Score
            </CardTitle>
            <p className="text-xs text-gray-500">
              AI-powered analysis of your portfolio strength
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={onRecompute}>
              <Brain className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm">No health data available</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onRecompute}
            >
              Get AI Insights
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl hover:shadow-md transition-all">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base text-gray-900">
            Portfolio Health Score
          </CardTitle>
          <p className="text-xs text-gray-500">
            AI-powered analysis of your portfolio strength
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" onClick={onRecompute} disabled={loading}>
            <Brain className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Overall Score */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">Overall Portfolio Health</p>
          <div className="flex items-center gap-2">
            <h3
              className={`text-3xl font-bold ${getScoreColor(health.overall)}`}
            >
              {health.overall}/100
            </h3>
            <Badge className={getStatusColor(health.status)}>
              {health.status}
            </Badge>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          {Object.entries(health.breakdown).map(([key, score]) => {
            const labels: Record<string, string> = {
              technicalSkills: "Technical Skills",
              projectQuality: "Project Quality",
              portfolioPresentation: "Portfolio Presentation",
              experience: "Experience",
              industryAlignment: "Industry Alignment",
              certifications: "Certifications",
            };

            const icons: Record<string, React.ReactNode> = {
              technicalSkills: <Code className="w-4 h-4" />,
              projectQuality: <Star className="w-4 h-4" />,
              portfolioPresentation: <Target className="w-4 h-4" />,
              experience: <Briefcase className="w-4 h-4" />,
              industryAlignment: <TrendingUp className="w-4 h-4" />,
              certifications: <Award className="w-4 h-4" />,
            };

            return (
              <div key={key}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <div className="flex items-center gap-1">
                    {icons[key]}
                    <span>{labels[key]}</span>
                  </div>
                  <span className={getScoreColor(score)}>{score}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full">
                  <div
                    className={`h-1.5 rounded-full ${getProgressColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        {health.recommendedImprovements.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Recommended Improvements
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              {health.recommendedImprovements
                .slice(0, 3)
                .map((improvement, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Last Updated */}
        <div className="mt-3 text-xs text-gray-500">
          Last updated: {new Date(health.lastComputedAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
