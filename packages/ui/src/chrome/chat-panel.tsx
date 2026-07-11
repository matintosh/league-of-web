"use client";

import { useEffect, useRef, useState } from "react";

/** A single message in the chat log. */
export interface ChatMessage {
  id: string;
  /** Present for player-authored messages; absent for system messages. */
  author?: string;
  text: string;
}

/**
 * ChatPanelProps — fully controlled message list; optional send callback.
 */
export interface ChatPanelProps {
  /** Controlled list of messages to render. */
  messages: ChatMessage[];
  /**
   * Called when the user submits a non-empty message via Enter.
   * The component clears its draft after calling this.
   */
  onSend?: (text: string) => void;
  /** Placeholder shown in the empty input. Defaults to 'Type a message…'. */
  placeholder?: string;
}

/**
 * ChatPanel renders the lobby chat found in the bottom-left of the champ-select
 * loadout screen.
 *
 * Layout: scrollable message log on top + a single-line text input below.
 *
 * **State exception:** `draft` (the in-progress typed text) is intentional
 * internal `useState`. This is the ONE documented exception to the stateless
 * component rule: the draft is ephemeral UI state that has no meaning outside
 * the component and should not be lifted. All messages remain fully controlled
 * via the `messages` prop.
 *
 * Auto-scroll: a `useEffect` watches `messages` and scrolls the log container
 * to the bottom whenever a new message arrives. The effect uses a simple
 * `scrollTop = scrollHeight` assignment — no listeners or timers — so no
 * cleanup is required.
 */
export function ChatPanel({
  messages,
  onSend,
  placeholder = "Type a message…",
}: ChatPanelProps) {
  /** Ephemeral draft text — intentional internal state; see JSDoc above. */
  const [draft, setDraft] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the log to the bottom whenever messages change.
  useEffect(() => {
    const el = logRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setDraft("");
  }

  return (
    <div className="flex h-full w-full flex-col bg-hextech-black">
      {/* Message log */}
      <div
        ref={logRef}
        className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin"
      >
        {messages.map((msg) =>
          msg.author ? (
            // Authored message: "name: text"
            <p key={msg.id} className="text-xs leading-5 break-words">
              <span className="text-gold-cream font-body font-medium">
                {msg.author}:{" "}
              </span>
              <span className="text-grey-1">{msg.text}</span>
            </p>
          ) : (
            // System message (no author): grey, italicised
            <p
              key={msg.id}
              className="text-xs leading-5 break-words text-grey-2 italic"
            >
              {msg.text}
            </p>
          )
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-2 pb-2 pt-1">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Chat message input"
          className={[
            "w-full bg-hextech-black border border-gold-5",
            "px-2 py-1",
            "font-body text-xs text-gold-1",
            "placeholder:text-grey-2",
            "outline-none",
            "focus:border-gold-4 focus:shadow-[0_0_0_1px_var(--color-gold-4)]",
            "transition-colors duration-150",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
