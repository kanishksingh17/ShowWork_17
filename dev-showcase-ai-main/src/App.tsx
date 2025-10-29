import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import ShowWorkLanding from "./components/ShowWorkLanding";
import Login from "./pages/Login";

// Authentication wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        // Check if there's a session token or user data
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        // Also check for OAuth success in URL params
        const urlParams = new URLSearchParams(window.location.search);
        const oauthSuccess = urlParams.get('oauth_success');
        
        if (oauthSuccess === 'true') {
          // OAuth was successful, set as authenticated
          localStorage.setItem('authToken', 'oauth_token');
          localStorage.setItem('user', JSON.stringify({ oauth: true }));
          setIsAuthenticated(true);
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (token && user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<ShowWorkLanding />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/content" element={
          <ProtectedRoute>
            <ContentManagement />
          </ProtectedRoute>
        } />
        <Route path="/showcase" element={
          <ProtectedRoute>
            <ShowcaseDashboard />
          </ProtectedRoute>
        } />
        <Route path="/showcase/add" element={
          <ProtectedRoute>
            <EnhancedProjectCreation />
          </ProtectedRoute>
        } />
        <Route path="/showcase/manual-add" element={
          <ProtectedRoute>
            <ManualProjectForm />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/analytics/comprehensive" element={
          <ProtectedRoute>
            <ComprehensiveAnalyticsDashboard portfolioId="default" />
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        } />
        <Route path="/portfolio" element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        } />
        <Route path="/portfolio/builder" element={
          <ProtectedRoute>
            <PortfolioBuilder />
          </ProtectedRoute>
        } />
        <Route path="/integrations" element={
          <ProtectedRoute>
            <Integrations />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
