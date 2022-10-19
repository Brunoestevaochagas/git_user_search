import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.github.com",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    return Promise.reject(
      (error.response && error.response.data) || error?.message || "Error"
    );
  }
);

export default axiosInstance;
