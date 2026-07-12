'use client';

import { useState } from "react";
import { EmoteWheel } from "./emote-wheel";
import { EmoteTile } from "./emote-tile";
import { HextechButton } from "../chrome/hextech-button";
import { demoEmotes, defaultEmoteSlots } from "@low/fixtures";
import type { SlotId } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Static demo wrappers — client components needed because EmoteWheel is
// 'use client' and requires an onSlotClick callback (non-serializable function).
// Even "static" showcase variants must wrap in a client component to avoid
// the "Event handlers cannot be passed to Client Component props" error.
// ---------------------------------------------------------------------------

const EMPTY_SLOTS: Record<SlotId, string | null> = {
  center:        null,
  "wheel-n":     null,
  "wheel-e":     null,
  "wheel-s":     null,
  "wheel-w":     null,
  start:         null,
  "first-blood": null,
  ace:           null,
  victory:       null,
};

const POPULATED_SLOTS: Record<SlotId, string | null> = { ...defaultEmoteSlots };

/** Empty wheel — all slots null, no interaction. */
export function EmoteWheelEmptyDemo() {
  return (
    <div className="p-8 bg-hextech-black flex justify-center">
      <EmoteWheel
        slots={EMPTY_SLOTS}
        onSlotClick={() => undefined}
      />
    </div>
  );
}

/** Populated wheel — 7/9 slots filled, no interaction. */
export function EmoteWheelPopulatedDemo() {
  return (
    <div className="p-8 bg-hextech-black flex justify-center">
      <EmoteWheel
        slots={POPULATED_SLOTS}
        onSlotClick={() => undefined}
      />
    </div>
  );
}

/** Highlighted slot — center slot selected, no interaction. */
export function EmoteWheelHighlightedDemo() {
  return (
    <div className="p-8 bg-hextech-black flex justify-center">
      <EmoteWheel
        slots={POPULATED_SLOTS}
        selectedSlot="center"
        onSlotClick={() => undefined}
      />
    </div>
  );
}

/**
 * EmoteWheelAssignDemo — interactive assign-flow demonstration.
 *
 * Flow: click a wheel slot → click an inventory emote → slot fills + SAVE enables.
 * Click SAVE → slots persist, SAVE disables (no pending changes).
 * Unowned emotes cannot be assigned (click is blocked).
 */
export function EmoteWheelAssignDemo() {
  const [slots, setSlots] = useState<Record<SlotId, string | null>>(defaultEmoteSlots);
  const [savedSlots, setSavedSlots] = useState<Record<SlotId, string | null>>(defaultEmoteSlots);
  const [selectedSlot, setSelectedSlot] = useState<SlotId | undefined>(undefined);
  const [selectedEmoteId, setSelectedEmoteId] = useState<string | undefined>(undefined);

  // Derive whether there are unsaved changes
  const hasChanges = JSON.stringify(slots) !== JSON.stringify(savedSlots);

  function handleSlotClick(slot: SlotId) {
    // If this slot is already selected, deselect it
    if (selectedSlot === slot) {
      setSelectedSlot(undefined);
      return;
    }
    setSelectedSlot(slot);

    // If an emote is already selected in inventory, assign it immediately
    if (selectedEmoteId) {
      const emote = demoEmotes.find((e) => e.id === selectedEmoteId);
      if (emote?.owned) {
        setSlots((prev) => ({ ...prev, [slot]: emote.imageSrc }));
        setSelectedSlot(undefined);
        setSelectedEmoteId(undefined);
      }
    }
  }

  function handleEmoteSelect(emoteId: string) {
    const emote = demoEmotes.find((e) => e.id === emoteId);
    if (!emote?.owned) return; // Unowned emotes cannot be assigned

    if (selectedEmoteId === emoteId) {
      setSelectedEmoteId(undefined);
      return;
    }
    setSelectedEmoteId(emoteId);

    // If a slot is already selected, assign to it immediately
    if (selectedSlot) {
      setSlots((prev) => ({ ...prev, [selectedSlot]: emote.imageSrc }));
      setSelectedSlot(undefined);
      setSelectedEmoteId(undefined);
    }
  }

  function handleSave() {
    console.log("Emote wheel saved", slots);
    setSavedSlots({ ...slots });
  }

  return (
    <div className="p-6 bg-hextech-black flex flex-col gap-4">
      <p className="font-body text-xs text-grey-1">
        Click a wheel slot, then click an owned emote to assign. Unowned emotes (dimmed) cannot be assigned.
      </p>

      <EmoteWheel
        slots={slots}
        selectedSlot={selectedSlot}
        onSlotClick={handleSlotClick}
      />

      {/* Mini inventory strip */}
      <div className="flex flex-wrap gap-2 justify-center">
        {demoEmotes.map((emote) => (
          <EmoteTile
            key={emote.id}
            name={emote.name}
            imageSrc={emote.imageSrc}
            owned={emote.owned}
            selected={selectedEmoteId === emote.id}
            onSelect={() => handleEmoteSelect(emote.id)}
          />
        ))}
      </div>

      {/* SAVE row */}
      <div className="flex justify-end gap-3 pt-2">
        <HextechButton
          variant="primary"
          disabled={!hasChanges}
          onClick={handleSave}
        >
          SAVE
        </HextechButton>
      </div>
    </div>
  );
}
