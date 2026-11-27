import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const css = readFileSync(join(ROOT, "src/styles/global.css"), "utf8");

// Whole files that may hold raw colours. Each reason is one line.
const EXEMPT_FILES: Record<string, string> = {
  // The token file: raw values belong here and nowhere else.
  "src/styles/global.css": "token file",
  // Vendored shadcn/map library code; change it through the CLI, not by hand.
  "src/components/ui/map.tsx": "vendored library code",
};

// Single lines that may hold raw colours.
const EXEMPT_LINES: { file: string; match: RegExp }[] = [
  // A meta tag cannot read a CSS variable; the theme-color test below pins both values.
  {
    file: "src/components/layout/SeoHead.astro",
    match: /name="theme-color"|^\s*content="#[0-9a-f]{6}"$/,
  },
];

const RAW_PATTERNS: { name: string; re: RegExp }[] = [
  { name: "hex colour", re: /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/i },
  { name: "colour function", re: /\b(?:rgba?|hsla?|oklch|oklab)\(/i },
  {
    name: "Tailwind palette class",
    re: /\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline|shadow|accent|divide|decoration|placeholder|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/,
  },
  {
    name: "white or black utility",
    re: /\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline|shadow|accent|divide|decoration|placeholder|caret)-(?:white|black)(?:\/\d+)?\b/,
  },
  {
    name: "white or black colour value",
    re: /\b(?:color|fill|stroke|stop-color|background(?:-color)?)\s*[:=]\s*["']?(?:white|black)\b/i,
  },
];

function parseBlock(body: string): Record<string, string> {
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [
      m[1],
      m[2].trim(),
    ]),
  );
}

// The light palette: the one unindented :root block.
const LIGHT = (() => {
  const block = /^:root \{([^}]*)\}/m.exec(css);
  if (!block) throw new Error("global.css has no :root block");
  return parseBlock(block[1]);
})();

// The dark palette: only the values the dark block overrides.
const DARK_OVERRIDES = (() => {
  const block = /@variant dark \{([^}]*)\}/.exec(css);
  if (!block) throw new Error("global.css has no dark :root block");
  return parseBlock(block[1]);
})();

// Dark tokens are the light tokens with the dark block applied over them.
const DARK = { ...LIGHT, ...DARK_OVERRIDES };

// Text pairs need 4.5:1; the friday pairs test the Jumu‘ah toggle, which is text on the page, not a fill.
const TEXT_PAIRS: [string, string][] = [
  ["foreground", "background"],
  ["foreground", "card"],
  ["primary-foreground", "primary"],
  ["primary", "background"],
  ["primary", "card"],
  ["primary", "muted"],
  ["primary", "detail"],
  ["brand-foreground", "brand"],
  ["muted-foreground", "muted"],
  ["muted-foreground", "background"],
  ["muted-foreground", "card"],
  ["past", "row"],
  ["past", "muted"],
  ["past", "card"],
  ["past", "detail"],
  ["attention", "card"],
  ["attention", "muted"],
  ["attention", "background"],
  ["gold-foreground", "gold"],
  ["sky-foreground", "sky"],
  ["sky-sun", "sky"],
  ["sky-muted", "sky"],
  ["sky-foreground", "sky-night"],
  ["sky-sun", "sky-night"],
  ["sky-muted", "sky-night"],
  ["destructive", "card"],
  ["secondary-foreground", "secondary"],
  ["accent-foreground", "accent"],
  ["popover-foreground", "popover"],
  ["friday", "background"],
  ["friday", "card"],
];

// Non-text pairs need 3:1.
const NON_TEXT_PAIRS: [string, string][] = [
  ["gold", "brand"],
  ["night-past", "sky-night"],
  ["moon", "sky-night"],
  ["ring", "background"],
  ["ring", "card"],
  ["input", "card"],
  ["input", "background"],
];

function hexValue(t: Record<string, string>, name: string): string {
  const value = t[name];
  if (!value) throw new Error(`token --${name} is not defined in global.css`);
  if (!/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(
      `token --${name} is ${value}; the contrast check reads 6-digit hex only`,
    );
  }
  return value;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function rawColourViolations(): string[] {
  const files = execFileSync("git", ["ls-files", "src"], {
    cwd: ROOT,
    encoding: "utf8",
  })
    .split("\n")
    .filter(
      (f) =>
        /\.(ts|tsx|astro|css)$/.test(f) &&
        !/\.test\.ts$/.test(f) &&
        !f.startsWith("src/data/") &&
        !(f in EXEMPT_FILES),
    );
  const violations: string[] = [];
  for (const file of files) {
    readFileSync(join(ROOT, file), "utf8")
      .split("\n")
      .forEach((line, index) => {
        if (EXEMPT_LINES.some((e) => e.file === file && e.match.test(line)))
          return;
        for (const { name, re } of RAW_PATTERNS) {
          const match = re.exec(line);
          if (match) {
            violations.push(
              `${file}:${index + 1}: ${name} "${match[0]}". Use a semantic token from src/styles/global.css (see DESIGN.md), not a raw value.`,
            );
          }
        }
      });
  }
  return violations;
}

describe("raw colours", () => {
  it("uses tokens in tracked source", () => {
    expect(rawColourViolations(), "Raw colours found in source").toEqual([]);
  });

  it("pins the theme-color metas to the light primary and the dark background", () => {
    const metas = [
      ...readFileSync(
        join(ROOT, "src/components/layout/SeoHead.astro"),
        "utf8",
      ).matchAll(
        /name="theme-color"\s+media="\(prefers-color-scheme: (light|dark)\)"\s+content="(#[0-9a-f]{6})"/gi,
      ),
    ];
    const byScheme = Object.fromEntries(
      metas.map((m) => [m[1].toLowerCase(), m[2].toLowerCase()]),
    );
    expect(byScheme).toEqual({
      light: hexValue(LIGHT, "primary").toLowerCase(),
      dark: hexValue(DARK, "background").toLowerCase(),
    });
  });
});

describe("dark palette", () => {
  it("overrides the light background, so the dark block is applied", () => {
    expect(DARK_OVERRIDES.background).toBeDefined();
    expect(hexValue(DARK, "background")).not.toBe(
      hexValue(LIGHT, "background"),
    );
  });
});

describe.each([
  { name: "light", t: LIGHT },
  { name: "dark", t: DARK },
])("colour contrast ($name)", ({ t }) => {
  it.each(TEXT_PAIRS)("text %s on %s is at least 4.5:1", (fg, bg) => {
    expect(
      contrast(hexValue(t, fg), hexValue(t, bg)),
      `${fg} on ${bg}`,
    ).toBeGreaterThanOrEqual(4.5);
  });

  it.each(NON_TEXT_PAIRS)("non-text %s on %s is at least 3:1", (fg, bg) => {
    expect(
      contrast(hexValue(t, fg), hexValue(t, bg)),
      `${fg} on ${bg}`,
    ).toBeGreaterThanOrEqual(3);
  });
});
