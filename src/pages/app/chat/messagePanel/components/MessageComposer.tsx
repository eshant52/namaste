import { Paperclip, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useRef, useEffect, type FormEvent } from "react";
import { useParams } from "react-router";
import { useWebSocket } from "@/provider/webSocketContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  addToOutbox,
  updateOutboxStatus,
} from "@/features/chatRealtimeSlice";
import { createId } from "@paralleldrive/cuid2";
import type { WsChatSendPayload } from "@/schemas/websocket.zod";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { protectedKeys } from "@/hooks/queries/queryKeys";
import { useGetUserInfo } from "@/hooks/queries/app";
import type { GetChatResponseData } from "@/schemas/user/protected.zod";
import type { SuccessResponse } from "@/types/response.types";

type MessagesInfiniteData = InfiniteData<
  SuccessResponse<GetChatResponseData>,
  Date | undefined
>;

export const MessageComposer = () => {
  const [text, setText] = useState("");
  const params = useParams();
  const chatId = params.chatId;
  const { manager } = useWebSocket();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { data: currentUser } = useGetUserInfo();
  const isConnected = useAppSelector(
    (state) => state.wsConnection.status === "connected",
  );

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingTimeRef = useRef<number>(0);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleTyping = (val: string) => {
    setText(val);

    if (!chatId || !manager || !isConnected) return;

    const now = Date.now();
    // Throttle typing events to once every 2 seconds
    if (now - lastTypingTimeRef.current > 2000) {
      manager.send("chat:typing", { chatId, isTyping: true });
      lastTypingTimeRef.current = now;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (manager && isConnected) {
        manager.send("chat:typing", { chatId, isTyping: false });
      }
    }, 2000);
  };

  const handleSend = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();

      const trimmed = text.trim();
      if (!trimmed || !chatId || !manager) return;

      const clientMessageId = createId();

      // Add to optimistic outbox
      dispatch(
        addToOutbox({
          clientMessageId,
          chatId,
          message: trimmed,
          status: "pending",
          createdAt: Date.now(),
        }),
      );

      queryClient.setQueryData<MessagesInfiniteData>(
        protectedKeys.messages(chatId),
        (oldData) => {
          if (!oldData?.pages[0] || !currentUser?.data.id) return oldData;

          return {
            ...oldData,
            pages: [
              {
                ...oldData.pages[0],
                data: [
                  {
                    id: clientMessageId,
                    senderId: currentUser.data.id,
                    message: trimmed,
                    replyToId: null,
                    deliveredAt: null,
                    readAt: null,
                    createdAt: new Date(),
                    clientMessageId,
                    isOptimistic: true,
                  } as GetChatResponseData["data"][number] & {
                    clientMessageId: string;
                    isOptimistic: boolean;
                  },
                  ...oldData.pages[0].data,
                ],
              },
              ...oldData.pages.slice(1),
            ],
          };
        },
      );

      // Send via WebSocket
      const payload: WsChatSendPayload = {
        chatId,
        message: trimmed,
        clientMessageId,
      };
      const correlationId = manager.send("chat:send", payload);
      if (!correlationId) {
        dispatch(updateOutboxStatus({ clientMessageId, status: "failed" }));
      } else {
        window.setTimeout(() => {
          dispatch(updateOutboxStatus({ clientMessageId, status: "failed" }));
        }, 10000);
      }

      setText("");

      // Stop typing immediately
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      manager.send("chat:typing", { chatId, isTyping: false });
    },
    [text, chatId, manager, dispatch, queryClient, currentUser],
  );

  return (
    <footer className="border-t bg-background p-4">
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 rounded-full bg-muted/50 py-2 pl-4 pr-2 ring-1 ring-border transition-all focus-within:ring-2 focus-within:ring-primary"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-full hover:bg-background"
          aria-label="Attach file"
        >
          <Paperclip data-icon="inline-start" />
        </Button>
        <Input
          autoComplete="off"
          placeholder="Write a message..."
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          className="h-9 flex-1 border-0 bg-transparent px-2 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          size="icon"
          className="size-9 shrink-0 rounded-full shadow-md"
          aria-label="Send message"
          disabled={!text.trim() || !isConnected}
        >
          <SendHorizontal data-icon="inline-start" />
        </Button>
      </form>
    </footer>
  );
};
