import { ChatListPanel } from "@/pages/app/chat/chatListPanel";
import { Outlet } from "react-router";

export default function ChatPage() {
  return (
    <main className="flex flex-1 w-full h-full overflow-hidden">
      <ChatListPanel />
      <Outlet />
    </main>
  );
}
