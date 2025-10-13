import axios from "axios";
import useAuthStore from '../stores/useAuthStore';


function normalizeBase(url?: string) {
  if (!url) return 'http://localhost:5173';                 // 로컬 개발 기본값
  if (/^https?:\/\//i.test(url)) return url;                // 이미 절대 URL
  if (url.startsWith('//')) return `https:${url}`;          // 프로토콜 상대 → https 붙이기
  return `https://${url}`;                                  // 호스트만 온 경우
}

const domain = normalizeBase(import.meta.env.VITE_API_DOMAIN);
export const baseURL = domain;

// 일반 API 요청용 axios 인스턴스
export const axiosPrivate = axios.create({
  baseURL: domain.replace(/\/+$/, ''),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 토큰 갱신 전용 axios 인스턴스 (인터셉터 없음)
export const axiosRefresh = axios.create({
  baseURL: domain.replace(/\/+$/, ''),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});



// 토큰 갱신 함수 (순환 참조 방지를 위해 여기서 정의)
export const refreshAccessToken = async () => {
  if (import.meta.env.DEV) {
    console.log("🔄 토큰 갱신 시도... (refreshAccessToken 호출됨)");
  }

  try {
    const response = await axiosRefresh.post(
      "/auth/token/access",
      {},
      { withCredentials: true }
    );

    if (import.meta.env.DEV) {
      console.log("✅ 토큰 갱신 성공:", response.data.accessToken ? "토큰 받음" : "토큰 없음");
    }
    return response.data.accessToken;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error("❌ Silent refresh 실패:", err);

      // 401 에러인 경우 리프레시 토큰 만료로 간주
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          console.log("🔒 리프레시 토큰도 만료됨");
        }
      }
    }

    return null;
  }
};

// 요청 인터셉터: 모든 요청에 토큰 자동 추가
axiosPrivate.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 시 토큰 갱신 시도
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          useAuthStore.getState().setToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosPrivate(originalRequest);
        } else {
          // 토큰 갱신 실패 시 로그아웃 처리
          useAuthStore.getState().clearAccessToken();
          // 필요시 로그인 페이지로 리다이렉트
          window.location.href = '/login';
        }
      } catch (refreshError) {
        useAuthStore.getState().clearAccessToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

