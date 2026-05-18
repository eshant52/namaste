import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";

export const useGetChatByIdQuery = (chatId: string | null) => {
  return useQuery({
    queryKey: chatId ? protectedKeys.chatById(chatId) : [],
    queryFn: () => chatApi.getChatById(chatId!),
    select: (response) => response.data,
    enabled: !!chatId,
    staleTime: 1000 * 60 * 5,
  });
};
