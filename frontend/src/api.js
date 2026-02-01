import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  //baseURL: "https://first-weather-webapp-h05a.onrender.com/api",
  withCredentials: true,
});
// attach token on startup (for page refresh)
const tokenOnLoad = localStorage.getItem("token");
if (tokenOnLoad) api.defaults.headers.common.Authorization = `Bearer ${tokenOnLoad}`;

// request interceptor is optional (kept for redundancy)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
