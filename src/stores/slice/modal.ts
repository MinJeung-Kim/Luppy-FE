import type { StateCreator } from "zustand";

export interface ModalSliceState {
    isGlobalModal: boolean;
    setIsGlobalModal: (isOpen: boolean) => void;

    conferenceId: string | null;
    setConferenceId: (conferenceId: string | null) => void;

    isCreatedRoom: boolean;
    setIsCreatedRoom: (isCreated: boolean) => void;
}

export const modalSlice: StateCreator<ModalSliceState> = (set) => ({
    isGlobalModal: false,
    setIsGlobalModal: (isOpen: boolean) => set({ isGlobalModal: isOpen }),

    conferenceId: null,
    setConferenceId: (conferenceId: string | null) => set({ conferenceId }),

    isCreatedRoom: false,
    setIsCreatedRoom: (isCreated: boolean) => set({ isCreatedRoom: isCreated })
});
