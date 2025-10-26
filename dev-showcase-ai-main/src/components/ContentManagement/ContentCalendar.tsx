import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Send,
  Pause,
  Play,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Image,
  Video,
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

export interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platforms: ("instagram" | "twitter" | "linkedin" | "youtube" | "facebook")[];
  scheduledDate: Date;
  scheduledTime: string;
  status: "draft" | "scheduled" | "published" | "failed" | "paused";
  mediaUrls?: string[];
  hashtags: string[];
  autoPost: boolean;
  repeatSchedule?: {
    frequency: "daily" | "weekly" | "monthly";
    endDate?: Date;
  };
  performance?: {
    reach: number;
    engagement: number;
    clicks: number;
  };
}

export interface CalendarView {
  type: "month" | "week" | "day";
  currentDate: Date;
}

const ContentCalendar: React.FC = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView["type"]>("month");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [newPost, setNewPost] = useState<Partial<ScheduledPost>>({
    title: "",
    content: "",
    platforms: [],
    scheduledDate: new Date(),
    scheduledTime: "09:00",
    status: "draft",
    hashtags: [],
    autoPost: true,
  });

  // Generate mock scheduled posts
  useEffect(() => {
    const mockPosts: ScheduledPost[] = [
      {
        id: "1",
        title: "Portfolio Update",
        content:
          "Just updated my portfolio with new projects! Check out my latest work in AI and machine learning. #portfolio #ai #developer",
        platforms: ["linkedin", "twitter"],
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledTime: "09:00",
        status: "scheduled",
        hashtags: ["#portfolio", "#ai", "#developer"],
        autoPost: true,
      },
      {
        id: "2",
        title: "Tech Tips",
        content:
          "5 essential tips for React developers: 1. Use TypeScript 2. Implement proper error boundaries 3. Optimize with React.memo 4. Use custom hooks 5. Test your components",
        platforms: ["twitter", "linkedin"],
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        scheduledTime: "14:00",
        status: "scheduled",
        hashtags: ["#react", "#javascript", "#webdev"],
        autoPost: true,
      },
      {
        id: "3",
        title: "Project Showcase",
        content:
          "Excited to share my latest project - a full-stack e-commerce platform built with Next.js and Stripe!",
        platforms: ["instagram", "linkedin"],
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        scheduledTime: "16:30",
        status: "scheduled",
        mediaUrls: ["https://example.com/project-image.jpg"],
        hashtags: ["#nextjs", "#stripe", "#ecommerce"],
        autoPost: true,
      },
      {
        id: "4",
        title: "Weekly Update",
        content:
          "This week I focused on learning advanced TypeScript patterns and implementing them in my projects.",
        platforms: ["twitter"],
        scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        scheduledTime: "10:00",
        status: "published",
        hashtags: ["#typescript", "#learning"],
        autoPost: true,
        performance: {
          reach: 1250,
          engagement: 89,
          clicks: 23,
        },
      },
    ];
    setPosts(mockPosts);
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4" />;
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "facebook":
        return <Facebook className="w-4 h-4" />;
      default:
        return <Send className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Edit className="w-4 h-4" />;
      case "scheduled":
        return <Clock className="w-4 h-4" />;
      case "published":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      case "paused":
        return <Pause className="w-4 h-4" />;
      default:
        return <Edit className="w-4 h-4" />;
    }
  };

  const handleCreatePost = () => {
    if (newPost.title && newPost.content && newPost.platforms?.length) {
      const post: ScheduledPost = {
        id: Date.now().toString(),
        title: newPost.title!,
        content: newPost.content!,
        platforms: newPost.platforms!,
        scheduledDate: newPost.scheduledDate!,
        scheduledTime: newPost.scheduledTime!,
        status: "scheduled",
        hashtags: newPost.hashtags || [],
        autoPost: newPost.autoPost || false,
        mediaUrls: newPost.mediaUrls,
      };
      setPosts([...posts, post]);
      setNewPost({
        title: "",
        content: "",
        platforms: [],
        scheduledDate: new Date(),
        scheduledTime: "09:00",
        status: "draft",
        hashtags: [],
        autoPost: true,
      });
      setShowCreateModal(false);
    }
  };

  const handleEditPost = (post: ScheduledPost) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      platforms: post.platforms,
      scheduledDate: post.scheduledDate,
      scheduledTime: post.scheduledTime,
      status: post.status,
      hashtags: post.hashtags,
      autoPost: post.autoPost,
      mediaUrls: post.mediaUrls,
    });
    setShowCreateModal(true);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handleToggleAutoPost = (postId: string) => {
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, autoPost: !p.autoPost } : p)),
    );
  };

  const getPostsForDate = (date: Date) => {
    return posts.filter(
      (post) => post.scheduledDate.toDateString() === date.toDateString(),
    );
  };

  const getUpcomingPosts = () => {
    const now = new Date();
    return posts
      .filter((post) => post.scheduledDate > now)
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, 5);
  };

  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayPosts = getPostsForDate(date);

      days.push(
        <div
          key={i}
          className={`p-2 min-h-[100px] border border-gray-200 ${
            date.getMonth() !== currentMonth
              ? "bg-gray-50 text-gray-400"
              : "bg-white"
          } ${date.toDateString() === today.toDateString() ? "bg-blue-50 border-blue-300" : ""}`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">{date.getDate()}</span>
            {dayPosts.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {dayPosts.length}
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            {dayPosts.slice(0, 2).map((post) => (
              <div
                key={post.id}
                className="text-xs p-1 bg-blue-100 rounded cursor-pointer hover:bg-blue-200"
                onClick={() => handleEditPost(post)}
              >
                <div className="flex items-center space-x-1">
                  {post.platforms.map((platform, idx) => (
                    <span key={idx}>{getPlatformIcon(platform)}</span>
                  ))}
                </div>
                <div className="truncate">{post.title}</div>
              </div>
            ))}
            {dayPosts.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayPosts.length - 2} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center font-medium text-gray-600 bg-gray-100"
          >
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Calendar</h2>
          <p className="text-gray-600">
            Schedule and manage your social media content
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={view === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button
              variant={view === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("day")}
            >
              Day
            </Button>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-2" />
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedDate(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth() - 1,
                      1,
                    ),
                  )
                }
              >
                ←
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedDate(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth() + 1,
                      1,
                    ),
                  )
                }
              >
                →
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>{renderCalendar()}</CardContent>
      </Card>

      {/* Upcoming Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Upcoming Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingPosts().map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {post.platforms.map((platform, idx) => (
                        <span key={idx} className="text-blue-600">
                          {getPlatformIcon(platform)}
                        </span>
                      ))}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{post.title}</p>
                      <p className="text-xs text-gray-600">
                        {post.scheduledDate.toLocaleDateString()} at{" "}
                        {post.scheduledTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(post.status)}>
                      {getStatusIcon(post.status)}
                      <span className="ml-1">{post.status}</span>
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAutoPost(post.id)}
                    >
                      {post.autoPost ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPost(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Auto-Post Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-posting enabled</p>
                  <p className="text-sm text-gray-600">
                    Posts will be published automatically at scheduled times
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Next Auto-Post
                  </span>
                </div>
                <p className="text-sm text-blue-800">
                  {getUpcomingPosts()[0]?.title || "No posts scheduled"}
                </p>
                <p className="text-xs text-blue-600">
                  {getUpcomingPosts()[0]?.scheduledDate.toLocaleDateString() ||
                    ""}{" "}
                  at {getUpcomingPosts()[0]?.scheduledTime || ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingPost ? "Edit Post" : "Schedule New Post"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title
                </label>
                <Input
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  placeholder="Write your post content here..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "instagram",
                    "twitter",
                    "linkedin",
                    "youtube",
                    "facebook",
                  ].map((platform) => (
                    <Button
                      key={platform}
                      variant={
                        newPost.platforms?.includes(platform as any)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        const platforms = newPost.platforms || [];
                        const updatedPlatforms = platforms.includes(
                          platform as any,
                        )
                          ? platforms.filter((p) => p !== platform)
                          : [...platforms, platform as any];
                        setNewPost({ ...newPost, platforms: updatedPlatforms });
                      }}
                    >
                      {getPlatformIcon(platform)}
                      <span className="ml-2 capitalize">{platform}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date
                  </label>
                  <Input
                    type="date"
                    value={newPost.scheduledDate?.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        scheduledDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Time
                  </label>
                  <Input
                    type="time"
                    value={newPost.scheduledTime}
                    onChange={(e) =>
                      setNewPost({ ...newPost, scheduledTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hashtags (comma-separated)
                </label>
                <Input
                  value={newPost.hashtags?.join(", ")}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      hashtags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag),
                    })
                  }
                  placeholder="#portfolio, #developer, #tech"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoPost"
                  checked={newPost.autoPost}
                  onChange={(e) =>
                    setNewPost({ ...newPost, autoPost: e.target.checked })
                  }
                />
                <label htmlFor="autoPost" className="text-sm text-gray-700">
                  Auto-post at scheduled time
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingPost(null);
                    setNewPost({
                      title: "",
                      content: "",
                      platforms: [],
                      scheduledDate: new Date(),
                      scheduledTime: "09:00",
                      status: "draft",
                      hashtags: [],
                      autoPost: true,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreatePost}>
                  {editingPost ? "Update Post" : "Schedule Post"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentCalendar;
