
// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** One icon + count entry in a tier-breakdown row. */
export interface TierEntry {
  /** Accessible label, e.g. "Legendary" */
  label: string;
  count: number;
  /** URL to the gem/currency icon image */
  iconSrc: string;
}

export interface StatMedallionProps {
  /** Displayed number/text in center, e.g. "4" or "147" */
  value: string | number;
  /** Short caption inside ring, e.g. "TOTAL SKINS OWNED" */
  caption: string;
  /**
   * Optional tier-breakdown rows rendered below the ring.
   * Each element is a row; each row contains one or more TierEntry items.
   * When omitted the medallion renders as before (no breakdown).
   */
  tierBreakdown?: TierEntry[][];
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
 *
 * When `tierBreakdown` is supplied, one or more icon+count rows are rendered
 * below the ring (Skins sidebar gem rows). Call sites that don't pass the prop
 * are unaffected.
 */
export function StatMedallion({ value, caption, tierBreakdown }: StatMedallionProps) {

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Ring medallion */}
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

      {/* Tier-breakdown rows — only rendered when the prop is provided */}
      {tierBreakdown && tierBreakdown.length > 0 && (
        <div className="flex flex-col items-center gap-3 w-full">
          {tierBreakdown.map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-end justify-center gap-4">
              {row.map((entry) => (
                <div
                  key={entry.label}
                  className="flex flex-col items-center gap-1"
                >
                  <img
                    src={entry.iconSrc}
                    alt={entry.label}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  <span className="font-body text-xs text-grey-1 leading-none">
                    {entry.count}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
