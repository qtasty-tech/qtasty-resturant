// src/pages/VerificationPending.jsx
import { Button } from '@/components/ui/button';
import { useNavigate,useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const VerificationPending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const restaurant = location.state?.restaurant;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-block w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
            Q
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Q-Tasty Restaurant Partner</h1>
        </div>
        
        <Card>
        <CardHeader>
            <CardTitle className="text-center">
              Verification Pending {restaurant?.name && `for ${restaurant.name}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="mb-6 w-20 h-20 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-10 h-10 text-secondary" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Your application is under review</h3>
            <p className="text-muted-foreground mb-4">
              Our team is reviewing your restaurant details. This typically takes 1-2 business days.
              We'll notify you by email once your account is approved.
            </p>
            {restaurant?.location && (
              <p className="text-muted-foreground mb-2">
                Location: {restaurant.location}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/myrestaurants')}
            >
              Back to My Restaurants
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPending;
