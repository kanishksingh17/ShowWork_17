import crypto from "crypto";

export async function verifyWebhookSignature(
  platform: string,
  body: string,
  signature: string | null,
): Promise<boolean> {
  if (!signature) {
    return false;
  }

  switch (platform) {
    case "linkedin":
      return verifyLinkedInSignature(body, signature);
    case "twitter":
      return verifyTwitterSignature(body, signature);
    case "reddit":
      return verifyRedditSignature(body, signature);
    case "facebook":
    case "instagram":
      return verifyFacebookSignature(body, signature);
    default:
      return false;
  }
}

function verifyLinkedInSignature(body: string, signature: string): boolean {
  const secret = process.env.LINKEDIN_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

function verifyTwitterSignature(body: string, signature: string): boolean {
  const secret = process.env.TWITTER_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

function verifyRedditSignature(body: string, signature: string): boolean {
  const secret = process.env.REDDIT_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

function verifyFacebookSignature(body: string, signature: string): boolean {
  const secret = process.env.FACEBOOK_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}


