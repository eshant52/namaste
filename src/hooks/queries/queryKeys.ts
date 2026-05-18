export const protectedKeys = {
  all: ["user"] as const,
  info: () => [...protectedKeys.all, "info"] as const,
  contacts: (includeArchived = false) =>
    includeArchived
      ? ([...protectedKeys.all, "contacts", { includeArchived }] as const)
      : ([...protectedKeys.all, "contacts"] as const),
  contact: (contactId: string) =>
    [...protectedKeys.contacts(), contactId] as const,
  searchContacts: (usernameQuery: string) =>
    [...protectedKeys.contacts(), "search", usernameQuery] as const,
  contactRequests: (direction: "incoming" | "outgoing") =>
    [...protectedKeys.contacts(), "requests", direction] as const,
  contactStatus: (contactId: string) =>
    [...protectedKeys.contacts(), contactId, "status"] as const,
  notifications: () => [...protectedKeys.all, "notifications"] as const,
  notificationsUnreadCount: () =>
    [...protectedKeys.notifications(), "unread-count"] as const,
  chats: () => [...protectedKeys.all, "chats"] as const,
  recentChats: () => [...protectedKeys.chats(), "recent"] as const,
  chatById: (chatId: string) =>
    [...protectedKeys.chats(), chatId, "summary"] as const,
  messages: (chatId: string) =>
    [...protectedKeys.chats(), chatId, "messages"] as const,
  groups: () => [...protectedKeys.all, "groups"] as const,
  group: (groupId: string) => [...protectedKeys.groups(), groupId] as const,
  groupInfo: (groupId: string) =>
    [...protectedKeys.group(groupId), "info"] as const,
  groupMembers: (groupId: string) =>
    [...protectedKeys.group(groupId), "members"] as const,
};
