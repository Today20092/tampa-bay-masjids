# Tampa Bay Masjids

A directory of masjids in Tampa Bay with directions, websites, and confirmed iqama and Jumu'ah
times. It is made for the Facebook group
[Muslims Community in Tampa Bay](https://www.facebook.com/groups/tampabaymuslims) and links back
to it.

<p align="center">
  <a href="https://masjids.ayoubabed.xyz"><img alt="Site: live" src="https://img.shields.io/badge/Site-Live-C4A7E7?style=for-the-badge&amp;labelColor=493267"></a>
  <a href="https://github.com/Today20092/tampa-bay-masjids/actions/workflows/ci.yml"><img alt="Checks: GitHub Actions status" src="https://img.shields.io/github/actions/workflow/status/Today20092/tampa-bay-masjids/ci.yml?branch=main&amp;style=for-the-badge&amp;label=Checks&amp;logo=githubactions&amp;labelColor=246732"></a>
  <br>
  <a href="https://astro.build"><img alt="Built with Astro 7" src="https://img.shields.io/badge/Astro-7-B5DFE8?style=for-the-badge&amp;logo=astro&amp;labelColor=29626B"></a>
  <a href="https://developers.cloudflare.com/workers/static-assets/"><img alt="Deployed as Cloudflare Workers static assets" src="https://img.shields.io/badge/Cloudflare-Workers-B5DFE8?style=for-the-badge&amp;logo=cloudflare&amp;labelColor=29626B"></a>
</p>

<p align="center">
  <a href="https://masjids.ayoubabed.xyz">Open the site</a> ·
  <a href="docs/official-schedule-sources.md">Find a masjid's source</a> ·
  <a href="docs/decisions.md">Product decisions</a> ·
  <a href="docs/site-structure.md">Code layout</a>
</p>

## What it does

- Lists each masjid with directions, website links, and any WhatsApp link the masjid approved.
- Shows iqama and Jumu'ah times only when a person confirmed them, with the source and the date
  they were checked.
- Says "Check with the masjid" when a time is missing, older than 14 days, or from before the
  last clock change.
- Opens on Jumu'ah times on Fridays and daily iqama on other days, and marks the next prayer in
  each row.
- Lets a visitor pin any number of masjids. Pins stay in the browser; there are no accounts.
- Opens a map of the listed masjids on request.
- Searches by name, Arabic name, alias, area, or address, ignoring accents and spacing.

## How a time is confirmed

A time comes from the masjid's own public channel, such as its website or an announcement shared
from its official WhatsApp account. The record stores the source and a `checked` date, and the
site hides the time once that date is too old to trust. A wrong time is worse than no time, so an
unconfirmed slot is left out instead of guessed.

See [docs/decisions.md](docs/decisions.md) for the product rules and
[docs/grok-schedule-workflow.md](docs/grok-schedule-workflow.md) for the weekly review process.

## Data and endpoints

Each masjid is one JSON file in [`src/data/masjids/`](src/data/masjids/), and the filename is the
stable pin ID. [`src/lib/masjid-schema.ts`](src/lib/masjid-schema.ts) validates every record during
the build, so a malformed file fails `pnpm verify` instead of reaching the site.

The build generates two public files from those records. Do not edit them by hand.

- [`/masjids.json`](https://masjids.ayoubabed.xyz/masjids.json) holds the directory data.
- [`/llms.txt`](https://masjids.ayoubabed.xyz/llms.txt) is a short plain-text summary for agents.

## Local development

Node.js 22.23 or newer and pnpm 11.21 are required.

```sh
pnpm install
pnpm dev       # local site; add ?demo for labelled sample times
pnpm test      # focused automated tests
pnpm verify    # format, tests, types, lint, unused code, build, dist checks
pnpm preview   # serve the build
```

Demo times are labelled and only appear in development. Run `pnpm verify` before opening a pull
request.

## Contributing

Data changes and code changes both go through a pull request to `main`. A merge to `main`
publishes the site, so a person reviews and merges every PR. Agents, including Grok Bot, prepare
pull requests but never merge or deploy them.

1. Read the masjid's own public source again on the day you record in `checked`.
2. Edit only that masjid's file in `src/data/masjids/`.
3. Run `pnpm verify`.
4. Open the PR with the source URL or channel and the date you read it.

The full rules for sources, contact details, and what to omit live in [AGENTS.md](AGENTS.md).
Branch, worktree, and deployment steps are in
[docs/branch-workflow.md](docs/branch-workflow.md).

## Reporting a wrong time

Use "Report a wrong time" on the site, or email
[clean.barn3748@fastmail.com](mailto:clean.barn3748@fastmail.com). A report starts a check against
the masjid's own source; it never changes a time by itself.

## Documentation

| File                                                                   | Covers                                     |
| ---------------------------------------------------------------------- | ------------------------------------------ |
| [GLOSSARY.md](GLOSSARY.md)                                             | Terms such as iqama and confirmed time     |
| [PRODUCT.md](PRODUCT.md)                                               | Audience, purpose, and accessibility goals |
| [DESIGN.md](DESIGN.md)                                                 | Visual rules                               |
| [docs/decisions.md](docs/decisions.md)                                 | Agreed product behavior                    |
| [docs/site-structure.md](docs/site-structure.md)                       | Folder ownership and import boundaries     |
| [docs/branch-workflow.md](docs/branch-workflow.md)                     | Branches, checks, deploys                  |
| [docs/official-schedule-sources.md](docs/official-schedule-sources.md) | Where each masjid's schedule lives         |
| [docs/grok-schedule-workflow.md](docs/grok-schedule-workflow.md)       | Weekly time review and PR preparation      |
