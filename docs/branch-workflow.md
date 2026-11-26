# Git workflow

Main-only: one task, one branch, one pull request into `main`. There is no development branch.
**A merge to `main` publishes the live site.**

## Steps

1. **Worktree.** Work in a T3 Code worktree based on current `main`. A thread on the main checkout
   moves with `t3_worktree_handoff` before editing. T3 runs `pnpm install --frozen-lockfile` in a new
   worktree. Without T3: `git worktree add <path> -b <branch> origin/main`, then that command.
2. **Commit, never stash.** Every worktree shares the stash list.
3. **Open a PR.** Every code or data task ends with a commit and a PR to `main`, without being
   asked. Opening a PR does not publish anything to the live site.
4. **Get it green.** Run `pnpm verify`, watch the PR's checks and fix failures.
5. **Merge only when the owner asks**: `gh pr merge <number> --auto --merge`. GitHub merges once
   `verify` passes. Data PRs also follow the rules in `AGENTS.md`. To update a local `main`, use
   `git pull --ff-only`. Never force-push it.
6. **Clean up.** After the merge, remove the worktree through T3 (or `git worktree remove`) when it
   has no uncommitted or unmerged work. GitHub deletes the remote branch.

## What runs

| Event                  | What happens                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| Pull request           | GitHub Actions `verify`. Cloudflare builds a public preview and comments its link.         |
| Merge to `main`        | GitHub Actions `verify`. Cloudflare runs `pnpm verify`, then `pnpm exec wrangler deploy`. |
| Dependabot minor/patch | npm updates merge themselves once `verify` passes, which deploys. Monthly, 7-day cooldown. |
| Dependabot other       | Major updates and GitHub Actions updates wait for the owner.                               |

Preview links are public and show unmerged data. The preview build is not a required check. There
are no release tags.

## Repository controls

- `main` requires a PR and the `verify` check, for administrators too. Force pushes and deletion are
  blocked. No approval is required, because the only collaborator cannot approve their own PR.
- "Branch must be up to date" is off: Cloudflare re-runs `pnpm verify` on the merged commit and does
  not deploy if it fails.
- Auto-merge and automatic head-branch deletion are on.
- The Cloudflare build commands live in the dashboard (Worker, Settings, Builds), not in this
  repository. The production build command must stay `pnpm verify`.
