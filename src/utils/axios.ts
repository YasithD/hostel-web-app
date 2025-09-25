import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.PRODUCTION_URL,
});

export default axiosInstance;
