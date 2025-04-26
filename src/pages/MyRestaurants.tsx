import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import apiConfig from "../utils/apiConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Type Definitions
interface Restaurant {
  _id: string;
  name: string;
  location: string;
  rating?: number;
  isVerified?: boolean;
}

interface NewRestaurant {
  name: string;
  location: string;
}

interface RestaurantUser {
  _id: string;
  token: string;
}

const MyRestaurants = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newRestaurant, setNewRestaurant] = useState<NewRestaurant>({
    name: "",
    location: "",
  });

  const { user } = useAuth();
  const token = user?.token;
  const userId = user?._id;
    

  useEffect(() => {
    const fetchMyRestaurants = async () => {
      if (!userId || !token) return;
      try {
        const res = await axios.get<Restaurant[]>(
          `${apiConfig.getMyRestaurants}${userId}`, // GET /:id
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
  }, [token]);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    if (restaurant.isVerified) {
      navigate(`/${restaurant._id}`);
    } else {
      navigate('/auth/verification-pending', { state: { restaurant } });
    }
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ restaurant: Restaurant }>(
        apiConfig.createRestaurant,
        {
          name: newRestaurant.name,
          location: newRestaurant.location,
          owner: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRestaurants((prev) => [...prev, response.data.restaurant]);
      setShowModal(false);
      setNewRestaurant({ name: "", location: "" });
    } catch (error: any) {
      console.error("Error creating restaurant", error.message);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Restaurants</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Restaurant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            onClick={() => handleRestaurantClick(restaurant)}
            className="bg-white shadow p-4 rounded border cursor-pointer hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold">{restaurant.name}</h3>
            <p className="text-gray-600">📍 {restaurant.location}</p>
            <div className="mt-2">
              <span
                className={`px-2 py-1 text-sm rounded ${
                  restaurant.isVerified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {restaurant.isVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Restaurant</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Restaurant Name"
                value={newRestaurant.name}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={newRestaurant.location}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add
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
