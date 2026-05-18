import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WsConnectionStatus } from "@/services/websocket/types";

interface WsConnectionState {
  status: WsConnectionStatus;
  retryCount: number;
  lastConnectedAt: number | null;
}

const initialState: WsConnectionState = {
  status: "idle",
  retryCount: 0,
  lastConnectedAt: null,
};

export const wsConnectionSlice = createSlice({
  name: "wsConnection",
  initialState,
  reducers: {
    setConnectionStatus(state, action: PayloadAction<WsConnectionStatus>) {
      state.status = action.payload;
      if (action.payload === "connected") {
        state.lastConnectedAt = Date.now();
        state.retryCount = 0;
      }
    },
    incrementRetry(state) {
      state.retryCount += 1;
    },
    resetConnection() {
      return initialState;
    },
  },
});

export const { setConnectionStatus, incrementRetry, resetConnection } =
  wsConnectionSlice.actions;
export default wsConnectionSlice.reducer;
