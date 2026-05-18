import { useInfiniteQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";

const PAGE_SIZE = 20;

export const useGetChatMessagesQuery = (chatId: string | null) => {
  return useInfiniteQuery({
    queryKey: chatId ? protectedKeys.messages(chatId) : [],
    queryFn: ({ pageParam }) =>
      chatApi.getChatMessages(chatId!, pageParam),
    initialPageParam: undefined as Date | undefined,
    getNextPageParam: (lastPage) => {
      // Backend returns messages in desc(createdAt) order, newest first.
      // The cursor for the next (older) page is the createdAt of the
      // OLDEST message in the current page.
      const messages = lastPage.data;
      if (messages.length < PAGE_SIZE) return undefined; // no more pages
      return new Date(messages[messages.length - 1].createdAt);
    },
    enabled: !!chatId,
    staleTime: 1000 * 60 * 5,
  });
};
