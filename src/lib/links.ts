import { SITE } from "@/data/site";
import type { Masjid } from "./masjid-schema";

/** Previews the route in Google Maps, so the visitor can check the destination before starting. */
export function directionsUrl({
  address,
  mapsPlaceId,
}: Pick<Masjid, "address" | "mapsPlaceId">): string {
  // Every listed masjid is in Florida; the state alone helps maps where city and ZIP are unconfirmed.
  const destination = /\bFL\b/.test(address) ? address : `${address}, FL`;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  return mapsPlaceId ? `${url}&destination_place_id=${mapsPlaceId}` : url;
}

/** Opens the directory at one masjid. */
export const masjidUrl = ({ id }: Pick<Masjid, "id">) => `${SITE.url}/#${id}`;

export const reportUrl = ({ name }: Pick<Masjid, "name">) =>
  `mailto:${SITE.reportEmail}?subject=${encodeURIComponent(`Wrong time: ${name}`)}&body=${encodeURIComponent(`The prayer time shown for ${name} may be incorrect.\n\nPlease share the correct time and a link to the masjid's official source.`)}`;

export const feedbackUrl = `mailto:${SITE.reportEmail}?subject=${encodeURIComponent("Tampa Bay Masjids feedback")}`;

export const addMasjidUrl = `mailto:${SITE.reportEmail}?subject=${encodeURIComponent("Add a masjid to Tampa Bay Masjids")}&body=${encodeURIComponent("Please share the masjid name, address, and its official website or public page.")}`;
