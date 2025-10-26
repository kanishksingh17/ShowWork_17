import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Brain, 
  Users, 
  Eye, 
  Heart, 
  Share2,
  Clock,
  Target,
  Zap,
  Settings,
  RefreshCw,
  Download,
  Plus,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';

// Import our new components
import SocialMediaFetcher from '../ContentManagement/SocialMediaFetcher';
import ContentCalendar from '../ContentManagement/ContentCalendar';
import PortfolioHealthScore from '../PortfolioHealth/PortfolioHealthScore';

export interface DashboardStats {
  totalReach: number;
  totalEngagement: number;
  scheduledPosts: number;
  portfolioScore: number;
  upcomingPosts: number;
  topPerformingPost: {
    title: string;
    reach: number;
    engagement: number;
    platform: string;
  };
}

export interface QuickActions {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

const EnhancedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock dashboard stats
      setStats({
        totalReach: 125000,
        totalEngagement: 8500,
        scheduledPosts: 12,
        portfolioScore: 72,
        upcomingPosts: 5,
        topPerformingPost: {
          title: 'AI Project Showcase',
          reach: 15000,
          engagement: 1200,
          platform: 'LinkedIn',
        },
      });
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const quickActions: QuickActions[] = [
    {
      id: 'schedule-post',
      title: 'Schedule Post',
      description: 'Create and schedule new content',
      icon: <Plus className="w-6 h-6" />,
      action: () => setActiveTab('calendar'),
      color: 'bg-blue-500',
    },
    {
      id: 'analyze-performance',
      title: 'Analyze Performance',
      description: 'View detailed analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      action: () => setActiveTab('analytics'),
      color: 'bg-green-500',
    },
    {
      id: 'portfolio-health',
      title: 'Portfolio Health',
      description: 'Check your portfolio score',
      icon: <Brain className="w-6 h-6" />,
      action: () => setActiveTab('health'),
      color: 'bg-purple-500',
    },
    {
      id: 'ai-insights',
      title: 'AI Insights',
      description: 'Get AI-powered recommendations',
      icon: <Zap className="w-6 h-6" />,
      action: () => setActiveTab('insights'),
      color: 'bg-orange-500',
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      default: return <Share2 className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Management Dashboard</h1>
            <p className="text-gray-600">Manage your content, track performance, and optimize your portfolio</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Reach</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {stats.totalReach.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-600">+12.5% from last month</p>
                  </div>
                  <div className="p-3 bg-blue-200 rounded-full">
                    <Eye className="w-6 h-6 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Engagement</p>
                    <p className="text-2xl font-bold text-green-900">
                      {stats.totalEngagement.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">+8.3% from last month</p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-full">
                    <Heart className="w-6 h-6 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Portfolio Score</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {stats.portfolioScore}/100
                    </p>
                    <p className="text-sm text-purple-600">AI-powered analysis</p>
                  </div>
                  <div className="p-3 bg-purple-200 rounded-full">
                    <Brain className="w-6 h-6 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Scheduled Posts</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {stats.scheduledPosts}
                    </p>
                    <p className="text-sm text-orange-600">{stats.upcomingPosts} upcoming</p>
                  </div>
                  <div className="p-3 bg-orange-200 rounded-full">
                    <Calendar className="w-6 h-6 text-orange-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center space-y-3 hover:shadow-lg transition-shadow"
                  onClick={action.action}
                >
                  <div className={`p-3 rounded-full text-white ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Post */}
        {stats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Top Performing Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    {getPlatformIcon(stats.topPerformingPost.platform)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{stats.topPerformingPost.title}</h4>
                    <p className="text-sm text-gray-600">Posted on {stats.topPerformingPost.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.topPerformingPost.reach.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Reach</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.topPerformingPost.engagement.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Engagement</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="health">Portfolio Health</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Recent Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">This Week</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">2,450</span>
                        <Badge variant="secondary" className="text-green-600">+15%</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">This Month</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">8,750</span>
                        <Badge variant="secondary" className="text-green-600">+22%</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">All Time</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">45,200</span>
                        <Badge variant="secondary" className="text-blue-600">+8%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Upcoming Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Portfolio Update</p>
                          <p className="text-xs text-gray-600">Tomorrow at 9:00 AM</p>
                        </div>
                      </div>
                        <Badge variant="secondary">LinkedIn</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Tech Tips</p>
                          <p className="text-xs text-gray-600">Friday at 2:00 PM</p>
                        </div>
                      </div>
                        <Badge variant="secondary">Twitter</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Project Showcase</p>
                          <p className="text-xs text-gray-600">Next Monday at 4:30 PM</p>
                        </div>
                      </div>
                        <Badge variant="secondary">Instagram</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Portfolio Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">72/100</div>
                    <p className="text-gray-600 mb-2">Overall Score</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">65%</div>
                    <p className="text-gray-600 mb-2">Job Match</p>
                    <p className="text-sm text-gray-500">AI Engineer Role</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
                    <p className="text-gray-600 mb-2">Skill Gaps</p>
                    <p className="text-sm text-gray-500">To address</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <SocialMediaFetcher />
          </TabsContent>

          <TabsContent value="calendar">
            <ContentCalendar />
          </TabsContent>

          <TabsContent value="health">
            <PortfolioHealthScore />
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Brain className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900">Smart Recommendations</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Add more AI/ML projects to your portfolio</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Get AWS certification to boost your profile</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Post more technical content on LinkedIn</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-green-100 rounded-full">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900">Market Trends</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Machine Learning</span>
                            <Badge variant="secondary" className="text-green-600">+25%</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">AWS</span>
                            <Badge variant="secondary" className="text-blue-600">+15%</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Docker</span>
                            <Badge variant="secondary" className="text-purple-600">+22%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">1. Complete Machine Learning Course</h4>
                          <p className="text-sm text-gray-600 mb-2">Estimated time: 4-6 weeks</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Python</Badge>
                            <Badge variant="outline">TensorFlow</Badge>
                            <Badge variant="outline">Pandas</Badge>
                          </div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">2. Build AI Project</h4>
                          <p className="text-sm text-gray-600 mb-2">Create a recommendation system</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">React</Badge>
                            <Badge variant="outline">Node.js</Badge>
                            <Badge variant="outline">MongoDB</Badge>
                          </div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">3. Get AWS Certification</h4>
                          <p className="text-sm text-gray-600 mb-2">AWS Solutions Architect Associate</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Cloud</Badge>
                            <Badge variant="outline">DevOps</Badge>
                            <Badge variant="outline">Security</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
