import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calculator, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  AlertTriangle,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

interface CustomMetric {
  id: string;
  name: string;
  formula: string;
  description: string;
  category: string;
  threshold?: number;
  alertEnabled: boolean;
  currentValue: number;
  trend: 'up' | 'down' | 'stable';
  lastCalculated: string;
}

interface CustomMetricsProps {
  metrics: CustomMetric[];
}

export const CustomMetrics: React.FC<CustomMetricsProps> = ({ metrics }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingMetric, setEditingMetric] = useState<string | null>(null);
  const [newMetric, setNewMetric] = useState({
    name: '',
    formula: '',
    description: '',
    category: 'engagement',
    threshold: 0,
    alertEnabled: false
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'engagement': return 'bg-blue-100 text-blue-800';
      case 'performance': return 'bg-green-100 text-green-800';
      case 'traffic': return 'bg-purple-100 text-purple-800';
      case 'conversion': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChartIcon = (category: string) => {
    switch (category) {
      case 'engagement': return <PieChart className="w-5 h-5" />;
      case 'performance': return <BarChart3 className="w-5 h-5" />;
      case 'traffic': return <LineChart className="w-5 h-5" />;
      case 'conversion': return <Target className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const handleCreateMetric = () => {
    // In a real implementation, this would save to the backend
    console.log('Creating metric:', newMetric);
    setIsCreating(false);
    setNewMetric({
      name: '',
      formula: '',
      description: '',
      category: 'engagement',
      threshold: 0,
      alertEnabled: false
    });
  };

  const handleEditMetric = (metricId: string) => {
    setEditingMetric(metricId);
  };

  const handleSaveMetric = (metricId: string) => {
    // In a real implementation, this would update the backend
    console.log('Saving metric:', metricId);
    setEditingMetric(null);
  };

  const handleDeleteMetric = (metricId: string) => {
    // In a real implementation, this would delete from the backend
    console.log('Deleting metric:', metricId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Custom Metrics Builder</h2>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Metric
        </Button>
      </div>

      {/* Create New Metric */}
      {isCreating && (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-blue-600" />
              Create New Custom Metric
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Metric Name</label>
                  <Input
                    value={newMetric.name}
                    onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
                    placeholder="e.g., Engagement Quality Score"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
                  <select
                    value={newMetric.category}
                    onChange={(e) => setNewMetric({ ...newMetric, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="engagement">Engagement</option>
                    <option value="performance">Performance</option>
                    <option value="traffic">Traffic</option>
                    <option value="conversion">Conversion</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Formula</label>
                <Input
                  value={newMetric.formula}
                  onChange={(e) => setNewMetric({ ...newMetric, formula: e.target.value })}
                  placeholder="e.g., (Likes * 2 + Shares * 5) / Views"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Description</label>
                <Textarea
                  value={newMetric.description}
                  onChange={(e) => setNewMetric({ ...newMetric, description: e.target.value })}
                  placeholder="Describe what this metric measures and why it's important..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Alert Threshold</label>
                  <Input
                    type="number"
                    value={newMetric.threshold}
                    onChange={(e) => setNewMetric({ ...newMetric, threshold: Number(e.target.value) })}
                    placeholder="e.g., 80"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    id="alertEnabled"
                    checked={newMetric.alertEnabled}
                    onChange={(e) => setNewMetric({ ...newMetric, alertEnabled: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="alertEnabled" className="text-sm text-slate-700">
                    Enable threshold alerts
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleCreateMetric} className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Create Metric
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id} className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-800 flex items-center text-lg">
                  {getChartIcon(metric.category)}
                  <span className="ml-2">{metric.name}</span>
                </CardTitle>
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" onClick={() => handleEditMetric(metric.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteMetric(metric.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getCategoryColor(metric.category)}>
                    {metric.category}
                  </Badge>
                  {metric.alertEnabled && (
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-slate-600">Alert</span>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800">{metric.currentValue}</div>
                  <div className="text-sm text-slate-600">Current Value</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(metric.trend)}
                    <span className="text-sm text-slate-600">
                      {metric.trend === 'up' ? 'Growing' : 
                       metric.trend === 'down' ? 'Declining' : 'Stable'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(metric.lastCalculated).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="text-sm text-slate-600">
                  <div className="font-medium mb-1">Formula:</div>
                  <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                    {metric.formula}
                  </code>
                </div>
                
                {metric.description && (
                  <div className="text-sm text-slate-600">
                    {metric.description}
                  </div>
                )}
                
                {metric.threshold && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Threshold:</span>
                    <span className="text-sm font-semibold text-slate-800">{metric.threshold}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Metric Templates */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            Popular Metric Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">Engagement Quality</div>
              <div className="text-sm text-blue-700 mb-2">(Likes * 2 + Shares * 5) / Views</div>
              <div className="text-xs text-blue-600">Measures content quality based on engagement depth</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-semibold text-green-800 mb-2">Portfolio ROI</div>
              <div className="text-sm text-green-700 mb-2">Conversions / (Time * Hourly Rate)</div>
              <div className="text-xs text-green-600">Return on investment for portfolio development</div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-semibold text-purple-800 mb-2">Virality Coefficient</div>
              <div className="text-sm text-purple-700 mb-2">Shares / Views * 100</div>
              <div className="text-xs text-purple-600">How likely content is to be shared</div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="font-semibold text-orange-800 mb-2">Content Velocity</div>
              <div className="text-sm text-orange-700 mb-2">Views / Days Since Published</div>
              <div className="text-xs text-orange-600">Content performance over time</div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-semibold text-red-800 mb-2">Audience Growth Rate</div>
              <div className="text-sm text-red-700 mb-2">(New Followers - Lost Followers) / Total Followers</div>
              <div className="text-xs text-red-600">Net audience growth percentage</div>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="font-semibold text-indigo-800 mb-2">Content Efficiency</div>
              <div className="text-sm text-indigo-700 mb-2">Engagement / Time Spent Creating</div>
              <div className="text-xs text-indigo-600">Efficiency of content creation process</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Custom Metrics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{metrics.length}</div>
              <div className="text-sm text-slate-600">Total Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {metrics.filter(m => m.alertEnabled).length}
              </div>
              <div className="text-sm text-slate-600">Active Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {metrics.filter(m => m.trend === 'up').length}
              </div>
              <div className="text-sm text-slate-600">Growing Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {Math.round(metrics.reduce((sum, m) => sum + m.currentValue, 0) / metrics.length)}
              </div>
              <div className="text-sm text-slate-600">Avg. Value</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
