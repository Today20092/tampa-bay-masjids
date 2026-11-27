---
name: Tampa Bay Masjids
description: A phone-first masjid timetable that shows only confirmed times
colors:
  primary: "#174c40"
  primary-foreground: "#ffffff"
  gold: "#e9d6a2"
  gold-foreground: "#182923"
  background: "#f7f8f5"
  card: "#ffffff"
  card-foreground: "#182923"
  popover: "#ffffff"
  popover-foreground: "#182923"
  foreground: "#182923"
  secondary: "#eaf1ed"
  secondary-foreground: "#182923"
  accent: "#eaf1ed"
  accent-foreground: "#182923"
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
  friday: "#41466f"
  sky: "#192d47"
  sky-foreground: "#ffffff"
  sky-sun: "#ffd88d"
  sky-muted: "#d5e0ee"
  sky-night: "#0f1830"
  night-line: "#aebdf0"
  night-past: "#dbe3ff"
  night-third: "#d9c4ff"
  moon: "#f3ecd2"
  dusk: "#ff9a5c"
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
  time-next:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
  card-pinned:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    padding: "16px 12px"
---

# Design System: Tampa Bay Masjids

The directory palette and controls are defined in `src/styles/global.css` and the components.

## Overview

**Creative North Star: "The masjid notice board" (inferred)**

A phone-first timetable with a wider comparison layout on desktop. Deep green carries identity, the next time and the Facebook group link; amber marks anything the visitor should verify. Everything else is
quiet so nine masjids and five times can be compared at a glance. The site follows the phone's light or dark setting unless the visitor picks Light or Dark in the footer.

**Key Characteristics:**

- A shared content width of up to 64rem.
- A table for comparison, with pinned masjids separated by a rule.
- State is shown by fill and weight as well as colour.

## Brand assets

- Use the pointed arch in [the favicon](public/favicon.svg) as the brand mark. Keep the gold silhouette on masjid green and give it clear space. Pair it with the full name “Tampa Bay Masjids” where space allows.
- Use masjid green and parchment as the main pair. Lamp gold can frame the mark and divide text on branded graphics. On the site, follow the control and status colors below.
- Use Georgia bold for the name on branded graphics and system sans-serif for supporting text and the interface. Use “Iqama, Jumu‘ah, and directions” when a short description helps identify the directory.
- The [share card source](docs/social-preview.svg) shows what the directory offers: a serif headline, masjid logos, the five prayer names, then Jumu‘ah and directions. Show no times, because link previews outlive them. Keep the top-right corner clear for Facebook's info button, and keep text large enough to read on a phone.
- The logos are embedded in the SVG as base64 copies of [the masjid logos](public/masjid-logos/). Update the card when a listed logo changes.
- Edit the SVG and screenshot it at 1200 × 630, 1× scale, in a headless browser (Edge or Chrome, on Windows for Georgia and Segoe UI) as [the share PNG](public/social-preview.png). The shared page head uses that PNG for Open Graph and X cards; raise its `?v=` number there whenever the PNG changes.

## Colors

### Primary

- **Masjid green** (`primary`): the next time and text links. In dark mode it is a light mint so it reads on night backgrounds.
- **Brand green** (`brand`, `brand-foreground`): the large community footer box and the map markers. It stays deep green in both themes.
- **Logo tile** (`logo-tile`): a small tile behind each masjid logo. Transparent in light mode; white in dark mode so dark lettering stays readable.

### Dark theme

Set in the `@variant dark` block of [global.css](src/styles/global.css). Brand, gold, sun and sky tokens keep their light values.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `#f7f8f5` | `#0f1714` |
| `foreground` | `#182923` | `#e6eee9` |
| `card` / `popover` | `#ffffff` | `#17221e` |
| `primary` | `#174c40` | `#7fc9b0` |
| `primary-foreground` | `#ffffff` | `#0c1f19` |
| `muted` / `secondary` | `#eaf1ed` | `#1f2d28` |
| `muted-foreground` | `#4a6056` | `#a9bfb4` |
| `border` / `row` / `detail` | `#cddbd3` / `#e0e8e3` / `#f1f6f3` | `#2c3f37` / `#22332c` / `#1b2823` |
| `input` | `#677c71` | `#6f877c` |
| `ring` | `#895019` | `#e6a964` |
| `destructive` | `#a52a1a` | `#ff9a8a` |
| `attention` | `#774617` | `#f0b878` |
| `past` | `#53655d` | `#93a89d` |
| `friday` | `#41466f` | `#b4b9f0` |

