import {
  PlatformAdapter,
  PublishPayload,
  PublishResult,
  MetricsResult,
} from "./index";

export class InstagramAdapter implements PlatformAdapter {
  async publish(
    token: string,
    payload: PublishPayload,
  ): Promise<PublishResult> {
    try {
      // Instagram Basic Display API doesn't support posting
      // This would require Instagram Graph API with business account
      // For now, return a placeholder response
      return {
        success: false,
        error:
          "Instagram posting requires Instagram Graph API with business account",
        platformResponse: {
          message:
            "Instagram posting not implemented - requires business account setup",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Instagram publish error: ${error}`,
      };
    }
  }

  async getMetrics(token: string, postId: string): Promise<MetricsResult> {
    try {
      // Instagram Graph API - Get media insights
      const response = await fetch(
        `https://graph.instagram.com/v18.0/${postId}/insights?metric=impressions,reach,likes,comments,shares,saved`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Instagram metrics");
      }

      const data = await response.json();
      const insights = data.data || [];

      const metrics: MetricsResult = {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
        engagement: 0,
      };

      insights.forEach((insight: any) => {
        switch (insight.name) {
          case "impressions":
            metrics.impressions = insight.values?.[0]?.value || 0;
            break;
          case "reach":
            metrics.views = insight.values?.[0]?.value || 0;
            break;
          case "likes":
            metrics.likes = insight.values?.[0]?.value || 0;
            break;
          case "comments":
            metrics.comments = insight.values?.[0]?.value || 0;
            break;
          case "shares":
            metrics.shares = insight.values?.[0]?.value || 0;
            break;
        }
      });

      // Calculate engagement rate
      metrics.engagement = metrics.likes + metrics.comments + metrics.shares;

      return metrics;
    } catch (error) {
      console.error("Instagram metrics error:", error);
      return {};
    }
  }
}

