import { authApi } from "@/api/userAuth";
import type { UserSessionLimitContinueRequestData } from "@/schemas/user/auth.zod";
import type { ErrorResponseData } from "@/schemas/error.zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useSessionLimitContinueMutation = () => {
  return useMutation({
    mutationFn: authApi.sessionLimitContinue,
    onSuccess: (response) => {
      if (response.status === "success") {
        toast.success("Signed in successfully.");
      } else {
        toast.error("Session limit continuation failed", {
          description:
            response.message ||
            "An error occurred during session limit continuation.",
          duration: 3000,
        });
      }
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      const msg =
        error.response?.data.message || "Session limit continuation failed";
      toast.error(msg);
    },
  });
};

export type SessionLimitContinueVariables = UserSessionLimitContinueRequestData;
