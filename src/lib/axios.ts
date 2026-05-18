import type { ErrorResponseData } from "@/schemas/error.zod";
import type { AxiosError } from "axios";

export const isSessionLimitConflict = (
  error: AxiosError<ErrorResponseData>,
): boolean => {
  const responseData = error.response?.data;
  return (
    error.response?.status === 409 &&
    responseData?.status === "fail" &&
    responseData?.type === "CONFLICT_ERROR" &&
    responseData?.diagnostics.metadata?.errorCode === "VAL_007"
  );
};
