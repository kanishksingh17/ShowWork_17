import FeatureSection from "./components/FeatureSection";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DeveloperSetupPage from "./pages/DeveloperSetupPage";
import ProfileCompletion from "./pages/ProfileCompletion";
import TestDeveloperSetup from "./pages/TestDeveloperSetup";
import TestOnboardingFlow from "./pages/TestOnboardingFlow";
import APITestComponent from "./components/APITestComponent";
import SkillQuizSystem from "./components/SkillQuizSystem";
import QuizAPITest from "./components/QuizAPITest";
import ShowcaseDashboard from "./pages/ShowcaseDashboard";
import NewDashboard from "./pages/NewDashboard";
import ProjectShowcase from "./components/ProjectShowcase";
import ProjectDetail from "./pages/ProjectDetail";
import TechnologyStack from "./pages/TechnologyStack";
import ProjectMedia from "./pages/ProjectMedia";
import ActionsHelp from "./pages/ActionsHelp";
import Analytics from "./pages/Analytics";
import Community from "./pages/Community";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import Integrations from "./pages/Integrations";
import PortfolioEditor from "./pages/PortfolioEditor";
import PortfolioPreview from "./pages/PortfolioPreview";
import PublicPortfolio from "./pages/PublicPortfolio";
import OpenAITestComponent from "./components/OpenAITestComponent";
import S3TestComponent from "./components/S3TestComponent";
import VercelTestComponent from "./components/VercelTestComponent";
import APITestDashboard from "./components/APITestDashboard";

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
          <Route path="/dashboard" element={<NewDashboard />} />
          <Route path="/setup" element={<DeveloperSetupPage />} />
          <Route path="/test-setup" element={<TestDeveloperSetup />} />
          <Route path="/test-api" element={<APITestComponent />} />
          <Route path="/test-quiz-api" element={<QuizAPITest />} />
          <Route path="/quiz" element={<SkillQuizSystem />} />
          <Route path="/profile-setup" element={<ProfileCompletion />} />
          <Route path="/profile" element={<ProfileCompletion />} />
          <Route path="/test-onboarding" element={<TestOnboardingFlow />} />
          <Route path="/showcase" element={<ShowcaseDashboard />} />
          <Route path="/showcase/create" element={<ProjectShowcase />} />
          <Route path="/showcase/edit/:id" element={<ProjectShowcase />} />
          <Route path="/showcase/view/:id" element={<ProjectDetail />} />
          <Route path="/technology-stack" element={<TechnologyStack />} />
          <Route path="/project-media" element={<ProjectMedia />} />
          <Route path="/actions-help" element={<ActionsHelp />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/community" element={<Community />} />
          <Route path="/portfolio" element={<PortfolioBuilder />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/portfolio/editor/:templateId" element={<PortfolioEditor />} />
          <Route path="/portfolio/preview/:templateId" element={<PortfolioPreview />} />
          <Route path="/p/:portfolioId" element={<PublicPortfolio />} />
          <Route path="/test" element={<APITestDashboard />} />
          <Route path="/test/openai" element={<OpenAITestComponent />} />
          <Route path="/test/s3" element={<S3TestComponent />} />
          <Route path="/test/vercel" element={<VercelTestComponent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;