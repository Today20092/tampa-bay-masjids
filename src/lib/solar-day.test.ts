import { describe, expect, it } from "vitest";
import {
  FLIP_MS,
  flipPoint,
  glidePoint,
  solarDay,
  TAMPA_SKY,
} from "./solar-day";

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

  it("turns to night at Maghrib and back to day at Fajr", () => {
    const at = (time: string) => solarDay(new Date(time), TAMPA_SKY);
    // Maghrib is 5:34 PM and the next Fajr 5:52 AM in Tampa.
    expect(at("2026-11-26T22:33:00Z").isNight).toBe(false);
    expect(at("2026-11-26T22:34:00Z").isNight).toBe(true);
    expect(at("2026-11-27T10:51:00Z").isNight).toBe(true);
    expect(at("2026-11-27T10:52:00Z").isNight).toBe(false);
  });

  it("keeps yesterday's night after midnight, with the start that just passed", () => {
    const data = solarDay(new Date("2026-11-27T07:00:00Z"), TAMPA_SKY);
    expect(data.night?.maghrib.toISOString().slice(0, 16)).toBe(
      "2026-11-26T22:34",
    );
    expect(data.night?.minutes).toBe(738);
    expect(data.night?.events.map(({ key }) => key)).toEqual([
      "maghrib",
      "isha",
      "midnight",
      "lastThird",
      "fajr",
      "sunrise",
    ]);
    expect(data.previousEvent?.key).toBe("isha");
    expect(data.nextPrayer?.label).toBe("Fajr");
  });

  it("ends each flip on the current point of the new arc", () => {
    const night = solarDay(new Date("2026-11-27T03:00:00Z"), TAMPA_SKY);
    expect(flipPoint(night, FLIP_MS)).toEqual(
      night.night?.point(night.instant),
    );
    const morning = solarDay(new Date("2026-11-27T11:00:00Z"), TAMPA_SKY);
    expect(flipPoint(morning, FLIP_MS)).toEqual(morning.sun);
  });

  it("glides from the start of the current arc to now", () => {
    const night = solarDay(new Date("2026-11-27T03:00:00Z"), TAMPA_SKY);
    expect(glidePoint(night, 0)).toEqual(
      night.night?.point(night.night.maghrib),
    );
    expect(glidePoint(night, 1)).toEqual(night.night?.point(night.instant));
    const afternoon = solarDay(new Date("2026-11-26T18:00:00Z"), TAMPA_SKY);
    expect(glidePoint(afternoon, 0)?.x).toBeCloseTo(afternoon.events[0].x);
    expect(glidePoint(afternoon, 1)).toEqual(afternoon.sun);
  });

  it("keeps the day chart where the night cannot be calculated", () => {
    const data = solarDay(new Date("2026-06-21T23:00:00Z"), {
      latitude: 78,
      longitude: 15,
      zone: "Arctic/Longyearbyen",
    });
    expect(data.night).toBeNull();
    expect(data.isNight).toBe(false);
  });
});
