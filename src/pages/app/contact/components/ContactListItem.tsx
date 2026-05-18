import { Button } from "@/components/ui/button";
import {
  Archive,
  ArchiveRestore,
  Ban,
  MessageCircle,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router";
import type { Contact } from "@/types/contact.types";
import { ContactRowCard } from "./ContactRowCard";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useArchiveContactMutation,
  useBlockContactMutation,
  useUnarchiveContactMutation,
  useUnblockContactMutation,
} from "@/hooks/queries/app";

type ContactListItemProps = {
  contact: Contact;
};

export default function ContactListItem({ contact }: ContactListItemProps) {
  const navigate = useNavigate();
  const { contact: person, chat } = contact;
  const blockContact = useBlockContactMutation();
  const unblockContact = useUnblockContactMutation();
  const archiveContact = useArchiveContactMutation();
  const unarchiveContact = useUnarchiveContactMutation();

  const handleOpenChat = () => {
    if (chat.chatId) {
      navigate(`/app/chats/${chat.chatId}`);
    }
  };

  return (
    <ContactRowCard
      name={person.name}
      username={person.username}
      avatarUrl={person.dp}
      actions={
        <div className="flex items-center gap-2">
          {contact.blocked ? <Badge variant="outline">Blocked</Badge> : null}
          {contact.archived ? <Badge variant="secondary">Archived</Badge> : null}
          {chat.chatId ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenChat}
              className="shrink-0"
            >
              <MessageCircle data-icon="inline-start" />
              Chat
            </Button>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Contact actions"
                >
                  <MoreVertical data-icon="icon" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    contact.archived
                      ? unarchiveContact.mutate(person.id)
                      : archiveContact.mutate(person.id)
                  }
                >
                  {contact.archived ? (
                    <ArchiveRestore data-icon="inline-start" />
                  ) : (
                    <Archive data-icon="inline-start" />
                  )}
                  {contact.archived ? "Unarchive" : "Archive"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant={contact.blocked ? "default" : "destructive"}
                  onClick={() =>
                    contact.blocked
                      ? unblockContact.mutate(person.id)
                      : blockContact.mutate(person.id)
                  }
                >
                  <Ban data-icon="inline-start" />
                  {contact.blocked ? "Unblock" : "Block"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    />
  );
}
