import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Users, 
  FolderOpen, 
  Zap, 
  Settings, 
  Plus,
  Edit3,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'pending' | 'published' | 'in-progress' | 'saved';
  lastUpdated: string;
  category: string;
  views?: number;
  submittedAt?: string;
}

interface ShowcaseDashboardProps {
  onBackToDashboard?: () => void;
  onCreateProject?: () => void;
  onEditProject?: (projectId: string) => void;
}

const ShowcaseDashboard = ({ 
  onBackToDashboard, 
  onCreateProject, 
  onEditProject 
}: ShowcaseDashboardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);

  // Determine current page based on route
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/analytics') return 'analytics';
    if (path === '/community') return 'community';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/showcase') return 'showcase';
    return 'showcase'; // default
  };

  const currentPage = getCurrentPage();

  // Sorting state
  const [sortField, setSortField] = useState<'name' | 'lastUpdated' | 'views' | 'status'>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('showcase-projects');
    
    // Redirect to login page
    navigate('/login');
  };

  // Load projects from localStorage on component mount
  useEffect(() => {
    const loadProjects = () => {
      const storedProjects = localStorage.getItem('showcase-projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    };
    
    loadProjects();
    
    // Listen for storage changes (when projects are added from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'showcase-projects') {
        loadProjects();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates by randomly updating view counts
      setProjects(prevProjects => 
        prevProjects.map(project => {
          if (project.status === 'published' && Math.random() > 0.7) {
            return {
              ...project,
              views: (project.views || 0) + Math.floor(Math.random() * 5) + 1,
              lastUpdated: 'Just now'
            };
          }
          return project;
        })
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Sorting function
  const sortProjects = (projects: Project[]) => {
    return [...projects].sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        case 'views':
          aValue = a.views || 0;
          bValue = b.views || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (field: 'name' | 'lastUpdated' | 'views' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Reload projects from localStorage
    const storedProjects = localStorage.getItem('showcase-projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const savedProjects = sortProjects(projects.filter(p => p.status === 'draft'));
  const submittedProjects = sortProjects(projects.filter(p => p.status !== 'draft'));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-[#292e38] text-white hover:bg-[#3c4453]">Draft</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10">Pending Review</Badge>;
      case 'published':
        return <Badge variant="outline" className="border-[#10B981] text-[#10B981] bg-[#10B981]/10">Published</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/10">In Progress</Badge>;
      case 'saved':
        return <Badge variant="outline" className="border-[#6366F1] text-[#6366F1] bg-[#6366F1]/10">Saved</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'published').length,
    pending: projects.filter(p => p.status === 'pending').length,
    saved: projects.filter(p => p.status === 'saved').length
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white flex flex-col rounded-xl shadow-lg m-4">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-mono text-sm font-bold">&lt;/&gt;</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">ShowWork</h1>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          <div 
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
              currentPage === 'dashboard' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-[#9CA3AF] hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </div>
          <div 
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
              currentPage === 'showcase' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-[#9CA3AF] hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => navigate('/showcase')}
          >
            <Package className="w-5 h-5 mr-3" />
            Showcase
          </div>
          <div 
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
              currentPage === 'analytics' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-[#9CA3AF] hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => navigate('/analytics')}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </div>
          <div 
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
              currentPage === 'community' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-[#9CA3AF] hover:bg-white/10 hover:text-white'
            }`}
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
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
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
                <span>{currentPage === 'analytics' ? 'Analytics' : currentPage === 'community' ? 'Community' : 'Showcase'}</span>
                <span className="mx-2">/</span>
                <span className="text-gray-900">
                  {currentPage === 'analytics' ? 'Dashboard' : currentPage === 'community' ? 'Community Hub' : 'My Projects'}
                </span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentPage === 'analytics' ? 'Analytics Dashboard' : currentPage === 'community' ? 'Community Hub' : 'My Projects'}
              </h1>
              <p className="text-sm text-gray-500">
                {currentPage === 'analytics' ? 'Track your project performance and insights' : 
                 currentPage === 'community' ? 'Connect with other developers and share your work' : 
                 'Manage and showcase your portfolio projects'}
              </p>
            </div>
            {currentPage === 'showcase' && (
              <Button 
                onClick={() => navigate('/showcase/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {currentPage === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900">Total Views</h3>
                    <p className="text-2xl font-bold text-blue-600">1,234</p>
                    <p className="text-xs text-blue-600">+12% from last month</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-900">Engagement Rate</h3>
                    <p className="text-2xl font-bold text-green-600">85%</p>
                    <p className="text-xs text-green-600">+5% from last month</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-900">Active Projects</h3>
                    <p className="text-2xl font-bold text-purple-600">12</p>
                    <p className="text-xs text-purple-600">3 new this week</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart visualization coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'community' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Hub</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
                    <h3 className="text-lg font-semibold mb-2">Featured Projects</h3>
                    <p className="text-sm opacity-90">Discover amazing work from the community</p>
                    <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                      Explore
                    </button>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-lg text-white">
                    <h3 className="text-lg font-semibold mb-2">Developer Forums</h3>
                    <p className="text-sm opacity-90">Connect and discuss with fellow developers</p>
                    <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                      Join Discussion
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">JD</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">John Doe shared a new project</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">SM</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sarah Miller commented on your project</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'showcase' && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl bg-white p-6 text-gray-900 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Projects</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="text-gray-400">
                  <Package className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 text-gray-900 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">In Progress</h3>
                  <p className="text-3xl font-bold text-[#1E3A8A]">{stats.inProgress}</p>
                </div>
                <div className="text-gray-400">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 text-gray-900 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Completed</h3>
                  <p className="text-3xl font-bold text-[#10B981]">{stats.completed}</p>
                </div>
                <div className="text-gray-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 text-gray-900 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Pending Review</h3>
                  <p className="text-3xl font-bold text-[#F59E0B]">{stats.pending}</p>
                </div>
                <div className="text-gray-400">
                  <AlertCircle className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 text-gray-900 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Saved</h3>
                  <p className="text-3xl font-bold text-[#6366F1]">{stats.saved}</p>
                </div>
                <div className="text-gray-400">
                  <Package className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Saved Projects */}
          <div className="mb-8">
            <h2 className="text-gray-900 text-2xl font-bold mb-4">Saved Projects</h2>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-gray-900 text-sm font-medium">Project</th>
                    <th className="px-6 py-4 text-left text-gray-900 text-sm font-medium">Description</th>
                    <th className="px-6 py-4 text-left text-gray-900 text-sm font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-gray-500 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-gray-900 font-medium">{project.name}</div>
                          <div className="text-gray-500 text-sm">{project.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm max-w-md">
                        {project.description}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/showcase/create?draft=${project.id}`)}
                          className="text-[#1E3A8A] hover:text-[#1D4ED8] font-medium text-sm transition-colors flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          {project.status === 'draft' ? 'Continue' : 'Edit'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submitted Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 text-2xl font-bold">Submitted Projects</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th 
                      className="px-6 py-4 text-left text-gray-900 text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Project
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        )}
                        {sortField !== 'name' && <ArrowUpDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-900 text-sm font-medium">Description</th>
                    <th 
                      className="px-6 py-4 text-left text-gray-900 text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortField === 'status' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        )}
                        {sortField !== 'status' && <ArrowUpDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-gray-900 text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('views')}
                    >
                      <div className="flex items-center gap-2">
                        Views
                        {sortField === 'views' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        )}
                        {sortField !== 'views' && <ArrowUpDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-500 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-gray-900 font-medium">{project.name}</div>
                          <div className="text-gray-500 text-sm">{project.category}</div>
                          {project.submittedAt && (
                            <div className="text-gray-500 text-xs mt-1">Submitted {project.submittedAt}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm max-w-md">
                        {project.description}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-500 text-sm">
                          {project.views ? (
                            <span className="text-gray-900 font-medium">{project.views.toLocaleString()}</span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/showcase/view/${project.id}`)}
                          className="text-[#1E3A8A] hover:text-[#1D4ED8] font-medium text-sm transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShowcaseDashboard;
