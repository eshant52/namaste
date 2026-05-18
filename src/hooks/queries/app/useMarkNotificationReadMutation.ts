import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      chatApi.markNotificationRead(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.notifications(),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.notificationsUnreadCount(),
      });
    },
  });
};
