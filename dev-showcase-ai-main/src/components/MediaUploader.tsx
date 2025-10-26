import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Image,
  Video,
  FileText,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video" | "gif";
  compressed?: boolean;
  uploadProgress?: number;
  uploadStatus?: "pending" | "uploading" | "completed" | "error";
}

interface MediaUploaderProps {
  onFilesChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onFilesChange,
  maxFiles = 10,
  maxSize = 50,
  acceptedTypes = ["image/*", "video/*"],
  className = "",
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (
    file: File,
    quality: number = 0.8,
  ): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920px width)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality,
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const processFile = async (file: File): Promise<MediaFile> => {
    const id = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const preview = URL.createObjectURL(file);

    let processedFile = file;
    let compressed = false;

    // Compress images
    if (file.type.startsWith("image/") && file.size > 1024 * 1024) {
      // > 1MB
      setIsCompressing(true);
      try {
        processedFile = await compressImage(file);
        compressed = true;
      } catch (error) {
        console.error("Compression failed:", error);
      } finally {
        setIsCompressing(false);
      }
    }

    const mediaFile: MediaFile = {
      id,
      file: processedFile,
      preview,
      type: file.type.startsWith("video/")
        ? "video"
        : file.type === "image/gif"
          ? "gif"
          : "image",
      compressed,
      uploadStatus: "pending",
    };

    return mediaFile;
  };

  const handleFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles: File[] = [];

      // Validate files
      for (const file of fileArray) {
        if (file.size > maxSize * 1024 * 1024) {
          alert(
            `File ${file.name} is too large. Maximum size is ${maxSize}MB.`,
          );
          continue;
        }

        if (
          !acceptedTypes.some((type) => {
            if (type.endsWith("/*")) {
              return file.type.startsWith(type.slice(0, -1));
            }
            return file.type === type;
          })
        ) {
          alert(`File ${file.name} is not a supported type.`);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      // Check max files limit
      if (files.length + validFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      // Process files
      const processedFiles: MediaFile[] = [];
      for (const file of validFiles) {
        try {
          const processedFile = await processFile(file);
          processedFiles.push(processedFile);
        } catch (error) {
          console.error("Failed to process file:", file.name, error);
        }
      }

      const updatedFiles = [...files, ...processedFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, maxFiles, maxSize, acceptedTypes, onFilesChange],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [handleFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        handleFiles(selectedFiles);
      }
    },
    [handleFiles],
  );

  const removeFile = (id: string) => {
    const updatedFiles = files.filter((file) => file.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "gif":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload Media Files
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Supports images, videos, and GIFs up to {maxSize}MB each
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {file.type === "image" || file.type === "gif" ? (
                    <img
                      src={file.preview}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.file.size)}
                      {file.compressed && " (compressed)"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.uploadStatus === "uploading" && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  )}
                  {file.uploadStatus === "completed" && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compression Status */}
      {isCompressing && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Compressing images...</span>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
