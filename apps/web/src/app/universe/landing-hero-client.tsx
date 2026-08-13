"use client";

/**
 * LandingHeroClient — stateful wrapper for UniverseHeroCarousel on the /universe landing.
 *
 * Owns the `index` state, wires onPrev/onNext, and AUTO-ADVANCES the carousel
 * (~6s) like the real site — pausing on hover/focus and resetting the timer on
 * manual navigation. Honors prefers-reduced-motion (no auto-advance when set).
 * All data (slides) is supplied by the server page; no fetching here.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { UniverseHeroCarousel } from "@low/ui";
import type { UniverseHeroSlide } from "@low/ui";

export interface LandingHeroClientProps {
  slides: UniverseHeroSlide[];
  /** Auto-advance interval in ms. @default 6000 */
  intervalMs?: number;
}

export function LandingHeroClient({
  slides,
  intervalMs = 6000,
}: LandingHeroClientProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % slides.length),
    [slides.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + slides.length) % slides.length),
    [slides.length],
  );

  // Auto-advance — paused on hover/focus, disabled for reduced-motion / single slide.
  const nextRef = useRef(next);
  nextRef.current = next;
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => nextRef.current(), intervalMs);
    return () => window.clearInterval(id);
  }, [paused, intervalMs, slides.length, index]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <UniverseHeroCarousel
        slides={slides}
        index={index}
        onPrev={prev}
        onNext={next}
      />
    </div>
  );
}
