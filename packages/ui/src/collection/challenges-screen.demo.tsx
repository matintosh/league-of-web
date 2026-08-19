"use client";

import { useState } from "react";
import { SAMPLE_CHALLENGES, challengeCrystalVideoUrl } from "@low/fixtures";
import type { ChallengeCategory } from "@low/fixtures";
import { ChallengesScreen } from "./challenges-screen";
import type { CategoryScore } from "./challenges-screen";

// ---------------------------------------------------------------------------
// Sample per-category scores for the sidebar progress bars (issue #1046).
// ---------------------------------------------------------------------------

const SAMPLE_CATEGORY_SCORES: CategoryScore[] = [
  { category: "imagination",       current: 115, max: 200 },
  { category: "expertise",         current: 30,  max: 200 },
  { category: "teamwork-strategy", current: 60,  max: 200 },
  { category: "veterancy",         current: 30,  max: 200 },
  { category: "collection",        current: 40,  max: 200 },
  { category: "legacy",            current: 20,  max: 200 },
];

export function ChallengesScreenAllDemo() {
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const filtered =
    activeCategory === "all"
      ? SAMPLE_CHALLENGES
      : SAMPLE_CHALLENGES.filter((c) => c.category === activeCategory);

  return (
    <div style={{ height: 500 }}>
      <ChallengesScreen
        totalScore={4725}
        scoreTier="silver"
        crystalVideoSrc={challengeCrystalVideoUrl("silver")}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryScores={SAMPLE_CATEGORY_SCORES}
        challenges={filtered}
        onChallengeClick={(id) => console.log("clicked", id)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
      />
    </div>
  );
}

export function ChallengesScreenStaticCrystalDemo() {
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const filtered =
    activeCategory === "all"
      ? SAMPLE_CHALLENGES
      : SAMPLE_CHALLENGES.filter((c) => c.category === activeCategory);

  return (
    <div style={{ height: 500 }}>
      <ChallengesScreen
        totalScore={2350}
        scoreTier="bronze"
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryScores={SAMPLE_CATEGORY_SCORES}
        challenges={filtered}
        onChallengeClick={(id) => console.log("clicked", id)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
      />
    </div>
  );
}

export function ChallengesScreenFilteredDemo() {
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory>("teamwork-strategy");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

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
        categoryScores={SAMPLE_CATEGORY_SCORES}
        challenges={filtered}
        onChallengeClick={(id) => console.log("clicked", id)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
      />
    </div>
  );
}
