import {
  ChevronDownIcon,
  Clock3Icon,
  LocateFixedIcon,
  MoonIcon,
  SunIcon,
  SunriseIcon,
  SunsetIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
        ? `${hoursLeft}h ${minutesLeft % 60}m left`
        : `${minutesLeft} min left`;

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
    <section
      aria-labelledby="solar-heading"
      className="sky-panel rounded-xl p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2
            id="solar-heading"
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <SunIcon aria-hidden="true" className="size-5 text-sky-sun" />
            Sun and prayer times
          </h2>
          <p className="text-xs text-sky-muted">
            {locationState === "local"
              ? "Your location · device time zone"
              : "Tampa, Florida"}
            {data && ` · ${formatDate(data.date)}`}
          </p>
        </div>
        <Button
          variant="ghost"
          size="touch"
          onClick={useLocation}
          disabled={locationState === "loading"}
          className="text-white hover:bg-white/10 hover:text-white"
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
      {data ? (
        <>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-sm font-semibold text-sky-muted">
              {next
                ? `${next.label} at ${data.clock.format(next.time)} (calculated)`
                : "Next prayer start unavailable"}
            </p>
            {countdown && (
              <p className="text-xl font-semibold text-sky-sun tabular-nums">
                {countdown}
              </p>
            )}
          </div>
          <svg
            viewBox="0 0 480 184"
            className="mt-1 max-h-72 w-full overflow-visible"
            aria-hidden="true"
          >
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
                    fill="#e89140"
                  />
                  <circle r="15" fill="#ffdf87" />
                  <circle r="11" fill="none" stroke="#ffbb5d" />
                </g>
              </g>
            )}
            {data.events.map(({ key, label, x, y }) => {
              const isNext = key === data.nextOnChart;
              const below =
                y < 143 && (key === "fajr" || key === "asr" || key === "isha");
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
          </svg>
          <details className="group border-t border-sky-muted/25">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md font-semibold [&::-webkit-details-marker]:hidden">
              <Clock3Icon aria-hidden="true" className="size-4 text-sky-sun" />
              All prayer starts
              <ChevronDownIcon
                aria-hidden="true"
                className="ml-auto size-4 group-open:rotate-180"
              />
            </summary>
            <dl className="divide-y divide-sky-muted/20 text-sm tabular-nums">
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
          </details>
        </>
      ) : (
        <p className="mt-3 text-sky-muted">
          Calculating today’s solar position…
        </p>
      )}
    </section>
  );
}
