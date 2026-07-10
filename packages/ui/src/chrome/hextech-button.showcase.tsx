import type { ShowcaseEntry } from "../showcase";
import { HextechButton } from "./hextech-button";

// Inline SVG sword icon for the icon-slot demo
function SwordIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4l16 16M4 4h6M4 4v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 4l5 5-9 9-3-1-1-3 9-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const hextechButtonShowcase: ShowcaseEntry = {
  slug: "hextech-button",
  name: "Hextech Button",
  area: "chrome",
  description:
    "The client's main call-to-action button — PLAY, confirm dialogs, store purchases. Notched hextech shape (6px 45° cuts) with border-wrapper clip-path technique.",
  variants: [
    {
      name: "Primary",
      render: () => <HextechButton>Play</HextechButton>,
    },
    {
      name: "Secondary",
      notes: 'variant="secondary" — cancel/back actions.',
      render: () => <HextechButton variant="secondary">Cancel</HextechButton>,
    },
    {
      name: "Large",
      notes: 'size="large" — the PLAY button in TopNavbar.',
      render: () => <HextechButton size="large">Play</HextechButton>,
    },
    {
      name: "Disabled",
      notes:
        "disabled prop — muted grey-3 border, flat grey-4 surface, grey-2 text. No pointer, no hover.",
      render: () => <HextechButton disabled>Play</HextechButton>,
    },
    {
      name: "Disabled Secondary",
      notes: "Secondary variant disabled state.",
      render: () => (
        <HextechButton variant="secondary" disabled>
          Cancel
        </HextechButton>
      ),
    },
    {
      name: "Pressed (active state)",
      notes:
        "CSS :active state — surface darkens (bg-blue-7 flat, no gradient), text drops to blue-4. Hold-click to observe. Cannot be captured as a static render.",
      render: () => <HextechButton>Hold to see pressed</HextechButton>,
    },
    {
      name: "With icon",
      notes:
        'icon prop — ReactNode rendered before children in a gap-2 flex, wrapped in aria-hidden span. Shown here with a 14px sword SVG.',
      render: () => (
        <HextechButton icon={<SwordIcon />}>Find Match</HextechButton>
      ),
    },
    {
      name: "With icon — large",
      notes: "Icon slot on size large.",
      render: () => (
        <HextechButton size="large" icon={<SwordIcon />}>
          Find Match
        </HextechButton>
      ),
    },
  ],
};
