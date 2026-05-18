// Re-export WS contract types from Zod schemas
export type {
  ClientAction,
  ServerAction,
  WsClientMessage,
  WsServerMessage,
  WsChatSendPayload,
  WsChatTypingPayload,
  WsChatReadPayload,
  WsChatMessagePayload,
  WsChatTypingServerPayload,
  WsChatReadServerPayload,
  WsPresenceUpdatePayload,
  WsNotificationPayload,
  WsContactStatusChangedPayload,
  WsGroupMemberEventPayload,
  WsErrorPayload,
} from "@/schemas/websocket.zod";

// ── Connection state ──

export type WsConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

// ── Outbox (optimistic sends) ──

export type OutboxMessageStatus = "pending" | "sent" | "failed";

export interface OutboxMessage {
  clientMessageId: string;
  chatId: string;
  message: string;
  replyToId?: string | null;
  status: OutboxMessageStatus;
  createdAt: number; // Date.now() for timeout tracking
}
