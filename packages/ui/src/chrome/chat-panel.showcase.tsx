import type { ShowcaseEntry } from "../showcase";
import { ChatPanel } from "./chat-panel";
import { ChatPanelInteractiveDemo } from "./chat-panel.demo";

const SYSTEM_MESSAGES = [
  { id: "s1", text: "CallMeCallMeStar joined the lobby" },
  { id: "s2", text: "cherwood joined the lobby" },
  { id: "s3", text: "qLxHarlan joined the lobby" },
  { id: "s4", text: "HowarqLqUq joined the lobby" },
];

const MIXED_MESSAGES = [
  { id: "s1", text: "CallMeCallMeStar joined the lobby" },
  { id: "s2", text: "cherwood joined the lobby" },
  { id: "m1", author: "cherwood", text: "gl hf everyone" },
  { id: "m2", author: "CallMeCallMeStar", text: "you too!" },
  { id: "s3", text: "qLxHarlan joined the lobby" },
  { id: "m3", author: "qLxHarlan", text: "let's go!" },
];

export const chatPanelShowcase: ShowcaseEntry = {
  slug: "chat-panel",
  name: "Chat Panel",
  area: "chrome",
  description:
    "Scrollable lobby chat log (xs system + authored lines) with an Enter-to-send input.",
  referenceImage: "client-lobby-solo.jpg",
  referenceNote: "docs/reference/client-lobby-solo.jpg — the chat panel is the bottom-left box of the party lobby",
  variants: [
    {
      name: "System messages only",
      notes: "Grey italic lines for lobby join events — no authored messages.",
      render: () => (
        <div className="h-48 w-64 border border-gold-5 bg-hextech-black">
          <ChatPanel messages={SYSTEM_MESSAGES} />
        </div>
      ),
    },
    {
      name: "Mixed authors",
      notes:
        "Author name rendered in gold-cream followed by grey message text; system messages remain grey italic.",
      render: () => (
        <div className="h-48 w-64 border border-gold-5 bg-hextech-black">
          <ChatPanel messages={MIXED_MESSAGES} />
        </div>
      ),
    },
    {
      name: "Interactive send",
      notes:
        "Type in the input and press Enter — message appends with 'You' as author. Whitespace-only input is a no-op.",
      render: () => <ChatPanelInteractiveDemo />,
    },
  ],
};
