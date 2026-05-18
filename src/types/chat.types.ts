import type {
  RecentContactChatsResponseData,
  SingleMessageResponseData,
} from "@/schemas/user/protected.zod";
import type { SuccessResponse } from "./response.types";

export type ChatMessage = SingleMessageResponseData;
export type RecentChatItem =
  SuccessResponse<RecentContactChatsResponseData>["data"][number];
