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

// Student Pages
import Sanchit2025 from "./pages/students/Sanchit2025";
import Ayush2025 from "./pages/students/Ayush2025";
import Aditi2025 from "./pages/students/Aditi2025";
import Joseph2025 from "./pages/students/Joseph2025";
import Reyansh2025 from "./pages/students/Reyansh2025";
import Pratyush2025 from "./pages/students/Pratyush2025";
import Rudrakash2025 from "./pages/students/Rudrakash2025";
import Nikhil2025 from "./pages/students/Nikhil2025";
import Harsh2025 from "./pages/students/Harsh2025";
import Precious2025 from "./pages/students/Precious2025";
import Avani2025 from "./pages/students/Avani2025";
import Keshu2025 from "./pages/students/Keshu2025";
import Aparna2025 from "./pages/students/Aparna2025";
import Deveshi2025 from "./pages/students/Deveshi2025";
import Madhuri2025 from "./pages/students/Madhuri2025";
import Sahithi2025 from "./pages/students/Sahithi2025";
import Deepika2025 from "./pages/students/Deepika2025";

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
              
              {/* Student Tribute Pages */}
              <Route path="/Sanchit2025" element={<Sanchit2025 />} />
              <Route path="/Ayush2025" element={<Ayush2025 />} />
              <Route path="/Aditi2025" element={<Aditi2025 />} />
              <Route path="/Joseph2025" element={<Joseph2025 />} />
              <Route path="/Reyansh2025" element={<Reyansh2025 />} />
              <Route path="/Pratyush2025" element={<Pratyush2025 />} />
              <Route path="/Rudrakash2025" element={<Rudrakash2025 />} />
              <Route path="/Nikhil2025" element={<Nikhil2025 />} />
              <Route path="/Harsh2025" element={<Harsh2025 />} />
              <Route path="/Precious2025" element={<Precious2025 />} />
              <Route path="/Avani2025" element={<Avani2025 />} />
              <Route path="/Keshu2025" element={<Keshu2025 />} />
              <Route path="/Aparna2025" element={<Aparna2025 />} />
              <Route path="/Deveshi2025" element={<Deveshi2025 />} />
              <Route path="/Madhuri2025" element={<Madhuri2025 />} />
              <Route path="/Sahithi2025" element={<Sahithi2025 />} />
              <Route path="/Deepika2025" element={<Deepika2025 />} />
              
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
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BranchProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
