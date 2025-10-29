import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EnhancedProjectCreation from "./pages/EnhancedProjectCreation";
import ShowcaseDashboard from "./pages/ShowcaseDashboard";
import ManualProjectForm from "./app/showcase/ManualProjectForm";
import ContentManagement from "./pages/ContentManagement";
import Analytics from "./pages/Analytics";
import { ComprehensiveAnalyticsDashboard } from "./components/dashboard/ComprehensiveAnalyticsDashboard";
import Community from "./pages/Community";
import Portfolio from "./pages/Portfolio";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content" element={<ContentManagement />} />
        <Route path="/showcase" element={<ShowcaseDashboard />} />
        <Route path="/showcase/add" element={<EnhancedProjectCreation />} />
        <Route
          path="/showcase/manual-add"
          element={<ManualProjectForm />}
        />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/analytics/comprehensive" element={<ComprehensiveAnalyticsDashboard portfolioId="default" />} />
        <Route path="/community" element={<Community />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/builder" element={<PortfolioBuilder />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
