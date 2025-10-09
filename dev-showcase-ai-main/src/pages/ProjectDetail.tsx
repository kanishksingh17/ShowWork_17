import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Presentation,
  BarChart3,
  Settings,
  Megaphone,
  Plus,
  Eye,
  Code,
  Image,
  HelpCircle,
  Save,
  Share2,
  Download,
  Edit3,
  LayoutDashboard,
  Users,
  FolderOpen,
  Zap,
  Package,
  BarChart,
  Folder,
  Plug,
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
  url?: string;
  tags?: string[];
  technologies?: string[];
  media?: any[];
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('project-info');
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: string;
    name: string;
    role: string;
    initials: string;
    color: string;
  }>>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('showcase-projects');
    
    // Redirect to login page
    navigate('/login');
  };

  useEffect(() => {
    // Load project data from localStorage
    const storedProjects = localStorage.getItem('showcase-projects');
    if (storedProjects && id) {
      const projects = JSON.parse(storedProjects);
      const foundProject = projects.find((p: Project) => p.id === id);
      setProject(foundProject || null);
    }
    
    // Load team members from localStorage
    const storedTeamMembers = localStorage.getItem(`team-members-${id}`);
    if (storedTeamMembers) {
      setTeamMembers(JSON.parse(storedTeamMembers));
    }
  }, [id]);

  const addTeamMember = (name: string, role: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    const color = colors[teamMembers.length % colors.length];
    
    const newMember = {
      id: Date.now().toString(),
      name,
      role,
      initials,
      color
    };
    
    const updatedMembers = [...teamMembers, newMember];
    setTeamMembers(updatedMembers);
    
    // Save to localStorage
    localStorage.setItem(`team-members-${id}`, JSON.stringify(updatedMembers));
  };

  const removeTeamMember = (memberId: string) => {
    const updatedMembers = teamMembers.filter(member => member.id !== memberId);
    setTeamMembers(updatedMembers);
    
    // Save to localStorage
    localStorage.setItem(`team-members-${id}`, JSON.stringify(updatedMembers));
  };

  const handleInviteTeam = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      addTeamMember(newMemberName.trim(), newMemberRole.trim());
      setNewMemberName('');
      setNewMemberRole('');
      setShowInviteModal(false);
    }
  };

  const getCodeQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-600';
    if (quality >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCodeQuality = () => {
    // Simulate dynamic code quality based on project data
    const baseQuality = 95;
    const bugPenalty = (project?.views || 0) > 100 ? 5 : 0;
    const teamBonus = teamMembers.length > 0 ? 2 : 0;
    return Math.max(0, Math.min(100, baseQuality - bugPenalty + teamBonus));
  };

  if (!project) {
    return (
      <div className="flex h-screen p-4 bg-gray-50">
        <aside className="w-64 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white flex flex-col rounded-xl shadow-lg m-4">
          <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-mono text-sm font-bold">&lt;/&gt;</span>
            </div>
            <h1 className="text-xl font-extrabold text-white">ShowWork</h1>
          </div>
          
          <nav className="flex-1 px-4 py-2 space-y-1">
            <div 
              className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
              onClick={() => navigate('/dashboard')}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </div>
            <div 
              className="flex items-center px-4 py-3 text-sm font-medium bg-blue-600 text-white shadow-sm rounded-lg cursor-pointer transition-all duration-200"
              onClick={() => navigate('/showcase')}
            >
              <Package className="w-5 h-5 mr-3" />
              Showcase
            </div>
            <div 
              className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
              onClick={() => navigate('/analytics')}
            >
              <BarChart className="w-5 h-5 mr-3" />
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
              <Folder className="w-5 h-5 mr-3" />
              Portfolio
            </div>
            <div 
              className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
              onClick={() => navigate('/integrations')}
            >
              <Plug className="w-5 h-5 mr-3" />
              Integrations
            </div>
          </nav>
          
          <div className="px-4 py-2 border-t border-white/10">
            <div 
              className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
              onClick={() => navigate('/settings')}
            >
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
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-gray-900 text-2xl font-bold mb-4">Project Not Found</h1>
            <Button onClick={() => navigate('/showcase')} className="bg-[#1E3A8A] hover:bg-[#1D4ED8]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Showcase
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const tabs = [
    { id: 'project-info', label: 'Project Information', icon: Presentation },
    { id: 'tech-stack', label: 'Technology Stack', icon: Code },
    { id: 'project-media', label: 'Project Media', icon: Image },
    { id: 'actions-help', label: 'Actions & Help', icon: HelpCircle }
  ];

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
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </div>
          <div className="flex items-center px-4 py-3 text-sm font-medium bg-blue-600 text-white rounded-lg shadow-sm">
            <Package className="w-5 h-5 mr-3" />
            Showcase
          </div>
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/analytics')}
          >
            <BarChart className="w-5 h-5 mr-3" />
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
            <Folder className="w-5 h-5 mr-3" />
            Portfolio
          </div>
          <div className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200">
            <Plug className="w-5 h-5 mr-3" />
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
                <button 
                  onClick={() => navigate('/showcase')}
                  className="hover:text-gray-700"
                >
                  Showcase
                </button>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{project.name}</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-500">Last updated {project.lastUpdated}</p>
            </div>
            <div className="flex border-b border-gray-200 gap-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      // Navigate to separate pages instead of switching tabs
                      switch (tab.id) {
                        case 'tech-stack':
                          navigate('/technology-stack');
                          break;
                        case 'project-media':
                          navigate('/project-media');
                          break;
                        case 'actions-help':
                          navigate('/actions-help');
                          break;
                        default:
                          setActiveTab(tab.id);
                      }
                    }}
                    className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                      isActive 
                        ? 'border-b-[#1E3A8A] text-[#1E3A8A]' 
                        : 'border-b-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <p className="text-sm font-bold tracking-[0.015em]">{tab.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Top Row - Project Metrics */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-gray-900 text-lg font-bold mb-4">Project Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Tasks Completed</span>
                    <span className="text-gray-900 font-semibold">120</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Bugs Found</span>
                    <span className="text-gray-900 font-semibold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Code Quality</span>
                    <span className={`font-semibold ${getCodeQualityColor(getCodeQuality())}`}>
                      {getCodeQuality()}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Hours Logged</span>
                    <span className="text-gray-900 font-semibold">450</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-gray-900 text-lg font-bold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-gray-900 text-sm font-medium">Jul 18, 10:30 AM</span>
                    <span className="text-gray-600 text-xs">Task "Implement user authentication" completed.</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 text-sm font-medium">Jul 17, 4:15 PM</span>
                    <span className="text-gray-600 text-xs">Bug #256 reported by QA team.</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 text-sm font-medium">Jul 17, 11:00 AM</span>
                    <span className="text-gray-600 text-xs">Code review for "Dashboard UI" completed.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-gray-900 text-lg font-bold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <button className="w-full text-left text-[#1E3A8A] hover:text-[#1D4ED8] text-sm">
                    View Project Roadmap
                  </button>
                  <button className="w-full text-left text-[#1E3A8A] hover:text-[#1D4ED8] text-sm">
                    Access Documentation
                  </button>
                  <button className="w-full text-left text-[#1E3A8A] hover:text-[#1D4ED8] text-sm">
                    Submit Feedback
                  </button>
                  <button className="w-full text-left text-[#1E3A8A] hover:text-[#1D4ED8] text-sm">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row - Task Completion Rate */}
            <div className="col-span-12 md:col-span-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 text-lg font-bold">Task Completion Rate</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#1E3A8A] rounded"></div>
                    <span className="text-sm text-gray-600">Tasks Completed</span>
                  </div>
                </div>
                
                {/* Line Chart with Area Fill */}
                <div className="relative h-64">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 pr-2">
                    <span>26</span>
                    <span>24</span>
                    <span>22</span>
                    <span>20</span>
                    <span>18</span>
                    <span>16</span>
                    <span>14</span>
                    <span>12</span>
                    <span>10</span>
                  </div>
                  
                  {/* Chart area */}
                  <div className="ml-8 mr-4 h-full relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div 
                          key={i}
                          className="absolute w-full border-t border-gray-200"
                          style={{top: `${i * 12.5}%`}}
                        ></div>
                      ))}
                    </div>
                    
                    {/* SVG for line chart */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Area fill */}
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.05"/>
                        </linearGradient>
                      </defs>
                      
                      {/* Area path */}
                      <path
                        d="M 0,75 L 16.67,50 L 33.33,35 L 50,40 L 66.67,25 L 83.33,15 L 100,20 L 100,100 L 0,100 Z"
                        fill="url(#areaGradient)"
                      />
                      
                      {/* Line path */}
                      <path
                        d="M 0,75 L 16.67,50 L 33.33,35 L 50,40 L 66.67,25 L 83.33,15 L 100,20"
                        fill="none"
                        stroke="#1E3A8A"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Data points */}
                      <circle cx="0" cy="75" r="1.5" fill="#1E3A8A"/>
                      <circle cx="16.67" cy="50" r="1.5" fill="#1E3A8A"/>
                      <circle cx="33.33" cy="35" r="1.5" fill="#1E3A8A"/>
                      <circle cx="50" cy="40" r="1.5" fill="#1E3A8A"/>
                      <circle cx="66.67" cy="25" r="1.5" fill="#1E3A8A"/>
                      <circle cx="83.33" cy="15" r="1.5" fill="#1E3A8A"/>
                      <circle cx="100" cy="20" r="1.5" fill="#1E3A8A"/>
                    </svg>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-8 right-4 flex justify-between text-xs text-gray-600">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-gray-900 text-lg font-bold mb-4">Team Members</h3>
                <div className="space-y-4">
                  {teamMembers.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No team members yet</p>
                      <p className="text-gray-400 text-xs">Click "Invite team" to add members</p>
                    </div>
                  ) : (
                    teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between space-x-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">{member.initials}</span>
                          </div>
                          <div>
                            <p className="text-gray-900 text-sm font-medium">{member.name}</p>
                            <p className="text-gray-600 text-xs">{member.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeTeamMember(member.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
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
              Back to Project Overview
            </Button>
            <Button 
              variant="outline"
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
              onClick={() => setShowInviteModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Invite team
            </Button>
            <Button 
              className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white"
              onClick={() => navigate(`/showcase/edit/${project.id}`)}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </main>

      {/* Invite Team Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Invite Team Member</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  placeholder="Enter member name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  placeholder="Enter member role"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowInviteModal(false);
                  setNewMemberName('');
                  setNewMemberRole('');
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInviteTeam}
                disabled={!newMemberName.trim() || !newMemberRole.trim()}
                className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Member
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
