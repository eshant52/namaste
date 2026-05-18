import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";
import type {
  UpdateContactRequestBodyData,
  UpdateContactRequestPathParamsData,
} from "@/schemas/user/protected.zod";

export const useUpdateContactRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      action,
    }: UpdateContactRequestPathParamsData & UpdateContactRequestBodyData) =>
      chatApi.updateContactRequest(requestId, action),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.contactRequests("incoming"),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.contactRequests("outgoing"),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.contacts(),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.recentChats(),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.notifications(),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.notificationsUnreadCount(),
      });
    },
  });
};
