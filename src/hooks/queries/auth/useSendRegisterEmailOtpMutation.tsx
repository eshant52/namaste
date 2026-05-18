import { authApi } from "@/api/userAuth";
import type { ErrorResponseData } from "@/schemas/error.zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useSendRegisterEmailOtpMutation = () => {
  return useMutation({
    mutationFn: authApi.sendRegisterEmailOtp,
    onSuccess: (response) => {
      if (response.status === "success") {
        toast.success("OTP sent to your email", {
          description:
            response.data.devOtp && import.meta.env.DEV
              ? `Dev OTP: ${response.data.devOtp}`
              : `Valid for ${Math.floor(response.data.ttlSeconds / 60)} minutes`,
        });
      }
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      toast.error(error.response?.data.message || "Failed to send OTP");
    },
  });
};
