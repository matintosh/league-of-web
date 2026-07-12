"use client";

import { ClubsEmptyState } from "./clubs-empty-state";

export function ClubsEmptyStateDefaultDemo() {
  return (
    <div className="h-[540px] w-full">
      <ClubsEmptyState
        onCreateClub={() => {}}
        onLearnMore={() => {}}
        onSummonerSearch={() => {}}
      />
    </div>
  );
}
