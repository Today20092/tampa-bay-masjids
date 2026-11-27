---
name: Tampa Bay Masjids
description: A phone-first masjid timetable that shows only confirmed times
colors:
  primary: "#1f3461"
  primary-foreground: "#fdf9ef"
  gold: "#e9d6a2"
  gold-foreground: "#182923"
  background: "#f4eee0"
  card: "#fdf9ef"
  card-foreground: "#1c1d24"
  popover: "#fdf9ef"
  popover-foreground: "#1c1d24"
  foreground: "#1c1d24"
  secondary: "#ece4d0"
  secondary-foreground: "#1c1d24"
  accent: "#ece4d0"
  accent-foreground: "#1c1d24"
  muted: "#ece4d0"
  muted-foreground: "#5d5a55"
  past: "#605d57"
  attention: "#8f3a14"
  border: "#ddd3bc"
  row: "#e6ddc8"
  input: "#7d7360"
  ring: "#895019"
  detail: "#f7f1e3"
  destructive: "#a52a1a"
  friday: "#17604a"
  brand: "#1f3461"
  brand-foreground: "#fdf9ef"
  brand-action: "#fdf9ef"
  brand-action-foreground: "#1f3461"
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
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
  masjid-name:
    fontFamily: "Source Serif 4 Variable, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 700
  body:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.35
  label:
    fontFamily: "Source Sans 3 Variable, system-ui, sans-serif"
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

A phone-first timetable with a wider comparison layout on desktop. Night-blue ink on paper (lamp gold on night in dark mode) carries identity, the next time and the Facebook group link; rust (coral in dark) marks anything the visitor should verify. Everything else is
quiet so nine masjids and five times can be compared at a glance. The site follows the phone's light or dark setting unless the visitor picks Light or Dark in the footer.

**Key Characteristics:**

- A shared content width of up to 64rem.
- A table for comparison, with pinned masjids separated by a rule.
- State is shown by fill and weight as well as colour.
- Depth is limited to three levels: lifted surfaces, raised buttons, and everything else flat.

## Brand assets

- **Mark: the doorway of light** ([logo-mark.svg](public/logo-mark.svg)): three stepped pointed arches in deep gold, lamp gold and warm cream, two doors fully open inward and light spilling out. The doors’ lower edges and the floor light follow one perspective. Keep clear space around it and pair it with the full name “Tampa Bay Masjids” where space allows.
- **Small sizes** ([favicon.svg](public/favicon.svg)): one gold arch, the cream opening and wider doors, with no steps or floor light.
- **App icons:** render [app-icon.svg](docs/app-icon.svg) to `apple-touch-icon.png` (180px), `icon-192.png` and `icon-512.png` in `public/`. It is full bleed and keeps the art inside the maskable safe circle.
- **Mark colors** belong to the artwork only: `#174c40` tile, `#b48f3e`, `#e8c766`, `#fff6d6`, `#0f342b` door and an `#e9d184` beam that fades out. They do not change in dark mode and are not interface tokens.
- **Lockups:** mark beside the name in the header; mark centered above the name on the share card. The name is Source Serif 4 semibold. Do not stack “Tampa Bay” over “Masjids”.
- Use “Iqama, Jumu‘ah, and directions” when a short description helps identify the directory, but not in the site header.
- **Star lattice** ([lattice.svg](public/lattice.svg)): a faint eight-point star pattern, strongest at the edges and gone behind the middle. Only on the share card, never behind prayer times. It relates this site to its sister site, which keeps its own colors and mark; no personal name or photo is part of this brand.
- The [share card source](docs/social-preview.svg) shows what the directory offers: the mark, a serif headline, masjid logos, the five prayer names, then Jumu‘ah and directions. Show no times, because link previews outlive them. Keep the top-right corner clear for Facebook's info button, and keep text large enough to read on a phone.
- The logos and both fonts are embedded in the SVG as base64. Update the card when a listed logo changes; logo copies come from [the masjid logos](public/masjid-logos/).
- Edit the SVG and screenshot it at 1200 × 630, 1× scale, in headless Edge or Chrome as [the share PNG](public/social-preview.png). The shared page head uses that PNG for Open Graph and X cards; raise its `?v=` number there whenever the PNG changes.

## Colors

Light is paper and night-blue ink; dark is night and lamp gold.
[global.css](src/styles/global.css) writes each raw colour once as a named primitive (`--paper-*`,
`--ink-*`, `--night-*`, `--lamp-*` and so on) and points the semantic tokens at them with
`var()`. Primitives are not Tailwind utilities: components use the semantic tokens only.

