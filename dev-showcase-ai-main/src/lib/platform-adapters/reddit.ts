import {
  PlatformAdapter,
  PublishPayload,
  PublishResult,
  MetricsResult,
} from "./index";

export class RedditAdapter implements PlatformAdapter {
  async publish(
    token: string,
    payload: PublishPayload,
  ): Promise<PublishResult> {
    try {
      // Reddit API - Submit a link or text post
      const response = await fetch("https://oauth.reddit.com/api/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "PortfolioBuilder/1.0",
        },
        body: new URLSearchParams({
          kind: "self", // text post
          sr: payload.metadata?.subreddit || "programming", // default subreddit
          text: payload.message,
          title: payload.metadata?.title || "New Project",
          api_type: "json",
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Reddit API error: ${error}`,
          platformResponse: await response.json().catch(() => null),
        };
      }

      const result = await response.json();
      const postId = result.json?.data?.id;
      const subreddit = result.json?.data?.subreddit;

      return {
        success: true,
        postId: postId,
        url: `https://reddit.com/r/${subreddit}/comments/${postId}`,
        platformResponse: result,
      };
    } catch (error) {
      return {
        success: false,
        error: `Reddit publish error: ${error}`,
      };
    }
  }

  async getMetrics(token: string, postId: string): Promise<MetricsResult> {
    try {
      const response = await fetch(
        `https://oauth.reddit.com/api/info?id=t3_${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "PortfolioBuilder/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Reddit metrics");
      }

      const data = await response.json();
      const post = data.data?.children?.[0]?.data;

      if (!post) {
        return {};
      }

      return {
        views: 0, // Reddit doesn't provide view counts via API
        likes: post.ups || 0,
        comments: post.num_comments || 0,
        shares: 0, // Reddit doesn't have shares
        clicks: 0,
        impressions: 0,
        engagement: (post.ups || 0) + (post.num_comments || 0),
      };
    } catch (error) {
      console.error("Reddit metrics error:", error);
      return {};
    }
  }
}


