import axios from "axios";
import { refreshAccessToken } from "./auth";
import { useBoundStore } from '@/stores/bound-store';


function normalizeBase(url?: string) {
  if (!url) return 'http://localhost:8080';                 // 로컬 개발 기본값
  if (/^https?:\/\//i.test(url)) return url;                // 이미 절대 URL
  if (url.startsWith('//')) return `https:${url}`;          // 프로토콜 상대 → https 붙이기
  return `https://${url}`;                                  // 호스트만 온 경우
}

const domain = normalizeBase(import.meta.env.VITE_API_DOMAIN);
export const baseURL = domain;

// 끝 슬래시 제거(axios가 path 조합할 때 깔끔)
export const axiosPrivate = axios.create({
  baseURL: domain.replace(/\/+$/, ''),
  headers: { 'Content-Type': 'application/json' },
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
