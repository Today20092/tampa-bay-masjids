import { isFresh } from "./freshness";
import type { Masjid } from "./masjid-schema";
import { addDays, minutesOn, type Now } from "./time";

export const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
const FAJR = 0;
const DHUHR = 1;
const ASR = 2;

export type State = "next" | "past" | "";

type Next =
  | {
      kind: "prayer" | "tomorrow";
      prayer: (typeof PRAYERS)[number];
      time: string;
    }
  | { kind: "jumuah"; time: string }
  /** Something comes next but its time is not confirmed */
  | { kind: "unconfirmed"; what: "Jumu‘ah" | "tomorrow" }
  | { kind: "none" };

export interface Schedule {
  /** Confirmed, fresh sets only. Anything absent must read "Check with the masjid". */
  iqama?: Masjid["iqama"];
  jumuah?: Masjid["jumuah"];
  /** Set when today's iqama comes from a dated period. */
  iqamaSpan?: { from: string; to: string };
  /** Set when today's Jumu‘ah comes from a dated period. */
  jumuahSpan?: { from: string; to: string };
  /** Five cells when `iqama` is set. `time` is null where Jumu‘ah replaces Dhuhr. */
  daily: { time: string | null; state: State }[];
  jumuahStates: State[];
  next: Next;
}

type Span = { from: string; to: string };

const covers = (span: Span, date: string) =>
  span.from <= date && date <= span.to;

/** The period covering `date`, or the standing block while it is still fresh. */
function select<T extends { checked: string }>(
  periods: (T & Span)[] | undefined,
  fallback: T | undefined,
  date: string,
): { value: T; span?: Span } | undefined {
  const period = periods?.find((p) => covers(p, date));
  if (period)
    return { value: period, span: { from: period.from, to: period.to } };
  if (fallback && isFresh(fallback.checked, date)) return { value: fallback };
  return undefined;
}

/** What a masjid's Jumu‘ah times are, shown with them. */
export function jumuahTimeKind(
  timeIs: NonNullable<Masjid["jumuah"]>["timeIs"],
): string {
  switch (timeIs) {
    case "khutbah":
      return "Khutbah starts";
    case "start":
      return "Service starts";
    case "iqama":
      return "Iqama";
    case undefined:
      return "Khutbah or iqama not stated";
  }
}

/** `now` is null until the browser knows the date, so nothing can be shown as current. */
export function scheduleFor(masjid: Masjid, now: Now | null): Schedule {
  if (!now) return { daily: [], jumuahStates: [], next: { kind: "none" } };

  const tomorrow = addDays(now.date, 1);
  const dailyPick = select(masjid.iqamaPeriods, masjid.iqama, now.date);
  const jumuahPick = select(masjid.jumuahPeriods, masjid.jumuah, now.date);
  const iqama = dailyPick?.value;
  const jumuah = jumuahPick?.value;
  const upcoming = (time: string) => minutesOn(time, now.date) >= now.minutes;
  // Friday: a masjid that holds Jumu‘ah has no Dhuhr, even while its Jumu‘ah time is unconfirmed.
  const replacesDhuhr =
    now.friday && Boolean(masjid.jumuah || masjid.jumuahPeriods?.length);
  const beforeFajr = Boolean(iqama && upcoming(iqama.fajr));

  const nextJumuah =
    now.friday && jumuah && !beforeFajr ? jumuah.times.findIndex(upcoming) : -1;
  const awaitingUnknownJumuah = Boolean(
    replacesDhuhr && !jumuah && iqama && !beforeFajr && upcoming(iqama.asr),
  );
  const times = iqama ? KEYS.map((key) => iqama[key]) : [];
  const nextDaily = times.findIndex(
    (t, k) => !(replacesDhuhr && k === DHUHR) && upcoming(t),
  );

  let next: Next = { kind: "none" };
  let highlighted = -1;
  if (jumuah && nextJumuah >= 0) {
    next = { kind: "jumuah", time: jumuah.times[nextJumuah] };
  } else if (awaitingUnknownJumuah) {
    next = { kind: "unconfirmed", what: "Jumu‘ah" };
  } else if (iqama && nextDaily >= 0) {
    highlighted = nextDaily;
    next = {
      kind: "prayer",
      prayer: PRAYERS[nextDaily],
      time: times[nextDaily],
    };
  } else if (iqama) {
    // Tomorrow may be a later period, or past the freshness limit or a clock change.
    const nextPick = select(masjid.iqamaPeriods, masjid.iqama, tomorrow);
    if (nextPick) {
      if (nextPick.value.fajr === iqama.fajr) highlighted = FAJR;
      next = { kind: "tomorrow", prayer: "Fajr", time: nextPick.value.fajr };
    } else {
      next = { kind: "unconfirmed", what: "tomorrow" };
    }
  }

  const waitingForJumuah = next.kind === "jumuah" || awaitingUnknownJumuah;
  const daily = times.map((time, k) => {
    const replaced = replacesDhuhr && k === DHUHR;
    let state: State = "";
    if (k === highlighted) state = "next";
    else if (waitingForJumuah) state = k === FAJR ? "past" : "";
    else if (!upcoming(time) || (replaced && k < ASR)) state = "past";
    return { time: replaced ? null : time, state };
  });

  const jumuahStates = (jumuah?.times ?? []).map((t, k): State => {
    if (k === nextJumuah) return "next";
    return now.friday && !upcoming(t) ? "past" : "";
  });

  return {
    iqama,
    jumuah,
    iqamaSpan: dailyPick?.span,
    jumuahSpan: jumuahPick?.span,
    daily,
    jumuahStates,
    next,
  };
}
