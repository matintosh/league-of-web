"use client";

import { useState } from "react";
import { SAMPLE_CHALLENGES } from "@low/fixtures";
import type { ChallengeCategory } from "@low/fixtures";
import { ChallengesScreen } from "./challenges-screen";

export function ChallengesScreenAllDemo() {
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory>("all");
  const filtered =
    activeCategory === "all"
      ? SAMPLE_CHALLENGES
      : SAMPLE_CHALLENGES.filter((c) => c.category === activeCategory);
  return (
    <div style={{ height: 500 }}>
      <ChallengesScreen
        totalScore={4725}
        scoreTier="silver"
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        challenges={filtered}
        onChallengeClick={(id) => console.log("clicked", id)}
      />
    </div>
  );
}

export function ChallengesScreenFilteredDemo() {
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory>("teamwork-strategy");
  const filtered =
    activeCategory === "all"
      ? SAMPLE_CHALLENGES
      : SAMPLE_CHALLENGES.filter((c) => c.category === activeCategory);
  return (
    <div style={{ height: 500 }}>
      <ChallengesScreen
        totalScore={4725}
        scoreTier="silver"
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        challenges={filtered}
        onChallengeClick={(id) => console.log("clicked", id)}
      />
    </div>
  );
}
