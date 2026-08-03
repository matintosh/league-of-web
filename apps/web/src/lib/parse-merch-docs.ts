/**
 * parse-merch-docs.ts
 *
 * Server-only util. Reads docs/merch-coverage.md and docs/merch-fidelity.md
 * from the repo root and parses their markdown tables into typed row objects.
 *
 * The app may be run from apps/web (pnpm dev) OR from the repo root (turbo),
 * so we walk up from process.cwd() until we find docs/merch-coverage.md or
 * fall back to a two-level-up candidate.
 *
 * Never import this in @low/ui — it uses Node fs/path (server-only IO).
 */

import fs from "fs";
import path from "path";

// ── Path resolution ──────────────────────────────────────────────────────────

function findRepoRoot(): string | null {
  // Candidate paths: cwd itself, then walk up via dirname until we hit root or find docs/.
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, "docs", "merch-coverage.md"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break; // reached filesystem root
    dir = parent;
  }
  return null;
}

function readDoc(filename: string): string | null {
  const root = findRepoRoot();
  if (!root) return null;
  const p = path.join(root, "docs", filename);
  try {
    return fs.readFileSync(p, "utf-8");
  } catch {
    return null;
  }
}

// ── Markdown table parser ────────────────────────────────────────────────────

/** Parse a fenced markdown table block into arrays of cell strings per row.
 *  Skips the header separator row (`|---|---|...`).
 */
function parseTable(lines: string[]): string[][] {
  return lines
    .filter((l) => l.trim().startsWith("|"))
    .map((l) =>
      l
        .trim()
        .slice(1, -1)         // strip leading + trailing |
        .split("|")
        .map((c) => c.trim())
    )
    .filter(
      (cells) =>
        cells.length > 0 &&
        // skip separator rows like |---|---|
        !cells.every((c) => /^[-: ]+$/.test(c))
    );
}

/** Split raw markdown text into named sections keyed by `## Heading`. */
function splitSections(md: string): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  let current = "__preamble__";
  sections[current] = [];
  for (const line of md.split("\n")) {
    if (line.startsWith("## ")) {
      current = line.slice(3).trim();
      sections[current] = [];
    } else {
      sections[current]?.push(line);
    }
  }
  return sections;
}

// ── Types ────────────────────────────────────────────────────────────────────

export type StatusEmoji = "✅" | "🔨" | "⬜" | "⛔";

export interface CoveragePageRow {
  page: string;
  realUrl: string;
  ourRoute: string;
  status: StatusEmoji;
  composes: string;
}

export interface SupportingRouteRow {
  page: string;
  ourRoute: string;
  status: StatusEmoji;
  notes: string;
}

export type VerdictEmoji = "✅" | "⚠️" | "🔁" | "⬜" | "⛔";

export interface FidelityRow {
  target: string;
  realUrl: string;
  ourRoute: string;
  verdict: VerdictEmoji;
  lastDiff: string;
  residual: string;
}

