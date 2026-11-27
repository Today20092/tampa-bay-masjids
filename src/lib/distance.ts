import type { Masjid } from "./masjid-schema";

export interface Point {
  lat: number;
  lng: number;
}

const EARTH_MILES = 3958.8;
const radians = (degrees: number) => (degrees * Math.PI) / 180;

/** Straight-line (great-circle) miles, not driving distance. */
export function milesBetween(a: Point, b: Point): number {
  const h =
    Math.sin(radians(b.lat - a.lat) / 2) ** 2 +
    Math.cos(radians(a.lat)) *
      Math.cos(radians(b.lat)) *
      Math.sin(radians(b.lng - a.lng) / 2) ** 2;
  return 2 * EARTH_MILES * Math.asin(Math.sqrt(h));
}

/**
 * Rows with their distance from `here`, nearest first. A masjid without a map
 * point goes last; without `here` the listed order is kept and nothing is added.
 */
export function byDistance<T extends { masjid: Pick<Masjid, "location"> }>(
  rows: readonly T[],
  here: Point | null,
): (T & { miles?: number })[] {
  if (!here) return [...rows];
  return rows
    .map((row) => ({
      ...row,
      miles: row.masjid.location && milesBetween(here, row.masjid.location),
    }))
    .sort((a, b) => (a.miles ?? Infinity) - (b.miles ?? Infinity) || 0);
}

export const formatMiles = (miles: number) =>
  `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`;
