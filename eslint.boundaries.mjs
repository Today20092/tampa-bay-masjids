// Fails the lint when an import goes against the layer direction in references/standard.md.
// Add to eslint.config.js:  import boundaries from './eslint.boundaries.mjs';
//                           export default [...yourConfig, ...boundaries];
// The project config must already parse .astro and TypeScript (eslint-plugin-astro).
// Matches import text only: it assumes the `@/` alias and misses import.meta.glob,
// template-literal import(), <script src> and MDX files.
// Vendored component folders under src/components that count as `ui`, e.g. 'ui|lumos'.
const UI = "ui";

// "@/x/…" or "../x/…"; "components/" is optional so "../sections/X" is caught too.
const to = (dirs) => String.raw`^(@/|(\.\./)+)(components/)?(${dirs})(/|$)`;
// A later block replaces an earlier one for the same file, so each lists every ban.
const ban = (files, ...regexes) => ({
  files,
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: regexes.map((regex) => ({
          regex,
          message:
            "Import goes against the layer direction (docs/site-structure.md).",
        })),
      },
    ],
    "no-restricted-syntax": [
      "error",
      ...regexes.map((r) => ({
        selector: `ImportExpression > Literal[value=/${r.replaceAll("/", "\\u002F")}/]`,
        message:
          "Import goes against the layer direction (docs/site-structure.md).",
      })),
    ],
  },
});
const topics = `^@/components/(?!layout/|(${UI})/)`;

export default [
  ban(["src/layouts/**"], to("pages|features|sections"), topics),
  ban(["src/components/**"], to("pages|layouts|sections|layout|features")), // topic folders
  ban(["src/components/layout/**"], to("pages|layouts|sections"), topics),
  ban(["src/components/sections/**"], to("pages|layouts|layout")),
  ban(
    UI.split("|").map((dir) => `src/components/${dir}/**`),
    to("pages|layouts|sections|layout|features|data|content"),
    `^@/components/(?!(${UI})/)`,
  ),
  ban(
    ["src/features/**"],
    to("pages|layouts|sections|layout|features"),
    String.raw`^\.\./`,
  ),
  ban(
    ["src/lib/**", "src/data/**"],
    to("pages|layouts|components|features"),
    String.raw`\.astro$`,
  ),
];
