import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  TrendingUp,
  Lightbulb,
  Target,
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  Zap,
  BarChart3,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  type: "post" | "project" | "update" | "milestone";
  date: string;
  time: string;
  status: "scheduled" | "published" | "draft";
  performance?: {
    views: number;
    engagement: number;
    reach: number;
  };
}

interface ContentCalendarProps {
  events: CalendarEvent[];
  optimalTimes: Array<{
    day: string;
    hour: number;
    performance: number;
  }>;
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({
  events,
  optimalTimes,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [filterType, setFilterType] = useState<string>("all");

  const getEventColor = (type: string) => {
    switch (type) {
      case "post":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "project":
        return "bg-green-100 text-green-800 border-green-200";
      case "update":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "milestone":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOptimalTimeColor = (performance: number) => {
    if (performance >= 80) return "bg-green-500";
    if (performance >= 60) return "bg-yellow-500";
    if (performance >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const filteredEvents = events.filter(
    (event) => filterType === "all" || event.type === filterType,
  );

  const eventsByDate = filteredEvents.reduce(
    (acc, event) => {
      const date = event.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, CalendarEvent[]>,
  );

  // Generate calendar days for current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Content Calendar & Posting Optimizer
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {["month", "week", "day"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                viewMode === mode
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-sm"
        >
          <option value="all">All Types</option>
          <option value="post">Posts</option>
          <option value="project">Projects</option>
          <option value="update">Updates</option>
          <option value="milestone">Milestones</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-slate-600 p-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="h-20" />;
                }

                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayEvents = eventsByDate[dateStr] || [];
                const isToday = dateStr === selectedDate;
                const isCurrentMonth = true;

                return (
                  <div
                    key={index}
                    className={`h-20 border border-slate-200 rounded-lg p-1 cursor-pointer transition-all hover:shadow-md ${
                      isToday ? "bg-blue-50 border-blue-300" : "bg-white"
                    } ${!isCurrentMonth ? "opacity-50" : ""}`}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <div className="text-sm font-semibold text-slate-800 mb-1">
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded border ${getEventColor(event.type)}`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-slate-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Optimal Times */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Optimal Posting Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimalTimes.map((time, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-800">
                        {time.day}
                      </div>
                      <div className="text-sm text-slate-600">
                        {time.hour}:00
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getOptimalTimeColor(time.performance)}`}
                      />
                      <span className="text-sm font-semibold text-slate-800">
                        {time.performance}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getOptimalTimeColor(time.performance)}`}
                      style={{ width: `${time.performance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Events for {new Date(selectedDate).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventsByDate[selectedDate]?.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={getEventColor(event.type)}>
                        {event.type}
                      </Badge>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {event.title}
                        </div>
                        <div className="text-sm text-slate-600">
                          {event.time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>

                      {event.performance && (
                        <div className="text-right">
                          <div className="text-sm text-slate-600">
                            Performance
                          </div>
                          <div className="text-sm font-semibold text-slate-800">
                            {event.performance.views} views
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-slate-500">
                  No events scheduled for this date
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Performance Insights */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Content Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">85%</div>
              <div className="text-sm text-slate-600">Avg. Engagement</div>
              <div className="text-xs text-green-600">+12% from last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2.4K</div>
              <div className="text-sm text-slate-600">Total Reach</div>
              <div className="text-xs text-blue-600">+8% from last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">156</div>
              <div className="text-sm text-slate-600">Posts This Month</div>
              <div className="text-xs text-purple-600">+5% from last month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-semibold text-green-800 mb-2">
                Best Posting Schedule
              </div>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Tuesday 10 AM: +40% engagement</li>
                <li>• Thursday 2 PM: +25% reach</li>
                <li>• Sunday 6 PM: +30% shares</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">
                Content Gaps
              </div>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Add more video content (+60% engagement)</li>
                <li>• Post case studies (+45% views)</li>
                <li>• Share behind-the-scenes (+35% likes)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
