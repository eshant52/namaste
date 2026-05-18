export type SuccessResponse<T> = Extract<T, { status: "success" }>;
export type ErrorResponse<T> = Extract<T, { status: "error" }>;
export type FailResponse<T> = Extract<T, { status: "fail" }>;



