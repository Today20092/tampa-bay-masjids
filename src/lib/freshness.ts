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

/** Last date on which a time checked on `checked` may still be shown. */
export function validThrough(checked: string): string {
  let last = checked;
  while (isFresh(checked, addDays(last, 1))) last = addDays(last, 1);
  return last;
}
