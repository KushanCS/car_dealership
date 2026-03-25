import axios from "axios";
<<<<<<< HEAD
=======
import { clearAuth } from "../utils/auth";
>>>>>>> main

const api = axios.create({
  baseURL: "http://localhost:8070/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

<<<<<<< HEAD
export default api;
=======
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
>>>>>>> main
