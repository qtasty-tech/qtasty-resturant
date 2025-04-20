
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard or login based on authentication state
    // For now, we'll redirect to sign in since we don't have auth implemented
    navigate('/auth/signin');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Q-Tasty Restaurant Portal</h1>
        <p className="text-xl text-gray-600">Redirecting you to the login page...</p>
      </div>
    </div>
  );
};

export default Index;
