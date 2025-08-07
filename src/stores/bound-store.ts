import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { socketSlice, type SocketSliceState } from "./slice/socket";
import { alertSlice, type AlertSliceState } from "./slice/alert";
import { authSlice, type AuthSliceState } from "./slice/auth";
import { menuSlice, type MenuSliceState } from "./slice/menu";
import { chatSlice, type ChatSliceState } from './slice/chat';

export type BoundState = AuthSliceState & AlertSliceState & MenuSliceState & SocketSliceState & ChatSliceState;

export const useBoundStore = create<BoundState>()(
  devtools(
    subscribeWithSelector(

      (...a) =>
      ({
        ...authSlice(...a),
        ...chatSlice(...a),
        ...alertSlice(...a),
        ...menuSlice(...a),
        ...socketSlice(...a),
      } as BoundState)

    ),
    {
      name: "store",
    }
  )
);
