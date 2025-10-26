// Custom hook for media upload functionality

import { useState, useCallback, useRef } from "react";
import { MediaFile, UploadProgress } from "@/types/project";
import { mediaUploadService } from "@/services/mediaUploadService";

interface UseMediaUploadOptions {
  projectId: string;
  userId: string;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (files: MediaFile[]) => void;
  onError?: (error: string) => void;
}

interface UseMediaUploadReturn {
  uploadedFiles: MediaFile[];
  uploadProgress: UploadProgress[];
  isUploading: boolean;
  uploadFile: (file: File) => Promise<MediaFile>;
  uploadFiles: (files: File[]) => Promise<MediaFile[]>;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  retryUpload: (fileId: string) => Promise<void>;
  getUploadStatus: (fileId: string) => UploadProgress | undefined;
}

export function useMediaUpload({
  projectId,
  userId,
  onProgress,
  onComplete,
  onError,
}: UseMediaUploadOptions): UseMediaUploadReturn {
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const uploadTasksRef = useRef<Map<string, UploadProgress>>(new Map());

  // Update progress
  const updateProgress = useCallback(
    (progress: UploadProgress) => {
      setUploadProgress((prev) => {
        const updated = prev.filter((p) => p.fileId !== progress.fileId);
        return [...updated, progress];
      });

      uploadTasksRef.current.set(progress.fileId, progress);
      onProgress?.(progress);
    },
    [onProgress],
  );

  // Upload single file
  const uploadFile = useCallback(
    async (file: File): Promise<MediaFile> => {
      const fileId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

      // Initialize progress
      updateProgress({
        fileId,
        fileName: file.name,
        progress: 0,
        status: "uploading",
      });

      try {
        setIsUploading(true);

        const result = await mediaUploadService.uploadFile(file, {
          projectId,
          userId,
          onProgress: (progress) => {
            updateProgress({
              fileId,
              fileName: file.name,
              progress: progress.progress,
              status: "uploading",
            });
          },
          onComplete: (result) => {
            if (result.success && result.file) {
              setUploadedFiles((prev) => [...prev, result.file!]);
              updateProgress({
                fileId,
                fileName: file.name,
                progress: 100,
                status: "completed",
              });
              onComplete?.([result.file]);
            }
          },
          onError: (error) => {
            updateProgress({
              fileId,
              fileName: file.name,
              progress: 0,
              status: "error",
              error,
            });
            onError?.(error);
          },
        });

        if (result.success && result.file) {
          return result.file;
        } else {
          throw new Error(result.error || "Upload failed");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        updateProgress({
          fileId,
          fileName: file.name,
          progress: 0,
          status: "error",
          error: errorMessage,
        });
        onError?.(errorMessage);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [projectId, userId, updateProgress, onComplete, onError],
  );

  // Upload multiple files
  const uploadFiles = useCallback(
    async (files: File[]): Promise<MediaFile[]> => {
      const results: MediaFile[] = [];

      for (const file of files) {
        try {
          const result = await uploadFile(file);
          results.push(result);
        } catch (error) {
          // Continue with other files
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }

      return results;
    },
    [uploadFile],
  );

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    setUploadProgress((prev) => prev.filter((p) => p.fileId !== fileId));
    uploadTasksRef.current.delete(fileId);
  }, []);

  // Clear all files
  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
    setUploadProgress([]);
    uploadTasksRef.current.clear();
  }, []);

  // Retry upload
  const retryUpload = useCallback(
    async (fileId: string) => {
      const progress = uploadTasksRef.current.get(fileId);
      if (!progress || progress.status !== "error") {
        return;
      }

      // Find the original file from uploaded files or create a new one
      const existingFile = uploadedFiles.find((f) => f.id === fileId);
      if (!existingFile) {
        onError?.("File not found for retry");
        return;
      }

      // Create a new file from the existing one
      const file = new File([], existingFile.name, { type: existingFile.type });

      try {
        await uploadFile(file);
      } catch (error) {
        // Error handling is done in uploadFile
      }
    },
    [uploadedFiles, uploadFile, onError],
  );

  // Get upload status
  const getUploadStatus = useCallback(
    (fileId: string): UploadProgress | undefined => {
      return uploadTasksRef.current.get(fileId);
    },
    [],
  );

  return {
    uploadedFiles,
    uploadProgress,
    isUploading,
    uploadFile,
    uploadFiles,
    removeFile,
    clearFiles,
    retryUpload,
    getUploadStatus,
  };
}
