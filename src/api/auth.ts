import { AxiosError } from "axios";
import { axiosPrivate } from "./axios.config";
import type { TInitUser } from '@/stores/useUserStore';
import { useBoundStore } from '@/stores/bound-store';
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


export const logout = async () => {
  const { socketClose, clearAccessToken } = useBoundStore.getState();

  try {
    await axiosPrivate.post("/auth/logout", {}, { withCredentials: true });

    socketClose();
    clearAccessToken();

    return { success: true };
  } catch (error) {

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
