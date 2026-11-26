import { SITE } from "@/data/site";
import type { Masjid } from "./masjid-schema";

export function directionsUrl({
  address,
  mapsUrl,
}: Pick<Masjid, "address" | "mapsUrl">): string {
  if (mapsUrl) return mapsUrl;
  // Every listed masjid is in Florida; the state alone helps maps where city and ZIP are unconfirmed.
  const destination = /\bFL\b/.test(address) ? address : `${address}, FL`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export const reportUrl = ({ name }: Pick<Masjid, "name">) =>
  `mailto:${SITE.reportEmail}?subject=${encodeURIComponent(`Wrong time: ${name}`)}`;
