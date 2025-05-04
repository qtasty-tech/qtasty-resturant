
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const VerificationPending = () => {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">QTasty Resturant</h1>
          <p className="text-gray-600">Resturant Partner Portal</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
            <div className="text-secondary text-2xl">⏳</div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Verification Pending</h2>
          
          <p className="text-gray-600 mb-6">
            Thank you for registering! Your resturant is pending verification by our team. 
            This usually takes 24-48 hours. We'll notify you via email once your account is activated.
          </p>
          <div className="space-y-4">
            <Button asChild variant="outline" className="w-full">
              <Link to="/myrestaurants">
                Back to Resturants
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
