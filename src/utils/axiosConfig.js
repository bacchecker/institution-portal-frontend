import axios from "axios";
import secureLocalStorage from "react-secure-storage";

axios.defaults.withCredentials = true;

const instance = axios.create({
  //baseURL: "http://127.0.0.1:8000/api",
  baseURL: import.meta.env.VITE_BACCHECKER_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const authToken = JSON?.parse(
      secureLocalStorage?.getItem("userToken")
    )?.token;

    if (authToken) {
      config.headers["Authorization"] = "Bearer " + authToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
