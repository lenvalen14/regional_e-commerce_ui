import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/features/auth/authSlice";
import { Client, IMessage } from "@stomp/stompjs";

interface NotificationResponse {
  title: string;
  id: string;
  message: string;
  createdAt: string;
}

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
  const clientRef = useRef<Client | null>(null);

  const connect = useCallback(() => {
    if (!userId || !token) {
      console.log("Missing userId or token, cannot connect WebSocket");
      return;
    }

    if (clientRef.current?.connected) {
      console.log("Already connected WebSocket");
      return;
    }

    console.log("Connecting WebSocket for user:", userId);

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("STOMP:", str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");

        client.subscribe(`/queue/notifications-${userId}`, (message: IMessage) => {
          const notification: NotificationResponse = JSON.parse(message.body);
          console.log("Notification received:", notification);
          onNewNotification(notification);
        });

        onConnectionChange?.(true);
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
        onConnectionChange?.(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;
  }, [userId, token, onNewNotification, onConnectionChange]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      console.log("Disconnecting WebSocket...");
      clientRef.current.deactivate();
      clientRef.current = null;
    }
  }, []);

  const isConnected = useCallback(() => {
    return clientRef.current?.connected || false;
  }, []);

  useEffect(() => {
    if (userId && token) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [userId, token, connect, disconnect]);

  return {
    connect,
    disconnect,
    isConnected,
  };
};
