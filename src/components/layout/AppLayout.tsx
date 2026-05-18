import { Outlet } from "react-router";
import { SidebarNav } from "@/components/app/SidebarNav";
import { WebSocketProvider } from "@/provider/WebSocketProvider";

export default function AppLayout() {
  return (
    <WebSocketProvider>
      <div className="flex bg-background h-dvh w-full overflow-hidden selection:bg-primary/20">
        <SidebarNav />
        <Outlet />
      </div>
    </WebSocketProvider>
  );
}
