import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BranchProvider } from "@/contexts/BranchContext";
import { BranchSelectionModal } from "@/components/BranchSelectionModal";
import Index from "./pages/Index";
import Memories from "./pages/Memories";
import Farewell2025 from "./pages/Farewell2025";
import Events from "./pages/Events";
import About from "./pages/About";
import Admin from "./pages/Admin";
import CollectionDetail from "./pages/CollectionDetail";
import CollectionEditor from "./pages/CollectionEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BranchProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <BranchSelectionModal />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/farewell-2025" element={<Farewell2025 />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/collection/:id" element={<CollectionDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/collection/:id" element={<CollectionEditor />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BranchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
