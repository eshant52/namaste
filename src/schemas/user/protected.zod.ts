import z from "zod";
import { completeResponseWrapper } from "../utils.zod";

// =========================================================
// COMMON SCHEMAS
// =========================================================

const contactDetailsSchema = z.object({
  id: z.uuidv7(),
  username: z.string(),
  name: z.string(),
  email: z.email(),
  dp: z.url().nullable(),
  lastSeen: z.date().nullable(),
});
export type ContactDetailsData = z.infer<typeof contactDetailsSchema>;

const groupRoleSchema = z.enum(["owner", "admin", "member"]);
export type GroupRoleData = z.infer<typeof groupRoleSchema>;

const groupMemberUserSchema = z.object({
  id: z.uuidv7(),
  username: z.string(),
  name: z.string(),
  email: z.email(),
  dp: z.url().nullable(),
});

const groupMemberSchema = z.object({
  user: groupMemberUserSchema,
  role: groupRoleSchema,
  joinedAt: z.coerce.date(),
  leftAt: z.coerce.date().nullable(),
  isActive: z.boolean(),
});

const groupSummarySchema = z.object({
  id: z.uuidv7(),
  name: z.string(),
  avatarUrl: z.url().nullable(),
  memberCount: z.number().int().nonnegative(),
  myRole: groupRoleSchema,
});

const recentDmChatItemSchema = z.object({
  chatType: z.literal("dm"),
  chatId: z.uuidv7(),
  recentChatAt: z.coerce.date(),
  recentText: z.string().optional(),
  contact: contactDetailsSchema,
});

const recentGroupChatItemSchema = z.object({
  chatType: z.literal("group"),
  chatId: z.uuidv7(),
  recentChatAt: z.coerce.date(),
  recentText: z.string().optional(),
  group: z.object({
    name: z.string(),
    avatarUrl: z.url().nullable(),
    memberCount: z.number().int().nonnegative(),
  }),
});

const chatSummaryItemSchema = z.discriminatedUnion("chatType", [
  recentDmChatItemSchema,
  recentGroupChatItemSchema,
]);

export const singleMessageResponseSchema = z.object({
  id: z.uuidv7(),
  message: z.string(),
  senderId: z.uuidv7(),
  replyToId: z.uuidv7().nullable(),
  deliveredAt: z.coerce.date().nullable(),
  readAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
});
export type SingleMessageResponseData = z.infer<
  typeof singleMessageResponseSchema
>;

// =========================================================
// API SPECIFIC SCHEMAS
// =========================================================

// =========================================================

// GET /user/me Response
export const userResponseSchema = completeResponseWrapper(
  z.object({
    id: z.uuidv7("id is invalid"),
    username: z.string("username is invalid"),
    name: z.string(),
    email: z.email(),
    dp: z.url().nullable(),
  }),
);
export type UserResponseData = z.infer<typeof userResponseSchema>;

// =========================================================

// GET /contacts/:id Response
export const contactResponseSchema = completeResponseWrapper(
  z.object({
    id: z.uuidv7(),
    chat: z.object({
      chatId: z.uuidv7().nullable(),
    }),
    archived: z.boolean(),
    blocked: z.boolean(),
    contact: contactDetailsSchema,
  }),
);
export type ContactResponseData = z.infer<typeof contactResponseSchema>;

// =========================================================

// GET /contacts Request
export const contactsRequestQueryParamsSchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(20),
  cursor: z.uuidv7().nullish(),
  includeArchived: z.coerce.boolean().default(false),
});
export type ContactsRequestQueryParamsData = z.infer<
  typeof contactsRequestQueryParamsSchema
>;

// GET /contacts Response
export const contactsResponseSchema = completeResponseWrapper(
  z.array(
    z.object({
      id: z.uuidv7(),
      chat: z.object({
        chatId: z.uuidv7().nullable(),
      }),
      archived: z.boolean(),
      blocked: z.boolean(),
      contact: contactDetailsSchema,
    }),
  ),
);
export type ContactsResponseData = z.infer<typeof contactsResponseSchema>;

// =========================================================

// GET /contacts/search Request
export const searchUsernameQueryParamsSchema = z.object({
  username: z.string().trim().min(1),
});
export type SearchUsernameQueryParamsData = z.infer<
  typeof searchUsernameQueryParamsSchema
>;

