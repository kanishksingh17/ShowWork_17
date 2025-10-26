// Media Upload Service - S3 integration for file uploads

import { S3Client, S3Config, S3Object } from "./s3Service";
import { MediaFile, UploadProgress, MediaUploadResult } from "@/types/project";

export interface MediaUploadOptions {
  projectId: string;
  userId: string;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (result: MediaUploadResult) => void;
  onError?: (error: string) => void;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export class MediaUploadService {
  private s3Client: S3Client;
  private config: S3Config;

  constructor(config: S3Config) {
    this.config = config;
    this.s3Client = new S3Client(config);
  }

  // Validate file before upload
  validateFile(file: File): FileValidationResult {
    // Check file size (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum limit of 100MB`,
      };
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not supported`,
      };
    }

    return { isValid: true };
  }

  // Get file category based on MIME type
  getFileCategory(
    mimeType: string,
  ): "images" | "videos" | "audio" | "documents" {
    if (mimeType.startsWith("image/")) return "images";
    if (mimeType.startsWith("video/")) return "videos";
    if (mimeType.startsWith("audio/")) return "audio";
    return "documents";
  }

  // Generate unique filename
  generateFileName(
    projectId: string,
    category: string,
    originalName: string,
  ): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileExtension = originalName.split(".").pop();
    return `${projectId}/${category}/${timestamp}-${randomId}.${fileExtension}`;
  }

  // Upload single file
  async uploadFile(
    file: File,
    options: MediaUploadOptions,
  ): Promise<MediaUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      const category = this.getFileCategory(file.type);
      const fileName = this.generateFileName(
        options.projectId,
        category,
        file.name,
      );

      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Create S3 object
      const s3Object: S3Object = {
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000",
        Metadata: {
          "original-name": file.name,
          "uploaded-by": options.userId,
          "project-id": options.projectId,
          "upload-date": new Date().toISOString(),
        },
      };

      // Upload to S3
      const uploadResult = await this.s3Client.putObject(s3Object);

      // Generate CDN URL
      const cdnUrl = `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${fileName}`;

      // Create media file object
      const mediaFile: MediaFile = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: cdnUrl,
        uploadedAt: new Date().toISOString(),
        category,
        metadata: {
          originalName: file.name,
          uploadedBy: options.userId,
          projectId: options.projectId,
          s3Key: fileName,
          s3Location: uploadResult.Location,
        },
      };

      // Call completion callback
      if (options.onComplete) {
        options.onComplete({ success: true, file: mediaFile });
      }

      return { success: true, file: mediaFile };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";

      if (options.onError) {
        options.onError(errorMessage);
      }

      return { success: false, error: errorMessage };
    }
  }

  // Upload multiple files
  async uploadFiles(
    files: File[],
    options: MediaUploadOptions,
  ): Promise<MediaUploadResult[]> {
    const results: MediaUploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Update progress
      if (options.onProgress) {
        options.onProgress({
          fileId: `${file.name}-${i}`,
          fileName: file.name,
          progress: (i / files.length) * 100,
          status: "uploading",
        });
      }

      const result = await this.uploadFile(file, options);
      results.push(result);

      // Update progress to completed
      if (options.onProgress) {
        options.onProgress({
          fileId: `${file.name}-${i}`,
          fileName: file.name,
          progress: 100,
          status: result.success ? "completed" : "error",
          error: result.error,
        });
      }
    }

    return results;
  }

  // Delete file from S3
  async deleteFile(s3Key: string): Promise<boolean> {
    try {
      await this.s3Client.deleteObject(s3Key);
      return true;
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      return false;
    }
  }

  // Get file URL
  getFileUrl(s3Key: string): string {
    return `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${s3Key}`;
  }

  // Generate thumbnail for video (placeholder - would need FFmpeg in production)
  async generateVideoThumbnail(videoFile: File): Promise<string | null> {
    // This is a placeholder implementation
    // In production, you would use FFmpeg or a service like AWS Lambda
    // to generate thumbnails from video files

    return new Promise((resolve) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.onloadedmetadata = () => {
        canvas.width = 320;
        canvas.height = 180;

        video.currentTime = 1; // Seek to 1 second
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve(thumbnailDataUrl);
        } else {
          resolve(null);
        }
      };

      video.onerror = () => resolve(null);
      video.src = URL.createObjectURL(videoFile);
    });
  }

  // Optimize image before upload
  async optimizeImage(
    file: File,
    maxWidth: number = 1920,
    quality: number = 0.8,
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(optimizedFile);
              } else {
                reject(new Error("Failed to optimize image"));
              }
            },
            "image/jpeg",
            quality,
          );
        } else {
          reject(new Error("Canvas context not available"));
        }
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Create default instance
const defaultConfig: S3Config = {
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
  bucketName: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || "",
};

export const mediaUploadService = new MediaUploadService(defaultConfig);
