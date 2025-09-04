import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import ShowWorkLogo from "@/components/ShowWorkLogo";
import EnhancedOnboardingFlow from "@/components/EnhancedOnboardingFlow";
import ProfileCompletion from "./ProfileCompletion";
import DeveloperProfileSetup from "@/components/DeveloperProfileSetup";
import {
  Home,
  FolderOpen,
  Calendar,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Filter,
  Bell,
  User,
  Plus,
  Upload,
  FileText,
  MoreHorizontal,
  ArrowUp,
  CheckCircle,
  Activity,
  TrendingUp,
  Clock,
  AlertTriangle,
  Target,
  Star,
  MessageSquare,
  Zap,
  Smartphone,
  Download,
  Pause,
  Square,
  Code2
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  tagline: string;
  bio: string;
  location: string;
  website: string;
  skills: Array<{ name: string; percentage: number; category: string }>;
  projects: Array<{ title: string; description: string; technologies: string[] }>;
  profileCompleted: boolean;
  onboardingStep: number;
  username: string;
}

interface DashboardStats {
  totalProjects: number;
  runningProjects: number;
  endedProjects: number;
  pendingProjects: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [showDeveloperSetup, setShowDeveloperSetup] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({ totalProjects: 0, runningProjects: 0, endedProjects: 0, pendingProjects: 0 });
  const [projects, setProjects] = useState<any[]>([]);
  const [timeTracker, setTimeTracker] = useState({ hours: 0, minutes: 0, seconds: 0, isRunning: false });
  const [dashboardDataLoading, setDashboardDataLoading] = useState(false);
  const [dashboardReady, setDashboardReady] = useState(false); // Track when dashboard UI is ready
  const [preloadStarted, setPreloadStarted] = useState(false); // Track preloading state

  // Memoized default dashboard data for instant rendering
  const defaultDashboardData = useMemo(() => ({
    stats: { totalProjects: 0, runningProjects: 0, endedProjects: 0, pendingProjects: 0 },
    projects: [],
    timeTracker: { hours: 0, minutes: 0, seconds: 0, isRunning: false }
  }), []);

  // Optimized data loading with immediate UI render
  const loadDashboardDataOptimized = useCallback(async (isFirstTime = false) => {
    if (isFirstTime) {
      // For first-time users, set dashboard as ready immediately
      setDashboardReady(true);
      
      // Start preloading in the background with minimal delay
      setTimeout(() => {
        if (!preloadStarted) {
          setPreloadStarted(true);
          loadDashboardData();
        }
      }, 10);
      return;
    }
    
    // For existing users, load data normally
    await loadDashboardData();
  }, [preloadStarted]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔐 Checking authentication...');
        const res = await fetch("/api/portfolio/profile", { credentials: 'include' });
        
        if (!res.ok) {
          if (res.status === 401) {
            console.log('❌ Unauthorized - redirecting to login');
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch profile");
        }
        
        const data = await res.json();
        if (data.success) {
          console.log('✅ User authenticated:', data.user.username || data.user.email);
          setUser(data.user);
          
          // Check if this is a new user who needs to complete profile setup
          if (!data.user.profileCompleted) {
            console.log('👤 First-time user detected - ultra-fast track to profile setup');
            // First-time user - show profile setup instantly
            setShowDeveloperSetup(true);
            setLoading(false);
            setDashboardReady(true); // Mark as ready for instant transition
          } else {
            console.log('📊 Existing user - instant dashboard with background loading');
            // Existing user - render dashboard instantly with default data
            setLoading(false);
            setDashboardReady(true);
            
            // Load real data asynchronously without blocking
            loadDashboardDataOptimized(false);
          }
        } else {
          throw new Error("Profile fetch failed");
        }
      } catch (err) {
        console.error("❌ Auth check error:", err);
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate, loadDashboardDataOptimized]);

