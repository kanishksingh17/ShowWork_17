import {
  PlatformAdapter,
  PublishPayload,
  PublishResult,
  MetricsResult,
} from "./index";

export class FacebookAdapter implements PlatformAdapter {
  async publish(
    token: string,
    payload: PublishPayload,
  ): Promise<PublishResult> {
    try {
      // Facebook Graph API - Create a post on user's timeline
      const response = await fetch("https://graph.facebook.com/v18.0/me/feed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: payload.message,
          link: payload.metadata?.link,
          // Note: Media upload would require separate API calls
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: `Facebook API error: ${error.error?.message || "Unknown error"}`,
          platformResponse: error,
        };
      }

      const result = await response.json();
      return {
        success: true,
        postId: result.id,
        url: `https://facebook.com/${result.id}`,
        platformResponse: result,
      };
    } catch (error) {
      return {
        success: false,
        error: `Facebook publish error: ${error}`,
      };
    }
  }

  async getMetrics(token: string, postId: string): Promise<MetricsResult> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${postId}/insights?metric=post_impressions,post_engaged_users,post_reactions_by_type_total,post_comments,post_shares`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Facebook metrics");
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
          case "post_impressions":
            metrics.impressions = insight.values?.[0]?.value || 0;
            break;
          case "post_engaged_users":
            metrics.engagement = insight.values?.[0]?.value || 0;
            break;
          case "post_reactions_by_type_total":
            // Sum all reaction types
            const reactions = insight.values?.[0]?.value || {};
            metrics.likes = Object.values(reactions).reduce(
              (sum: number, count: any) => sum + (count || 0),
              0,
            );
            break;
          case "post_comments":
            metrics.comments = insight.values?.[0]?.value || 0;
            break;
          case "post_shares":
            metrics.shares = insight.values?.[0]?.value || 0;
            break;
        }
      });

      return metrics;
    } catch (error) {
      console.error("Facebook metrics error:", error);
      return {};
    }
  }
}



