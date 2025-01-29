import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api/v1", // Replace with your actual backend URL
  withCredentials: true, // Ensures cookies are sent in requests
});

export default axiosInstance;
