'use client';

import { useId } from "react";
import type { SlotId } from "@low/fixtures";

// ---------------------------------------------------------------------------
// EmoteWheel — ornate emote wheel editor.
//
// Central circular region (~330px outer diameter) displays a double gold ring
// plus a separate thin outer halo ring carrying radial tick-marks, with 4
// quadrant arc slots (N/E/S/W) separated by diagonal double-line channel
// spokes, square bracket ornaments at the 4 spoke↔ring junctions, and a small
// center slot circle in the middle.
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
// Halo ring + tick decorations
//
// Reference (docs/reference/client-emote-wheel-frame-detail.png, 1:1 with
// native 1920×1080): the wheel-body ring sits at native radius ≈217px and a
// separate thin outer "halo" ring sits at native radius ≈227px — ~10px beyond
// the body, with a dark gap carrying short radial tick-marks. Our body ring is
// WHEEL_R = 165, so the native→render scale is 165/217 ≈ 0.760; the 10px halo
// gap scales to ≈8px, giving a halo radius of ≈173.
// ---------------------------------------------------------------------------

/** Radial gap between the wheel-body outer ring and the halo ring (~10px native × 0.76). */
const HALO_GAP = 8;
/** Radius of the thin outer halo ring. */
const HALO_R = WHEEL_R + HALO_GAP;
/** Stroke width for the halo ring (thin, faint). */
const HALO_STROKE = 1;

/** Number of radial tick-marks around the halo arcs. */
const TICK_COUNT = 96;
/** Inner radius where each tick begins (just outside the wheel-body ring). */
const TICK_INNER_R = WHEEL_R + 1;
/** Outer radius where each tick ends (just inside the halo ring). */
const TICK_OUTER_R = HALO_R - 1;

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
 * JunctionBracket — square bracket ornament at a spoke↔ring junction.
 *
 * Reference shows a small open square (▢) seated on the wheel-body ring at each
 * of the 4 diagonal spoke junctions, with a short inward foot where the spoke
 * channel meets it (not a rotated diamond on a compass point). The square is
 * axis-aligned; `angleDeg` places it around the ring (0 = top, clockwise) and
 * the foot points radially inward toward the wheel center.
 *
 * Native square ≈15px × 0.76 render scale ≈ 11px.
 */
function JunctionBracket({
  angleDeg,
  size = 13,
}: {
  angleDeg: number;
  size?: number;
}) {
  // Seat the square centre just inside the body ring so it straddles the rim.
  const seatR = WHEEL_R - RING_STROKE / 2 - size / 2 + 1;
  const c = polar(seatR, angleDeg);
  // Foot: a short stub from the inner edge of the square toward the centre.
  const footOuter = polar(seatR - size / 2, angleDeg);
  const footInner = polar(seatR - size / 2 - size * 0.5, angleDeg);
  return (
    <g>
      <rect
        x={c.x - size / 2}
        y={c.y - size / 2}
        width={size}
        height={size}
        fill="none"
        stroke="var(--color-gold-3)"
        strokeWidth={1.25}
      />
      <line
        x1={footOuter.x}
        y1={footOuter.y}
        x2={footInner.x}
        y2={footInner.y}
        stroke="var(--color-gold-3)"
        strokeWidth={1.25}
      />
    </g>
  );
}

/**
 * HaloTicks — short radial hash-marks filling the gap between the wheel-body
 * ring and the outer halo ring, matching the tick decorations on the reference
 * halo arcs. Drawn as a single ring of evenly spaced radial strokes.
 */
function HaloTicks() {
  const marks = [];
  for (let i = 0; i < TICK_COUNT; i++) {
    const deg = (360 / TICK_COUNT) * i;
    const a = polar(TICK_INNER_R, deg);
    const b = polar(TICK_OUTER_R, deg);
    marks.push(
      <line
        key={i}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke="var(--color-gold-4)"
        strokeWidth={0.75}
        opacity={0.6}
      />
    );
  }
  return <g>{marks}</g>;
}

/**
 * ChannelSpoke — a double parallel gold line forming a dark channel/trough
 * running along a diagonal from the center circle out to the wheel-body ring.
 * Reference spokes are two strokes with a dark centre (not a single line),
 * widening slightly toward the rim.
 */
