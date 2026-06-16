#!/usr/bin/env node
/**
 * fetch-contributions.js
 * Queries the GitHub GraphQL API for the viewer's contribution calendar and
 * writes _data/contributions.json. Runs in CI with the auto-provided
 * GITHUB_TOKEN (reads the token owner's own public contributions).
 *
 * Env:
 *   GITHUB_TOKEN  - required, any token authenticated as the target user
 *   GH_LOGIN      - optional, login to fetch (defaults to the token's viewer)
 *
 * Output shape (_data/contributions.json):
 *   {
 *     "total":   338,
 *     "updated": "2026-06-16",
 *     "weeks":   [ [ { "date":"2025-06-15", "count":2, "level":1 }, ... ], ... ]
 *   }
 *   level is 0..4 mapped from GitHub's contributionLevel enum.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const TOKEN = process.env.GITHUB_TOKEN;
const LOGIN = process.env.GH_LOGIN || null;
const OUT = path.join(__dirname, '..', '_data', 'contributions.json');

if (!TOKEN) {
  console.error('fetch-contributions: GITHUB_TOKEN is not set');
  process.exit(1);
}

const LEVEL = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// If a login is given, query that user; otherwise query the token's viewer.
const query = LOGIN
  ? `query($login:String!){ user(login:$login){ contributionsCollection{ contributionCalendar{ totalContributions weeks{ contributionDays{ date contributionCount contributionLevel } } } } } }`
  : `query{ viewer{ contributionsCollection{ contributionCalendar{ totalContributions weeks{ contributionDays{ date contributionCount contributionLevel } } } } } }`;

async function main() {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'sairambokka-portfolio-contrib-fetch',
    },
    body: JSON.stringify({ query, variables: LOGIN ? { login: LOGIN } : {} }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API HTTP ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  const root = LOGIN ? json.data.user : json.data.viewer;
  const cal = root.contributionsCollection.contributionCalendar;

  const weeks = cal.weeks.map((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: LEVEL[d.contributionLevel] ?? 0,
    }))
  );

  const out = {
    total: cal.totalContributions,
    updated: new Date().toISOString().slice(0, 10),
    weeks,
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(
    `fetch-contributions: wrote ${out.total} contributions across ${weeks.length} weeks to ${OUT}`
  );
}

main().catch((err) => {
  console.error('fetch-contributions failed:', err.message);
  process.exit(1);
});
