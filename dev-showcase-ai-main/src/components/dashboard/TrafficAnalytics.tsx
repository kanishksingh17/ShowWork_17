import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Calendar,
  Filter,
  Download,
  Eye,
  MousePointer,
  Clock,
} from "lucide-react";

interface TrafficAnalyticsProps {
  trafficData: {
    daily: Array<{ date: string; views: number; visitors: number }>;
    weekly: Array<{ week: string; views: number; visitors: number }>;
    monthly: Array<{ month: string; views: number; visitors: number }>;
    sources: Array<{ source: string; views: number; percentage: number }>;
  };
}

export const TrafficAnalytics: React.FC<TrafficAnalyticsProps> = ({
  trafficData,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [selectedMetric, setSelectedMetric] = useState<"views" | "visitors">(
    "views",
  );

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case "daily":
        return trafficData.daily;
      case "weekly":
        return trafficData.weekly;
      case "monthly":
        return trafficData.monthly;
      default:
        return trafficData.daily;
    }
  };

  const getMetricValue = (item: any) => {
    if (selectedPeriod === "daily" || selectedPeriod === "weekly") {
      return item[selectedMetric];
    }
    return item[selectedMetric];
  };

  const getLabel = (item: any) => {
    if (selectedPeriod === "daily") return item.date;
    if (selectedPeriod === "weekly") return item.week;
    return item.month;
  };

  const currentData = getCurrentData();
  const maxValue = Math.max(...currentData.map((item) => getMetricValue(item)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Traffic Analytics</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {(["daily", "weekly", "monthly"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                selectedPeriod === period
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {(["views", "visitors"] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                selectedMetric === metric
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Traffic Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.slice(-7).map((item, index) => {
                const value = getMetricValue(item);
                const percentage = (value / maxValue) * 100;
                const isIncreasing =
                  index > 0 && value > getMetricValue(currentData[index - 1]);

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {getLabel(item)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-slate-800">
                          {value.toLocaleString()}
                        </span>
                        {index > 0 && (
                          <div
                            className={`flex items-center ${isIncreasing ? "text-green-600" : "text-red-600"}`}
                          >
                            {isIncreasing ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficData.sources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0
                            ? "bg-blue-500"
                            : index === 1
                              ? "bg-green-500"
                              : index === 2
                                ? "bg-purple-500"
                                : index === 3
                                  ? "bg-orange-500"
                                  : "bg-gray-500"
                        }`}
                      />
                      <span className="text-slate-800">{source.source}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-600">
                        {source.views} views
                      </span>
                      <Badge variant="secondary">{source.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                            ? "bg-green-500"
                            : index === 2
                              ? "bg-purple-500"
                              : index === 3
                                ? "bg-orange-500"
                                : "bg-gray-500"
                      }`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Quality Score */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-blue-600" />
            Traffic Quality Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">85</div>
              <div className="text-sm text-slate-600">Quality Score</div>
              <div className="text-xs text-green-600">+5% from last week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2.4m</div>
              <div className="text-sm text-slate-600">Avg. Session</div>
              <div className="text-xs text-blue-600">+12% from last week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">68%</div>
              <div className="text-sm text-slate-600">Engagement</div>
              <div className="text-xs text-purple-600">+8% from last week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">12%</div>
              <div className="text-sm text-slate-600">Bounce Rate</div>
              <div className="text-xs text-orange-600">-3% from last week</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
