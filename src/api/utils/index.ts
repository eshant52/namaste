import { getRefreshTokenPromise } from "./refreshTokenPromise";
import { getAuthToken, removeAuthToken } from "@/lib/localStorage/auth";
import { isTokenValid } from "@/lib/jwt";

/**
 * Attempts to refresh the access token using the refresh token (HTTP-only cookie)
 * @returns Promise<boolean> - true if refresh was successful
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const response = await getRefreshTokenPromise();
    return response.status === "success";
  } catch {
    return false;
  }
};

/**
 * Validates current auth state and attempts token refresh if needed
 * @returns Promise<boolean> - true if user is authenticated (token valid or refresh successful)
 */
export const validateAuthState = async (): Promise<boolean> => {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  // If token is valid, user is authenticated
  if (isTokenValid(token)) {
    return true;
  }

  // If token is expired, try to refresh it using HTTP-only cookie
  return await refreshAccessToken();
};

/**
 * Clears auth data and redirects to login page
 * Use this when user needs to be logged out (e.g., refresh token expired)
 */
export const redirectToLogin = (): void => {
  window.location.href = "/auth/login";
};

/**
 * Clear data after logout
 */
export const clearAuthData = (): void => {
  removeAuthToken();
};
