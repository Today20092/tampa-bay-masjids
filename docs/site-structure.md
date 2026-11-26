# Site structure

A page picks a layout and lists sections; sections are built from components.

| Folder                    | Holds                                                        |
| ------------------------- | ------------------------------------------------------------ |
| `src/pages/`              | Routes only, including `masjids.json` and `llms.txt`         |
| `src/layouts/`            | `BaseLayout.astro`, the one owner of `<html>` and global CSS |
| `src/components/layout/`  | Page frame: header, footer, head, Facebook link              |
| `src/components/sections/`| One page band each                                           |
| `src/components/ui/`      | shadcn components                                            |
| `src/features/directory/` | The interactive masjid list             |
| `src/data/`               | `site.ts` and one JSON file per masjid                       |
| `src/lib/`                | Plain TypeScript with its tests                              |

| From                  | May import                                                 |
| --------------------- | ---------------------------------------------------------- |
| `pages`               | anything below                                             |
| `layouts`             | `layouts`, `components/layout`, `ui`, `data`, `lib`, styles |
| `components/layout`   | own folder, `features`, `ui`, `data`, `lib`                |
| `components/sections` | own folder, `features`, `ui`, `data`, `lib`                |
| `features/x`          | own folder, `ui`, `data`, `lib`                            |
| `components/ui`       | own folder, `lib`                                          |
| `lib`, `data`         | each other                                                 |

`pnpm lint` enforces the table (`eslint.boundaries.mjs`).

Extract a section for a band you would move as one unit; share a component on its third use, or
sooner when behaviour or accessibility must stay identical.

Deviations: `src/content.config.ts` loads the JSON files from `src/data/masjids/` instead of
`src/content/`, as the spec asks. No sitemap integration for a one-page site.
