import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import apiConfig from "../utils/apiConfig"; // Make sure apiConfig is imported correctly
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"; // Ensure to install @react-google-maps/api
import { useAuth } from "../context/AuthContext"; // Make sure you have auth context

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
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat] format
  };
  phone: string;
}

interface AddRestaurantModalProps {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
}

const AddRestaurantModal = ({ showModal, setShowModal }: AddRestaurantModalProps) => {
  const { user, logout } = useAuth();
  const token = user?.token;
  const userId = user?._id;

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
    location: {
      type: "Point",  // GeoJSON format type
      coordinates: [0, 0], // Default to [lng, lat]
    },
    phone: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user's current location when the component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          setNewRestaurant((prev) => ({
            ...prev,
            location: {
              type: "Point",
              coordinates: [longitude, latitude], // Store [lng, lat]
            },
          }));
        },
        (error) => {
          console.error("Error fetching location: ", error);
          // Set default location if geolocation fails
          setSelectedLocation({ lat: 6.9271, lng: 79.8612 }); // Default to Colombo
          setNewRestaurant((prev) => ({
            ...prev,
            location: {
              type: "Point",
              coordinates: [79.8612, 6.9271], // Default coordinates
            },
          }));
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setSelectedLocation({ lat: 6.9271, lng: 79.8612 }); // Default to Colombo
      setNewRestaurant((prev) => ({
        ...prev,
        location: {
          type: "Point",
          coordinates: [79.8612, 6.9271], // Default coordinates
        },
      }));
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setNewRestaurant((prev) => ({
      ...prev,
      location: {
        type: "Point",  // GeoJSON format type
        coordinates: [lng, lat], // Store [longitude, latitude]
      },
    }));
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const requiredFields = [newRestaurant.name, newRestaurant.address, newRestaurant.cuisine, newRestaurant.image, newRestaurant.coverImage, newRestaurant.phone];

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

      const { data } = await axios.post(apiConfig.createRestaurant, restaurantData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reset state and close modal
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
        location: {
          type: "Point",
          coordinates: [0, 0], // Reset to default coordinates
        },
        phone: '',
      });
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
                <label className="block text-sm font-medium text-[#261F11] mb-1">Phone Number*</label>
                <input
                  type="text"
                  name="phone"
                  value={newRestaurant.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                  required
                />
              </div>

              {/* Google Maps */}
              <div className="mt-5">
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    center={selectedLocation || { lat: 6.9271, lng: 79.8612 }} // Default to Colombo
                    zoom={12}
                  >
                    {selectedLocation && (
                      <Marker
                        position={selectedLocation}
                        onDragEnd={(e) => handleLocationChange(e.latLng.lat(), e.latLng.lng())}
                        draggable
                      />
                    )}
                  </GoogleMap>
                </LoadScript>
              </div>

              <div className="mt-5">
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

              <div className="mt-5">
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
                    <img src={newRestaurant.image} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
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
                    <img src={newRestaurant.coverImage} alt="Cover Preview" className="w-full h-48 object-cover rounded-lg border" />
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
    </>
  );
};

export default AddRestaurantModal;
