# Next: UI redesign

Requested 2026-11-26. The owner's verdict on the first build: it needs work and does not look good yet.

## Goals

- Look good on both mobile and desktop. The current page is designed for phones only.
- Use shadcn on Base UI, plus registry libraries such as Cnippet (`@cnippet`,
  https://ui.cnippet.dev/ and `@cnippet-blocks`, https://blocks.cnippet.dev/), or other component
  libraries that fit.

## Keep

- Behaviour, data and rules in [decisions.md](decisions.md): multi-pin, Daily / Jumu'ah, next
  prayer, freshness, sources, sunset Maghrib, forgiving search, report and Facebook links.
- The accessibility bar: 44px targets, 13px minimum text, no page overflow at 320px or 200% text.
- `pnpm verify` passing.

## Start here

`PRODUCT.md`, `DESIGN.md`, `GLOSSARY.md`, then the running site (`pnpm dev`; add
`?demo&at=2026-11-27T11:00` for sample times). The old mockups in `prototype/` are reference only:
the approved look may change; agreed behaviour does not without asking.
