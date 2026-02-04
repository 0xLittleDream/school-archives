import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BranchProvider } from "@/contexts/BranchContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BranchSelectionModal } from "@/components/BranchSelectionModal";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Memories from "./pages/Memories";
import Farewell2025 from "./pages/Farewell2025";
import About from "./pages/About";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import CollectionDetail from "./pages/CollectionDetail";
import CollectionEditor from "./pages/CollectionEditor";
import CustomPage from "./pages/CustomPage";
import PageBuilderEditorPage from "./pages/PageBuilderEditorPage";
import NotFound from "./pages/NotFound";
import { DynamicStudentPage } from "@/components/student-pages/DynamicStudentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
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
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/collection/:id" element={<CollectionDetail />} />
              <Route path="/page/:slug" element={<CustomPage />} />
              
              {/* Admin Routes - Protected */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/admin/collection/:id" element={
                <ProtectedRoute requireAdmin>
                  <CollectionEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/page-builder/:id" element={
                <ProtectedRoute requireAdmin>
                  <PageBuilderEditorPage />
                </ProtectedRoute>
              } />
              
              {/* Dynamic Student Tribute Pages */}
              <Route path="/:slug" element={<DynamicStudentPage />} />
              
              {/* Catch-all - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BranchProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
