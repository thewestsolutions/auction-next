import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the URL for the socket connection
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3002";

// Define a more specific type for socket event handlers
export type SocketEventHandler<T = unknown> = (data: T, ...args: unknown[]) => void;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create socket connection
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    // Store socket in ref
    socketRef.current = socket;

    // Set up event listeners
    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Function to emit events
  const emit = <T>(event: string, data: T) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn("Socket not connected, cannot emit event:", event);
    }
  };

  // Function to subscribe to events
  const on = <T>(event: string, handler: SocketEventHandler<T>) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  };

  // Function to unsubscribe from events
  const off = <T>(event: string, handler?: SocketEventHandler<T>) => {
    if (socketRef.current) {
      if (handler) {
        socketRef.current.off(event, handler);
      } else {
        socketRef.current.off(event);
      }
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
  };
};

export default useSocket;
