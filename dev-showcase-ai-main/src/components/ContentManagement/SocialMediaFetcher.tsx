import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  RefreshCw,
  Download,
  BarChart3,
} from "lucide-react";

export interface SocialMediaPost {
  id: string;
  platform: "instagram" | "twitter" | "linkedin" | "youtube" | "facebook";
  content: string;
  mediaUrl?: string;
  publishedAt: Date;
  metrics: {
    reach: number;
    impressions: number;
    engagement: number;
    likes: number;
    comments: number;
    shares: number;
    saves?: number;
    views?: number;
  };
  hashtags: string[];
  engagementRate: number;
}

export interface PlatformMetrics {
  platform: string;
  totalPosts: number;
  totalReach: number;
  totalEngagement: number;
  avgEngagementRate: number;
  bestPerformingPost: SocialMediaPost;
  growthRate: number;
}

export interface ContentInsights {
  topHashtags: Array<{ tag: string; usage: number; reach: number }>;
  bestPostingTimes: Array<{ hour: number; engagement: number }>;
  contentTypes: Array<{ type: string; performance: number }>;
  audienceGrowth: Array<{ date: string; followers: number }>;
  crossPlatformReach: number;
  totalEngagement: number;
  viralContent: SocialMediaPost[];
}

// Mock data generator for social media analytics
const generateMockSocialData = (): {
  posts: SocialMediaPost[];
  platformMetrics: PlatformMetrics[];
  insights: ContentInsights;
} => {
  const platforms = [
    "instagram",
    "twitter",
    "linkedin",
    "youtube",
    "facebook",
  ] as const;
  const posts: SocialMediaPost[] = [];

  // Generate posts for each platform
  platforms.forEach((platform, platformIndex) => {
    for (let i = 0; i < 15; i++) {
      const baseReach = Math.floor(Math.random() * 5000) + 1000;
      const engagement = Math.floor(Math.random() * 500) + 50;

      posts.push({
        id: `${platform}-${i}`,
        platform,
        content: `Sample content for ${platform} post ${i + 1}`,
        mediaUrl:
          i % 3 === 0 ? `https://example.com/media/${i}.jpg` : undefined,
        publishedAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ),
        metrics: {
          reach: baseReach,
          impressions: Math.floor(baseReach * (1.2 + Math.random() * 0.5)),
          engagement: engagement,
          likes: Math.floor(engagement * 0.7),
          comments: Math.floor(engagement * 0.15),
          shares: Math.floor(engagement * 0.1),
          saves:
            platform === "instagram" ? Math.floor(engagement * 0.2) : undefined,
          views:
            platform === "youtube" ? Math.floor(baseReach * 1.5) : undefined,
        },
        hashtags: [`#${platform}`, "#portfolio", "#developer", "#tech", "#ai"],
        engagementRate: (engagement / baseReach) * 100,
      });
    }
  });

  // Generate platform metrics
  const platformMetrics: PlatformMetrics[] = platforms.map((platform) => {
    const platformPosts = posts.filter((p) => p.platform === platform);
    const totalReach = platformPosts.reduce(
      (sum, p) => sum + p.metrics.reach,
      0,
    );
    const totalEngagement = platformPosts.reduce(
      (sum, p) => sum + p.metrics.engagement,
      0,
    );
    const avgEngagementRate = (totalEngagement / totalReach) * 100;
    const bestPost = platformPosts.reduce((best, current) =>
      current.metrics.engagement > best.metrics.engagement ? current : best,
    );

    return {
      platform,
      totalPosts: platformPosts.length,
      totalReach,
      totalEngagement,
      avgEngagementRate,
      bestPerformingPost: bestPost,
      growthRate: Math.random() * 20 + 5,
    };
  });

  // Generate insights
  const insights: ContentInsights = {
    topHashtags: [
      { tag: "#portfolio", usage: 45, reach: 12500 },
      { tag: "#developer", usage: 38, reach: 9800 },
      { tag: "#tech", usage: 32, reach: 8700 },
      { tag: "#ai", usage: 28, reach: 7200 },
      { tag: "#webdev", usage: 25, reach: 6500 },
    ],
    bestPostingTimes: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      engagement: Math.random() * 100 + (hour >= 9 && hour <= 17 ? 50 : 0),
    })),
    contentTypes: [
      { type: "Image Posts", performance: 85 },
      { type: "Video Content", performance: 92 },
      { type: "Text Posts", performance: 68 },
      { type: "Carousel Posts", performance: 78 },
    ],
    audienceGrowth: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      followers: 1000 + i * 50 + Math.random() * 100,
    })),
    crossPlatformReach: platformMetrics.reduce(
      (sum, p) => sum + p.totalReach,
      0,
    ),
    totalEngagement: platformMetrics.reduce(
      (sum, p) => sum + p.totalEngagement,
      0,
    ),
    viralContent: posts
      .sort((a, b) => b.metrics.engagement - a.metrics.engagement)
      .slice(0, 5),
  };

  return { posts, platformMetrics, insights };
};

const SocialMediaFetcher: React.FC = () => {
  const [data, setData] = useState<{
    posts: SocialMediaPost[];
    platformMetrics: PlatformMetrics[];
    insights: ContentInsights;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setData(generateMockSocialData());
      setLoading(false);
    };

    loadData();
  }, [selectedPeriod]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "twitter":
        return <Twitter className="w-5 h-5" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "twitter":
        return "bg-blue-500";
      case "linkedin":
        return "bg-blue-600";
      case "youtube":
        return "bg-red-500";
      case "facebook":
        return "bg-blue-700";
      default:
        return "bg-gray-500";
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredPosts =
    selectedPlatform === "all"
      ? data.posts
      : data.posts.filter((post) => post.platform === selectedPlatform);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Social Media Analytics
          </h2>
          <p className="text-gray-600">
            Track your content performance across platforms
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
          </select>
          <Button onClick={() => setLoading(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.insights.crossPlatformReach.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Engagement</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.insights.totalEngagement.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">+8.3% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(
                    (data.insights.totalEngagement /
                      data.insights.crossPlatformReach) *
                    100
                  ).toFixed(1)}
                  %
                </p>
                <p className="text-sm text-green-600">+2.1% from last month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.posts.length}
                </p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Platform Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.platformMetrics.map((platform, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full text-white ${getPlatformColor(platform.platform)}`}
                    >
                      {getPlatformIcon(platform.platform)}
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {platform.platform}
                      </p>
                      <p className="text-sm text-gray-600">
                        {platform.totalPosts} posts
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {platform.totalReach.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">reach</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Top Hashtags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.insights.topHashtags.map((hashtag, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{hashtag.tag}</span>
                    <Badge variant="secondary">{hashtag.usage} uses</Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    {hashtag.reach.toLocaleString()} reach
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Recent Posts Performance
            </span>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPosts.slice(0, 10).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full text-white ${getPlatformColor(post.platform)}`}
                  >
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {post.content.substring(0, 50)}...
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-600">
                        {post.publishedAt.toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600 flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {post.metrics.reach.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-600 flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {post.metrics.likes}
                        </span>
                        <span className="text-xs text-gray-600 flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {post.metrics.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {post.engagementRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-600">engagement rate</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaFetcher;
