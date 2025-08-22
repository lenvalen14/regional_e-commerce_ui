"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/features/auth/authSlice";
import { Client, IMessage } from "@stomp/stompjs";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

interface NotificationResponse {
  title: string;
  id: string;
  message: string;
  createdAt: string;
}

// Global singleton để đảm bảo chỉ có 1 connection
class WebSocketSingleton {
  private client: Client | null = null;
  private isConnected = false;
  private currentUserId: string | null = null;
  private currentToken: string | null = null;
  private callbacks: Set<{
    onNotification: (notification: NotificationResponse) => void;
    onConnectionChange?: (connected: boolean) => void;
    id: string;
  }> = new Set();

  connect(userId: string, token: string) {
    // Nếu đã connect với cùng user và token, skip
    if (this.client?.connected && this.currentUserId === userId && this.currentToken === token) {
      logger.debug("Already connected with same user and token");
      return;
    }

    // Disconnect existing connection nếu user hoặc token khác
    if (this.client && (this.currentUserId !== userId || this.currentToken !== token)) {
      logger.info("User or token changed, disconnecting...");
      this.disconnect();
    }

    if (this.client?.connected) {
      logger.debug("Already connected to WebSocket");
      return;
    }

    logger.info("Connecting WebSocket for user:", userId);
    
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

    this.client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => logger.debug("STOMP:", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        this.isConnected = true;
        this.currentUserId = userId;
        this.currentToken = token;
        
        logger.info("✅ WebSocket connected for user:", userId);
        
        // Notify all subscribers
        this.callbacks.forEach(callback => {
          callback.onConnectionChange?.(true);
        });

        // Subscribe to notifications
        this.client?.subscribe(`/queue/notifications-${userId}`, (message: IMessage) => {
          try {
            const notification: NotificationResponse = JSON.parse(message.body);
            logger.debug("📨 Notification received:", notification);
            
            // Broadcast to all subscribers
            this.callbacks.forEach(callback => {
              callback.onNotification(notification);
            });
          } catch (error) {
            logger.error("Error parsing notification:", error);
          }
        });
      },
      onDisconnect: () => {
        this.isConnected = false;
        logger.info("❌ WebSocket disconnected for user:", userId);
        
        // Notify all subscribers
        this.callbacks.forEach(callback => {
          callback.onConnectionChange?.(false);
        });
      },
      onStompError: (frame) => {
        const errorMsg = frame.headers?.["message"] || "Unknown error";
        toast.error("WebSocket error: " + errorMsg);
        logger.error("STOMP error:", errorMsg, frame.body);
      },
      onWebSocketError: (error) => {
        logger.error("WebSocket connection error:", error);
      },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      logger.info("Disconnecting WebSocket...");
      this.client.deactivate();
      this.client = null;
    }
    this.isConnected = false;
    this.currentUserId = null;
    this.currentToken = null;
    
    // Notify all subscribers
    this.callbacks.forEach(callback => {
      callback.onConnectionChange?.(false);
    });
  }

  subscribe(
    onNotification: (notification: NotificationResponse) => void,
    onConnectionChange?: (connected: boolean) => void,
    id: string = Math.random().toString(36)
  ) {
    const callback = { onNotification, onConnectionChange, id };
    this.callbacks.add(callback);
    
    // Immediately notify current connection status
    onConnectionChange?.(this.isConnected);
    
    logger.debug(`📻 Subscribed to WebSocket (${id}), total subscribers:`, this.callbacks.size);
    
    return () => {
      this.callbacks.delete(callback);
      logger.debug(`📻 Unsubscribed from WebSocket (${id}), remaining subscribers:`, this.callbacks.size);
      
      // Nếu không còn subscribers nào, disconnect
      if (this.callbacks.size === 0) {
        logger.info("No more subscribers, disconnecting WebSocket");
        this.disconnect();
      }
    };
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  getSubscriberCount() {
    return this.callbacks.size;
  }
}

// Global singleton instance
const webSocketSingleton = new WebSocketSingleton();

interface UseWebSocketNotificationsProps {
  userId: string;
  onNewNotification: (notification: NotificationResponse) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export const useWebSocketNotifications = ({
  userId,
  onNewNotification,
  onConnectionChange,
}: UseWebSocketNotificationsProps) => {
  const token = useSelector(selectCurrentToken);
  const [isConnected, setIsConnected] = useState(false);
  const componentIdRef = useRef(`component-${Math.random().toString(36).substr(2, 9)}`);
  
  // Stable references
  const onNewNotificationRef = useRef(onNewNotification);
  const onConnectionChangeRef = useRef(onConnectionChange);
  
  useEffect(() => {
    onNewNotificationRef.current = onNewNotification;
  }, [onNewNotification]);
  
  useEffect(() => {
    onConnectionChangeRef.current = onConnectionChange;
  }, [onConnectionChange]);

  useEffect(() => {
    if (!userId || !token) {
      logger.debug("Missing userId or token, cannot connect WebSocket");
      return;
    }

    logger.debug(`🔌 Component ${componentIdRef.current} requesting WebSocket connection`);

    // Subscribe to singleton
    const unsubscribe = webSocketSingleton.subscribe(
      (notification) => onNewNotificationRef.current(notification),
      (connected) => {
        setIsConnected(connected);
        onConnectionChangeRef.current?.(connected);
      },
      componentIdRef.current
    );

    // Connect (singleton sẽ handle việc tránh duplicate connections)
    webSocketSingleton.connect(userId, token);

    return () => {
      logger.debug(`🔌 Component ${componentIdRef.current} cleaning up`);
      unsubscribe();
    };
  }, [userId, token]);

  const manualConnect = useCallback(() => {
    if (userId && token) {
      webSocketSingleton.connect(userId, token);
    }
  }, [userId, token]);

  const manualDisconnect = useCallback(() => {
    webSocketSingleton.disconnect();
  }, []);

  return {
    connect: manualConnect,
    disconnect: manualDisconnect,
    isConnected,
    subscriberCount: webSocketSingleton.getSubscriberCount(),
  };
};

// Debug utility - chỉ chạy trên client side
if (typeof window !== 'undefined') {
  (window as any).debugWebSocket = () => ({
    isConnected: webSocketSingleton.getConnectionStatus(),
    subscriberCount: webSocketSingleton.getSubscriberCount(),
    disconnect: () => webSocketSingleton.disconnect(),
  });
}