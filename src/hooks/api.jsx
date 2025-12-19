import axios from "axios";
import Cookies from "js-cookie";
export const instance = axios.create({
  // baseURL: "https://apiielts.animall.uz/",
  baseURL: "https://apiielts.astrocoder.uz/",
  // baseURL: "http://localhost:5000/",
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Request xatosi:", error);
    return Promise.reject(error);
  }
);
