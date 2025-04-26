// src/utils/apiConfig.js

const USER_API_BASE = "http://localhost:5000/api/auth";
const RESTAURANT_API_BASE = "http://localhost:5001/api/restaurants";

const apiConfig = {
  login: `${USER_API_BASE}/login`,
  register: `${USER_API_BASE}/register`,
  getMyRestaurants: `${RESTAURANT_API_BASE}/`,
  createRestaurant: `${RESTAURANT_API_BASE}`,
};

export default apiConfig;
