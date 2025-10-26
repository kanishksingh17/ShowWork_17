// Code Quality Widget - Display GitHub metrics and quality scores

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Github, 
  Star, 
  GitFork, 
  AlertTriangle, 
  Users, 
  Calendar,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeQualityMetrics } from '@/types/project';

interface CodeQualityWidgetProps {
  githubUrl?: string;
  metrics?: CodeQualityMetrics;
  onAnalyze?: (url: string) => Promise<CodeQualityMetrics>;
  onError?: (error: string) => void;
  className?: string;
}

export default function CodeQualityWidget({
  githubUrl,
  metrics,
  onAnalyze,
  onError,
  className
}: CodeQualityWidgetProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localMetrics, setLocalMetrics] = useState<CodeQualityMetrics | undefined>(metrics);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);

  // Update local metrics when props change
  useEffect(() => {
    setLocalMetrics(metrics);
  }, [metrics]);

  // Handle analysis
  const handleAnalyze = async () => {
    if (!githubUrl || !onAnalyze) return;

    try {
      setIsAnalyzing(true);
      const result = await onAnalyze(githubUrl);
      setLocalMetrics(result);
      setLastAnalyzed(new Date());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      onError?.(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get quality score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get quality score background
  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Get complexity color
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Get trend indicator
  const getTrendIndicator = (value: number, threshold: number) => {
    if (value > threshold) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < threshold) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4" />;
  };

  if (!localMetrics && !githubUrl) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Code Quality Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Github className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Connect a GitHub repository to analyze code quality
            </p>
            <p className="text-sm text-gray-400">
              Enter a GitHub URL to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Code Quality Analysis
          </CardTitle>
          
          {githubUrl && (
            <div className="flex items-center gap-2">
              {lastAnalyzed && (
                <span className="text-xs text-gray-500">
                  Last analyzed: {formatDate(lastAnalyzed)}
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                Analyze
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!localMetrics ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Analyzing repository...</p>
          </div>
        ) : (
          <>
            {/* Overall Score */}
            <div className="text-center">
              <div className={cn(
                'inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold',
                getScoreBg(localMetrics.overallScore),
                getScoreColor(localMetrics.overallScore)
              )}>
                {localMetrics.overallScore}
              </div>
              <p className="text-sm text-gray-500 mt-2">Overall Quality Score</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-lg font-semibold">{localMetrics.openIssues}</span>
                </div>
                <p className="text-xs text-gray-500">Open Issues</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-lg font-semibold">{localMetrics.criticalBugs}</span>
                </div>
                <p className="text-xs text-gray-500">Critical Bugs</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-lg font-semibold">{localMetrics.contributors}</span>
                </div>
                <p className="text-xs text-gray-500">Contributors</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="text-lg font-semibold">
                    {formatDate(localMetrics.lastCommit)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Last Commit</p>
              </div>
            </div>

            {/* Test Coverage */}
            {localMetrics.testCoverage > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Test Coverage</span>
                  <span className="text-sm text-gray-500">{localMetrics.testCoverage}%</span>
                </div>
                <Progress value={localMetrics.testCoverage} className="h-2" />
              </div>
            )}

            {/* Complexity */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Code Complexity</span>
              <Badge className={getComplexityColor(localMetrics.complexity)}>
                {localMetrics.complexity.charAt(0).toUpperCase() + localMetrics.complexity.slice(1)}
              </Badge>
            </div>

            {/* Languages */}
            {localMetrics.languages.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3">Programming Languages</h4>
                <div className="space-y-2">
                  {localMetrics.languages.slice(0, 5).map((lang, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{lang.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={lang.percentage} className="w-20 h-1" />
                        <span className="text-xs text-gray-500 w-8 text-right">
                          {lang.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dependencies */}
            {(localMetrics.dependencies.outdated > 0 || localMetrics.dependencies.vulnerable > 0) && (
              <div>
                <h4 className="text-sm font-medium mb-3">Dependencies</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-lg font-semibold text-yellow-600">
                        {localMetrics.dependencies.outdated}
                      </span>
                    </div>
                    <p className="text-xs text-yellow-600">Outdated</p>
                  </div>
                  
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-lg font-semibold text-red-600">
                        {localMetrics.dependencies.vulnerable}
                      </span>
                    </div>
                    <p className="text-xs text-red-600">Vulnerable</p>
                  </div>
                </div>
              </div>
            )}

            {/* Insights */}
            {localMetrics.insights.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3">Insights & Recommendations</h4>
                <div className="space-y-2">
                  {localMetrics.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GitHub Link */}
            {githubUrl && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(githubUrl, '_blank')}
                  className="w-full flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on GitHub
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
