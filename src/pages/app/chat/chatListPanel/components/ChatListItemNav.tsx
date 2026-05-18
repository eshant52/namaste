import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RecentChatItem } from "@/types/chat.types";
import { NavLink } from "react-router";

type ChatListItemNavProps = {
  chat: RecentChatItem;
};

const getChatDisplayName = (chat: RecentChatItem) =>
  chat.chatType === "dm" ? chat.contact.name : chat.group.name;

const getChatAvatarUrl = (chat: RecentChatItem) =>
  chat.chatType === "dm" ? chat.contact.dp : chat.group.avatarUrl;

export const ChatListItemNav = ({ chat }: ChatListItemNavProps) => {
  const displayName = getChatDisplayName(chat);
  const avatarUrl = getChatAvatarUrl(chat) ?? "";

  return (
    <NavLink
      to={`/app/chats/${chat.chatId}`}
      className={({ isActive }) =>
        cn(
          "flex h-auto w-full items-center justify-start gap-3 rounded-lg p-3 text-left",
          isActive && "bg-muted shadow-sm",
        )
      }
    >
      <Avatar className="size-12 border border-primary/10">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-medium">{displayName}</span>
            {chat.chatType === "group" ? (
              <Badge variant="outline">Group</Badge>
            ) : null}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {new Date(chat.recentChatAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <p className="truncate text-sm text-muted-foreground">
          {chat.recentText ?? "No messages yet"}
        </p>
      </div>
    </NavLink>
  );
};