// GET /contacts/search Response
export const searchUserResponseSchema = completeResponseWrapper(
  z.array(
    z.object({
      id: z.uuidv7("Invalid contact id"),
      username: z.string(),
      name: z.string(),
      email: z.email(),
      dp: z.url().nullable(),
    }),
  ),
);
export type SearchUserResponseData = z.infer<typeof searchUserResponseSchema>;

// =========================================================

// POST /contacts/add Request
export const addContactRequestSchema = z.object({
  contactId: z.uuidv7("Invalid contact id"),
});
export type AddContactRequestData = z.infer<typeof addContactRequestSchema>;

// POST /contacts/add response
export const addContactResponseSchema = completeResponseWrapper(
  z.object({
    requestId: z.uuidv7("Invalid request id"),
    status: z.literal("pending"),
  }),
);
export type AddContactResponseData = z.infer<typeof addContactResponseSchema>;

// =========================================================

// GET /contacts/requests?direction= Request
export const contactRequestDirectionSchema = z.object({
  direction: z.enum(["incoming", "outgoing"]).default("incoming"),
});
export type ContactRequestDirectionData = z.infer<
  typeof contactRequestDirectionSchema
>;

// GET /contacts/requests?direction= Response
export const contactRequestListItemSchema = z.object({
  id: z.uuidv7(),
  status: z.enum(["pending", "accepted", "rejected", "cancelled"]),
  createdAt: z.date(),
  contact: z.object({
    id: z.uuidv7(),
    name: z.string(),
    username: z.string(),
    email: z.email(),
    dp: z.url().nullable(),
  }),
});
export const contactRequestListResponseSchema = completeResponseWrapper(
  z.array(contactRequestListItemSchema),
);
export type ContactRequestListResponseData = z.infer<
  typeof contactRequestListResponseSchema
>;

// =========================================================

// PATCH /contacts/requests/:requestId Request
export const updateContactRequestPathParamsSchema = z.object({
  requestId: z.uuidv7(),
});
export const updateContactRequestBodySchema = z.object({
  action: z.enum(["accept", "reject", "cancel"]),
});
export type UpdateContactRequestPathParamsData = z.infer<
  typeof updateContactRequestPathParamsSchema
>;
export type UpdateContactRequestBodyData = z.infer<
  typeof updateContactRequestBodySchema
>;

// PATCH /contacts/requests/:requestId Response
export const updateContactResponseSchema = completeResponseWrapper(
  z.object({
    success: z.boolean(),
  }),
);
export type UpdateContactResponseData = z.infer<
  typeof updateContactResponseSchema
>;

// =========================================================

// GET /notifications Response
export const notificationResponseSchema = z.object({
  id: z.uuidv7(),
  type: z.enum([
    "contact_request_received",
    "contact_request_accepted",
    "contact_request_rejected",
    "group_invite_received",
    "group_invite_accepted",
    "group_invite_rejected",
    "group_member_added",
    "group_member_removed",
  ]),
  readAt: z.date().nullable(),
  createdAt: z.date(),
  actor: z.object({
    id: z.uuidv7(),
    name: z.string(),
    email: z.email(),
    username: z.string(),
    dp: z.url().nullable(),
  }),
  contactRequestId: z.uuidv7().nullable(),
  groupInviteId: z.uuidv7().nullable(),
  chatId: z.uuidv7().nullable(),
});
export const notificationsResponseSchema = completeResponseWrapper(
  z.array(notificationResponseSchema),
);
export type NotificationsResponseData = z.infer<
  typeof notificationsResponseSchema
>;

// =========================================================

// PATCH /notifications/:notificationId/read Request
export const markNotificationReadParamsSchema = z.object({
  notificationId: z.uuidv7(),
});
export type MarkNotificationReadParamsData = z.infer<
  typeof markNotificationReadParamsSchema
>;

// PATCH /notifications/:notificationId/read Response
export const markNotificationReadResponseSchema = completeResponseWrapper(
  z.object({
    success: z.boolean(),
  }),
);
export type MarkNotificationReadResponseData = z.infer<
  typeof markNotificationReadResponseSchema
>;

// =========================================================

// GET /notifications/unread-count Response
export const unreadCountResponseSchema = completeResponseWrapper(
  z.object({
    unreadCount: z.number().int().nonnegative(),
  }),
);
export type UnreadCountResponseData = z.infer<typeof unreadCountResponseSchema>;

// =========================================================

