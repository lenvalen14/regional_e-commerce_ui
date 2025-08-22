import { NotificationResponse } from "./notificationApi";
import { Client as StompClient } from "@stomp/stompjs";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

export class NotificationWebSocketService {
  private stompClient: StompClient | null = null;
  private isConnected = false;
  private onNotificationCallback: ((notification: NotificationResponse) => void) | null = null;
  private onConnectionChangeCallback: ((connected: boolean) => void) | null = null;

  constructor(
    private wsUrl: string,
    public userId: string,
    private token: string
  ) {}

  connect(): void {
    if (this.stompClient?.active) {
      logger.debug("WebSocket already active");
      return;
    }

    this.stompClient = new StompClient({
      brokerURL: `${this.wsUrl}/ws`,
      connectHeaders: {
        Authorization: `Bearer ${this.token}`,
        userId: this.userId,
      },
      reconnectDelay: 10000,
      debug: (str) => logger.debug("STOMP:", str),
      onConnect: () => {
        this.isConnected = true;
        this.onConnectionChangeCallback?.(true);
        this.subscribeToNotifications();
        logger.info("STOMP WebSocket connected successfully");
      },
      onDisconnect: () => {
        this.isConnected = false;
        this.onConnectionChangeCallback?.(false);
        logger.info("STOMP WebSocket disconnected");
      },
      onStompError: (frame) => {
        toast.error("WebSocket error " + frame.headers["message"]);
        logger.error("STOMP Error:", frame.headers["message"], frame.body);
      },
      onWebSocketError: (error) => {
        toast.error("WebSocket connection failed");
        logger.error("WebSocket Error:", error);
      },
    });

    this.stompClient.activate();
  }

  private subscribeToNotifications(): void {
    if (!this.stompClient || !this.stompClient.connected) {
      logger.warn("Cannot subscribe: STOMP client not connected");
      return;
    }

    const dest = `/queue/notifications-${this.userId}`;
    this.stompClient.subscribe(dest, (message) => {
      try {
        const notification: NotificationResponse = JSON.parse(message.body);
        this.onNotificationCallback?.(notification);
        logger.debug("Notification received:", notification);
      } catch (error) {
        logger.error("Error parsing notification message:", error);
      }
    });
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.isConnected = false;
    this.onConnectionChangeCallback?.(false);
    toast("WebSocket disconnected");
    logger.info("WebSocket disconnected manually");
  }

  onNotification(callback: (notification: NotificationResponse) => void): void {
    this.onNotificationCallback = callback;
  }

  onConnectionChange(callback: (connected: boolean) => void): void {
    this.onConnectionChangeCallback = callback;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

let globalWebSocketService: NotificationWebSocketService | null = null;

export const getNotificationWebSocketService = (
  wsUrl: string,
  userId: string,
  token: string
): NotificationWebSocketService => {
  if (globalWebSocketService && globalWebSocketService.userId !== userId) {
    logger.info("User changed, reconnecting WebSocket...");
    globalWebSocketService.disconnect();
    globalWebSocketService = null;
  }

  if (!globalWebSocketService) {
    globalWebSocketService = new NotificationWebSocketService(wsUrl, userId, token);
  }

  return globalWebSocketService;
};

export const disconnectNotificationWebSocket = (): void => {
  if (globalWebSocketService) {
    globalWebSocketService.disconnect();
    globalWebSocketService = null;
  }
};
