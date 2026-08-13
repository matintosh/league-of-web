"use client";

/**
 * LandingHeroClient — stateful wrapper for UniverseHeroCarousel on the /universe landing.
 *
 * This is the only client boundary needed: it owns the `index` state and wires
 * onPrev/onNext so the controlled component can cycle slides.
 * All data (slides) is supplied by the server page; no fetching here.
 */

import { useState } from "react";
import { UniverseHeroCarousel } from "@low/ui";
import type { UniverseHeroSlide } from "@low/ui";

export interface LandingHeroClientProps {
  slides: UniverseHeroSlide[];
}

export function LandingHeroClient({ slides }: LandingHeroClientProps) {
  const [index, setIndex] = useState(0);

  const handlePrev = () =>
    setIndex((i) => ((i - 1) + slides.length) % slides.length);

  const handleNext = () =>
    setIndex((i) => (i + 1) % slides.length);

  return (
    <UniverseHeroCarousel
      slides={slides}
      index={index}
      onPrev={handlePrev}
      onNext={handleNext}
    />
  );
}
