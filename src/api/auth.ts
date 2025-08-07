import { AxiosError } from "axios";
import { axiosPrivate } from "./axios.config";
import type { Inputs } from "@/context/LoginContext";

export const register = async (inputs: Inputs, profile: string) => {
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
    if (error instanceof AxiosError) {
      const serverMessage =
        error.response?.data?.message || error.response?.data?.error;

      return {
        error: serverMessage || "로그인에 실패했습니다.",
      };
    }

    return {
      error: "알 수 없는 오류가 발생했습니다.",
    };
  }
};

// 액세스 토큰 재발급
export const refreshAccessToken = async () => {
  try {
    const response = await axiosPrivate.post(
      "/auth/token/access",
      {},
      { withCredentials: true } // 쿠키에 있는 refreshToken 자동 포함
    );

    return response.data.accessToken;
  } catch (err) {
    console.error("Silent refresh 실패:", err);
    return null;
  }
};

export const initializeAuth = async () => {
  try {
    // 쿠키에 refreshToken이 있다면 새로운 accessToken 발급
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      return { success: true, accessToken: newAccessToken };
    }
    // 리프레시 토큰도 만료된 경우
    console.log("리프레시 토큰 만료 - 자동 로그아웃");
    return {
      success: false,
      error: "세션이 만료되었습니다. 로그인이 필요합니다.",
      accessToken: null
    };
  } catch (error) {
    console.error("Auth initialization failed:", error);
    return {
      success: false,
      error: "인증 초기화에 실패했습니다.",
      accessToken: null
    };
  }
};

export const logout = async () => {
  try {
    await axiosPrivate.post("/auth/logout", {}, { withCredentials: true });
    return { success: true };
  } catch (error) {
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
