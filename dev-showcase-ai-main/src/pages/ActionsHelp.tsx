import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  CheckCircle,
  AlertCircle,
  Share2,
  Download,
  ExternalLink,
  Settings,
  ArrowLeft,
  LayoutDashboard,
  Code,
  Image,
  User,
  BarChart3,
  Users,
  FolderOpen,
  Zap,
  Star,
  Eye,
  Edit3,
  Plus,
  X,
  Search,
  Lightbulb,
  TrendingUp,
  Clock,
  FileText,
  Play,
  Mic,
  Info
} from 'lucide-react';

interface Action {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface HelpSection {
  id: string;
  title: string;
  content: string;
  icon: React.ComponentType<any>;
  category: string;
}

interface ActionsHelpProps {
  onBackToDashboard?: () => void;
}

const ActionsHelp = ({ onBackToDashboard }: ActionsHelpProps) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const actions: Action[] = [
    {
      id: '1',
      title: 'Complete Project Information',
      description: 'Fill in all required project details including name, description, and tags',
      icon: Info,
      category: 'project',
      isCompleted: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Add Technology Stack',
      description: 'Select and add technologies used in your project',
      icon: Code,
      category: 'project',
      isCompleted: false,
      priority: 'high'
    },
    {
      id: '3',
      title: 'Upload Project Media',
      description: 'Add screenshots, videos, or documents to showcase your project',
      icon: Image,
      category: 'project',
      isCompleted: false,
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Share Project',
      description: 'Share your project with the community and get feedback',
      icon: Share2,
      category: 'social',
      isCompleted: false,
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Export Project Data',
      description: 'Download your project information for backup or portfolio use',
      icon: Download,
      category: 'utility',
      isCompleted: false,
      priority: 'low'
    },
    {
      id: '6',
      title: 'Update Project Settings',
      description: 'Configure project visibility, permissions, and other settings',
      icon: Settings,
      category: 'settings',
      isCompleted: false,
      priority: 'low'
    }
  ];

  const helpSections: HelpSection[] = [
    {
      id: '1',
      title: 'Getting Started',
      content: 'Learn how to create and manage your first project showcase. This guide covers the basics of setting up your project, adding information, and sharing it with others.',
      icon: Lightbulb,
      category: 'getting-started'
    },
    {
      id: '2',
      title: 'Project Management',
      content: 'Discover best practices for organizing your projects, managing media files, and keeping your showcase up to date. Learn about project categories, tags, and visibility settings.',
      icon: FolderOpen,
      category: 'project-management'
    },
    {
      id: '3',
      title: 'Media Upload',
      content: 'Understand how to upload and manage different types of media files. Learn about supported formats, file size limits, and how to organize your media gallery.',
      icon: Image,
      category: 'media'
    },
    {
      id: '4',
      title: 'Technology Stack',
      content: 'Learn how to add and manage your technology stack. Discover how to search for technologies, set proficiency levels, and organize your skills by category.',
      icon: Code,
      category: 'technology'
    },
    {
      id: '5',
      title: 'Sharing & Collaboration',
      content: 'Find out how to share your projects, collaborate with team members, and get feedback from the community. Learn about privacy settings and sharing options.',
      icon: Users,
      category: 'collaboration'
    },
    {
      id: '6',
      title: 'Troubleshooting',
      content: 'Common issues and solutions. Find answers to frequently asked questions and learn how to resolve common problems with your project showcase.',
      icon: AlertCircle,
      category: 'troubleshooting'
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: HelpCircle },
    { id: 'project', name: 'Project', icon: FolderOpen },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'utility', name: 'Utility', icon: Settings },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const filteredActions = actions.filter(action => {
    const matchesSearch = action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white flex flex-col rounded-xl shadow-lg m-4">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#1E3A8A] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-mono text-sm font-bold">&lt;/&gt;</span>
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
            <HelpCircle className="w-5 h-5 mr-3" />
            Actions & Help
          </div>
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/analytics')}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </div>
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/community')}
          >
            <Users className="w-5 h-5 mr-3" />
            Community
          </div>
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/portfolio')}
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
                <span className="text-gray-900">Actions & Help</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">Actions & Help</h1>
              <p className="text-sm text-gray-500">Manage your project actions and get help when you need it</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white">
                <Search className="w-4 h-4 mr-2" />
                Search Help
              </Button>
              <Button className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Quick Actions Summary */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Quick Actions Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <h4 className="font-medium text-red-900">High Priority</h4>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                      {actions.filter(a => a.priority === 'high' && !a.isCompleted).length}
                    </p>
                    <p className="text-sm text-red-700">Actions pending</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <h4 className="font-medium text-yellow-900">Medium Priority</h4>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {actions.filter(a => a.priority === 'medium' && !a.isCompleted).length}
                    </p>
                    <p className="text-sm text-yellow-700">Actions pending</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Completed</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {actions.filter(a => a.isCompleted).length}
                    </p>
                    <p className="text-sm text-green-700">Actions done</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search actions..."
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
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Actions List */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Available Actions ({filteredActions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredActions.map(action => {
                    const Icon = action.icon;
                    return (
                      <div key={action.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              action.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">{action.title}</h4>
                                <Badge className={`text-xs ${getPriorityColor(action.priority)}`}>
                                  {getPriorityIcon(action.priority)} {action.priority}
                                </Badge>
                                {action.isCompleted && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-600">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white">
                                  {action.isCompleted ? 'View' : 'Complete'}
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Help Sections */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Help & Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {helpSections.map(section => {
                    const Icon = section.icon;
                    return (
                      <div key={section.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="font-medium text-gray-900">{section.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{section.content}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Read More
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-gray-900 mb-2">Need Immediate Help?</h4>
                    <p className="text-sm text-gray-600 mb-3">Contact our support team for urgent issues</p>
                    <Button size="sm" className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Contact Support
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-gray-900 mb-2">Community Forum</h4>
                    <p className="text-sm text-gray-600 mb-3">Get help from other users and share your knowledge</p>
                    <Button size="sm" variant="outline" className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white">
                      <Users className="w-3 h-3 mr-1" />
                      Visit Forum
                    </Button>
                  </div>
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
                Edit Actions
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

export default ActionsHelp;

