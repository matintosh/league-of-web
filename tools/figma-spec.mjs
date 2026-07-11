#!/usr/bin/env node
// Extract an exact spec tree from Figma nodes — for writing precision component tickets.
// Usage: FIGMA_TOKEN=figd_... node tools/figma-spec.mjs <fileKey> <nodeId>[,<nodeId>...]
// Node ids as in figma.com URLs ("12-345" or "12:345" both accepted).
// Prints per node: box, auto-layout (padding/gap/direction), fills (solid+gradients with
// stops), strokes + weight, corner radius, effects (shadows/blur), blend mode, text style.

const token = process.env.FIGMA_TOKEN;
const [fileKey, idsArg] = process.argv.slice(2);
if (!token || !fileKey || !idsArg) {
  console.error("usage: FIGMA_TOKEN=... node tools/figma-spec.mjs <fileKey> <nodeId>[,<nodeId>...]");
  process.exit(1);
}
const ids = idsArg.split(",").map((s) => s.trim().replace("-", ":")).join(",");

const res = await fetch(
  `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`,
  { headers: { "X-Figma-Token": token } },
);
if (!res.ok) {
  console.error(`figma api ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const data = await res.json();

const hex = (c, o = 1) => {
  const h = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  const base = `#${h(c.r)}${h(c.g)}${h(c.b)}`;
  const alpha = c.a ?? o;
  return alpha < 1 ? `${base} @${Math.round(alpha * 100)}%` : base;
};

const paint = (p) => {
  if (p.visible === false) return null;
  if (p.type === "SOLID") return hex(p.color, p.opacity ?? 1);
  if (p.type.startsWith("GRADIENT")) {
    const stops = p.gradientStops.map((s) => `${hex(s.color)} ${Math.round(s.position * 100)}%`).join(" → ");
    return `${p.type.toLowerCase().replace("gradient_", "")}-gradient(${stops})`;
  }
  if (p.type === "IMAGE") return "image(bitmap)";
  return p.type;
};

const walk = (n, depth = 0) => {
  const pad = "  ".repeat(depth);
  const parts = [`${pad}${n.name} [${n.type}]`];
  if (n.absoluteBoundingBox) {
    const b = n.absoluteBoundingBox;
    parts.push(`box=${Math.round(b.width * 100) / 100}×${Math.round(b.height * 100) / 100}`);
  }
  if (n.layoutMode) {
    parts.push(`layout=${n.layoutMode.toLowerCase()} pad=${n.paddingTop ?? 0}/${n.paddingRight ?? 0}/${n.paddingBottom ?? 0}/${n.paddingLeft ?? 0} gap=${n.itemSpacing ?? 0}`);
  }
  const fills = (n.fills ?? []).map(paint).filter(Boolean);
  if (fills.length) parts.push(`fill=[${fills.join(", ")}]`);
  const strokes = (n.strokes ?? []).map(paint).filter(Boolean);
  if (strokes.length) parts.push(`stroke=[${strokes.join(", ")}] w=${n.strokeWeight ?? "?"} align=${n.strokeAlign ?? "?"}`);
  if (n.cornerRadius) parts.push(`radius=${n.cornerRadius}`);
  if (n.blendMode && n.blendMode !== "PASS_THROUGH" && n.blendMode !== "NORMAL") parts.push(`blend=${n.blendMode.toLowerCase()}`);
  const fx = (n.effects ?? []).filter((e) => e.visible !== false);
  for (const e of fx) {
    if (e.type.includes("SHADOW"))
      parts.push(`shadow=${e.type === "INNER_SHADOW" ? "inset " : ""}${e.offset?.x ?? 0}px ${e.offset?.y ?? 0}px ${e.radius ?? 0}px ${hex(e.color)}`);
    else parts.push(`effect=${e.type.toLowerCase()} r=${e.radius}`);
  }
  if (n.style) {
    const s = n.style;
    parts.push(`font=${s.fontFamily} ${s.fontWeight} ${s.fontSize}px/${Math.round(s.lineHeightPx ?? 0)}px${s.letterSpacing ? ` ls=${Math.round(s.letterSpacing * 100) / 100}` : ""}${s.textCase ? ` case=${s.textCase.toLowerCase()}` : ""}`);
  }
  if (n.opacity !== undefined && n.opacity < 1) parts.push(`opacity=${Math.round(n.opacity * 100)}%`);
  if (n.visible === false) parts.push("(hidden)");
  console.log(parts.join("  "));
  for (const c of n.children ?? []) walk(c, depth + 1);
};

for (const [id, node] of Object.entries(data.nodes)) {
  console.log(`\n══ ${id} ══`);
  walk(node.document);
}