### Primary

- **Primary** (`primary`): the next time, the main filled action, text links, the site name in the header and selected controls. Night-blue ink in light, lamp gold in dark.
- **Brand fill** (`brand`, `brand-foreground`): the large community footer box and the map markers. Navy in light, ink blue in dark.
- **Footer action** (`brand-action`, `brand-action-foreground`): the Join button on the brand fill. Paper in light, lamp gold in dark.
- **Logo tile** (`logo-tile`): a small tile behind each masjid logo. Transparent in light mode; white in dark mode so dark lettering stays readable. Dark mode also dims the logos to 84% brightness.

### Dark theme

Set in the `@variant dark` block of [global.css](src/styles/global.css). Gold, sun, night-sky and sky text tokens keep their light values.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `#f4eee0` | `#0b0f17` |
| `foreground` | `#1c1d24` | `#f2efe8` |
| `card` / `popover` | `#fdf9ef` | `#141a26` |
| `primary` | `#1f3461` | `#e8c766` |
| `primary-foreground` | `#fdf9ef` | `#1a1405` |
| `muted` / `secondary` | `#ece4d0` | `#202839` |
| `accent` | `#ece4d0` | `#273044` |
| `muted-foreground` | `#5d5a55` | `#9ea8bc` |
| `border` / `row` / `detail` | `#ddd3bc` / `#e6ddc8` / `#f7f1e3` | `#273044` / `#222a3b` / `#182030` |
| `input` | `#7d7360` | `#6b758b` |
| `ring` | `#895019` | `#9cc2ff` |
| `destructive` | `#a52a1a` | `#ff9a8a` |
| `attention` | `#8f3a14` | `#ff9f80` |
| `past` | `#605d57` | `#929cb1` |
| `friday` | `#17604a` | `#e8c766` |
| `brand` / `brand-foreground` | `#1f3461` / `#fdf9ef` | `#18264a` / `#f2efe8` |
| `brand-action` / `brand-action-foreground` | `#fdf9ef` / `#1f3461` | `#e8c766` / `#1a1405` |
| `sky` | `#192d47` | `#18264a` |

Rules for dark mode: feature code uses tokens only, never `dark:` classes or `.dark` selectors; add a dark value to every token that the dark block changes; keep every pair in `src/lib/colors.test.ts` passing in both themes.

### Page texture

- **Paper grain** (light only): a faint noise on the page background. Cards, tiles and times sit on solid fills.
- High contrast mode removes it.

### Sun

- **Sun** (`sun-core`, `sun-ring`, `sun-ray`): the sun glyph on the sun chart. Same values in both themes.
- **Night** (`sky-night`, `night-line`, `night-past`, `night-third`, `moon`, `dusk`): the sun panel from Maghrib to Fajr: deeper sky, the night arc ahead and travelled, the last third, the crescent and the orange glow during the flip. Same values in both themes.

### Secondary

- **Lamp gold** (`gold`): text selection and the focus outline on the brand fill.

### Neutral

- **Paper or night** (`background`), **card**, **ink** (`foreground`).
- **Muted fills** (`muted`, `detail`): table head, time tiles, opened row.
- **Muted ink** (`muted-foreground`, `past`): secondary lines, quiet row actions and passed times.
- **Lines** (`border`, `row`, `input`): `border` is the soft outline of surfaces and outline buttons; `input` is the 3:1 line around text fields and selects.

### Signals

- **Rust, coral in dark** (`attention`): "Check with the masjid" and "Checked Nov 15" markers. Coral keeps them apart from gold.
- **Jumu‘ah** (`friday`): the selected Jumu‘ah schedule. Green in light, so it differs from the navy Daily tab; lamp gold in dark.
- **Night blue and sunlight** (`sky`, `sky-foreground`, `sky-sun`, `sky-muted`): the sun panel and its text.
- **Focus** (`ring`): 3px outline, 2px offset. Copper in light, blue in dark.
- `destructive` is unused by pages.

### Named Rules

**The Next Time Rule.** Among times, only the next one gets a solid `primary` fill, flat, with no shadow. The other solid `primary` fills are raised buttons that name an action, such as the pinned card's Directions.

## Typography

**Headings** (`h1` to `h3`, including the site name and pinned masjid names): Source Serif 4, with Georgia as fallback. **Everything else:** Source Sans 3, with the system UI font as fallback. Arabic names use Noto Naskh Arabic, with a serif fallback. All fonts are self-hosted. `body` sets `font-size-adjust: 0.52` because both Source faces look small at their nominal size.

