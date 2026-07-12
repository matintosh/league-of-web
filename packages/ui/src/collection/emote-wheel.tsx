'use client';

import { useId } from "react";
import type { SlotId } from "@low/fixtures";

// ---------------------------------------------------------------------------
// EmoteWheel — ornate emote wheel editor.
//
// Central circular region (~330px outer diameter) displays a double gold ring
// with 4 quadrant arc slots (N/E/S/W) separated by gold cross-spokes, plus a
// small center slot circle in the middle.
//
// 4 satellite circles (~90px, double gold ring) are labeled:
//   Start · First Blood · Ace · Victory (display-xs uppercase)
// positioned to the left, top-right, bottom-right, right of the main wheel.
//
// Slots: empty = dark fill; filled = circular-clipped emote img.
// Interaction: controlled — parent tracks slot assignments via onSlotClick.
//
// ASSET DIVERGENCE: Uses profileIconUrl stand-ins as emote art. Documented in
// packages/fixtures/src/emotes.ts.
//
// useId() used for all SVG clipPath/mask ids to prevent collisions when
// multiple EmoteWheel instances render on the same page (showcase).
// ---------------------------------------------------------------------------

export interface EmoteWheelProps {
  /**
   * Current emote image URLs assigned to each slot, keyed by SlotId.
   * null means the slot is empty (shows dark fill).
   */
  slots: Record<SlotId, string | null>;
  /** The slot currently highlighted / awaiting assignment. */
  selectedSlot?: SlotId;
  /** Called when the user clicks a slot button. */
  onSlotClick: (slot: SlotId) => void;
  /** Emote name lookup — used for aria-labels on filled slots. */
  slotNames?: Partial<Record<SlotId, string>>;
}

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

/** Outer radius of the large central wheel SVG frame (px). */
const WHEEL_R = 165;
/** The SVG viewBox dimension = 2 × WHEEL_R */
const WHEEL_SIZE = WHEEL_R * 2;

/** Outer radius of the satellite circle frames (px). */
const SAT_R = 45;
const SAT_SIZE = SAT_R * 2;

/** Inner radius of the center slot circle (px, in the large SVG coords). */
const CENTER_R = 36;

/** Inner radius of the quadrant arc slots — just outside center circle. */
const INNER_ARC_R = CENTER_R + 8;

/** Outer radius of the quadrant arc slots — just inside inner gold ring. */
const OUTER_ARC_R = WHEEL_R - 22;

/** Stroke width for the outer gold ring. */
const RING_STROKE = 3;

/** Stroke width for the inner gold ring (thin). */
const INNER_RING_STROKE = 1.5;

/** Gap between the two gold rings. */
const RING_GAP = 6;

// ---------------------------------------------------------------------------
// SVG helpers
// ---------------------------------------------------------------------------

/** Convert polar (r, angleDeg) to Cartesian, centered in WHEEL_SIZE/2. */
function polar(r: number, angleDeg: number): { x: number; y: number } {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: WHEEL_R + r * Math.cos(a),
    y: WHEEL_R + r * Math.sin(a),
  };
}

/**
 * Build an SVG arc path string for a quadrant slice.
 * Each quadrant spans 90° but we leave a small gap (12°) for the spokes.
 */
