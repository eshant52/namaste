import { authApi } from "@/api/userAuth";
import { useMutation } from "@tanstack/react-query";

export const useCheckUsernameMutation = () => {
  return useMutation({
    mutationFn: authApi.checkUsername,
  });
};
