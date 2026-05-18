import { authApi } from "@/api/userAuth";
import type { ErrorResponseData } from "@/schemas/error.zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export const useRegisterMutation = ({
  showToast = false,
}: {
  showToast?: boolean;
}) => {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      if (showToast) {
        if (response.status === "success") {
          toast.success("Registration successful! Please login.");
        } else {
          toast.error("Registration failed", {
            description:
              response.message || "An error occurred during registration.",
            duration: 3000,
          });
        }
      }
    },
    onError: (error: unknown) => {
      if (showToast) {
        if (isAxiosError<ErrorResponseData>(error)) {
          const msg = error.response?.data.message || "Registration failed";
          toast.error(msg, {
            description: error.response?.data.type || error.message,
            duration: 3000,
          });
        } else if (error instanceof Error) {
          toast.error("Registration failed", {
            description:
              error.message || "An error occurred during registration.",
            duration: 3000,
          });
        } else {
          toast.error("Registration failed", {
            description: "An unknown error occurred during registration.",
            duration: 3000,
          });
        }
      }
    },
  });
};
