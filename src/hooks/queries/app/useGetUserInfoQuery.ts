import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";

export const useGetUserInfoQuery = () => {
  return useQuery({
    queryKey: protectedKeys.info(),
    queryFn: chatApi.getUserInfo,
    staleTime: 1000 * 60 * 60,
  });
};
