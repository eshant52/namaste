import { apiClient } from "./client";
import {
  type UserLoginRequestData,
  type UserLoginResponseData,
  type UserCheckUsernameRequestData,
  type UserCheckUsernameResponseData,
  type UserLogoutResponseData,
  type UserRefreshTokenResponseData,
  type UserRegisterEmailOtpRequestData,
  type UserRegisterEmailOtpResponseData,
  type UserRegisterRequestData,
  type UserRegisterResponseData,
  type UserSessionLimitContinueRequestData,
  type UserSessionLimitRevokeRequestData,
  type UserSessionLimitRevokeResponseData,
} from "@/schemas/user/auth.zod";
import { AUTH_ROUTE } from "./route-path";
import type { SuccessResponse } from "@/types/response.types";

export const authApi = {
  login: async (data: UserLoginRequestData) => {
    const response = await apiClient.post<
      SuccessResponse<UserLoginResponseData>
    >(AUTH_ROUTE.login, data);
    return response.data;
  },

  register: async (data: UserRegisterRequestData) => {
    const response = await apiClient.post<
      SuccessResponse<UserRegisterResponseData>
    >(AUTH_ROUTE.register, data);
    return response.data;
  },

  checkUsername: async (data: UserCheckUsernameRequestData) => {
    const response = await apiClient.post<
      SuccessResponse<UserCheckUsernameResponseData>
    >(AUTH_ROUTE.checkUsername, data);
    return response.data;
  },

  sendRegisterEmailOtp: async (data: UserRegisterEmailOtpRequestData) => {
    const response = await apiClient.post<
      SuccessResponse<UserRegisterEmailOtpResponseData>
    >(AUTH_ROUTE.registerEmailOtp, data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post<
      SuccessResponse<UserLogoutResponseData>
    >(AUTH_ROUTE.logout);
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post<
      SuccessResponse<UserRefreshTokenResponseData>
    >(AUTH_ROUTE.refresh);
    return response.data;
  },

  sessionLimitContinue: async (data: UserSessionLimitContinueRequestData) => {
    const response = await apiClient.post<
      SuccessResponse<UserLoginResponseData>
    >(AUTH_ROUTE.sessionLimitContinue, data);
    return response.data;
  },

  sessionLimitRevoke: async (data: UserSessionLimitRevokeRequestData) => {
    const response = await apiClient.post<
      SuccessResponse<UserSessionLimitRevokeResponseData>
    >(AUTH_ROUTE.sessionLimitRevoke, data);
    return response.data;
  },

  /** Get a short-lived opaque ticket for WS authentication */
  getWsTicket: async () => {
    const response = await apiClient.post<{
      status: "success";
      message: string;
      data: { ticket: string };
    }>(AUTH_ROUTE.wsTicket);
    return response.data;
  },
};
