import type { TJoinUser } from '@/context/ConferenceContext';
import type { StateCreator } from "zustand";

export interface ConferenceSliceState {
    isGlobalModal: boolean;
    setIsGlobalModal: (isOpen: boolean) => void;

    conferenceId: string | null;
    setConferenceId: (conferenceId: string | null) => void;

    isCreatedRoom: boolean;
    setIsCreatedRoom: (isCreated: boolean) => void;


    joinUser: TJoinUser | null;
    setJoinUser: (joinUser: TJoinUser | null) => void;
}

export const conferenceSlice: StateCreator<ConferenceSliceState> = (set) => ({
    isGlobalModal: false,
    setIsGlobalModal: (isOpen: boolean) => set({ isGlobalModal: isOpen }),

    conferenceId: null,
    setConferenceId: (conferenceId: string | null) => set({ conferenceId }),

    isCreatedRoom: false,
    setIsCreatedRoom: (isCreated: boolean) => set({ isCreatedRoom: isCreated }),

    joinUser: null,
    setJoinUser: (joinUser: TJoinUser | null) => set({ joinUser })

});
