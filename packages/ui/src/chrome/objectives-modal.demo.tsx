"use client";

import { useState } from "react";
import { DEMO_OBJECTIVES } from "@low/fixtures";
import { HextechButton } from "./hextech-button";
import { ObjectivesModal } from "./objectives-modal";

/**
 * Interactive demo — a trigger button opens the Objectives modal as an overlay
 * over a relative stage. Category selection is wired to local state so the gold
 * active bar moves; Escape / ✕ / backdrop all close it.
 */
export function ObjectivesModalDemo() {
  const [open, setOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(
    DEMO_OBJECTIVES.activeCategoryId,
  );

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ width: "100%", height: 620, backgroundColor: "var(--color-blue-8)" }}
    >
      <HextechButton onClick={() => setOpen(true)}>Open Objectives</HextechButton>

      <ObjectivesModal
        open={open}
        header={DEMO_OBJECTIVES.header}
        bxp={DEMO_OBJECTIVES.bxp}
        categories={DEMO_OBJECTIVES.categories}
        activeCategoryId={activeCategoryId}
        sectionLabel={DEMO_OBJECTIVES.sectionLabel}
        sectionCount={DEMO_OBJECTIVES.sectionCount}
        missions={DEMO_OBJECTIVES.missions}
        onSelectCategory={setActiveCategoryId}
        onClose={() => setOpen(false)}
        onBackdropClick={() => setOpen(false)}
      />
    </div>
  );
}

/**
 * Always-open static snapshot contained in a relative stage so it does not
 * overlay the showcase page. Category selection is interactive.
 */
export function ObjectivesModalStaticDemo() {
  const [activeCategoryId, setActiveCategoryId] = useState(
    DEMO_OBJECTIVES.activeCategoryId,
  );

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: "100%", height: 620, backgroundColor: "var(--color-blue-8)" }}
    >
      <ObjectivesModal
        open
        header={DEMO_OBJECTIVES.header}
        bxp={DEMO_OBJECTIVES.bxp}
        categories={DEMO_OBJECTIVES.categories}
        activeCategoryId={activeCategoryId}
        sectionLabel={DEMO_OBJECTIVES.sectionLabel}
        sectionCount={DEMO_OBJECTIVES.sectionCount}
        missions={DEMO_OBJECTIVES.missions}
        onSelectCategory={setActiveCategoryId}
      />
    </div>
  );
}

/**
 * Static snapshot with the "Daily" category active — a completed category
 * (gold check). Demonstrates the empty/short mission list and the active-bar
 * position at the top of the rail.
 */
export function ObjectivesModalDailyDemo() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: "100%", height: 620, backgroundColor: "var(--color-blue-8)" }}
    >
      <ObjectivesModal
        open
        header={DEMO_OBJECTIVES.header}
        bxp={DEMO_OBJECTIVES.bxp}
        categories={DEMO_OBJECTIVES.categories}
        activeCategoryId="daily"
        sectionLabel="Daily"
        sectionCount={1}
        missions={[DEMO_OBJECTIVES.missions[1]!]}
      />
    </div>
  );
}
