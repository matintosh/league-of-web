#!/usr/bin/env node
// Screenshot a DOM element for visual-fidelity loops.
// Usage: node tools/screenshot.mjs <url> <css-selector> <out.png> [scale]
// Example: node tools/screenshot.mjs http://localhost:3000/showcase/hextech-button '[data-shot="gold-icon"]' /tmp/shot.png 2
import { chromium } from "playwright";

const [url, selector, out, scale = "2"] = process.argv.slice(2);
if (!url || !selector || !out) {
  console.error("usage: node tools/screenshot.mjs <url> <selector> <out.png> [scale]");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: Number(scale) });
await page.goto(url, { waitUntil: "networkidle" });
const el = page.locator(selector).first();
await el.waitFor({ state: "visible", timeout: 15000 });
await el.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out}`);
