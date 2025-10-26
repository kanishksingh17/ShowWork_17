import {
  SocialMediaMetrics,
  SocialPlatform,
  SocialPost,
  SocialEngagement,
} from "@/types/socialMedia";

interface SocialMediaConfig {
  linkedin: {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
  };
  github: {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
  };
  twitter: {
    apiKey: string;
    apiSecret: string;
    accessToken?: string;
    accessTokenSecret?: string;
  };
  instagram: {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
  };
}

class SocialMediaService {
  private config: SocialMediaConfig;
  private baseUrl = "/api/social-media";

  constructor() {
    this.config = {
      linkedin: {
        clientId: process.env.LINKEDIN_CLIENT_ID || "",
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
        accessToken: process.env.LINKEDIN_ACCESS_TOKEN || "",
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        accessToken: process.env.GITHUB_ACCESS_TOKEN || "",
      },
      twitter: {
        apiKey: process.env.TWITTER_API_KEY || "",
        apiSecret: process.env.TWITTER_API_SECRET || "",
        accessToken: process.env.TWITTER_ACCESS_TOKEN || "",
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
      },
      instagram: {
        clientId: process.env.INSTAGRAM_CLIENT_ID || "",
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || "",
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || "",
      },
    };
  }

  // LinkedIn Integration
  async getLinkedInMetrics(): Promise<SocialMediaMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/linkedin/metrics`, {
        headers: {
          Authorization: `Bearer ${this.config.linkedin.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch LinkedIn metrics");
      }