Rules for dark mode: feature code uses tokens only, never `dark:` classes or `.dark` selectors; add a dark value to every token that the dark block changes; keep every pair in `src/lib/colors.test.ts` passing in both themes.

### Sun

- **Sun** (`sun-core`, `sun-ring`, `sun-ray`): the sun glyph on the sun chart. Same values in both themes.
- **Night** (`sky-night`, `night-line`, `night-past`, `night-third`, `moon`, `dusk`): the sun panel from Maghrib to Fajr: deeper sky, the night arc ahead and travelled, the last third, the crescent and the orange glow during the flip. Same values in both themes.

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
- **Night blue and sunlight** (`sky`, `sky-foreground`, `sky-sun`, `sky-muted`): the sun panel and its text.
- **Focus orange** (`ring`): 3px outline, 2px offset.
- `destructive` is unused by pages.

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
a labeled list below 42rem of available width. Daily time tiles wrap with `auto-fit` from 3.15rem;
from 16rem of their own width (18rem when pinned), tiles stay in one line with Maghrib 1.7 times
(pinned: twice) as wide, so sunset wording does not wrap;
Jumu‘ah times use tiles at a fixed 4rem. Say once per masjid's set whether they are khutbah
starts, service starts or iqama: in the label beside a card's or opened row's tiles ("Jumu‘ah
khutbah"), or in one muted caption under the table's. Say nothing when the source does not. Never
label each tile. An opened row or card reads Jumu‘ah, name and address, the masjid's own links and Share,
then a source footnote with "Report a wrong time", which appears only beside shown times.
Directions are visible in every row. The area map loads on request after the timetable.
The sun panel sits under the pinned masjids and above search. It always shows the next calculated prayer start with its countdown, the start that just passed (so it never reads as a rival to a masjid's next iqama), and the solar chart, whose live sun uses a ray symbol. Tapping it opens the location button and the list of calculated starts in place. From Maghrib until Fajr the panel shows the night: the chart is the sun's depth below the horizon mirrored into an arc, with Isha, the last third, Fajr and sunrise marked, the night's length inside it, and a crescent that marks the time (not the moon's position or phase). The list then shows the night's times, including Islamic midnight. The day curve folds into the horizon and the night curve springs out of it as the sun is carved into the crescent; a night visit plays this once when the panel scrolls into view, Fajr reverses it, and reduced motion only crossfades. Where the night cannot be calculated the day chart stays. The header is a centered masthead on the page background, not a navigation bar: the arch mark and the name in Georgia bold (mark beside the name below 40rem, above it from 40rem), a quiet "Join our Facebook group" link, and a double rule. The footer carries the community call to action and, last on the page, the Theme switch.

## Elevation & Depth

Flat. Depth comes from borders and tonal fills; no shadows.

## Shapes

10px controls, 14px cards, 8px time tiles. The Daily / Jumu‘ah selector groups two rounded segments.

## Components

shadcn on Base UI lives in `src/components/ui/`.

- **Button** `size="touch"`: at least 44px both ways, label may wrap. Links use `buttonVariants`
  on an `<a>`.
- **ToggleGroup** `size="touch"`: Daily uses green and Jumu‘ah uses indigo when selected. The footer
  Theme switch (Auto, Light, Dark) uses the same green underline. Auto saves nothing.
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
- Don't use gold for text or controls; it is only for text selection and focus on green.
- Don't add shadows without a new design decision.

## Masjid logos

Use the marks published by the organizations below. Keep the visible masjid name beside each mark.
Use the event organizer’s mark for USF Jumu‘ah. A listing without a logo, such as Omar or Abu
Bakr, shows a mosque icon in a muted tile of the same size.

| Listing | Source |
| --- | --- |
| Al-Qassam | [Islamic Community of Tampa](https://ictampa.org/) |
| ISTABA | [Islamic Society of Tampa Bay Area](https://istaba.org/) |
| TMC and USF Jumu‘ah | [The Muslim Connection](https://tmcflorida.org/) · [USF schedule organizer](https://tmcflorida.org/jummah-time) |
| Daarusalam | [Islamic Society of New Tampa](https://www.newtampamasjid.org/) |
| IC of Wesley Chapel | [Islamic Community of Wesley Chapel](https://icwc.us/) |
| An-Noor | [Masjid An-Noor](https://www.wesleychapelmasjid.org/) |
