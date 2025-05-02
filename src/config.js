import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Bạn có thể thêm các interceptor ở đây nếu cần
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm logic xử lý trước khi gửi request
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Thêm logic xử lý khi nhận response
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
