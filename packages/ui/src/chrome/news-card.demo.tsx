"use client";
import { useState } from "react";
import { NewsCard } from "./news-card";
import { championSplashUrl } from "@low/fixtures";

export function NewsCardDemo() {
  const [clicks, setClicks] = useState(0);
  return (
    <div className="w-80">
      <NewsCard
        category="GAME UPDATES"
        date="6/23/2026"
        title="League of Legends Patch 26.13 Notes"
        description="Absolutely no demons allowed. — Locke"
        imageSrc={championSplashUrl("Ahri")}
        onOpen={() => setClicks((c) => c + 1)}
      />
      {clicks > 0 && (
        <p className="font-body text-sm text-gold-1 mt-2">Opened {clicks} time{clicks !== 1 ? "s" : ""}</p>
      )}
    </div>
  );
}
