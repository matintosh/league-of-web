import type { ShowcaseEntry } from "../showcase";
import {
  ModalFrameDemo,
  ModalFrameWithFooterDemo,
  ModalFrameWithoutFooterDemo,
  ModalFrameLongContentDemo,
} from "./modal-frame.demo";

export const modalFrameShowcase: ShowcaseEntry = {
  slug: "modal-frame",
  name: "Modal Frame",
  area: "chrome",
  description:
    "Hextech-styled modal dialog overlay — dark backdrop, gold double-border panel, title bar with close button, scrollable content area, and optional footer.",
  variants: [
    {
      name: "Open (interactive)",
      notes: "Controlled open state via useState in the demo component. Click the button to open; close via ✕ or backdrop.",
      render: () => <ModalFrameDemo />,
    },
    {
      name: "With footer",
      notes: "footer prop provided — renders border-t footer bar with action buttons.",
      render: () => <ModalFrameWithFooterDemo />,
    },
    {
      name: "Without footer",
      notes: "footer prop omitted — footer bar not rendered.",
      render: () => <ModalFrameWithoutFooterDemo />,
    },
    {
      name: "Long content (scroll)",
      notes: "Content overflows max-h-[60vh] — triggers overflow-y-auto scroll.",
      render: () => <ModalFrameLongContentDemo />,
    },
  ],
};
