import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedSidebar } from "../components/UnifiedSidebar";

export default function Content() {
  const navigate = useNavigate();

  // Mock content data
  const contentItems = [
    {
      id: 1,
      title: "React Portfolio Project",
      type: "Blog Post",
      status: "Published",
      publishDate: "2024-01-15",
      views: 1250,
      engagement: 8.5,
    },
    {
      id: 2,
      title: "JavaScript Best Practices",
      type: "Article",
      status: "Draft",
      publishDate: null,
      views: 0,
      engagement: 0,
    },
    {
      id: 3,
      title: "CSS Grid Layout Guide",
      type: "Tutorial",
      status: "Scheduled",
      publishDate: "2024-01-20",
      views: 0,
      engagement: 0,
    },
    {
      id: 4,
      title: "Node.js Performance Tips",
      type: "Blog Post",
      status: "Published",
      publishDate: "2024-01-10",
      views: 890,
      engagement: 12.3,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Published":
        return <CheckCircle className="w-4 h-4" />;
      case "Draft":
        return <Edit className="w-4 h-4" />;
      case "Scheduled":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Unified Sidebar */}
      <UnifiedSidebar currentPage="content" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content</h1>
              <p className="text-gray-600">
                Manage your content, articles, and publications
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Content
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Content</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-gray-900">18</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Drafts</p>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                  </div>
                  <Edit className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Scheduled</p>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">{item.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(item.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(item.status)}
                          {item.status}
                        </div>
                      </Badge>

                      {item.status === "Published" && (
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {item.views.toLocaleString()} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            {item.engagement}% engagement
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Calendar Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Content Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Content calendar will be displayed here</p>
                <Button variant="outline" className="mt-4">
                  View Full Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
