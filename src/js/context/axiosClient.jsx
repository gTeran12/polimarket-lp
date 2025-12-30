import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  axios.defaults.baseURL ||
  "http://127.0.0.1:8000";

// Axios client configured to hit the API (defaults to Laravel dev server)
const axiosClient = axios.create({
  baseURL,
});

// Attach guest ID automatically
axiosClient.interceptors.request.use((config) => {
  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem("guest_id", guestId);
  }

  config.headers["X-Guest-ID"] = guestId;

  // Attach Bearer Token if user is logged in
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;
