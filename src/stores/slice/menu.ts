import type { StateCreator } from "zustand";

export interface MenuSliceState {
  isOpenMenu: boolean;
  toggleMenu: () => void;
}

export const menuSlice: StateCreator<MenuSliceState> = (set) => ({

  isOpenMenu: false,
  toggleMenu: () => set((state) => ({ isOpenMenu: !state.isOpenMenu })),
});
