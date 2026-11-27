import { describe, expect, it } from "vitest";
import { byDistance, formatMiles, milesBetween } from "./distance";

const row = (id: string, lat?: number) => ({
  id,
  masjid: {
    location: lat === undefined ? undefined : { address: id, lat, lng: -82.45 },
  },
});
const rows = [row("unmapped"), row("far", 28.2), row("near", 28.01)];
const here = { lat: 28, lng: -82.45 };
const ids = (list: { id: string }[]) => list.map((r) => r.id);

describe("distance", () => {
  it("measures a degree of latitude as about 69 miles", () => {
    expect(milesBetween(here, { lat: 29, lng: -82.45 })).toBeCloseTo(69.1, 1);
  });

  it("sorts nearest first, with unmapped masjids last", () => {
    expect(ids(byDistance(rows, here))).toEqual(["near", "far", "unmapped"]);
    expect(byDistance(rows, here)[2].miles).toBeUndefined();
  });

  it("keeps the listed order without a location", () => {
    expect(byDistance(rows, null)).toEqual(rows);
  });

  it("shows tenths only when close", () => {
    expect(formatMiles(0.04)).toBe("0.0 mi");
    expect(formatMiles(4.25)).toBe("4.3 mi");
    expect(formatMiles(23.6)).toBe("24 mi");
  });
});
