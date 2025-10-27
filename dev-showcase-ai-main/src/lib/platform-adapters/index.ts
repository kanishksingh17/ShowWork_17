import { LinkedInAdapter } from "./linkedin";
import { TwitterAdapter } from "./twitter";
import { RedditAdapter } from "./reddit";
import { FacebookAdapter } from "./facebook";
import { InstagramAdapter } from "./instagram";

export interface PlatformAdapter {
  publish(token: string, payload: PublishPayload): Promise<PublishResult>;
  getMetrics(token: string, postId: string): Promise<MetricsResult>;
}

export interface PublishPayload {
  message: string;
  mediaUrls?: string[];
  metadata?: Record<string, any>;
}

export interface PublishResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
  platformResponse?: any;
}

export interface MetricsResult {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  clicks?: number;
  impressions?: number;
  engagement?: number;
}

export const platformAdapters: Record<string, PlatformAdapter> = {
  linkedin: new LinkedInAdapter(),
  twitter: new TwitterAdapter(),
  reddit: new RedditAdapter(),
  facebook: new FacebookAdapter(),
  instagram: new InstagramAdapter(),
};

export function getAdapter(platform: string): PlatformAdapter {
  const adapter = platformAdapters[platform];
  if (!adapter) {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  return adapter;
}


