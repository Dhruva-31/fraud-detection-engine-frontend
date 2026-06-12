import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

let isRefreshing = false;
let refreshPromise = null;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthPage =
      window.location.pathname === "/login" ||
      window.location.pathname === "/register";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthPage
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {  
          isRefreshing = true;

          const refresh_token = localStorage.getItem("refresh_token");

          refreshPromise = axios.post(
            `${process.env.REACT_APP_API_URL}/auth/refresh`,
            { refresh_token }
          );

          refreshPromise.finally(() => {
            isRefreshing = false;
          });
        }

        const res = await refreshPromise;

        const new_access_token = res.data.access_token;
        const new_refresh_token = res.data.refresh_token;

        localStorage.setItem("access_token", new_access_token);
        localStorage.setItem("refresh_token", new_refresh_token);

        originalRequest.headers.Authorization = `Bearer ${new_access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    if (
      error.response?.status === 401 &&
      !isAuthPage
    ) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;