
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";  
import Register from "./pages/Register";  
import VerificationPending from "./pages/auth/VerificationPending";
import Dashboard from "./pages/Dashboard";
import MenuManagement from "./pages/MenuManagement";
import OrderManagement from "./pages/OrderManagement";
import Analytics from "./pages/Analytics";
import Marketing from "./pages/Marketing";
import Finances from "./pages/Finances";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import MyRestaurants from "./pages/MyRestaurants";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
         <Route path="/auth/signin" element={<Login />} />  
             <Route path="/auth/signup" element={<Register />} />  
          <Route path="/auth/verification-pending" element={<VerificationPending />} />
          
          <Route element={<ProtectedRoute />}>
            {/* Protected Routes */}
            <Route path="/:id" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/:id/menu" element={<MainLayout><MenuManagement /></MainLayout>} />
            <Route path="/:id/orders" element={<MainLayout><OrderManagement /></MainLayout>} />
            <Route path="/:id/analytics" element={<MainLayout><Analytics /></MainLayout>} />
            <Route path="/:id/marketing" element={<MainLayout><Marketing /></MainLayout>} />
            <Route path="/:id/finances" element={<MainLayout><Finances /></MainLayout>} />
            <Route path="/:id/settings" element={<MainLayout><Settings /></MainLayout>} />
            <Route path="/myrestaurants" element={<MyRestaurants />} />
            {/* Redirect to Dashboard for empty routes */}
            <Route path="/index" element={<Navigate to="/" replace />} />
          </Route>
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
