"use client";

/**
 * DeclareIntentScreen — champ-select declare-intent (position assignment) phase.
 *
 * This is the very first champ-select beat, before bans: the Summoner's Rift
 * map is revealed, each assigned role's lane lights up, and a pin drops onto
 * each lane (the local player's pin is visually distinct). While this plays the
 * team is "declaring intent" — passively announcing the champion they intend to
 * play. The phase auto-advances (parent-driven timer) into the ban phase.
 *
 * Reference: docs/reference/client-champ-select-declare-intent.png (1200×675).
 * Zone anatomy (measured from the reference, normalized to our 1280×720 frame):
 *   - Header  (top)     — "DECLARE YOUR CHAMPION!" + countdown (CountdownHeader)
 *   - Roster  (left)    — ~220px column, 5 role rows; the active row shows a
 *                         "Declaring Intent" sublabel + a teal ◀N timer chip
 *   - Map     (center)  — map-intro video stage; per-role lane paths + pins
 *   - Tray    (bottom)  — collapsed loadout tray (runes dropdown, spell/emote
 *                         slots) — VISUAL ONLY (reuses ChampSelectActionBar)
 *   - Queue label (bottom-right) — e.g. "5V5 / RANKED SOLO/DUO"
 *
 * ── Video composition (probed 2026-07-14) ──────────────────────────────────
 * All clips live under the champ-select plugin `video/` subtree (NOT
 * static-assets/videos) and stream from CommunityDragon (206 video/webm):
 *   - map-{north,south}-intro.webm   1280×720, OPAQUE — the base stage reveal,
 *                                    played ONCE (the hero centerpiece).
 *   - path_{side}_{top,jungle,mid,bot}.webm  264×214, ALPHA — a glowing cyan
 *                                    lane light-up, one-shot, per assigned role.
 *                                    NOTE: there is NO support path (catalog has
 *                                    exactly 8 paths). Support gets pin-only.
 *   - pin_intro(fixed).webm          86×506,  ALPHA — an ally pin dropping in.
 *   - pin_me_intro(fixed).webm       138×532, ALPHA — the local player's pin
 *                                    (gold-accented, wider) dropping in.
 *   (parens must be percent-encoded — the fixture helper encodes them.)
 *
 * The path/pin clips are straight-alpha overlays registered onto lane anchor
 * points on the map. Riot bakes exact per-lane coordinates we don't have, so we
 * anchor each overlay at a normalized lane point measured from the settled map
 * frame (see LANE_ANCHORS). This reads faithfully as "pins dropped on lanes".
 *
 * ── Motion / accessibility ─────────────────────────────────────────────────
 * Videos are muted/autoPlay/playsInline, played once (no loop), pointer-events-
 * none, composited straight (own alpha — a clip that fails to load leaves the
 * static look intact). Transitions use var(--motion-*) tokens. Under
 * prefers-reduced-motion: reduce the videos are suppressed and a static map +
 * static pins render instead (StaticMapStage). A video that errors falls back
 * to the same static layer (additive-safe).
 *
 * Presentational: roster / roles / timer / labels all arrive via props; the
 * parent (client-shell) owns the countdown interval and the auto-advance.
 */

import { useState } from "react";
import { CountdownHeader } from "./countdown-header";
import { ChampSelectActionBar } from "./champ-select-action-bar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The five Summoner's Rift roles, in the client's canonical slug form. */
export type DeclareRole = "top" | "jungle" | "middle" | "bottom" | "utility";

/** Roles that ship a lane-path light-up video (support has none — pin only). */
export type DeclarePathRole = "top" | "jungle" | "middle" | "bottom";

export interface DeclareRosterEntry {
  /** Stable key + roster identity — the teammate's summoner name. */
  summonerName: string;
  /** The role this row represents (drives the position icon + lane pin). */
  role: DeclareRole;
  /** Position (role) icon URL — supply via `positionIconUrl(role)`. */
  roleIconSrc: string;
  /**
   * True for the local player's row. Renders the "Declaring Intent" sublabel
   * and the teal ◀N timer chip, and drops the distinct `me` pin on the map.
   */
  isSelf?: boolean;
}

