// ---------------------------------------------------------------------------
// MapCrestImg — shared atlas-crop primitive for CDragon map crest PNGs.
//
// CDragon parties-plugin map assets (map_sr.png, map_ha.png, map_tft.png,
// map_tt.png) are vertical two-frame atlases: the LIT (active) frame occupies
// the top half and the DARK (inactive) frame occupies the bottom half.
// A plain <img> renders both frames stacked — this component crops to one.
//
// Technique (established by #212 / mode-select CdragonMapCrest):
//   - outer <span>: overflow-hidden, size × size square
//   - inner <img>: absolute, inset-x-0, h-[200%] w-full, objectFit fill
//   - frame="active"   → top-0   (top half = lit frame)
//   - frame="inactive" → bottom-0 (bottom half = dark frame)
//
// The ~6% vertical squeeze on non-square atlases (tft: 68×128; tt: 136×256)
// is imperceptible at the small display sizes used in rail/header contexts
// (reviewer-judged acceptable in #212).
// ---------------------------------------------------------------------------

import type { CSSProperties } from "react";

export interface MapCrestImgProps {
  /** URL of the CDragon map crest atlas (two-frame vertical PNG). */
  src: string;
  /**
   * Which atlas frame to show.
   * "active" → top half (lit frame). Default.
   * "inactive" → bottom half (dark frame).
   */
  frame?: "active" | "inactive";
  /**
   * Side length of the square crop container in pixels.
   * Both width and height are set to this value.
   * Default: 36.
   */
  size?: number;
  /**
   * Optional className passed to the outer crop container <span>.
   * Useful for adding opacity transitions when stacking active + inactive frames.
   */
  className?: string;
}

/**
 * MapCrestImg — crops a CDragon two-frame map crest atlas to a single square frame.
 *
 * Renders an overflow-hidden container at `size×size` pixels with the atlas
 * image stretched to 200% height, anchored to show either the lit (active) or
 * dark (inactive) frame. aria-hidden and empty alt — decorative image only.
 *
 * Presentational: no data fetching, no state. Props in; nothing out.
 */
export function MapCrestImg({
  src,
  frame = "active",
  size = 36,
  className,
}: MapCrestImgProps) {
  const containerStyle: CSSProperties = {
    width: size,
    height: size,
  };

  const imgPositionClass = frame === "active" ? "top-0" : "bottom-0";

  return (
    <span
      aria-hidden="true"
      className={["relative block overflow-hidden", className].filter(Boolean).join(" ")}
      style={containerStyle}
    >
      <img
        src={src}
        alt=""
        className={`absolute inset-x-0 h-[200%] w-full ${imgPositionClass}`}
        style={{ objectFit: "fill" }}
      />
    </span>
  );
}
