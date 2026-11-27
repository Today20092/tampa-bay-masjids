import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";

// Every "now" and "today" is Tampa's, whatever the visitor's device timezone is.
export const TIME_ZONE = "America/New_York";

export interface Now {
  /** Tampa calendar date, YYYY-MM-DD */
  date: string;
  /** Minutes since Tampa midnight */
  minutes: number;
  friday: boolean;
}

const wallClock = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const utc = (date: string) => new Date(`${date}T00:00:00Z`);

export function makeNow(date: string, minutes: number): Now {
  return { date, minutes, friday: utc(date).getUTCDay() === 5 };
}

export function nowInTampa(instant: Date = new Date()): Now {
  const part = Object.fromEntries(
    wallClock.formatToParts(instant).map((p) => [p.type, p.value]),
  );
  return makeNow(
    `${part.year}-${part.month}-${part.day}`,
    Number(part.hour) * 60 + Number(part.minute),
  );
}

export function addDays(date: string, days: number): string {
  const d = utc(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const daysBetween = (from: string, to: string) =>
  Math.round((utc(to).getTime() - utc(from).getTime()) / 86_400_000);

/** "13:05" → 785 */
export function toMinutes(clock: string): number {
  const [h, m] = clock.split(":").map(Number);
  return h * 60 + m;
}

// shortcut: one Tampa point for every masjid; use per-masjid coordinates if the list spreads past the bay.
export const TAMPA_POINT = { latitude: 27.95, longitude: -82.46 };

/** Sunset (the Maghrib adhan) on a Tampa date, in minutes since midnight */
export function sunsetMinutes(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const day = new Date(y, m - 1, d);
  const method = CalculationMethod.NorthAmerica();
  const { latitude, longitude } = TAMPA_POINT;
  const coordinates = new Coordinates(latitude, longitude);
  return nowInTampa(new PrayerTimes(coordinates, day, method).maghrib).minutes;
}

// A masjid that says only "after sunset" gives no minutes.
// shortcut: it counts as upcoming for this long; replace if a masjid states its gap.
const AFTER_SUNSET_GRACE = 10;

/** Like toMinutes, for a Maghrib written as "sunset" or "sunset+7" on a given date */
export function minutesOn(time: string, date: string): number {
  if (!time.startsWith("sunset")) return toMinutes(time);
  const after = time.split("+")[1];
  return sunsetMinutes(date) + (after ? Number(after) : AFTER_SUNSET_GRACE);
}

/** "13:05" → "1:05", "sunset+7" → "Sunset +7" */
export function formatTime(clock: string): string {
  if (clock === "sunset") return "After sunset";
  if (clock.startsWith("sunset+")) return `Sunset +${clock.split("+")[1]}`;
  const [h, m] = clock.split(":");
  return `${Number(h) % 12 || 12}:${m}`;
}

const shortDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
});

/** "2026-11-04" → "Nov 4" */
export const formatDate = (date: string) => shortDate.format(utc(date));
