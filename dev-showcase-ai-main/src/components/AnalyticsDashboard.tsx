// Comprehensive Analytics Dashboard - Professional Portfolio Insights
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Users, 
  Eye, 
  MousePointer, 
  Clock, 
  TrendingUp, 
  Download, 
  Share2,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Target,
  Zap,
  Award,
  Activity
} from 'lucide-react';

export interface AnalyticsData {
  overview: OverviewMetrics;
  traffic: TrafficData;
  engagement: EngagementData;
  performance: PerformanceData;
  conversions: ConversionData;
  demographics: DemographicData;
  devices: DeviceData;
  referrers: ReferrerData;
  content: ContentData;
  goals: GoalData;
}

export interface OverviewMetrics {
  totalViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  pageViews: number;
  newVisitors: number;
  returningVisitors: number;
  conversionRate: number;
}

export interface TrafficData {
  daily: Array<{ date: string; views: number; visitors: number }>;
  weekly: Array<{ week: string; views: number; visitors: number }>;
  monthly: Array<{ month: string; views: number; visitors: number }>;
  sources: Array<{ source: string; views: number; percentage: number }>;
}

export interface EngagementData {
  pageViews: number;
  avgTimeOnPage: number;
  scrollDepth: number;
  clickThroughRate: number;
  socialShares: number;
  downloads: number;
  contactFormSubmissions: number;
}

export interface PerformanceData {
  pageLoadTime: number;
  lighthouseScore: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  mobileScore: number;
  desktopScore: number;
  seoScore: number;
  accessibilityScore: number;
}

export interface ConversionData {
  totalConversions: number;
  conversionRate: number;
  goalCompletions: Array<{ goal: string; completions: number; rate: number }>;
  funnelData: Array<{ step: string; visitors: number; dropoff: number }>;
}

export interface DemographicData {
  countries: Array<{ country: string; visitors: number; percentage: number }>;
  cities: Array<{ city: string; visitors: number; percentage: number }>;
  languages: Array<{ language: string; visitors: number; percentage: number }>;
  ageGroups: Array<{ age: string; visitors: number; percentage: number }>;
}

export interface DeviceData {
  devices: Array<{ device: string; visitors: number; percentage: number }>;
  browsers: Array<{ browser: string; visitors: number; percentage: number }>;
  operatingSystems: Array<{ os: string; visitors: number; percentage: number }>;
  screenSizes: Array<{ size: string; visitors: number; percentage: number }>;
}

export interface ReferrerData {
  direct: number;
  search: number;
  social: number;
  referral: number;
  email: number;
  campaigns: Array<{ campaign: string; visitors: number; conversions: number }>;
}

export interface ContentData {
  popularPages: Array<{ page: string; views: number; avgTime: number }>;
  exitPages: Array<{ page: string; exits: number; rate: number }>;
  searchTerms: Array<{ term: string; searches: number; results: number }>;
  downloads: Array<{ file: string; downloads: number; size: string }>;
}

export interface GoalData {
  goals: Array<{ name: string; value: number; target: number; completion: number }>;
  funnels: Array<{ name: string; steps: number; conversionRate: number }>;
  events: Array<{ name: string; count: number; value: number }>;
}

