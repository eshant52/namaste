import z from "zod";
import { completeResponseWrapper, errorResponseWrapper } from "../utils.zod.js";
import type { ErrorResponseData } from "../error.zod.js";

// COMMONS

export const userSessionListItemSchema = z.object({
  sessionId: z.string(),
  deviceName: z.string(),
  ip: z.string(),
  loginAt: z.number(),
  lastUsedAt: z.number(),
  daysLeft: z.number().int().nonnegative(),
});

// ============================================================================
// Register
// ============================================================================
export const userRegisterRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .regex(/^[a-zA-Z ]+$/, "Name must contain only letters and spaces")
      .min(3),
    email: z.email(),
    username: z
      .string()
      .min(3)
      .regex(
        /^[a-z0-9_.]+$/,
        "Username can only contain small letters, numbers, and underscores",
      ),
    emailOtp: z.string().length(6, "OTP must be 6 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserRegisterRequestData = z.infer<typeof userRegisterRequestSchema>;

export const userRegisterResponseSchema = completeResponseWrapper(
  z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email(),
    username: z.string().min(3),
    password: z.string().min(6),
  }),
);

export type UserRegisterResponseData = z.infer<
  typeof userRegisterResponseSchema
>;

export const userCheckUsernameRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain small letters, numbers, and underscores",
    ),
});

export type UserCheckUsernameRequestData = z.infer<
  typeof userCheckUsernameRequestSchema
>;

export const userCheckUsernameResponseSchema = completeResponseWrapper(
  z.object({
    available: z.boolean(),
  }),
);

export type UserCheckUsernameResponseData = z.infer<
  typeof userCheckUsernameResponseSchema
>;

export const userRegisterEmailOtpRequestSchema = z.object({
  email: z.email(),
});

export type UserRegisterEmailOtpRequestData = z.infer<
  typeof userRegisterEmailOtpRequestSchema
>;

export const userRegisterEmailOtpResponseSchema = completeResponseWrapper(
  z.object({
    ttlSeconds: z.number().int().positive(),
    devOtp: z.string().length(6).optional(),
  }),
);

export type UserRegisterEmailOtpResponseData = z.infer<
  typeof userRegisterEmailOtpResponseSchema
>;

// ============================================================================
// Login
// ============================================================================

export const userLoginRequestSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserLoginRequestData = z.infer<typeof userLoginRequestSchema>;

const userPublicSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  username: z.string().min(3),
});

export const userLoginConflictResponseSchema = z.object({
  message: z.string(),
  status: z.literal("fail"),
  type: z.literal("CONFLICT_ERROR"),
  data: z.object({
    challengeToken: z.string(),
    sessions: z.array(userSessionListItemSchema),
    maxSessions: z.number().int().positive(),
  }),
  diagnostics: z.object({
    traceId: z.string(),
    spanId: z.string(),
    error: z
      .object({
        name: z.string().optional(),
        cause: z.any().optional(),
      })
      .catchall(z.any()),
    metadata: z
      .object({
        errorCode: z.literal("VAL_007"),
        timestamp: z.string().optional(),
      })
      .optional(),
  }),
}) satisfies z.ZodType<ErrorResponseData>;

export type UserLoginConflictResponseData = z.infer<
  typeof userLoginConflictResponseSchema
>;

// Browser login — refresh token set as HttpOnly cookie, access token in body
export const userLoginResponseSchema = errorResponseWrapper([
  userLoginConflictResponseSchema,
  z.object({
    message: z.string(),
    status: z.literal("success"),
    data: z.object({
      accessToken: z.jwt(),
      user: userPublicSchema,
    }),
  }),
]);

export type UserLoginResponseData = z.infer<typeof userLoginResponseSchema>;

// Mobile login — both tokens returned in body (no cookie)
export const userMobileLoginResponseSchema = completeResponseWrapper(
  z.object({
    accessToken: z.jwt(),
    refreshToken: z.jwt(),
    user: userPublicSchema,
  }),
);

export type UserMobileLoginResponseData = z.infer<
  typeof userMobileLoginResponseSchema
>;

// ============================================================================
// Logout
// ============================================================================

export const userLogoutResponseSchema = completeResponseWrapper(z.null());

export type UserLogoutResponseData = z.infer<typeof userLogoutResponseSchema>;

// ============================================================================
// Refresh Token
// ============================================================================

// Browser — new refresh token goes to cookie, only access token in body
export const userRefreshTokenResponseSchema = completeResponseWrapper(
  z.object({ accessToken: z.jwt() }),
);

export type UserRefreshTokenResponseData = z.infer<
  typeof userRefreshTokenResponseSchema
>;

// Mobile — both tokens returned in body
export const userMobileRefreshTokenResponseSchema = completeResponseWrapper(
  z.object({
    accessToken: z.jwt(),
    refreshToken: z.jwt(),
  }),
);

export type UserMobileRefreshTokenResponseData = z.infer<
  typeof userMobileRefreshTokenResponseSchema
>;

// ============================================================================
// Session Limit Flow
// ============================================================================

export const userSessionLimitRevokeRequestSchema = z.object({
  challengeToken: z.string(),
  sessionId: z.string(),
});

export type UserSessionLimitRevokeRequestData = z.infer<
  typeof userSessionLimitRevokeRequestSchema
>;

export const userSessionLimitRevokeResponseSchema = completeResponseWrapper(
  z.object({
    sessions: z.array(userSessionListItemSchema),
    canContinue: z.boolean(),
    maxSessions: z.number().int().positive(),
  }),
);

export type UserSessionLimitRevokeResponseData = z.infer<
  typeof userSessionLimitRevokeResponseSchema
>;

export const userSessionLimitContinueRequestSchema = z.object({
  challengeToken: z.string(),
});

export type UserSessionLimitContinueRequestData = z.infer<
  typeof userSessionLimitContinueRequestSchema
>;
