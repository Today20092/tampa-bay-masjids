import { directionsUrl } from "@/lib/links";
import type { Masjid } from "@/lib/masjid-schema";
import {
  jumuahTimeKind,
  PRAYERS,
  type Schedule,
  type State,
} from "@/lib/schedule";
import { formatTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import { CHECK, COMING_SOON } from "./text";

/** A dash with a spoken explanation, for Friday's Dhuhr. */
export function Replaced() {
  return (
    <>
      <span aria-hidden="true">–</span>
      <span className="sr-only">Jumu‘ah instead</span>
    </>
  );
}

export function Check({
  masjid,
  children = CHECK,
}: {
  masjid?: Pick<Masjid, "comingSoon">;
  children?: React.ReactNode;
}) {
  if (masjid?.comingSoon)
    return (
      <span className="font-semibold text-muted-foreground">{COMING_SOON}</span>
    );
  return <span className="font-semibold text-attention">{children}</span>;
}

export function DailyGrid({
  daily,
  pinned = false,
}: {
  daily: Schedule["daily"];
  pinned?: boolean;
}) {
  return (
    <div className="@container">
      <dl
        className={cn(
          "grid grid-cols-[repeat(auto-fit,minmax(3.15rem,1fr))] gap-1 text-center tabular-nums",
          // A wider Maghrib tile keeps sunset wording on one line. Pinned text is too big for it.
          !pinned && "@min-[16rem]:grid-cols-[1fr_1fr_1fr_1.7fr_1fr]",
        )}
      >
        {daily.map(({ time, state }, k) => (
          <div
            key={PRAYERS[k]}
            className={cn(
              "rounded-md bg-muted py-1.5 text-xs",
              state === "next" &&
                "bg-primary font-bold text-primary-foreground",
              state === "past" && "text-past",
            )}
          >
            <dt>{PRAYERS[k]}</dt>
            <dd
              className={cn(
                pinned ? "text-base" : "text-sm",
                state !== "past" && "font-bold",
              )}
            >
              {time ? formatTime(time) : <Replaced />}
              {state === "next" && <span className="sr-only"> next</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function JumuahTimes({
  times,
  states,
  venue,
  timeIs,
}: NonNullable<Masjid["jumuah"]> & { states: State[] }) {
  return (
    <>
      <span className="inline-flex flex-wrap justify-center gap-1 text-center tabular-nums">
        {times.map((time, k) => (
          <span
            key={time}
            className={cn(
              "w-16 rounded-md bg-muted py-1.5",
              states[k] === "past" ? "font-normal text-past" : "font-bold",
              states[k] === "next" && "bg-primary text-primary-foreground",
            )}
          >
            {formatTime(time)}
            {states[k] === "next" && <span className="sr-only"> next</span>}
          </span>
        ))}
      </span>
      <span className="block pt-1 text-xs font-normal text-muted-foreground">
        {jumuahTimeKind(timeIs)}
      </span>
      {venue && (
        <a
          className="block py-2 text-sm font-normal text-primary underline"
          href={directionsUrl(venue)}
          target="_blank"
          rel="noopener"
        >
          <span className="block font-semibold">At {venue.name}</span>
          {venue.address}
        </a>
      )}
    </>
  );
}
