export interface SocialMediaMetrics {
  platform: SocialPlatform;
  followers: number;
  following: number;
  posts: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  engagementRate: number;
  reach: number;
  impressions: number;
  profileViews: number;
  connections: number;
  lastUpdated: Date;
}

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  likes: number;
  shares: number;
  comments: number;
  engagement: number;
  reach: number;
  impressions: number;
  publishedAt: Date;
  url: string;
}

export interface SocialEngagement {
  platform: SocialPlatform;
  totalEngagement: number;
  averageEngagement: number;
  topPerformingPost: SocialPost;
  engagementTrend: EngagementTrend[];
  bestPostingTimes: PostingTime[];
  hashtagPerformance: HashtagPerformance[];
}

export interface EngagementTrend {
  date: string;
  engagement: number;
  reach: number;
  impressions: number;
}

export interface PostingTime {
  hour: number;
  day: string;
  averageEngagement: number;
  posts: number;
}

export interface HashtagPerformance {
  hashtag: string;
  posts: number;
  totalEngagement: number;
  averageEngagement: number;
  reach: number;
}

export type SocialPlatform =
  | "linkedin"
  | "github"
  | "twitter"
  | "instagram"
  | "aggregated";

export interface SocialMediaAnalytics {
  platforms: {
    linkedin: SocialMediaMetrics;
    github: SocialMediaMetrics;
    twitter: SocialMediaMetrics;
    instagram: SocialMediaMetrics;
  };
  total: SocialMediaMetrics;
  engagement: SocialEngagement;
  recentPosts: SocialPost[];
  topPerformingPosts: SocialPost[];
  growthMetrics: GrowthMetrics;
  crossPlatformAnalysis: CrossPlatformAnalysis;
}

export interface GrowthMetrics {
  followersGrowth: GrowthData[];
  engagementGrowth: GrowthData[];
  reachGrowth: GrowthData[];
  impressionsGrowth: GrowthData[];
}

export interface GrowthData {
  date: string;
  value: number;
  change: number;
  changePercentage: number;
}

export interface CrossPlatformAnalysis {
  totalReach: number;
  totalImpressions: number;
  totalEngagement: number;
  averageEngagementRate: number;
  platformDistribution: PlatformDistribution[];
  contentPerformance: ContentPerformance[];
}

export interface PlatformDistribution {
  platform: SocialPlatform;
  percentage: number;
  value: number;
}

export interface ContentPerformance {
  contentType: string;
  totalPosts: number;
  averageEngagement: number;
  totalReach: number;
  bestPlatform: SocialPlatform;
}
