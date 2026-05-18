import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";

export const useGetRecentChatsQuery = () => {
  return useQuery({
    queryKey: protectedKeys.recentChats(),
    queryFn: chatApi.getRecentChats,
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5,
  });
};
