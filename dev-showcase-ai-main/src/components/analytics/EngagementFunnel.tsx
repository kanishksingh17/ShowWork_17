import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingDown,
  Users,
  MousePointer,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Target,
} from "lucide-react";

interface FunnelStep {
  name: string;
  visitors: number;
  conversionRate: number;
  dropOffRate: number;
  avgTime: number;
}

interface DropOffPoint {
  step: string;
  dropOffRate: number;
  reasons: string[];
  suggestions: string[];
}

interface EngagementFunnelProps {
  funnelData: {
    steps: FunnelStep[];
    conversionRate: number;
    dropOffPoints: DropOffPoint[];
  };
}

export const EngagementFunnel: React.FC<EngagementFunnelProps> = ({
  funnelData,
}) => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const getStepColor = (index: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-orange-500 to-orange-600",
      "from-red-500 to-red-600",
    ];
    return colors[index % colors.length];
  };

  const getStepWidth = (step: FunnelStep, index: number) => {
    if (index === 0) return 100;
    const previousStep = funnelData.steps[index - 1];
    return (step.visitors / previousStep.visitors) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Engagement Funnel</h2>
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          {funnelData.conversionRate.toFixed(1)}% Conversion
        </Badge>
      </div>

      {/* Funnel Visualization */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.steps.map((step, index) => {
              const width = getStepWidth(step, index);
              const isSelected = selectedStep === index;

              return (
                <div key={index} className="relative">
                  <div
                    className={`relative bg-gradient-to-r ${getStepColor(index)} rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{ width: `${width}%` }}
                    onClick={() => setSelectedStep(isSelected ? null : index)}
                  >
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <div className="font-semibold">{step.name}</div>
                        <div className="text-sm opacity-90">
                          {step.visitors.toLocaleString()} visitors
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {step.conversionRate.toFixed(1)}%
                        </div>
                        <div className="text-xs opacity-90">
                          {step.avgTime}s avg
                        </div>
                      </div>
                    </div>

                    {/* Drop-off indicator */}
                    {index > 0 && step.dropOffRate > 0 && (
                      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                        <div className="flex items-center space-x-1 text-red-500">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            {step.dropOffRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Arrow to next step */}
                  {index < funnelData.steps.length - 1 && (
                    <div className="flex justify-center my-2">
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Details */}
      {selectedStep !== null && (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-800">
              {funnelData.steps[selectedStep].name} - Detailed Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-600">Visitors</div>
                  <div className="text-2xl font-bold text-slate-800">
                    {funnelData.steps[selectedStep].visitors.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Conversion Rate</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {funnelData.steps[selectedStep].conversionRate.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Average Time</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {funnelData.steps[selectedStep].avgTime}s
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-600 mb-2">
                    Drop-off Rate
                  </div>
                  <Progress
                    value={funnelData.steps[selectedStep].dropOffRate}
                    className="h-2"
                  />
                  <div className="text-sm text-red-600 mt-1">
                    {funnelData.steps[selectedStep].dropOffRate.toFixed(1)}%
                    drop-off
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-600 mb-2">
                    Performance Score
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(
                      100 - funnelData.steps[selectedStep].dropOffRate,
                    )}
                  </div>
                  <div className="text-xs text-slate-600">out of 100</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drop-off Analysis */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            Drop-off Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.dropOffPoints.map((dropOff, index) => (
              <div
                key={index}
                className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-slate-800">
                    {dropOff.step}
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    {dropOff.dropOffRate.toFixed(1)}% drop-off
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-700 mb-2">
                      Reasons:
                    </div>
                    <ul className="space-y-1">
                      {dropOff.reasons.map((reason, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-600 flex items-center"
                        >
                          <TrendingDown className="w-3 h-3 mr-2 text-red-500" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-700 mb-2">
                      Suggestions:
                    </div>
                    <ul className="space-y-1">
                      {dropOff.suggestions.map((suggestion, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-600 flex items-center"
                        >
                          <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-semibold text-green-800 mb-2">
                High Impact
              </div>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Simplify contact form (reduce fields by 50%)</li>
                <li>• Add social proof testimonials</li>
                <li>• Implement exit-intent popup</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">
                Medium Impact
              </div>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Improve page load speed</li>
                <li>• Add progress indicators</li>
                <li>• Optimize for mobile devices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
