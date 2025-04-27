import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import apiConfig from "../utils/apiConfig";
import { useNavigate } from "react-router-dom";
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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newRestaurant, setNewRestaurant] = useState<NewRestaurant>({
    name: "",
    address: "",
    cuisine: "",
    description: "",
    hours: "",
    deliveryTime: "30",
    deliveryFee: "0",
    tags: "",
    image: "",
    coverImage: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const token = user?.token;
  const userId = user?._id;

  useEffect(() => {
    const fetchMyRestaurants = async () => {
      if (!userId || !token) return;
      try {
        const res = await axios.get<Restaurant[]>(
          `${apiConfig.getMyRestaurants}${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRestaurants(res.data);
      } catch (err) {
        console.error("Failed to load restaurants", err);
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

    try {
      const requiredFields = [
        newRestaurant.name,
        newRestaurant.address,
        newRestaurant.cuisine,
        newRestaurant.image,
        newRestaurant.coverImage
      ];

      if (requiredFields.some(field => !field)) {
        throw new Error("All required fields must be filled");
      }

      const restaurantData = {
        ...newRestaurant,
        owner: userId,
        tags: newRestaurant.tags,
        deliveryTime: Number(newRestaurant.deliveryTime),
        deliveryFee: Number(newRestaurant.deliveryFee)
      };

      const response = await axios.post(
        apiConfig.createRestaurant,
        restaurantData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRestaurants(prev => [...prev, response.data.restaurant]);
      setShowModal(false);
      setNewRestaurant({
        name: "",
        address: "",
        cuisine: "",
        description: "",
        hours: "",
        deliveryTime: "30",
        deliveryFee: "0",
        tags: "",
        image: "",
        coverImage: "",
      });
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRestaurant(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Restaurants</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Add Restaurant
        </button>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You don't have any restaurants yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              onClick={() => handleRestaurantClick(restaurant)}
              className="bg-white shadow p-4 rounded border cursor-pointer hover:shadow-md transition"
            >
              {restaurant.image && (
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
              <div className="mt-2">
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    restaurant.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {restaurant.isVerified ? "Verified" : "Pending Verification"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Restaurant Modal */}
      {showModal && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white p-6 rounded-lg w-full max-w-md">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-semibold">Create New Restaurant</h3>
                   <button
                     onClick={() => setShowModal(false)}
                     className="text-gray-500 hover:text-gray-700"
                   >
                     ✕
                   </button>
                 </div>
          {/* ... keep modal header the same ... */}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name*
              </label>
              <input
                type="text"
                name="name"
                value={newRestaurant.name}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address*
              </label>
              <input
                type="text"
                name="address"
                value={newRestaurant.address}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine Type*
              </label>
              <input
                type="text"
                name="cuisine"
                value={newRestaurant.cuisine}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={newRestaurant.description}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
                required
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Hours*
              </label>
              <input
                type="text"
                name="hours"
                value={newRestaurant.hours}
                onChange={handleChange}
                placeholder="Example: Monday - Sunday: 11:00 AM - 10:00 PM"
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time (min)*
                </label>
                <input
                  type="number"
                  name="deliveryTime"
                  value={newRestaurant.deliveryTime}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Fee*
                </label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={newRestaurant.deliveryFee}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={newRestaurant.tags}
                onChange={handleChange}
                placeholder="Example: Pizza, Italian, Pasta"
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Image URL*
                </label>
                <input
                  type="url"
                  name="image"
                  value={newRestaurant.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
                  required
                />
                {newRestaurant.image && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <img
                      src={newRestaurant.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL*
                </label>
                <input
                  type="url"
                  name="coverImage"
                  value={newRestaurant.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/cover-image.jpg"
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
                  required
                />
                {newRestaurant.coverImage && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <img
                      src={newRestaurant.coverImage}
                      alt="Cover Preview"
                      className="w-full h-48 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
  );
};

export default MyRestaurants;