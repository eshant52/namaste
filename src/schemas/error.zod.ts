import z from "zod";

/**
 * Centralized Error Schema for Abhishek dosi trading APIs
 */
export const errorResponseSchema = z.object({
  message: z.string(),
  status: z.enum(["error", "fail"]),
  type: z.enum([
    // Client Errors
    "VALIDATION_ERROR",
    "AUTHENTICATION_ERROR",
    "AUTHORIZATION_ERROR",
    "NOT_FOUND_ERROR",
    "GONE_ERROR",
    "CONFLICT_ERROR",
    "BAD_REQUEST_ERROR",

    // Server Errors
    "INTERNAL_SERVER_ERROR",
    "DATABASE_ERROR",
    "NETWORK_ERROR",
    "SERVICE_UNAVAILABLE_ERROR",

    // Business Logic Errors
    "BUSINESS_LOGIC_ERROR",
    "PAYMENT_ERROR",
    "SUBSCRIPTION_ERROR",

    // External Service Errors
    "EXTERNAL_API_ERROR",
    "THIRD_PARTY_ERROR",

    // File Upload Errors
    "FILE_UPLOAD_ERROR",

    // Legacy types for backward compatibility
    "CONFLICT",
    "ACCESS_DENIED",
    "NOT_FOUND",
    "ZOD_VALIDATION",
    "INVALID",
    "UNKNOWN",
    "DATABASE",
    "NETWORK",
    "AUTH",
    "FILE_UPLOAD",
  ]),
  data: z.any().optional(),
  diagnostics: z.object({
    traceId: z.string(),
    spanId: z.string(),
    validationErrors: z.record(z.string(), z.array(z.string())).optional(),
    error: z
      .object({
        name: z.string().optional(),
        cause: z.any().optional(),
      })
      .catchall(z.any()),
    metadata: z
      .object({
        errorCode: z.string().optional(),
        timestamp: z.string().optional(),
      })
      .optional(),
  }),
});

export type ErrorResponseData = z.infer<typeof errorResponseSchema>;
