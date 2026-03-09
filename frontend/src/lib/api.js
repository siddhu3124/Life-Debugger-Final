import axios from "axios";

// For production on Vercel, use relative /api path (proxied to backend)
// For development, use localhost:5000
const getBaseURL = () => {
  // Check if running on Vercel (production)
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.includes('vercel')) {
    return '/api';
  }
  // Use environment variable or fallback to localhost
  return import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseURL()
});

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("ld_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

