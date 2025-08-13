import type { StateCreator } from "zustand";

export interface ModalSliceState {
    isGlobalModal: boolean;
    setIsGlobalModal: (isOpen: boolean) => void;

    conferenceId: string | null;
    setConferenceId: (conferenceId: string | null) => void;
}

export const modalSlice: StateCreator<ModalSliceState> = (set) => ({
    isGlobalModal: false,
    setIsGlobalModal: (isOpen: boolean) => set({ isGlobalModal: isOpen }),

    conferenceId: null,
    setConferenceId: (conferenceId: string | null) => set({ conferenceId })
});
