"use client";

import { useState } from "react";
import { UniverseHeroCarousel } from "./universe-hero-carousel";
import { championSplashUrl } from "@low/fixtures";

const SLIDES = [
  {
    overline: "THE ASHEN EXORCIST",
    title: "LOCKE",
    splashUrl: championSplashUrl("Senna"),
    href: "#",
  },
  {
    overline: "THE GRANDMASTER AT ARMS",
    title: "JHIN",
    splashUrl: championSplashUrl("Jhin"),
    href: "#",
  },
  {
    overline: "THE NINE-TAILED FOX",
    title: "AHRI",
    splashUrl: championSplashUrl("Ahri"),
    href: "#",
  },
  {
    overline: "THE STORM'S FURY",
    title: "JANNA",
    splashUrl: championSplashUrl("Janna"),
    href: "#",
  },
];

/** Interactive stateful demo for UniverseHeroCarousel. */
export function UniverseHeroCarouselDemo() {
  const [index, setIndex] = useState(0);

  function handlePrev() {
    setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }

  function handleNext() {
    setIndex((i) => (i + 1) % SLIDES.length);
  }

  return (
    <div
      className="w-full max-w-4xl"
      style={{ backgroundColor: "var(--color-universe-bg)" }}
    >
      <UniverseHeroCarousel
        slides={SLIDES}
        index={index}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelect={(i) => console.log("selected slide", i)}
      />
    </div>
  );
}
