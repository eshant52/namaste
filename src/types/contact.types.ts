import type { SuccessResponse } from "./response.types";
import type {
  SearchUserResponseData,
  ContactsResponseData,
  ContactRequestListResponseData,
} from "@/schemas/user/protected.zod";

export type SearchContact =
  SuccessResponse<SearchUserResponseData>["data"][number];
export type Contact = SuccessResponse<ContactsResponseData>["data"][number];
export type ContactRequest =
  SuccessResponse<ContactRequestListResponseData>["data"][number];
