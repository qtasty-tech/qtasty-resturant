const USER_API_BASE = "http://localhost:5000/api/auth";
const RESTAURANT_API_BASE = "http://localhost:5001/api/restaurants";
const ORDER_API_BASE = "http://localhost:7000/api/orders";

const apiConfig = {
  login: `${USER_API_BASE}/login`,
  register: `${USER_API_BASE}/register`,
  getMyRestaurants: `${RESTAURANT_API_BASE}/`,
  createRestaurant: `${RESTAURANT_API_BASE}`,
  updateOrderstatus: `${ORDER_API_BASE}`,
  getRestaurantOrders: `${ORDER_API_BASE}/restaurant`,
  getRestaurantMetrics: `${ORDER_API_BASE}/restaurant`,
};

export default apiConfig;