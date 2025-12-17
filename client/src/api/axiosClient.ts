import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";
import { getAccessToken, clearAuth } from "@/auth/authStore";

const API_URL = import.meta.env.VITE_API_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔐 Attach Firebase ID Token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Response + Error Handling
axiosClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const msg = response.data?.message;
    if (msg) toast.success(msg);
    return response;
  },
  async (error: AxiosError) => {
    // 🔴 Unauthorized → force logout
    if (error.response?.status === 401) {
      clearAuth();
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 🧠 Other errors
    let message = "Something went wrong";
    if (error.response?.data && typeof error.response.data === "object") {
      message = (error.response.data as any).message || message;
    } else if (error.message) {
      message = error.message;
    }

    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosClient;
