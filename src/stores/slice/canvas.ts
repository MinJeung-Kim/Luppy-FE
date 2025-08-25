import type { StateCreator } from "zustand";
import * as fabric from "fabric";
import type { BoundState } from "../bound-store";
import { COLORS, STROKES } from '@/utils/color-panel';

export type CanvasSliceState = {
    canvas: fabric.Canvas | null;
    setCanvas: (canvas: fabric.Canvas | null) => void;

    activeColor: string;
    setActiveColor: (color: string) => void;

    activeStroke: number;
    setActiveStroke: (stroke: number) => void;
};

export const canvasSlice: StateCreator<
    BoundState,
    [],
    [],
    Partial<BoundState>
> = (set) => ({
    canvas: null,
    setCanvas: (canvas: fabric.Canvas | null) => set({ canvas }),

    activeColor: COLORS[0],
    setActiveColor: (color: string) => set({ activeColor: color }),

    activeStroke: STROKES[0],
    setActiveStroke: (stroke: number) => set({ activeStroke: stroke }),
});
