import axios from "axios";
import store from "../redux/store.js";
import { clearUser } from "../features/UserSlice.js";

const isProductionDomain = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
const defaultApiUrl = isProductionDomain ? 'https://xtreme-backend-gamma.vercel.app/api' : 'http://localhost:8000/api';
const baseURL = import.meta.env.VITE_API_URL || defaultApiUrl;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || store.getState()?.user?.token;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401 / 403 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        store.dispatch(clearUser());
      } catch (_) {}
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

