import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { platform } = params;
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.json(
        { error: `OAuth error: ${error}` },
        { status: 400 },
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code not provided" },
        { status: 400 },
      );
    }

    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(platform, code);

    if (!tokenData) {
      return NextResponse.json(
        { error: "Failed to exchange code for token" },
        { status: 400 },
      );
    }

    // Store or update platform token
    await prisma.platformToken.upsert({
      where: {
        userId_platform: {
          userId: session.user.id,
          platform,
        },
      },
      update: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
        scope: tokenData.scope ? tokenData.scope.split(" ") : [],
        isActive: true,
      },
      create: {
        userId: session.user.id,
        platform,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
        scope: tokenData.scope ? tokenData.scope.split(" ") : [],
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully connected to ${platform}`,
      platform,
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json(
      { error: "Failed to process OAuth callback" },
      { status: 500 },
    );
  }
}

async function exchangeCodeForToken(
  platform: string,
  code: string,
): Promise<any> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/oauth/callback/${platform}`;

  const clientId = process.env[`${platform.toUpperCase()}_CLIENT_ID`];
  const clientSecret = process.env[`${platform.toUpperCase()}_CLIENT_SECRET`];

  if (!clientId || !clientSecret) {
    throw new Error(
      `Missing ${platform.toUpperCase()}_CLIENT_ID or ${platform.toUpperCase()}_CLIENT_SECRET`,
    );
  }

  const tokenUrl = getTokenUrl(platform);
  const body = getTokenRequestBody(
    platform,
    code,
    clientId,
    clientSecret,
    redirectUri,
  );

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return await response.json();
}

function getTokenUrl(platform: string): string {
  switch (platform) {
    case "linkedin":
      return "https://www.linkedin.com/oauth/v2/accessToken";
    case "twitter":
      return "https://api.twitter.com/2/oauth2/token";
    case "reddit":
      return "https://www.reddit.com/api/v1/access_token";
    case "facebook":
    case "instagram":
      return "https://graph.facebook.com/v18.0/oauth/access_token";
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

function getTokenRequestBody(
  platform: string,
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Record<string, string> {
  const baseBody = {
    grant_type: "authorization_code",
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  };

  switch (platform) {
    case "linkedin":
      return baseBody;
    case "twitter":
      return {
        ...baseBody,
        code_verifier: "challenge", // Should be stored from initial auth request
      };
    case "reddit":
      return {
        ...baseBody,
        grant_type: "authorization_code",
      };
    case "facebook":
    case "instagram":
      return baseBody;
    default:
      return baseBody;
  }
}



