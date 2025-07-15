import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const DashboardLayout = ({ children, activeTab }: DashboardLayoutProps) => {
  const { user, loading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize sidebar state from localStorage or default based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Check if we have a saved preference
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Default based on screen size
    return window.innerWidth >= 1024;
  });

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      const wasMobile = isMobile;
      setIsMobile(mobile);
      
      // Only auto-set sidebar state on initial load or when switching between mobile/desktop
      if (!isInitialized) {
        // Initial load: set based on screen size if no saved preference
        const saved = localStorage.getItem('sidebarOpen');
        if (saved === null) {
          if (mobile) {
            setSidebarOpen(false);
          } else {
            setSidebarOpen(true);
          }
        }
        setIsInitialized(true);
      } else if (wasMobile !== mobile) {
        // Screen size category changed (mobile <-> desktop)
        if (mobile) {
          setSidebarOpen(false); // Always close sidebar when switching to mobile
        }
        // Don't auto-open on desktop switch - let user control it
      }
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isMobile, isInitialized]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector('[data-sidebar]');
        const target = event.target as Node;
        
        if (sidebar && !sidebar.contains(target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex relative">
        <Sidebar 
          activeTab={activeTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        
        {/* Main content area */}
        <div className={`
          flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0
          ${isMobile 
            ? 'ml-0' // On mobile, no margin as sidebar is overlay
            : sidebarOpen 
              ? 'ml-64' // Desktop with sidebar open
              : 'ml-16' // Desktop with sidebar collapsed
          }
        `}>
          <Header 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
          
          {/* Main content */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
            <div className="max-w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};