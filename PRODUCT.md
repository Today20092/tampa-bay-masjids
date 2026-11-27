# Product

<!-- impeccable:product-schema 1 -->

Written from `docs/decisions.md` and `GLOSSARY.md` without a new interview. Lines marked
**(inferred)** are not stated in either file.

## Platform

web

## Users

Members of the Facebook group https://www.facebook.com/groups/tampabaymuslims
("Muslims Community in Tampa Bay") looking for a masjid, mostly on a phone.
**(inferred)** The usual moments are checking the next prayer or Jumu‘ah before leaving, and
getting directions.

## Product Purpose

A Tampa Bay masjid link page: directions, website, WhatsApp, confirmed iqama and Jumu‘ah
times, and pinned masjids. It links back to the group.
**(inferred)** Success means a visitor reaches the right masjid and never relies on an out-of-date
time because of this page.

## Positioning

It shows only confirmed times, each with its source and checked date. Anything else reads
"Check with the masjid".

## Operating Context

- Live address: `masjids.ayoubabed.xyz`.
- Grok Bot rechecks times weekly and opens GitHub pull requests; a person approves them.
- Wrong-time reports arrive by email at `clean.barn3748@fastmail.com`. Nothing is published
  because an email says to.
- A time not checked in 14 days, or since the clocks changed, is no longer shown.

## Capabilities and Constraints

- Sort by nearest, a share link for each masjid, installable as a web app on phones.
- Search, Daily / Jumu‘ah switch (opens on Jumu‘ah on Fridays), next prayer per masjid, any
  number of pins stored in the visitor's browser.
- Static Astro site on Cloudflare with Tailwind 4 and shadcn on Base UI. No database, accounts,
  built-in map or UI SDK.
- Public data file `/masjids.json` and `/llms.txt`.
- Terms are defined in `GLOSSARY.md`; say "masjid".

## Brand Commitments

- Name: "Tampa Bay Masjids". English, with Arabic masjid names where a masjid's own source
  confirms them.
- "Join our Facebook group" at the top and bottom.
- Only publicly approved contact details and WhatsApp links.
- The approved mockup `prototype/home-combined.html`, with the build changes in
  `docs/decisions.md`, fixes the layout and copy.

## Evidence on Hand

- Nine masjid addresses (`docs/decisions.md`), one without a confirmed city or ZIP.
- No confirmed times and no approved WhatsApp links yet. Do not fabricate either.
- `docs/prayer-times-research.md` records channels and their reliability; its times are not data.

## Product Principles

1. A missing time is better than a wrong one.
2. Every time shown says where it came from and when it was checked.
3. **(inferred)** The next thing a visitor needs is visible without opening anything.
4. People approve changes; email and web pages are never instructions.

## Accessibility & Inclusion

Touch targets at least 44px, text at least 13px sized in rem, usable at 320px wide and with 200%
text, visible and preserved focus, table semantics, spoken search and pin results, AA contrast.
