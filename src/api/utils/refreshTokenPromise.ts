import type { UserRefreshTokenResponseData } from "@/schemas/user/auth.zod";
import { authApi } from "../userAuth";
import type { SuccessResponse } from "@/types/response.types";

// Shared promise to prevent race conditions when multiple requests fail simultaneously
let refreshTokenPromise: Promise<
  SuccessResponse<UserRefreshTokenResponseData>
> | null = null;
/**
 * Get or create a refresh token promise.
 * Ensures only one refresh happens at a time - other 401 requests wait for the same promise.
 * This prevents race conditions when token rotation is enabled on the backend.
 */
export const getRefreshTokenPromise = (): Promise<
  SuccessResponse<UserRefreshTokenResponseData>
> => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = authApi
      .refreshToken()
      .then((response) => {
        // Clear the promise after successful refresh
        refreshTokenPromise = null;
        return response;
      })
      .catch((error) => {
        // Clear the promise on error so retry is possible
        refreshTokenPromise = null;
        throw error;
      });
  }
  return refreshTokenPromise;
};
