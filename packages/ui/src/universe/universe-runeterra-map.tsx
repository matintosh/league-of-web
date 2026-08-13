"use client";

/**
 * UniverseRuneterraMap — interactive Map of Runeterra for the Universe surface.
 *
 * A faithful fan-recreation of map.leagueoflegends.com: an intro state
 * ("EXPLORE & DISCOVER / RUNETERRA" + "BEGIN EXPLORING") that reveals a
 * pannable / zoomable world map with region markers. The base map atmosphere is
 * evoked with Hextech/Universe tokens (Riot's WebGL base art is not re-hosted);
 * the region pin markers use the real public Map-of-Runeterra assets via
 * runeterraPinUrl() (Fan Content Policy, same basis as Data Dragon art).
 *
 * Interactive by nature → 'use client'. Region data comes in as props (no fetch).
 * Tokens-only. SVG ids via useId.
 */

import { useId, useRef, useState, useCallback } from "react";
import { runeterraPinUrl } from "@low/fixtures";
import type { RuneterraRegion } from "@low/fixtures";

export interface UniverseRuneterraMapProps {
  /** Region markers to place on the map (positions as % of map size). */
  regions: RuneterraRegion[];
  /** Fired when a region marker is activated. */
  onSelectRegion?: (region: RuneterraRegion) => void;
  /** Skip the intro overlay and start in the explore state. @default false */
  startExploring?: boolean;
}

const MIN_SCALE = 0.75;
const MAX_SCALE = 2.6;

