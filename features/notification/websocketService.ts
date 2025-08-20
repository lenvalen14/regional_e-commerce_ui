import { NotificationResponse } from './notificationApi';
import { Client as StompClient } from '@stomp/stompjs';

export class NotificationWebSocketService {
  private stompClient: StompClient | null = null;
  private isConnected = false;
  private onNotificationCallback: ((notification: NotificationResponse) => void) | null = null;
  private onConnectionChangeCallback: ((connected: boolean) => void) | null = null;

  constructor(
    private wsUrl: string,
    private userId: string,
    private token: string
  ) {}

  connect(): void {
    if (this.stompClient?.active) {
      console.log('WebSocket already active');
      return;
    }

    this.stompClient = new StompClient({
      brokerURL: `${this.wsUrl}/ws`,
      connectHeaders: {
        Authorization: `Bearer ${this.token}`,
        userId: this.userId,
      },
      reconnectDelay: 100000,
      debug: (str) => console.log('STOMP Debug:', str),
      onConnect: () => {
        console.log('STOMP WebSocket connected successfully');
        this.isConnected = true;
        this.onConnectionChangeCallback?.(true);
        this.subscribeToNotifications();
      },
      onDisconnect: () => {
        console.log('STOMP WebSocket disconnected');
        this.isConnected = false;
        this.onConnectionChangeCallback?.(false);
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame.headers['message'], frame.body);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket Error:', error);
      },
    });

    this.stompClient.activate();
  }

  private subscribeToNotifications(): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.warn('Cannot subscribe: STOMP client not connected');
      return;
    }

    const dest = `/queue/notifications-${this.userId}`;
    this.stompClient.subscribe(dest, (message) => {
      try {
        const notification: NotificationResponse = JSON.parse(message.body);
        this.onNotificationCallback?.(notification);
      } catch (error) {
        console.error('Error parsing notification message:', error);
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
  if (
    globalWebSocketService &&
    (globalWebSocketService as any).userId !== userId
  ) {
    console.log('User changed, reconnecting...');
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
