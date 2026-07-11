---
name: new-component
description: Use when building any new UI component for league-of-web — scaffolds folder, component, showcase entry, and registry line following the component contract.
---

# New Component Recipe

## Checklist (do in order)

1. **Read the issue.** Get reference screenshot, acceptance criteria, area.
2. **Scaffold.** In `packages/ui/src/<area>/` create:
   - `<component-name>.tsx` — the component
   - `<component-name>.showcase.tsx` — the showcase entry
3. **Build the component.**
   - Presentational only: props in, callbacks out. No fetching.
   - Import types (not values) from `@low/fixtures`.
   - Token classes only (`text-gold-1`, `bg-blue-7`...) — never hex.
   - `'use client'` only if it holds state or handlers.
   - JSDoc every prop.
4. **Write the showcase entry:**

   ```tsx
   import type { ShowcaseEntry } from "../showcase";
   import { MyComponent } from "./my-component";

   export const myComponentShowcase: ShowcaseEntry = {
     slug: "my-component",
     name: "My Component",
     area: "chrome",
     description: "One sentence on what this is in the real client.",
     variants: [
       { name: "Default", render: () => <MyComponent /> },
       { name: "Disabled", notes: "disabled prop", render: () => <MyComponent disabled /> },
     ],
   };
   ```

   **Rules for showcase files:**
   - Showcase files must NEVER be marked `'use client'` — the registry is imported by server components, and client-reference exports break property access (`entry.slug`, `variant.render()`) at the server layer.
   - For interactive/stateful demos (controlled tabs, modals), create a separate `<component-name>.demo.tsx` WITH `'use client'` that owns the state, and render that from the showcase entry's `render`.

   Cover every meaningful state: hover-relevant variants, disabled, loading,
   empty, long-text overflow. Showcase files MAY import fixture values.
5. **Register.** Add to `packages/ui/src/registry.ts` (sorted by area, then name):

   ```ts
   import { myComponentShowcase } from "./chrome/my-component.showcase";
   export const registry: ShowcaseEntry[] = [myComponentShowcase];
   ```

6. **Verify.** `pnpm typecheck && pnpm build` pass. Then `pnpm dev` and check
   `/showcase/<slug>` renders all variants correctly.

## Recurring review findings — avoid these

- Never write `onClick={() => !disabled && fn()}` alongside `disabled={disabled}` — native `disabled` already blocks clicks; the guard is dead code (flagged in two reviews already).
- Any map keyed by a union type must be `Record<Union, ...>` so adding a union member fails typecheck instead of silently omitting a case.
- Every SVG `id` (gradients, filters, masks) must derive from `useId()` — hardcoded ids collide when the showcase renders multiple instances (bit us twice: MatchFoundModal v2, ModalFrame v2).
- Glows/rings on clip-path'd elements: `box-shadow` gets clipped — use `[filter:drop-shadow(...)]` (filters apply after clipping and follow the clipped silhouette).
- `group-hover:`/`group-active:` on the `.group` element ITSELF is dead CSS — Tailwind's selector `:is(:where(.group):hover *)` targets descendants, and an element can't be its own descendant. Use plain `hover:`/`active:` on the root; reserve `group-*` for children. Bit us twice (SkinCard border hover, PlayButton v3 pressed CSS-vars — the latter shipped broken and went unnoticed until the v4 review). If a state must reach BOTH root and children: root gets `hover:X`, children get `group-hover:Y`.

## File naming

kebab-case files, PascalCase exports. `hextech-button.tsx` exports `HextechButton`.
