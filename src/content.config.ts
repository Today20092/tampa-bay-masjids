import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { masjidSchema } from "@/lib/masjid-schema";

export const collections = {
  masjids: defineCollection({
    loader: glob({ base: "./src/data/masjids", pattern: "*.json" }),
    schema: masjidSchema,
  }),
};
