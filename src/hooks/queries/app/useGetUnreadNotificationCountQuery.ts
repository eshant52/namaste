import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";

export const useGetUnreadNotificationCountQuery = () => {
  return useQuery({
    queryKey: protectedKeys.notificationsUnreadCount(),
    queryFn: chatApi.getUnreadNotificationCount,
    select: (response) => response.data.unreadCount,
    staleTime: 1000 * 10,
  });
};
