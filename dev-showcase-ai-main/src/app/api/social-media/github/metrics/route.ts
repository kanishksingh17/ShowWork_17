import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token required" },
        { status: 401 },
      );
    }

    // Fetch GitHub user data
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch GitHub user data");
    }

    const user = await userResponse.json();

    // Fetch user's repositories
    const reposResponse = await fetch(
      "https://api.github.com/user/repos?per_page=100",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    let repos = [];
    if (reposResponse.ok) {
      repos = await reposResponse.json();
    }

    // Calculate metrics from repositories
    const totalStars = repos.reduce(
      (sum, repo) => sum + (repo.stargazers_count || 0),
      0,
    );
    const totalForks = repos.reduce(
      (sum, repo) => sum + (repo.forks_count || 0),
      0,
    );
    const totalWatchers = repos.reduce(
      (sum, repo) => sum + (repo.watchers_count || 0),
      0,
    );
    const totalIssues = repos.reduce(
      (sum, repo) => sum + (repo.open_issues_count || 0),
      0,
    );

    // Calculate engagement rate
    const totalEngagement = totalStars + totalForks + totalIssues;
    const totalRepos = repos.length;
    const engagementRate = totalRepos > 0 ? totalEngagement / totalRepos : 0;

    const metrics = {
      followers: user.followers || 0,
      following: user.following || 0,
      publicRepos: user.public_repos || 0,
      totalStars,
      totalForks,
      totalWatchers,
      totalIssues,
      engagementRate,
      reach: totalStars + totalForks,
      impressions: totalWatchers,
      profileViews: user.followers || 0,
      collaborators: user.followers || 0,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("GitHub metrics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub metrics" },
      { status: 500 },
    );
  }
}
