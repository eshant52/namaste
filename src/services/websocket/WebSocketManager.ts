import { createId } from "@paralleldrive/cuid2";
import type {
  ClientAction,
  ServerAction,
  WsClientMessage,
  WsServerMessage,
  WsConnectionStatus,
} from "./types";
import { wsServerMessageSchema } from "@/schemas/websocket.zod";

type ServerMessageListener = (message: WsServerMessage) => void;
type StatusChangeListener = (status: WsConnectionStatus) => void;
type ReconnectAttemptListener = () => void;

interface WebSocketManagerConfig {
  /** Base URL for WS connection, e.g. ws://localhost:3000 */
  baseUrl: string;
  /** Reconnect base delay in ms (default: 1000) */
  reconnectBaseDelay?: number;
  /** Max reconnect delay in ms (default: 30000) */
  reconnectMaxDelay?: number;
  /** Application-level heartbeat interval in ms (default: 25000) */
  heartbeatInterval?: number;
  /** Max retries before giving up (default: Infinity) */
  maxRetries?: number;
}

const DEFAULT_CONFIG: Required<Omit<WebSocketManagerConfig, "baseUrl">> = {
  reconnectBaseDelay: 1000,
  reconnectMaxDelay: 30000,
  heartbeatInterval: 25000,
  maxRetries: Infinity,
};

/**
 * Centralised WebSocket client manager.
 *
 * Handles connection lifecycle, exponential backoff reconnection,
 * application-level heartbeat, and typed message dispatch.
 */
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketManagerConfig>;
  private status: WsConnectionStatus = "idle";
  private retryCount = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private disposed = false;

  // Listener registries
  private messageListeners = new Map<
    ServerAction | "*",
    Set<ServerMessageListener>
  >();
  private statusListeners = new Set<StatusChangeListener>();
  private reconnectAttemptListeners = new Set<ReconnectAttemptListener>();

  constructor(config: WebSocketManagerConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ── Public API ──

  /**
   * Connect using a one-time ticket obtained from the auth API.
   */
  connect(ticket: string): void {
    if (this.disposed) return;
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.setStatus("connecting");
    this.cleanup();

    const url = `${this.config.baseUrl}/ws/connect?ticket=${encodeURIComponent(ticket)}`;

    try {
      this.ws = new WebSocket(url);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.retryCount = 0;
      this.setStatus("connected");
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = wsServerMessageSchema.parse(JSON.parse(event.data as string));
        this.dispatchMessage(data as WsServerMessage);
      } catch {
        // Silently drop unparseable messages
      }
    };

    this.ws.onclose = (event) => {
      this.stopHeartbeat();

      // 4001 = server rejected auth / intentional disconnect
      if (event.code === 4001 || this.disposed) {
        this.setStatus("disconnected");
        return;
      }

      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      // onerror always fires before onclose — let onclose handle reconnect
    };
  }

  disconnect(): void {
    this.disposed = true;
    this.clearReconnectTimeout();
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }

    this.setStatus("disconnected");
  }

  /**
   * Send a typed message to the server.
   * Returns the correlation ID.
   */
  send<T>(action: ClientAction, payload: T): string | null {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return null;
    }

    const id = createId();
    const message: WsClientMessage<T> = { id, action, payload };
    this.ws.send(JSON.stringify(message));
    return id;
  }

  // ── Event subscription ──

  /**
   * Subscribe to a specific server action, or "*" for all messages.
   * Returns an unsubscribe function.
   */
  on(action: ServerAction | "*", listener: ServerMessageListener): () => void {
    if (!this.messageListeners.has(action)) {
      this.messageListeners.set(action, new Set());
    }
    this.messageListeners.get(action)!.add(listener);

    return () => {
      this.messageListeners.get(action)?.delete(listener);
    };
  }

  onStatusChange(listener: StatusChangeListener): () => void {
    this.statusListeners.add(listener);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  onReconnectAttempt(listener: ReconnectAttemptListener): () => void {
    this.reconnectAttemptListeners.add(listener);
    return () => {
      this.reconnectAttemptListeners.delete(listener);
    };
  }

  // ── Getters ──

  get connectionStatus(): WsConnectionStatus {
    return this.status;
  }

  get currentRetryCount(): number {
    return this.retryCount;
  }

  get isConnected(): boolean {
    return this.status === "connected";
  }

  // ── Private ──

  private dispatchMessage(message: WsServerMessage): void {
    // Dispatch to action-specific listeners
    const actionListeners = this.messageListeners.get(
      message.action as ServerAction,
    );
    if (actionListeners) {
      for (const listener of actionListeners) {
        try {
          listener(message);
        } catch (err) {
          console.error(
            `[WS] Error in listener for ${message.action}:`,
            err,
          );
        }
      }
    }

    // Dispatch to wildcard listeners
    const wildcardListeners = this.messageListeners.get("*");
    if (wildcardListeners) {
      for (const listener of wildcardListeners) {
        try {
          listener(message);
        } catch (err) {
          console.error("[WS] Error in wildcard listener:", err);
        }
      }
    }
  }

  private setStatus(status: WsConnectionStatus): void {
    if (this.status === status) return;
    this.status = status;
    for (const listener of this.statusListeners) {
      try {
        listener(status);
      } catch {
        // Don't let listener errors break the manager
      }
    }
  }

  private scheduleReconnect(): void {
    if (this.disposed) return;
    if (this.retryCount >= this.config.maxRetries) {
      this.setStatus("disconnected");
      return;
    }

    this.setStatus("reconnecting");

    // Exponential backoff with ±30% jitter
    const base = Math.min(
      this.config.reconnectBaseDelay * Math.pow(2, this.retryCount),
      this.config.reconnectMaxDelay,
    );
    const jitter = base * 0.3 * (Math.random() * 2 - 1); // ±30%
    const delay = Math.max(0, base + jitter);

    this.retryCount++;

    this.reconnectTimeout = setTimeout(() => {
      for (const listener of this.reconnectAttemptListeners) {
        try {
          listener();
        } catch {
          // Don't let listener errors break future reconnect attempts.
        }
      }
    }, delay);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.send("ping", {});
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private cleanup(): void {
    this.clearReconnectTimeout();
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;

      if (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING
      ) {
        this.ws.close(1000, "Reconnecting");
      }
      this.ws = null;
    }
  }

  /**
   * Reset retry count (e.g. after a successful manual reconnect).
   */
  resetRetries(): void {
    this.retryCount = 0;
  }

  /**
   * Allow external reconnection (used by provider after getting a new ticket).
   */
  forceReconnect(ticket: string): void {
    this.disposed = false;
    this.connect(ticket);
  }
}
