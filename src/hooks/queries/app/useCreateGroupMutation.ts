import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import type { CreateGroupRequestData } from "@/schemas/user/protected.zod";
import { protectedKeys } from "../queryKeys";

export const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGroupRequestData) =>
      chatApi.createGroup(payload),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.recentChats(),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.groupInfo(response.data.groupId),
      });
      void queryClient.invalidateQueries({
        queryKey: protectedKeys.groupMembers(response.data.groupId),
      });
    },
  });
};
