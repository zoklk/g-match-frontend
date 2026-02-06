import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/account/Auth";
import AuthCallback from "./pages/account/AuthCallback";
import RegisterAgree from "./pages/account/RegisterAgree";
import RegisterBasicInfo from "./pages/account/RegisterBasicInfo";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import MatchLayout from "./components/MatchLayout";

// Match - Profile flow
import Property from "./pages/match/Property";
import Survey from "./pages/match/Survey";
import Weight from "./pages/match/Weight";
import Profile from "./pages/match/Profile";

// Match - Matching flow
import MatchRouter from "./pages/match/MatchRouter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/register/agree" element={<RegisterAgree />} />
          <Route path="/register/basic-info" element={<RegisterBasicInfo />} />

          {/* Protected Routes with Sidebar Layout */}
          <Route
            element={
              <ProtectedRoute>
                <MatchLayout />
              </ProtectedRoute>
            }
          >
            {/* Profile flow */}
            <Route path="/match/profile" element={<Profile />} />
            <Route path="/match/profile/property" element={<Property />} />
            <Route path="/match/profile/survey" element={<Survey />} />
            <Route path="/match/profile/weight" element={<Weight />} />

            {/* Matching flow */}
            <Route path="/match/matching" element={<MatchRouter />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
