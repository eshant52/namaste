import {
  useCallback,
  useEffect,
  useRef,
} from "react";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { WebSocketManager } from "@/services/websocket/WebSocketManager";
import { registerQueryCacheSync } from "@/services/websocket/queryCacheSyncModule";
import { useAppDispatch } from "@/hooks/useRedux";
import { setConnectionStatus } from "@/features/wsConnectionSlice";
import { authApi } from "@/api/userAuth";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "@/hooks/queries/queryKeys";
import type {
  GetChatResponseData,
  RecentContactChatsResponseData,
} from "@/schemas/user/protected.zod";
import type { SuccessResponse } from "@/types/response.types";
import { WebSocketContext } from "./webSocketContext";

const WS_BASE_URL =
  import.meta.env.VITE_WS_URL ?? "ws://localhost:3000";

type MessagesInfiniteData = InfiniteData<
  SuccessResponse<GetChatResponseData>,
  Date | undefined
>;

type RecentChatsData = SuccessResponse<RecentContactChatsResponseData>;

// ── Provider ──

/**
 * Mounts inside AppLayout (authenticated zone only).
 * Creates the WebSocketManager, connects using a ticket,
 * registers query cache sync, and handles reconnection.
 */
export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const managerRef = useRef<WebSocketManager | null>(null);
  const cleanupSyncRef = useRef<(() => void) | null>(null);
  const reconnectingRef = useRef(false);
  const previousStatusRef = useRef(managerRef.current?.connectionStatus);

  // Create manager once
  if (!managerRef.current) {
    managerRef.current = new WebSocketManager({
      baseUrl: WS_BASE_URL,
    });
  }

  const manager = managerRef.current;

  // Fetch ticket and connect
  const connectWithTicket = useCallback(async () => {
    if (reconnectingRef.current) return;
    reconnectingRef.current = true;

    try {
      const response = await authApi.getWsTicket();
      const ticket = response.data.ticket;
      manager.forceReconnect(ticket);
    } catch (err) {
      console.error("[WS Provider] Failed to get WS ticket:", err);
      dispatch(setConnectionStatus("disconnected"));
    } finally {
      reconnectingRef.current = false;
    }
  }, [manager, dispatch]);

  const recoverMessageGaps = useCallback(async () => {
    const recentChats = queryClient.getQueryData<RecentChatsData>(
      protectedKeys.recentChats(),
    );

    if (!recentChats?.data.length) {
      queryClient.invalidateQueries({
        queryKey: protectedKeys.notifications(),
      });
      queryClient.invalidateQueries({
        queryKey: protectedKeys.notificationsUnreadCount(),
      });
      return;
    }

    await Promise.allSettled(
      recentChats.data.map(async (chat) => {
        const messagesKey = protectedKeys.messages(chat.chatId);
        const cached =
          queryClient.getQueryData<MessagesInfiniteData>(messagesKey);
        const latestMessage = cached?.pages[0]?.data[0];

        if (!latestMessage) return;

        const gapResponse = await chatApi.getChatMessages(
          chat.chatId,
          undefined,
          new Date(latestMessage.createdAt),
        );

        if (gapResponse.data.length === 0) return;

        queryClient.setQueryData<MessagesInfiniteData>(messagesKey, (oldData) => {
          if (!oldData) return oldData;

          const existingIds = new Set(
            oldData.pages.flatMap((page) => page.data.map((message) => message.id)),
          );
          const newerMessages = [...gapResponse.data]
            .filter((message) => !existingIds.has(message.id))
            .reverse();

          if (newerMessages.length === 0) return oldData;

          return {
            ...oldData,
            pages: [
              {
                ...oldData.pages[0],
                data: [...newerMessages, ...oldData.pages[0].data],
              },
              ...oldData.pages.slice(1),
            ],
          };
        });
      }),
    );

    queryClient.invalidateQueries({
      queryKey: protectedKeys.notifications(),
    });
    queryClient.invalidateQueries({
      queryKey: protectedKeys.notificationsUnreadCount(),
    });
  }, [queryClient]);

  useEffect(() => {
    // Register query cache sync module
    cleanupSyncRef.current = registerQueryCacheSync(
      manager,
      queryClient,
      dispatch,
    );

    // Sync connection status to Redux
    const unsubStatus = manager.onStatusChange((status) => {
      const previousStatus = previousStatusRef.current;
      dispatch(setConnectionStatus(status));

      if (
        status === "connected" &&
        (previousStatus === "reconnecting" || previousStatus === "disconnected")
      ) {
        recoverMessageGaps();
      }

      previousStatusRef.current = status;
    });

    const unsubReconnect = manager.onReconnectAttempt(connectWithTicket);

    // Initial connect
    connectWithTicket();

    return () => {
      unsubStatus();
      unsubReconnect();
      cleanupSyncRef.current?.();
      manager.disconnect();
    };
  }, [manager, queryClient, dispatch, connectWithTicket, recoverMessageGaps]);

  return (
    <WebSocketContext.Provider value={{ manager }}>
      {children}
    </WebSocketContext.Provider>
  );
}