export interface MerchDocsData {
  /** Raw `**Status:** …` headline line from coverage.md, or null if not found. */
  statusHeadline: string | null;
  /** Site-map page rows (main PAGES table). */
  pages: CoveragePageRow[];
  /** Nav-destination route rows. */
  navRoutes: CoveragePageRow[];
  /** Supporting route rows (fewer columns). */
  supportingRoutes: SupportingRouteRow[];
  /** Fidelity scorecard rows. */
  fidelity: FidelityRow[];
  /** KNOWN RESIDUAL DELTAS lines from fidelity.md. */
  residualDeltas: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractStatusEmoji(cell: string): StatusEmoji {
  if (cell.includes("✅")) return "✅";
  if (cell.includes("🔨")) return "🔨";
  if (cell.includes("⛔")) return "⛔";
  return "⬜";
}

function extractVerdictEmoji(cell: string): VerdictEmoji {
  if (cell.includes("✅")) return "✅";
  if (cell.includes("⚠️")) return "⚠️";
  if (cell.includes("🔁")) return "🔁";
  if (cell.includes("⛔")) return "⛔";
  return "⬜";
}

/** Strip markdown bold `**text**` → `text` and leading `**Heading**` from a cell. */
function stripMarkdown(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
}

// ── Coverage doc parsing ─────────────────────────────────────────────────────

function parseCoverage(md: string) {
  const sections = splitSections(md);

  // Status headline — line matching `**Status:**`
  const allLines = md.split("\n");
  const headlineLine = allLines.find((l) => /^\*\*Status:\*\*/.test(l.trim())) ?? null;
  const statusHeadline = headlineLine
    ? headlineLine.replace(/^\*\*Status:\*\*\s*/, "").trim()
    : null;

  // PAGES table — section "PAGES (the site map)"
  const pagesSectionKey = Object.keys(sections).find((k) =>
    k.startsWith("PAGES")
  );
  const pagesSection = pagesSectionKey ? sections[pagesSectionKey] ?? [] : [];

  // Split pagesSection into the main table vs sub-heading tables
  const mainTableLines: string[] = [];
  const navTableLines: string[] = [];

  let subHeading = "main";
  for (const line of pagesSection) {
    if (line.startsWith("### Nav-destination")) {
      subHeading = "nav";
      continue;
    }
    if (line.startsWith("### Supporting")) {
      subHeading = "supporting";
      continue;
    }
    if (subHeading === "main") mainTableLines.push(line);
    else if (subHeading === "nav") navTableLines.push(line);
    // supporting is handled below
  }

  // Supporting routes are under their own sub-heading inside the same section
  const supportingTableLines: string[] = [];
  let inSupporting = false;
  for (const line of pagesSection) {
    if (line.startsWith("### Supporting")) { inSupporting = true; continue; }
    if (line.startsWith("###")) { inSupporting = false; continue; }
    if (inSupporting) supportingTableLines.push(line);
  }

  // Parse main PAGES rows — cols: Page | Real URL | Our route | Status | Composes
  const pages: CoveragePageRow[] = parseTable(mainTableLines)
    .slice(1) // skip header row
    .map((cells) => ({
      page: stripMarkdown(cells[0] ?? ""),
      realUrl: cells[1] ?? "",
      ourRoute: cells[2] ?? "",
      status: extractStatusEmoji(cells[3] ?? ""),
      composes: cells[4] ?? "",
    }));

  // Nav-destination rows — same 5-col structure (last col is "Notes")
  const navRoutes: CoveragePageRow[] = parseTable(navTableLines)
    .slice(1)
    .map((cells) => ({
      page: stripMarkdown(cells[0] ?? ""),
      realUrl: cells[1] ?? "",
      ourRoute: cells[2] ?? "",
      status: extractStatusEmoji(cells[3] ?? ""),
      composes: cells[4] ?? "",
    }));

  // Supporting routes — 4 cols: Page | Our route | Status | Notes
  const supportingRoutes: SupportingRouteRow[] = parseTable(supportingTableLines)
    .slice(1)
    .map((cells) => ({
      page: stripMarkdown(cells[0] ?? ""),
      ourRoute: cells[1] ?? "",
      status: extractStatusEmoji(cells[2] ?? ""),
      notes: cells[3] ?? "",
    }));

  return { statusHeadline, pages, navRoutes, supportingRoutes };
}

// ── Fidelity doc parsing ─────────────────────────────────────────────────────

function parseFidelity(md: string) {
  const sections = splitSections(md);

  // PAGES (1280 + 390) section
  const pagesSectionKey = Object.keys(sections).find((k) =>
    k.startsWith("PAGES")
  );
  const pagesLines = pagesSectionKey ? sections[pagesSectionKey] ?? [] : [];

  const fidelity: FidelityRow[] = parseTable(pagesLines)
    .slice(1)
    .map((cells) => ({
      target: stripMarkdown(cells[0] ?? ""),
      realUrl: cells[1] ?? "",
      ourRoute: cells[2] ?? "",
      verdict: extractVerdictEmoji(cells[3] ?? ""),
      lastDiff: cells[4] ?? "",
      residual: cells[5] ?? "",
    }));

  // KNOWN RESIDUAL DELTAS — bullet list items
  const residualKey = Object.keys(sections).find((k) =>
    k.startsWith("KNOWN RESIDUAL")
  );
  const residualLines = residualKey ? sections[residualKey] ?? [] : [];
  const residualDeltas = residualLines
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-") || l.startsWith("*"))
    .map((l) => l.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  return { fidelity, residualDeltas };
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Load and parse both merch docs. Returns structured data or fallback
 * values if the files cannot be found.
 */
export function loadMerchDocs(): MerchDocsData {
  const coverageMd = readDoc("merch-coverage.md");
  const fidelityMd = readDoc("merch-fidelity.md");

  const coverageData = coverageMd
    ? parseCoverage(coverageMd)
    : { statusHeadline: null, pages: [], navRoutes: [], supportingRoutes: [] };

  const fidelityData = fidelityMd
    ? parseFidelity(fidelityMd)
    : { fidelity: [], residualDeltas: [] };

  return {
    ...coverageData,
    ...fidelityData,
  };
}
