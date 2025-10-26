import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Settings, BarChart3 } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    projectId: string;
    projectName: string;
    projectImage?: string;
    platforms: string[];
    status: string;
    messageByPlatform: Record<string, string>;
    mediaUrls: string[];
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  technologies: string[];
}

export function SocialMediaCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const platforms = [
    { id: "linkedin", name: "LinkedIn", color: "#0077B5" },
    { id: "twitter", name: "Twitter", color: "#1DA1F2" },
    { id: "reddit", name: "Reddit", color: "#FF4500" },
    { id: "facebook", name: "Facebook", color: "#1877F2" },
    { id: "instagram", name: "Instagram", color: "#E4405F" },
  ];

  useEffect(() => {
    fetchEvents();
    fetchProjects();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "/api/calendar/events?start=2024-01-01&end=2024-12-31",
      );
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    const { start, end } = selectInfo;
    const startStr = start.toISOString();
    const endStr = end.toISOString();

    // Open scheduling modal
    setSelectedProject("");
    setSelectedPlatforms([]);
    // You would open a modal here to select project and platforms
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    const extendedProps = event.extendedProps;

    // Show event details
    console.log("Event clicked:", extendedProps);
  };

  const schedulePost = async (
    projectId: string,
    platforms: string[],
    scheduledAt: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/calendar/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          platforms,
          scheduledAt,
        }),
      });

      if (response.ok) {
        await fetchEvents(); // Refresh events
      }
    } catch (error) {
      console.error("Error scheduling post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Social Media Calendar
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule and manage your project posts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scheduled
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    events.filter((e) => e.extendedProps.status === "SCHEDULED")
                      .length
                  }
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Posted
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    events.filter((e) => e.extendedProps.status === "POSTED")
                      .length
                  }
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Failed
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    events.filter((e) => e.extendedProps.status === "FAILED")
                      .length
                  }
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Platforms
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {
                    new Set(events.flatMap((e) => e.extendedProps.platforms))
                      .size
                  }
                </p>
              </div>
              <Plus className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Content Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            selectMirror={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            height="auto"
            eventContent={(eventInfo) => (
              <div className="flex items-center gap-1 p-1">
                <div className="flex gap-1">
                  {eventInfo.event.extendedProps.platforms.map(
                    (platform: string) => (
                      <Badge
                        key={platform}
                        variant="secondary"
                        className="text-xs px-1 py-0"
                        style={{
                          backgroundColor:
                            platforms.find((p) => p.id === platform)?.color +
                            "20",
                          color: platforms.find((p) => p.id === platform)
                            ?.color,
                        }}
                      >
                        {platform.charAt(0).toUpperCase()}
                      </Badge>
                    ),
                  )}
                </div>
                <span className="text-xs truncate">
                  {eventInfo.event.title}
                </span>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}

