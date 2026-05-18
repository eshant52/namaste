import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";

export const useSendContactRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => chatApi.sendContactRequest(contactId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.notifications(),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.notificationsUnreadCount(),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.contactRequests("outgoing"),
      });
    },
  });
};