// Mock Analytics Data Generator
export const generateMockAnalyticsData = (): AnalyticsData => {
  return {
    overview: {
      totalViews: 1250,
      uniqueVisitors: 890,
      bounceRate: 32.5,
      avgSessionDuration: 245,
      pageViews: 2100,
      newVisitors: 650,
      returningVisitors: 240,
      conversionRate: 8.5
    },
    traffic: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        views: Math.floor(Math.random() * 100) + 20,
        visitors: Math.floor(Math.random() * 80) + 15
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        week: `Week ${i + 1}`,
        views: Math.floor(Math.random() * 500) + 100,
        visitors: Math.floor(Math.random() * 400) + 80
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        views: Math.floor(Math.random() * 2000) + 500,
        visitors: Math.floor(Math.random() * 1500) + 300
      })),
      sources: [
        { source: 'Direct', views: 450, percentage: 36 },
        { source: 'Google Search', views: 380, percentage: 30.4 },
        { source: 'LinkedIn', views: 200, percentage: 16 },
        { source: 'Twitter', views: 120, percentage: 9.6 },
        { source: 'Other', views: 100, percentage: 8 }
      ]
    },
    engagement: {
      pageViews: 2100,
      avgTimeOnPage: 245,
      scrollDepth: 68.5,
      clickThroughRate: 12.3,
      socialShares: 45,
      downloads: 23,
      contactFormSubmissions: 8
    },
    performance: {
      pageLoadTime: 1.2,
      lighthouseScore: 95,
      coreWebVitals: {
        lcp: 1.1,
        fid: 45,
        cls: 0.05
      },
      mobileScore: 92,
      desktopScore: 98,
      seoScore: 96,
      accessibilityScore: 94
    },
    conversions: {
      totalConversions: 12,
      conversionRate: 8.5,
      goalCompletions: [
        { goal: 'Contact Form', completions: 8, rate: 5.3 },
        { goal: 'CV Download', completions: 4, rate: 2.7 },
        { goal: 'Project View', completions: 15, rate: 10.2 }
      ],
      funnelData: [
        { step: 'Landing', visitors: 150, dropoff: 0 },
        { step: 'About', visitors: 120, dropoff: 20 },
        { step: 'Projects', visitors: 95, dropoff: 36.7 },
        { step: 'Contact', visitors: 12, dropoff: 92 }
      ]
    },
    demographics: {
      countries: [
        { country: 'United States', visitors: 350, percentage: 39.3 },
        { country: 'United Kingdom', visitors: 180, percentage: 20.2 },
        { country: 'Canada', visitors: 120, percentage: 13.5 },
        { country: 'Germany', visitors: 85, percentage: 9.6 },
        { country: 'Other', visitors: 155, percentage: 17.4 }
      ],
      cities: [
        { city: 'New York', visitors: 85, percentage: 9.6 },
        { city: 'London', visitors: 65, percentage: 7.3 },
        { city: 'San Francisco', visitors: 55, percentage: 6.2 },
        { city: 'Toronto', visitors: 45, percentage: 5.1 },
        { city: 'Other', visitors: 640, percentage: 71.8 }
      ],
      languages: [
        { language: 'English', visitors: 720, percentage: 80.9 },
        { language: 'German', visitors: 85, percentage: 9.6 },
        { language: 'French', visitors: 45, percentage: 5.1 },
        { language: 'Other', visitors: 40, percentage: 4.4 }
      ],
      ageGroups: [
        { age: '25-34', visitors: 350, percentage: 39.3 },
        { age: '35-44', visitors: 280, percentage: 31.5 },
        { age: '18-24', visitors: 150, percentage: 16.9 },
        { age: '45-54', visitors: 80, percentage: 9 },
        { age: '55+', visitors: 30, percentage: 3.3 }
      ]
    },
    devices: {
      devices: [
        { device: 'Desktop', visitors: 450, percentage: 50.6 },
        { device: 'Mobile', visitors: 320, percentage: 36 },
        { device: 'Tablet', visitors: 120, percentage: 13.4 }
      ],
      browsers: [
        { browser: 'Chrome', visitors: 420, percentage: 47.2 },
        { browser: 'Safari', visitors: 180, percentage: 20.2 },
        { browser: 'Firefox', visitors: 120, percentage: 13.5 },
        { browser: 'Edge', visitors: 90, percentage: 10.1 },
        { browser: 'Other', visitors: 80, percentage: 9 }
      ],
      operatingSystems: [
        { os: 'Windows', visitors: 380, percentage: 42.7 },
        { os: 'macOS', visitors: 250, percentage: 28.1 },
        { os: 'iOS', visitors: 150, percentage: 16.9 },
        { os: 'Android', visitors: 80, percentage: 9 },
        { os: 'Linux', visitors: 30, percentage: 3.3 }
      ],
      screenSizes: [
        { size: '1920x1080', visitors: 200, percentage: 22.5 },
        { size: '1366x768', visitors: 150, percentage: 16.9 },
        { size: '1440x900', visitors: 120, percentage: 13.5 },
        { size: 'Mobile', visitors: 320, percentage: 36 },
        { size: 'Other', visitors: 100, percentage: 11.1 }
      ]
    },
    referrers: {
      direct: 450,
      search: 380,
      social: 320,
      referral: 120,
      email: 80,
      campaigns: [
        { campaign: 'LinkedIn Post', visitors: 150, conversions: 3 },
        { campaign: 'Twitter Share', visitors: 120, conversions: 2 },
        { campaign: 'Email Newsletter', visitors: 80, conversions: 1 }
      ]
    },
    content: {
      popularPages: [
        { page: '/', views: 450, avgTime: 180 },
        { page: '/projects', views: 320, avgTime: 240 },
        { page: '/about', views: 280, avgTime: 120 },
        { page: '/contact', views: 150, avgTime: 90 }
      ],
      exitPages: [
        { page: '/contact', exits: 45, rate: 30 },
        { page: '/projects', exits: 38, rate: 11.9 },
        { page: '/about', exits: 25, rate: 8.9 }
      ],
      searchTerms: [
        { term: 'portfolio', searches: 45, results: 12 },
        { term: 'developer', searches: 32, results: 8 },
        { term: 'projects', searches: 28, results: 15 }
      ],
      downloads: [
        { file: 'CV.pdf', downloads: 23, size: '2.1 MB' },
        { file: 'Portfolio.pdf', downloads: 15, size: '5.3 MB' }
      ]
    },
    goals: {
      goals: [
        { name: 'Contact Form Submissions', value: 8, target: 20, completion: 40 },
        { name: 'CV Downloads', value: 23, target: 50, completion: 46 },
        { name: 'Project Views', value: 320, target: 500, completion: 64 }
      ],
      funnels: [
        { name: 'Contact Funnel', steps: 4, conversionRate: 8.5 },
        { name: 'Download Funnel', steps: 3, conversionRate: 15.3 }
      ],
      events: [
        { name: 'Portfolio View', count: 1250, value: 1250 },
        { name: 'Project Click', count: 320, value: 960 },
        { name: 'Social Share', count: 45, value: 135 }
      ]
    }
  };
};

