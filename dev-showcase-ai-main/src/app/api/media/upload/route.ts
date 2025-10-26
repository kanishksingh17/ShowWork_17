// Media Upload API Route - Handle file uploads to S3

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MediaUploadRequestSchema } from "@/lib/validation/projectSchema";
import { S3Client } from "@/services/s3Service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/media/upload - Upload media files to S3
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const projectId = formData.get("projectId") as string;
    const files = formData.getAll("files") as File[];

    if (!projectId || !files.length) {
      return NextResponse.json(
        { success: false, message: "Project ID and files are required" },
        { status: 400 },
      );
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 },
      );
    }

    // Initialize S3 client
    const s3Config = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      region: process.env.AWS_REGION || "us-east-1",
      bucketName: process.env.AWS_S3_BUCKET_NAME!,
    };

    const s3Client = new S3Client(s3Config);

    const uploadedFiles = [];

    for (const file of files) {
      try {
        // Validate file
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} exceeds maximum size of 100MB`);
        }

        // Determine file category
        const category = getFileCategory(file.type);

        // Generate unique filename
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2);
        const fileExtension = file.name.split(".").pop();
        const fileName = `${projectId}/${category}/${timestamp}-${randomId}.${fileExtension}`;

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to S3
        const uploadResult = await s3Client.putObject({
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
          CacheControl: "public, max-age=31536000",
          Metadata: {
            "original-name": file.name,
            "uploaded-by": session.user.id,
            "project-id": projectId,
          },
        });

        // Generate CDN URL
        const cdnUrl = `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${fileName}`;

        // Save to database
        const mediaFile = await prisma.projectMediaFile.create({
          data: {
            projectId,
            name: file.name,
            type: file.type,
            size: file.size,
            url: cdnUrl,
            category: category.toUpperCase() as any,
            metadata: {
              originalName: file.name,
              uploadedAt: new Date().toISOString(),
              uploadedBy: session.user.id,
            },
          },
        });

        uploadedFiles.push(mediaFile);
      } catch (fileError) {
        console.error(`Error uploading file ${file.name}:`, fileError);
        // Continue with other files
      }
    }

    return NextResponse.json({
      success: true,
      data: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    });
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload media" },
      { status: 500 },
    );
  }
}

// Helper function to determine file category
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "images";
  if (mimeType.startsWith("video/")) return "videos";
  if (mimeType.startsWith("audio/")) return "audio";
  return "documents";
}

// GET /api/media/upload - Get upload progress (for real-time updates)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "Project ID is required" },
        { status: 400 },
      );
    }

    // Get media files for project
    const mediaFiles = await prisma.projectMediaFile.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: mediaFiles,
    });
  } catch (error) {
    console.error("Error fetching media files:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch media files" },
      { status: 500 },
    );
  }
}
