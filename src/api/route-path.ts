// ================= Auth Routes =================

export const AUTH_ROUTE_PREFIX = "/auth";

export const AUTH_ROUTE = {
  login: `${AUTH_ROUTE_PREFIX}/login`,
  refresh: `${AUTH_ROUTE_PREFIX}/refresh`,
  logout: `${AUTH_ROUTE_PREFIX}/logout`,
  register: `${AUTH_ROUTE_PREFIX}/register`,
  checkUsername: `${AUTH_ROUTE_PREFIX}/check-username`,
  registerEmailOtp: `${AUTH_ROUTE_PREFIX}/register-email-otp`,
  sessionLimitRevoke: `${AUTH_ROUTE_PREFIX}/session-limit/revoke`,
  sessionLimitContinue: `${AUTH_ROUTE_PREFIX}/session-limit/continue`,
  wsTicket: `${AUTH_ROUTE_PREFIX}/ws-ticket`,
} as const;

// ================= Protected Routes =================

export const PROTECTED_ROUTE_PREFIX = "/p";

export const PROTECTED_ROUTE = {
  userInfo: `${PROTECTED_ROUTE_PREFIX}/user/me`,
  getContacts: `${PROTECTED_ROUTE_PREFIX}/contacts`,
  searchUser: `${PROTECTED_ROUTE_PREFIX}/contacts/search`,
  addContact: `${PROTECTED_ROUTE_PREFIX}/contacts`,
  contactRequests: `${PROTECTED_ROUTE_PREFIX}/contacts/requests`,
  contactRequestById: (requestId: string) =>
    `${PROTECTED_ROUTE_PREFIX}/contacts/requests/${requestId}`,
  getContact: (id: string) => `${PROTECTED_ROUTE_PREFIX}/contacts/${id}`,
  contactStatus: (id: string) =>
    `${PROTECTED_ROUTE_PREFIX}/contacts/${id}/status`,
  notifications: `${PROTECTED_ROUTE_PREFIX}/notifications`,
  notificationsUnreadCount: `${PROTECTED_ROUTE_PREFIX}/notifications/unread-count`,
  notificationReadById: (notificationId: string) =>
    `${PROTECTED_ROUTE_PREFIX}/notifications/${notificationId}/read`,
  createGroup: `${PROTECTED_ROUTE_PREFIX}/groups`,
  groupInfo: (groupId: string) => `${PROTECTED_ROUTE_PREFIX}/groups/${groupId}`,
  groupMembers: (groupId: string) =>
    `${PROTECTED_ROUTE_PREFIX}/groups/${groupId}/members`,
  groupInvites: (groupId: string) =>
    `${PROTECTED_ROUTE_PREFIX}/groups/${groupId}/invites`,
  groupInviteById: (inviteId: string) =>
    `${PROTECTED_ROUTE_PREFIX}/groups/invites/${inviteId}`,
  leaveGroup: (groupId: string) =>
    `${PROTECTED_ROUTE_PREFIX}/groups/${groupId}/leave`,
  blockContact: (contactId: string) =>
    `${PROTECTED_ROUTE_PREFIX}/contacts/${contactId}/block`,
  unblockContact: (contactId: string) =>
    `${PROTECTED_ROUTE_PREFIX}/contacts/${contactId}/unblock`,
  archiveContact: (contactId: string) =>
    `${PROTECTED_ROUTE_PREFIX}/contacts/${contactId}/archive`,
  unarchiveContact: (contactId: string) =>
    `${PROTECTED_ROUTE_PREFIX}/contacts/${contactId}/unarchive`,
  recentChats: `${PROTECTED_ROUTE_PREFIX}/chats/recent`,
  chatById: (chatId: string) => `${PROTECTED_ROUTE_PREFIX}/chats/${chatId}`,
  chatMessages: (chatId: string) =>
    `${PROTECTED_ROUTE_PREFIX}/chats/${chatId}/messages`,
} as const;
