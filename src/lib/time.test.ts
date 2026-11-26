import { describe, expect, it } from "vitest";
import { formatTime, minutesOn, nowInTampa, sunsetMinutes } from "./time";

describe("Tampa clock", () => {
  it("uses Tampa's date and weekday, not the device's", () => {
    expect(new Date().getTimezoneOffset()).not.toBe(300);
    // Friday 04:30 UTC is still Thursday night in Tampa.
    expect(nowInTampa(new Date("2026-11-27T04:30:00Z"))).toEqual({
      date: "2026-11-26",
      minutes: 23 * 60 + 30,
      friday: false,
    });
    expect(nowInTampa(new Date("2026-11-27T05:00:00Z"))).toEqual({
      date: "2026-11-27",
      minutes: 0,
      friday: true,
    });
  });

  it("follows the clock change", () => {
    // 2 AM on 2026-11-01 repeats 1 AM.
    expect(nowInTampa(new Date("2026-11-01T05:59:00Z")).minutes).toBe(119);
    expect(nowInTampa(new Date("2026-11-01T06:00:00Z")).minutes).toBe(60);
  });

  it("formats 24-hour clock text as 12-hour", () => {
    expect(["00:05", "12:30", "13:15"].map(formatTime)).toEqual([
      "12:05",
      "12:30",
      "1:15",
    ]);
  });
});

describe("sunset-based Maghrib", () => {
  it("finds Tampa's sunset on a winter and a summer date", () => {
    // About 5:35 PM EST and 8:30 PM EDT
    expect(Math.abs(sunsetMinutes("2026-11-26") - 1055)).toBeLessThanOrEqual(4);
    expect(Math.abs(sunsetMinutes("2026-06-21") - 1230)).toBeLessThanOrEqual(4);
  });

  it("adds the stated minutes and words both forms", () => {
    const sunset = sunsetMinutes("2026-11-26");
    expect(minutesOn("sunset+7", "2026-11-26")).toBe(sunset + 7);
    expect(minutesOn("sunset", "2026-11-26")).toBe(sunset + 10);
    expect(formatTime("sunset+7")).toBe("Sunset +7");
    expect(formatTime("sunset")).toBe("After sunset");
  });
});
