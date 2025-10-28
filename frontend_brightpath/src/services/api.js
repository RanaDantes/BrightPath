// src/api.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/"; // or '/' if using proxy
const REFRESH_ENDPOINT = "/api/auth/token/refresh/"; // adjust if you use different path
const TOKEN_ENDPOINT = "/api/auth/token/"; // token obtain endpoint

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper utilities to get / set / remove tokens (single place to change keys)
const getAccess = () => localStorage.getItem("access");
const getRefresh = () => localStorage.getItem("refresh");
const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
};
const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

// --- Request interceptor: attach access token if present ---
api.interceptors.request.use(
  (config) => {
    // Don't attach token for auth endpoints (obtain/refresh)
    const url = config.url || "";
    if (url.endsWith(TOKEN_ENDPOINT) || url.endsWith(REFRESH_ENDPOINT)) {
      return config;
    }
    const token = getAccess();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor: handle 401 by attempting refresh ----------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If response is not defined or not a 401, just reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Avoid trying refresh for token endpoints themselves
    const requestUrl = originalRequest.url || "";
    if (
      requestUrl.endsWith(TOKEN_ENDPOINT) ||
      requestUrl.endsWith(REFRESH_ENDPOINT)
    ) {
      // token endpoints returned 401 — nothing we can do
      clearTokens();
      return Promise.reject(error);
    }

    // If already refreshing, queue the request
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    const refreshToken = getRefresh();
    if (!refreshToken) {
      clearTokens();
      isRefreshing = false;
      // optionally redirect to login here: window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      const resp = await axios.post(
        `${BASE_URL}${REFRESH_ENDPOINT}`,
        { refresh: refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const newAccess = resp.data.access;
      // update local storage and default header
      setTokens({ access: newAccess });
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
      processQueue(null, newAccess);

      // retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return axios(originalRequest);
    } catch (err) {
      processQueue(err, null);
      clearTokens();
      // Optional: redirect to login page
      // window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export { api as default, setTokens, clearTokens, getAccess, getRefresh };
