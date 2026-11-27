import { addDays, daysBetween, nowInTampa } from "./time";

export const STALE_AFTER_DAYS = 14;
export const MARK_AFTER_DAYS = 7;

// Tampa's wall clock at 17:00 UTC is noon or 1 PM, so it differs across a US clock change.
const tampaNoonOffset = (date: string) =>
  nowInTampa(new Date(`${date}T17:00:00Z`)).minutes;

/**
 * A time may be shown only if it was checked under 14 days ago and on the current side of the
 * last clock change. Two changes are months apart, so comparing the two ends is enough.
 */
export function isFresh(checked: string, today: string): boolean {
  const age = daysBetween(checked, today);
  return (
    age >= 0 &&
    age < STALE_AFTER_DAYS &&
    tampaNoonOffset(checked) === tampaNoonOffset(today)
  );
}

export const needsDateMarker = (checked: string, today: string) =>
  daysBetween(checked, today) > MARK_AFTER_DAYS;

/**
 * True when Tampa's wall clock changes somewhere in the inclusive span.
 * Changes are months apart, so a 30-day step cannot skip over two of them.
 */
export function spansClockChange(from: string, to: string): boolean {
  const start = tampaNoonOffset(from);
  let cursor = from;
  while (cursor < to) {
    const next = addDays(cursor, Math.min(30, daysBetween(cursor, to)));
    if (tampaNoonOffset(next) !== start) return true;
    cursor = next;
  }
  return false;
}

/** Last date on which a time checked on `checked` may still be shown. */
export function validThrough(checked: string): string {
  let last = checked;
  while (isFresh(checked, addDays(last, 1))) last = addDays(last, 1);
  return last;
}
