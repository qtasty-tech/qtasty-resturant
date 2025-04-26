// contexts/AuthContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface User {
  _id: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true); // 🆕 Add loading

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('restaurantToken');
    const storedInfo = localStorage.getItem('restaurantInfo');
  
    if (storedToken && storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        setUser({ ...parsedInfo, token: storedToken });
      } catch (error) {
        console.error('Error parsing restaurant info:', error);
        localStorage.removeItem('restaurantToken');
        localStorage.removeItem('restaurantInfo');
      }
    }
    setLoading(false); // 🆕 After checking, set loading false
  }, []);

  const login = (userData: User) => {
    const { token, ...restaurantInfo } = userData;
    localStorage.setItem('restaurantToken', token); // Save token separately
    localStorage.setItem('restaurantInfo', JSON.stringify(restaurantInfo)); // Save user/restaurant data separately
    setUser(userData); // Keep full data in memory
  };
  

  const logout = () => {
    localStorage.removeItem('restaurantToken');
    localStorage.removeItem('restaurantInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};