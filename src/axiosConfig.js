import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend.baccheck.online/api/",
  /* baseURL: "http://localhost:8000/api/", */
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

instance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      config.headers["Authorization"] = "Bearer " + authToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
