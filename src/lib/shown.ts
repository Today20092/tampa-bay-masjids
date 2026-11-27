import { needsDateMarker } from "./freshness";
import type { Masjid } from "./masjid-schema";
import type { Schedule } from "./schedule";
import { formatDate, formatTime } from "./time";

export type View = "daily" | "jumuah";

export interface Shown {
  /** Which confirmed set is shown: daily iqama, Jumu‘ah, or neither (then "Check with the masjid"). */
  times: "daily" | "jumuah" | "unconfirmed";
  checked?: string;
  next: { line: string; checked?: string } | null;
}

/** The one line under a pinned masjid's name; null when there is nothing to say. */
function nextLine({ next }: Schedule): string | null {
  switch (next.kind) {
    case "prayer":
      return next.time.startsWith("sunset")
        ? `Next: ${next.prayer}, ${formatTime(next.time).toLowerCase()}`
        : `Next: ${next.prayer} ${formatTime(next.time)}`;
    case "tomorrow":
      return `Next: tomorrow, Fajr ${formatTime(next.time)}`;
    case "jumuah":
      return `Next: Jumu‘ah ${formatTime(next.time)}`;
    case "unconfirmed":
      return next.what === "tomorrow"
        ? "Tomorrow’s Fajr: check with the masjid"
        : "Next: Jumu‘ah, check with the masjid";
    case "none":
      return null;
  }
}

/** "Nov 24", "Nov 15 to 25" or "Oct 28 to Nov 3" */
export function checkedRange(dates: string[]): string | null {
  if (!dates.length) return null;
  const sorted = [...dates].sort();
  const first = formatDate(sorted[0]);
  const last = formatDate(sorted[sorted.length - 1]);
  if (first === last) return first;
  const [month, day] = last.split(" ");
  return `${first} to ${first.startsWith(month) ? day : last}`;
}

/** What a masjid shows in a view: Friday view, or a Jumu‘ah-only masjid, shows Jumu‘ah. */
export function shownFor(
  masjid: Masjid,
  schedule: Schedule,
  view: View,
): Shown {
  if (view === "jumuah" || masjid.jumuahOnly) {
    const { jumuah } = schedule;
    return {
      times: jumuah ? "jumuah" : "unconfirmed",
      checked: jumuah?.checked,
      next: null,
    };
  }
  const line = nextLine(schedule);
  return {
    times: schedule.iqama ? "daily" : "unconfirmed",
    checked: schedule.iqama?.checked,
    next: line
      ? {
          line,
          checked:
            schedule.next.kind === "jumuah"
              ? schedule.jumuah?.checked
              : schedule.iqama?.checked,
        }
      : null,
  };
}

/** The oldest of the given dates that needs a "Checked" marker, or null. */
export function dateToMark(
  today: string,
  ...dates: (string | undefined)[]
): string | null {
  const old = dates.filter(
    (date): date is string =>
      date !== undefined && needsDateMarker(date, today),
  );
  return old.sort()[0] ?? null;
}
