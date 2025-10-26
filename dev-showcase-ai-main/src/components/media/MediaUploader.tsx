// Media Uploader Component - Unified file upload interface for showcase projects

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Upload,
  X,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  Plus,
  Camera,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaFile, UploadProgress } from "@/types/project";
import VideoRecorder from "./VideoRecorder";
import AudioRecorder from "./AudioRecorder";

interface MediaUploaderProps {
  projectId: string;
  onFilesUploaded: (files: MediaFile[]) => void;
  onError?: (error: string) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  className?: string;
}

interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  result?: MediaFile;
}

export default function MediaUploader({
  projectId,
  onFilesUploaded,
  onError,
  maxFiles = 10,
  maxFileSize = 100, // 100MB
  allowedTypes = ["image/*", "video/*", "audio/*", "application/pdf", "text/*"],
  className,
}: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);

  // Validate file
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        return `File size exceeds ${maxFileSize}MB limit`;
      }

      // Check file type
      const isValidType = allowedTypes.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `File type ${file.type} is not supported`;
      }

      return null;
    },
    [maxFileSize, allowedTypes],
  );

  // Get file category
  const getFileCategory = useCallback(
    (mimeType: string): "images" | "videos" | "audio" | "documents" => {
      if (mimeType.startsWith("image/")) return "images";
      if (mimeType.startsWith("video/")) return "videos";
      if (mimeType.startsWith("audio/")) return "audio";
      return "documents";
    },
    [],
  );

  // Get file icon
  const getFileIcon = useCallback((mimeType: string) => {
    if (mimeType.startsWith("image/")) return FileImage;
    if (mimeType.startsWith("video/")) return FileVideo;
    if (mimeType.startsWith("audio/")) return FileAudio;
    return FileText;
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // Simulate file upload (replace with actual API call)
  const uploadFile = useCallback(
    async (file: File): Promise<MediaFile> => {
      return new Promise((resolve, reject) => {
        const category = getFileCategory(file.type);
        const id = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Simulate successful upload
            const mediaFile: MediaFile = {
              id,
              name: file.name,
              type: file.type,
              size: file.size,
              url: URL.createObjectURL(file), // In real app, this would be S3 URL
              uploadedAt: new Date().toISOString(),
              category,
              metadata: {
                originalName: file.name,
                uploadedAt: new Date().toISOString(),
              },
            };

            resolve(mediaFile);
          }
        }, 200);
      });
    },
    [getFileCategory],
  );

  // Handle file selection
  const handleFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);

      if (fileArray.length + uploadedFiles.length > maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const newTasks: UploadTask[] = [];

      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          onError?.(validationError);
          continue;
        }

        const task: UploadTask = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
          file,
          progress: 0,
          status: "pending",
        };

        newTasks.push(task);
      }

      setUploadTasks((prev) => [...prev, ...newTasks]);
      setIsUploading(true);

      // Upload files
      for (const task of newTasks) {
        try {
          setUploadTasks((prev) =>
            prev.map((t) =>
              t.id === task.id ? { ...t, status: "uploading" } : t,
            ),
          );

          const result = await uploadFile(task.file);

          setUploadTasks((prev) =>
            prev.map((t) =>
              t.id === task.id ? { ...t, status: "completed", result } : t,
            ),
          );

          setUploadedFiles((prev) => [...prev, result]);
        } catch (error) {
          setUploadTasks((prev) =>
            prev.map((t) =>
              t.id === task.id
                ? {
                    ...t,
                    status: "error",
                    error:
                      error instanceof Error ? error.message : "Upload failed",
                  }
                : t,
            ),
          );
        }
      }

      setIsUploading(false);
    },
    [uploadedFiles.length, maxFiles, validateFile, onError, uploadFile],
  );

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles],
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles],
  );

  // Remove uploaded file
  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  // Retry failed upload
  const retryUpload = useCallback(
    async (taskId: string) => {
      const task = uploadTasks.find((t) => t.id === taskId);
      if (!task) return;

      try {
        setUploadTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: "uploading", error: undefined }
              : t,
          ),
        );

        const result = await uploadFile(task.file);

        setUploadTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: "completed", result } : t,
          ),
        );

        setUploadedFiles((prev) => [...prev, result]);
      } catch (error) {
        setUploadTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : t,
          ),
        );
      }
    },
    [uploadTasks, uploadFile],
  );

  // Handle recorded video
  const handleVideoRecorded = useCallback(
    (file: File) => {
      handleFiles(new FileList([file]));
      setShowVideoRecorder(false);
    },
    [handleFiles],
  );

  // Handle recorded audio
  const handleAudioRecorded = useCallback(
    (file: File) => {
      handleFiles(new FileList([file]));
      setShowAudioRecorder(false);
    },
    [handleFiles],
  );

  // Notify parent of uploaded files
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      onFilesUploaded(uploadedFiles);
    }
  }, [uploadedFiles, onFilesUploaded]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Project Media
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Drop Zone */}
          <div
            ref={dropZoneRef}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drag and drop files here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse files
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Choose Files
                </Button>

                <Button
                  onClick={() => setShowVideoRecorder(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Record Video
                </Button>

                <Button
                  onClick={() => setShowAudioRecorder(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Voice Note
                </Button>
              </div>

              <p className="text-xs text-gray-400">
                Supports images, videos, audio, and documents up to{" "}
                {maxFileSize}MB
              </p>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Upload Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploadTasks.map((task) => {
              const Icon = getFileIcon(task.file.type);

              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Icon className="w-5 h-5 text-gray-500" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(task.file.size)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status === "completed" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}

                    {task.status === "error" && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => retryUpload(task.id)}
                          className="h-6 px-2"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    {task.status === "uploading" && (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Uploaded Files ({uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => {
                const Icon = getFileIcon(file.type);

                return (
                  <div
                    key={file.id}
                    className="group relative bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-8 h-8 text-gray-500 flex-shrink-0" />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {file.category}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(file.url, "_blank")}
                          className="h-6 w-6 p-0"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(file.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Recorder Modal */}
      {showVideoRecorder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Record Video</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVideoRecorder(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              <VideoRecorder
                onRecordingComplete={handleVideoRecorded}
                onError={onError}
              />
            </div>
          </div>
        </div>
      )}

      {/* Audio Recorder Modal */}
      {showAudioRecorder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Record Audio</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAudioRecorder(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              <AudioRecorder
                onRecordingComplete={handleAudioRecorded}
                onError={onError}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
