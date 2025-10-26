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

interface ProjectData {
  id: string;
  title: string;
  tagline: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  primaryTag: string;
  techTags: string[];
  category: string;
  mediaPreview: string | null;
  status: string;
  [key: string]: any;
}

class VersionService {
  private getStorageKey(projectId: string): string {
    return `project-versions-${projectId}`;
  }

  private generateVersionId(): string {
    return `version_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateVersionNumber(existingVersions: VersionSnapshot[]): string {
    return `v${existingVersions.length + 1}`;
  }

  private detectChanges(oldData: ProjectData, newData: ProjectData): any[] {
    const changes: any[] = [];
    const fieldsToTrack = [
      "title",
      "tagline",
      "description",
      "githubUrl",
      "liveUrl",
      "primaryTag",
      "techTags",
      "category",
      "status",
    ];

    fieldsToTrack.forEach((field) => {
      const oldValue = oldData[field];
      const newValue = newData[field];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field,
          oldValue: this.formatValue(oldValue),
          newValue: this.formatValue(newValue),
        });
      }
    });

    return changes;
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined) return "Empty";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }

  createSnapshot(
    projectId: string,
    projectData: ProjectData,
    action: "created" | "updated" | "published" | "draft_saved",
    previousData?: ProjectData,
  ): VersionSnapshot {
    const existingVersions = this.getVersions(projectId);
    const changes = previousData
      ? this.detectChanges(previousData, projectData)
      : [];

    const snapshot: VersionSnapshot = {
      id: this.generateVersionId(),
      version: this.generateVersionNumber(existingVersions),
      timestamp: new Date().toISOString(),
      author: "Current User", // In real app, get from auth context
      action,
      changes,
      snapshot: JSON.parse(JSON.stringify(projectData)), // Deep clone
      isPublished: action === "published",
    };

    this.saveSnapshot(projectId, snapshot);
    return snapshot;
  }

  getVersions(projectId: string): VersionSnapshot[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(projectId));
      if (!stored) return [];

      const versions = JSON.parse(stored);
      return versions.sort(
        (a: VersionSnapshot, b: VersionSnapshot) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    } catch (error) {
      console.error("Failed to load versions:", error);
      return [];
    }
  }

  getVersion(projectId: string, versionId: string): VersionSnapshot | null {
    const versions = this.getVersions(projectId);
    return versions.find((v) => v.id === versionId) || null;
  }

  private saveSnapshot(projectId: string, snapshot: VersionSnapshot): void {
    try {
      const existingVersions = this.getVersions(projectId);
      const updatedVersions = [snapshot, ...existingVersions];

      // Keep only last 50 versions to prevent storage bloat
      const trimmedVersions = updatedVersions.slice(0, 50);

      localStorage.setItem(
        this.getStorageKey(projectId),
        JSON.stringify(trimmedVersions),
      );
    } catch (error) {
      console.error("Failed to save version:", error);
    }
  }

  deleteVersion(projectId: string, versionId: string): boolean {
    try {
      const versions = this.getVersions(projectId);
      const updatedVersions = versions.filter((v) => v.id !== versionId);

      localStorage.setItem(
        this.getStorageKey(projectId),
        JSON.stringify(updatedVersions),
      );
      return true;
    } catch (error) {
      console.error("Failed to delete version:", error);
      return false;
    }
  }

  clearVersionHistory(projectId: string): boolean {
    try {
      localStorage.removeItem(this.getStorageKey(projectId));
      return true;
    } catch (error) {
      console.error("Failed to clear version history:", error);
      return false;
    }
  }

  exportVersionHistory(projectId: string): string {
    const versions = this.getVersions(projectId);
    return JSON.stringify(versions, null, 2);
  }

  importVersionHistory(projectId: string, historyData: string): boolean {
    try {
      const versions = JSON.parse(historyData);
      if (!Array.isArray(versions)) {
        throw new Error("Invalid version history format");
      }

      localStorage.setItem(this.getStorageKey(projectId), historyData);
      return true;
    } catch (error) {
      console.error("Failed to import version history:", error);
      return false;
    }
  }

  getVersionStats(projectId: string): {
    totalVersions: number;
    publishedVersions: number;
    draftVersions: number;
    lastModified: string | null;
    averageChangesPerVersion: number;
  } {
    const versions = this.getVersions(projectId);

    if (versions.length === 0) {
      return {
        totalVersions: 0,
        publishedVersions: 0,
        draftVersions: 0,
        lastModified: null,
        averageChangesPerVersion: 0,
      };
    }

    const publishedVersions = versions.filter((v) => v.isPublished).length;
    const draftVersions = versions.length - publishedVersions;
    const totalChanges = versions.reduce((sum, v) => sum + v.changes.length, 0);
    const averageChanges = totalChanges / versions.length;

    return {
      totalVersions: versions.length,
      publishedVersions,
      draftVersions,
      lastModified: versions[0]?.timestamp || null,
      averageChangesPerVersion: Math.round(averageChanges * 100) / 100,
    };
  }
}

export const versionService = new VersionService();
export type { VersionSnapshot, ProjectData };
