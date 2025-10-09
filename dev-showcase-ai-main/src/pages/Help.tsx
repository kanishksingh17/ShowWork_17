import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  ArrowLeft,
  LayoutDashboard,
  Code,
  Image,
  User,
  BarChart3,
  Users,
  FolderOpen,
  Zap,
  Settings,
  Star,
  ExternalLink,
  Download,
  Share2,
  Eye,
  Edit3,
  Plus,
  X,
  Lightbulb,
  TrendingUp,
  Clock,
  FileText,
  Play,
  Mic,
  Info,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  BookOpen,
  Video,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPopular: boolean;
  lastUpdated: string;
  readTime: string;
}

interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  articleCount: number;
}

interface HelpProps {
  onBackToDashboard?: () => void;
}

const Help = ({ onBackToDashboard }: HelpProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  const categories: HelpCategory[] = [
    { id: 'all', name: 'All Topics', description: 'Browse all help articles', icon: HelpCircle, articleCount: 24 },
    { id: 'getting-started', name: 'Getting Started', description: 'Learn the basics', icon: Lightbulb, articleCount: 6 },
    { id: 'projects', name: 'Projects', description: 'Project management', icon: FolderOpen, articleCount: 8 },
    { id: 'media', name: 'Media', description: 'Uploads and files', icon: Image, articleCount: 4 },
    { id: 'technology', name: 'Technology', description: 'Tech stack management', icon: Code, articleCount: 3 },
    { id: 'sharing', name: 'Sharing', description: 'Collaboration features', icon: Share2, articleCount: 2 },
    { id: 'troubleshooting', name: 'Troubleshooting', description: 'Common issues', icon: AlertCircle, articleCount: 1 }
  ];

  const articles: HelpArticle[] = [
    {
      id: '1',
      title: 'How to Create Your First Project',
      content: 'Learn how to create and set up your first project showcase. This comprehensive guide covers everything from project creation to publishing.',
      category: 'getting-started',
      tags: ['project', 'creation', 'beginner'],
      isPopular: true,
      lastUpdated: '2024-01-15',
      readTime: '5 min'
    },
    {
      id: '2',
      title: 'Managing Your Technology Stack',
      content: 'Discover how to add, organize, and manage your technology stack. Learn about proficiency levels and categorization.',
      category: 'technology',
      tags: ['technology', 'stack', 'skills'],
      isPopular: true,
      lastUpdated: '2024-01-12',
      readTime: '3 min'
    },
    {
      id: '3',
      title: 'Uploading and Managing Media Files',
      content: 'Complete guide to uploading screenshots, videos, and documents. Learn about supported formats and file organization.',
      category: 'media',
      tags: ['media', 'upload', 'files'],
      isPopular: false,
      lastUpdated: '2024-01-10',
      readTime: '4 min'
    },
    {
      id: '4',
      title: 'Project Visibility and Privacy Settings',
      content: 'Understand how to control who can see your projects and manage privacy settings effectively.',
      category: 'projects',
      tags: ['privacy', 'visibility', 'settings'],
      isPopular: false,
      lastUpdated: '2024-01-08',
      readTime: '2 min'
    },
    {
      id: '5',
      title: 'Sharing Projects with Team Members',
      content: 'Learn how to collaborate with team members, share projects, and manage permissions.',
      category: 'sharing',
      tags: ['collaboration', 'team', 'sharing'],
      isPopular: false,
      lastUpdated: '2024-01-05',
      readTime: '3 min'
    },
    {
      id: '6',
      title: 'Troubleshooting Common Issues',
      content: 'Find solutions to common problems and learn how to resolve technical issues.',
      category: 'troubleshooting',
      tags: ['troubleshooting', 'issues', 'support'],
      isPopular: false,
      lastUpdated: '2024-01-03',
      readTime: '6 min'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularArticles = articles.filter(article => article.isPopular);

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
            Help Center
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
                <span className="text-gray-900">Help Center</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
              <p className="text-sm text-gray-500">Find answers, guides, and support for ShowWork</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Search Bar */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search help articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  />
                </div>
                {searchTerm && (
                  <div className="mt-2 text-sm text-gray-600">
                    Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} for "{searchTerm}"
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popular Articles */}
            {!searchTerm && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Popular Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularArticles.map(article => (
                      <div key={article.id} className="bg-white rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{article.title}</h4>
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {article.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{article.readTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Browse by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.slice(1).map(category => {
                    const Icon = category.icon;
                    return (
                      <div 
                        key={category.id} 
                        className={`bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${
                          selectedCategory === category.id ? 'ring-2 ring-[#1E3A8A] bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{category.name}</h4>
                            <p className="text-xs text-gray-500">{category.articleCount} articles</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Articles List */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {selectedCategory === 'all' ? 'All Articles' : categories.find(cat => cat.id === selectedCategory)?.name} 
                  ({filteredArticles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredArticles.map(article => (
                    <div key={article.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{article.title}</h4>
                            {article.isPopular && <Star className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{article.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {article.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {article.readTime}
                              </span>
                              <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="ml-4">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Read
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-green-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Still Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">Live Chat</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Get instant help from our support team</p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-full">
                      Start Chat
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">Email Support</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Send us a detailed message</p>
                    <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-full">
                      Send Email
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">Community Forum</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Ask questions and get help from the community</p>
                    <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-full">
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
              onClick={onBackToDashboard}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Guide
              </Button>
              <Button className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;

