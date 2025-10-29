import axios from "axios";
import { useRuntimeConfig } from "#app";

export const getApiAuth = () => {
  const config = useRuntimeConfig();
  const apiAuth = axios.create({
    baseURL: config.public.apiDomain, 
  });

  // เพิ่ม Authorization header ถ้ามี token
  apiAuth.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token หมดอายุหรือไม่ถูกต้อง
        localStorage.clear();
        if (process.client) {
          window.location.href = "/auth/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return apiAuth;
};

// =======================
// API FUNCTIONS
// =======================

export const login = async (email, password) => {
  const api = getApiAuth();
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const logout = async (email) => {
  const api = getApiAuth();
  const res = await api.post("/auth/logout", { email });
  return res.data;
};

export const fetchMe = async () => {
  const api = getApiAuth();
  const res = await api.get("/auth/me");
  return res.data;
};

export const registerUser = async (userData) => {
  const api = getApiAuth();
  const res = await api.post("/auth/register", userData);
  return res.data;
};
