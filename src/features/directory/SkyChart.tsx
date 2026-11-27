import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";
import {
  FLIP_MS,
  flipPoint,
  GLIDE_MS,
  glidePoint,
  HORIZON,
  type solarDay,
} from "@/lib/solar-day";

type SolarData = ReturnType<typeof solarDay>;

// x, y and radius of each star.
const stars = [
  [24, 2, 1.4],
  [92, 18, 1],
  [128, -8, 1.7],
  [170, 6, 1],
  [204, -14, 1.2],
  [262, -10, 1],
  [348, -6, 1.6],
  [378, 14, 1],
  [412, -12, 1.2],
  [452, 20, 1.5],
  [462, 50, 1],
  [18, 46, 1],
  [104, 46, 0.9],
  [372, 64, 0.9],
];

type Motion = { kind: "glide" | "flip"; ms: number };

/**
 * The marker's animation: a glide to now when the page first knows the time, then a flip at each
 * day/night change. `changed` stays false until the first flip, so a fresh page never fades in.
 */
export function useSkyMotion(isNight: boolean | undefined) {
  const [motion, setMotion] = useState<Motion | null>(null);
  const [changed, setChanged] = useState(false);
  const wasNight = useRef<boolean>(undefined);

  useLayoutEffect(() => {
    if (isNight === undefined) return;
    const kind = wasNight.current === undefined ? "glide" : "flip";
    wasNight.current = isNight;
    if (kind === "flip") setChanged(true);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion(null);
      return;
    }
    const duration = kind === "flip" ? FLIP_MS : GLIDE_MS;
    let start: number | undefined;
    let frame = 0;
    const step = (now: number) => {
      start ??= now;
      const ms = now - start;
      setMotion(ms < duration ? { kind, ms } : null);
      if (ms < duration) frame = requestAnimationFrame(step);
    };
    setMotion({ kind, ms: 0 });
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isNight]);

  return { motion, changed };
}

function Marks({
  events,
  below,
  highlight,
}: {
  events: { key: string; label: string; x: number; y: number }[];
  below: string[];
  highlight: string | null | undefined;
}) {
  return events.map(({ key, label, x, y }) => {
    const isNext = key === highlight;
    const under = y < 143 && below.includes(key);
    const labelY = y + (under ? 35 : -25);
    return (
      <g key={key} className={isNext ? "text-sky-sun" : "text-sky-muted"}>
        <line
          x1={x}
          x2={x}
          y1={y}
          y2={labelY + (under ? -16 : 6)}
          stroke="currentColor"
          strokeWidth="1.2"
          opacity={isNext ? 1 : 0.65}
        />
        <circle
          cx={x}
          cy={y}
          r={isNext ? 4 : 2.75}
          className="sky-dot"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <text
          x={Math.max(40, Math.min(436, x))}
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
  });
}

/** The day's sun path and the night's, one folded into the horizon while the other shows. */
export function SkyChart({
  data,
  motion,
}: {
  data: SolarData | null;
  motion: Motion | null;
}) {
  const night = data?.night;
  const resting =
    data && (data.isNight && night ? night.point(data.instant) : data.sun);
  const moving =
    data &&
    motion &&
    (motion.kind === "flip"
      ? flipPoint(data, motion.ms)
      : glidePoint(data, motion.ms / GLIDE_MS));
  const marker = resting && (moving ?? resting);

  return (
    <svg
      viewBox="0 -20 480 160"
      className="max-h-44 w-full overflow-visible"
      aria-hidden="true"
    >
      {data && (
        <>
          <defs>
            <linearGradient id="sky-dusk" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" className="sky-dusk-stop" stopOpacity="0.8" />
              <stop offset="1" className="sky-dusk-stop" stopOpacity="0" />
            </linearGradient>
            <mask
              id="sky-crescent"
              maskUnits="userSpaceOnUse"
              x="-30"
              y="-30"
              width="60"
              height="60"
            >
              <rect
                x="-30"
                y="-30"
                width="60"
                height="60"
                className="sky-mask-show"
              />
              <circle r="13" className="sky-bite" />
            </mask>
            <clipPath id="sky-past">
              <rect
                x="-20"
                y="-40"
                height="200"
                width={data.isNight && marker ? Math.max(0, marker.x + 20) : 0}
              />
            </clipPath>
          </defs>
          <rect
            x="-20"
            y="30"
            width="520"
            height={HORIZON - 30}
            fill="url(#sky-dusk)"
            className="sky-glow"
          />
          {stars.map(([x, y, r], index) => (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={r}
              className="sky-star"
              style={
                {
                  "--star-opacity": 0.35 + (index % 4) * 0.18,
                  "--star-delay": `${((index * 7) % 14) * 0.06}s`,
                } as CSSProperties
              }
            />
          ))}
          <path
            d={`M16 ${HORIZON}H464`}
            stroke="currentColor"
            className="text-sky-muted"
            strokeDasharray="3 4"
            opacity=".55"
          />
          <g className="sky-curve sky-day">
            <polyline points={data.path} className="sky-line sky-day-line" />
          </g>
          {night && (
            <g className="sky-curve sky-night">
              <polyline points={night.path} className="sky-line sky-ahead" />
              <polyline
                points={night.lastThird}
                className="sky-line sky-third"
              />
              <polyline
                points={night.past}
                className="sky-line sky-past"
                clipPath="url(#sky-past)"
              />
            </g>
          )}
          <g className="sky-labels sky-day">
            <Marks
              events={data.events}
              below={["fajr", "asr", "isha"]}
              highlight={data.nextOnChart}
            />
          </g>
          {night && (
            <g className="sky-labels sky-night">
              <text
                x="236"
                y="64"
                textAnchor="middle"
                fontSize="23"
                fontWeight="700"
                className="fill-sky-foreground"
              >
                {Math.floor(night.minutes / 60)}h {night.minutes % 60}m
              </text>
              <text
                x="236"
                y="80"
                textAnchor="middle"
                fontSize="13"
                className="fill-sky-muted"
              >
                night, Maghrib to Fajr
              </text>
              <Marks
                events={night.events.filter(({ key }) => key !== "midnight")}
                below={["maghrib", "sunrise"]}
                highlight={data.isNight ? data.nextPrayer?.key : null}
              />
            </g>
          )}
          {marker && (
            <g
              className="sky-marker"
              style={{ transform: `translate(${marker.x}px, ${marker.y}px)` }}
            >
              <g transform="scale(.72)">
                <path
                  d="M0-27 6-18 16-22 18-12 27-8 22 0 27 8 18 12 16 22 6 18 0 27-6 18-16 22-18 12-27 8-22 0-27-8-18-12-16-22-6-18Z"
                  className="sky-ray"
                />
                <g mask="url(#sky-crescent)">
                  <circle r="15" className="sky-core" />
                  <circle r="11" fill="none" className="sky-ring" />
                </g>
              </g>
            </g>
          )}
        </>
      )}
    </svg>
  );
}
