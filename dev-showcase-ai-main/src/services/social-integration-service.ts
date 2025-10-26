import { SocialLink } from "../types/portfolio";

export interface SocialProfile {
  platform: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  followers?: number;
  verified: boolean;
  url: string;
}

export class SocialIntegrationService {
  private githubToken?: string;
  private linkedinToken?: string;

  constructor(tokens: { github?: string; linkedin?: string }) {
    this.githubToken = tokens.github;
    this.linkedinToken = tokens.linkedin;
  }

  /**
   * Auto-fetch GitHub profile information
   */
  async fetchGitHubProfile(username: string): Promise<SocialProfile | null> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: this.githubToken
          ? {
              Authorization: `token ${this.githubToken}`,
              Accept: "application/vnd.github.v3+json",
            }
          : {
              Accept: "application/vnd.github.v3+json",
            },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        platform: "github",
        username: data.login,
        displayName: data.name || data.login,
        bio: data.bio || "",
        avatar: data.avatar_url,
        followers: data.followers,
        verified: data.site_admin || false,
        url: data.html_url,
      };
    } catch (error) {
      console.error("Error fetching GitHub profile:", error);
      return null;
    }
  }

  /**
   * Auto-fetch LinkedIn profile information
   */
  async fetchLinkedInProfile(profileId: string): Promise<SocialProfile | null> {
    try {
      // Note: LinkedIn API requires special permissions and approval
      // This is a simplified implementation
      const response = await fetch(
        `https://api.linkedin.com/v2/people/${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${this.linkedinToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        platform: "linkedin",
        username: data.id,
        displayName: `${data.firstName} ${data.lastName}`,
        bio: data.summary || "",
        avatar: data.profilePicture?.displayImage || "",
        verified: false,
        url: data.publicProfileUrl,
      };
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error);
      return null;
    }
  }

  /**
   * Auto-fetch Twitter profile information
   */
  async fetchTwitterProfile(username: string): Promise<SocialProfile | null> {
    try {
      // Note: Twitter API v2 requires authentication
      const response = await fetch(
        `https://api.twitter.com/2/users/by/username/${username}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Twitter API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        platform: "twitter",
        username: data.data.username,
        displayName: data.data.name,
        bio: data.data.description || "",
        avatar: data.data.profile_image_url,
        followers: data.data.public_metrics?.followers_count,
        verified: data.data.verified || false,
        url: `https://twitter.com/${data.data.username}`,
      };
    } catch (error) {
      console.error("Error fetching Twitter profile:", error);
      return null;
    }
  }

  /**
   * Auto-detect and fetch all available social profiles
   */
  async autoDetectSocialProfiles(userData: any): Promise<SocialLink[]> {
    const socialLinks: SocialLink[] = [];

    try {
      // Extract GitHub username from various sources
      const githubUsername = this.extractGitHubUsername(userData);
      if (githubUsername) {
        const githubProfile = await this.fetchGitHubProfile(githubUsername);
        if (githubProfile) {
          socialLinks.push({
            platform: "github",
            url: githubProfile.url,
            isAutoFetched: true,
            isVisible: true,
          });
        }
      }

      // Extract LinkedIn profile from various sources
      const linkedinProfile = this.extractLinkedInProfile(userData);
      if (linkedinProfile) {
        const linkedinData = await this.fetchLinkedInProfile(linkedinProfile);
        if (linkedinData) {
          socialLinks.push({
            platform: "linkedin",
            url: linkedinData.url,
            isAutoFetched: true,
            isVisible: true,
          });
        }
      }

      // Extract Twitter username
      const twitterUsername = this.extractTwitterUsername(userData);
      if (twitterUsername) {
        const twitterProfile = await this.fetchTwitterProfile(twitterUsername);
        if (twitterProfile) {
          socialLinks.push({
            platform: "twitter",
            url: twitterProfile.url,
            isAutoFetched: true,
            isVisible: true,
          });
        }
      }

      // Extract website URL
      const websiteUrl = this.extractWebsiteUrl(userData);
      if (websiteUrl) {
        socialLinks.push({
          platform: "website",
          url: websiteUrl,
          isAutoFetched: true,
          isVisible: true,
        });
      }

      // Extract email
      const email = this.extractEmail(userData);
      if (email) {
        socialLinks.push({
          platform: "email",
          url: `mailto:${email}`,
          isAutoFetched: true,
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error auto-detecting social profiles:", error);
    }

    return socialLinks;
  }

  /**
   * Validate and clean social media URLs
   */
  validateSocialUrl(platform: string, url: string): boolean {
    const patterns = {
      github: /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/?$/,
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-\.]+\/?$/,
      twitter: /^https?:\/\/(www\.)?twitter\.com\/[\w\-\.]+\/?$/,
      instagram: /^https?:\/\/(www\.)?instagram\.com\/[\w\-\.]+\/?$/,
      website: /^https?:\/\/[\w\-\.]+\.[a-zA-Z]{2,}\/?$/,
      email: /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    };

    return patterns[platform as keyof typeof patterns]?.test(url) || false;
  }

  private extractGitHubUsername(userData: any): string | null {
    // Try to extract from various sources
    const sources = [
      userData.github,
      userData.githubUsername,
      userData.social?.github,
      userData.links?.github,
    ];

    for (const source of sources) {
      if (source) {
        // Extract username from URL or direct username
        const match = source.match(/(?:github\.com\/)?([\w\-\.]+)/);
        if (match) return match[1];
      }
    }

    return null;
  }

  private extractLinkedInProfile(userData: any): string | null {
    const sources = [
      userData.linkedin,
      userData.linkedinProfile,
      userData.social?.linkedin,
      userData.links?.linkedin,
    ];

    for (const source of sources) {
      if (source) {
        const match = source.match(/linkedin\.com\/in\/([\w\-\.]+)/);
        if (match) return match[1];
      }
    }

    return null;
  }

  private extractTwitterUsername(userData: any): string | null {
    const sources = [
      userData.twitter,
      userData.twitterUsername,
      userData.social?.twitter,
      userData.links?.twitter,
    ];

    for (const source of sources) {
      if (source) {
        const match = source.match(/(?:twitter\.com\/)?@?([\w\-\.]+)/);
        if (match) return match[1];
      }
    }

    return null;
  }

  private extractWebsiteUrl(userData: any): string | null {
    const sources = [
      userData.website,
      userData.personalWebsite,
      userData.portfolio,
      userData.links?.website,
    ];

    for (const source of sources) {
      if (source && this.isValidUrl(source)) {
        return source;
      }
    }

    return null;
  }

  private extractEmail(userData: any): string | null {
    return userData.email || userData.contactEmail || null;
  }

  private isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }
}
