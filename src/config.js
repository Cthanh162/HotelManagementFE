import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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
