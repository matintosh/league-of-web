---
name: task-workflow
description: Use when picking up or completing work in league-of-web — how to claim a GitHub issue, branch, PR, and update the kanban labels.
---

# Task Workflow (GitHub Issues kanban)

## Pick a task

    gh issue list --label "status:ready" --label "type:component"

Pick by priority (`priority:1` first). Read the full issue:

    gh issue view <N>

## Claim it

    gh issue edit <N> --add-label "status:in-progress" --remove-label "status:ready"

## Branch

    git checkout main && git pull
    git checkout -b feat/<component-slug>

## Build

Follow the `new-component` skill. Commit frequently (conventional commits).

## Ship

    git push -u origin feat/<component-slug>
    gh pr create --title "feat(<area>): <component name>" --body "Closes #<N>

    <what was built, variants included, any deviations from reference>"
    gh issue edit <N> --add-label "status:review" --remove-label "status:in-progress"

PR merge closes the issue automatically (via `Closes #N`).
After the merge, remove the stale kanban label:

    gh issue edit <N> --remove-label "status:review"

Vercel builds a preview deploy per PR — link it in the PR if reviewing visuals.

## Rules

- One issue = one branch = one PR
- Never commit directly to `main`
- If blocked or the issue is ambiguous, comment on the issue instead of guessing
