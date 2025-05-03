import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export const getMenu = async (restaurantId: string) => {
  const token = localStorage.getItem("restaurantToken");
  const response = await axios.get(
    `${API_BASE_URL}/restaurants/${restaurantId}/menu`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const createMenuItem = async (restaurantId: string, data: FormData) => {
  const token = localStorage.getItem("restaurantToken");
  const response = await axios.post(
    `${API_BASE_URL}/restaurants/${restaurantId}/menu`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.menuItem;
};

export const deleteMenuItem = async (
  restaurantId: string,
  menuItemId: string
) => {
  const token = localStorage.getItem("restaurantToken");
  await axios.delete(
    `${API_BASE_URL}/restaurants/${restaurantId}/menu/${menuItemId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateMenuItem = async (
  restaurantId: string,
  menuItemId: string,
  data: FormData
) => {
  const token = localStorage.getItem("restaurantToken");
  const response = await axios.put(
    `${API_BASE_URL}/restaurants/${restaurantId}/menu/${menuItemId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.menuItem;
};

export const toggleAvailability = async (
  restaurantId: string,
  menuItemId: string,
  available: boolean
) => {
  const token = localStorage.getItem("restaurantToken");
  const response = await axios.patch(
    `${API_BASE_URL}/restaurants/${restaurantId}/menu/${menuItemId}/availability`,
    { available },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.menuItem;
};

export const toggleMenuItemPopularity = async (
  restaurantId: string,
  menuItemId: string,
  popular: boolean
) => {
  const token = localStorage.getItem("restaurantToken");
  const response = await axios.patch(
    `${API_BASE_URL}/restaurants/${restaurantId}/menu/${menuItemId}/popularity`,
    { popular },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.menuItem;
};