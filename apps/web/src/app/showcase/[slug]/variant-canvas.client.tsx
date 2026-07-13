"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Background = "dark" | "mid" | "light";

const BG_CLASSES: Record<Background, string> = {
  dark: "bg-blue-7",
  mid: "bg-blue-5",
  light: "bg-grey-3",
};

const BG_LABELS: Record<Background, string> = {
  dark: "Dark",
  mid: "Mid",
  light: "Light",
};

interface VariantCanvasProps {
  /** The rendered variant content — passed from the server component. */
  children: ReactNode;
  /**
   * Background options. The server component passes `variant.backgrounds ?? ["dark"]`.
   * When the array has < 2 entries no toggle is rendered.
   */
  backgrounds: Background[];
}

/**
 * Client island for the per-variant canvas background toggle.
 * The parent [slug]/page.tsx stays a server component — it calls variant.render()
 * and passes the result as children, so no function crosses the RSC boundary.
 */
export function VariantCanvas({ children, backgrounds }: VariantCanvasProps) {
  const [active, setActive] = useState<Background>(backgrounds[0] ?? "dark");

  return (
    <>
      {backgrounds.length > 1 && (
        <div className="mb-2 flex items-center gap-1">
          {backgrounds.map((bg) => (
            <button
              key={bg}
              onClick={() => setActive(bg)}
              className={[
                "rounded-sm border px-2 py-0.5 text-xs uppercase tracking-widest transition-colors",
                active === bg
                  ? "border-gold-3 bg-blue-5 text-gold-1"
                  : "border-gold-5 text-grey-2 hover:text-gold-2",
              ].join(" ")}
            >
              {BG_LABELS[bg]}
            </button>
          ))}
        </div>
      )}
      <div
        className={[
          "overflow-x-auto rounded-sm border border-grey-4 p-10",
          BG_CLASSES[active],
        ].join(" ")}
      >
        {children}
      </div>
    </>
  );
}
