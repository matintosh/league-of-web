"use client";

import { useState } from "react";
import { demoHeroSlides } from "@low/fixtures";
import { HeroCarousel } from "./hero-carousel";

/** Multi-slide interactive demo — dot click advances the active slide. */
export function HeroCarouselMultiSlideDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      <HeroCarousel
        slides={demoHeroSlides}
        activeIndex={activeIndex}
        onSlideChange={setActiveIndex}
      />
      <p className="font-body text-xs text-grey-2">
        Slide {activeIndex + 1} of {demoHeroSlides.length} — {demoHeroSlides[activeIndex]?.skinLine}
      </p>
    </div>
  );
}

/** Single-slide demo — only one dot rendered, no navigation needed. */
export function HeroCarouselSingleSlideDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const singleSlide = demoHeroSlides.slice(0, 1);
  return (
    <div className="flex flex-col gap-2">
      <HeroCarousel
        slides={singleSlide}
        activeIndex={activeIndex}
        onSlideChange={setActiveIndex}
      />
      <p className="font-body text-xs text-grey-2">
        Single slide — one dot rendered, no navigation.
      </p>
    </div>
  );
}
