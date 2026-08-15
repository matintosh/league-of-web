#!/usr/bin/env node
/**
 * extract_styles.mjs — pull the REAL computed styles + DOM structure of a
 * component from a live site, so fidelity work builds to exact values instead
 * of eyeballing screenshots.
 *
 * Usage:
 *   node scripts/extract_styles.mjs <url> --anchor "LOCKE" [--hover] [--width 1440]
 *   node scripts/extract_styles.mjs <url> --selector ".slideDescription" [--hover]
 *
 *   --anchor TEXT   locate the element by a unique text it (or a child) contains,
 *                   then climb to the nearest "card/panel" ancestor.
 *   --selector CSS  locate by CSS selector instead.
 *   --hover         also capture the hover-state style deltas + a cropped screenshot.
 *   --width N       viewport width (default 1440).
 *   --wait N        ms to wait after load (default 7000; SPAs need time).
 *   --shot PATH     save an element screenshot to PATH.
 *
 * Prints a JSON report: tag, classes, box, key computed styles, child text
 * nodes with their type styles, and (with --hover) what changes on hover.
 *
 * Requires the repo's playwright (run from the repo root).
 */
import { chromium } from "playwright";

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--"));
const opt = (flag, def = null) => {
  const i = args.indexOf(flag);
  return i >= 0 ? (args[i + 1]?.startsWith("--") ? true : args[i + 1]) : def;
};
const has = (flag) => args.includes(flag);
if (!url) {
  console.error("usage: node scripts/extract_styles.mjs <url> --anchor TEXT | --selector CSS [--hover]");
  process.exit(1);
}
const anchor = opt("--anchor");
const selector = opt("--selector");
const width = parseInt(opt("--width", "1440"), 10);
const wait = parseInt(opt("--wait", "7000"), 10);
const shot = opt("--shot");
const doHover = has("--hover");

const STYLE_KEYS = [
  "display", "position", "width", "height", "border", "borderColor", "borderWidth",
  "borderRadius", "backgroundColor", "backgroundImage", "backgroundPosition",
  "backgroundSize", "boxShadow", "padding", "margin", "gap", "clipPath", "filter",
  "opacity", "overflow", "transform", "transition",
];
const TEXT_KEYS = ["fontSize", "fontWeight", "color", "letterSpacing", "lineHeight", "textAlign", "textTransform", "fontFamily"];

const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width, height: 900 } })).newPage();
await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
await p.waitForTimeout(wait);
if (!has("--no-accept")) {
  for (const t of ["Accept", "Accept All", "I Accept"]) {
    try { await p.click(`text=${t}`, { timeout: 1500 }); break; } catch {}
  }
}
await p.waitForTimeout(1500);

const report = await p.evaluate(
  ({ anchor, selector, STYLE_KEYS, TEXT_KEYS }) => {
    const pick = (el, keys) => { const s = getComputedStyle(el); const o = {}; keys.forEach((k) => (o[k] = s[k])); return o; };
    // Only consider VISIBLE, rendered elements (skip head/script/style/meta + hidden).
    const visible = (e) => {
      const t = e.tagName;
      if (["SCRIPT", "STYLE", "META", "LINK", "HEAD", "TITLE", "NOSCRIPT"].includes(t)) return false;
      if (!e.offsetParent && e.tagName !== "BODY") {
        const s = getComputedStyle(e);
        if (s.position !== "fixed") return false;
      }
      const b = e.getBoundingClientRect();
      return b.width > 0 && b.height > 0;
    };
    let el = null;
    if (selector) el = document.querySelector(selector);
    else if (anchor) {
      const all = [...document.querySelectorAll("*")].filter(visible);
      const hit = all.find(
        (e) => e.children.length === 0 && e.textContent.trim().toUpperCase() === anchor.toUpperCase(),
      ) || all.find((e) => new RegExp(anchor, "i").test(e.textContent) && e.querySelector("img,[style*='background-image']"));
      // climb to the nearest visually-boxed ancestor (border / bg / clip-path)
      el = hit;
      for (let i = 0; i < 5 && el?.parentElement; i++) {
        const s = getComputedStyle(el);
        if (s.borderTopWidth !== "0px" || s.clipPath !== "none" || (s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor)) break;
        el = el.parentElement;
      }
    }
    if (!el) return { error: "element not found" };
    const box = el.getBoundingClientRect();
    const texts = [...el.querySelectorAll("*")]
      .filter((e) => e.children.length === 0 && e.textContent.trim())
      .slice(0, 8)
      .map((e) => ({ text: e.textContent.trim().slice(0, 40), ...pick(e, TEXT_KEYS) }));
    const imgs = [...el.querySelectorAll("img")].slice(0, 6).map((i) => ({ src: i.src.slice(0, 90), w: Math.round(i.getBoundingClientRect().width) }));
    return {
      tag: el.tagName, classes: (el.className?.toString?.() || "").slice(0, 80),
      box: { w: Math.round(box.width), h: Math.round(box.height) },
      style: pick(el, STYLE_KEYS),
      outerHTMLHead: el.outerHTML.slice(0, 500),
      texts, imgs,
    };
  },
  { anchor, selector, STYLE_KEYS, TEXT_KEYS },
);

console.log("=== DEFAULT STATE ===");
console.log(JSON.stringify(report, null, 1));

if (doHover && !report.error) {
  try {
    const h = anchor ? await p.$(`text=${anchor}`) : await p.$(selector);
    if (h) {
      await h.hover();
      await p.waitForTimeout(900);
      if (shot) await h.screenshot({ path: shot }).catch(() => {});
      const hov = await p.evaluate(({ anchor, selector, STYLE_KEYS }) => {
        const pick = (el, keys) => { const s = getComputedStyle(el); const o = {}; keys.forEach((k) => (o[k] = s[k])); return o; };
        let el = selector ? document.querySelector(selector) : [...document.querySelectorAll("*")].find((e) => new RegExp(anchor, "i").test(e.textContent) && (e.querySelector("img") || getComputedStyle(e).backgroundImage !== "none"));
        if (!el) return {};
        const box = el.getBoundingClientRect();
        const explore = [...el.querySelectorAll("*")].find((e) => /explore/i.test(e.textContent) && e.children.length === 0);
        return { hoverBox: { w: Math.round(box.width), h: Math.round(box.height) }, style: pick(el, STYLE_KEYS), revealsExplore: !!explore };
      }, { anchor, selector, STYLE_KEYS });
      console.log("=== HOVER STATE ===");
      console.log(JSON.stringify(hov, null, 1));
    }
  } catch (e) { console.log("hover capture failed:", String(e).slice(0, 80)); }
}
await b.close();
