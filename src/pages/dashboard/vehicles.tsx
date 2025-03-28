import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import VehicleManagement from "@/components/dashboard/VehicleManagement";

const VehiclesPage = () => {
  // Mock function for logout
  const handleLogout = () => {
    console.log("Logging out...");
    // In a real implementation, this would call your auth service
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Fahrzeugverwaltung
            </h1>
            <p className="text-gray-500 mt-1">
              Verwalten Sie Ihre Fahrzeugflotte und deren Verfügbarkeit für
              Buchungen.
            </p>
          </div>

          <VehicleManagement />
        </div>
      </main>
    </div>
  );
};

export default VehiclesPage;
