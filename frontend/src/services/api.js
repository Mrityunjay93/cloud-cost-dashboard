import axios from "axios";
import { clearSession, getToken } from "./auth";

const defaultProdApiUrl = "https://cloud-cost-monitor-env.eba-uepuh5dy.ap-south-1.elasticbeanstalk.com/api";
const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const apiBaseUrl = process.env.REACT_APP_API_URL || (isLocalHost ? "http://localhost:5000/api" : defaultProdApiUrl);

const API = axios.create({
  baseURL: apiBaseUrl
});

API.interceptors.request.use((req) => {

  const token = getToken();

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
