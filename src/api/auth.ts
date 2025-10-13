import { AxiosError } from "axios";
import { axiosPrivate, refreshAccessToken } from "./axios.config";
import type { TInitUser } from '@/stores/useUserStore';
import { useBoundStore } from '@/stores/bound-store';
import { AUTH_MESSAGES } from '@/constants/messages';
import { handleAxiosError } from '@/utils/error';


export const register = async (inputs: TInitUser, profile: string) => {
  const { name, phone, email, password } = inputs;
  try {
    const response = await axiosPrivate.post(
      "/auth/register",
      { name, phone, profile },
      {
        headers: {
          Authorization: `Basic ${btoa(`${email}:${password}`)}`,
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (error instanceof AxiosError) {
      const serverMessage =
        error.response?.data?.message || error.response?.data?.error;

      return {
        success: false,
        error: serverMessage || "회원가입에 실패했습니다.",
      };
    }

    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다.",
    };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosPrivate.post(
      "/auth/login",
      {}, // body
      {
        headers: {
          Authorization: `Basic ${btoa(`${email}:${password}`)}`,
        },
      }
    );
    const { accessToken, user } = response.data;

    return { user, accessToken };
  } catch (error) {
    handleAxiosError(error);

    return {
      error: "알 수 없는 오류가 발생했습니다.",
    };
  }
};

// 초기화 중복 방지
let isInitializing = false;

export const initializeAuth = async () => {
  if (isInitializing) {
    if (import.meta.env.DEV) {
      console.log("⚠️ 이미 인증 초기화 중입니다. 중복 호출 방지됨");
    }
    return { success: false, error: "Already initializing", accessToken: null };
  }

  if (import.meta.env.DEV) {
    console.log("🔄 인증 초기화 시작 - refresh token으로 access token 재발급 시도");
  }

  isInitializing = true;

  try {
    // 쿠키에 refreshToken이 있다면 새로운 accessToken 발급
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      if (import.meta.env.DEV) {
        console.log("✅ 토큰 갱신 성공");
      }
      return { success: true, accessToken: newAccessToken };
    }
    // 리프레시 토큰도 만료된 경우
    if (import.meta.env.DEV) {
      console.log("❌ 리프레시 토큰 만료 - 로그인 필요");
    }
    return {
      success: false,
      error: null, // 에러 메시지 제거 - 정상적인 로그아웃 상태
      accessToken: null
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("❌ Auth initialization failed:", error);
    }

    // 초기화 실패 시 알림 표시 (선택적)
    const { setAlertMessage, setOpenAlert } = useBoundStore.getState();
    setAlertMessage(AUTH_MESSAGES.authInitFailed);
    setOpenAlert(true);

    return {
      success: false,
      error: "인증 초기화에 실패했습니다.",
      accessToken: null
    };
  } finally {
    isInitializing = false;
  }
};

export const logout = async () => {
  try {
    await axiosPrivate.post("/auth/logout", {}, { withCredentials: true });

    // 로그아웃 성공 시 모든 저장된 데이터 정리
    const { socketClose, clearAccessToken } = useBoundStore.getState();
    socketClose();
    clearAccessToken(); // 메모리에서 토큰 제거 및 사용자 정보 정리

    return { success: true };
  } catch (error) {
    // 로그아웃 API 실패해도 클라이언트에서 데이터 정리
    const { socketClose, clearAccessToken } = useBoundStore.getState();
    socketClose();
    clearAccessToken();

    if (error instanceof AxiosError) {
      const serverMessage =
        error.response?.data?.message || error.response?.data?.error;

      return {
        success: false,
        error: serverMessage || "로그아웃에 실패했습니다.",
      };
    }

    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다.",
    };
  }
};
