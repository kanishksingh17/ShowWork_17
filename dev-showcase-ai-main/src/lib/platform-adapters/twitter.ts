import {
  PlatformAdapter,
  PublishPayload,
  PublishResult,
  MetricsResult,
} from "./index";

export class TwitterAdapter implements PlatformAdapter {
  async publish(
    token: string,
    payload: PublishPayload,
  ): Promise<PublishResult> {
    try {
      // Twitter API v2 - Create Tweet
      const response = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: payload.message,
          // Note: Media upload would require separate API calls
          // and media_ids array in the tweet payload
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: `Twitter API error: ${error.detail || error.title}`,
          platformResponse: error,
        };
      }

      const result = await response.json();
      return {
        success: true,
        postId: result.data.id,
        url: `https://twitter.com/user/status/${result.data.id}`,
        platformResponse: result,
      };
    } catch (error) {
      return {
        success: false,
        error: `Twitter publish error: ${error}`,
      };
    }
  }

  async getMetrics(token: string, postId: string): Promise<MetricsResult> {
    try {
      const response = await fetch(
        `https://api.twitter.com/2/tweets/${postId}?tweet.fields=public_metrics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Twitter metrics");
      }

      const data = await response.json();
      const metrics = data.data?.public_metrics;

      if (!metrics) {
        return {};
      }

      return {
        views: metrics.impression_count || 0,
        likes: metrics.like_count || 0,
        comments: metrics.reply_count || 0,
        shares: metrics.retweet_count || 0,
        clicks: metrics.url_link_clicks || 0,
        impressions: metrics.impression_count || 0,
        engagement:
          (metrics.like_count || 0) +
          (metrics.reply_count || 0) +
          (metrics.retweet_count || 0),
      };
    } catch (error) {
      console.error("Twitter metrics error:", error);
      return {};
    }
  }
}



