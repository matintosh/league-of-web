# Hextech UI — notes from Riot's engineering article

Source: https://www.riotgames.com/en/news/under-hood-league-client%E2%80%99s-hextech-ui
(Riot Games, "Under the Hood of the League Client's Hextech UI"). Fetched 2026-07-13.

The article is about the real LCU's architecture; these notes extract what is
*actionable for visual/behavioral fidelity* in league-of-web.

## Magic button anatomy (`lol-uikit-magic-button`)

The real client's primary buttons are NOT a single styled element. Internally
the component renders layered parts:

1. **Frame layers** — separate idle and interactive (hover/active) frames,
   stacked; state changes crossfade frames rather than restyle one frame.
2. **Rune decorations** — left and right ornamental pieces flanking the frame.
3. **Radial effects** — a radial glow layer behind/inside the frame.
4. **Animated border overlay** — a moving highlight that travels along the
   border (the "magic" shimmer on PLAY/ACCEPT-tier buttons).
5. **Text content slot** — the label sits on top of all layers.

Implication for us: high-tier buttons (PlayButton, LockInButton, ACCEPT)
should be built as *stacked layers with opacity/transform transitions*, not
single-element `hover:` restyles.

## Motion

- Easing conveys **priority**: soft ease-out for pieces settling into place,
  sharp snap for attention-grabbing elements (e.g. ready check).
- The real client centralizes **preset timings + easing functions** in shared
  mixins so all motion "feels Hextech" client-wide. We should mirror this with
  motion tokens in `@low/tokens` (duration + cubic-bezier custom properties)
  instead of per-component ad-hoc `transition` values.
- Simple effects: CSS transitions/animations. "Ethereal, magical effects or
  highly-detailed mechanical animations": **video** (HTML5 `<video>`, webm
  with alpha in the real client). State-machine web components sequence
  video intro → loop → outro with ~200–300ms crossfades.

## Audio (future)

Dedicated channels (UI SFX / notifications / music / VO) via Web Audio API;
VO ducks music, notifications take priority over ambience.

## Reference media downloaded from the article

- `hextech-ui-ready-check.gif` — 616×576, 196 frames: full MATCH FOUND /
  ready-check sequence (ring sweep animation, animated ACCEPT border).
- `hextech-ui-animation-comparison.gif` — 600×200, 30 frames: soft-easing vs
  snap-easing comparison Riot uses to explain motion priority.
