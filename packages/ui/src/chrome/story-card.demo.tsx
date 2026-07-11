"use client";

import { useState } from "react";
import { StoryCard } from "./story-card";
import { loadingArtUrl } from "@low/fixtures";

export function StoryCardDemo() {
  const [opens, setOpens] = useState(0);
  return (
    <div className="w-48">
      <StoryCard
        eyebrow="Ahri"
        title="The Nine-Tailed Fox"
        mediaType="Short Story"
        date="June 2026"
        imageSrc={loadingArtUrl("Ahri")}
        onOpen={() => setOpens((n) => n + 1)}
      />
      {opens > 0 && (
        <p className="font-body text-sm text-gold-1 mt-2">
          Opened {opens} time{opens !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
