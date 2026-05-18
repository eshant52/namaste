import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/api/userProtected";
import { protectedKeys } from "../queryKeys";

export const useBlockContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => chatApi.blockContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: protectedKeys.contacts() });
      queryClient.invalidateQueries({ queryKey: protectedKeys.recentChats() });
    },
  });
};

export const useUnblockContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => chatApi.unblockContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: protectedKeys.contacts() });
      queryClient.invalidateQueries({ queryKey: protectedKeys.recentChats() });
    },
  });
};

export const useArchiveContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => chatApi.archiveContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: protectedKeys.contacts() });
      queryClient.invalidateQueries({ queryKey: protectedKeys.recentChats() });
    },
  });
};

export const useUnarchiveContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => chatApi.unarchiveContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: protectedKeys.contacts() });
      queryClient.invalidateQueries({ queryKey: protectedKeys.recentChats() });
    },
  });
};