export function UniverseRuneterraMap({
  regions,
  onSelectRegion,
  startExploring = false,
}: UniverseRuneterraMapProps) {
  const oceanId = useId();
  const landId = useId();
  const [exploring, setExploring] = useState(startExploring);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (!exploring) return;
    e.preventDefault();
    setScale((s) => clampScale(s - e.deltaY * 0.0015));
  }, [exploring]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!exploring) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setOffset({
      x: drag.current.ox + (e.clientX - drag.current.x),
      y: drag.current.oy + (e.clientY - drag.current.y),
    });
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const zoomBy = (d: number) => setScale((s) => clampScale(s + d));

  return (
    <div
      className="relative h-full w-full overflow-hidden select-none"
      style={{ backgroundColor: "var(--color-universe-bg)" }}
      onWheel={onWheel}
    >
      <style>{`
        @keyframes urmFade { from { opacity: 0 } to { opacity: 1 } }
        .urm-fade { animation: urmFade 500ms ease-out both; }
        @media (prefers-reduced-motion: reduce) { .urm-fade { animation: none } }
      `}</style>

      {/* ── Pan/zoom map layer ── */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "center",
          transition: dragging ? "none" : "transform 220ms ease-out",
          cursor: exploring ? (dragging ? "grabbing" : "grab") : "default",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* Ocean / atmosphere — layered token gradients evoke the Runeterra map */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(120% 90% at 50% 40%, color-mix(in srgb, var(--color-blue-6) 55%, transparent) 0%, transparent 60%)",
              "radial-gradient(90% 70% at 30% 70%, color-mix(in srgb, var(--color-blue-7) 70%, transparent) 0%, transparent 55%)",
              "linear-gradient(160deg, var(--color-universe-bg) 0%, var(--color-blue-7) 55%, var(--color-hextech-black) 100%)",
            ].join(","),
          }}
          aria-hidden="true"
        />
        {/* Subtle landmass wash + fog vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 45% at 48% 55%, color-mix(in srgb, var(--color-gold-5) 22%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id={oceanId} cx="50%" cy="45%" r="65%">
              <stop offset="70%" stopColor="transparent" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--color-hextech-black) 80%, transparent)" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${oceanId})`} />
        </svg>

        {/* ── Stylized landmasses — original abstract continent shapes (tokens),
             positioned so region markers sit on land. Not Riot's painted map. ── */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={landId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-gold-5)" />
              <stop offset="55%" stopColor="color-mix(in srgb, var(--color-gold-5) 60%, var(--color-hextech-black))" />
              <stop offset="100%" stopColor="var(--color-hextech-black)" />
            </linearGradient>
          </defs>
          <g
            fill={`url(#${landId})`}
            stroke="color-mix(in srgb, var(--color-gold-3) 45%, transparent)"
            strokeWidth="0.25"
            strokeLinejoin="round"
          >
            {/* Northern continent (Valoran) — Freljord / Noxus / Demacia / Piltover&Zaun */}
            <path d="M11,15 C22,10 42,11 51,19 C58,25 60,35 53,47 C45,54 28,52 20,45 C11,39 5,23 11,15 Z" />
            {/* Southern continent (Shurima) — Shurima / Ixtal */}
            <path d="M29,58 C40,53 55,57 57,68 C57,79 46,83 37,81 C28,79 24,66 29,58 Z" />
            {/* Ionia — eastern island */}
            <path d="M65,17 C74,14 83,21 81,30 C77,37 68,37 63,30 C60,24 60,20 65,17 Z" />
            {/* Bandle City — small isle */}
            <ellipse cx="58" cy="38" rx="4.5" ry="3.2" />
            {/* Bilgewater — island cluster */}
            <ellipse cx="65" cy="50" rx="6" ry="4" />
            {/* Shadow Isles — cursed SE isle */}
            <path d="M73,65 C80,63 87,70 84,77 C80,81 73,79 71,73 C70,70 70,67 73,65 Z" />
            {/* Targon — western peak coast */}
            <path d="M9,57 C16,54 21,61 19,71 C16,78 8,76 7,69 C6,63 5,59 9,57 Z" />
          </g>
        </svg>

        {/* ── Region markers ── */}
        {regions.map((r) => {
          const pin = r.pin ?? "capital";
          const isHover = hovered === r.name;
          return (
            <button
              key={r.name}
              type="button"
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              style={{
                left: `${r.x}%`,
                top: `${r.y}%`,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseEnter={() => setHovered(r.name)}
              onMouseLeave={() => setHovered((h) => (h === r.name ? null : h))}
              onClick={() => onSelectRegion?.(r)}
              aria-label={r.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={runeterraPinUrl(pin, isHover)}
                alt=""
                aria-hidden="true"
                width={isHover ? 34 : 28}
                height={isHover ? 34 : 28}
                style={{ transition: "width 120ms, height 120ms", pointerEvents: "none" }}
              />
              <span
                className="font-display uppercase whitespace-nowrap"
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  color: isHover ? "var(--color-gold-1)" : "var(--color-gold-2)",
                  textShadow:
                    "0 1px 6px color-mix(in srgb, var(--color-hextech-black) 85%, transparent)",
                  transition: "color 120ms",
                }}
              >
                {r.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Zoom controls (explore only) ── */}
      {exploring && (
        <div className="absolute bottom-6 left-6 flex flex-col gap-2">
          {[
            { d: 0.3, label: "Zoom in", glyph: "+" },
            { d: -0.3, label: "Zoom out", glyph: "−" },
          ].map((z) => (
            <button
              key={z.label}
              type="button"
              aria-label={z.label}
              onClick={() => zoomBy(z.d)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-4 hover:border-gold-2 transition-colors"
              style={{
                background: "color-mix(in srgb, var(--color-hextech-black) 55%, transparent)",
                color: "var(--color-gold-1)",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
              }}
            >
              {z.glyph}
            </button>
          ))}
        </div>
      )}

      {/* ── Intro overlay ── */}
      {!exploring && (
        <div
          className="urm-fade absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 50%, transparent 0%, color-mix(in srgb, var(--color-hextech-black) 55%, transparent) 100%)",
          }}
        >
          <p
            className="uppercase"
            style={{
              fontSize: "12px",
              letterSpacing: "0.32em",
              color: "var(--color-gold-2)",
              fontFamily: "var(--font-body)",
            }}
          >
            Explore &amp; Discover
          </p>
          <h1
            className="font-display uppercase"
            style={{
              fontSize: "clamp(44px, 8vw, 88px)",
              letterSpacing: "0.14em",
              color: "var(--color-universe-story-ink)",
              lineHeight: 1,
              textShadow:
                "0 3px 18px color-mix(in srgb, var(--color-hextech-black) 70%, transparent)",
            }}
          >
            Runeterra
          </h1>
          <button
            type="button"
            onClick={() => setExploring(true)}
            className="mt-2 border border-gold-3 px-6 py-2 font-display uppercase transition-colors hover:bg-gold-3/10"
            style={{
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: "var(--color-gold-1)",
              background: "color-mix(in srgb, var(--color-hextech-black) 40%, transparent)",
              cursor: "pointer",
            }}
          >
            Begin Exploring
          </button>
        </div>
      )}
    </div>
  );
}
