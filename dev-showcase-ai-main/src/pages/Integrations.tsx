import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  BarChart,
  Users,
  Folder,
  Plug,
  Settings,
  LogOut
} from 'lucide-react';

export default function Integrations() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('showcase-projects');
    
    // Redirect to login page
    navigate('/login');
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
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
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
            className="flex items-center px-4 py-3 text-sm font-medium bg-blue-600 text-white shadow-sm rounded-lg cursor-pointer transition-all duration-200"
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Integrations</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600">Integrations coming soon...</p>
        </div>
      </main>
    </div>
  );
}
