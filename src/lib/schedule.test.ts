import { describe, expect, it } from "vitest";
import type { Masjid } from "./masjid-schema";
import { scheduleFor } from "./schedule";
import { makeNow, toMinutes } from "./time";

const source = { label: "Masjid website" };
const base: Masjid = {
  id: "sample",
  order: 1,
  name: "Sample",
  address: "1 Sample Road",
  aliases: [],
  jumuahOnly: false,
};
const withTimes = (checked: string, extra: Partial<Masjid> = {}): Masjid => ({
  ...base,
  iqama: {
    fajr: "06:10",
    dhuhr: "13:30",
    asr: "16:15",
    maghrib: "17:45",
    isha: "19:30",
    source,
    checked,
  },
  jumuah: { times: ["13:15", "14:30"], source, checked },
  ...extra,
});

// 2026-11-26 is a Thursday, 2026-11-27 a Friday.
const thursday = (t: string) => makeNow("2026-11-26", toMinutes(t));
const friday = (t: string) => makeNow("2026-11-27", toMinutes(t));
const masjid = withTimes("2026-11-24");

describe("next prayer", () => {
  it("picks the next one and mutes the passed ones", () => {
    const s = scheduleFor(masjid, thursday("14:10"));
    expect(s.next).toEqual({ kind: "prayer", prayer: "Asr", time: "16:15" });
    expect(s.daily.map((d) => d.state)).toEqual([
      "past",
      "past",
      "next",
      "",
      "",
    ]);
  });

  it("still counts a time in its own minute", () => {
    expect(scheduleFor(masjid, thursday("16:15")).next).toMatchObject({
      prayer: "Asr",
    });
    expect(scheduleFor(masjid, thursday("16:16")).next).toMatchObject({
      prayer: "Maghrib",
    });
  });

  it("starts at Fajr after midnight", () => {
    expect(scheduleFor(masjid, thursday("00:00")).next).toMatchObject({
      prayer: "Fajr",
    });
  });

  it("is tomorrow's Fajr after Isha", () => {
    const s = scheduleFor(masjid, thursday("21:30"));
    expect(s.next).toEqual({ kind: "tomorrow", prayer: "Fajr", time: "06:10" });
    expect(s.daily.map((d) => d.state)).toEqual([
      "next",
      "past",
      "past",
      "past",
      "past",
    ]);
  });

  it("does not promise tomorrow's Fajr once the time will have expired", () => {
    // Checked Saturday; the clocks change overnight.
    const s = scheduleFor(
      withTimes("2026-10-31"),
      makeNow("2026-10-31", toMinutes("21:00")),
    );
    expect(s.next).toEqual({ kind: "unconfirmed", what: "tomorrow" });
    expect(s.daily.every((d) => d.state === "past")).toBe(true);
  });

  it("shows nothing for stale times or before the browser knows the date", () => {
    for (const s of [
      scheduleFor(withTimes("2026-11-01"), thursday("14:10")),
      scheduleFor(masjid, null),
      scheduleFor(base, thursday("14:10")),
    ]) {
      expect(s.iqama).toBeUndefined();
      expect(s.jumuah).toBeUndefined();
      expect(s.daily).toEqual([]);
      expect(s.next).toEqual({ kind: "none" });
    }
  });

  it("expires daily and Jumu‘ah times separately", () => {
    const mixed = withTimes("2026-11-24", {
      jumuah: { times: ["13:15"], source, checked: "2026-11-01" },
    });
    const s = scheduleFor(mixed, thursday("14:10"));
    expect(s.iqama).toBeDefined();
    expect(s.jumuah).toBeUndefined();
  });
});

describe("Friday", () => {
  it("replaces Dhuhr with Jumu‘ah", () => {
    const s = scheduleFor(masjid, friday("11:00"));
    expect(s.next).toEqual({ kind: "jumuah", time: "13:15" });
    expect(s.daily[1]).toEqual({ time: null, state: "" });
    expect(s.daily.map((d) => d.state)).toEqual(["past", "", "", "", ""]);
    expect(s.jumuahStates).toEqual(["next", ""]);
  });

  it("moves to the second Jumu‘ah, then to Asr", () => {
    const second = scheduleFor(masjid, friday("13:20"));
    expect(second.next).toEqual({ kind: "jumuah", time: "14:30" });
    expect(second.jumuahStates).toEqual(["past", "next"]);
    const after = scheduleFor(masjid, friday("14:31"));
    expect(after.next).toMatchObject({ prayer: "Asr" });
    expect(after.daily.map((d) => d.state)).toEqual([
      "past",
      "past",
      "next",
      "",
      "",
    ]);
  });

  it("keeps Fajr first", () => {
    const s = scheduleFor(masjid, friday("05:00"));
    expect(s.next).toMatchObject({ prayer: "Fajr" });
    expect(s.jumuahStates).toEqual(["", ""]);
  });

  it("keeps Dhuhr where there is no Jumu‘ah", () => {
    const s = scheduleFor(
      withTimes("2026-11-24", { jumuah: undefined }),
      friday("11:00"),
    );
    expect(s.next).toMatchObject({ prayer: "Dhuhr" });
  });

  it("does not skip to Asr while the Jumu‘ah time is unconfirmed", () => {
    const stale = withTimes("2026-11-24", {
      jumuah: { times: ["13:15"], source, checked: "2026-11-01" },
    });
    const s = scheduleFor(stale, friday("11:00"));
    expect(s.next).toEqual({ kind: "unconfirmed", what: "Jumu‘ah" });
    expect(s.daily[1].time).toBeNull();
  });

  it("works for a Jumu‘ah-only masjid", () => {
    const campus: Masjid = {
      ...base,
      jumuahOnly: true,
      jumuah: { times: ["13:30"], source, checked: "2026-11-24" },
    };
    expect(scheduleFor(campus, friday("11:00")).next).toEqual({
      kind: "jumuah",
      time: "13:30",
    });
    expect(scheduleFor(campus, thursday("11:00")).next).toEqual({
      kind: "none",
    });
    expect(scheduleFor(campus, thursday("11:00")).jumuahStates).toEqual([""]);
  });
});
