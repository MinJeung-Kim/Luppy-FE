import axios from "axios";
import { useBoundStore } from '@/stores/bound-store';
import { AUTH_MESSAGES } from '@/constants/messages';


function normalizeBase(url?: string) {
  if (!url) return 'http://localhost:8080';                 // 로컬 개발 기본값
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

// 토큰 갱신 중복 방지를 위한 상태 관리
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

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

  axiosPrivate.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      // 토큰 갱신 요청 자체는 재시도하지 않음 (무한루프 방지)
      if (originalRequest.url?.includes('/auth/token/access')) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (import.meta.env.DEV) {
          console.log("🚨 401 에러 발생:", originalRequest.url);
          console.log("📊 현재 상태 - isRefreshing:", isRefreshing, "failedQueue 길이:", failedQueue.length);
        }

        if (isRefreshing) {
          if (import.meta.env.DEV) {
            console.log("⏳ 이미 토큰 갱신 중... 대기열에 추가");
          }
          // 이미 토큰 갱신 중이면 대기열에 추가
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosPrivate(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        if (import.meta.env.DEV) {
          console.log("Access token expired, refreshing...");
        }
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            useBoundStore.getState().setAccessToken(newAccessToken);

            // 토큰 갱신 성공 시 소켓 재연결
            const { socketClose, socketOpen } = useBoundStore.getState();
            socketClose(); // 기존 연결 종료
            setTimeout(() => socketOpen(), 100); // 짧은 지연 후 재연결

            processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosPrivate(originalRequest);
          } else {
            if (import.meta.env.DEV) {
              console.log("Refresh token expired - clearing access token");
            }
            const { clearAccessToken, socketClose, setAlertMessage, setOpenAlert } = useBoundStore.getState();

            clearAccessToken();
            socketClose(); // 토큰 만료 시 소켓 연결 종료

            // 토큰 만료 알림 표시
            setAlertMessage(AUTH_MESSAGES.tokenExpired);
            setOpenAlert(true);

            processQueue(new Error("Refresh token expired"), null);
            return Promise.reject(new Error("Refresh token expired"));
          }
        } catch (err) {
          if (import.meta.env.DEV) {
            console.error("Refresh token failed:", err);
          }
          const { clearAccessToken, socketClose, setAlertMessage, setOpenAlert } = useBoundStore.getState();

          clearAccessToken();
          socketClose(); // 토큰 갱신 실패 시 소켓 연결 종료

          // 토큰 갱신 실패 알림 표시
          setAlertMessage(AUTH_MESSAGES.tokenExpired);
          setOpenAlert(true);

          processQueue(err instanceof Error ? err : new Error("Unknown error"), null);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
