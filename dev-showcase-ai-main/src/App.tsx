import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DeveloperSetupPage from "./pages/DeveloperSetupPage";
import ProfileCompletion from "./pages/ProfileCompletion";
import TestDeveloperSetup from "./pages/TestDeveloperSetup";
import SetupCompletePage from "./pages/SetupCompletePage";
import SetupCompleteDemo from "./pages/SetupCompleteDemo";
import TestOnboardingFlow from "./pages/TestOnboardingFlow";
import APITestComponent from "./components/APITestComponent";
import SkillQuizSystem from "./components/SkillQuizSystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setup" element={<DeveloperSetupPage />} />
          <Route path="/test-setup" element={<TestDeveloperSetup />} />
          <Route path="/test-api" element={<APITestComponent />} />
          <Route path="/quiz" element={<SkillQuizSystem />} />
          <Route path="/profile-setup" element={<ProfileCompletion />} />
          <Route path="/profile" element={<ProfileCompletion />} />
          <Route path="/setup-complete" element={<SetupCompletePage />} />
          <Route path="/setup-complete-demo" element={<SetupCompleteDemo />} />
          <Route path="/test-onboarding" element={<TestOnboardingFlow />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
