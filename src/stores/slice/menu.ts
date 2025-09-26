import type { StateCreator } from "zustand";

export interface MenuSliceState {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
  isOpenMenu: boolean;
  toggleMenu: () => void;
}

export const menuSlice: StateCreator<MenuSliceState> = (set) => ({
  selectedMenu: "Dashboard",
  setSelectedMenu: (menu: string) => set({ selectedMenu: menu }),

  isOpenMenu: false,
  toggleMenu: () => set((state) => ({ isOpenMenu: !state.isOpenMenu })),
});
