import { useGetRecentChats } from "@/hooks/queries/app";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ChatListItemNav } from "./components/ChatListItemNav";
import { CreateGroupDialog } from "./components/CreateGroupDialog";
import type { RecentChatItem } from "@/types/chat.types";

const getChatDisplayName = (chat: RecentChatItem) =>
  chat.chatType === "dm" ? chat.contact.name : chat.group.name;

export const ChatListPanel = () => {
  const { data: chats, isLoading, error } = useGetRecentChats();
  const [searchValue, setSearchValue] = useState("");

  const filteredChats = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return chats ?? [];
    return (chats ?? []).filter((chat) =>
      getChatDisplayName(chat).toLowerCase().includes(query),
    );
  }, [chats, searchValue]);

  return (
    <div className="flex flex-col w-80 md:w-96 border-r bg-background/50 h-full shrink-0">
      <div className="p-4 border-b">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-xl font-bold tracking-tight">Chats</h2>
          <CreateGroupDialog />
        </div>
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search chats..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </InputGroup>
      </div>

      <ScrollArea className="flex-1 h-full">
        {isLoading && (
          <div className="flex flex-col gap-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 text-sm text-destructive text-center mt-4">
            Failed to load chats.
          </div>
        )}

        {!isLoading && !error && (chats ?? []).length === 0 && (
          <div className="p-4 text-sm text-muted-foreground text-center mt-4">
            No active conversations yet.
          </div>
        )}

        <div className="flex flex-col gap-1 p-2">
          {filteredChats.map((chat) => (
            <ChatListItemNav key={chat.chatId} chat={chat} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
