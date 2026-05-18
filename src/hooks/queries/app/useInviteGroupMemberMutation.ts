import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import type {
  CreateGroupInviteRequestData,
  GroupPathParamsData,
} from "@/schemas/user/protected.zod";
import { protectedKeys } from "../queryKeys";

export const useInviteGroupMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      inviteeId,
    }: {
      groupId: GroupPathParamsData["groupId"];
      inviteeId: CreateGroupInviteRequestData["inviteeId"];
    }) => chatApi.inviteGroupMember(groupId, inviteeId),
    onSuccess: (_response, variables) => {
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.groupInfo(variables.groupId),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.groupMembers(variables.groupId),
      });
    },
  });
};