/**
 * Video source URLs for the map stage. All optional: any missing/failed clip
 * degrades to the static layer. Build these with the @low/fixtures helpers
 * (`declareMapIntroUrl`, `declarePathUrl`, `declarePinUrl`).
 */
export interface DeclareMapVideoSources {
  /** Map-intro reveal (played once). Omit → static map only. */
  mapIntroSrc?: string;
  /**
   * Per-role lane path light-up URLs, keyed by path-role. A plain map (not a
   * callback) so the props stay serializable across the server/client boundary
   * (showcase files are Server Components). Support has no path — omit it.
   */
  pathSrcs?: Partial<Record<DeclarePathRole, string>>;
  /** Ally pin drop URL (`pin_intro(fixed)`). */
  pinSrc?: string;
  /** Local-player pin drop URL (`pin_me_intro(fixed)`). */
  mePinSrc?: string;
}

export interface DeclareIntentScreenProps {
  /** Header title. @default "Declare Your Champion!" */
  title?: string;
  /** Seconds remaining in the phase — parent owns the interval. */
  secondsRemaining: number;
  /** Full phase duration — denominator for the header progress bar. */
  totalSeconds: number;
  /**
   * The five roster rows, top-to-bottom. Order is caller-controlled; the real
   * client floats the local player's row to the top (see the reference).
   */
  roster: DeclareRosterEntry[];
  /** Map-stage video source URLs. Omit entirely for a fully static stage. */
  video?: DeclareMapVideoSources;
  /**
   * Which team side's map reveal + lane paths to use. "north" (blue-side view)
   * matches the reference. @default "north"
   */
  side?: "north" | "south";
  /** Queue label shown bottom-right, line 1 (e.g. "5V5"). @default "5V5" */
  queueLabel?: string;
  /** Queue sublabel, line 2 (e.g. "Ranked Solo/Duo"). */
  queueSublabel?: string;
  /** Rune-page name for the collapsed tray (visual only). */
  runePageName?: string;
  /** Two summoner-spell icon URLs for the collapsed tray (visual only). */
  spellSrcs?: [string, string];
}

// ---------------------------------------------------------------------------
// Lane anchor geometry
// ---------------------------------------------------------------------------
//
// Normalized (0–1) anchor points on the map stage where each role's pin drops
// and its lane path lights up. Measured against the settled map-north-intro
// frame (the green diamond spans roughly x∈[0.14,0.68], y∈[0.10,0.70], center
// ≈ (0.41,0.42)). Top lane hugs the upper-left diamond edge, bottom lane the
// lower-right edge, mid the diagonal center; jungle sits interior; support
// shares the bottom-lane approach. These are faithful approximations of the
// client's baked coordinates (which are not publicly documented).
const LANE_ANCHORS: Record<DeclareRole, { x: number; y: number }> = {
  top: { x: 0.30, y: 0.26 },
  jungle: { x: 0.30, y: 0.52 },
  middle: { x: 0.44, y: 0.40 },
  bottom: { x: 0.58, y: 0.58 },
  utility: { x: 0.50, y: 0.66 },
};

/** Roles that have a lane-path video (everything except support). */
const PATH_ROLES: readonly DeclarePathRole[] = ["top", "jungle", "middle", "bottom"];

function hasPath(role: DeclareRole): role is DeclarePathRole {
  return (PATH_ROLES as readonly string[]).includes(role);
}

// ---------------------------------------------------------------------------
// Roster row
// ---------------------------------------------------------------------------

const ROLE_LABEL: Record<DeclareRole, string> = {
  top: "Top",
  jungle: "Jungle",
  middle: "Mid",
  bottom: "Bottom",
  utility: "Support",
};

