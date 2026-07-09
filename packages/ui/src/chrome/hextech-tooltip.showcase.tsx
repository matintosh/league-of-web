import type { ShowcaseEntry } from "../showcase";
import { HextechTooltip } from "./hextech-tooltip";
import { HextechButton } from "./hextech-button";

export const hextechTooltipShowcase: ShowcaseEntry = {
  slug: "hextech-tooltip",
  name: "Hextech Tooltip",
  area: "chrome",
  description:
    "Pure-CSS hover tooltip used throughout the client for item descriptions, currency labels, nav-item hints, and ability tooltips.",
  variants: [
    {
      name: "Top (default)",
      notes: 'position="top" — panel appears above the trigger, caret points down.',
      render: () => (
        <div className="flex items-center justify-center py-16">
          <HextechTooltip content="This is a tooltip">
            <HextechButton>Hover me</HextechButton>
          </HextechTooltip>
        </div>
      ),
    },
    {
      name: "Bottom",
      notes: 'position="bottom" — panel appears below the trigger, caret points up.',
      render: () => (
        <div className="flex items-center justify-center py-16">
          <HextechTooltip content="This is a bottom tooltip" position="bottom">
            <HextechButton>Hover me</HextechButton>
          </HextechTooltip>
        </div>
      ),
    },
    {
      name: "Long Content",
      notes: "Tooltip wraps at max-w-xs and expands internally.",
      render: () => (
        <div className="flex items-center justify-center py-16">
          <HextechTooltip
            content="Infinity Edge — Your critical strikes deal 235% damage instead of 175%. This is a long description that should wrap at max-w-xs."
            position="top"
          >
            <HextechButton>Infinity Edge</HextechButton>
          </HextechTooltip>
        </div>
      ),
    },
    {
      name: "Rich ReactNode Content",
      notes: "content prop accepts ReactNode — multi-line with secondary muted text.",
      render: () => (
        <div className="flex items-center justify-center py-16">
          <HextechTooltip
            content={
              <div>
                <p className="text-gold-1">Flash</p>
                <p className="text-grey-1 text-xs mt-1">
                  Teleports your champion a short distance in the direction of your cursor.
                </p>
                <p className="text-grey-2 text-xs mt-1">Cooldown: 300s</p>
              </div>
            }
            position="top"
          >
            <HextechButton>Summoner Spell</HextechButton>
          </HextechTooltip>
        </div>
      ),
    },
  ],
};
