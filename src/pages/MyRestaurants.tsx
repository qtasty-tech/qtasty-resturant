import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import apiConfig from "../utils/apiConfig";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

interface NewRestaurant {
  name: string;
  address: string;
  cuisine: string;
  description: string;
  hours: string;
  deliveryTime: string;
  deliveryFee: string;
  tags: string;
  image: string;
  coverImage: string;
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
  const [newRestaurant, setNewRestaurant] = useState<NewRestaurant>({
    name: '',
    address: '',
    cuisine: '',
    description: '',
    hours: '',
    deliveryTime: '30',
    deliveryFee: '0',
    tags: '',
    image: '',
    coverImage: '',
  });
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

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const requiredFields = [newRestaurant.name, newRestaurant.address, newRestaurant.cuisine, newRestaurant.image, newRestaurant.coverImage];

    if (requiredFields.some((field) => !field)) {
      setError("All required fields must be filled");
      setIsLoading(false);
      return;
    }

    try {
      const restaurantData = {
        ...newRestaurant,
        owner: userId,
        deliveryTime: Number(newRestaurant.deliveryTime),
        deliveryFee: Number(newRestaurant.deliveryFee),
      };
      const { data } = await axios.post(apiConfig.createRestaurant, restaurantData, { headers: { Authorization: `Bearer ${token}` } });

      setRestaurants((prev) => [...prev, data.restaurant]);
      setShowModal(false);
      setNewRestaurant({
        name: '',
        address: '',
        cuisine: '',
        description: '',
        hours: '',
        deliveryTime: '30',
        deliveryFee: '0',
        tags: '',
        image: '',
        coverImage: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({ ...prev, [name]: value }));
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

  const renderLoadingState = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5DAA80]"></div>
    </div>
  );

