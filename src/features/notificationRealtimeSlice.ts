import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface EphemeralToast {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationRealtimeState {
  ephemeralToasts: EphemeralToast[];
}

const initialState: NotificationRealtimeState = {
  ephemeralToasts: [],
};

export const notificationRealtimeSlice = createSlice({
  name: "notificationRealtime",
  initialState,
  reducers: {
    addEphemeralToast(state, action: PayloadAction<EphemeralToast>) {
      state.ephemeralToasts.push(action.payload);
    },
    removeEphemeralToast(state, action: PayloadAction<string>) {
      state.ephemeralToasts = state.ephemeralToasts.filter(
        (t) => t.id !== action.payload,
      );
    },
    clearAllToasts(state) {
      state.ephemeralToasts = [];
    },
  },
});

export const { addEphemeralToast, removeEphemeralToast, clearAllToasts } =
  notificationRealtimeSlice.actions;

export default notificationRealtimeSlice.reducer;
