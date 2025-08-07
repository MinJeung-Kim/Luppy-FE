import type { StateCreator } from "zustand";
import type { BoundState } from "../bound-store";

export type User = {
  id: string;
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
  accessToken: null,
  setAccessToken: (token: string) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),

  user: null,
  setUser: (user: User) => set({ user }),

  guests: null,
  setGuests: (guests: User[]) => set({ guests }),
});
