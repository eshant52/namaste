import { authApi } from "@/api/userAuth";
import type { ErrorResponseData } from "@/schemas/error.zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();

      toast.success("Logged out", {
        description: "You have been logged out successfully.",
        duration: 3000,
      });
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      toast.error("Logout failed", {
        description:
          error?.response?.data?.message || "An error occurred during logout.",
        duration: 3000,
      });
    },
  });
};
