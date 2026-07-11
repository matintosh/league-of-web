"use client";

import { useState } from "react";
import { ChatPanel } from "./chat-panel";
import type { ChatMessage } from "./chat-panel";

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "s1", text: "CallMeCallMeStar joined the lobby" },
  { id: "s2", text: "cherwood joined the lobby" },
  { id: "s3", text: "qLxHarlan joined the lobby" },
  { id: "s4", text: "HowarqLqUq joined the lobby" },
  { id: "m1", author: "cherwood", text: "gl hf everyone" },
  { id: "m2", author: "CallMeCallMeStar", text: "you too!" },
];

let idCounter = 100;

/** Interactive send demo — owns the message list in state; appends on send. */
export function ChatPanelInteractiveDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: String(idCounter++), author: "You", text },
    ]);
  }

  return (
    <div className="h-48 w-64 border border-gold-5 bg-hextech-black">
      <ChatPanel messages={messages} onSend={handleSend} />
    </div>
  );
}
