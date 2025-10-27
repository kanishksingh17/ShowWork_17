import {
  PlatformAdapter,
  PublishPayload,
  PublishResult,
  MetricsResult,
} from "./index";

export class LinkedInAdapter implements PlatformAdapter {
  async publish(
    token: string,
    payload: PublishPayload,
  ): Promise<PublishResult> {
    try {
      // LinkedIn UGC (User Generated Content) API
      const ugcResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: `urn:li:person:${await this.getPersonUrn(token)}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: payload.message,
              },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        }),
      });

      if (!ugcResponse.ok) {
        const error = await ugcResponse.text();
        return {
          success: false,
          error: `LinkedIn API error: ${error}`,
          platformResponse: await ugcResponse.json().catch(() => null),
        };
      }

      const result = await ugcResponse.json();
      return {
        success: true,
        postId: result.id,
        url: `https://www.linkedin.com/feed/update/${result.id}`,
        platformResponse: result,
      };
    } catch (error) {
      return {
        success: false,
        error: `LinkedIn publish error: ${error}`,
      };
    }
  }

  async getMetrics(token: string, postId: string): Promise<MetricsResult> {
    try {
      // LinkedIn doesn't provide direct metrics API for UGC posts
      // This would require LinkedIn Marketing API or webhook integration
      return {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      };
    } catch (error) {
      console.error("LinkedIn metrics error:", error);
      return {};
    }
  }

  private async getPersonUrn(token: string): Promise<string> {
    const response = await fetch("https://api.linkedin.com/v2/people/~", {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get LinkedIn person URN");
    }

    const data = await response.json();
    return data.id;
  }
}


