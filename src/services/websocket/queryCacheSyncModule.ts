import type { QueryClient, InfiniteData } from "@tanstack/react-query";
import type { AppDispatch } from "@/store";
import type {
  WsServerMessage,
  WsChatMessagePayload,
  WsChatTypingServerPayload,
  WsChatReadServerPayload,
  WsNotificationPayload,
  WsGroupMemberEventPayload,
} from "./types";
import { setTyping, removeFromOutbox } from "@/features/chatRealtimeSlice";
import { addEphemeralToast } from "@/features/notificationRealtimeSlice";
import { protectedKeys } from "@/hooks/queries/queryKeys";
import type { WebSocketManager } from "./WebSocketManager";
import type {
  GetChatResponseData,
  NotificationsResponseData,
  RecentContactChatsResponseData,
  UnreadCountResponseData,
} from "@/schemas/user/protected.zod";
import type { SuccessResponse } from "@/types/response.types";
import { toast } from "sonner";

type MessagesInfiniteData = InfiniteData<
  SuccessResponse<GetChatResponseData>,
  Date | undefined
>;

type RecentChatsData = SuccessResponse<RecentContactChatsResponseData>;
type NotificationsData = SuccessResponse<NotificationsResponseData>;
type UnreadCountData = SuccessResponse<UnreadCountResponseData>;

const notificationToastMessage = (
  type: WsNotificationPayload["notification"]["type"],
) => {
  switch (type) {
    case "contact_request_received":
      return "New contact request";
    case "contact_request_accepted":
      return "Contact request accepted";
    case "contact_request_rejected":
      return "Contact request rejected";
    case "group_invite_received":
      return "New group invite";
    case "group_invite_accepted":
      return "Group invite accepted";
    case "group_invite_rejected":
      return "Group invite rejected";
    case "group_member_added":
      return "Group member added";
    case "group_member_removed":
      return "Group member removed";
  }
};

/**
 * Centralised WS event → TanStack Query cache sync.
 *
 * This is the single place where incoming WS events mutate the query cache.
 * Registered once by the WebSocketProvider.
 */
