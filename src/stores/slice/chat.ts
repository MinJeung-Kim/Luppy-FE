import type { StateCreator } from "zustand";
import type { BoundState } from "../bound-store";

export type ChatSliceState = {
    roomId: number | null;
    setRoomId: (id: number | null) => void;

};

export const chatSlice: StateCreator<
    BoundState,
    [],
    [],
    Partial<BoundState>
> = (set) => ({
    roomId: null,
    setRoomId: (id: number | null) => set({ roomId: id }),
});
