import type { StateCreator } from "zustand";

export interface ModalSliceState {
    isGlobalModal: boolean;
    setIsGlobalModal: (isOpen: boolean) => void;
}

export const modalSlice: StateCreator<ModalSliceState> = (set) => ({
    isGlobalModal: false,
    setIsGlobalModal: (isOpen: boolean) => set({ isGlobalModal: isOpen }),
});
