import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Settings from "@/components/dashboard/Settings";

const SettingsPage = () => {
  // Mock function for logout that would be implemented with Supabase Auth in a real app
  const handleLogout = () => {
    console.log("Logging out user");
    // In a real implementation, this would use Supabase Auth signOut
    // and redirect to login page
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">
        <Settings />
      </div>
    </div>
  );
};

export default SettingsPage;
