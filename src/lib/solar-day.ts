import {
  CalculationMethod,
  Coordinates,
  PrayerTimes,
  SunnahTimes,
} from "adhan";
import { getPosition } from "suncalc";
import { addDays, TAMPA_POINT, TIME_ZONE } from "./time";

export const TAMPA_SKY = { ...TAMPA_POINT, zone: TIME_ZONE };
type SkyLocation = typeof TAMPA_SKY;

const labels = [
  ["fajr", "Fajr"],
  ["sunrise", "Sunrise"],
  ["dhuhr", "Dhuhr"],
  ["asr", "Asr"],
  ["maghrib", "Maghrib"],
  ["isha", "Isha"],
] as const;

type Point = { x: number; y: number };

/** The chart's horizon line, in SVG units. */
export const HORIZON = 86;

const chartX = (time: Date, start: number, end: number) =>
  16 + ((time.getTime() - start) / (end - start)) * 448;

const sampleTimes = (from: number, to: number) =>
  Array.from(
    { length: 65 },
    (_, index) => new Date(from + (index / 64) * (to - from)),
  );

/** SVG points along a chart curve, passing exactly through each extra time. */
const curve = (
  point: (time: Date) => Point,
  from: number,
  to: number,
  extra: Date[] = [],
) =>
  [...sampleTimes(from, to), ...extra]
    .sort((a, b) => a.getTime() - b.getTime())
    .map(point)
    .map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

/** The night after one day's Maghrib: the sun's depth, mirrored above the horizon. */
function nightChart(
  evening: PrayerTimes,
  morning: PrayerTimes,
  altitude: (time: Date) => number,
) {
  const { middleOfTheNight, lastThirdOfTheNight } = new SunnahTimes(evening);
  const { maghrib, isha } = evening;
  const { fajr, sunrise } = morning;
  const events = [
    { key: "maghrib" as const, label: "Maghrib", time: maghrib },
    { key: "isha" as const, label: "Isha", time: isha },
    {
      key: "midnight" as const,
      label: "Islamic midnight",
      time: middleOfTheNight,
    },
    {
      key: "lastThird" as const,
      label: "Last third",
      time: lastThirdOfTheNight,
    },
    { key: "fajr" as const, label: "Fajr", time: fajr },
    { key: "sunrise" as const, label: "Sunrise", time: sunrise },
  ];
  // Far north or south some of these never happen; the day chart stays up then.
  if (
    events.some(({ time }) => !Number.isFinite(time.getTime())) ||
    !(maghrib < fajr && fajr < sunrise)
  )
    return null;
  const start = maghrib.getTime() - 25 * 60_000;
  const end = sunrise.getTime() + 25 * 60_000;
  const depth = Math.max(
    ...sampleTimes(start, end).map((time) => -altitude(time)),
  );
  if (!(depth > 0)) return null;
  // The deepest point always reaches the same height, so summer nights clear the text.
  const point = (time: Date) => ({
    x: chartX(time, start, end),
    y: HORIZON + altitude(time) * (78 / depth),
  });
  return {
    maghrib,
    fajr,
    point,
    minutes: Math.round((fajr.getTime() - maghrib.getTime()) / 60_000),
    events: events
      .sort((a, b) => a.time.getTime() - b.time.getTime())
      .map((event) => ({ ...event, ...point(event.time) })),
    path: curve(point, start, end, [maghrib, fajr]),
    past: curve(point, maghrib.getTime(), fajr.getTime()),
    lastThird: curve(point, lastThirdOfTheNight.getTime(), fajr.getTime()),
  };
}

