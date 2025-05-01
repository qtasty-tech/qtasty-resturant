import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AddRestaurantModal from "../components/AddRestaurantModal";
import axios from "axios";
import apiConfig from "../utils/apiConfig";

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  cuisine: string;
  image?: string;
  coverImageUrl?: string;
  rating?: number;
  isVerified?: boolean;
}

const MyRestaurants = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const token = user?.token;
  const userId = user?._id;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState<'all' | 'verified' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetching restaurants on component mount
  useEffect(() => {
    const fetchMyRestaurants = async () => {
      if (!userId || !token) return;
      try {
        setIsLoading(true);
        const { data } = await axios.get<Restaurant[]>(`${apiConfig.getMyRestaurants}${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(data);
      } catch (err) {
        console.error("Failed to load restaurants", err);
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyRestaurants();
  }, [token, userId]);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    if (restaurant.isVerified) {
      navigate(`/${restaurant._id}`);
    } else {
      navigate("/auth/verification-pending", { state: { restaurant } });
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (currentTab === 'verified' && !restaurant.isVerified) return false;
    if (currentTab === 'pending' && restaurant.isVerified) return false;

    if (searchTerm) {
      return (
        (restaurant.name && restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <header className="bg-white py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-gray-900 text-3xl font-bold flex items-center">
            Q<span className="text-[#F15D36]">Tasty</span>
            <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Restaurant Manager</span>
          </span>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="bg-[#5DAA80] text-white px-5 py-2 rounded-full font-medium hover:bg-[#4c9a73] transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Add Restaurant Modal */}
      <AddRestaurantModal
        showModal={showModal}
        setShowModal={setShowModal}
        userId={userId}
        token={token}
        setRestaurants={setRestaurants}
        setError={setError}
      />

      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto pt-8 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white shadow rounded-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#261F11] flex items-center">
                My Restaurants
                <span className="ml-3 text-sm bg-[#5DAA80] bg-opacity-10 text-[#5DAA80] px-3 py-1 rounded-full">
                  {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'Restaurant' : 'Restaurants'}
                </span>
              </h1>
              <p className="text-gray-600 mt-1">Manage your restaurant listings and enhance your online presence</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 sm:mt-0 bg-[#5DAA80] text-white px-6 py-3 rounded-full font-medium hover:bg-[#F15D36] transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Restaurant
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="relative flex-1 max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80] shadow-sm"
                placeholder="Search by name or cuisine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <div className="inline-flex rounded-full shadow-sm bg-white border border-gray-200 p-1 w-full md:w-auto">
              <button
                onClick={() => setCurrentTab('all')}
                className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  currentTab === 'all' 
                    ? 'bg-[#5DAA80] text-white shadow-sm' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCurrentTab('verified')}
                className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  currentTab === 'verified' 
                    ? 'bg-[#5DAA80] text-white shadow-sm' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              </button>
              <button
                onClick={() => setCurrentTab('pending')}
                className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  currentTab === 'pending' 
                    ? 'bg-[#5DAA80] text-white shadow-sm' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Pending
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading, Error or Empty State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl shadow border border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5DAA80]"></div>
            <p className="text-gray-500 mt-4">Loading your restaurants...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl mb-6 shadow-sm">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {!isLoading && !error && filteredRestaurants.length === 0 && (
          <div className="bg-white shadow rounded-xl p-12 text-center border border-gray-100">
            <div className="flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No restaurants found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? "No restaurants match your search criteria." : "You haven't added any restaurants yet."}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#5DAA80] text-white px-6 py-3 rounded-full font-medium hover:bg-[#F15D36] transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Your First Restaurant
              </button>
            </div>
          </div>
        )}

        {/* Restaurant Grid */}
        {!isLoading && !error && filteredRestaurants.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => handleRestaurantClick(restaurant)}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 cursor-pointer group transform hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden">
                  {restaurant.image ? (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm flex items-center ${
                        restaurant.isVerified 
                          ? "bg-[#5DAA80] text-white" 
                          : "bg-[#FAC849] text-[#261F11]"
                      }`}
                    >
                      {restaurant.isVerified ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Pending
                        </>
                      )}
                    </span>
                    {restaurant.rating && (
                      <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white text-[#261F11] shadow-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {restaurant.rating}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#261F11] group-hover:text-[#5DAA80] transition-colors line-clamp-1">{restaurant.name}</h3>
                  <p className="text-[#5DAA80] mt-1 font-medium text-sm">{restaurant.cuisine}</p>
                  <p className="text-gray-500 mt-2 text-sm line-clamp-1">{restaurant.address}</p>
                  
                  <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                      {restaurant.isVerified ? "View Dashboard" : "Complete Verification"}
                    </span>
                    <div className="h-8 w-8 rounded-full bg-[#5DAA80] bg-opacity-10 flex items-center justify-center group-hover:bg-[#5DAA80] transition-colors">
                      <svg className="h-4 w-4 text-[#5DAA80] group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRestaurants;