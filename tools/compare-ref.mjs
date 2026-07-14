#!/usr/bin/env node
/**
 * compare-ref.mjs
 *
 * 1:1 component-vs-reference visual diff harness. Screenshots a live component
 * from the running app, scales the matching reference crop to the same width,
 * and emits a labeled 4-row composite:
 *
 *     REFERENCE  (the Riot-client reference crop)
 *     OURS       (our component screenshot, scaled to ref width)
 *     50% BLEND  (reference + ours at 50% opacity — alignment check)
 *     DIFF x3    (per-pixel absolute difference, amplified 3x — mismatch heatmap)
 *
 * This is the durable version of the manual crop-align-overlay PIL sessions
 * captured in docs/reference/play-button-compare-2026-07-13.png. It is a
 * comparison AID, not a pass/fail gate: it always exits 0 and prints the path.
 *
 * Follows tools/*.mjs conventions: Playwright + PORT env, production server
 * assumed already running (pnpm --filter web exec next start -p <PORT>).
 * Image math shells out to system python3 + PIL (same as the auditors); no new
 * npm dependencies. The screenshot is captured at deviceScaleFactor 4 so the
 * scaled-down OURS row is crisp.
 *
 * ---------------------------------------------------------------------------
 * Usage
 * ---------------------------------------------------------------------------
 *   PORT=<port> node tools/compare-ref.mjs \
 *     --url <path>                     route to open (e.g. /showcase/play-button)
 *     --selector '<css>'               element to screenshot (Playwright selector)
 *     --ref <path>                     reference image (PNG)
 *     [--ref-crop x,y,w,h]             crop the reference before comparing; omit = whole image
 *     [--pad <px>]                     padding around the element bbox (default 20)
 *     [--out <path>]                   output composite (default /tmp/compare-ref.png)
 *     [--hover]                        hover the element before shooting (hover-state refs)
 *     [--steps '<css>,<css>,...']      selectors clicked in order before locating target
 *                                      (navigation, e.g. PLAY -> mode select -> lobby)
 *     [--base-url <url>]               override http://localhost:PORT
 *
 * ---------------------------------------------------------------------------
 * Canonical invocations
 * ---------------------------------------------------------------------------
 * PLAY button (static showcase page — reproduces the committed composite):
 *
 *   PORT=3297 node tools/compare-ref.mjs \
 *     --url /showcase/play-button \
 *     --selector 'button:has-text("PLAY")' \
 *     --ref docs/reference/play-button-hires-full.png \
 *     --ref-crop 94,127,986,330 \
 *     --pad 20 \
 *     --out /tmp/play-button-compare.png
 *
 * FIND MATCH button (navigated: home -> PLAY -> Confirm mode -> party lobby;
 * the click sequence mirrors tools/spell-icon-check.mjs):
 *
 *   PORT=3297 node tools/compare-ref.mjs \
 *     --url / \
 *     --steps 'button:has-text("Play"),button:has-text("Confirm")' \
 *     --selector 'button:has-text("Find Match")' \
 *     --ref docs/reference/client-find-match-button.png \
 *     --pad 20 \
 *     --out /tmp/find-match-compare.png
 */

import { chromium } from "/Users/matintosh/dev/league-of-web/node_modules/playwright/index.mjs";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
function flag(name) {
  return argv.includes(`--${name}`);
}
function opt(name, fallback = undefined) {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && i + 1 < argv.length ? argv[i + 1] : fallback;
}

const PORT = process.env.PORT ?? 3000;
const BASE = opt("base-url", `http://localhost:${PORT}`);

const url = opt("url");
const selector = opt("selector");
const refPath = opt("ref");
const refCrop = opt("ref-crop"); // "x,y,w,h" or undefined
const pad = Number(opt("pad", "20"));
const outPath = resolve(opt("out", "/tmp/compare-ref.png"));
const hover = flag("hover");
const stepsArg = opt("steps"); // "sel1,sel2,..." or undefined
const steps = stepsArg ? stepsArg.split(",").map((s) => s.trim()).filter(Boolean) : [];

if (!url || !selector || !refPath) {
  console.error(
    "Usage: PORT=<p> node tools/compare-ref.mjs --url <path> --selector <css> --ref <png> [--ref-crop x,y,w,h] [--pad 20] [--out <png>] [--hover] [--steps sel,sel]"
  );
  process.exit(2);
}

const refResolved = resolve(refPath);

