import type { StateCreator } from "zustand";
import type { BoundState } from "../bound-store";

export type User = {
  id: number;
  name: string;
  email: string;
  profile: string;
};

export type AuthSliceState = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;

  user: User | null;
  setUser: (user: User) => void;

  guests: User[] | null;
  setGuests: (guests: User[]) => void;
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
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  guests: null,
  setGuests: (guests: User[]) => set({ guests }),
});
