import { createContext, useContext } from "react";
import type { WebSocketManager } from "@/services/websocket/WebSocketManager";

interface WebSocketContextValue {
  manager: WebSocketManager | null;
}

export const WebSocketContext = createContext<WebSocketContextValue>({
  manager: null,
});

export const useWebSocket = () => useContext(WebSocketContext);
