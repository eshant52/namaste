import { authApi } from "@/api/userAuth";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { protectedKeys } from "../queryKeys";
import { isAxiosError } from "axios";
import type { ErrorResponseData } from "@/schemas/error.zod";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.status === "success") {
        queryClient.invalidateQueries({ queryKey: protectedKeys.info() });

        toast.success("Login successful", {
          description: response.message || "You have successfully logged in",
          duration: 3000,
        });
      } else {
        toast.error("Login failed", {
          description: response.message || "An error occurred during login.",
          duration: 3000,
        });
      }
    },
    onError: (error) => {
      if (isAxiosError<ErrorResponseData>(error)) {
        // handleAxiosError(error);
        const isSessionLimitConflict =
          error.response?.status === 409 &&
          error.response.data?.status === "fail" &&
          error.response.data?.type === "CONFLICT_ERROR" &&
          error.response.data?.diagnostics?.metadata?.errorCode === "VAL_007";

        if (isSessionLimitConflict) {
          return;
        }

        toast.error("Login failed", {
          description:
            error.response?.data.message || "An error occurred during login.",
          duration: 3000,
        });
      }
    },
  });
};
