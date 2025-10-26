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
} from "lucide-react";

interface UnifiedSidebarProps {
  currentPage?: string;
}

export const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  currentPage,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // NOTE: This sidebar is completely static - navigation items never change order or position

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

  // Static navigation items - order never changes
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "content",
      label: "Content",
      icon: FileText,
      path: "/content",
    },
    {
      id: "showcase",
      label: "Showcase",
      icon: Package,
      path: "/showcase",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      id: "community",
      label: "Community",
      icon: Users,
      path: "/community",
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: FolderOpen,
      path: "/portfolio",
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: Plug,
      path: "/integrations",
    },
  ];

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white flex flex-col rounded-xl shadow-lg m-4 overflow-hidden">
      {/* Logo Section - Fixed Position */}
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-white font-mono text-sm font-bold">
            &lt;/&gt;
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-white">ShowWork</h1>
      </div>

      {/* Navigation Section - Static Order, Never Changes */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {navigationItems.map((item) => {
          const isActive = activePage === item.id;
          const IconComponent = item.icon;

          return (
            <div
              key={item.id}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-[#9CA3AF] hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => navigate(item.path)}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              {item.label}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section - Fixed Utility Links, Static Order */}
      <div className="px-4 py-2 border-t border-gray-700">
        <div
          className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
          onClick={() => navigate("/settings")}
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
  );
};
