import axios, {
  isAxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAuthToken, setAuthToken } from "@/lib/localStorage/auth";
import { AUTH_ROUTE, PROTECTED_ROUTE_PREFIX } from "./route-path";
import type {
  UserLoginResponseData,
  UserRefreshTokenResponseData,
} from "@/schemas/user/auth.zod";
import type { ErrorResponseData } from "@/schemas/error.zod";
import { getRefreshTokenPromise } from "./utils/refreshTokenPromise";
import { clearAuthData, redirectToLogin } from "./utils";

// Extend Axios request config to include _retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

const needsAccessToken = (url: string | undefined): boolean => {
  return (
    url?.startsWith(PROTECTED_ROUTE_PREFIX) ||
    url?.endsWith(AUTH_ROUTE.wsTicket) ||
    false
  );
};

// ============ AXIOS CLIENT ============

const defaultConfig: AxiosRequestConfig = {
  baseURL: SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-platform": "web",
  },
} as const;

export const apiClient = axios.create(defaultConfig);

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    if (!needsAccessToken(config.url)) {
      return config;
    }

    // Add Authorization header if token exists
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    const url = response.config.url || "";

    if (url.endsWith(AUTH_ROUTE.login)) {
      const data = (response.data as UserLoginResponseData).data;
      const token = data.accessToken;
      if (token) {
        setAuthToken(token);
      }
    } else if (url.endsWith(AUTH_ROUTE.logout)) {
      clearAuthData();
      redirectToLogin();
    } else if (url.endsWith(AUTH_ROUTE.refresh)) {
      const token = (response.data as UserRefreshTokenResponseData).data
        .accessToken;
      if (token) {
        setAuthToken(token);
      }
    } else if (url.endsWith(AUTH_ROUTE.sessionLimitContinue)) {
      const token = (response.data as UserLoginResponseData).data.accessToken;
      if (token) {
        setAuthToken(token);
      }
    }

    return response;
  },
  async (error) => {
    if (isAxiosError<ErrorResponseData>(error)) {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      // Handle 401 errors (unauthorized)
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        needsAccessToken(originalRequest.url)
      ) {
        originalRequest._retry = true;

        try {
          // Use shared refresh promise to prevent race conditions
          const response = await getRefreshTokenPromise();

          if (response.status === "success") {
            // Retry the original request with new token
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, redirect to login page
          clearAuthData();
          redirectToLogin();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);
