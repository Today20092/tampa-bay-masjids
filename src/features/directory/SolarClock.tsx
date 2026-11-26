import {
  ChevronDownIcon,
  LocateFixedIcon,
  MoonIcon,
  SunIcon,
  SunriseIcon,
  SunsetIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { solarDay, TAMPA_SKY } from "@/lib/solar-day";
import { formatDate } from "@/lib/time";

const eventIcons = {
  fajr: SunriseIcon,
  sunrise: SunriseIcon,
  dhuhr: SunIcon,
  asr: SunIcon,
  maghrib: SunsetIcon,
  isha: MoonIcon,
};

export function SolarClock() {
  const [instant, setInstant] = useState<Date | null>(null);
  const [place, setPlace] = useState(TAMPA_SKY);
  const [locationState, setLocationState] = useState<
    "idle" | "loading" | "error" | "local"
  >("idle");
  const data = useMemo(
    () => instant && solarDay(instant, place),
    [instant, place],
  );
  const next = data?.nextPrayer;
  const minutesLeft =
    next && instant
      ? Math.ceil((next.time.getTime() - instant.getTime()) / 60_000)
      : null;
  const hoursLeft = minutesLeft === null ? 0 : Math.floor(minutesLeft / 60);
  const countdown =
    minutesLeft === null
      ? null
      : hoursLeft > 0
        ? `${hoursLeft}h ${minutesLeft % 60}m`
        : `${minutesLeft} min`;
  // Naming the start that just passed keeps this line from reading as a rival to
  // a masjid's next iqama, which is still the earlier prayer until it is held.
  const previous = data?.previousEvent;
  const started =
    data &&
    previous &&
    `${previous.label} ${previous.key === "sunrise" ? "was" : "started"} ${data.clock.format(previous.time)} · `;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const now = new Date();
      setInstant(now);
      clearTimeout(timer);
      timer = setTimeout(tick, 60_000 - (now.getTime() % 60_000));
    };
    tick();
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  function useLocation() {
    if (locationState === "local") {
      setPlace(TAMPA_SKY);
      setLocationState("idle");
      return;
    }
    if (!navigator.geolocation) {
      setLocationState("error");
      return;
    }
    setLocationState("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPlace({
          latitude: coords.latitude,
          longitude: coords.longitude,
          zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        setLocationState("local");
      },
      () => setLocationState("error"),
      { timeout: 10_000, maximumAge: 60_000 },
    );
  }

  return (
    <Collapsible
      render={<section aria-labelledby="solar-heading" />}
      className="sky-panel rounded-xl p-1"
    >
      <h2 id="solar-heading" className="sr-only">
        Sun and prayer times
      </h2>
      <CollapsibleTrigger className="group/sun w-full cursor-pointer rounded-lg p-2 text-left hover:bg-sky-foreground/10">
        <span className="flex items-center gap-3">
          <SunIcon
            aria-hidden="true"
            className="size-5 shrink-0 text-sky-sun"
          />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-sky-sun tabular-nums">
              {!data
                ? "Calculating prayer starts…"
                : next
                  ? `${next.label} starts in ${countdown}`
                  : "Next prayer start unavailable"}
            </span>
            <span className="block text-xs text-sky-muted">
              {started}Calculated for{" "}
              {locationState === "local" ? "your location" : "Tampa"}
            </span>
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            className="size-4 shrink-0 group-aria-expanded/sun:rotate-180"
          />
        </span>
        <svg
          viewBox="0 -20 480 160"
          className="max-h-44 w-full overflow-visible"
          aria-hidden="true"
        >
          {data && (
            <>
              <path
                d="M16 86H464"
                stroke="currentColor"
                className="text-sky-muted"
                strokeDasharray="3 4"
                opacity=".55"
              />
              <polyline
                points={data.path}
                fill="none"
                stroke="currentColor"
                className="text-sky-sun"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {data.sun && (
                <g
                  key={`${data.date}/${place.latitude}/${place.longitude}`}
                  className="sky-marker text-sky-sun"
                  style={{
                    transform: `translate(${data.sun.x}px, ${data.sun.y}px)`,
                  }}
                >
                  <g transform="scale(.72)">
                    <path
                      d="M0-27 6-18 16-22 18-12 27-8 22 0 27 8 18 12 16 22 6 18 0 27-6 18-16 22-18 12-27 8-22 0-27-8-18-12-16-22-6-18Z"
                      className="fill-sun-ray"
                    />
                    <circle r="15" className="fill-sun-core" />
                    <circle r="11" fill="none" className="stroke-sun-ring" />
                  </g>
                </g>
              )}
              {data.events.map(({ key, label, x, y }) => {
                const isNext = key === data.nextOnChart;
                const below =
                  y < 143 &&
                  (key === "fajr" || key === "asr" || key === "isha");
                const labelY = y + (below ? 35 : -25);
                return (
                  <g
                    key={key}
                    className={isNext ? "text-sky-sun" : "text-sky-muted"}
                  >
                    <line
                      x1={x}
                      x2={x}
                      y1={y}
                      y2={labelY + (below ? -16 : 6)}
                      stroke="currentColor"
                      strokeWidth="1.2"
                      opacity={isNext ? 1 : 0.65}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={isNext ? 4 : 2.75}
                      fill="var(--sky)"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <text
                      x={Math.max(40, Math.min(440, x))}
                      y={labelY}
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="16"
                      fontWeight={isNext ? 700 : 500}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 border-t border-sky-muted/25 px-2 pt-2 pb-2 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-sky-muted">
            {locationState === "local"
              ? "Your location · device time zone"
              : "Tampa, Florida"}
            {data && ` · ${formatDate(data.date)}`}
          </p>
          <Button
            variant="ghost"
            size="touch"
            onClick={useLocation}
            disabled={locationState === "loading"}
            className="text-sky-foreground hover:bg-sky-foreground/10 hover:text-sky-foreground"
          >
            <LocateFixedIcon aria-hidden="true" />
            {locationState === "local"
              ? "Use Tampa"
              : locationState === "loading"
                ? "Locating…"
                : "Use my location"}
          </Button>
        </div>
        {locationState === "error" && (
          <p role="status" className="text-xs text-sky-muted">
            Location unavailable. Showing Tampa.
          </p>
        )}
        {data && (
          <>
            <dl className="divide-y divide-sky-muted/20 border-t border-sky-muted/25 text-sm tabular-nums">
              {data.events.map(({ key, label, time }) => {
                const Icon = eventIcons[key];
                return (
                  <div
                    key={key}
                    className="flex items-baseline justify-between gap-3 py-2"
                  >
                    <dt className="flex items-center gap-2">
                      <Icon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-sky-sun"
                      />
                      {key === "maghrib" ? "Maghrib · Sunset" : label}
                    </dt>
                    <dd className="font-semibold">{data.clock.format(time)}</dd>
                  </div>
                );
              })}
            </dl>
            <p className="pt-2 text-xs text-sky-muted">
              North America method, standard Asr. See the directory for masjid
              iqama times.
            </p>
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
