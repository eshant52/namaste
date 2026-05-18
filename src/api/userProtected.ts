import type {
  AddContactResponseData,
  CreateGroupInviteRequestData,
  CreateGroupInviteResponseData,
  CreateGroupRequestData,
  CreateGroupResponseData,
  ContactRequestListResponseData,
  ContactRequestDirectionData,
  ContactsResponseData,
  GroupInfoResponseData,
  GroupInvitePathParamsData,
  GroupMembersResponseData,
  GroupPathParamsData,
  GetChatSummaryResponseData,
  GetChatResponseData,
  GetChatRequestPathParamsData,
  LeaveGroupResponseData,
  MarkNotificationReadParamsData,
  NotificationsResponseData,
  RecentContactChatsResponseData,
  RespondGroupInviteBodyData,
  RespondGroupInviteResponseData,
  SearchUserResponseData,
  UnreadCountResponseData,
  UpdateContactRequestBodyData,
  UpdateContactRequestPathParamsData,
  UpdateContactResponseData,
  UserResponseData,
  SearchUsernameQueryParamsData,
} from "@/schemas/user/protected.zod";
import { apiClient } from "./client";
import { PROTECTED_ROUTE } from "./route-path";
import type { SuccessResponse } from "@/types/response.types";

export const chatApi = {
  getUserInfo: async () => {
    const response = await apiClient.get<SuccessResponse<UserResponseData>>(
      PROTECTED_ROUTE.userInfo,
    );
    return response.data;
  },

  getRecentChats: async () => {
    const response = await apiClient.get<
      SuccessResponse<RecentContactChatsResponseData>
    >(PROTECTED_ROUTE.recentChats);
    return response.data;
  },

  getChatMessages: async (
    chatId: GetChatRequestPathParamsData["chatId"],
    dateOffSet?: Date,
    after?: Date,
  ) => {
    const response = await apiClient.get<SuccessResponse<GetChatResponseData>>(
      PROTECTED_ROUTE.chatMessages(chatId),
      {
        params: {
          ...(dateOffSet ? { dateOffSet: dateOffSet.toISOString() } : {}),
          ...(after ? { after: after.toISOString() } : {}),
        },
      },
    );
    return response.data;
  },

  getChatById: async (chatId: GetChatRequestPathParamsData["chatId"]) => {
    const response = await apiClient.get<
      SuccessResponse<GetChatSummaryResponseData>
    >(PROTECTED_ROUTE.chatById(chatId));
    return response.data;
  },

  getContacts: async (includeArchived = false) => {
    const response = await apiClient.get<SuccessResponse<ContactsResponseData>>(
      PROTECTED_ROUTE.getContacts,
      {
        params: includeArchived ? { includeArchived: true } : undefined,
      },
    );
    return response.data;
  },

  searchUsersByUsername: async (
    username: SearchUsernameQueryParamsData["username"],
  ) => {
    const response = await apiClient.get<
      SuccessResponse<SearchUserResponseData>
    >(PROTECTED_ROUTE.searchUser, {
      params: { username },
    });
    return response.data;
  },

  sendContactRequest: async (contactId: string) => {
    const response = await apiClient.post<
      SuccessResponse<AddContactResponseData>
    >(PROTECTED_ROUTE.contactRequests, { contactId });
    return response.data;
  },

  getContactRequests: async (
    direction: ContactRequestDirectionData["direction"],
  ) => {
    const response = await apiClient.get<
      SuccessResponse<ContactRequestListResponseData>
    >(PROTECTED_ROUTE.contactRequests, {
      params: { direction },
    });
    return response.data;
  },

  updateContactRequest: async (
    requestId: UpdateContactRequestPathParamsData["requestId"],
    action: UpdateContactRequestBodyData["action"],
  ) => {
    const response = await apiClient.patch<
      SuccessResponse<UpdateContactResponseData>
    >(PROTECTED_ROUTE.contactRequestById(requestId), {
      action,
    });
    return response.data;
  },

  getNotifications: async () => {
    const response = await apiClient.get<
      SuccessResponse<NotificationsResponseData>
    >(PROTECTED_ROUTE.notifications);
    return response.data;
  },

  getUnreadNotificationCount: async () => {
    const response = await apiClient.get<
      SuccessResponse<UnreadCountResponseData>
    >(PROTECTED_ROUTE.notificationsUnreadCount);
    return response.data;
  },

  markNotificationRead: async (
    notificationId: MarkNotificationReadParamsData["notificationId"],
  ) => {
    const response = await apiClient.patch<SuccessResponse<void>>(
      PROTECTED_ROUTE.notificationReadById(notificationId),
    );
    return response.data;
  },

  createGroup: async (payload: CreateGroupRequestData) => {
    const response = await apiClient.post<
      SuccessResponse<CreateGroupResponseData>
    >(PROTECTED_ROUTE.createGroup, payload);
    return response.data;
  },

  getGroupInfo: async (groupId: GroupPathParamsData["groupId"]) => {
    const response = await apiClient.get<
      SuccessResponse<GroupInfoResponseData>
    >(PROTECTED_ROUTE.groupInfo(groupId));
    return response.data;
  },

  getGroupMembers: async (groupId: GroupPathParamsData["groupId"]) => {
    const response = await apiClient.get<
      SuccessResponse<GroupMembersResponseData>
    >(PROTECTED_ROUTE.groupMembers(groupId));
    return response.data;
  },

  inviteGroupMember: async (
    groupId: GroupPathParamsData["groupId"],
    inviteeId: CreateGroupInviteRequestData["inviteeId"],
  ) => {
    const response = await apiClient.post<
      SuccessResponse<CreateGroupInviteResponseData>
    >(PROTECTED_ROUTE.groupInvites(groupId), {
      inviteeId,
    });
    return response.data;
  },

  respondGroupInvite: async (
    inviteId: GroupInvitePathParamsData["inviteId"],
    action: RespondGroupInviteBodyData["action"],
  ) => {
    const response = await apiClient.patch<
      SuccessResponse<RespondGroupInviteResponseData>
    >(PROTECTED_ROUTE.groupInviteById(inviteId), {
      action,
    });
    return response.data;
  },

  leaveGroup: async (groupId: GroupPathParamsData["groupId"]) => {
    const response = await apiClient.post<
      SuccessResponse<LeaveGroupResponseData>
    >(PROTECTED_ROUTE.leaveGroup(groupId));
    return response.data;
  },

  blockContact: async (contactId: string) => {
    const response = await apiClient.post(
      PROTECTED_ROUTE.blockContact(contactId),
    );
    return response.data;
  },

  unblockContact: async (contactId: string) => {
    const response = await apiClient.post(
      PROTECTED_ROUTE.unblockContact(contactId),
    );
    return response.data;
  },

  archiveContact: async (contactId: string) => {
    const response = await apiClient.post(
      PROTECTED_ROUTE.archiveContact(contactId),
    );
    return response.data;
  },

  unarchiveContact: async (contactId: string) => {
    const response = await apiClient.post(
      PROTECTED_ROUTE.unarchiveContact(contactId),
    );
    return response.data;
  },
};
