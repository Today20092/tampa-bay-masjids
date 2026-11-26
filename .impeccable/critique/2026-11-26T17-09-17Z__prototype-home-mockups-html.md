---
target: home mockups A and C
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
target_identity: "file:C:\\Users\\User\\Documents\\tampa-bay-masjids\\prototype\\home-mockups.html"
target_fingerprint: "sha256:24f1f9f4ec679d93726d406e234eebd529d24991a9eeb6e16c4b861b478b7eb3"
target_path: "C:\\Users\\User\\Documents\\tampa-bay-masjids\\prototype\\home-mockups.html"
timestamp: 2026-11-26T17-09-17Z
slug: prototype-home-mockups-html
---
Method: dual-agent (design review + detector)

Variants A (Cards) and C (Table). Scores: A 22/40, C 21/40 (both Acceptable).

| Heuristic | A | C |
|---|---|---|
| 1 System status | 2 | 1 |
| 2 Real world | 3 | 3 |
| 3 Control and freedom | 2 | 2 |
| 4 Consistency | 3 | 2 |
| 5 Error prevention | 2 | 2 |
| 6 Recognition | 3 | 2 |
| 7 Efficiency | 2 | 3 |
| 8 Minimalism | 2 | 3 |
| 9 Error recovery | 2 | 2 |
| 10 Help | 1 | 1 |

Specificity: moderate; comes from content more than look.
Detector: CLI 0 findings. Overlay 9 nested-cards in A, false positive (mockup frame).

## Priority issues
- P1 Trust: no source shown; C table has no dates; USF card shows a warning next to a confirmed time.
- P1 Jumu'ah buried: not in C's table; 12px grey in A.
- P1 Tap targets: all controls under 44px in height; C row names 17px high and look like text; detail lacks website and Arabic name.
- P1 Next prayer hard-coded to Asr; passed times, Friday and after Isha undefined.
- P2 A repetition: 9 "All times and website" links, 4:15 twice, two cards per screen.

## Accessibility
Focus drops to body after pin/open; Pinned cannot unpin; repeated unlabeled-by-masjid buttons; table lacks caption and scope; search not announced and misses "al qassam", "jumu'ah"; 12px text; px font sizes ignore user text size; borders 1.25-1.6:1. Text contrast passes (min 5.19).
