import { describe, expect, it } from "vitest";
import { solarDay, TAMPA_SKY } from "./solar-day";

describe("Tampa solar chart", () => {
  it("places the afternoon sun on the descending arc with Asr next", () => {
    const data = solarDay(new Date("2026-11-26T18:00:00Z"), TAMPA_SKY);
    expect(data.events.map(({ label }) => label)).toEqual([
      "Fajr",
      "Sunrise",
      "Dhuhr",
      "Asr",
      "Maghrib",
      "Isha",
    ]);
    expect(data.altitude).toBeGreaterThan(35);
    expect(data.altitude).toBeLessThan(45);
    expect(data.azimuth).toBeGreaterThan(180);
    expect(data.azimuth).toBeLessThan(220);
    expect(data.sun?.x).toBeGreaterThan(data.events[2].x);
    expect(data.sun?.x).toBeLessThan(data.events[3].x);
    expect(data.nextPrayer?.key).toBe("asr");
  });

  it("uses Tampa's calendar day across UTC midnight and advances to tomorrow's Fajr", () => {
    const data = solarDay(new Date("2026-11-27T02:00:00Z"), TAMPA_SKY);
    expect(data.events[0].time.toISOString().slice(0, 10)).toBe("2026-11-26");
    expect(data.nextPrayer?.label).toBe("Fajr tomorrow");
    expect(data.nextPrayer?.time.toISOString().slice(0, 10)).toBe("2026-11-27");
    expect(data.altitude).toBeLessThan(0);
    expect(data.sun).toBeNull();
  });
});
