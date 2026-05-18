import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import type { GroupPathParamsData } from "@/schemas/user/protected.zod";
import { protectedKeys } from "../queryKeys";

export const useLeaveGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: GroupPathParamsData["groupId"]) =>
      chatApi.leaveGroup(groupId),
    onSuccess: (_response, groupId) => {
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.recentChats(),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.groupInfo(groupId),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.groupMembers(groupId),
      });
    },
  });
};
