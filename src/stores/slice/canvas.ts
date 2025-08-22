import type { StateCreator } from "zustand";
import fabric from "fabric";
import type { BoundState } from "../bound-store";

export type CanvasSliceState = {
    canvas: fabric.Canvas | null;
    setCanvas: (canvas: fabric.Canvas | null) => void;

    color: string;
    setColor: (color: string) => void;
};

export const canvasSlice: StateCreator<
    BoundState,
    [],
    [],
    Partial<BoundState>
> = (set) => ({
    canvas: null,
    setCanvas: (canvas: fabric.Canvas | null) => set({ canvas }),

    color: "#000000",
    setColor: (color: string) => set({ color }),
});
