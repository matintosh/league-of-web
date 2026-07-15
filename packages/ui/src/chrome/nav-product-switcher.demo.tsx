"use client";

import { useState } from "react";
import { NavProductSwitcher, type NavProduct } from "./nav-product-switcher";

/** The reference set — LEAGUE (active) · TFT · [R] LoR pill. */
const REFERENCE_PRODUCTS: NavProduct[] = [
  { id: "league", label: "LEAGUE" },
  { id: "tft", label: "TFT" },
  { id: "lor", label: "LoR", pill: true },
];

/**
 * Interactive switcher — click a tab to make it active. Mirrors the reference
 * left→right order (LEAGUE / TFT / [R] LoR).
 */
export function NavProductSwitcherReferenceDemo() {
  const [activeId, setActiveId] = useState("league");
  return (
    <NavProductSwitcher
      products={REFERENCE_PRODUCTS}
      activeId={activeId}
      onSelect={setActiveId}
    />
  );
}

/** TFT active — the middle text tab selected instead of LEAGUE. */
export function NavProductSwitcherTftActiveDemo() {
  const [activeId, setActiveId] = useState("tft");
  return (
    <NavProductSwitcher
      products={REFERENCE_PRODUCTS}
      activeId={activeId}
      onSelect={setActiveId}
    />
  );
}

/** LoR pill active — the gold pill in its selected treatment. */
export function NavProductSwitcherPillActiveDemo() {
  const [activeId, setActiveId] = useState("lor");
  return (
    <NavProductSwitcher
      products={REFERENCE_PRODUCTS}
      activeId={activeId}
      onSelect={setActiveId}
    />
  );
}

/**
 * Disabled LoR — the pragmatic routing case (issue #403): LoR has no
 * destination in our client, so the composing page marks it disabled while
 * LEAGUE and TFT stay interactive.
 */
export function NavProductSwitcherDisabledPillDemo() {
  const [activeId, setActiveId] = useState("league");
  return (
    <NavProductSwitcher
      products={[
        { id: "league", label: "LEAGUE" },
        { id: "tft", label: "TFT" },
        { id: "lor", label: "LoR", pill: true, disabled: true },
      ]}
      activeId={activeId}
      onSelect={setActiveId}
    />
  );
}
