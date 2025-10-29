import { prisma } from "@/lib/prisma";
import { getAdapter } from "@/lib/platform-adapters";

export interface PublishJob {
  scheduledPostId: string;
}

export class PublishWorker {
  async processJob(job: PublishJob): Promise<void> {
    const { scheduledPostId } = job;

    try {
      // Get the scheduled post
      const scheduledPost = await prisma.scheduledPost.findUnique({
        where: { id: scheduledPostId },
        include: {
          user: true,
          project: true,
        },
      });

      if (!scheduledPost) {
        throw new Error(`Scheduled post not found: ${scheduledPostId}`);
      }

      // Update status to processing
      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: { status: "PROCESSING" },
      });

      const results: Record<string, any> = {};
      const errors: Record<string, string> = {};

      // Process each platform
      for (const platform of scheduledPost.platforms) {
        try {
          // Get user's token for this platform
          const platformToken = await prisma.platformToken.findUnique({
            where: {
              userId_platform: {
                userId: scheduledPost.userId,
                platform,
              },
            },
          });

          if (!platformToken || !platformToken.isActive) {
            throw new Error(`No active token found for platform: ${platform}`);
          }

          // Get platform adapter
          const adapter = getAdapter(platform);

          // Prepare payload
          const payload = {
            message: scheduledPost.messageByPlatform[platform],
            mediaUrls: scheduledPost.mediaUrls,
            metadata: {
              projectId: scheduledPost.projectId,
              projectName: scheduledPost.project.name,
              projectUrl: scheduledPost.project.liveUrl,
            },
          };

          // Publish to platform
          const result = await adapter.publish(
            platformToken.accessToken,
            payload,
          );

          // Log the attempt
          await prisma.publishLog.create({
            data: {
              scheduledPostId,
              platform,
              attempt: 1,
              status: result.success ? "SUCCESS" : "FAILED",
              platformResponse: result.platformResponse,
              platformPostId: result.postId,
              errorMessage: result.error,
            },
          });

          if (result.success) {
            results[platform] = {
              postId: result.postId,
              url: result.url,
            };
          } else {
            errors[platform] = result.error || "Unknown error";
          }
        } catch (error) {
          console.error(`Error publishing to ${platform}:`, error);

          // Log the failed attempt
          await prisma.publishLog.create({
            data: {
              scheduledPostId,
              platform,
              attempt: 1,
              status: "FAILED",
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
            },
          });

          errors[platform] =
            error instanceof Error ? error.message : "Unknown error";
        }
      }

      // Update final status
      const hasErrors = Object.keys(errors).length > 0;
      const hasSuccess = Object.keys(results).length > 0;

      let finalStatus: "POSTED" | "FAILED";
      if (hasSuccess && !hasErrors) {
        finalStatus = "POSTED";
      } else if (hasSuccess && hasErrors) {
        finalStatus = "POSTED"; // Partial success
      } else {
        finalStatus = "FAILED";
      }

      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: {
          status: finalStatus,
          result: {
            results,
            errors,
            processedAt: new Date().toISOString(),
          },
        },
      });

      // Schedule metrics collection for successful posts
      if (hasSuccess) {
        await this.scheduleMetricsCollection(scheduledPostId, results);
      }
    } catch (error) {
      console.error("Publish worker error:", error);

      // Update status to failed
      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: {
          status: "FAILED",
          result: {
            error: error instanceof Error ? error.message : "Unknown error",
            processedAt: new Date().toISOString(),
          },
        },
      });
    }
  }

  private async scheduleMetricsCollection(
    scheduledPostId: string,
    results: Record<string, any>,
  ): Promise<void> {
    // Schedule metrics collection for each successful platform
    for (const [platform, result] of Object.entries(results)) {
      if (result.postId) {
        // TODO: Schedule metrics collection job
        // This would be a separate job that runs periodically
        // to collect metrics from platform APIs
        console.log(
          `Scheduled metrics collection for ${platform} post ${result.postId}`,
        );
      }
    }
  }
}

// Export singleton instance
export const publishWorker = new PublishWorker();



