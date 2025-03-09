"use client";

import { useState, useEffect } from "react";
import useSocket from "@/lib/useSocket";

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
};

export function SocketExample() {
  const { isConnected, emit, on, off } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    // Listen for incoming messages
    on<Message>("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Clean up event listener on unmount
    return () => {
      off("message");
    };
  }, [on, off]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: Date.now(),
    };

    // Send message to server
    emit("message", newMessage);

    // Add message to local state (optimistic update)
    setMessages((prev) => [...prev, newMessage]);

    // Clear input
    setInputMessage("");
  };

  return (
    <div className="flex flex-col space-y-4 rounded-lg border p-4">
      <div className="flex items-center space-x-2">
        <div className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
        <span>{isConnected ? "Connected" : "Disconnected"}</span>
      </div>

      <div className="max-h-80 flex-1 space-y-2 overflow-y-auto rounded border p-2">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded p-2 ${
                msg.sender === "user" ? "ml-auto bg-blue-100" : "bg-gray-100"
              } max-w-[80%]`}
            >
              <p>{msg.text}</p>
              <span className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 rounded border p-2"
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !inputMessage.trim()}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}
