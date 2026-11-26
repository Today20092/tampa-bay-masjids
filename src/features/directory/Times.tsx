import type { Masjid } from "@/lib/masjid-schema";
import { PRAYERS, type Schedule, type State } from "@/lib/schedule";
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
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(3.15rem,1fr))] gap-1 text-center tabular-nums">
      {daily.map(({ time, state }, k) => (
        <div
          key={PRAYERS[k]}
          className={cn(
            "rounded-md bg-muted py-1.5 text-xs",
            state === "next" && "bg-primary font-bold text-primary-foreground",
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
  );
}

export function JumuahTimes({
  times,
  states,
}: {
  times: string[];
  states: State[];
}) {
  return (
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
  );
}
