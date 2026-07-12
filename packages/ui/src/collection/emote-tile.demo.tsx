'use client';

import { useState } from "react";
import { EmoteTile } from "./emote-tile";
import { profileIconUrl } from "@low/fixtures";

/** Interactive demo: click to select / deselect the emote tile. */
export function EmoteTileClickableDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="p-6 bg-hextech-black flex gap-4 items-start">
      <EmoteTile
        name="Thumbs Up"
        imageSrc={profileIconUrl(6402)}
        owned
        selected={selected}
        onSelect={() => setSelected((s) => !s)}
      />
      <span className="font-body text-xs text-grey-1 self-center">
        {selected ? "Selected — gold-2 border" : "Click to select"}
      </span>
    </div>
  );
}
