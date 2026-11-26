---
name: Tampa Bay Masjids
description: A phone-first masjid timetable that shows only confirmed times
colors:
  primary: "#174c40"
  primary-foreground: "#ffffff"
  gold: "#e9d6a2"
  background: "#f7f8f5"
  card: "#ffffff"
  foreground: "#182923"
  muted: "#eaf1ed"
  muted-foreground: "#4a6056"
  past: "#53655d"
  attention: "#774617"
  border: "#cddbd3"
  row: "#e0e8e3"
  input: "#677c71"
  ring: "#895019"
  detail: "#f1f6f3"
  destructive: "#a52a1a"
  sample: "#fde2b8"
  sample-foreground: "#5b3200"
  friday: "#41466f"
  sky: "#192d47"
  sky-sun: "#ffd88d"
  sky-muted: "#d5e0ee"
typography:
  title:
    fontFamily: "Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 700
  masjid-name:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
  body:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.35
  label:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "0.8125rem"
    lineHeight: 1.35
  arabic-name:
    fontFamily: "Noto Naskh Arabic, serif"
    fontSize: "1.0625rem"
    lineHeight: 1.6
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

The directory palette and controls are defined in `src/styles/global.css` and the components.

## Overview

**Creative North Star: "The masjid notice board" (inferred)**

A phone-first timetable with a wider comparison layout on desktop. Deep green carries identity and the next time; warm gold is
kept for the Facebook group; amber marks anything the visitor should verify. Everything else is
quiet so nine masjids and five times can be compared at a glance. Light theme only.

**Key Characteristics:**

- A shared content width of up to 64rem.
- A table for comparison, with pinned masjids separated by a rule.
- State is shown by fill and weight as well as colour.

## Brand assets

- Use the pointed arch in [the favicon](public/favicon.svg) as the brand mark. Keep the gold silhouette on masjid green and give it clear space. Pair it with the full name “Tampa Bay Masjids” where space allows.
- Use masjid green and parchment as the main pair. Lamp gold can frame the mark and divide text on branded graphics. On the site, follow the control and status colors below.
- Use Georgia bold for the name on branded graphics and system sans-serif for supporting text and the interface. Use “Iqama, Jumu‘ah, and directions” when a short description helps identify the directory.
- The [share card source](docs/social-preview.svg) uses a quiet geometric border and serif title inspired by Islam with Ayoub. Keep ornament at the edges and leave the name and description in an open central area.
- Edit the SVG and export it in VectorCraft at 1× as [the 1200 × 630 PNG](public/social-preview.png). The shared page head uses that PNG for Open Graph and X cards.

## Colors

### Primary

- **Masjid green** (`primary`): community footer, the next time, links.

### Secondary

- **Lamp gold** (`gold`): text selection and focus outline on green.

### Neutral

- **Off-white** (`background`), **white** (`card`), **ink** (`foreground`).
- **Sage** (`muted`, `detail`): table head, time tiles, opened row.
- **Muted ink** (`muted-foreground`, `past`): secondary lines and passed times.
- **Lines** (`border`, `row`, `input`): `input` is the darker line that outlines controls.

### Signals

- **Amber** (`attention`): "Check with the masjid" and "Checked Nov 15" markers.
- **Indigo** (`friday`): selected Jumu‘ah schedule.
- **Night blue and sunlight** (`sky`, `sky-sun`, `sky-muted`): the solar chart and its text.
- **Focus orange** (`ring`): 3px outline, 2px offset.
- `sample` colours appear only in the dev preview banner. `destructive` is unused by pages.

### Named Rules

**The Next Time Rule.** A solid green fill inside a table or card means "next", nothing else.

## Typography

**Body and headings:** Manrope, with the system UI font as fallback. Arabic names use Noto Naskh Arabic, with a serif fallback. Both fonts are self-hosted.

### Hierarchy

- **Title** (Georgia bold, 1.5rem on mobile and 2.5rem from 40rem): site name.
- **Masjid name** (700, 1.125rem): pinned card heading and Arabic name.
- **Body** (400, 0.875rem): general text; the search field is 1rem.
- **Label** (0.8125rem): table, tiles, sources. This is the smallest size on the site.

Times use tabular numerals. Passed times drop to regular weight.

## Layout

Header, directory and footer share a fluid 64rem shell. The schedule selector applies to pinned
masjids and the directory. Pinned masjids use two columns from 48rem. The directory switches to
a labeled list below 42rem of available width. Time tiles wrap with `auto-fit` from 3.15rem.
Directions are visible in every row. The area map loads on request after the timetable.
The solar chart sits below the timetable, with nothing above the timetable pointing to it. Its live sun uses a ray symbol, and the complete list of calculated starts opens on demand. The header is a centered masthead on the page background, not a navigation bar: the arch mark and the name in Georgia bold (mark beside the name below 40rem, above it from 40rem), a quiet "Join our Facebook group" link, and a double rule. The footer carries the community call to action.

## Elevation & Depth

Flat. Depth comes from borders and tonal fills; no shadows.

## Shapes

10px controls, 14px cards, 8px time tiles. The Daily / Jumu‘ah selector groups two rounded segments.

## Components

shadcn on Base UI lives in `src/components/ui/`.

- **Button** `size="touch"`: at least 44px both ways, label may wrap. Links use `buttonVariants`
  on an `<a>`.
- **ToggleGroup** `size="touch"`: Daily uses green and Jumu‘ah uses indigo when selected.
- **Input**: search, 44px, 16px text.
- **Collapsible**: pinned masjid with an inline Details disclosure.
- **Table**: row header is a disclosure button; `containerProps` names the scrolling region.
- **Empty**: no search results.

### Action hierarchy

- Use links for destinations, including email and in-page navigation, and buttons for commands
  that change state. Keep the same label for the same action across the directory.
- Give the primary next step in a group a filled treatment, and use outlined controls for peer
  actions. A link may use either treatment while retaining link semantics.
- Use underlined text links for supporting sources, jump links, and reporting a wrong time. Keep
  them recognizable before hover, keyboard accessible, and large enough to use on touch screens.
- Keep Directions prominent on pinned cards and quiet in the comparison list, where a filled
  control in every row would compete with the times. The no-JavaScript list uses text links for
  its destinations so the fallback remains simple and readable.

## Do's and Don'ts

- Do use the tokens; add a token before adding a colour.
- Do keep every control at 44px and every text at 0.8125rem or larger.
- Do show "Check with the masjid" wherever a confirmed, fresh time is missing.
- Don't use gold for anything that competes with the group link.
- Don't add dark mode or shadows without a new design decision.

## Masjid logos

Use the marks published by the organizations below. Keep the visible masjid name beside each mark.
Use the event organizer’s mark for USF Jumu‘ah. Omar and Abu Bakr show their names while a
logo is unavailable.

| Listing | Source |
| --- | --- |
| Al-Qassam | [Islamic Community of Tampa](https://ictampa.org/) |
| ISTABA | [Islamic Society of Tampa Bay Area](https://istaba.org/) |
| TMC and USF Jumu‘ah | [The Muslim Connection](https://tmcflorida.org/) · [USF schedule organizer](https://tmcflorida.org/jummah-time) |
| Daarusalam | [Islamic Society of New Tampa](https://www.newtampamasjid.org/) |
| IC of Wesley Chapel | [Islamic Community of Wesley Chapel](https://icwc.us/) |
| An-Noor | [Masjid An-Noor](https://www.wesleychapelmasjid.org/) |