function quadrantArcPath(
  startDeg: number,
  endDeg: number,
  innerR: number,
  outerR: number
): string {
  const GAP = 8; // degrees gap on each side for the cross-spoke
  const s = startDeg + GAP;
  const e = endDeg - GAP;

  const o1 = polar(outerR, s);
  const o2 = polar(outerR, e);
  const i2 = polar(innerR, e);
  const i1 = polar(innerR, s);

  const laf = e - s > 180 ? 1 : 0;

  return [
    `M ${o1.x} ${o1.y}`,
    `A ${outerR} ${outerR} 0 ${laf} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${innerR} ${innerR} 0 ${laf} 0 ${i1.x} ${i1.y}`,
    "Z",
  ].join(" ");
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * SmallFinial — tiny diamond accent at the 4 compass points of the outer ring.
 * Approximates the ornate corner decorations on the real wheel.
 */
function SmallFinial({
  cx,
  cy,
  size = 6,
}: {
  cx: number;
  cy: number;
  size?: number;
}) {
  return (
    <rect
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      fill="var(--color-gold-3)"
      transform={`rotate(45, ${cx}, ${cy})`}
    />
  );
}

// ---------------------------------------------------------------------------
// Slot button — shared between quadrant arcs and center + satellite circles
// ---------------------------------------------------------------------------

interface SlotButtonProps {
  slotId: SlotId;
  imageSrc: string | null;
  isSelected: boolean;
  name: string;
  onSlotClick: (s: SlotId) => void;
  /** SVG clipPath id for circular image masking. */
  clipPathId: string;
  /** Center coords in SVG coordinate space. */
  cx: number;
  cy: number;
  /** Radius of the circular slot area. */
  r: number;
}

/**
 * ArcSlotOverlay — invisible interactive overlay for a quadrant arc slot.
 * Renders a transparent SVG path that captures clicks for the arc area.
 * The visual arc is drawn separately; this sits on top.
 */
function ArcSlotOverlay({
  slotId,
  isSelected,
  name,
  onSlotClick,
  startDeg,
  endDeg,
}: {
  slotId: SlotId;
  isSelected: boolean;
  name: string;
  onSlotClick: (s: SlotId) => void;
  startDeg: number;
  endDeg: number;
}) {
  const path = quadrantArcPath(startDeg, endDeg, INNER_ARC_R, OUTER_ARC_R);
  return (
    <path
      d={path}
      fill="transparent"
      stroke={isSelected ? "var(--color-gold-2)" : "transparent"}
      strokeWidth={isSelected ? 2 : 0}
      role="button"
      aria-label={name}
      aria-pressed={isSelected}
      onClick={() => onSlotClick(slotId)}
      className="cursor-pointer"
      style={{ outline: "none" }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSlotClick(slotId);
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Satellite circle — circular slot outside the main wheel
// ---------------------------------------------------------------------------

interface SatelliteSlotProps {
  slotId: SlotId;
  label: string;
  imageSrc: string | null;
  isSelected: boolean;
  onSlotClick: (s: SlotId) => void;
  clipPathId: string;
}

function SatelliteSlot({
  slotId,
  label,
  imageSrc,
  isSelected,
  onSlotClick,
  clipPathId,
}: SatelliteSlotProps) {
  const cx = SAT_R;
  const cy = SAT_R;

  const outerRingR = SAT_R - RING_STROKE / 2;
  const innerRingR = outerRingR - RING_GAP;

  const imgR = innerRingR - 3;
  const fillR = innerRingR - 2;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Label above */}
      <span className="font-display text-[10px] uppercase tracking-widest text-grey-1 text-center leading-none">
        {label}
      </span>

      <button
        type="button"
        aria-label={label}
        aria-pressed={isSelected}
        onClick={() => onSlotClick(slotId)}
        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3 rounded-full"
        style={{ width: SAT_SIZE, height: SAT_SIZE }}
      >
        <svg
          width={SAT_SIZE}
          height={SAT_SIZE}
          viewBox={`0 0 ${SAT_SIZE} ${SAT_SIZE}`}
          aria-hidden="true"
          style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.7))" }}
        >
          <defs>
            <clipPath id={clipPathId}>
              <circle cx={cx} cy={cy} r={imgR} />
            </clipPath>
          </defs>

          {/* Dark fill circle */}
          <circle cx={cx} cy={cy} r={fillR} fill="var(--color-blue-6)" />

          {/* Emote image (if filled) */}
          {imageSrc && (
            <image
              href={imageSrc}
              x={cx - imgR}
              y={cy - imgR}
              width={imgR * 2}
              height={imgR * 2}
              clipPath={`url(#${clipPathId})`}
              preserveAspectRatio="xMidYMid slice"
            />
          )}

          {/* Selected highlight ring */}
          {isSelected && (
            <circle
              cx={cx}
              cy={cy}
              r={outerRingR + 1}
              fill="none"
              stroke="var(--color-gold-2)"
              strokeWidth={2}
              opacity={0.8}
            />
          )}

          {/* Outer gold ring */}
          <circle
            cx={cx}
            cy={cy}
            r={outerRingR}
            fill="none"
            stroke="var(--color-gold-3)"
            strokeWidth={RING_STROKE}
          />

          {/* Inner gold ring (thin) */}
          <circle
            cx={cx}
            cy={cy}
            r={innerRingR}
            fill="none"
            stroke="var(--color-gold-4)"
            strokeWidth={INNER_RING_STROKE}
          />
        </svg>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmoteWheel
// ---------------------------------------------------------------------------

/**
 * EmoteWheel — ornate controlled emote slot editor.
 *
 * Controlled: parent holds slot state and passes onSlotClick.
 * No drag-drop (out of scope for v1).
 *
 * Architecture note: the central wheel is a single SVG with arc quadrants,
 * cross-spokes, rings, and finials. Satellite slots use separate small SVGs
 * inside buttons, positioned via CSS grid/flex around the main SVG.
 */
export function EmoteWheel({
  slots,
  selectedSlot,
  onSlotClick,
  slotNames = {},
}: EmoteWheelProps) {
  const uid = useId();

  // Generate unique IDs for every clipPath to avoid SVG id collisions
  const clipIds: Record<SlotId, string> = {
    center:        `${uid}-clip-center`,
    "wheel-n":     `${uid}-clip-wn`,
    "wheel-e":     `${uid}-clip-we`,
    "wheel-s":     `${uid}-clip-ws`,
    "wheel-w":     `${uid}-clip-ww`,
    start:         `${uid}-clip-start`,
    "first-blood": `${uid}-clip-fb`,
    ace:           `${uid}-clip-ace`,
    victory:       `${uid}-clip-victory`,
  };

  // Quadrant arc angles (degrees, 0 = top/north)
  const QUADRANTS: Array<{ id: SlotId; start: number; end: number; label: string }> = [
    { id: "wheel-n", start: -90,  end:  0,   label: slotNames["wheel-n"]     ?? "North" },
    { id: "wheel-e", start:   0,  end:  90,  label: slotNames["wheel-e"]     ?? "East"  },
    { id: "wheel-s", start:  90,  end: 180,  label: slotNames["wheel-s"]     ?? "South" },
    { id: "wheel-w", start: 180,  end: 270,  label: slotNames["wheel-w"]     ?? "West"  },
  ];

  const centerCx = WHEEL_R;
  const centerCy = WHEEL_R;

  // Outer ring outer radius
  const outerRingR = WHEEL_R - RING_STROKE / 2;
  // Inner gold ring radius
  const innerGoldRingR = outerRingR - RING_GAP;

  // Image radius inside quadrant arcs (for SVG image clips)
  // We use the arc midpoint and a radius that covers the arc area nicely
  const arcImgR = (OUTER_ARC_R - INNER_ARC_R) / 2 - 2;

  function arcMid(startDeg: number, endDeg: number): { x: number; y: number } {
    const midDeg = (startDeg + endDeg) / 2;
    const midR = (INNER_ARC_R + OUTER_ARC_R) / 2;
    return polar(midR, midDeg);
  }

  return (
    <div
      className="flex flex-col items-center"
      style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.8))" }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Top satellite row: Start (left of wheel center line)               */}
      {/* Layout: [Start] [placeholder for top alignment] [First Blood]      */}
      {/* The wheel center is 330px wide; satellites are 90px each           */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex items-end justify-between"
        style={{ width: WHEEL_SIZE + SAT_SIZE * 2 + 24 }}
      >
        <SatelliteSlot
          slotId="start"
          label="Start"
          imageSrc={slots["start"]}
          isSelected={selectedSlot === "start"}
          onSlotClick={onSlotClick}
          clipPathId={clipIds["start"]}
        />
        <div style={{ width: SAT_SIZE }} /> {/* spacer center-top */}
        <SatelliteSlot
          slotId="first-blood"
          label="First Blood"
          imageSrc={slots["first-blood"]}
          isSelected={selectedSlot === "first-blood"}
          onSlotClick={onSlotClick}
          clipPathId={clipIds["first-blood"]}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main wheel row                                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center gap-3">
        {/* Left column placeholder (aligns with Start/Ace columns) */}
        <div style={{ width: SAT_SIZE }} />

        {/* Central wheel SVG */}
        <svg
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          aria-label="Emote wheel"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Clip path for center slot circle */}
            <clipPath id={clipIds["center"]}>
              <circle cx={centerCx} cy={centerCy} r={CENTER_R - 4} />
            </clipPath>

            {/* Clip paths for each quadrant arc image */}
            {QUADRANTS.map(({ id, start, end }) => {
              const mid = arcMid(start, end);
              return (
                <clipPath key={id} id={clipIds[id]}>
                  <circle cx={mid.x} cy={mid.y} r={arcImgR} />
                </clipPath>
              );
            })}
          </defs>

          {/* ---- Background fill ---- */}
          <circle
            cx={centerCx}
            cy={centerCy}
            r={innerGoldRingR - 1}
            fill="var(--color-blue-6)"
          />

          {/* ---- Quadrant arc fills (dark arc areas) ---- */}
          {QUADRANTS.map(({ id, start, end }) => (
            <path
              key={`fill-${id}`}
              d={quadrantArcPath(start, end, INNER_ARC_R, OUTER_ARC_R)}
              fill={
                selectedSlot === id
                  ? "var(--color-blue-5)"
                  : "var(--color-blue-7)"
              }
              className="transition-colors duration-150"
            />
          ))}

          {/* ---- Emote images in quadrant arcs ---- */}
          {QUADRANTS.map(({ id, start, end }) => {
            const img = slots[id];
            if (!img) return null;
            const mid = arcMid(start, end);
            return (
              <image
                key={`img-${id}`}
                href={img}
                x={mid.x - arcImgR}
                y={mid.y - arcImgR}
                width={arcImgR * 2}
                height={arcImgR * 2}
                clipPath={`url(#${clipIds[id]})`}
                preserveAspectRatio="xMidYMid slice"
              />
            );
          })}

          {/* ---- Gold cross-spokes (horizontal + vertical lines) ---- */}
          {/* Vertical spoke */}
          <line
            x1={centerCx}
            y1={centerCy - OUTER_ARC_R}
            x2={centerCx}
            y2={centerCy + OUTER_ARC_R}
            stroke="var(--color-gold-4)"
            strokeWidth={1.5}
          />
          {/* Horizontal spoke */}
          <line
            x1={centerCx - OUTER_ARC_R}
            y1={centerCy}
            x2={centerCx + OUTER_ARC_R}
            y2={centerCy}
            stroke="var(--color-gold-4)"
            strokeWidth={1.5}
          />

          {/* ---- Center circle slot ---- */}
          <circle
            cx={centerCx}
            cy={centerCy}
            r={CENTER_R}
            fill={
              selectedSlot === "center"
                ? "var(--color-blue-5)"
                : "var(--color-blue-7)"
            }
            stroke="var(--color-gold-3)"
            strokeWidth={1.5}
            className="transition-colors duration-150"
          />
          <circle
            cx={centerCx}
            cy={centerCy}
            r={CENTER_R - 5}
            fill="none"
            stroke="var(--color-gold-4)"
            strokeWidth={1}
          />

          {/* Center emote image */}
          {slots["center"] && (
            <image
              href={slots["center"]}
              x={centerCx - (CENTER_R - 4)}
              y={centerCy - (CENTER_R - 4)}
              width={(CENTER_R - 4) * 2}
              height={(CENTER_R - 4) * 2}
              clipPath={`url(#${clipIds["center"]})`}
              preserveAspectRatio="xMidYMid slice"
            />
          )}

          {/* ---- Outer gold ring (thick) ---- */}
          <circle
            cx={centerCx}
            cy={centerCy}
            r={outerRingR}
            fill="none"
            stroke="var(--color-gold-3)"
            strokeWidth={RING_STROKE}
          />

          {/* ---- Inner gold ring (thin) ---- */}
          <circle
            cx={centerCx}
            cy={centerCy}
            r={innerGoldRingR}
            fill="none"
            stroke="var(--color-gold-4)"
            strokeWidth={INNER_RING_STROKE}
          />

          {/* ---- Diamond finials at compass points on outer ring ---- */}
          <SmallFinial cx={centerCx}            cy={centerCy - outerRingR} />
          <SmallFinial cx={centerCx + outerRingR} cy={centerCy}            />
          <SmallFinial cx={centerCx}            cy={centerCy + outerRingR} />
          <SmallFinial cx={centerCx - outerRingR} cy={centerCy}            />

          {/* ---- Interactive arc overlays (on top, capture clicks) ---- */}
          {QUADRANTS.map(({ id, start, end, label }) => (
            <ArcSlotOverlay
              key={`overlay-${id}`}
              slotId={id}
              isSelected={selectedSlot === id}
              name={label}
              onSlotClick={onSlotClick}
              startDeg={start}
              endDeg={end}
            />
          ))}

          {/* ---- Center slot interactive overlay ---- */}
          <circle
            cx={centerCx}
            cy={centerCy}
            r={CENTER_R}
            fill="transparent"
            role="button"
            aria-label={slotNames["center"] ?? "Center"}
            aria-pressed={selectedSlot === "center"}
            onClick={() => onSlotClick("center")}
            className="cursor-pointer"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSlotClick("center");
            }}
          />
        </svg>

        {/* Right column placeholder */}
        <div style={{ width: SAT_SIZE }} />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom satellite row: Ace (left) and Victory (right)               */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex items-start justify-between"
        style={{ width: WHEEL_SIZE + SAT_SIZE * 2 + 24 }}
      >
        <SatelliteSlot
          slotId="ace"
          label="Ace"
          imageSrc={slots["ace"]}
          isSelected={selectedSlot === "ace"}
          onSlotClick={onSlotClick}
          clipPathId={clipIds["ace"]}
        />
        <div style={{ width: SAT_SIZE }} /> {/* spacer center-bottom */}
        <SatelliteSlot
          slotId="victory"
          label="Victory"
          imageSrc={slots["victory"]}
          isSelected={selectedSlot === "victory"}
          onSlotClick={onSlotClick}
          clipPathId={clipIds["victory"]}
        />
      </div>
    </div>
  );
}
