import { auth } from "@clerk/nextjs/server";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.PRODUCTION_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const { getToken } = await auth();
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
