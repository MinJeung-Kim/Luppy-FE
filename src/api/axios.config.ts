import axios from "axios";
import { refreshAccessToken } from "./auth";
import { useBoundStore } from '@/stores/bound-store';

// const domain = import.meta.env.VITE_API_DOMAIN || "//localhost:";
const domain = import.meta.env.VITE_API_DOMAIN || "luppy-be.railway.internal:";
const serverPort = import.meta.env.VITE_SERVER_PORT;

export const baseURL = `${domain}${serverPort}`;

export const axiosPrivate = axios.create({
  baseURL: `http:${baseURL}`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const setupAxiosInterceptors = () => {
  axiosPrivate.interceptors.request.use(
    (config) => {
      const token = useBoundStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.withCredentials = true; // 항상 쿠키 포함
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log("Access token expired, refreshing...");

        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          useBoundStore.getState().setAccessToken(newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (err) {
          console.error("Refresh token failed:", err);
          useBoundStore.getState().clearAccessToken();
        }
      }

      return Promise.reject(error);
    }
  );
};
