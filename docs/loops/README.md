# Autonomous loop engine — league-of-web

Three session-scoped crons (7-day auto-expire, off-minute) drive continuous 1:1 fidelity work.
Separation of concerns: **scouts discover, hands build, supervisor keeps it converging.**

| Loop | Cron id | Fires | Role | Job each tick |
|---|---|---|---|---|
| **Build-loop heartbeat** | `486fd600` | `:11` | hands | Pick up `status:ready` → worktree build → independent review → rebase-in-lane → squash-merge → deploy → verify. Fills to 3 lanes. AUDIT-ON-EMPTY when board is bare. |
| **Merch-loop** | `08b55d78` | `:37` | scout | Refresh `docs/merch-coverage.md` site map every tick. Page-first discovery: file measured `merch,status:ready` issues for missing/next pages. Skips when a researcher runs or backlog ≥12. |
| **Fidelity-engine** | `6c3a2537` | `:53` | supervisor | Keep the engine alive + ratchet toward PIXEL-PERFECT. Yields when busy; when idle, runs ONE rigorous side-by-side pixel-diff vs the real site on the next `docs/merch-fidelity.md` target and files delta issues. Convergence governor stops the spin once the site is truly pixel-perfect. |

## How they interlock
- **Fidelity-engine (scout²)** finds the next pixel-delta → files `status:ready` issues → **Build-loop (hands)** builds/ships them → **Fidelity-engine** re-diffs and marks ✅. **Merch-loop** covers *page coverage* (are all pages built), Fidelity-engine covers *page fidelity* (is each built page pixel-exact).
- None of them CronDelete another. Fidelity-engine's STEP 0 checks `CronList`; if a worker cron is missing it surfaces that to the user to re-arm (crons are session-scoped — they vanish only when the session ends).

## Convergence
`docs/merch-fidelity.md` is the ratchet's scorecard. When every row is ✅ pixel-match and two full rotations file zero issues → **CONVERGED**: the fidelity-engine idles (no token burn) until the surface changes (a new merge) or a target ages out. That is the definition of "done" for the pixel-perfect goal.

## Re-arming after a session ends
All three crons are session-only. On a fresh session, re-create them from the briefs in each cron's description (visible via CronList while alive) and this doc. The build-loop and merch-loop briefs are long protocols; the fidelity-engine brief is short (see the cron prompt). Memory `[[merch-store-section]]` + `[[league-of-web-project]]` point here.
