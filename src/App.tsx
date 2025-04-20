
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import VerificationPending from "./pages/auth/VerificationPending";
import Dashboard from "./pages/Dashboard";
import MenuManagement from "./pages/MenuManagement";
import OrderManagement from "./pages/OrderManagement";
import Analytics from "./pages/Analytics";
import Marketing from "./pages/Marketing";
import Finances from "./pages/Finances";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/verification-pending" element={<VerificationPending />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/menu" element={<MainLayout><MenuManagement /></MainLayout>} />
          <Route path="/orders" element={<MainLayout><OrderManagement /></MainLayout>} />
          <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
          <Route path="/marketing" element={<MainLayout><Marketing /></MainLayout>} />
          <Route path="/finances" element={<MainLayout><Finances /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
          
          {/* Redirect to Dashboard for empty routes */}
          <Route path="/index" element={<Navigate to="/" replace />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
