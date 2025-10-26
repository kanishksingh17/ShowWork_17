// Project Management Type Definitions

export interface Technology {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0-100
  experience: string;
  projects: number;
  isRecommended: boolean;
  icon?: string;
  color?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  category: "images" | "videos" | "audio" | "documents";
  metadata?: {
    duration?: number; // for video/audio
    resolution?: string; // for video
    format?: string;
    bitrate?: number; // for audio
  };
}

export interface CodeQualityMetrics {
  overallScore: number; // 0-100
  testCoverage: number; // percentage
  openIssues: number;
  criticalBugs: number;
  complexity: "low" | "medium" | "high";
  lastCommit: Date;
  contributors: number;
  dependencies: {
    outdated: number;
    vulnerable: number;
  };
  languages: Array<{
    name: string;
    percentage: number;
  }>;
  insights: string[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  dueDate: Date;
  completedDate?: Date;
  progress: number; // 0-100
}

export interface ProjectTimelineEvent {
  id: string;
  type: "commit" | "release" | "milestone" | "team-change" | "update";
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  metadata?: any;
}

export interface ProjectStats {
  commits: number;
  pullRequests: number;
  releases: number;
  issues: number;
  contributors: number;
  stars: number;
  forks: number;
  watchers: number;
}

export interface ProjectPerformance {
  buildTime: number; // in seconds
  bundleSize: number; // in bytes
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  dependencies: {
    total: number;
    outdated: number;
    vulnerable: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  status: "draft" | "in-progress" | "completed" | "archived";
  visibility: "public" | "private" | "unlisted";
  technologies: Technology[];
  media: {
    images: MediaFile[];
    videos: MediaFile[];
    audio: MediaFile[];
    documents: MediaFile[];
  };
  codeQuality: CodeQualityMetrics;
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  userId: string;
  // New enhanced fields
  milestones?: ProjectMilestone[];
  readme?: string;
  stats?: ProjectStats;
  timeline?: ProjectTimelineEvent[];
  performance?: ProjectPerformance;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  status?: "draft" | "in-progress" | "completed" | "archived";
  visibility?: "public" | "private" | "unlisted";
  technologies: Technology[];
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  longDescription?: string;
  category?: string;
  status?: "draft" | "in-progress" | "completed" | "archived";
  visibility?: "public" | "private" | "unlisted";
  technologies?: Technology[];
  githubUrl?: string;
  liveUrl?: string;
  tags?: string[];
}

export interface ProjectFilters {
  status?: string[];
  category?: string[];
  visibility?: string[];
  technologies?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ProjectSortOptions {
  field:
    | "name"
    | "createdAt"
    | "updatedAt"
    | "views"
    | "likes"
    | "codeQuality.overallScore";
  order: "asc" | "desc";
}

export interface ProjectStats {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  totalViews: number;
  totalLikes: number;
  averageQualityScore: number;
  topTechnologies: Array<{
    name: string;
    count: number;
  }>;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: "uploading" | "completed" | "error";
  error?: string;
}

export interface MediaUploadResult {
  success: boolean;
  file?: MediaFile;
  error?: string;
}

export interface GitHubRepositoryInfo {
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  languages: Array<{
    name: string;
    percentage: number;
  }>;
  stars: number;
  forks: number;
  openIssues: number;
  lastCommit: Date;
  contributors: number;
  defaultBranch: string;
  url: string;
}
