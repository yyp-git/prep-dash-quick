import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Exercises from "./pages/Exercises";
import ExerciseDetail from "./pages/ExerciseDetail";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import { AppProvider } from "@/context/AppState";
import { OfflineBanner } from "@/components/common/OfflineBanner";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component loading - Meal Prep Fitness App");
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider>
          <BrowserRouter>
            <OfflineBanner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/splash" element={<Splash />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/home" element={<Home />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/exercises/:id" element={<ExerciseDetail />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