  const renderErrorState = () => (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      <div className="flex">
        <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>{error}</span>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="bg-white shadow-sm rounded-lg p-12 text-center">
      <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No restaurants yet</h3>
      <p className="mt-2 text-gray-500">Get started by creating your first restaurant listing.</p>
      <div className="mt-6">
        <button onClick={() => setShowModal(true)} className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg text-white bg-[#5DAA80] hover:bg-[#F15D36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FAC849]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Restaurant
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Header Section */}
    
<header className="bg-gradient-to-b from-white to-[#5DAA8010] py-4 px-4 sm:px-6 lg:px-8 border-b border-[#5DAA8030] shadow-sm">
  <div className="max-w-6xl mx-auto flex justify-between items-center">
    <Link to="#" className="flex items-center">
      <span className="text-gray-900 text-3xl font-bold">
        Q<span className="text-[#F15D36]">Tasty</span>
      </span>
    </Link>
    <div className="flex items-center">
      <button
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="bg-[#5DAA80] text-white px-5 py-2 rounded-md font-medium hover:bg-[#4c9a73] transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  </div>
</header>

      <div className="max-w-6xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#261F11]">My Restaurants</h1>
              <p className="text-[#261F11] mt-1">Manage your restaurant listings and details</p>
            </div>
            <button onClick={() => setShowModal(true)} className="mt-4 sm:mt-0 bg-[#5DAA80] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#F15D36] transition shadow-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Restaurant
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="inline-flex rounded-lg shadow-sm">
              <button
                onClick={() => setCurrentTab('all')}
                className={`px-4 py-2.5 text-sm font-medium rounded-l-lg ${
                  currentTab === 'all' ? 'bg-[#5DAA80] text-white' : 'bg-white text-[#261F11] hover:bg-[#FAC849]'
                } border border-gray-300`}
              >
                All Restaurants
              </button>
              <button
                onClick={() => setCurrentTab('verified')}
                className={`px-4 py-2.5 text-sm font-medium ${
                  currentTab === 'verified' ? 'bg-[#5DAA80] text-white' : 'bg-white text-[#261F11] hover:bg-[#FAC849]'
                } border-t border-b border-gray-300`}
              >
                Verified
              </button>
              <button
                onClick={() => setCurrentTab('pending')}
                className={`px-4 py-2.5 text-sm font-medium rounded-r-lg ${
                  currentTab === 'pending' ? 'bg-[#5DAA80] text-white' : 'bg-white text-[#261F11] hover:bg-[#FAC849]'
                } border border-gray-300`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {/* Loading, Error or Empty State */}
        {isLoading && renderLoadingState()}
        {error && !isLoading && renderErrorState()}
        {!isLoading && restaurants.length === 0 && renderEmptyState()}

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              onClick={() => handleRestaurantClick(restaurant)}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition hover:shadow-md border border-gray-100 cursor-pointer group"
            >
              {/* Restaurant Image and Details */}
              <div className="relative h-48 overflow-hidden">
                {restaurant.image && (
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        restaurant.isVerified ? "bg-[#5DAA80] text-white" : "bg-[#FAC849] text-[#261F11]"
                      }`}
                    >
                      {restaurant.isVerified ? "Verified" : "Pending Verification"}
                    </span>
                    {restaurant.rating && restaurant.isVerified && (
                      <div className="flex items-center bg-white/90 text-[#261F11] px-2 py-1 rounded-full text-xs font-medium">
                        <svg className="w-3.5 h-3.5 text-[#FAC849] mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{restaurant.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Restaurant Text Details */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-[#261F11] group-hover:text-[#5DAA80] transition-colors">{restaurant.name}</h3>
                <p className="text-[#261F11] mt-1 text-sm">{restaurant.cuisine}</p>
                <p className="text-gray-500 mt-2 text-sm truncate">{restaurant.address}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {restaurant.isVerified ? "View Dashboard" : "Complete Verification"}
                  </span>
                  <svg className="h-5 w-5 text-[#5DAA80] group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Restaurant Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-6 py-4 border-b">
                <h3 className="text-xl font-bold text-[#261F11]">Create New Restaurant</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex">
                      <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#261F11] mb-1">Restaurant Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={newRestaurant.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#261F11] mb-1">Cuisine Type*</label>
                    <input
                      type="text"
                      name="cuisine"
                      value={newRestaurant.cuisine}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                      required
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-[#261F11] mb-1">Address*</label>
                  <input
                    type="text"
                    name="address"
                    value={newRestaurant.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                    required
                  />
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-[#261F11] mb-1">Description*</label>
                  <textarea
                    name="description"
                    value={newRestaurant.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                    required
                    rows={3}
                  />
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-[#261F11] mb-1">Opening Hours*</label>
                  <input
                    type="text"
                    name="hours"
                    value={newRestaurant.hours}
                    onChange={handleChange}
                    placeholder="Example: Monday - Sunday: 11:00 AM - 10:00 PM"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                    required
                  />
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#261F11] mb-1">Delivery Time (min)*</label>
                    <input
                      type="number"
                      name="deliveryTime"
                      value={newRestaurant.deliveryTime}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#261F11] mb-1">Delivery Fee*</label>
                    <input
                      type="number"
                      name="deliveryFee"
                      value={newRestaurant.deliveryFee}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                      required
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-[#261F11] mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={newRestaurant.tags}
                    onChange={handleChange}
                    placeholder="Example: Pizza, Italian, Pasta"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                  />
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-[#261F11] mb-1">Main Image URL*</label>
                  <input
                    type="url"
                    name="image"
                    value={newRestaurant.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                    required
                  />
                  {newRestaurant.image && (
                    <div className="mt-3">
                      <p className="text-sm text-[#261F11] mb-1">Preview:</p>
                      <img
                        src={newRestaurant.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-[#261F11] mb-1">Cover Image URL*</label>
                  <input
                    type="url"
                    name="coverImage"
                    value={newRestaurant.coverImage}
                    onChange={handleChange}
                    placeholder="https://example.com/cover-image.jpg"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                    required
                  />
                  {newRestaurant.coverImage && (
                    <div className="mt-3">
                      <p className="text-sm text-[#261F11] mb-1">Preview:</p>
                      <img
                        src={newRestaurant.coverImage}
                        alt="Cover Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-white px-5 py-2.5 rounded-lg text-[#261F11] font-medium border border-gray-300 hover:bg-gray-50 transition shadow-sm"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#5DAA80] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#F15D36] transition shadow-sm flex items-center justify-center min-w-[140px]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Add Restaurant"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyRestaurants;