// Analytics Dashboard Component
export const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    // Simulate API call
    const loadAnalyticsData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(generateMockAnalyticsData());
      setLoading(false);
    };

    loadAnalyticsData();
  }, [selectedPeriod]);

  if (loading || !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-[#94A3B8]">Professional portfolio performance insights</p>
          </div>
          <div className="flex space-x-4">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Views"
            value={analyticsData.overview.totalViews.toLocaleString()}
            change="+12.5%"
            icon={<Eye className="w-5 h-5" />}
            color="blue"
          />
          <MetricCard
            title="Unique Visitors"
            value={analyticsData.overview.uniqueVisitors.toLocaleString()}
            change="+8.3%"
            icon={<Users className="w-5 h-5" />}
            color="green"
          />
          <MetricCard
            title="Bounce Rate"
            value={`${analyticsData.overview.bounceRate}%`}
            change="-5.2%"
            icon={<MousePointer className="w-5 h-5" />}
            color="yellow"
          />
          <MetricCard
            title="Avg. Session"
            value={`${Math.floor(analyticsData.overview.avgSessionDuration / 60)}m ${analyticsData.overview.avgSessionDuration % 60}s`}
            change="+15.7%"
            icon={<Clock className="w-5 h-5" />}
            color="purple"
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Performance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#94A3B8]">Lighthouse Score</span>
                  <span className="text-white font-semibold">{analyticsData.performance.lighthouseScore}/100</span>
                </div>
                <Progress value={analyticsData.performance.lighthouseScore} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analyticsData.performance.mobileScore}</div>
                    <div className="text-sm text-[#94A3B8]">Mobile</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analyticsData.performance.desktopScore}</div>
                    <div className="text-sm text-[#94A3B8]">Desktop</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Conversion Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.goals.goals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[#94A3B8] text-sm">{goal.name}</span>
                      <span className="text-white text-sm">{goal.value}/{goal.target}</span>
                    </div>
                    <Progress value={goal.completion} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Sources */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.traffic.sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-white">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-[#94A3B8]">{source.views} views</span>
                    <Badge variant="secondary">{source.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Device Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.devices.devices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {device.device === 'Desktop' && <Monitor className="w-4 h-4 text-blue-400" />}
                      {device.device === 'Mobile' && <Smartphone className="w-4 h-4 text-green-400" />}
                      {device.device === 'Tablet' && <Monitor className="w-4 h-4 text-purple-400" />}
                      <span className="text-white">{device.device}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-[#94A3B8]">{device.visitors}</span>
                      <Badge variant="secondary">{device.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.demographics.countries.slice(0, 5).map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white">{country.country}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-[#94A3B8]">{country.visitors}</span>
                      <Badge variant="secondary">{country.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
    red: 'text-red-400'
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#94A3B8] text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {change} from last period
            </p>
          </div>
          <div className={`${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
