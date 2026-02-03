import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Memories from "./pages/Memories";
import Farewell2025 from "./pages/Farewell2025";
import Events from "./pages/Events";
import About from "./pages/About";
import CollectionDetail from "./pages/CollectionDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/farewell-2025" element={<Farewell2025 />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/collection/:id" element={<CollectionDetail />} />
          
          {/* Admin Routes - Coming Soon */}
          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
