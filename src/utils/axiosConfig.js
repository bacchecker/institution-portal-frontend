import axios from "axios";
import secureLocalStorage from "react-secure-storage";

const instance = axios.create({
  baseURL: "https://backend.baccheck.online/api/",
  //baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    // "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const authToken = secureLocalStorage.getItem("authToken");

    if (authToken) {
      config.headers["Authorization"] = "Bearer " + authToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
