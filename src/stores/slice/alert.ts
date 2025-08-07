import type { StateCreator } from "zustand";
import type { BoundState } from "../bound-store";

export type AlertSliceState = {
  openAlert: boolean;
  setOpenAlert: (open: boolean) => void;
  alertMessage: string | null;
  setAlertMessage: (message: string | null) => void;
};

export const alertSlice: StateCreator<
  BoundState,
  [],
  [],
  Partial<BoundState>
> = (set) => ({
  openAlert: false,
  setOpenAlert: (open: boolean) => set({ openAlert: open }),

  alertMessage: null,
  setAlertMessage: (message: string | null) => set({ alertMessage: message }),
});