      const data = await response.json();
      return this.transformLinkedInData(data);
    } catch (error) {
      console.error("LinkedIn metrics error:", error);
      return this.getMockLinkedInMetrics();
    }
  }

  async getLinkedInPosts(): Promise<SocialPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/linkedin/posts`, {
        headers: {
          Authorization: `Bearer ${this.config.linkedin.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch LinkedIn posts");
      }

      const data = await response.json();
      return this.transformLinkedInPosts(data);
    } catch (error) {
      console.error("LinkedIn posts error:", error);
      return this.getMockLinkedInPosts();
    }
  }

  // GitHub Integration
  async getGitHubMetrics(): Promise<SocialMediaMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/github/metrics`, {
        headers: {
          Authorization: `Bearer ${this.config.github.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch GitHub metrics");
      }

      const data = await response.json();
      return this.transformGitHubData(data);
    } catch (error) {
      console.error("GitHub metrics error:", error);
      return this.getMockGitHubMetrics();
    }
  }

  async getGitHubRepositories(): Promise<SocialPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/github/repositories`, {
        headers: {
          Authorization: `Bearer ${this.config.github.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch GitHub repositories");
      }

      const data = await response.json();
      return this.transformGitHubRepositories(data);
    } catch (error) {
      console.error("GitHub repositories error:", error);
      return this.getMockGitHubRepositories();
    }
  }

  // Twitter Integration
  async getTwitterMetrics(): Promise<SocialMediaMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/twitter/metrics`, {
        headers: {
          Authorization: `Bearer ${this.config.twitter.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Twitter metrics");
      }

      const data = await response.json();
      return this.transformTwitterData(data);
    } catch (error) {
      console.error("Twitter metrics error:", error);
      return this.getMockTwitterMetrics();
    }
  }

  async getTwitterPosts(): Promise<SocialPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/twitter/posts`, {
        headers: {
          Authorization: `Bearer ${this.config.twitter.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Twitter posts");
      }

      const data = await response.json();
      return this.transformTwitterPosts(data);
    } catch (error) {
      console.error("Twitter posts error:", error);
      return this.getMockTwitterPosts();
    }
  }

  // Instagram Integration
  async getInstagramMetrics(): Promise<SocialMediaMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/instagram/metrics`, {
        headers: {
          Authorization: `Bearer ${this.config.instagram.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Instagram metrics");
      }

      const data = await response.json();
      return this.transformInstagramData(data);
    } catch (error) {
      console.error("Instagram metrics error:", error);
      return this.getMockInstagramMetrics();
    }
  }

  // Aggregate all social media data
  async getAllSocialMediaMetrics(): Promise<{
    linkedin: SocialMediaMetrics;
    github: SocialMediaMetrics;
    twitter: SocialMediaMetrics;
    instagram: SocialMediaMetrics;
    total: SocialMediaMetrics;
  }> {
    try {
      const [linkedin, github, twitter, instagram] = await Promise.all([
        this.getLinkedInMetrics(),
        this.getGitHubMetrics(),
        this.getTwitterMetrics(),
        this.getInstagramMetrics(),
      ]);

      const total = this.aggregateSocialMediaMetrics([
        linkedin,
        github,
        twitter,
        instagram,
      ]);

      return {
        linkedin,
        github,
        twitter,
        instagram,
        total,
      };
    } catch (error) {
      console.error("Failed to fetch all social media metrics:", error);
      return this.getMockAllSocialMediaMetrics();
    }
  }

  // Data transformation methods
  private transformLinkedInData(data: any): SocialMediaMetrics {
    return {
      platform: "linkedin",
      followers: data.followersCount || 0,
      following: data.followingCount || 0,
      posts: data.postsCount || 0,
      totalLikes: data.totalLikes || 0,
      totalShares: data.totalShares || 0,
      totalComments: data.totalComments || 0,
      engagementRate: data.engagementRate || 0,
      reach: data.reach || 0,
      impressions: data.impressions || 0,
      profileViews: data.profileViews || 0,
      connections: data.connectionsCount || 0,
      lastUpdated: new Date(),
    };
  }

  private transformGitHubData(data: any): SocialMediaMetrics {
    return {
      platform: "github",
      followers: data.followers || 0,
      following: data.following || 0,
      posts: data.publicRepos || 0,
      totalLikes: data.totalStars || 0,
      totalShares: data.totalForks || 0,
      totalComments: data.totalComments || 0,
      engagementRate: data.engagementRate || 0,
      reach: data.reach || 0,
      impressions: data.impressions || 0,
      profileViews: data.profileViews || 0,
      connections: data.collaborators || 0,
      lastUpdated: new Date(),
    };
  }

  private transformTwitterData(data: any): SocialMediaMetrics {
    return {
      platform: "twitter",
      followers: data.followersCount || 0,
      following: data.followingCount || 0,
      posts: data.tweetsCount || 0,
      totalLikes: data.totalLikes || 0,
      totalShares: data.totalRetweets || 0,
      totalComments: data.totalReplies || 0,
      engagementRate: data.engagementRate || 0,
      reach: data.reach || 0,
      impressions: data.impressions || 0,
      profileViews: data.profileViews || 0,
      connections: data.followingCount || 0,
      lastUpdated: new Date(),
    };
  }

  private transformInstagramData(data: any): SocialMediaMetrics {
    return {
      platform: "instagram",
      followers: data.followersCount || 0,
      following: data.followingCount || 0,
      posts: data.mediaCount || 0,
      totalLikes: data.totalLikes || 0,
      totalShares: data.totalShares || 0,
      totalComments: data.totalComments || 0,
      engagementRate: data.engagementRate || 0,
      reach: data.reach || 0,
      impressions: data.impressions || 0,
      profileViews: data.profileViews || 0,
      connections: data.followingCount || 0,
      lastUpdated: new Date(),
    };
  }

  private transformLinkedInPosts(data: any[]): SocialPost[] {
    return data.map((post) => ({
      id: post.id,
      platform: "linkedin",
      content: post.text,
      likes: post.numLikes || 0,
      shares: post.numShares || 0,
      comments: post.numComments || 0,
      engagement: post.engagement || 0,
      reach: post.reach || 0,
      impressions: post.impressions || 0,
      publishedAt: new Date(post.createdAt),
      url: post.url,
    }));
  }

  private transformGitHubRepositories(data: any[]): SocialPost[] {
    return data.map((repo) => ({
      id: repo.id.toString(),
      platform: "github",
      content: repo.description || repo.name,
      likes: repo.stargazersCount || 0,
      shares: repo.forksCount || 0,
      comments: repo.openIssuesCount || 0,
      engagement: (repo.stargazersCount + repo.forksCount) / 2,
      reach: repo.stargazersCount || 0,
      impressions: repo.watchersCount || 0,
      publishedAt: new Date(repo.createdAt),
      url: repo.htmlUrl,
    }));
  }

  private transformTwitterPosts(data: any[]): SocialPost[] {
    return data.map((tweet) => ({
      id: tweet.id,
      platform: "twitter",
      content: tweet.text,
      likes: tweet.publicMetrics?.likeCount || 0,
      shares: tweet.publicMetrics?.retweetCount || 0,
      comments: tweet.publicMetrics?.replyCount || 0,
      engagement:
        (tweet.publicMetrics?.likeCount + tweet.publicMetrics?.retweetCount) /
        2,
      reach: tweet.publicMetrics?.impressionCount || 0,
      impressions: tweet.publicMetrics?.impressionCount || 0,
      publishedAt: new Date(tweet.createdAt),
      url: `https://twitter.com/user/status/${tweet.id}`,
    }));
  }

  private aggregateSocialMediaMetrics(
    metrics: SocialMediaMetrics[],
  ): SocialMediaMetrics {
    return {
      platform: "aggregated",
      followers: metrics.reduce((sum, m) => sum + m.followers, 0),
      following: metrics.reduce((sum, m) => sum + m.following, 0),
      posts: metrics.reduce((sum, m) => sum + m.posts, 0),
      totalLikes: metrics.reduce((sum, m) => sum + m.totalLikes, 0),
      totalShares: metrics.reduce((sum, m) => sum + m.totalShares, 0),
      totalComments: metrics.reduce((sum, m) => sum + m.totalComments, 0),
      engagementRate:
        metrics.reduce((sum, m) => sum + m.engagementRate, 0) / metrics.length,
      reach: metrics.reduce((sum, m) => sum + m.reach, 0),
      impressions: metrics.reduce((sum, m) => sum + m.impressions, 0),
      profileViews: metrics.reduce((sum, m) => sum + m.profileViews, 0),
      connections: metrics.reduce((sum, m) => sum + m.connections, 0),
      lastUpdated: new Date(),
    };
  }

  // Mock data methods for development
  private getMockLinkedInMetrics(): SocialMediaMetrics {
    return {
      platform: "linkedin",
      followers: 1250,
      following: 890,
      posts: 45,
      totalLikes: 2340,
      totalShares: 156,
      totalComments: 89,
      engagementRate: 4.2,
      reach: 5670,
      impressions: 12340,
      profileViews: 890,
      connections: 1250,
      lastUpdated: new Date(),
    };
  }

  private getMockGitHubMetrics(): SocialMediaMetrics {
    return {
      platform: "github",
      followers: 340,
      following: 120,
      posts: 28,
      totalLikes: 1560,
      totalShares: 234,
      totalComments: 67,
      engagementRate: 3.8,
      reach: 2890,
      impressions: 4560,
      profileViews: 340,
      connections: 120,
      lastUpdated: new Date(),
    };
  }

  private getMockTwitterMetrics(): SocialMediaMetrics {
    return {
      platform: "twitter",
      followers: 890,
      following: 456,
      posts: 234,
      totalLikes: 3450,
      totalShares: 567,
      totalComments: 234,
      engagementRate: 5.1,
      reach: 6780,
      impressions: 12340,
      profileViews: 890,
      connections: 456,
      lastUpdated: new Date(),
    };
  }

  private getMockInstagramMetrics(): SocialMediaMetrics {
    return {
      platform: "instagram",
      followers: 2100,
      following: 340,
      posts: 156,
      totalLikes: 5670,
      totalShares: 234,
      totalComments: 456,
      engagementRate: 6.2,
      reach: 12340,
      impressions: 23450,
      profileViews: 2100,
      connections: 340,
      lastUpdated: new Date(),
    };
  }

  private getMockAllSocialMediaMetrics() {
    return {
      linkedin: this.getMockLinkedInMetrics(),
      github: this.getMockGitHubMetrics(),
      twitter: this.getMockTwitterMetrics(),
      instagram: this.getMockInstagramMetrics(),
      total: {
        platform: "aggregated",
        followers: 4580,
        following: 1806,
        posts: 463,
        totalLikes: 13020,
        totalShares: 1191,
        totalComments: 846,
        engagementRate: 4.8,
        reach: 27680,
        impressions: 42690,
        profileViews: 4220,
        connections: 1806,
        lastUpdated: new Date(),
      },
    };
  }

  private getMockLinkedInPosts(): SocialPost[] {
    return [
      {
        id: "1",
        platform: "linkedin",
        content:
          "Just completed an amazing React project! Check out the live demo...",
        likes: 45,
        shares: 12,
        comments: 8,
        engagement: 65,
        reach: 234,
        impressions: 456,
        publishedAt: new Date(Date.now() - 86400000),
        url: "https://linkedin.com/posts/example",
      },
    ];
  }

  private getMockGitHubRepositories(): SocialPost[] {
    return [
      {
        id: "1",
        platform: "github",
        content: "Portfolio website built with Next.js and TypeScript",
        likes: 23,
        shares: 8,
        comments: 3,
        engagement: 34,
        reach: 23,
        impressions: 45,
        publishedAt: new Date(Date.now() - 172800000),
        url: "https://github.com/user/portfolio",
      },
    ];
  }

  private getMockTwitterPosts(): SocialPost[] {
    return [
      {
        id: "1",
        platform: "twitter",
        content: "Excited to share my latest project! #webdev #react",
        likes: 12,
        shares: 5,
        comments: 3,
        engagement: 20,
        reach: 89,
        impressions: 156,
        publishedAt: new Date(Date.now() - 43200000),
        url: "https://twitter.com/user/status/123",
      },
    ];
  }
}

export const socialMediaService = new SocialMediaService();
