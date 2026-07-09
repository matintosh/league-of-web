---
name: hextech-style
description: Use when styling any league-of-web component — the Hextech design language reference (palette usage, typography, borders, states).
---

# Hextech Design Language

The LoL client aesthetic: dark, ornate, gold-on-near-black with magic blue accents.

## Palette usage (token classes)

- **Surfaces:** `bg-hextech-black` (app bg), `bg-blue-7` / `bg-blue-6` (panels), `bg-grey-cool` / `bg-grey-4` (cards, hover fills)
- **Borders:** `border-gold-4` default, `border-gold-2` hover/active, `border-gold-5` subtle dividers, `border-grey-3` muted/disabled
- **Text:** `text-gold-1` headings/emphasis, `text-gold-2` interactive labels, `text-grey-1` body, `text-grey-2` muted/disabled
- **Magic/interactive accents:** `text-blue-2`, gradients `from-blue-3 to-blue-4`, glows `shadow-[0_0_12px_var(--color-blue-2)]`
- **Danger/ban:** use sparingly; the client uses desaturated reds — if needed add a token first, never inline hex

## Typography

- `font-display` (Marcellus ≈ Beaufort): headings, buttons, nav. Almost always `uppercase tracking-widest`
- `font-body` (Inter ≈ Spiegel): body copy, tooltips, form text
- Sizes skew small: buttons/labels `text-sm`, section headers `text-xs uppercase`

## Signature patterns

- **Buttons:** thin gold border + dark blue gradient fill + uppercase display text; hover = brighter border + subtle blue glow
- **Panels:** 1px `border-gold-5` frame on `bg-blue-7`; corner ornaments are a stretch goal, skip unless the issue asks
- **Dividers:** 1px `border-gold-5` fading at edges (use gradient masks)
- **Focus/selected:** gold border brighten + inner glow, never browser default outline color
- **Transitions:** fast and subtle — `transition-colors duration-150`. The client is snappy, not bouncy. No scale/spring animations. Use `transition-all` only when animating shadows/glows (e.g. buttons); otherwise `transition-colors`.

## Don'ts

- No rounded corners beyond `rounded-sm` (client is squared/sharp)
- No pure white (`#fff`) text — `text-gold-1` is the "white"
- No hardcoded hex anywhere — add a token to `@low/tokens` if genuinely missing
