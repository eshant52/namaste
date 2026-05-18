import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";

export const useGetContactsQuery = (includeArchived = false) => {
  return useQuery({
    queryKey: protectedKeys.contacts(includeArchived),
    queryFn: () => chatApi.getContacts(includeArchived),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 60,
  });
};