function RosterRow({
  entry,
  secondsRemaining,
}: {
  entry: DeclareRosterEntry;
  secondsRemaining: number;
}) {
  const isActive = !!entry.isSelf;
  return (
    <div
      // ~61px pitch (h-[61px]) so rows read tall/spaced like the reference.
      className="relative flex h-[61px] items-center gap-3 pl-4 pr-1"
      aria-current={isActive ? "true" : undefined}
    >
      {/* Self-row active bar — ~8px bright gold vertical bar flush at the far-
          left edge, spanning the full row height (the reference "MID" row). */}
      {isActive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-gold-2"
        />
      )}

      {/* Position medallion — circular gold ring with the role icon centered.
          The self row gets a brighter/thicker ring; ally rows a dim ring. */}
      <div
        className={[
          "relative flex h-[59px] w-[59px] shrink-0 items-center justify-center rounded-full",
          isActive
            ? "ring-2 ring-gold-2 bg-blue-6/70"
            : "ring-2 ring-gold-4 bg-hextech-black/50",
        ].join(" ")}
      >
        <img
          src={entry.roleIconSrc}
          alt=""
          aria-hidden="true"
          width={34}
          height={34}
          className={isActive ? "" : "opacity-80"}
        />
      </div>

      {/* Labels + empty champion slot */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {isActive && (
          <span className="font-body text-[10px] uppercase tracking-wide text-gold-2 leading-none">
            Declaring Intent
          </span>
        )}
        <span
          className={[
            "font-display uppercase tracking-widest leading-tight",
            isActive ? "text-sm text-gold-1" : "text-xs text-gold-cream",
          ].join(" ")}
        >
          {ROLE_LABEL[entry.role]}
        </span>
        {/* Empty champion slot — the black bar in the reference */}
        <div className="mt-1 h-1.5 w-full bg-hextech-black/80 border border-gold-5/40" />
      </div>

      {/* Self-row countdown chip — teal "◀ N" */}
      {isActive && (
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center gap-0.5 bg-blue-2 px-1 py-0.5 font-display text-xs text-hextech-black"
          style={{ whiteSpace: "nowrap" }}
        >
          ◀ {secondsRemaining}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Static fallback stage (reduced-motion / video error)
// ---------------------------------------------------------------------------

function StaticMapStage({ roster }: { roster: DeclareRosterEntry[] }) {
  return (
    <div className="absolute inset-0">
      {/* Static rift backdrop — layered Hextech gradient standing in for the
          map reveal video when motion is reduced or the clip fails to load. */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 55% 60% at 42% 42%, color-mix(in srgb, var(--color-blue-5) 55%, transparent) 0%, transparent 62%)",
            "radial-gradient(circle at 62% 24%, color-mix(in srgb, var(--color-blue-2) 45%, transparent) 0%, transparent 30%)",
            "radial-gradient(circle at 26% 60%, color-mix(in srgb, var(--color-ban-red-3) 35%, transparent) 0%, transparent 26%)",
          ].join(", "),
        }}
      />
      {/* Diamond outline — a simple rotated square approximating the playfield */}
      <div
        aria-hidden="true"
        className="absolute border border-gold-4/50"
        style={{
          left: "24%",
          top: "18%",
          width: "38%",
          height: "48%",
          transform: "skewX(-14deg) skewY(6deg)",
        }}
      />
      {/* Static pins for each role */}
      {roster.map((entry) => {
        const a = LANE_ANCHORS[entry.role];
        return (
          <StaticPin
            key={entry.summonerName}
            xPct={a.x * 100}
            yPct={a.y * 100}
            isSelf={!!entry.isSelf}
          />
        );
      })}
    </div>
  );
}

function StaticPin({
  xPct,
  yPct,
  isSelf,
}: {
  xPct: number;
  yPct: number;
  isSelf: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute -translate-x-1/2 -translate-y-full"
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
    >
      {/* Teardrop pin: a rotated rounded square + inner dot */}
      <div
        className={[
          "h-4 w-4 rotate-45 border",
          isSelf ? "border-gold-1 bg-gold-4" : "border-blue-2 bg-blue-4",
        ].join(" ")}
        style={{ borderRadius: "50% 50% 50% 0" }}
      >
        <div
          className={[
            "absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full",
            isSelf ? "bg-hextech-black" : "bg-hextech-black/80",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Positioned one-shot video overlay
// ---------------------------------------------------------------------------

/**
 * A straight-alpha, play-once overlay clip anchored at a normalized point.
 * `motion-reduce:hidden` suppresses it under reduced motion; onError hides it
 * so a failed clip leaves the static layer beneath intact.
 */
function OverlayClip({
  src,
  xPct,
  yPct,
  widthPct,
  originY,
  z,
}: {
  src: string;
  xPct: number;
  yPct: number;
  widthPct: number;
  /** Vertical anchor within the clip: "bottom" for pins (they drop to a point). */
  originY: "center" | "bottom";
  z: number;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  const translateY = originY === "bottom" ? "-100%" : "-50%";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute motion-reduce:hidden"
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        width: `${widthPct}%`,
        transform: `translate(-50%, ${translateY})`,
        zIndex: z,
        transition: "opacity var(--motion-crossfade)",
      }}
    >
      <video
        key={src}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
        className="h-auto w-full"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// DeclareIntentScreen
// ---------------------------------------------------------------------------

/**
 * DeclareIntentScreen renders the position-assignment / map-intro phase of
 * champion select. Fully presentational — the parent supplies the roster,
 * countdown, video URLs, and labels, and owns the phase timer + auto-advance.
 *
 * @param title             Header text. @default "Declare Your Champion!"
 * @param secondsRemaining  Seconds left — drives the header + self-row chip.
 * @param totalSeconds      Phase duration — header bar denominator.
 * @param roster            Five role rows, top-to-bottom (self floated to top).
 * @param video             Map-stage clip URLs (all optional; degrade to static).
 * @param side              Team-side map reveal to use. @default "north"
 * @param queueLabel        Bottom-right line 1. @default "5V5"
 * @param queueSublabel     Bottom-right line 2 (e.g. "Ranked Solo/Duo").
 * @param runePageName      Collapsed-tray rune page name (visual only).
 * @param spellSrcs         Collapsed-tray summoner-spell icons (visual only).
 */
export function DeclareIntentScreen({
  title = "Declare Your Champion!",
  secondsRemaining,
  totalSeconds,
  roster,
  video,
  queueLabel = "5V5",
  queueSublabel,
  runePageName = "Sorcery: The Calamity",
  spellSrcs,
}: DeclareIntentScreenProps) {
  const mapIntroSrc = video?.mapIntroSrc;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-hextech-black">
      {/* ---------------------------------------------------------------- */}
      {/* Full-bleed map backdrop — the 1280x720 map-intro clip is CENTERED  */}
      {/* on the window (its beacon sits window-center in the reference) and */}
      {/* runs behind the header/roster/tray; paths + pins share its frame   */}
      {/* so the normalized anchors are frame-true.                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Static fallback layer — always beneath; videos paint over it.
            Under reduced motion the videos hide and this is what shows. */}
        <StaticMapStage roster={roster} />

        {/* Map-intro reveal video (opaque, played once, centered full-bleed) */}
        {mapIntroSrc && (
          <video
            key={mapIntroSrc}
            aria-hidden="true"
            src={mapIntroSrc}
            autoPlay
            muted
            playsInline
            preload="auto"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          />
        )}

        {/* Lane paths — one-shot alpha light-ups for roles that have a path */}
        {video?.pathSrcs &&
          roster.map((entry) => {
            if (!hasPath(entry.role)) return null;
            const src = video.pathSrcs?.[entry.role];
            if (!src) return null;
            const a = LANE_ANCHORS[entry.role];
            return (
              <OverlayClip
                key={`path-${entry.summonerName}`}
                src={src}
                xPct={a.x * 100}
                yPct={a.y * 100}
                widthPct={22}
                originY="center"
                z={5}
              />
            );
          })}

        {/* Pins — one-shot alpha drops; me-pin is distinct (gold, wider) */}
        {(video?.pinSrc || video?.mePinSrc) &&
          roster.map((entry) => {
            const a = LANE_ANCHORS[entry.role];
            const src = entry.isSelf ? video?.mePinSrc : video?.pinSrc;
            if (!src) return null;
            return (
              <OverlayClip
                key={`pin-${entry.summonerName}`}
                src={src}
                xPct={a.x * 100}
                yPct={a.y * 100}
                widthPct={entry.isSelf ? 9 : 7}
                originY="bottom"
                z={entry.isSelf ? 8 : 6}
              />
            );
          })}

        {/* Side vignette — dark edges blending the map into the chrome (the
            reference fades hard at left/right, softer top/bottom). z above
            the map stack, below the z-10 content columns. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[9]"
          style={{
            background: [
              "linear-gradient(to right, var(--color-hextech-black) 0%, color-mix(in srgb, var(--color-hextech-black) 55%, transparent) 12%, transparent 30%)",
              "linear-gradient(to left, var(--color-hextech-black) 0%, color-mix(in srgb, var(--color-hextech-black) 55%, transparent) 10%, transparent 26%)",
              "linear-gradient(to bottom, color-mix(in srgb, var(--color-hextech-black) 70%, transparent) 0%, transparent 14%)",
              "linear-gradient(to top, var(--color-hextech-black) 0%, color-mix(in srgb, var(--color-hextech-black) 60%, transparent) 10%, transparent 28%)",
            ].join(", "),
          }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Header — DECLARE YOUR CHAMPION! + countdown                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative shrink-0 flex items-start justify-center pt-3 px-4">
        <div style={{ width: 480 }}>
          <CountdownHeader
            title={title}
            secondsRemaining={secondsRemaining}
            totalSeconds={totalSeconds}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Body — left roster column + center map stage                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Left roster — ~220px, aligned with the ban/pick rails */}
        <aside
          className="relative z-10 flex flex-col justify-center px-3 shrink-0"
          style={{ width: 220 }}
          aria-label="Team roles"
        >
          <span className="mb-1 pl-4 font-display text-[10px] uppercase tracking-widest text-grey-1">
            First Pick
          </span>
          {/* Roster list with a vertical connector rail along the far-left edge
              (x≈4, aligned with the self-row active bar): a faint gold hairline
              with a small gold diamond node at each inter-row seam. */}
          <div className="relative">
            {/* Hairline rail — inset top/bottom, behind the rows. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-[30px] bottom-[30px] w-px bg-gold-5/70"
              style={{ left: 4 }}
            />
            {roster.map((entry, i) => (
              <div key={entry.summonerName} className="relative">
                {/* Diamond node at the seam above every row except the first */}
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold-3/80"
                    style={{ left: 4 }}
                  />
                )}
                <div className="relative z-[1]">
                  <RosterRow
                    entry={entry}
                    secondsRemaining={secondsRemaining}
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center spacer — the map backdrop renders full-bleed behind */}
        <main className="relative flex-1 min-w-0" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom — collapsed loadout tray + queue label                       */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative z-10 flex shrink-0 items-stretch border-t border-gold-5"
        style={{ height: 92 }}
      >
        {/* Collapsed tray — runes dropdown + spell/emote slots (VISUAL ONLY) */}
        <div className="flex flex-1 items-center min-w-0">
          <ChampSelectActionBar
            runePageName={runePageName}
            spellSrcs={spellSrcs ?? ["", ""]}
          />
        </div>

        {/* Divider */}
        <div className="w-px bg-gold-5 shrink-0" />

        {/* Queue label — bottom-right */}
        <div className="flex flex-col items-end justify-center px-5 shrink-0 text-right">
          <span className="font-display text-sm uppercase tracking-widest text-gold-cream leading-tight">
            {queueLabel}
          </span>
          {queueSublabel && (
            <span className="font-display text-[10px] uppercase tracking-widest text-grey-1 leading-tight">
              {queueSublabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
