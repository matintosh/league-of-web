#!/usr/bin/env node
/**
 * Measure bounding boxes of launcher sub-components on /launcher/lol route
 * at viewport 1280x720.
 * Usage: node tools/measure-launcher.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.PORT ? `http://localhost:${process.env.PORT}` : "http://localhost:3732";
const SCALE = 1.2; // ref is 1536x864, our viewport is 1280x720

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

console.log(`Navigating to ${BASE}/launcher/lol ...`);
await page.goto(`${BASE}/launcher/lol`, { waitUntil: "networkidle", timeout: 30000 });

// Give time for client-side rendering
await page.waitForTimeout(2000);

// Helper: get bounding box for a selector
async function measureBySelector(label, selector, pad = 6) {
  try {
    const el = page.locator(selector).first();
    await el.waitFor({ state: "visible", timeout: 5000 });
    const box = await el.boundingBox();
    if (box) {
      const x = Math.round(box.x);
      const y = Math.round(box.y);
      const w = Math.round(box.width);
      const h = Math.round(box.height);
      console.log(`${label}: x=${x}, y=${y}, w=${w}, h=${h}`);
      // Compute ref-space crop (multiply by SCALE, add padding)
      const left = Math.max(0, Math.round(box.x * SCALE) - pad);
      const top = Math.max(0, Math.round(box.y * SCALE) - pad);
      const right = Math.min(1536, Math.round((box.x + box.width) * SCALE) + pad);
      const bottom = Math.min(864, Math.round((box.y + box.height) * SCALE) + pad);
      console.log(`  -> REF crop (${left}, ${top}, ${right}, ${bottom})`);
      return { x, y, w, h, left, top, right, bottom };
    } else {
      console.log(`${label}: no bounding box`);
    }
  } catch (e) {
    console.log(`${label}: NOT FOUND - ${e.message.split("\n")[0]}`);
  }
  return null;
}

console.log("\n=== LAUNCHER COMPONENT BOUNDING BOXES ===\n");

// Window bar - the top 28px area
await measureBySelector("launcher-window-bar", '[aria-label="Window controls bar"]');

// Rail - the left icon strip
await measureBySelector("launcher-rail", '[aria-label="Game launcher rail"]');

// Tab bar - Overview/Patch Notes/Esports/Merch tabs
await measureBySelector("launcher-tab-bar (role=tablist)", 'role=tablist');
await measureBySelector("launcher-tab-bar (nav)", 'nav');

// Play button
await measureBySelector("launcher-play-button", '[aria-label="Play"]');
await measureBySelector("launcher-play-button (button)", 'button:has-text("Play")');

// Social panel
await measureBySelector("launcher-social-panel", '[aria-label="Friends panel"]');
await measureBySelector("launcher-social-panel (alt)", '[aria-label="Social panel"]');

// Overview hero - the main splash area
await measureBySelector("launcher-overview-hero (main)", 'main');

// Featured card - the featured content overlay
await measureBySelector("launcher-featured-card", '[aria-label="Featured content"]');

// Take a screenshot for visual verification
const scratchPath = "/private/tmp/claude-501/-Users-matintosh-dev-league-of-web/0be602da-7035-4576-a333-67ee0f433379/scratchpad/launcher-lol-screenshot.png";
await page.screenshot({ path: scratchPath, fullPage: false });
console.log(`\nScreenshot saved to: ${scratchPath}`);

// Dump body HTML for further analysis
const bodyHtml = await page.evaluate(() => document.body.innerHTML.substring(0, 10000));
console.log("\n=== BODY HTML (10k chars) ===");
console.log(bodyHtml);

await browser.close();