// POST /groups Request
export const createGroupRequestSchema = z.object({
  name: z.string().trim().min(1).max(255),
  avatarUrl: z.url().nullable().optional(),
  memberIds: z.array(z.uuidv7()).max(49).default([]),
});
export type CreateGroupRequestData = z.infer<typeof createGroupRequestSchema>;

// POST /groups Response
export const createGroupResponseSchema = completeResponseWrapper(
  z.object({
    groupId: z.uuidv7(),
    memberLimit: z.number().int().positive(),
    invitedCount: z.number().int().nonnegative(),
  }),
);
export type CreateGroupResponseData = z.infer<typeof createGroupResponseSchema>;

// GET /groups/:groupId Request
export const groupPathParamsSchema = z.object({
  groupId: z.uuidv7(),
});
export type GroupPathParamsData = z.infer<typeof groupPathParamsSchema>;

// GET /groups/:groupId Response
export const groupInfoResponseSchema =
  completeResponseWrapper(groupSummarySchema);
export type GroupInfoResponseData = z.infer<typeof groupInfoResponseSchema>;

// GET /groups/:groupId/members Response
export const groupMembersResponseSchema = completeResponseWrapper(
  z.array(groupMemberSchema),
);
export type GroupMembersResponseData = z.infer<
  typeof groupMembersResponseSchema
>;

// POST /groups/:groupId/invites Request
export const createGroupInviteRequestSchema = z.object({
  inviteeId: z.uuidv7(),
});
export type CreateGroupInviteRequestData = z.infer<
  typeof createGroupInviteRequestSchema
>;

// POST /groups/:groupId/invites Response
export const createGroupInviteResponseSchema = completeResponseWrapper(
  z.object({
    inviteId: z.uuidv7(),
    status: z.literal("pending"),
  }),
);
export type CreateGroupInviteResponseData = z.infer<
  typeof createGroupInviteResponseSchema
>;

// PATCH /groups/invites/:inviteId Request
export const groupInvitePathParamsSchema = z.object({
  inviteId: z.uuidv7(),
});
export type GroupInvitePathParamsData = z.infer<
  typeof groupInvitePathParamsSchema
>;

export const respondGroupInviteBodySchema = z.object({
  action: z.enum(["accept", "reject"]),
});
export type RespondGroupInviteBodyData = z.infer<
  typeof respondGroupInviteBodySchema
>;

// PATCH /groups/invites/:inviteId Response
export const respondGroupInviteResponseSchema = completeResponseWrapper(
  z.object({
    inviteId: z.uuidv7(),
    status: z.enum(["accepted", "rejected"]),
  }),
);
export type RespondGroupInviteResponseData = z.infer<
  typeof respondGroupInviteResponseSchema
>;

// POST /groups/:groupId/leave Response
export const leaveGroupResponseSchema = completeResponseWrapper(
  z.object({
    success: z.boolean(),
  }),
);
export type LeaveGroupResponseData = z.infer<typeof leaveGroupResponseSchema>;

// =========================================================

// GET /chats/:chatId Request
export const getChatRequestPathParamsSchema = z.object({
  chatId: z.uuidv7(),
});
export type GetChatRequestPathParamsData = z.infer<
  typeof getChatRequestPathParamsSchema
>;

export const getChatRequestQuerySchema = z.object({
  dateOffSet: z.coerce.date().nullish(),
  after: z.coerce.date().nullish(), // forward pagination for gap recovery
  messageId: z.uuidv7().nullish(),
});
export type GetChatRequestQueryData = z.infer<typeof getChatRequestQuerySchema>;

// GET /chats/:chatId Response
export const getChatSummaryResponseSchema = completeResponseWrapper(
  chatSummaryItemSchema,
);
export type GetChatSummaryResponseData = z.infer<
  typeof getChatSummaryResponseSchema
>;

// GET /chats/:chatId/messages Response

export const getChatResponseSchema = completeResponseWrapper(
  z.array(singleMessageResponseSchema),
);
export type GetChatResponseData = z.infer<typeof getChatResponseSchema>;

// =========================================================

// GET /chats/recent Response
export const recentContactChatsResponseSchema = completeResponseWrapper(
  z.array(
    z.discriminatedUnion("chatType", [
      recentDmChatItemSchema,
      recentGroupChatItemSchema,
    ]),
  ),
);

export type RecentContactChatsResponseData = z.infer<
  typeof recentContactChatsResponseSchema
>;
