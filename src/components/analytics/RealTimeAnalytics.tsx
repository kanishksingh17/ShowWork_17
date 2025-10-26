import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Eye, 
  Download, 
  MousePointer, 
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  Activity,
  Clock,
  MapPin
} from 'lucide-react';
import { portfolioTrackingService } from '@/services/portfolioTrackingService';
import { socialMediaService } from '@/services/socialMediaService';

interface RealTimeAnalyticsProps {
  portfolioId: string;
}

export function RealTimeAnalytics({ portfolioId }: RealTimeAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [socialMedia, setSocialMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [portfolioId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [realtimeData, socialMediaData] = await Promise.all([
        portfolioTrackingService.getRealTimeAnalytics(portfolioId),
        socialMediaService.getAllSocialMediaMetrics(),
      ]);

      setAnalytics(realtimeData);
      setSocialMedia(socialMediaData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently viewing your portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.currentViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              Views in the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Reach</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {socialMedia?.total?.reach?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all social platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {socialMedia?.total?.engagementRate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average engagement rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Activity
            <Badge variant="secondary" className="ml-auto">
              {analytics?.liveActivity?.length || 0} events
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.liveActivity?.length > 0 ? (
              analytics.liveActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {activity.type === 'portfolio_view' && <Eye className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'cv_download' && <Download className="h-4 w-4 text-green-500" />}
                    {activity.type === 'project_interaction' && <MousePointer className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {activity.type === 'portfolio_view' && 'Portfolio viewed'}
                      {activity.type === 'cv_download' && 'CV downloaded'}
                      {activity.type === 'project_interaction' && 'Project interaction'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                      <Clock className="h-3 w-3 ml-2" />
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {activity.device}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Media Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {socialMedia && Object.entries(socialMedia.platforms || {}).map(([platform, data]: [string, any]) => (
          <Card key={platform}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">{platform}</CardTitle>
              <div className="flex items-center gap-1">
                {platform === 'linkedin' && <Globe className="h-4 w-4 text-blue-600" />}
                {platform === 'github' && <Globe className="h-4 w-4 text-gray-600" />}
                {platform === 'twitter' && <Globe className="h-4 w-4 text-blue-400" />}
                {platform === 'instagram' && <Globe className="h-4 w-4 text-pink-500" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Followers</span>
                  <span className="text-sm font-medium">{data.followers?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Posts</span>
                  <span className="text-sm font-medium">{data.posts || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Engagement</span>
                  <span className="text-sm font-medium">{data.engagementRate?.toFixed(1) || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Reach</span>
                  <span className="text-sm font-medium">{data.reach?.toLocaleString() || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Device Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Device Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Monitor className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Desktop</p>
                <p className="text-xs text-muted-foreground">60.8% of traffic</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Smartphone className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium">Mobile</p>
                <p className="text-xs text-muted-foreground">33.2% of traffic</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tablet className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Tablet</p>
                <p className="text-xs text-muted-foreground">6.0% of traffic</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
        <Button variant="outline" size="sm" onClick={loadAnalytics} disabled={loading}>
          {loading ? 'Updating...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
}
