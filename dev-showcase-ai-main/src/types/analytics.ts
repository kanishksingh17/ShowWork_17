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
  screenSizes: Array<{ size: string; count: number; percentage: number }>;
}

export interface ReferrerData {
  direct: number;
  search: number;
  social: number;
  email: number;
  other: number;
}

export interface ContentData {
  topPages: Array<{ page: string; views: number; percentage: number }>;
  topProjects: Array<{ project: string; views: number; percentage: number }>;
  contentPerformance: Array<{
    content: string;
    views: number;
    engagement: number;
  }>;
}

export interface GoalData {
  goals: Array<{
    id: string;
    name: string;
    target: number;
    current: number;
    completion: number;
  }>;
  achievements: Array<{ id: string; name: string; unlockedAt: Date }>;
}
