import { describe, expect, it } from "vitest";
import type { Masjid } from "./masjid-schema";
import { scheduleFor } from "./schedule";
import { checkedMarker, checkedRange, dateToMark, shownFor } from "./shown";
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
const iqama = {
  fajr: "06:10",
  dhuhr: "13:30",
  asr: "16:15",
  maghrib: "17:45",
  isha: "19:30",
  source,
  checked: "2026-11-24",
};
const jumuah = {
  times: ["13:15", "14:30"],
  source,
  checked: "2026-11-18",
};

// 2026-11-27 is a Friday; 2026-11-18 is fresh but older than a week.
const friday = (t: string) => makeNow("2026-11-27", toMinutes(t));
const thursday = (t: string) => makeNow("2026-11-26", toMinutes(t));

describe("shownFor", () => {
  it("shows an unconfirmed daily view with the confirmed Jumu‘ah as next", () => {
    const masjid = { ...base, jumuah };
    const shown = shownFor(
      masjid,
      scheduleFor(masjid, friday("12:00")),
      "daily",
    );
    expect(shown).toEqual({
      times: "unconfirmed",
      checked: undefined,
      next: { line: "Next: Jumu‘ah 1:15", checked: "2026-11-18" },
    });
  });

  it("shows Jumu‘ah in a Jumu‘ah-only masjid's daily view", () => {
    const masjid = { ...base, jumuahOnly: true, jumuah };
    const shown = shownFor(
      masjid,
      scheduleFor(masjid, thursday("10:00")),
      "daily",
    );
    expect(shown).toEqual({
      times: "jumuah",
      checked: "2026-11-18",
      next: null,
    });
  });

  it("has no next line in the Friday view", () => {
    const masjid = { ...base, iqama, jumuah };
    const shown = shownFor(
      masjid,
      scheduleFor(masjid, friday("12:00")),
      "jumuah",
    );
    expect(shown.times).toBe("jumuah");
    expect(shown.next).toBeNull();
  });

  it("shows the daily times and the next prayer's checked date", () => {
    const masjid = { ...base, iqama };
    const shown = shownFor(
      masjid,
      scheduleFor(masjid, thursday("14:10")),
      "daily",
    );
    expect(shown).toEqual({
      times: "daily",
      checked: "2026-11-24",
      next: { line: "Next: Asr 4:15", checked: "2026-11-24" },
    });
  });
});

describe("dated period marker", () => {
  const periodMasjid: Masjid = {
    ...base,
    iqama,
    iqamaPeriods: [
      {
        from: "2026-12-07",
        to: "2026-12-13",
        ...iqama,
        fajr: "06:20",
        checked: "2026-11-27",
      },
      {
        from: "2026-11-30",
        to: "2026-12-06",
        ...iqama,
        checked: "2026-11-27",
      },
    ],
  };

  it("names the period once its check is old enough to mark", () => {
    const shown = shownFor(
      periodMasjid,
      scheduleFor(periodMasjid, makeNow("2026-12-07", toMinutes("12:00"))),
      "daily",
    );
    expect(shown.period).toBe("Dec 7–13 schedule");
    expect(checkedMarker("2026-12-07", shown, shown.checked)).toBe(
      "Dec 7–13 schedule",
    );
    expect(checkedMarker("2026-11-30", shown, shown.checked)).toBeNull();
  });

  it("names a period that crosses a month", () => {
    const shown = shownFor(
      periodMasjid,
      scheduleFor(periodMasjid, makeNow("2026-12-01", toMinutes("12:00"))),
      "daily",
    );
    expect(shown.period).toBe("Nov 30–Dec 6 schedule");
  });
});

describe("dateToMark", () => {
  it("returns the oldest date that needs a marker", () => {
    expect(
      dateToMark("2026-11-27", "2026-11-22", "2026-11-18", undefined),
    ).toBe("2026-11-18");
  });

  it("returns null when every date is recent enough", () => {
    expect(dateToMark("2026-11-27", "2026-11-25", undefined)).toBeNull();
  });
});

describe("checkedRange", () => {
  it("formats one date, a range in one month, and a range across months", () => {
    expect(checkedRange(["2026-11-18"])).toBe("Nov 18");
    expect(checkedRange(["2026-11-18", "2026-11-03"])).toBe("Nov 3 to 18");
    expect(checkedRange(["2026-11-03", "2026-10-28"])).toBe("Oct 28 to Nov 3");
    expect(checkedRange([])).toBeNull();
  });
});
