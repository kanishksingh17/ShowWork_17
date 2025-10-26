import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Image,
  Upload,
  Plus,
  X,
  Eye,
  Edit3,
  Download,
  Share2,
  Play,
  Mic,
  FileText,
  ArrowLeft,
  LayoutDashboard,
  Code,
  User,
  BarChart3,
  Users,
  FolderOpen,
  Zap,
  Settings,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  ExternalLink,
} from "lucide-react";

interface MediaFile {
  id: number;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  category: string;
}

interface ProjectMediaProps {
  onBackToDashboard?: () => void;
}

const ProjectMedia = ({ onBackToDashboard }: ProjectMediaProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Media", icon: Image },
    { id: "screenshots", name: "Screenshots", icon: Image },
    { id: "videos", name: "Videos", icon: Play },
    { id: "audio", name: "Audio", icon: Mic },
    { id: "documents", name: "Documents", icon: FileText },
  ];

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = ((i + 1) / files.length) * 100;
      setUploadProgress(progress);

      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMediaFile: MediaFile = {
        id: Date.now() + i,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        category: getCategoryFromType(file.type),
      };

      setMediaFiles((prev) => [...prev, newMediaFile]);
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  const getCategoryFromType = (type: string): string => {
    if (type.startsWith("image/")) return "screenshots";
    if (type.startsWith("video/")) return "videos";
    if (type.startsWith("audio/")) return "audio";
    return "documents";
  };

  const removeMedia = (id: number) => {
    setMediaFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const filteredMedia = mediaFiles.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getMediaIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.startsWith("video/")) return Play;
    if (type.startsWith("audio/")) return Mic;
    return FileText;
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white flex flex-col rounded-xl shadow-lg m-4">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#1E3A8A] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-mono text-sm font-bold">
              &lt;/&gt;
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white">ShowWork</h1>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={onBackToDashboard}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </div>
          <div className="flex items-center px-4 py-3 text-sm font-medium bg-[#1E3A8A] text-white rounded-lg shadow-sm">
            <Image className="w-5 h-5 mr-3" />
            Project Media
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/analytics")}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/community")}
          >
            <Users className="w-5 h-5 mr-3" />
            Community
          </div>
          <div
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate("/portfolio")}
          >
            <FolderOpen className="w-5 h-5 mr-3" />
            Portfolio
          </div>
          <div className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200">
            <Zap className="w-5 h-5 mr-3" />
            Integrations
          </div>
        </nav>

        <div className="px-4 py-2 border-t border-white/10">
          <div className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm text-gray-500 mb-1">
                <button
                  onClick={onBackToDashboard}
                  className="hover:text-gray-700"
                >
                  Dashboard
                </button>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Project Media</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">
                Project Media
              </h1>
              <p className="text-sm text-gray-500">
                Manage your project screenshots, videos, and documents
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Media
              </Button>
              <Button className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Smart Tips */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-green-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Smart Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-800 mb-2">
                  Projects with media get 3x more views!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-green-600" />
                    <span>Screenshots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-green-600" />
                    <span>Demo Videos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-green-600" />
                    <span>Voice Notes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span>Documents</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Project Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1E3A8A] transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-[#1E3A8A] rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Uploading files...
                        </h3>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#1E3A8A] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {uploadProgress.toFixed(0)}% complete
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Drag and drop your files here
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Images, videos, audio, or documents (max 10MB each)
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Files
                        </Button>
                        <Button variant="outline" type="button">
                          <Play className="w-4 h-4 mr-2" />
                          Record Video
                        </Button>
                        <Button variant="outline" type="button">
                          <Mic className="w-4 h-4 mr-2" />
                          Voice Note
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search media files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Media Gallery */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Media Gallery ({filteredMedia.length} files)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredMedia.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No media files yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Upload some media to showcase your project
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredMedia.map((media) => {
                      const MediaIcon = getMediaIcon(media.type);
                      return (
                        <div
                          key={media.id}
                          className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            {media.type.startsWith("image/") ? (
                              <img
                                src={media.url}
                                alt={media.name}
                                className="w-full h-full object-cover"
                              />
                            ) : media.type.startsWith("video/") ? (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 relative">
                                <video
                                  src={media.url}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                  <Play className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            ) : media.type.startsWith("audio/") ? (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <div className="text-center">
                                  <Mic className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <audio
                                    src={media.url}
                                    controls
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <FileText className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Overlay Actions */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="secondary">
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeMedia(media.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* File Info */}
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 text-sm truncate">
                                {media.name}
                              </h4>
                              <MediaIcon className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{formatFileSize(media.size)}</span>
                              <span>
                                {new Date(
                                  media.uploadedAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {
                                  categories.find(
                                    (cat) => cat.id === media.category,
                                  )?.name
                                }
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Media Statistics */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Media Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {categories.slice(1).map((category) => {
                    const categoryFiles = mediaFiles.filter(
                      (file) => file.category === category.id,
                    );
                    const totalSize = categoryFiles.reduce(
                      (sum, file) => sum + file.size,
                      0,
                    );
                    const Icon = category.icon;

                    return (
                      <div
                        key={category.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <h4 className="font-medium text-gray-900">
                            {category.name}
                          </h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Files</span>
                            <span className="font-medium text-[#1E3A8A]">
                              {categoryFiles.length}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Size</span>
                            <span className="font-medium text-gray-900">
                              {formatFileSize(totalSize)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project Info
            </Button>
            <div className="flex gap-3">
              <Button variant="outline">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Media
              </Button>
              <Button className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectMedia;
