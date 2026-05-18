import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OutboxMessage, OutboxMessageStatus } from "@/services/websocket/types";

interface TypingUser {
  userId: string;
  timestamp: number;
}

interface ChatRealtimeState {
  typingUsers: Record<string, TypingUser[]>; // chatId → typing users
  outbox: OutboxMessage[];
  pendingReadReceipts: string[]; // messageIds sent as read but not yet ack'd
}

const initialState: ChatRealtimeState = {
  typingUsers: {},
  outbox: [],
  pendingReadReceipts: [],
};

export const chatRealtimeSlice = createSlice({
  name: "chatRealtime",
  initialState,
  reducers: {
    // ── Typing indicators ──
    setTyping(
      state,
      action: PayloadAction<{ chatId: string; userId: string; isTyping: boolean }>,
    ) {
      const { chatId, userId, isTyping } = action.payload;

      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = [];
      }

      const existing = state.typingUsers[chatId];

      if (isTyping) {
        // Add or update timestamp
        const idx = existing.findIndex((u) => u.userId === userId);
        if (idx >= 0) {
          existing[idx].timestamp = Date.now();
        } else {
          existing.push({ userId, timestamp: Date.now() });
        }
      } else {
        // Remove
        state.typingUsers[chatId] = existing.filter(
          (u) => u.userId !== userId,
        );
      }
    },

    clearStaleTyping(state, action: PayloadAction<{ maxAge: number }>) {
      const cutoff = Date.now() - action.payload.maxAge;
      for (const chatId of Object.keys(state.typingUsers)) {
        state.typingUsers[chatId] = state.typingUsers[chatId].filter(
          (u) => u.timestamp > cutoff,
        );
        if (state.typingUsers[chatId].length === 0) {
          delete state.typingUsers[chatId];
        }
      }
    },

    // ── Outbox (optimistic sends) ──
    addToOutbox(state, action: PayloadAction<OutboxMessage>) {
      state.outbox.push(action.payload);
    },

    updateOutboxStatus(
      state,
      action: PayloadAction<{
        clientMessageId: string;
        status: OutboxMessageStatus;
      }>,
    ) {
      const { clientMessageId, status } = action.payload;
      const entry = state.outbox.find(
        (m) => m.clientMessageId === clientMessageId,
      );
      if (entry) {
        entry.status = status;
      }
    },

    removeFromOutbox(state, action: PayloadAction<string>) {
      state.outbox = state.outbox.filter(
        (m) => m.clientMessageId !== action.payload,
      );
    },

    clearOutbox(state) {
      state.outbox = [];
    },

    // ── Read receipts ──
    addPendingReadReceipt(state, action: PayloadAction<string>) {
      if (!state.pendingReadReceipts.includes(action.payload)) {
        state.pendingReadReceipts.push(action.payload);
      }
    },

    removePendingReadReceipt(state, action: PayloadAction<string>) {
      state.pendingReadReceipts = state.pendingReadReceipts.filter(
        (id) => id !== action.payload,
      );
    },
  },
});

export const {
  setTyping,
  clearStaleTyping,
  addToOutbox,
  updateOutboxStatus,
  removeFromOutbox,
  clearOutbox,
  addPendingReadReceipt,
  removePendingReadReceipt,
} = chatRealtimeSlice.actions;

export default chatRealtimeSlice.reducer;
