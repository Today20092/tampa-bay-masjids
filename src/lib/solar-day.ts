import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import { getPosition } from "suncalc";
import { addDays, TIME_ZONE } from "./time";

export const TAMPA_SKY = {
  latitude: 27.95,
  longitude: -82.46,
  zone: TIME_ZONE,
};
type SkyLocation = typeof TAMPA_SKY;

const labels = [
  ["fajr", "Fajr"],
  ["sunrise", "Sunrise"],
  ["dhuhr", "Dhuhr"],
  ["asr", "Asr"],
  ["maghrib", "Maghrib"],
  ["isha", "Isha"],
] as const;

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
  const times = new PrayerTimes(coordinates, day(date), method);
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
    x: 16 + ((time.getTime() - start) / (end - start)) * 448,
    y: 86 - position(time).altitude * 0.76,
  });
  const sun =
    events.length > 0 && instant.getTime() >= start && instant.getTime() <= end
      ? point(instant)
      : null;
  const next = events.find(
    ({ key, time }) => key !== "sunrise" && time > instant,
  );
  const tomorrow = new PrayerTimes(coordinates, day(addDays(date, 1)), method)
    .fajr;
  const nextPrayer =
    next ??
    (Number.isFinite(tomorrow.getTime())
      ? {
          key: "fajr" as const,
          label: "Fajr tomorrow",
          time: tomorrow,
        }
      : null);

  const samples = events.length
    ? Array.from(
        { length: 65 },
        (_, index) => new Date(start + (index / 64) * (end - start)),
      )
    : [];
  const path = [
    ...samples,
    ...(sun ? [instant] : []),
    ...events.map(({ time }) => time),
  ]
    .sort((a, b) => a.getTime() - b.getTime())
    .map(point)
    .map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  return {
    clock,
    date,
    instant,
    events: events.map((event) => ({ ...event, ...point(event.time) })),
    nextPrayer,
    previousEvent: events.findLast(({ time }) => time <= instant) ?? null,
    path,
    sun,
    ...position(instant),
    nextOnChart: next?.key ?? null,
  };
}
