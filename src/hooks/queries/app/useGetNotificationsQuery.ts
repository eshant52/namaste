import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";

export const useGetNotificationsQuery = () => {
  return useQuery({
    queryKey: protectedKeys.notifications(),
    queryFn: chatApi.getNotifications,
    select: (response) => response.data,
    staleTime: 1000 * 10,
  });
};
