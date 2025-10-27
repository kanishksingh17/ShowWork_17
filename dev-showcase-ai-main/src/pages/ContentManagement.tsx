import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UnifiedSidebar } from "../components/UnifiedSidebar";
import {
  Calendar,
  BarChart3,
  FileText,
  Sparkles,
  Send,
  Copy,
  Download,
  RefreshCw,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Share2,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
}

interface GeneratedPost {
  id: string;
  projectId: string;
  platforms: string[];
  messages: Record<string, string>;
  createdAt: Date;
  status: "draft" | "scheduled" | "published";
}

export default function ContentManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const platforms = [
    { id: "linkedin", name: "LinkedIn", color: "#0077B5", icon: "💼" },
    { id: "twitter", name: "Twitter", color: "#1DA1F2", icon: "🐦" },
    { id: "reddit", name: "Reddit", color: "#FF4500", icon: "🔴" },
    { id: "facebook", name: "Facebook", color: "#1877F2", icon: "📘" },
    { id: "instagram", name: "Instagram", color: "#E4405F", icon: "📷" },
  ];

  useEffect(() => {
    // Fetch projects from API
    fetchProjects();
    fetchGeneratedPosts();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchGeneratedPosts = async () => {
    try {
      const response = await fetch("/api/content/posts");
      const data = await response.json();
      setGeneratedPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching generated posts:", error);
    }
  };

  const generatePost = async () => {
    if (!selectedProject || selectedPlatforms.length === 0) return;

    setIsGenerating(true);
    try {
      const project = projects.find((p) => p.id === selectedProject);
      if (!project) return;

      const response = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject,
          platforms: selectedPlatforms,
          useAI,
          customMessage: customMessage || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedPosts((prev) => [result.post, ...prev]);
        setCustomMessage("");
      }
    } catch (error) {
      console.error("Error generating post:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const schedulePost = async (postId: string, scheduledAt: string) => {
    try {
      const response = await fetch("/api/content/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          scheduledAt,
        }),
      });

      if (response.ok) {
        await fetchGeneratedPosts();
      }
    } catch (error) {
      console.error("Error scheduling post:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar currentPage="content" />

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Content Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create, schedule, and manage your social media content
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>

          <Tabs defaultValue="generator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="generator">Post Generator</TabsTrigger>
              <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            {/* Post Generator Tab */}
            <TabsContent value="generator" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Generator Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      AI Post Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Project Selection */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Select Project
                      </label>
                      <Select
                        value={selectedProject}
                        onValueChange={setSelectedProject}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a project to promote" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center gap-2">
                                {project.imageUrl && (
                                  <img
                                    src={project.imageUrl}
                                    alt={project.name}
                                    className="w-6 h-6 rounded object-cover"
                                  />
                                )}
                                <span>{project.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Platform Selection */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Select Platforms
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {platforms.map((platform) => (
                          <Button
                            key={platform.id}
                            variant={
                              selectedPlatforms.includes(platform.id)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => {
                              setSelectedPlatforms((prev) =>
                                prev.includes(platform.id)
                                  ? prev.filter((p) => p !== platform.id)
                                  : [...prev, platform.id],
                              );
                            }}
                            className="flex items-center gap-2"
                          >
                            <span>{platform.icon}</span>
                            <span>{platform.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Message */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Custom Message (Optional)
                      </label>
                      <Textarea
                        placeholder="Add a custom message or let AI generate one..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* AI Toggle */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="useAI"
                        checked={useAI}
                        onChange={(e) => setUseAI(e.target.checked)}
                        className="rounded"
                      />
                      <label
                        htmlFor="useAI"
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        Use AI to generate platform-optimized content
                      </label>
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={generatePost}
                      disabled={
                        !selectedProject ||
                        selectedPlatforms.length === 0 ||
                        isGenerating
                      }
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Posts
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Generated Posts Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Generated Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedPosts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No generated posts yet</p>
                          <p className="text-sm">
                            Generate your first post to see it here
                          </p>
                        </div>
                      ) : (
                        generatedPosts.slice(0, 3).map((post) => (
                          <div
                            key={post.id}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {post.platforms.map((platform) => {
                                  const platformInfo = platforms.find(
                                    (p) => p.id === platform,
                                  );
                                  return (
                                    <Badge
                                      key={platform}
                                      variant="secondary"
                                      className="text-xs"
                                      style={{
                                        backgroundColor:
                                          platformInfo?.color + "20",
                                        color: platformInfo?.color,
                                      }}
                                    >
                                      {platformInfo?.icon} {platformInfo?.name}
                                    </Badge>
                                  );
                                })}
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {Object.values(post.messages)[0]?.slice(0, 100)}
                              ...
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                              <Button size="sm" variant="outline">
                                <Calendar className="w-3 h-3 mr-1" />
                                Schedule
                              </Button>
                              <Button size="sm" variant="outline">
                                <Send className="w-3 h-3 mr-1" />
                                Post Now
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Content Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Content Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Content Calendar
                    </h3>
                    <p>Schedule and manage your social media posts</p>
                    <p className="text-sm">Calendar view coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Content Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Analytics Dashboard
                    </h3>
                    <p>Track performance of your content across platforms</p>
                    <p className="text-sm">Analytics coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Content Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Content Templates
                    </h3>
                    <p>Save and reuse your best-performing content</p>
                    <p className="text-sm">Templates coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}


