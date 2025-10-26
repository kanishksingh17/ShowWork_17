// Zod validation schemas for project operations

import { z } from "zod";

// Technology schema
export const TechnologySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  category: z.string().min(1).max(30),
  proficiency: z.number().min(0).max(100),
  experience: z.string().min(1).max(20),
  projects: z.number().min(0),
  isRecommended: z.boolean().default(false),
  icon: z.string().optional(),
  color: z.string().optional(),
});

// Media file schema
export const MediaFileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(255),
  type: z.string().min(1),
  size: z.number().min(0),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  uploadedAt: z.string().datetime(),
  category: z.enum(["images", "videos", "audio", "documents"]),
  metadata: z
    .object({
      duration: z.number().optional(),
      resolution: z.string().optional(),
      format: z.string().optional(),
      bitrate: z.number().optional(),
    })
    .optional(),
});

// Code quality metrics schema
export const CodeQualityMetricsSchema = z.object({
  overallScore: z.number().min(0).max(100),
  testCoverage: z.number().min(0).max(100),
  openIssues: z.number().min(0),
  criticalBugs: z.number().min(0),
  complexity: z.enum(["low", "medium", "high"]),
  lastCommit: z.date(),
  contributors: z.number().min(0),
  dependencies: z.object({
    outdated: z.number().min(0),
    vulnerable: z.number().min(0),
  }),
  languages: z.array(
    z.object({
      name: z.string(),
      percentage: z.number().min(0).max(100),
    }),
  ),
  insights: z.array(z.string()),
});

// Team member schema
export const TeamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(50),
  avatar: z.string().url().optional(),
});

// Project schema
export const ProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  longDescription: z.string().max(5000).optional(),
  category: z.string().min(1).max(50),
  status: z.enum(["draft", "in-progress", "completed", "archived"]),
  visibility: z.enum(["public", "private", "unlisted"]),
  technologies: z.array(TechnologySchema),
  media: z.object({
    images: z.array(MediaFileSchema),
    videos: z.array(MediaFileSchema),
    audio: z.array(MediaFileSchema),
    documents: z.array(MediaFileSchema),
  }),
  codeQuality: CodeQualityMetricsSchema,
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  tags: z.array(z.string().min(1).max(30)).max(10),
  teamMembers: z.array(TeamMemberSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  views: z.number().min(0),
  likes: z.number().min(0),
  userId: z.string().min(1),
});

// Create project request schema
export const CreateProjectRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  longDescription: z.string().max(5000).optional(),
  category: z.string().min(1).max(50),
  status: z
    .enum(["draft", "in-progress", "completed", "archived"])
    .default("draft"),
  visibility: z.enum(["public", "private", "unlisted"]).default("private"),
  technologies: z.array(TechnologySchema).default([]),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  tags: z.array(z.string().min(1).max(30)).max(10).default([]),
});

// Update project request schema
export const UpdateProjectRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(500).optional(),
  longDescription: z.string().max(5000).optional(),
  category: z.string().min(1).max(50).optional(),
  status: z.enum(["draft", "in-progress", "completed", "archived"]).optional(),
  visibility: z.enum(["public", "private", "unlisted"]).optional(),
  technologies: z.array(TechnologySchema).optional(),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
});

// Project filters schema
export const ProjectFiltersSchema = z.object({
  status: z.array(z.string()).optional(),
  category: z.array(z.string()).optional(),
  visibility: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  dateRange: z
    .object({
      start: z.date(),
      end: z.date(),
    })
    .optional(),
});

// Project sort options schema
export const ProjectSortOptionsSchema = z.object({
  field: z.enum([
    "name",
    "createdAt",
    "updatedAt",
    "views",
    "likes",
    "codeQuality.overallScore",
  ]),
  order: z.enum(["asc", "desc"]),
});

// Pagination schema
export const ProjectPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: ProjectSortOptionsSchema.optional(),
  filters: ProjectFiltersSchema.optional(),
});

// File upload schema
export const FileUploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.string().min(1),
  fileSize: z
    .number()
    .min(0)
    .max(100 * 1024 * 1024), // 100MB max
  category: z.enum(["images", "videos", "audio", "documents"]),
});

// Media upload request schema
export const MediaUploadRequestSchema = z.object({
  projectId: z.string().min(1),
  files: z.array(FileUploadSchema).min(1).max(10),
});

// GitHub repository schema
export const GitHubRepositorySchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  branch: z.string().default("main"),
});

// Code quality analysis request schema
export const CodeQualityAnalysisRequestSchema = z.object({
  projectId: z.string().min(1),
  githubUrl: z.string().url(),
  repository: GitHubRepositorySchema.optional(),
});

// Export types
export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>;
export type UpdateProjectRequest = z.infer<typeof UpdateProjectRequestSchema>;
export type ProjectFilters = z.infer<typeof ProjectFiltersSchema>;
export type ProjectSortOptions = z.infer<typeof ProjectSortOptionsSchema>;
export type ProjectPagination = z.infer<typeof ProjectPaginationSchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type MediaUploadRequest = z.infer<typeof MediaUploadRequestSchema>;
export type GitHubRepository = z.infer<typeof GitHubRepositorySchema>;
export type CodeQualityAnalysisRequest = z.infer<
  typeof CodeQualityAnalysisRequestSchema
>;
