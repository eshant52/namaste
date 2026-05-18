import { configureStore } from "@reduxjs/toolkit";
import wsConnectionReducer from "../features/wsConnectionSlice";
import chatRealtimeReducer from "../features/chatRealtimeSlice";
import notificationRealtimeReducer from "../features/notificationRealtimeSlice";

export const store = configureStore({
  reducer: {
    wsConnection: wsConnectionReducer,
    chatRealtime: chatRealtimeReducer,
    notificationRealtime: notificationRealtimeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
