import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schedulePostSchema = z.object({
  projectId: z.string(),
  platforms: z.array(
    z.enum(["linkedin", "twitter", "reddit", "facebook", "instagram"]),
  ),
  scheduledAt: z.string().datetime(),
  customMessage: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, platforms, scheduledAt, customMessage } =
      schedulePostSchema.parse(body);

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Generate platform-specific messages
    const messageByPlatform = await generatePlatformMessages(
      project,
      platforms,
      customMessage,
    );

    // Create scheduled post
    const scheduledPost = await prisma.scheduledPost.create({
      data: {
        userId: session.user.id,
        projectId,
        platforms,
        messageByPlatform,
        mediaUrls: project.imageUrl ? [project.imageUrl] : [],
        scheduledAt: new Date(scheduledAt),
        status: "SCHEDULED",
      },
    });

    // Enqueue job in BullMQ queue
    const { publishQueue } = await import("@/lib/queue");
    await publishQueue.add(
      "publish-post",
      { scheduledPostId: scheduledPost.id },
      {
        delay: new Date(scheduledAt).getTime() - Date.now(),
      },
    );

    return NextResponse.json({
      success: true,
      scheduledPost: {
        id: scheduledPost.id,
        platforms: scheduledPost.platforms,
        scheduledAt: scheduledPost.scheduledAt,
        status: scheduledPost.status,
      },
    });
  } catch (error) {
    console.error("Error scheduling post:", error);
    return NextResponse.json(
      { error: "Failed to schedule post" },
      { status: 500 },
    );
  }
}

async function generatePlatformMessages(
  project: any,
  platforms: string[],
  customMessage?: string,
): Promise<Record<string, string>> {
  const messages: Record<string, string> = {};

  for (const platform of platforms) {
    switch (platform) {
      case "twitter":
        messages[platform] = generateTwitterMessage(project, customMessage);
        break;
      case "linkedin":
        messages[platform] = generateLinkedInMessage(project, customMessage);
        break;
      case "reddit":
        messages[platform] = generateRedditMessage(project, customMessage);
        break;
      case "facebook":
      case "instagram":
        messages[platform] = generateFacebookMessage(project, customMessage);
        break;
    }
  }

  return messages;
}

function generateTwitterMessage(project: any, customMessage?: string): string {
  if (customMessage) return customMessage;

  const hashtags = project.tags
    .slice(0, 3)
    .map((tag: string) => `#${tag.replace(/\s+/g, "")}`)
    .join(" ");
  const message = `🚀 Just completed "${project.name}"! ${project.description}`;
  const links = [project.liveUrl, project.githubUrl].filter(Boolean).join(" ");

  const fullMessage = `${message}\n\n${links}\n\n${hashtags}`;

  // Ensure under 280 characters
  return fullMessage.length > 280
    ? message.substring(0, 277) + "..."
    : fullMessage;
}

function generateLinkedInMessage(project: any, customMessage?: string): string {
  if (customMessage) return customMessage;

  return `Excited to share my latest project: ${project.name}

${project.description}

${project.longDescription || ""}

Technologies used: ${project.technologies.join(", ")}

${project.liveUrl ? `🔗 Live demo: ${project.liveUrl}` : ""}
${project.githubUrl ? `📂 Source code: ${project.githubUrl}` : ""}

#${project.tags.join(" #")}`;
}

function generateRedditMessage(project: any, customMessage?: string): string {
  if (customMessage) return customMessage;

  return `**${project.name}**

${project.description}

**Technologies:** ${project.technologies.join(", ")}

${project.liveUrl ? `[Live Demo](${project.liveUrl})` : ""}
${project.githubUrl ? `[GitHub](${project.githubUrl})` : ""}

What do you think? Any feedback or suggestions would be appreciated!`;
}

function generateFacebookMessage(project: any, customMessage?: string): string {
  if (customMessage) return customMessage;

  return `🎉 New project alert! 

${project.name}

${project.description}

Built with: ${project.technologies.join(", ")}

${project.liveUrl ? `Check it out: ${project.liveUrl}` : ""}
${project.githubUrl ? `Source code: ${project.githubUrl}` : ""}

#${project.tags.join(" #")}`;
}
