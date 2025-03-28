import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import AppointmentDistribution from "@/components/dashboard/AppointmentDistribution";

const DistributionPage = () => {
  // Mock logout function
  const handleLogout = () => {
    console.log("Logout clicked");
    // In a real implementation, this would handle the logout process
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        <AppointmentDistribution />
      </main>
    </div>
  );
};

export default DistributionPage;
