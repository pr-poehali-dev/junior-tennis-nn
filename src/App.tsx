import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import GalleryPage from "@/pages/GalleryPage";
import CalendarPage from "@/pages/CalendarPage";
import TournamentPage from "@/pages/TournamentPage";
import RatingPage from "@/pages/RatingPage";
import ProfilePage from "@/pages/ProfilePage";
import OrganizerPage from "@/pages/OrganizerPage";
import AuthPage from "@/pages/AuthPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const NO_LAYOUT_PATHS = ['/admin', '/auth', '/organizer'];

function AppRoutes() {
  const location = useLocation();
  const noLayout = NO_LAYOUT_PATHS.some(p => location.pathname.startsWith(p));

  if (noLayout) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/organizer" element={<OrganizerPage />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/tournament/:id" element={<TournamentPage />} />
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