export function registerQueryCacheSync(
  manager: WebSocketManager,
  queryClient: QueryClient,
  dispatch: AppDispatch,
): () => void {
  const unsubscribers: (() => void)[] = [];

  // ── chat:message ──
  unsubscribers.push(
    manager.on("chat:message", (raw: WsServerMessage) => {
      const payload = raw.payload as WsChatMessagePayload;
      const { chatId, clientMessageId, ...messageFields } = payload;

      // 1. Update messages cache (infinite query)
      const messagesKey = protectedKeys.messages(chatId);
      queryClient.setQueryData<MessagesInfiniteData>(
        messagesKey,
        (oldData) => {
          if (!oldData) return oldData;

          const allMessages = oldData.pages.flatMap((p) => p.data);

          // Dedupe: skip if message.id already exists
          if (allMessages.some((m) => m.id === messageFields.id)) {
            // Still resolve outbox if it was our optimistic send
            if (clientMessageId) {
              dispatch(removeFromOutbox(clientMessageId));
            }
            return oldData;
          }

          // If this is an optimistic message ack, replace the placeholder
          if (clientMessageId) {
            dispatch(removeFromOutbox(clientMessageId));

            // Remove optimistic entry with matching clientMessageId from pages
            const updatedPages = oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter(
                (m) =>
                  !("clientMessageId" in m) ||
                  (m as unknown as { clientMessageId?: string }).clientMessageId !==
                    clientMessageId,
              ),
            }));

            // Prepend real message to first page (newest page)
            return {
              ...oldData,
              pages: [
                {
                  ...updatedPages[0],
                  data: [messageFields, ...updatedPages[0].data],
                },
                ...updatedPages.slice(1),
              ],
            };
          }

          // New incoming message — prepend to first page
          return {
            ...oldData,
            pages: [
              {
                ...oldData.pages[0],
                data: [messageFields, ...oldData.pages[0].data],
              },
              ...oldData.pages.slice(1),
            ],
          };
        },
      );

      // 2. Update recent chats — move this chat to top
      const recentChatsKey = protectedKeys.recentChats();
      queryClient.setQueryData<RecentChatsData>(recentChatsKey, (oldData) => {
        if (!oldData) return oldData;

        const existingIdx = oldData.data.findIndex(
          (chat) => chat.chatId === chatId,
        );

        if (existingIdx >= 0) {
          const updated = [...oldData.data];
          const [chat] = updated.splice(existingIdx, 1);
          const updatedChat = {
            ...chat,
            recentText: messageFields.message,
            recentChatAt: messageFields.createdAt,
          };
          return {
            ...oldData,
            data: [updatedChat, ...updated],
          };
        }

        // Chat not in recent list — invalidate to refetch
        queryClient.invalidateQueries({ queryKey: recentChatsKey });
        return oldData;
      });
    }),
  );

  // ── chat:typing ──
  unsubscribers.push(
    manager.on("chat:typing", (raw: WsServerMessage) => {
      const payload = raw.payload as WsChatTypingServerPayload;
      dispatch(
        setTyping({
          chatId: payload.chatId,
          userId: payload.userId,
          isTyping: payload.isTyping,
        }),
      );
    }),
  );

  // ── chat:read ──
  unsubscribers.push(
    manager.on("chat:read", (raw: WsServerMessage) => {
      const payload = raw.payload as WsChatReadServerPayload;
      const { chatId, messageId, readAt } = payload;

      const messagesKey = protectedKeys.messages(chatId);
      queryClient.setQueryData<MessagesInfiniteData>(
        messagesKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((m) =>
                m.id === messageId ? { ...m, readAt: new Date(readAt) } : m,
              ),
            })),
          };
        },
      );
    }),
  );

  // ── presence:update ──
  unsubscribers.push(
    manager.on("presence:update", () => {
      // Invalidate contacts and recent chats to refresh presence info
      queryClient.invalidateQueries({
        queryKey: protectedKeys.contacts(),
      });
      queryClient.invalidateQueries({
        queryKey: protectedKeys.recentChats(),
      });
    }),
  );

  // ── notification:new ──
  unsubscribers.push(
    manager.on("notification:new", (raw: WsServerMessage) => {
      const payload = raw.payload as WsNotificationPayload;

      queryClient.setQueryData<NotificationsData>(
        protectedKeys.notifications(),
        (oldData) => {
          if (!oldData) return oldData;
          if (
            oldData.data.some(
              (notification) => notification.id === payload.notification.id,
            )
          ) {
            return oldData;
          }

          return {
            ...oldData,
            data: [payload.notification, ...oldData.data],
          };
        },
      );

      queryClient.setQueryData<UnreadCountData>(
        protectedKeys.notificationsUnreadCount(),
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              unreadCount: oldData.data.unreadCount + 1,
            },
          };
        },
      );

      const toastMessage = notificationToastMessage(payload.notification.type);
      dispatch(
        addEphemeralToast({
          id: payload.notification.id,
          message: toastMessage,
          type: "info",
        }),
      );
      toast(toastMessage);

      queryClient.invalidateQueries({
        queryKey: protectedKeys.notifications(),
        refetchType: "inactive",
      });
      queryClient.invalidateQueries({
        queryKey: protectedKeys.notificationsUnreadCount(),
        refetchType: "inactive",
      });
    }),
  );

  // ── contact:status-changed ──
  unsubscribers.push(
    manager.on("contact:status-changed", () => {
      queryClient.invalidateQueries({
        queryKey: protectedKeys.contacts(),
      });
      queryClient.invalidateQueries({
        queryKey: protectedKeys.recentChats(),
      });
      // Also invalidate both request directions
      queryClient.invalidateQueries({
        queryKey: protectedKeys.contactRequests("incoming"),
      });
      queryClient.invalidateQueries({
        queryKey: protectedKeys.contactRequests("outgoing"),
      });
    }),
  );

  // ── group:member:joined / group:member:left ──
  const handleGroupMemberEvent = (raw: WsServerMessage) => {
    const payload = raw.payload as WsGroupMemberEventPayload;
    queryClient.invalidateQueries({
      queryKey: protectedKeys.groupMembers(payload.chatId),
    });
    queryClient.invalidateQueries({
      queryKey: protectedKeys.groupInfo(payload.chatId),
    });
  };

  unsubscribers.push(manager.on("group:member:joined", handleGroupMemberEvent));
  unsubscribers.push(manager.on("group:member:left", handleGroupMemberEvent));

  // Return cleanup function
  return () => {
    for (const unsub of unsubscribers) {
      unsub();
    }
  };
}
