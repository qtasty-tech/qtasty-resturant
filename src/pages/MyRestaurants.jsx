import { useEffect, useState } from "react";
import axios from "axios";
import apiConfig from "../utils/apiConfig";
import { useNavigate } from "react-router-dom";

const MyRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({ name: "", location: "" });
  const restaurantUser = JSON.parse(localStorage.getItem("restaurantUser"));
  const token = restaurantUser?.token;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRestaurants = async () => {
      try {
        const res = await axios.get(apiConfig.getMyRestaurants, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if the restaurant is verified
        if (res.data && res.data[0]?.isVerified === false) {
          navigate("/verification-pending");
        } else {
          setRestaurants(res.data); // Assuming the backend returns the list of restaurants
        }
      } catch (err) {
        console.error("Failed to load restaurants", err.message);
      }
    };

    fetchMyRestaurants();
  }, [token, navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiConfig.createRestaurant, {
        name: newRestaurant.name,
        location: newRestaurant.location,
        owner: restaurantUser._id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRestaurants(prev => [...prev, response.data.restaurant]);
      setShowModal(false);
      setNewRestaurant({ name: "", location: "" });
    } catch (error) {
      console.error("Error creating restaurant", error.message);
    }
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
          <div key={restaurant._id} className="bg-white shadow p-4 rounded border">
            <h3 className="text-xl font-semibold">{restaurant.name}</h3>
            <p className="text-gray-600">📍 {restaurant.location}</p>
            <p className="text-sm text-gray-400">⭐ {restaurant.rating || "N/A"} rating</p>
          </div>
        ))}
      </div>

      {/* Modal for creating restaurant */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Restaurant</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={newRestaurant.name}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newRestaurant.location}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
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
