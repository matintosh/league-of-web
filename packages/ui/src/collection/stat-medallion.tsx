
// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface StatMedallionProps {
  /** Displayed number/text in center, e.g. "4" or "147" */
  value: string | number;
  /** Short caption inside ring, e.g. "TOTAL SKINS OWNED" */
  caption: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIZE = 150;
const CX = 75;
const CY = 75;
const OUTER_R = 70;
const INNER_R = 62;
const FINIAL = 5; // full side of the 5×5 rotated square

// Cardinal point coordinates for diamond finials on the outer ring
const FINIALS: Array<{ x: number; y: number }> = [
  { x: CX,          y: CY - OUTER_R }, // N
  { x: CX,          y: CY + OUTER_R }, // S
  { x: CX + OUTER_R, y: CY          }, // E
  { x: CX - OUTER_R, y: CY          }, // W
];

// ---------------------------------------------------------------------------
// StatMedallion
// ---------------------------------------------------------------------------

/**
 * StatMedallion — circular ornate stat emblem from the collection sidebar.
 *
 * SVG double-ring with diamond finials at N/E/S/W; big number + caption
 * centred via absolute positioning. Purely presentational — no event handlers.
 */
export function StatMedallion({ value, caption }: StatMedallionProps) {

  return (
    <div
      className="relative inline-block"
      style={{ width: SIZE, height: SIZE }}
      aria-label={`${caption}: ${value}`}
    >
      {/* Decorative SVG rings + finials */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox="0 0 150 150"
        aria-hidden="true"
        className="absolute inset-0"
      >
        {/* Outer ring */}
        <circle
          cx={CX}
          cy={CY}
          r={OUTER_R}
          fill="none"
          stroke="var(--color-gold-4)"
          strokeWidth={1}
        />

        {/* Inner ring */}
        <circle
          cx={CX}
          cy={CY}
          r={INNER_R}
          fill="none"
          stroke="var(--color-gold-4)"
          strokeWidth={1}
        />

        {/* Diamond finials — 5×5px squares rotated 45° at N/E/S/W */}
        {FINIALS.map(({ x, y }, i) => (
          <rect
            key={i}
            x={x - FINIAL / 2}
            y={y - FINIAL / 2}
            width={FINIAL}
            height={FINIAL}
            fill="var(--color-gold-4)"
            transform={`rotate(45, ${x}, ${y})`}
          />
        ))}
      </svg>

      {/* Text content — absolutely centred over the SVG */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span className="font-display text-4xl text-gold-2 leading-none">
          {value}
        </span>
        <span className="mt-1 text-xs uppercase tracking-widest text-grey-1 leading-tight">
          {caption}
        </span>
      </div>
    </div>
  );
}
