import { useCallback, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowDown, Loader2 } from "lucide-react";
import type { ChatMessage } from "@/types/chat.types";
import { MessageBubble } from "./MessageBubble";

type MessageTimelineProps = {
  messages: ChatMessage[] | undefined;
  isLoading: boolean;
  currentUserId: string | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};

const ESTIMATED_MESSAGE_HEIGHT = 72;

export const MessageTimeline = ({
  messages,
  isLoading,
  currentUserId,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: MessageTimelineProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const lastMessageIdRef = useRef<string | null>(null);
  const nearBottomRef = useRef(true);
  const [showNewMessagesButton, setShowNewMessagesButton] = useState(false);

  // Total items = load-more button (if applicable) + messages
  const itemCount = (messages?.length ?? 0) + (hasNextPage ? 1 : 0);

  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_MESSAGE_HEIGHT,
    overscan: 10,
  });

  const scrollToBottom = useCallback(() => {
    virtualizer.scrollToIndex(Math.max(itemCount - 1, 0), { align: "end" });
    setShowNewMessagesButton(false);
  }, [itemCount, virtualizer]);

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;

    nearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    if (nearBottomRef.current) {
      setShowNewMessagesButton(false);
    }

    if (el.scrollTop < 120 && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  // Auto-scroll to bottom when new messages arrive at the tail.
  useEffect(() => {
    if (!messages) return;
    const newLength = messages.length;
    const latestMessageId = messages.at(-1)?.id ?? null;
    const hasNewTailMessage =
      latestMessageId !== null &&
      lastMessageIdRef.current !== null &&
      latestMessageId !== lastMessageIdRef.current;

    if (newLength > prevLengthRef.current && hasNewTailMessage) {
      if (nearBottomRef.current) {
        scrollToBottom();
      } else {
        setShowNewMessagesButton(true);
      }
    }

    prevLengthRef.current = newLength;
    lastMessageIdRef.current = latestMessageId;
  }, [messages, scrollToBottom]);

  // On initial load, scroll to bottom
  useEffect(() => {
    if (messages && messages.length > 0 && prevLengthRef.current === 0) {
      // Short delay to let virtualizer measure
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [messages, scrollToBottom]);

  const renderItem = useCallback(
    (index: number) => {
      // First item is the "load more" button when hasNextPage
      if (hasNextPage && index === 0) {
        return (
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoadMore}
              disabled={isFetchingNextPage}
              className="text-xs text-muted-foreground"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Load older messages"
              )}
            </Button>
          </div>
        );
      }

      const messageIndex = hasNextPage ? index - 1 : index;
      const message = messages?.[messageIndex];

      if (!message) return null;

      return (
        <MessageBubble
          key={message.id}
          message={message.message}
          createdAt={message.createdAt}
          isMine={message.senderId === currentUserId}
        />
      );
    },
    [messages, currentUserId, hasNextPage, isFetchingNextPage, onLoadMore],
  );

  if (isLoading) {
    return (
      <div className="flex h-full flex-col justify-end gap-6 p-6">
        <Skeleton className="h-16 w-75 rounded-2xl rounded-tl-sm" />
        <Skeleton className="ml-auto h-16 w-62.5 rounded-2xl rounded-tr-sm" />
        <Skeleton className="h-16 w-60 rounded-2xl rounded-tl-sm" />
        <Skeleton className="ml-auto h-16 w-50 rounded-2xl rounded-tr-sm" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Start of conversation</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="relative h-full overflow-y-auto"
      onScroll={handleScroll}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
            className="px-6 py-1"
          >
            {renderItem(virtualItem.index)}
          </div>
        ))}
      </div>
      {showNewMessagesButton ? (
        <Button
          type="button"
          size="sm"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 shadow-md"
          onClick={scrollToBottom}
        >
          <ArrowDown data-icon="inline-start" />
          New messages
        </Button>
      ) : null}
    </div>
  );
};
