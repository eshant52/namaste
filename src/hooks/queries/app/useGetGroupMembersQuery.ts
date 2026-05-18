import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import type { GroupPathParamsData } from "@/schemas/user/protected.zod";
import { protectedKeys } from "../queryKeys";

export const useGetGroupMembersQuery = (
  groupId: GroupPathParamsData["groupId"] | null,
) => {
  return useQuery({
    queryKey: groupId ? protectedKeys.groupMembers(groupId) : [],
    queryFn: () => chatApi.getGroupMembers(groupId!),
    select: (response) => response.data,
    enabled: !!groupId,
    staleTime: 1000 * 30,
  });
};
