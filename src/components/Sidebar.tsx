import { Home, GitBranch, User, Settings, TrendingUp, MessageSquare, Star, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ activeTab, isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  // Initialize state with localStorage value to prevent flicker
  const [ctaClosed, setCtaClosed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('GitHub Issues-cta-closed') === 'true';
    }
    return false;
  });

  const handleCloseCta = () => {
    setCtaClosed(true);
    localStorage.setItem('GitHub Issues-cta-closed', 'true');
  };
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "trending", label: "Trending", icon: TrendingUp, path: "/trending" },
    { id: "repositories", label: "Repositories", icon: GitBranch, path: "/repositories" },
    { id: "discussions", label: "Discussions", icon: MessageSquare, path: "/discussions" },
    { id: "starred", label: "Starred", icon: Star, path: "/starred" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 ease-in-out",
        // Desktop: Always visible, collapsible width
        "lg:translate-x-0",
        // Mobile: Slide in/out from left
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        // Width changes
        isOpen ? "w-64" : "w-64 lg:w-16"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              {(isOpen || window.innerWidth < 1024) && (
                <div className="min-w-0">
                  <h1 className="font-bold text-xl text-gray-900 truncate">PrioLab</h1>
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "w-full flex items-center px-3 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg mb-1 group",
                  isActive && "bg-blue-50 text-blue-600",
                  // Spacing adjustments for collapsed state
                  isOpen || window.innerWidth < 1024 ? "space-x-3" : "justify-center lg:justify-start lg:space-x-3"
                )}
                title={!isOpen && window.innerWidth >= 1024 ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {(isOpen || window.innerWidth < 1024) && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTA - only show when expanded */}
        {(isOpen || window.innerWidth < 1024) && !ctaClosed && (
          <div className="p-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseCta}
                className="absolute top-2 right-2 text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
              <h3 className="font-semibold text-sm pr-6">Sync Repositories</h3>
              <p className="text-xs opacity-90 mt-1">Connect your GitHub repos to get started</p>
              <Link to="/repositories">
                <Button 
                  size="sm"
                  className="mt-3 bg-white text-blue-600 hover:bg-gray-100 w-full"
                >
                  Add Repositories
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};