---
title: "PR Dashboard"
excerpt: "Linear-style dashboard for your open GitHub PRs — live polling, unread deltas, and browser notifications<br/>"
collection: portfolio
slug: "prdash"
stat: "full-stack"
tech: ["typescript", "github-api", "cloudflare-workers"]
github: "https://github.com/sairambokka/pr-dashboard"
order: 2
---

## Overview

A Linear-style view of your open GitHub pull requests. PR Dashboard polls the GitHub API on a configurable interval and fires browser notifications when comment counts go up — so you never miss review activity. It's a static app deployable to GitHub Pages, with sign-in handled by GitHub OAuth via a single tiny Cloudflare Worker (the only server-side piece — it just exchanges the OAuth `code` for a token). No secrets are stored anywhere but your own browser `localStorage`.

## Key Features

- **PRs tab** — PRs you authored plus PRs awaiting your review, in one unified view
- **Activity tab** — recent comment and review activity across your PRs
- **Insights tab** — metrics like cycle time, review turnaround, and merge rate, toggleable across 7d / 30d / 90d
- **Linear tab** — issues linked to your PRs, pulled from the Linear API
- Per-PR comment count badges, unread-delta badges, review-state pills, and CI status dots
- Web Notifications + favicon badge when new comments arrive
- Full keyboard control (refresh, tab navigation, settings, help)

## Technologies

- TypeScript (primary)
- GitHub REST API
- Cloudflare Workers (OAuth token exchange)
- Linear API
- Static deployment on GitHub Pages

[View on GitHub](https://github.com/sairambokka/pr-dashboard)
