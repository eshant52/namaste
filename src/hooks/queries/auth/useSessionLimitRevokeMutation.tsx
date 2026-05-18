import { authApi } from "@/api/userAuth";
import type { UserSessionLimitRevokeRequestData } from "@/schemas/user/auth.zod";
import type { ErrorResponseData } from "@/schemas/error.zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { protectedKeys } from "../queryKeys";

export const useSessionLimitRevokeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.sessionLimitRevoke,
    onSuccess: (response) => {
      if (response.status === "success") {
        toast.success("Session revoked successfully.");
        queryClient.invalidateQueries({ queryKey: protectedKeys.info() });
      } else {
        toast.error("Session limit revocation failed", {
          description:
            response.message ||
            "An error occurred during session limit revocation.",
          duration: 3000,
        });
      }
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      const msg =
        error.response?.data.message || "Session limit revocation failed";
      toast.error(msg);
    },
  });
};

export type SessionLimitRevokeVariables = UserSessionLimitRevokeRequestData;
