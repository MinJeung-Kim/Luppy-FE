import type { StateCreator } from "zustand";
import type { BoundState } from "../bound-store";
import type { TGroupList } from '@/pages/Messenger/Messenger';

export type ChatSliceState = {
    roomId: number | null;
    setRoomId: (id: number | null) => void;
    chatGroupList: TGroupList[];
    setChatGroupList: (list: TGroupList[]) => void;
};

export const chatSlice: StateCreator<
    BoundState,
    [],
    [],
    Partial<BoundState>
> = (set) => ({
    roomId: null,
    setRoomId: (id: number | null) => set({ roomId: id }),

    chatGroupList: [],
    setChatGroupList: (list: TGroupList[]) => set({ chatGroupList: list }),
});
