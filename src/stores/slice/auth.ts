import type { StateCreator } from "zustand";
import type { BoundState } from "../bound-store";

export type TUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile: string;
};

export type TAuthSliceState = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;

  user: TUser | null;
  setUser: (user: TUser) => void;

  guests: TUser[] | null;
  setGuests: (guests: TUser[]) => void;
};

export const authSlice: StateCreator<
  BoundState,
  [],
  [],
  Partial<BoundState>
> = (set) => ({
  // sessionStorage 사용 - 탭 닫으면 자동 삭제 (localStorage보다 안전)
  accessToken: sessionStorage.getItem('accessToken'),
  setAccessToken: (token: string) => {
    sessionStorage.setItem('accessToken', token);
    set({ accessToken: token });
  },
  clearAccessToken: () => {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('user'); // 사용자 정보도 함께 정리
    set({ accessToken: null, user: null });
  },

  // 사용자 정보는 민감하지 않으므로 localStorage 사용 가능
  user: (() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  })(),
  setUser: (user: TUser) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  guests: null,
  setGuests: (guests: TUser[]) => set({ guests }),
});