// ---------------------------------------------------------------------------
// Python compositor. Reads the OURS screenshot + the reference, crops the ref,
// scales OURS to the ref-crop width, and stacks the 4 labeled rows.
// ---------------------------------------------------------------------------
const PY_COMPOSITOR = `
import sys
from PIL import Image, ImageChops, ImageDraw, ImageFont

ours_path, ref_path, out_path, crop_arg = sys.argv[1:5]

ref = Image.open(ref_path).convert("RGB")
if crop_arg:
    x, y, w, h = (int(v) for v in crop_arg.split(","))
    ref = ref.crop((x, y, x + w, y + h))

ours = Image.open(ours_path).convert("RGB")

# Scale OURS to the reference-crop width, preserving aspect ratio.
target_w = ref.width
scale = target_w / ours.width
ours_scaled = ours.resize((target_w, max(1, round(ours.height * scale))), Image.LANCZOS)

# Rows are compared on a shared canvas height = max of the two heights, so the
# blend/diff line up regardless of aspect differences. Center vertically.
row_h = max(ref.height, ours_scaled.height)

def on_canvas(img):
    c = Image.new("RGB", (target_w, row_h), (0, 0, 0))
    c.paste(img, (0, (row_h - img.height) // 2))
    return c

ref_c = on_canvas(ref)
ours_c = on_canvas(ours_scaled)

# 50% blend and amplified diff.
blend = Image.blend(ref_c, ours_c, 0.5)
diff = ImageChops.difference(ref_c, ours_c)
diff = diff.point(lambda p: min(255, p * 3))  # amplify x3

label_h = 24
labels = ["REFERENCE", "OURS (scaled to match)", "50% OVERLAY", "DIFF x3 (bright = mismatch)"]
rows = [ref_c, ours_c, blend, diff]

try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 14)
except Exception:
    font = ImageFont.load_default()

total_h = (row_h + label_h) * len(rows)
composite = Image.new("RGB", (target_w, total_h), (12, 12, 16))
draw = ImageDraw.Draw(composite)

yc = 0
for label, row in zip(labels, rows):
    draw.text((8, yc + 5), label, fill=(200, 200, 210), font=font)
    yc += label_h
    composite.paste(row, (0, yc))
    yc += row_h

composite.save(out_path)
print(out_path)
`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const workDir = mkdtempSync(join(tmpdir(), "compare-ref-"));
const oursShot = join(workDir, "ours.png");

const browser = await chromium.launch({ headless: true });
try {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 4, // hi-res capture so the scaled-down OURS row is crisp
  });
  const page = await ctx.newPage();

  console.log(`Navigating to ${BASE}${url} …`);
  await page.goto(`${BASE}${url}`, { waitUntil: "networkidle" });

  // Navigation steps (e.g. PLAY -> Confirm -> lobby) before locating the target.
  for (const [i, stepSel] of steps.entries()) {
    console.log(`Step ${i + 1}: click ${stepSel} …`);
    const stepLoc = page.locator(stepSel).first();
    await stepLoc.waitFor({ state: "visible", timeout: 8000 });
    await stepLoc.click();
    await page.waitForTimeout(800);
  }

  const target = page.locator(selector).first();
  await target.waitFor({ state: "visible", timeout: 8000 });

  if (hover) {
    console.log("Hovering target …");
    await target.hover();
    await page.waitForTimeout(400);
  }

  const box = await target.boundingBox();
  if (!box) throw new Error(`Could not resolve bounding box for selector: ${selector}`);

  // Clip = element bbox + pad, clamped to the viewport.
  const clip = {
    x: Math.max(0, box.x - pad),
    y: Math.max(0, box.y - pad),
    width: box.width + pad * 2,
    height: box.height + pad * 2,
  };
  console.log(
    `Element ${Math.round(box.width)}x${Math.round(box.height)} at (${Math.round(box.x)},${Math.round(box.y)}); clip +${pad}px pad …`
  );

  await page.screenshot({ path: oursShot, clip });
  console.log(`OURS screenshot (deviceScaleFactor 4) → ${oursShot}`);

  // Compose via python3 + PIL.
  const pyScript = join(workDir, "compose.py");
  writeFileSync(pyScript, PY_COMPOSITOR);
  const result = execFileSync(
    "python3",
    [pyScript, oursShot, refResolved, outPath, refCrop ?? ""],
    { encoding: "utf8" }
  ).trim();

  console.log("\n=== Composite written ===");
  console.log(result);
} catch (err) {
  console.error("compare-ref error:", err.message);
} finally {
  await browser.close();
  rmSync(workDir, { recursive: true, force: true });
}

// Comparison aid — never a pass/fail gate.
process.exit(0);
