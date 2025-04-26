import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiConfig from "../utils/apiConfig";
import { useAuth } from "../context/AuthContext";

interface User {
  _id: string;
  email: string;
  role: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post<LoginResponse>(apiConfig.login, {
        email,
        password,
      });
      const { user, token } = response.data;
      if (user.role !== "restaurant") {
        setError("Access denied: Not a restaurant account.");
        setIsLoading(false);
        return;
      }
      login({ ...user, token }); // Use context login instead of localStorage
      navigate('/myrestaurants');
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  // Background image URLs for the left panel
  const bgImageUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding with background image */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center justify-center items-center relative" 
        style={{ 
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay to ensure text readability - reduced opacity from 0.85 to 0.5 */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: "rgba(93, 170, 128, 0.5)" }}
        ></div>
        
        <div className="z-10 text-center p-8">
          <div className="inline-block p-4 rounded-full bg-white shadow-xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="#5DAA80" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.9999V7.9999C21 6.89533 20.1046 5.9999 19 5.9999H5C3.89543 5.9999 3 6.89533 3 7.9999V15.9999M21 15.9999C21 17.1046 20.1046 18 19 18H5C3.89543 18 3 17.1046 3 15.9999M21 15.9999L15.5 12.5M3 15.9999L8.5 12.5M21 7.9999L12 13.9999L3 7.9999" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">Q-Tasty</h1>
          <p className="text-xl text-white mb-8">Restaurant Partner Portal</p>
          {/* Added text shadow to improve readability without needing a heavier overlay */}
          <div className="max-w-md mx-auto bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <p className="text-xl font-medium mb-4 text-white drop-shadow-lg" style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.5)" }}>
              "Manage your restaurant, grow your business, satisfy your customers."
            </p>
            <p className="text-sm text-white drop-shadow-md" style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.5)" }}>
              Access your Q-Tasty restaurant dashboard to manage orders, update menus, and track performance all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form with white background */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:hidden">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(93, 170, 128, 0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="#5DAA80" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.9999V7.9999C21 6.89533 20.1046 5.9999 19 5.9999H5C3.89543 5.9999 3 6.89533 3 7.9999V15.9999M21 15.9999C21 17.1046 20.1046 18 19 18H5C3.89543 18 3 17.1046 3 15.9999M21 15.9999L15.5 12.5M3 15.9999L8.5 12.5M21 7.9999L12 13.9999L3 7.9999" />
                </svg>
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">Q-Tasty</h2>
            <p className="mt-1 text-sm text-gray-600">Restaurant Partner Portal</p>
          </div>
          
          <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#261F11" }}>Welcome Back</h2>
            
            {error && (
              <div className="mb-6 p-3 rounded-md bg-red-50 border-l-4 border-red-500 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@restaurant.com"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    style={{ accentColor: "#5DAA80" }}
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium" style={{ color: "#5DAA80" }}>
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white"
                  style={{ backgroundColor: "#F15D36" }}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : "Sign in to Dashboard"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Need assistance?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Don't have a restaurant account?{" "}
                  <a href="#" className="font-medium" style={{ color: "#5DAA80" }}>
                    Contact our team
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-500 flex flex-col gap-2">
            <div className="flex justify-center space-x-4">
              <a href="#" className="hover:text-gray-700">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700">Terms of Service</a>
              <a href="#" className="hover:text-gray-700">Help Center</a>
            </div>
            <p>© 2025 Q-Tasty Food Delivery. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;