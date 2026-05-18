import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";
import type { ContactRequestDirectionData } from "@/schemas/user/protected.zod";

export const useGetContactRequestsQuery = (
  direction: ContactRequestDirectionData["direction"],
) => {
  return useQuery({
    queryKey: protectedKeys.contactRequests(direction),
    queryFn: () => chatApi.getContactRequests(direction),
    select: (response) => response.data,
    staleTime: 1000 * 10,
  });
};
