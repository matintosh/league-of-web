---
name: new-issue
description: Use when adding component tasks to the league-of-web kanban — how to write a GitHub issue complete enough that an agent with zero conversation context can build the component from it alone.
---

# New Component Issue

An issue is a dispatch brief. The agent who picks it up sees ONLY the issue —
no conversation, no design discussion. If information lives in your head and
not in the issue, it does not exist.

## Required sections (all of them)

Title: `[Component] <PascalCaseName>`

**1. Area** — one of: `chrome | champ-select | collection | login | store`.

**2. Description** — what this component is in the REAL LoL client and where
it appears. Name the screen(s) it lives on and what surrounds it.

**3. Visual reference** — a screenshot of the real client component if you
have one (paste it). If not, a precise visual description that stands in for
one, using token names, not vague adjectives:

> Slim horizontal bar, `bg-blue-7`, 1px bottom border `border-gold-5`.
> Left: item labels in `font-display` uppercase `text-sm tracking-widest`,
> `text-grey-1`, active item `text-gold-1` with 2px gold-3 underline.
> Height ≈ 48px. No rounded corners.

**4. Props sketch** — the intended API surface. Types from `@low/fixtures`
where they exist (`Summoner`, `Wallet`, `Friend`); callbacks for every
interaction (`onSelect`, `onClose` — components never fetch or own app
state). Mark optional props. Example:

```ts
interface TabBarProps {
  tabs: { id: string; label: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}
```

**5. States & variants** — every state the showcase must demonstrate:
default, hover-relevant, active/selected, disabled, empty, loading,
long-content overflow. If a state doesn't apply, say "no X state" so the
builder knows it was considered, not forgotten.

**6. Dependencies** — other `@low/ui` components this composes or slots
(e.g. "navbar right side slots `CurrencyDisplay` and `PlayerHovercard` —
accept them as `ReactNode` props, do not import them"). Write "none" if none.

**7. Acceptance criteria** — the standard checklist, plus any
component-specific criteria:

```
- [ ] Matches reference visually
- [ ] Showcase entry with all meaningful variants
- [ ] Presentational only (props in, callbacks out)
- [ ] Tokens only, typecheck + build pass
```

## Labels

`type:component`, `area:<area>`, `status:ready`, `priority:1|2|3`
(1 = blocks other work or core screen chrome, 2 = standard, 3 = polish).

## Command

```bash
gh issue create --title "[Component] <Name>" \
  --label "type:component" --label "area:<area>" \
  --label "status:ready" --label "priority:<n>" \
  --body "$(cat <<'EOF'
**Area:** <area>

<description>

**Visual reference**
<screenshot or token-based description>

**Props sketch**
```ts
<interface>
```

**States & variants**
- <state 1>
- <state 2>

**Dependencies:** <none | list>

**Acceptance criteria**
- [ ] Matches reference visually
- [ ] Showcase entry with all meaningful variants
- [ ] Presentational only (props in, callbacks out)
- [ ] Tokens only, typecheck + build pass
EOF
)"
```

## Self-check before submitting

Read the issue as a stranger: could you build the component from this text
alone, without asking a single question? If any answer would be "I'd have to
guess" — fix the issue, not the guess.
