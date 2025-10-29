import { twitterAdapter } from "../../platform-adapters/twitter.js";
import { linkedinAdapter } from "../../platform-adapters/linkedin.js";
import { redditAdapter } from "../../platform-adapters/reddit.js";
import { facebookAdapter } from "../../platform-adapters/facebook.js";
import { instagramAdapter } from "../../platform-adapters/instagram.js";

export async function publishToPlatform(platform, payload) {
  switch (platform) {
    case "twitter": return twitterAdapter.publish(payload);
    case "linkedin": return linkedinAdapter.publish(payload);
    case "reddit": return redditAdapter.publish(payload);
    case "facebook": return facebookAdapter.publish(payload);
    case "instagram": return instagramAdapter.publish(payload);
    default: throw new Error(`Unsupported platform: ${platform}`);
  }
}
