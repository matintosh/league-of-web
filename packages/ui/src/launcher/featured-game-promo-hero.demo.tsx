"use client";

/**
 * FeaturedGamePromoHeroDemo — wraps FeaturedGamePromoHero with a live CTA
 * click handler. Client component kept separate so the showcase file stays
 * server-safe (no 'use client').
 */

import { useState } from "react";
import { FeaturedGamePromoHero } from "./featured-game-promo-hero";
import type { FeaturedGamePromoHeroProps } from "./featured-game-promo-hero";

export function FeaturedGamePromoHeroDemo(
  props: Omit<FeaturedGamePromoHeroProps, "onCta">
) {
  const [clicked, setClicked] = useState(false);

  return (
    <div style={{ fontFamily: "var(--font-launcher)" }}>
      <FeaturedGamePromoHero {...props} onCta={() => setClicked(true)} />
      {clicked && (
        <p
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "var(--color-launcher-text-muted)",
          }}
        >
          onCta fired!
        </p>
      )}
    </div>
  );
}
