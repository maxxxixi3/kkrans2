import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import AppointmentOverview from "@/components/dashboard/AppointmentOverview";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardProps {
  isAuthenticated?: boolean;
}

const Dashboard = ({ isAuthenticated = true }: DashboardProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Mock logout function
  const handleLogout = () => {
    console.log("Logging out...");
    // In a real app, this would handle the logout process
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Terminübersicht
              </h1>
              <p className="text-sm text-gray-500">
                Verwalten Sie alle Termine im System
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-right">
              <div className="font-medium">Admin Benutzer</div>
              <div className="text-gray-500">admin@example.com</div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          <AppointmentOverview className="min-h-[calc(100vh-10rem)]" />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Krankentransport-Buchungssystem
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
