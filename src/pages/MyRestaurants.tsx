import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import apiConfig from "../utils/apiConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Restaurant {
  _id: string;
  name: string;
  location: string;
  image?: {
    url: string;
    publicId: string;
  };
  rating?: number;
  isVerified?: boolean;
}

interface NewRestaurant {
  name: string;
  location: string;
  image: File | null;
}

const MyRestaurants = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newRestaurant, setNewRestaurant] = useState<NewRestaurant>({
    name: "",
    location: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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

    if (!newRestaurant.image) {
      setError("Please select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newRestaurant.name);
      formData.append("location", newRestaurant.location);
      formData.append("owner", userId || "");
      formData.append("image", newRestaurant.image); // Make sure this is the File object

      const response = await axios.post(apiConfig.createRestaurant, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setRestaurants((prev) => [...prev, response.data.restaurant]);
      setShowModal(false);
      setNewRestaurant({ name: "", location: "", image: null });
      setImagePreview(null);
    } catch (error: any) {
      console.error("Error creating restaurant", error);
      setError(error.response?.data?.message || "Failed to create restaurant");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewRestaurant((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
              {restaurant.image?.url && (
                <img
                  src={restaurant.image.url}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
              <p className="text-gray-600">📍 {restaurant.location}</p>
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
              <h3 className="text-xl font-semibold">Add New Restaurant</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Restaurant Name"
                  value={newRestaurant.name}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={newRestaurant.location}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border px-4 py-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  required
                />
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                  }}
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
