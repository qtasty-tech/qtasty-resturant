// components/ProtectedRoute.tsx
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a nice spinner later
  }
  return user ? <Outlet /> : <Navigate to="/auth/signin" />;
};

export default ProtectedRoute;