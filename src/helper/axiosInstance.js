import axios from "axios";
import apiURL from "../apiConfig";

const token = localStorage.getItem("access_token");

const axiosInstance = axios.create({
  baseURL: apiURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization header to all requests
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
