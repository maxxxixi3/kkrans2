import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import LoginPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import DistributionPage from "./pages/dashboard/distribution";
import SettingsPage from "./pages/dashboard/settings";
import VehiclesPage from "./pages/dashboard/vehicles";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard/distribution"
            element={<DistributionPage />}
          />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/vehicles" element={<VehiclesPage />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