function ChannelSpoke({ angleDeg }: { angleDeg: number }) {
  // Perpendicular offset (px) that separates the two parallel lines. Narrow at
  // the inner end, wider at the rim to read as a widening channel.
  const innerHalf = 1.8;
  const outerHalf = 4.5;
  const innerR = INNER_ARC_R;
  const outerR = OUTER_ARC_R;
  const perp = angleDeg + 90;
  const iA = polar(innerR, angleDeg);
  const oA = polar(outerR, angleDeg);
  // Offset endpoints along the perpendicular direction.
  const off = (base: { x: number; y: number }, half: number, sign: number) => {
    const a = ((perp - 90) * Math.PI) / 180;
    return { x: base.x + sign * half * Math.cos(a), y: base.y + sign * half * Math.sin(a) };
  };
  const l1i = off(iA, innerHalf, +1);
  const l1o = off(oA, outerHalf, +1);
  const l2i = off(iA, innerHalf, -1);
  const l2o = off(oA, outerHalf, -1);
  return (
    <g>
      <line
        x1={l1i.x}
        y1={l1i.y}
        x2={l1o.x}
        y2={l1o.y}
        stroke="var(--color-gold-4)"
        strokeWidth={1.25}
      />
      <line
        x1={l2i.x}
        y1={l2i.y}
        x2={l2o.x}
        y2={l2o.y}
        stroke="var(--color-gold-4)"
        strokeWidth={1.25}
      />
    </g>
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

  // Quadrant arc angles (degrees, 0 = top/north). Arcs are centred on the four
  // compass points (N/E/S/W) so the quadrant boundaries — and thus the spoke
  // channels + junction brackets — fall on the diagonals, matching the
  // reference wheel (client-emote-wheel-frame-detail.png).
  const QUADRANTS: Array<{ id: SlotId; start: number; end: number; label: string }> = [
    { id: "wheel-n", start: -45,  end:  45,  label: slotNames["wheel-n"]     ?? "North" },
    { id: "wheel-e", start:  45,  end: 135,  label: slotNames["wheel-e"]     ?? "East"  },
    { id: "wheel-s", start: 135,  end: 225,  label: slotNames["wheel-s"]     ?? "South" },
    { id: "wheel-w", start: 225,  end: 315,  label: slotNames["wheel-w"]     ?? "West"  },
  ];

  /** Diagonal angles where the spoke channels + junction brackets sit. */
  const SPOKE_ANGLES = [45, 135, 225, 315];

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
          {/* Reference quadrant fill samples rgb(14,17,22) — a near-neutral
              near-black; blue-8 (#0b0f18) is the closest token (blue-7 read
              too blue). */}
          <circle
            cx={centerCx}
            cy={centerCy}
            r={innerGoldRingR - 1}
            fill="var(--color-blue-8)"
          />

          {/* ---- Quadrant arc fills (dark arc areas) ---- */}
          {QUADRANTS.map(({ id, start, end }) => (
            <path
              key={`fill-${id}`}
              d={quadrantArcPath(start, end, INNER_ARC_R, OUTER_ARC_R)}
              fill={
                selectedSlot === id
                  ? "var(--color-blue-5)"
                  : "var(--color-blue-8)"
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

          {/* ---- Diagonal channel spokes (double parallel gold lines) ---- */}
          {SPOKE_ANGLES.map((deg) => (
            <ChannelSpoke key={`spoke-${deg}`} angleDeg={deg} />
          ))}

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

          {/* ---- Radial tick-marks in the halo gap ---- */}
          <HaloTicks />

          {/* ---- Outer halo ring (thin, ~8px beyond the body ring) ---- */}
          <circle
            cx={centerCx}
            cy={centerCy}
            r={HALO_R}
            fill="none"
            stroke="var(--color-gold-4)"
            strokeWidth={HALO_STROKE}
            opacity={0.85}
          />

          {/* ---- Square bracket ornaments at the 4 diagonal spoke junctions ---- */}
          {SPOKE_ANGLES.map((deg) => (
            <JunctionBracket key={`bracket-${deg}`} angleDeg={deg} />
          ))}

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
