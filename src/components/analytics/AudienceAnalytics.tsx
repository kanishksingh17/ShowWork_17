import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Users, 
  MapPin, 
  Monitor, 
  Smartphone, 
  Tablet,
  Clock,
  TrendingUp,
  Filter,
  Download
} from 'lucide-react';

interface GeographicPoint {
  lat: number;
  lng: number;
  count: number;
  country: string;
  city: string;
}

interface AudienceAnalyticsProps {
  demographics: {
    countries: Array<{ country: string; visitors: number; percentage: number }>;
    cities: Array<{ city: string; visitors: number; percentage: number }>;
    languages: Array<{ language: string; visitors: number; percentage: number }>;
    ageGroups: Array<{ age: string; visitors: number; percentage: number }>;
  };
  devices: {
    devices: Array<{ device: string; visitors: number; percentage: number }>;
    browsers: Array<{ browser: string; visitors: number; percentage: number }>;
    operatingSystems: Array<{ os: string; visitors: number; percentage: number }>;
    screenSizes: Array<{ size: string; visitors: number; percentage: number }>;
  };
  geographicDistribution: GeographicPoint[];
}

export const AudienceAnalytics: React.FC<AudienceAnalyticsProps> = ({ 
  demographics, 
  devices, 
  geographicDistribution 
}) => {
  const [selectedView, setSelectedView] = useState<'geographic' | 'demographic' | 'device'>('geographic');

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getDeviceColor = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop': return 'text-blue-600';
      case 'mobile': return 'text-green-600';
      case 'tablet': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Audience Analytics</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
        {[
          { id: 'geographic', label: 'Geographic', icon: Globe },
          { id: 'demographic', label: 'Demographic', icon: Users },
          { id: 'device', label: 'Device', icon: Monitor }
        ].map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                selectedView === view.id
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{view.label}</span>
            </button>
          );
        })}
      </div>

      {/* Geographic View */}
      {selectedView === 'geographic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Countries */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demographics.countries.map((country, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-orange-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="text-slate-800">{country.country}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-600">{country.visitors}</span>
                        <Badge variant="secondary">{country.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-orange-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cities */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Top Cities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demographics.cities.map((city, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-800">{city.city}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-600">{city.visitors}</span>
                        <Badge variant="secondary">{city.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${city.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Demographic View */}
      {selectedView === 'demographic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Groups */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Age Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demographics.ageGroups.map((age, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-800">{age.age}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-600">{age.visitors}</span>
                        <Badge variant="secondary">{age.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${age.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demographics.languages.map((language, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-800">{language.language}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-600">{language.visitors}</span>
                        <Badge variant="secondary">{language.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${language.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Device View */}
      {selectedView === 'device' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Devices */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-blue-600" />
                Device Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices.devices.map((device, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={getDeviceColor(device.device)}>
                          {getDeviceIcon(device.device)}
                        </div>
                        <span className="text-slate-800">{device.device}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-600">{device.visitors}</span>
                        <Badge variant="secondary">{device.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          device.device.toLowerCase() === 'desktop' ? 'bg-blue-500' :
                          device.device.toLowerCase() === 'mobile' ? 'bg-green-500' :
                          device.device.toLowerCase() === 'tablet' ? 'bg-purple-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Browsers */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-blue-600" />
                Browsers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices.browsers.map((browser, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-800">{browser.browser}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-600">{browser.visitors}</span>
                        <Badge variant="secondary">{browser.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${browser.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Behavioral Segments */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Behavioral Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">Tech Enthusiasts</div>
              <div className="text-sm text-blue-700 mb-2">234 users (28%)</div>
              <div className="text-xs text-blue-600">
                • Avg session: 6.2 min<br/>
                • Bounce rate: 12%<br/>
                • Peak hours: 10-14
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-semibold text-green-800 mb-2">Quick Browsers</div>
              <div className="text-sm text-green-700 mb-2">189 users (23%)</div>
              <div className="text-xs text-green-600">
                • Avg session: 1.8 min<br/>
                • Bounce rate: 45%<br/>
                • Peak hours: 12-16
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-semibold text-purple-800 mb-2">Deep Explorers</div>
              <div className="text-sm text-purple-700 mb-2">156 users (19%)</div>
              <div className="text-xs text-purple-600">
                • Avg session: 12.4 min<br/>
                • Bounce rate: 8%<br/>
                • Peak hours: 20-24
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
