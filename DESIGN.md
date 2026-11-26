---
name: Tampa Bay Masjids
description: A phone-first masjid timetable that shows only confirmed times
colors:
  primary: "#14513f"
  primary-foreground: "#ffffff"
  gold: "#e8c766"
  background: "#f7f5ee"
  card: "#ffffff"
  foreground: "#17251f"
  muted: "#eef3ef"
  muted-foreground: "#4a574f"
  past: "#56645c"
  attention: "#8a4b00"
  border: "#c9c4b3"
  row: "#e2ddcc"
  input: "#6f7d75"
  ring: "#b45309"
  detail: "#f3f6f3"
  destructive: "#a52a1a"
  sample: "#fde2b8"
  sample-foreground: "#5b3200"
typography:
  title:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
  masjid-name:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.35
  label:
    fontFamily: "system-ui, sans-serif"
    fontSize: "0.8125rem"
    lineHeight: 1.35
rounded:
  md: "8px"
  lg: "10px"
  xl: "14px"
spacing:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    height: "44px"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: "44px"
  button-group-link:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    height: "44px"
  time-next:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
  card-pinned:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    padding: "12px"
---

# Design System: Tampa Bay Masjids

Recorded from `src/styles/global.css` and the components. The descriptive wording is inferred;
the values are the approved mockup's.

## Overview

**Creative North Star: "The masjid notice board" (inferred)**

A plain, dense, phone-first timetable. Deep green carries identity and the next time; warm gold is
kept for the Facebook group; amber marks anything the visitor should verify. Everything else is
quiet so nine masjids and five times can be compared at a glance. Light theme only.

**Key Characteristics:**

- One column, at most 36rem wide.
- A table for comparison, bordered cards for pinned masjids.
- State is shown by fill and weight as well as colour.

## Colors

### Primary

- **Masjid green** (`primary`): header, primary action, pinned border, the next time, links.

### Secondary

- **Lamp gold** (`gold`): the Facebook group button, text selection, focus outline on green.

### Neutral

- **Parchment** (`background`), **white** (`card`), **ink** (`foreground`).
- **Sage** (`muted`, `detail`): table head, time tiles, opened row.
- **Muted ink** (`muted-foreground`, `past`): secondary lines and passed times.
- **Lines** (`border`, `row`, `input`): `input` is the darker line that outlines controls.

### Signals

- **Amber** (`attention`): "Check with the masjid" and "Checked Nov 15" markers.
- **Focus orange** (`ring`): 3px outline, 2px offset.
- `sample` colours appear only in the dev preview banner. `destructive` is unused by pages.

### Named Rules

**The Next Time Rule.** A solid green fill inside a table or card means "next", nothing else.

## Typography

**Body and headings:** the system UI font. Arabic uses the system's Arabic face.

### Hierarchy

- **Title** (700, 1.125rem): site name.
- **Masjid name** (700, 1.0625rem): pinned card heading and Arabic name.
- **Body** (400, 0.875rem): general text; the search field is 1rem.
- **Label** (0.8125rem): table, tiles, sources. This is the smallest size on the site.

Times use tabular numerals. Passed times drop to regular weight.

## Layout

A single centred column (`max-w-xl`) with 10px side padding. Vertical stacks use a 10px gap,
inside cards 8px. The table scrolls inside its own region when text is large; the masjid column
and the opened row stay in view. Time tiles wrap with `auto-fit` from 3.15rem.

## Elevation & Depth

Flat. Depth comes from borders and tonal fills; no shadows.

## Shapes

10px controls, 14px cards, 8px time tiles. Only the Daily / Jumu‘ah switch is a pill.

## Components

shadcn on Base UI lives in `src/components/ui/`.

- **Button** `size="touch"`: at least 44px both ways, label may wrap. Links use `buttonVariants`
  on an `<a>`.
- **ToggleGroup** `size="touch"`: Daily / Jumu‘ah; the pressed side is solid green.
- **Input**: search, 44px, 16px text.
- **Card** + **Collapsible**: pinned masjid with a Details toggle.
- **Table**: row header is a disclosure button; `containerProps` names the scrolling region.
- **Empty**: no search results.

## Do's and Don'ts

- Do use the tokens; add a token before adding a colour.
- Do keep every control at 44px and every text at 0.8125rem or larger.
- Do show "Check with the masjid" wherever a confirmed, fresh time is missing.
- Don't use gold for anything that competes with the group link.
- Don't add dark mode, shadows or a web font without a new design decision.
