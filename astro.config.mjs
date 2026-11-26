// @ts-check
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://masjids.ayoubabed.xyz",
  integrations: [react()],
  // The toolbar covers the footer when previewing on a phone.
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
