"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
const API_ENDPOINT = process.env.NEXT_AUTHENTICATION_API_ENDPOINT;


// Configuración base de axios
const api = axios.create({
  baseURL: API_ENDPOINT || "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

// Interceptor de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const router = useRouter();
    const originalRequest = error.config;

    // Solo manejar errores 401 (No autorizado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        router.push("/login");
        return Promise.reject(error);
      }

      try {
        const response = await api.post("token/refresh/", {
          refresh: refreshToken,
        });

        const { access, refresh: newRefresh } = response.data;

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", newRefresh);
        api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        originalRequest.headers["Authorization"] = `Bearer ${access}`;

        // Reprocesar todas las solicitudes en cola
        failedRequestsQueue.forEach(({ resolve }) => resolve(access));
        failedRequestsQueue = [];

        return api(originalRequest);
      } catch (refreshError) {
        // Si el refresh falla, redirigir a login
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
        failedRequestsQueue = [];
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Interceptor de solicitud para agregar el token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;