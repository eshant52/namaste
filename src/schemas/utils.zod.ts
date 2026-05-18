import z from "zod";
import { errorResponseSchema } from "./error.zod";

/**
 * Error Response Wrapper of mint master apis
 * @param schema
 * @returns returns a Zod discriminated union schema
 */
export const errorResponseWrapper = <T extends z.core.$ZodTypeDiscriminable>(
  schema: T[],
) => z.discriminatedUnion("status", [errorResponseSchema, ...schema] as const);

/**
 * Complete Response Wrapper of mint master apis
 * @param data
 * @returns returns a Zod discriminated union schema
 */
export const completeResponseWrapper = <T extends z.core.SomeType>(data: T) =>
  errorResponseWrapper([
    z.object({
      message: z.string(),
      status: z.literal("success"),
      data: data,
    }),
  ]);