### Hierarchy

- **Title** (Source Serif 4 semibold, 1rem below 22.5rem, 1.125rem on phones and 1.5rem from 40rem): site name.
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
Directions are visible in every row. In the narrow list each row opens with the arrow, mark and name, with Directions and Pin as two square icon buttons at the top right; the place line sits below them at full width, then the times. With enlarged text (a list under 17rem wide) the two buttons move below the place line. Controls and rows keep their size when a button is tapped or the list is sorted: progress and success show inside the control, only a failure adds a line, and the place line stays one line, cutting the area short and never the distance. The area map loads on request after the timetable.
The sun panel sits under the pinned masjids and above search. It always shows the next calculated prayer start with its countdown, the start that just passed (so it never reads as a rival to a masjid's next iqama), and the solar chart, whose live sun uses a ray symbol. Tapping it opens the location button and the list of calculated starts in place. From Maghrib until Fajr the panel shows the night: the chart is the sun's depth below the horizon mirrored into an arc, with Isha, the last third, Fajr and sunrise marked, the night's length inside it, and a crescent that marks the time (not the moon's position or phase). The list then shows the night's times, including Islamic midnight. The day curve folds into the horizon and the night curve springs out of it as the sun is carved into the crescent; the flip plays only when Maghrib arrives on an open page (or on returning to it), and Fajr reverses it. A fresh load opens straight in day or night, and the sun or moon eases along that arc from its start to now. Reduced motion places it without gliding and only crossfades the flip. Where the night cannot be calculated the day chart stays. The header is a slim one-row bar on the card fill with a single line below, not sticky: the doorway mark and the name in Source Serif 4 semibold on the left, and a quiet outlined pill to the Facebook group on the right ("Join" below 30rem, "Join our Facebook group" above, and the full phrase to screen readers at every width). It is 64px tall on phones and 72px from 40rem; with enlarged text the pill wraps below the name. The footer carries the community call to action in a lifted brand-fill box (navy with a paper button in light, ink blue with a gold button in dark) and, last on the page, the Theme switch.

## Elevation & Depth

Three levels, set as tokens in [global.css](src/styles/global.css) with their own light and dark values. Components use the utilities, never raw shadows or `dark:` classes.

| Level | Utility | Used by |
| --- | --- | --- |
| Soft lift | `shadow-lift` | Pinned card, sun panel, masjid list and table, map popup, footer community box, no-JavaScript cards |
| Button lift | `shadow-button` (filled), `shadow-button-outline` (outline), `shadow-brand-action` (footer Join) | Pressable filled and outline buttons: pinned Directions, narrow-row Directions and Pin, Search, Show map, Nearest, Share, footer Join |
| Flat | none | Time tiles, next-time pill, tabs, table row actions, Details, header link |

A raised button sinks 1px and takes `shadow-pressed` while pressed; a switched-on Nearest stays sunk. Keyboard focus keeps the lift and adds the outline. Surfaces keep a border, so they still separate in high contrast mode, where shadows disappear.

## Shapes

10px controls, 14px cards, 8px time tiles. The Daily / Jumu‘ah selector groups two rounded segments.

## Components

shadcn on Base UI lives in `src/components/ui/`.

- **Button** `size="touch"`: at least 44px both ways, label may wrap. Links use `buttonVariants`
  on an `<a>`.
- **ToggleGroup** `size="touch"`: when selected, Daily uses `primary` and Jumu‘ah uses `friday`.
  The footer Theme switch (Auto, Light, Dark) uses the same `primary` underline. Auto saves nothing.
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
  control in every row would compete with the times. Table-row Directions and Pin and the pinned
  card's Unpin are `muted-foreground` at regular weight, with icons and 44px targets. Narrow-row
  Directions and Pin are 44px outline buttons showing a `primary` icon, with their names for screen
  readers.
- Outline buttons use the card fill, the soft `border` line and the outline lift. The no-JavaScript list uses text links for
  its destinations so the fallback remains simple and readable.

## Do's and Don'ts

- Do use the tokens; add a token before adding a colour.
- Do keep every control at 44px and every text at 0.8125rem or larger.
- Do show "Check with the masjid" wherever a confirmed, fresh time is missing.
- Do use lamp gold through the semantic tokens: in dark mode it is `primary`, so it colours links,
  headings, selected controls and filled buttons.
- Don't use the `gold` token for text or controls; it is only for text selection and focus on the brand fill.
- Don't add a shadow level, or lift anything in the flat row above, without a new design decision.
- Don't put the paper grain on cards or behind times.

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
