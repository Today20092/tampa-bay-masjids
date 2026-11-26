import type { Schedule } from "@/lib/schedule";
import { formatDate, formatTime } from "@/lib/time";

export const CHECK = "Check with the masjid";
export const COMING_SOON = "Prayers coming soon";

export type View = "daily" | "jumuah";

/** The one line under a pinned masjid's name; null when there is nothing to say. */
export function nextLine({ next }: Schedule): string | null {
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
