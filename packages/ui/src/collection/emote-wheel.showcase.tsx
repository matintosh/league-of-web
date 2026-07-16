import type { ShowcaseEntry } from "../showcase";
import {
  EmoteWheelEmptyDemo,
  EmoteWheelPopulatedDemo,
  EmoteWheelHighlightedDemo,
  EmoteWheelAssignDemo,
} from "./emote-wheel.demo";

// All EmoteWheel variants use demo client components because EmoteWheel is
// 'use client' and requires an onSlotClick function prop — functions cannot
// be passed from server component render() to Client Component props.

export const emoteWheelShowcase: ShowcaseEntry = {
  slug: "emote-wheel",
  name: "Emote Wheel",
  area: "collection",
  description:
    "Ornate controlled emote wheel editor — central ~330px double-gold-ring wheel with N/E/S/W quadrant arc slots + center slot, and 4 satellite circles (Start, First Blood, Ace, Victory). Controlled: slots prop drives displayed art. NOTE: Uses profileIconUrl stand-ins for emote art (DDragon v16.13.1 has no emote art).",
  variants: [
    {
      name: "Empty wheel",
      notes:
        "All slots null — shows dark fill, double gold body ring, outer halo ring with radial tick-marks, diagonal channel spokes, and square bracket ornaments at the spoke junctions",
      render: () => <EmoteWheelEmptyDemo />,
    },
    {
      name: "Populated wheel",
      notes: "7 of 9 slots filled; Ace and Victory empty",
      render: () => <EmoteWheelPopulatedDemo />,
    },
    {
      name: "Slot highlighted",
      notes: "selectedSlot=center — center slot highlighted with blue-5 fill",
      render: () => <EmoteWheelHighlightedDemo />,
    },
    {
      name: "Interactive assign demo",
      notes:
        "Click a slot to select it, then click an emote in the inventory strip to assign. Demonstrates full assign flow: slot fills, SAVE enables; save → disables. Unowned emotes (dimmed) cannot be assigned.",
      render: () => <EmoteWheelAssignDemo />,
    },
  ],
};
