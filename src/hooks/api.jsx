import axios from "axios";
import Cookies from "js-cookie";
export const instance = axios.create({
  baseURL: "http://49.12.215.35:4001",
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