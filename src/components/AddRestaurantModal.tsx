import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import axios from "axios";
import apiConfig from "../utils/apiConfig";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { useAuth } from "../context/AuthContext";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface NewRestaurant {
  name: string;
  address: string;
  cuisine: string;
  description: string;
  hours: string;
  deliveryTime: string;
  deliveryFee: string;
  tags: string;
  phone: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

interface AddRestaurantModalProps {
  showModal: boolean;
  userId: string | undefined;
  token: string | undefined;
  setRestaurants: (restaurants: any) => void;
  setError: (error: string | null) => void;
  setShowModal: (state: boolean) => void;
}

const AddRestaurantModal = ({
  showModal,
  setShowModal,
  userId,
  token,
  setRestaurants,
  setError,
}: AddRestaurantModalProps) => {
  const { user } = useAuth();

  const [newRestaurant, setNewRestaurant] = useState<NewRestaurant>({
    name: "",
    address: "",
    cuisine: "",
    description: "",
    hours: "",
    deliveryTime: "30",
    deliveryFee: "0",
    tags: "",
    phone: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [countryCode, setCountryCode] = useState<string>("LK"); // Default to Sri Lanka
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Get user's current location and country when the component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          setNewRestaurant((prev) => ({
            ...prev,
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          }));

          // Fetch country code using Geocoding API
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
                import.meta.env.VITE_GOOGLE_MAPS_API_KEY
              }`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const addressComponents = data.results[0].address_components;
              const country = addressComponents.find((comp: any) =>
                comp.types.includes("country")
              );
              if (country) {
                setCountryCode(country.short_name);
              }
            }
          } catch (error) {
            console.error("Error fetching country code:", error);
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
          setSelectedLocation({ lat: 6.9271, lng: 79.8612 }); // Default to Colombo
          setNewRestaurant((prev) => ({
            ...prev,
            location: {
              type: "Point",
              coordinates: [79.8612, 6.9271],
            },
          }));
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setSelectedLocation({ lat: 6.9271, lng: 79.8612 });
      setNewRestaurant((prev) => ({
        ...prev,
        location: {
          type: "Point",
          coordinates: [79.8612, 6.9271],
        },
      }));
    }
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMainImageFile(null);
      setMainImagePreview(null);
    }
  };

  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImageFile(null);
      setCoverImagePreview(null);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedLocation({ lat, lng });
      setNewRestaurant((prev) => ({
        ...prev,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      }));
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedLocation({ lat, lng });
        setNewRestaurant((prev) => ({
          ...prev,
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
        }));
      }
    }
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    // Validate required fields
    const requiredFields = [
      newRestaurant.name,
      newRestaurant.address,
      newRestaurant.cuisine,
      newRestaurant.phone,
      mainImageFile,
      coverImageFile,
    ];
    if (requiredFields.some((field) => !field)) {
      setFormError(
        "All required fields must be filled, including main and cover images"
      );
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("owner", userId || "");
      formData.append("name", newRestaurant.name);
      formData.append("cuisine", newRestaurant.cuisine);
      formData.append("address", newRestaurant.address);
      formData.append("description", newRestaurant.description);
      formData.append("hours", newRestaurant.hours);
      formData.append("deliveryTime", newRestaurant.deliveryTime);
      formData.append("deliveryFee", newRestaurant.deliveryFee);
      formData.append("tags", newRestaurant.tags);
      formData.append("phone", newRestaurant.phone);
      formData.append("location", JSON.stringify(newRestaurant.location));
      if (mainImageFile) {
        formData.append("image", mainImageFile, mainImageFile.name);
      }
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile, coverImageFile.name);
      }

      const { data } = await axios.post(apiConfig.createRestaurant, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Let browser set Content-Type with boundary for multipart/form-data
        },
      });

      // Update restaurants list
      setRestaurants((prev: any) => [...prev, data.restaurant]);

      // Reset state and close modal
      setNewRestaurant({
        name: "",
        address: "",
        cuisine: "",
        description: "",
        hours: "",
        deliveryTime: "30",
        deliveryFee: "0",
        tags: "",
        phone: "",
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
      });
      setMainImageFile(null);
      setCoverImageFile(null);
      setMainImagePreview(null);
      setCoverImagePreview(null);
      setShowModal(false);
    } catch (err: any) {
      console.error("Error creating restaurant:", err);
      setFormError(
        err.response?.data?.message || "Failed to create restaurant"
      );
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
              <h3 className="text-xl font-bold text-[#261F11]">
                Create New Restaurant
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6">
              {formError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-red-500 mr-2 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{formError}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#261F11] mb-1">
                    Restaurant Name*
                  </label>
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
                  <label className="block text-sm font-medium text-[#261F11] mb-1">
                    Cuisine Type*
                  </label>
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
                <label className="block text-sm font-medium text-[#261F11] mb-1">
                  Address*
                </label>
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
                <label className="block text-sm font-medium text-[#261F11] mb-1">
                  Location (Search or click on the map to select)
                </label>
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  libraries={["places"]}
                >
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                      autocomplete.setComponentRestrictions({
                        country: countryCode,
                      });
                    }}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      type="text"
                      placeholder="Search for a location"
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80] mb-3"
                    />
                  </Autocomplete>
                    <div className="rounded-lg overflow-hidden border border-gray-300">
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "400px" }}
                      center={selectedLocation || { lat: 6.9271, lng: 79.8612 }}
                      zoom={12}
                      onClick={handleMapClick}
                    >
                      {selectedLocation && <Marker position={selectedLocation} />}
                    </GoogleMap>
                    </div>
                </LoadScript>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-[#261F11] mb-1">
                  Phone Number*
                </label>
                <input
                  type="text"
                  name="phone"
                  value={newRestaurant.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                  required
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-[#261F11] mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newRestaurant.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                  rows={4}
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-[#261F11] mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  name="hours"
                  value={newRestaurant.hours}
                  onChange={handleChange}
                  placeholder="e.g., Monday - Sunday: 11:00 AM - 10:00 PM"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-[#261F11] mb-1">
                  Delivery Time (min)*
                </label>
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
                <label className="block text-sm font-medium text-[#261F11] mb-1">
                  Delivery Fee*
                </label>
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
                <label className="block text-sm font-medium text-[#261F11] mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={newRestaurant.tags}
                  onChange={handleChange}
                  placeholder="e.g., Italian, Vegan, Fast Food"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#5DAA80] focus:border-[#5DAA80]"
                />
              </div>

              <div className="mt-5">
                <Label htmlFor="edit-image">Main Image*</Label>
                <Input
                  id="edit-image"
                  name="mainimage"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleMainImageChange}
                  required
                />

                {mainImagePreview && (
                  <div className="mt-3">
                    <p className="text-sm text-[#261F11] mb-1">Preview:</p>
                    <img
                      src={mainImagePreview}
                      alt="Main Image Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="mt-5">
                <Label htmlFor="edit-image">Cover Image*</Label>
                <Input
                  id="edit-image"
                  name="coverImage"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleCoverImageChange}
                  required
                />
                {coverImagePreview && (
                  <div className="mt-3">
                    <p className="text-sm text-[#261F11] mb-1">Preview:</p>
                    <img
                      src={coverImagePreview}
                      alt="Cover Image Preview"
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
    </>
  );
};

export default AddRestaurantModal;
