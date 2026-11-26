import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import boundaries from "./eslint.boundaries.mjs";

export default [
  { ignores: ["dist/", ".astro/", ".wrangler/", "prototype/", ".impeccable/"] },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...boundaries,
];
