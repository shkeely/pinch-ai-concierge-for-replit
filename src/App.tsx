import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { WeddingProvider } from "@/contexts/WeddingContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import Chatbot from "./pages/Chatbot";
import Guests from "./pages/Guests";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import WeddingDetails from "./pages/WeddingDetails";
import HelpSupport from "./pages/HelpSupport";

// Onboarding
import Step1A from "./pages/onboarding/Step1A";
import Step1B from "./pages/onboarding/Step1B";
import Step1C from "./pages/onboarding/Step1C";
import Step2 from "./pages/onboarding/Step2";
import Step3 from "./pages/onboarding/Step3";
import Step4 from "./pages/onboarding/Step4";
import Step5NavigationBar from "./pages/onboarding/Step5NavigationBar";
import Step6ChatbotSetup from "./pages/onboarding/Step6ChatbotSetup";
import Step7GuestPageTour from "./pages/onboarding/Step7GuestPageTour";
import Step8MessagesPage from "./pages/onboarding/Step8MessagesPage";
import Step9Homepage from "./pages/onboarding/Step9Homepage";
import Step10Finish from "./pages/onboarding/Step10Finish";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WeddingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
              <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
              <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/wedding-details" element={<ProtectedRoute><WeddingDetails /></ProtectedRoute>} />
              <Route path="/help-support" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
              
              {/* Onboarding routes */}
              <Route path="/onboarding/step-1a" element={<ProtectedRoute><Step1A /></ProtectedRoute>} />
              <Route path="/onboarding/step-1b" element={<ProtectedRoute><Step1B /></ProtectedRoute>} />
              <Route path="/onboarding/step-1c" element={<ProtectedRoute><Step1C /></ProtectedRoute>} />
              <Route path="/onboarding/step-2" element={<ProtectedRoute><Step2 /></ProtectedRoute>} />
              <Route path="/onboarding/step-3" element={<ProtectedRoute><Step3 /></ProtectedRoute>} />
              <Route path="/onboarding/step-4" element={<ProtectedRoute><Step4 /></ProtectedRoute>} />
              <Route path="/onboarding/step-5" element={<ProtectedRoute><Step5NavigationBar /></ProtectedRoute>} />
              <Route path="/onboarding/step-6" element={<ProtectedRoute><Step6ChatbotSetup /></ProtectedRoute>} />
              <Route path="/onboarding/step-7" element={<ProtectedRoute><Step7GuestPageTour /></ProtectedRoute>} />
              <Route path="/onboarding/step-8" element={<ProtectedRoute><Step8MessagesPage /></ProtectedRoute>} />
              <Route path="/onboarding/step-9" element={<ProtectedRoute><Step9Homepage /></ProtectedRoute>} />
              <Route path="/onboarding/step-10" element={<ProtectedRoute><Step10Finish /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WeddingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;