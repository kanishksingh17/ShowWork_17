/**
 * Premium Sidebar Component for ShowWork Dashboard
 * Modern SaaS-style sidebar with glassmorphism and smooth animations
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Users,
  FolderOpen,
  Settings,
  LogOut,
  Briefcase,
  Plug,
  FileText,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  currentPage?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current page from location
  const getCurrentPage = () => {
    if (currentPage) return currentPage;
    const path = location.pathname;
    if (path === "/dashboard") return "dashboard";
    if (path === "/content" || path.startsWith("/content/")) return "content";
    if (path === "/showcase" || path.startsWith("/showcase/"))
      return "showcase";
    if (path === "/analytics") return "analytics";
    if (path === "/community") return "community";
    if (path === "/integrations") return "integrations";
    if (path === "/portfolio" || path.startsWith("/portfolio/"))
      return "portfolio";
    return "dashboard";
  };

  const activePage = getCurrentPage();

  // Navigation items with enhanced styling
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      description: "Overview & insights",
    },
    {
      id: "content",
      label: "Content",
      icon: FileText,
      path: "/content",
      description: "Manage your content",
    },
    {
      id: "showcase",
      label: "Showcase",
      icon: Package,
      path: "/showcase",
      description: "Project portfolio",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/analytics",
      description: "Performance metrics",
    },
    {
      id: "community",
      label: "Community",
      icon: Users,
      path: "/community",
      description: "Connect & network",
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: Plug,
      path: "/integrations",
      description: "Third-party tools",
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: Briefcase,
      path: "/portfolio",
      description: "Public portfolio",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logout clicked");
  };

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-r border-slate-700/50 shadow-2xl z-50">
      {/* Header with Logo */}
      <div className="p-6 border-b border-slate-700/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ShowWork</h1>
            <p className="text-xs text-slate-400">AI-Powered Portfolio</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full group relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 shadow-lg shadow-blue-500/10"
                  : "hover:bg-slate-700/50 hover:border-slate-600/50 border border-transparent"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-slate-400 group-hover:text-slate-300 group-hover:bg-slate-600/50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "scale-105" : "group-hover:scale-105"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <div
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-300 group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </div>
                  <div
                    className={`text-xs transition-colors duration-200 ${
                      isActive
                        ? "text-blue-300"
                        : "text-slate-500 group-hover:text-slate-400"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {isActive && (
                <ChevronRight className="w-4 h-4 text-blue-400 animate-pulse" />
              )}

              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r-full shadow-lg shadow-blue-400/50" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700/30">
        {/* Settings */}
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group">
          <div className="p-2 rounded-lg text-slate-400 group-hover:text-slate-300 group-hover:bg-slate-600/50 transition-all duration-200">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-200">
            Settings
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-200 group mt-2"
        >
          <div className="p-2 rounded-lg text-slate-400 group-hover:text-red-400 group-hover:bg-red-500/20 transition-all duration-200">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-slate-300 group-hover:text-red-400 transition-colors duration-200">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};
