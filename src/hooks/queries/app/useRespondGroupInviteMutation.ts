import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import type {
  GroupInvitePathParamsData,
  RespondGroupInviteBodyData,
} from "@/schemas/user/protected.zod";
import { protectedKeys } from "../queryKeys";

export const useRespondGroupInviteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      inviteId,
      action,
    }: {
      inviteId: GroupInvitePathParamsData["inviteId"];
      action: RespondGroupInviteBodyData["action"];
    }) => chatApi.respondGroupInvite(inviteId, action),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.notifications(),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.notificationsUnreadCount(),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.recentChats(),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.groups(),
      });
    },
  });
};
