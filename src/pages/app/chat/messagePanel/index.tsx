import {
  useGetChatById,
  useGetChatMessages,
  useGetGroupInfo,
  useGetRecentChats,
  useGetUserInfo,
  useLeaveGroup,
} from "@/hooks/queries/app";
import { useMemo } from "react";
import { MessageComposer } from "./components/MessageComposer";
import { MessagePanelHeader } from "./components/MessagePanelHeader";
import { MessageTimeline } from "./components/MessageTimeline";
import { useNavigate, useParams } from "react-router";
import ChatNotFound from "./components/ChatNotFound";

export const MessagePanel = () => {
  const navigate = useNavigate();
  const params = useParams();
  const activeChatId = params.chatId;

  const user = useGetUserInfo();
  const { data: recentChats = [], isLoading: isRecentChatsLoading } =
    useGetRecentChats();
  const leaveGroup = useLeaveGroup();

  const selectedChat = useMemo(
    () => recentChats.find((chat) => chat.chatId === activeChatId) ?? null,
    [recentChats, activeChatId],
  );

  const shouldFetchChatById =
    !!activeChatId && !isRecentChatsLoading && !selectedChat;

  const {
    data: chatById,
    isLoading: isChatByIdLoading,
    isError: isChatByIdError,
  } = useGetChatById(shouldFetchChatById ? activeChatId : null);

  const resolvedChat = selectedChat ?? chatById ?? null;

  const activeGroupId =
    resolvedChat?.chatType === "group" ? resolvedChat.chatId : null;

  const { data: groupInfo } = useGetGroupInfo(activeGroupId);

  const displayName =
    resolvedChat?.chatType === "group"
      ? resolvedChat.group.name
      : (resolvedChat?.contact.name ?? "Selected Chat");

  const avatarUrl =
    resolvedChat?.chatType === "group"
      ? resolvedChat.group.avatarUrl
      : resolvedChat?.contact.dp;

  const subtitle =
    resolvedChat?.chatType === "group"
      ? `${groupInfo?.memberCount ?? resolvedChat.group.memberCount} members`
      : "Online";

  const shouldShowChatNotFound =
    !!activeChatId &&
    !isRecentChatsLoading &&
    !selectedChat &&
    !isChatByIdLoading &&
    isChatByIdError;

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetChatMessages(resolvedChat?.chatId ?? null);

  // Flatten all pages into a single chronological array (oldest first).
  // Each page is desc-ordered (newest first), and pages themselves go
  // from newest to oldest, so we reverse both levels.
  const messages = useMemo(() => {
    if (!messagesData?.pages) return undefined;
    return messagesData.pages.flatMap((page) => page.data).reverse();
  }, [messagesData]);

  if (shouldShowChatNotFound) {
    return <ChatNotFound />;
  }

  return (
    <div className="relative flex h-full flex-1 flex-col border-l border-r bg-background">
      <MessagePanelHeader
        displayName={displayName}
        subtitle={subtitle}
        avatarUrl={avatarUrl}
        activeGroupId={activeGroupId}
        isLeaving={leaveGroup.isPending}
        onLeaveGroup={() => {
          if (!activeGroupId) {
            return;
          }

          leaveGroup.mutate(activeGroupId, {
            onSuccess: () => {
              navigate("/app/chats", { replace: true });
            },
          });
        }}
      />

      <div className="flex-1 overflow-hidden">
        <MessageTimeline
          messages={messages}
          isLoading={
            isRecentChatsLoading || isChatByIdLoading || isMessagesLoading
          }
          currentUserId={user.data?.data.id ?? null}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>

      <MessageComposer />
    </div>
  );
};
