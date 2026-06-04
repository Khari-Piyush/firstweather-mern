import axios from "axios";

const api = axios.create({
  baseURL: "https://first-weather-webapp-h05a.onrender.com/api",
  withCredentials: true, // sends httpOnly auth_token cookie automatically
});

// Read the non-httpOnly csrf_token cookie set by the backend on login
const getCsrfToken = () => {
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
};

// Attach CSRF token header on all state-changing requests
api.interceptors.request.use((config) => {
  const method = (config.method || "").toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    config.headers["X-CSRF-Token"] = getCsrfToken();
  }
  return config;
});

export default api;
