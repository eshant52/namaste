import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";

export const useSearchUsersByUsernameQuery = (usernameQuery: string) => {
  return useQuery({
    queryKey: protectedKeys.searchContacts(usernameQuery),
    queryFn: () => chatApi.searchUsersByUsername(usernameQuery),
    select: (response) => response.data,
    enabled: usernameQuery.trim().length > 0,
    staleTime: 1000 * 30,
  });
};
