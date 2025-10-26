import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  History,
  RotateCcw,
  Eye,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  GitBranch,
  Download,
  Trash2,
} from "lucide-react";

interface VersionSnapshot {
  id: string;
  version: string;
  timestamp: string;
  author: string;
  action: "created" | "updated" | "published" | "draft_saved";
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  snapshot: any;
  isPublished: boolean;
}

interface VersionHistoryProps {
  projectId: string;
  onRevert: (version: VersionSnapshot) => void;
  onRestore: (version: VersionSnapshot) => void;
  className?: string;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({
  projectId,
  onRevert,
  onRestore,
  className = "",
}) => {
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [selectedVersion, setSelectedVersion] =
    useState<VersionSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    loadVersionHistory();
  }, [projectId]);

  const loadVersionHistory = async () => {
    setIsLoading(true);
    try {
      // Load from localStorage
      const storedVersions = localStorage.getItem(
        `project-versions-${projectId}`,
      );
      if (storedVersions) {
        const parsedVersions = JSON.parse(storedVersions);
        setVersions(
          parsedVersions.sort(
            (a: VersionSnapshot, b: VersionSnapshot) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          ),
        );
      }
    } catch (error) {
      console.error("Failed to load version history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateVersionSnapshot = (
    project: any,
    action: string,
    changes: any[] = [],
  ): VersionSnapshot => {
    return {
      id: `version_${Date.now()}`,
      version: `v${versions.length + 1}`,
      timestamp: new Date().toISOString(),
      author: "Current User", // In real app, get from auth context
      action: action as any,
      changes,
      snapshot: JSON.parse(JSON.stringify(project)), // Deep clone
      isPublished: action === "published",
    };
  };

  const saveVersionSnapshot = (snapshot: VersionSnapshot) => {
    const updatedVersions = [snapshot, ...versions];
    setVersions(updatedVersions);
    localStorage.setItem(
      `project-versions-${projectId}`,
      JSON.stringify(updatedVersions),
    );
  };

  const handleRevert = (version: VersionSnapshot) => {
    if (
      window.confirm(
        `Are you sure you want to revert to ${version.version}? This will overwrite your current changes.`,
      )
    ) {
      onRevert(version);
    }
  };

  const handleRestore = (version: VersionSnapshot) => {
    if (
      window.confirm(
        `Are you sure you want to restore ${version.version} as the current version?`,
      )
    ) {
      onRestore(version);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "published":
        return <GitBranch className="w-4 h-4 text-blue-600" />;
      case "updated":
        return <History className="w-4 h-4 text-gray-600" />;
      case "draft_saved":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <History className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "bg-green-100 text-green-800";
      case "published":
        return "bg-blue-100 text-blue-800";
      case "updated":
        return "bg-gray-100 text-gray-800";
      case "draft_saved":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderChanges = (changes: any[]) => {
    if (changes.length === 0) return null;

    return (
      <div className="mt-2 space-y-1">
        {changes.map((change, index) => (
          <div key={index} className="text-xs text-gray-600">
            <span className="font-medium">{change.field}:</span>
            <span className="text-red-600 line-through ml-1">
              {change.oldValue}
            </span>
            <span className="text-green-600 ml-1">{change.newValue}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderDiff = (version: VersionSnapshot) => {
    if (!version.changes || version.changes.length === 0) {
      return (
        <div className="text-sm text-gray-500 italic">
          No specific changes recorded
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {version.changes.map((change, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm capitalize">
                {change.field}
              </span>
              <Badge variant="outline" className="text-xs">
                Changed
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                <span className="font-medium">Before:</span>{" "}
                {change.oldValue || "Empty"}
              </div>
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                <span className="font-medium">After:</span>{" "}
                {change.newValue || "Empty"}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">
            Loading version history...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No version history yet</p>
              <p className="text-sm text-gray-400">
                Changes will be tracked automatically
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    selectedVersion?.id === version.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getActionIcon(version.action)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            {version.version}
                          </span>
                          <Badge className={getActionColor(version.action)}>
                            {version.action.replace("_", " ")}
                          </Badge>
                          {version.isPublished && (
                            <Badge
                              variant="outline"
                              className="text-blue-600 border-blue-200"
                            >
                              Published
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{version.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(version.timestamp)}</span>
                          </div>
                        </div>
                        {renderChanges(version.changes)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedVersion(version)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevert(version)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version Details Modal */}
      {selectedVersion && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {selectedVersion.version} Details
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDiff(!showDiff)}
                >
                  {showDiff ? "Hide" : "Show"} Diff
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedVersion(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Version:</span>
                  <span className="ml-2">{selectedVersion.version}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Author:</span>
                  <span className="ml-2">{selectedVersion.author}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="ml-2">
                    {new Date(selectedVersion.timestamp).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2">
                    {selectedVersion.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {showDiff && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Changes</h4>
                  {renderDiff(selectedVersion)}
                </div>
              )}

              <div className="flex items-center space-x-3 pt-4 border-t">
                <Button
                  onClick={() => handleRestore(selectedVersion)}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore This Version</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRevert(selectedVersion)}
                  className="flex items-center space-x-2"
                >
                  <History className="w-4 h-4" />
                  <span>Revert To This</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VersionHistory;
