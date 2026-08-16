import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cf_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/signup");

    // Only force-redirect on 401s from OTHER routes (expired/invalid session).
    // Login/signup 401s (wrong password, duplicate email) should just show
    // their error toast on the current page — not reload it away.
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("cf_token");
      localStorage.removeItem("cf_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
