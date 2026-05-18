import z from "zod";
import {
  singleMessageResponseSchema,
  notificationResponseSchema,
} from "./user/protected.zod";

// ============================================================================
// CLIENT → SERVER: Actions & Payloads
// ============================================================================

export const clientActionSchema = z.enum([
  "ping",
  "chat:send",
  "chat:typing",
  "chat:read",
]);
export type ClientAction = z.infer<typeof clientActionSchema>;

// ── Payloads ──

export const wsChatSendPayloadSchema = z.object({
  chatId: z.string(),
  message: z.string().min(1).max(5000),
  replyToId: z.string().nullish(),
  clientMessageId: z.string().min(1),
});
export type WsChatSendPayload = z.infer<typeof wsChatSendPayloadSchema>;

export const wsChatTypingPayloadSchema = z.object({
  chatId: z.string(),
  isTyping: z.boolean(),
});
export type WsChatTypingPayload = z.infer<typeof wsChatTypingPayloadSchema>;

export const wsChatReadPayloadSchema = z.object({
  chatId: z.string(),
  messageId: z.string(),
});
export type WsChatReadPayload = z.infer<typeof wsChatReadPayloadSchema>;

// ── Client Message Envelope ──

export const wsClientMessageSchema = z.object({
  id: z.string(),
  action: clientActionSchema,
  payload: z.unknown(),
});

export type WsClientMessage<T = unknown> = {
  id: string;
  action: ClientAction;
  payload: T;
};

// ============================================================================
// SERVER → CLIENT: Actions & Payloads
// ============================================================================

export const serverActionSchema = z.enum([
  "pong",
  "chat:message",
  "chat:typing",
  "chat:read",
  "presence:update",
  "notification:new",
  "contact:status-changed",
  "group:member:joined",
  "group:member:left",
  "error",
  "system:info",
]);
export type ServerAction = z.infer<typeof serverActionSchema>;

// ── Payloads ──

export const wsChatMessagePayloadSchema = singleMessageResponseSchema.extend({
  chatId: z.string(),
  clientMessageId: z.string().optional(),
});
export type WsChatMessagePayload = z.infer<typeof wsChatMessagePayloadSchema>;

export const wsChatTypingServerPayloadSchema = z.object({
  chatId: z.string(),
  userId: z.string(),
  isTyping: z.boolean(),
});
export type WsChatTypingServerPayload = z.infer<
  typeof wsChatTypingServerPayloadSchema
>;

export const wsChatReadServerPayloadSchema = z.object({
  chatId: z.string(),
  messageId: z.string(),
  readAt: z.string(),
});
export type WsChatReadServerPayload = z.infer<
  typeof wsChatReadServerPayloadSchema
>;

export const wsPresenceUpdatePayloadSchema = z.object({
  userId: z.string(),
  status: z.enum(["online", "offline"]),
  lastSeen: z.string().nullable(),
});
export type WsPresenceUpdatePayload = z.infer<
  typeof wsPresenceUpdatePayloadSchema
>;

export const wsNotificationPayloadSchema = z.object({
  notification: notificationResponseSchema,
});
export type WsNotificationPayload = z.infer<
  typeof wsNotificationPayloadSchema
>;

export const wsContactStatusChangedPayloadSchema = z.object({
  contactId: z.string(),
  status: z.enum(["added", "removed", "blocked", "unblocked"]),
});
export type WsContactStatusChangedPayload = z.infer<
  typeof wsContactStatusChangedPayloadSchema
>;

export const wsGroupMemberEventPayloadSchema = z.object({
  chatId: z.string(),
  userId: z.string(),
  event: z.enum(["joined", "left"]),
});
export type WsGroupMemberEventPayload = z.infer<
  typeof wsGroupMemberEventPayloadSchema
>;

export const wsErrorPayloadSchema = z.object({
  code: z.string(),
  message: z.string(),
  correlationId: z.string().optional(),
});
export type WsErrorPayload = z.infer<typeof wsErrorPayloadSchema>;

// ── Server Message Envelope ──

export const wsServerMessageSchema = z.object({
  id: z.string().optional(),
  action: serverActionSchema,
  payload: z.unknown(),
  ts: z.number(),
});

export type WsServerMessage<T = unknown> = {
  id?: string;
  action: ServerAction;
  payload: T;
  ts: number;
};
