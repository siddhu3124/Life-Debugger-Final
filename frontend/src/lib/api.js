import axios from "axios";

// For production on Vercel, use relative /api path (proxied to backend)
// For development, use localhost:5000
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  console.log("Environment VITE_API_URL:", envUrl);

  // Check if running on Vercel (production)
  if (envUrl && envUrl.includes('vercel')) {
    return '/api';
  }

  // Use environment variable or fallback to localhost
  const url = envUrl 
    ? (envUrl.endsWith('/') ? `${envUrl}api` : `${envUrl}/api`)
    : "http://localhost:5000/api";
  
  console.log("Final API Base URL:", url);
  return url;
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