  const loadDashboardData = async () => {
    setDashboardDataLoading(true);
    try {
      console.log('🔄 Loading dashboard data...');
      
      // Use Promise.allSettled for better error handling and parallel loading
      const [statsResult, projectsResult] = await Promise.allSettled([
        fetch("/api/dashboard/stats", { credentials: 'include' }).then(res => res.json()),
        fetch("/api/dashboard/projects", { credentials: 'include' }).then(res => res.json())
      ]);

      // Handle stats response with graceful fallback
      if (statsResult.status === 'fulfilled' && statsResult.value.success) {
        setStats(statsResult.value.data || defaultDashboardData.stats);
        console.log('✅ Stats loaded:', statsResult.value.data);
      } else {
        console.warn('⚠️ Stats API failed, using defaults');
        setStats(defaultDashboardData.stats);
      }

      // Handle projects response with graceful fallback
      if (projectsResult.status === 'fulfilled' && projectsResult.value.success) {
        setProjects(projectsResult.value.data || defaultDashboardData.projects);
        console.log('✅ Projects loaded:', projectsResult.value.data?.length || 0, 'projects');
      } else {
        console.warn('⚠️ Projects API failed, using defaults');
        setProjects(defaultDashboardData.projects);
      }
      
      console.log('✅ Dashboard data loading completed');
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      // Use memoized default values for better performance
      setStats(defaultDashboardData.stats);
      setProjects(defaultDashboardData.projects);
    } finally {
      setDashboardDataLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { credentials: 'include' });
    } catch (err) {
      console.error("Logout error:", err);
    }
    navigate("/login");
  };

  const handleAddProject = async () => {
    try {
      const response = await fetch("/api/dashboard/projects", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: `New Project ${stats.totalProjects + 1}`,
          description: 'A new project created from the dashboard',
          status: 'pending',
          totalTasks: 5
        })
      });

      if (response.ok) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  if (loading && !dashboardReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="relative mb-8">
            {/* Enhanced loading animation */}
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            {/* Logo */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ShowWork</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to ShowWork</h2>
          <p className="text-gray-600 mb-6">Setting up your personalized workspace...</p>
          
          {/* Enhanced progress bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000 animate-pulse" style={{width: '85%'}}></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Authenticating...</span>
              <span>85%</span>
            </div>
          </div>
          
          {/* Loading steps */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Verifying credentials</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading profile data</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showProfileCompletion && user) {
    return (
      <ProfileCompletion 
        user={user} 
        onComplete={async (profileData) => {
          console.log('🎯 Profile completion finished, updating dashboard...', profileData);
          
          // Update user state with new profile data
          setUser(prev => ({ 
            ...prev!, 
            username: profileData.username, 
            name: profileData.fullName, 
            bio: profileData.bio, 
            profileCompleted: true 
          }));
          
          // Hide the profile completion component
          setShowProfileCompletion(false);
          
          // Load dashboard data to ensure content is ready
          try {
            console.log('📊 Reloading dashboard data after profile update...');
            await loadDashboardData();
            console.log('✅ Dashboard data reloaded successfully');
          } catch (error) {
            console.error('❌ Error reloading dashboard data:', error);
          }
        }}
      />
    );
  }

  if (showDeveloperSetup) {
    return (
      <div className="min-h-screen">
        <DeveloperProfileSetup 
          onComplete={async (setupData) => {
            console.log('🎯 Profile setup completed, transitioning to dashboard...', setupData);
            
            // Update user state to mark profile as completed
            setUser(prev => ({ 
              ...prev!, 
              profileCompleted: true, 
              onboardingStep: 3,
              // Update user data with setup information if available
              ...(setupData && {
                username: setupData.username,
                name: setupData.fullName,
                bio: setupData.bio
              })
            }));
            
            // Ultra-fast transition for first-time users
            setShowDeveloperSetup(false);
            setLoading(false);
            setDashboardReady(true);
            
            // Preload dashboard data with optimized timing
            loadDashboardDataOptimized(true);
          }}
        />
      </div>
    );
  }

  if (showOnboarding && user) {
    return (
      <EnhancedOnboardingFlow 
        user={user} 
        onComplete={async (onboardingData) => {
          const res = await fetch("/api/portfolio/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({
              username: onboardingData.username,
              name: onboardingData.name,
              tagline: onboardingData.role,
              bio: onboardingData.bio,
              skills: onboardingData.skills,
              profileCompleted: true,
              onboardingStep: 3
            })
          });
          
          if (res.ok) {
            setShowOnboarding(false);
            setUser(prev => ({ ...prev!, username: onboardingData.username, name: onboardingData.name, profileCompleted: true }));
            await loadDashboardData();
          }
        }}
      />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load user data</p>
          <p className="text-gray-600 mb-4 text-sm">Please try refreshing the page or logging in again.</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => navigate("/login")} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-10 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2 group hover:scale-105 transition-all duration-300" onClick={() => navigate('/')} role="button">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">ShowWork</span>
          </div>
        </div>
        
        <div className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <li>
              <div className="flex items-center space-x-3 px-3 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </div>
            </li>
            <li>
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <FolderOpen className="w-5 h-5" />
                <span>Tasks</span>
              </div>
            </li>
            <li>
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <Calendar className="w-5 h-5" />
                <span>Calendar</span>
              </div>
            </li>
            <li>
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </div>
            </li>
            <li>
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <Users className="w-5 h-5" />
                <span>Team</span>
              </div>
            </li>
          </ul>
          
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">General</h3>
            <ul className="space-y-2">
              <li>
                <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => setShowDeveloperSetup(true)}>
                  <Star className="w-5 h-5" />
                  <span>Complete Profile Setup</span>
                </div>
              </li>
              <li>
                <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => setShowProfileCompletion(true)}>
                  <User className="w-5 h-5" />
                  <span>Edit Profile</span>
                </div>
              </li>
              <li>
                <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </div>
              </li>
              <li>
                <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <HelpCircle className="w-5 h-5" />
                  <span>Help</span>
                </div>
              </li>
              <li>
                <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <Smartphone className="w-8 h-8 mx-auto mb-2" />
                <h4 className="font-semibold text-sm mb-1">Download our Mobile App</h4>
                <p className="text-xs opacity-90 mb-3">Manage projects on the go</p>
                <Button size="sm" variant="secondary" className="w-full bg-white text-green-600 hover:bg-gray-100">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </nav>

      {/* Main Content */}
      <div className="ml-64">
        <header className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Track, manage, and collaborate on your projects with ease.</p>
              </div>
              {/* Optimized background loading indicator */}
              {dashboardDataLoading && (
                <div className="flex items-center space-x-2 text-green-600 transition-opacity duration-300">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                  <span className="text-xs font-medium">Syncing...</span>
                </div>
              )}
              {preloadStarted && !dashboardDataLoading && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">Ready</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search projects, team, tasks..." className="pl-9 w-80" />
              </div>
              <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => setShowProfileCompletion(true)}>
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff`} 
                  alt={user?.name} 
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">Click to edit profile</p>
                </div>
                <User className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <Button onClick={handleAddProject} className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
              <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Users className="w-4 h-4 mr-2" />
                Invite Team
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <FileText className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>
        
        <div className="p-8 space-y-8">
          {/* Status Cards */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <BlurFade delay={0.1} inView>
                <Card className="shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Total Projects</p>
                        <p className="text-3xl font-bold text-green-900">24</p>
                        <div className="flex items-center mt-2">
                          <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-sm text-green-600 font-medium">+12%</span>
                          <span className="text-sm text-gray-500 ml-1">vs last month</span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FolderOpen className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
              
              <BlurFade delay={0.2} inView>
                <Card className="shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-emerald-700">Ended Projects</p>
                        <p className="text-3xl font-bold text-emerald-900">10</p>
                        <div className="flex items-center mt-2">
                          <ArrowUp className="w-4 h-4 text-emerald-600 mr-1" />
                          <span className="text-sm text-emerald-600 font-medium">+25%</span>
                          <span className="text-sm text-gray-500 ml-1">completion rate</span>
                        </div>
                      </div>
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
              
              <BlurFade delay={0.3} inView>
                <Card className="shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-teal-50 border-green-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Running Projects</p>
                        <p className="text-3xl font-bold text-green-900">12</p>
                        <div className="flex items-center mt-2">
                          <Activity className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-sm text-green-600 font-medium">Active</span>
                          <span className="text-sm text-gray-500 ml-1">on track</span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
              
              <BlurFade delay={0.4} inView>
                <Card className="shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-700">Pending Projects</p>
                        <p className="text-3xl font-bold text-yellow-900">2</p>
                        <div className="flex items-center mt-2">
                          <Clock className="w-4 h-4 text-yellow-600 mr-1" />
                          <span className="text-sm text-yellow-600 font-medium">Awaiting</span>
                          <span className="text-sm text-gray-500 ml-1">approval</span>
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            </div>
          </section>
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Analytics */}
              <BlurFade delay={0.5} inView>
                <Card className="shadow-sm bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900">Project Analytics</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-green-700 border-green-200">This Week</Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Weekly project completion trends</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex flex-col justify-end">
                      {/* Bar Chart */}
                      <div className="flex items-end justify-between space-x-4 h-48 mb-4">
                        <div className="flex flex-col items-center space-y-2 group cursor-pointer">
                          <div className="w-12 bg-green-500 rounded-t group-hover:bg-green-600 transition-colors" style={{height: '80%'}}></div>
                          <span className="text-sm text-gray-600 font-medium">M</span>
                          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">8 tasks</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 group cursor-pointer">
                          <div className="w-12 bg-green-500 rounded-t group-hover:bg-green-600 transition-colors" style={{height: '60%'}}></div>
                          <span className="text-sm text-gray-600 font-medium">T</span>
                          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">6 tasks</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 group cursor-pointer">
                          <div className="w-12 bg-green-500 rounded-t group-hover:bg-green-600 transition-colors" style={{height: '90%'}}></div>
                          <span className="text-sm text-gray-600 font-medium">W</span>
                          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">12 tasks</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 group cursor-pointer">
                          <div className="w-12 bg-gray-300 rounded-t group-hover:bg-gray-400 transition-colors" style={{height: '40%'}}></div>
                          <span className="text-sm text-gray-600 font-medium">T</span>
                          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">4 tasks</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 group cursor-pointer">
                          <div className="w-12 bg-gray-300 rounded-t group-hover:bg-gray-400 transition-colors" style={{height: '30%'}}></div>
                          <span className="text-sm text-gray-600 font-medium">F</span>
                          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">3 tasks</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 group cursor-pointer">
                          <div className="w-12 bg-gray-300 rounded-t group-hover:bg-gray-400 transition-colors" style={{height: '20%'}}></div>
                          <span className="text-sm text-gray-600 font-medium">S</span>
                          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">2 tasks</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 group cursor-pointer">
                          <div className="w-12 bg-gray-300 rounded-t group-hover:bg-gray-400 transition-colors" style={{height: '25%'}}></div>
                          <span className="text-sm text-gray-600 font-medium">S</span>
                          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">1 task</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span>Completed</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-300 rounded"></div>
                            <span>Upcoming</span>
                          </div>
                        </div>
                        <span className="font-medium">36 total tasks this week</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
              
              {/* Projects List */}
              <BlurFade delay={0.6} inView>
                <Card className="shadow-sm bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900">Active Projects</CardTitle>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FolderOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">E-commerce Platform</h4>
                              <p className="text-sm text-gray-500">Due: Aug 30, 2024</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">High Priority</Badge>
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              running
                            </span>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">75%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                            <span>15/20 tasks completed</span>
                            <span>3 team members</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Target className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Mobile App Design</h4>
                              <p className="text-sm text-gray-500">Due: Sep 15, 2024</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="border-yellow-200 text-yellow-700">Medium Priority</Badge>
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              pending
                            </span>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Star className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">25%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{width: '25%'}}></div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                            <span>5/20 tasks completed</span>
                            <span>2 team members</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Website Redesign</h4>
                              <p className="text-sm text-gray-500">Completed: Aug 20, 2024</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="border-green-200 text-green-700">Completed</Badge>
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              ended
                            </span>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-green-700">100%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                            <span>25/25 tasks completed</span>
                            <span>4 team members</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              {/* Reminders */}
              <BlurFade delay={0.7} inView>
                <Card className="shadow-sm bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900">Upcoming Deadlines</CardTitle>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">E-commerce Platform Review</p>
                          <p className="text-xs text-red-600">Due tomorrow at 2:00 PM</p>
                        </div>
                        <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Team Stand-up Meeting</p>
                          <p className="text-xs text-yellow-600">Due in 3 days</p>
                        </div>
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Client Presentation</p>
                          <p className="text-xs text-blue-600">Due next week</p>
                        </div>
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      
                      <div className="text-center pt-2">
                        <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-gray-50">
                          View All Reminders
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
              
              {/* Team Collaboration */}
              <BlurFade delay={0.8} inView>
                <Card className="shadow-sm bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900">Team Collaboration</CardTitle>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        <Users className="w-4 h-4 mr-2" />
                        Invite
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                        <img 
                          src="https://ui-avatars.com/api/?name=Alexandra+Deff&background=10b981&color=fff" 
                          alt="Alexandra Deff" 
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Alexandra Deff</h4>
                          <p className="text-sm text-gray-500">Project Manager • 8 active tasks</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">Online</span>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                        <img 
                          src="https://ui-avatars.com/api/?name=Edwin+Adenike&background=3b82f6&color=fff" 
                          alt="Edwin Adenike" 
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Edwin Adenike</h4>
                          <p className="text-sm text-gray-500">Developer • 12 active tasks</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">Online</span>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                        <img 
                          src="https://ui-avatars.com/api/?name=Isaac+Oluwatemilorun&background=f59e0b&color=fff" 
                          alt="Isaac Oluwatemilorun" 
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Isaac Oluwatemilorun</h4>
                          <p className="text-sm text-gray-500">Designer • 5 active tasks</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <span className="text-xs text-yellow-600 font-medium">Away</span>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                        <img 
                          src="https://ui-avatars.com/api/?name=David+Oshodi&background=ef4444&color=fff" 
                          alt="David Oshodi" 
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">David Oshodi</h4>
                          <p className="text-sm text-gray-500">QA Engineer • 3 active tasks</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-500 font-medium">Offline</span>
                          <span className="text-xs text-gray-400">2h ago</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3 mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Team Performance</span>
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-green-600">Excellent</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
              
              {/* Project Progress */}
              <BlurFade delay={0.9} inView>
                <Card className="shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Project Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-200"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-green-500"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray="41, 59"
                            strokeLinecap="round"
                            fill="transparent"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">41%</div>
                            <div className="text-xs text-gray-500">Progress</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Projects Completed</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Completed</span>
                          </div>
                          <span className="font-medium">10</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>In Progress</span>
                          </div>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>Pending</span>
                          </div>
                          <span className="font-medium">2</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
              
              {/* Time Tracker */}
              <BlurFade delay={1.0} inView>
                <Card className="shadow-sm bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900">Time Tracker</CardTitle>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        <Activity className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
                        01:24:08
                      </div>
                      <div className="text-sm text-gray-600 mb-6">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Active Session: E-commerce Platform</span>
                        </div>
                        <p className="text-xs text-gray-500">Started at 9:30 AM</p>
                      </div>
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          <Square className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Today's Total</span>
                          <span className="font-medium text-gray-900">3h 45m</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Week's Total</span>
                          <span className="font-medium text-gray-900">18h 30m</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Productivity</span>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-600">+15%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}