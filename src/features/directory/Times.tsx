import { PRAYERS, type Schedule, type State } from "@/lib/schedule";
import { formatTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import { CHECK } from "./text";

/** A dash with a spoken explanation, for Friday's Dhuhr. */
export function Replaced() {
  return (
    <>
      <span aria-hidden="true">–</span>
      <span className="sr-only">Jumu‘ah instead</span>
    </>
  );
}

export function Check({ children = CHECK }: { children?: React.ReactNode }) {
  return <span className="font-semibold text-attention">{children}</span>;
}

export function DailyGrid({
  daily,
  flat = false,
}: {
  daily: Schedule["daily"];
  flat?: boolean;
}) {
  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(3.15rem,1fr))] gap-1 text-center tabular-nums">
      {daily.map(({ time, state }, k) => (
        <div
          key={PRAYERS[k]}
          className={cn(
            "py-1.5 text-xs",
            flat ? "border-b-2 border-transparent" : "rounded-md bg-muted",
            state === "next" &&
              (flat
                ? "border-primary font-bold text-primary"
                : "bg-primary font-bold text-primary-foreground"),
            state === "past" && "text-past",
          )}
        >
          <dt>{PRAYERS[k]}</dt>
          <dd className={cn("text-sm", state !== "past" && "font-bold")}>
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
    <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 tabular-nums">
      {times.map((time, k) => (
        <span key={time} className="inline-flex items-center gap-1.5">
          {k > 0 && <span aria-hidden="true">·</span>}
          <span
            className={cn(
              states[k] === "past" ? "font-normal text-past" : "font-bold",
              states[k] === "next" &&
                "rounded-md bg-primary px-2 py-1 text-primary-foreground",
            )}
          >
            {formatTime(time)}
            {states[k] === "next" && <span className="sr-only"> next</span>}
          </span>
        </span>
      ))}
    </span>
  );
}