export function solarDay(instant: Date, location: SkyLocation) {
  const { latitude, longitude, zone } = location;
  const dateFormat = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dateParts = Object.fromEntries(
    dateFormat.formatToParts(instant).map(({ type, value }) => [type, value]),
  );
  const date = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  const day = (value: string) => {
    const [year, month, dayOfMonth] = value.split("-").map(Number);
    return new Date(year, month - 1, dayOfMonth, 12);
  };
  const clock = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "numeric",
    minute: "2-digit",
  });
  const coordinates = new Coordinates(latitude, longitude);
  const method = CalculationMethod.NorthAmerica();
  const prayers = (value: string) =>
    new PrayerTimes(coordinates, day(value), method);
  const times = prayers(date);
  const events = labels.flatMap(([key, label]) => {
    const time = times[key];
    return Number.isFinite(time.getTime()) ? [{ key, label, time }] : [];
  });
  const first = events[0]?.time.getTime() ?? instant.getTime();
  const last = events.at(-1)?.time.getTime() ?? first;
  const padding = 75 * 60_000;
  const start = first - padding;
  const end = last + padding;
  const position = (time: Date) => getPosition(time, latitude, longitude);
  const point = (time: Date) => ({
    x: chartX(time, start, end),
    y: HORIZON - position(time).altitude * 0.76,
  });
  const sun =
    events.length > 0 && instant.getTime() >= start && instant.getTime() <= end
      ? point(instant)
      : null;
  const next = events.find(
    ({ key, time }) => key !== "sunrise" && time > instant,
  );
  const tomorrow = prayers(addDays(date, 1));
  const nextPrayer =
    next ??
    (Number.isFinite(tomorrow.fajr.getTime())
      ? {
          key: "fajr" as const,
          label: "Fajr tomorrow",
          time: tomorrow.fajr,
        }
      : null);

  const path = events.length
    ? curve(point, start, end, [
        ...(sun ? [instant] : []),
        ...events.map(({ time }) => time),
      ])
    : "";

  // Before Fajr the night began yesterday evening; otherwise it is the coming one.
  const beforeFajr = instant < times.fajr;
  const night = nightChart(
    beforeFajr ? prayers(addDays(date, -1)) : times,
    beforeFajr ? times : tomorrow,
    (time) => position(time).altitude,
  );
  const isNight =
    night !== null && instant >= night.maghrib && instant < night.fajr;
  // After midnight the start that just passed belongs to yesterday evening.
  const previousEvent =
    events.findLast(({ time }) => time <= instant) ??
    (isNight
      ? night.events.findLast(
          ({ key, time }) =>
            (key === "maghrib" || key === "isha") && time <= instant,
        )
      : undefined) ??
    null;

  return {
    clock,
    date,
    instant,
    events: events.map((event) => ({ ...event, ...point(event.time) })),
    nextPrayer,
    previousEvent,
    path,
    point,
    sun,
    ...position(instant),
    nextOnChart: next?.key ?? null,
    night,
    isNight,
  };
}

export const FLIP_MS = 2000;

const ease = (k: number) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2);

const between = (a: Point, b: Point, k: number) => ({
  x: a.x + (b.x - a.x) * ease(k),
  y: a.y + (b.y - a.y) * ease(k),
});

/** Where the marker is `ms` into a flip: to the horizon, across it, then along the new arc to now. */
export function flipPoint(
  { night, point, events, instant }: ReturnType<typeof solarDay>,
  toNight: boolean,
  ms: number,
): Point | null {
  const dayStart = events.find(
    ({ key }) => key === (toNight ? "maghrib" : "fajr"),
  )?.time;
  if (!night || !dayStart) return null;
  const from = toNight ? point(dayStart) : night.point(night.fajr);
  const startTime = toNight ? night.maghrib : dayStart;
  const arc = toNight ? night.point : point;
  const horizon = { x: from.x, y: HORIZON };
  if (ms < 450) return between(from, horizon, ms / 450);
  if (ms < 1000) return between(horizon, arc(startTime), (ms - 450) / 550);
  const ride = ease(Math.min(1, (ms - 1000) / (FLIP_MS - 1000)));
  return arc(
    new Date(
      startTime.getTime() + (instant.getTime() - startTime.getTime()) * ride,
    ),
  );
}
