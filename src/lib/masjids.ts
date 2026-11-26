import { getCollection } from "astro:content";
import type { Masjid } from "./masjid-schema";

export async function getMasjids(): Promise<Masjid[]> {
  const entries = await getCollection("masjids");
  return entries
    .map(({ id, data }) => ({ id, ...data }))
    .sort((a, b) => a.order - b.order);
}
