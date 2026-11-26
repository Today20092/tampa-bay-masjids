---
target: Tampa Bay Masjids directory
total_score: 29
max_score: 40
na_heuristics:
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\User\\Documents\\tampa-bay-masjids\\src\\pages\\index.astro"
target_fingerprint: "sha256:75b07996508114f8a6513dfc3e0a9a69cf3ae7ce2f9c863bea6c55dc7825c6af"
target_path: "C:\\Users\\User\\Documents\\tampa-bay-masjids\\src\\pages\\index.astro"
timestamp: 2026-11-26T18-28-50Z
slug: src-pages-index-astro
---
# Tampa Bay Masjids directory critique

Independent design review and detector/browser assessment. Operate mode. Live desktop and 390px mobile views, including an empty search and a saved Omar pin.

## Design health

| Heuristic | Score | Evidence |
| --- | --- | --- |
| Status visibility | 3 | Pinning announces changes and selected mode is visible. Mobile overflow is hard to spot. |
| Real-world match | 4 | Local names, area labels, prayer order, and sunset wording fit the task. |
| User control | 3 | Search clears and pins are reversible. Friday selection only changes the table. |
| Consistency | 3 | The pinned card labels Next explicitly. The table relies on emphasis. |
| Error prevention | 3 | Unconfirmed times are withheld. Mobile clipping can hide digits. |
| Recognition | 2 | Names and areas help. Directions, sources, and geography are hard to find at a glance. |
| Efficiency | 3 | Pins survive reload and area search works. Directions requires expanding the masjid. |
| Aesthetics and minimalism | 3 | Desktop comparison scans well. The masthead and Facebook call to action dominate on phones. |
| Error recovery | 3 | Empty search offers a clear action. Some missing times lack a direct verification path. |
| Help | 2 | The pin hint omits Directions and the scroll region gives little guidance. |
| Total | 29/40 | Good |

The local notice-board character comes from names, geography labels, schedule order and real-world prayer terms. The masthead and uniformly green surfaces add little geographic character. Saved pins give returning visitors a clear next time. The source and date reassure visitors once they open a row. First-time visitors face nine disclosures and five prayer columns on a narrow screen.

## Priority issues

1. P1. Adapt Daily on phones. At 390px the table hides the Isha heading and clips two times. Keep the desktop comparison and show every label and time together on mobile.
2. P1. Clarify Friday selection. Apply the selected schedule to pinned cards as well as the directory so Friday visitors can trust the first section they see.
3. P2. Improve first-visit hierarchy. Compact the masthead, expose Directions sooner, and leave secondary actions and sources one tap away.
4. P2. Shape geography and recognition. An optional labeled map using verified locations can answer proximity. Use a small authorized mark where available and an ordinary location symbol elsewhere. Reserve green for the next prayer, amber for verification, and use a clearly labeled distinct treatment for Friday.

## UX Intent

Visitors check their next prayer, compare Friday options, or get directions. First visit starts with area/name search and the list. A returning visitor starts with pins and can open search for another place. Searching for Busch narrowed results to Omar, pinning announced the change, and the pin survived reload. Confirmed time is visible in the table, source and Directions take one disclosure tap, and Directions then opens Maps. The next layout should surface Directions directly and keep source one tap away. Avoid tutorials, logo-only identification, and location permission on first load.

A hurried phone visitor may miss Isha. A newcomer must discover the disclosure to find Directions. A returning mobile visitor can switch the table to Friday and still see daily times in their pins.

The directory detector found three undocumented font sizes in MasjidDetail and Times. The runtime scan reported no anti-patterns. Existing shadcn primitives cover the core controls. The map choice is between a dedicated optional view and a small orientation graphic. The first-visit priority is between next time and one-tap directions.
