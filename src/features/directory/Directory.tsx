import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Masjid } from "@/lib/masjid-schema";
import { readPins, togglePin, writePins } from "@/lib/pins";
import { scheduleFor } from "@/lib/schedule";
import { matches, normalize } from "@/lib/search";
import { nowInTampa, type Now } from "@/lib/time";
import type { Demo } from "./demo/sample";
import { MasjidTable, shownSet, type Row } from "./MasjidTable";
import { PinnedCard } from "./PinnedCard";
import { checkedRange, type View } from "./text";

// Dev only: the production build drops this branch, so no sample times reach dist/.
const DemoControls = import.meta.env.DEV
  ? lazy(() => import("./demo/DemoControls"))
  : null;

/** Current Tampa time, updated while the page stays open; null during the static render. */
function useNow() {
  const [now, setNow] = useState<Now | null>(null);
  useEffect(() => {
    const tick = () => {
      const next = nowInTampa();
      setNow((last) =>
        last?.date === next.date && last.minutes === next.minutes ? last : next,
      );
    };
    tick();
    const timer = setInterval(tick, 5_000);
    // A phone waking from sleep should not wait for the next interval.
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);
  return now;
}

export default function Directory({ masjids }: { masjids: Masjid[] }) {
  const clock = useNow();
  const [demo, setDemo] = useState<Demo | null>(null);
  const [demoWanted, setDemoWanted] = useState(false);
  const [query, setQuery] = useState("");
  const [pins, setPins] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [chosenView, setChosenView] = useState<View | null>(null);
  const [status, setStatus] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const focusKey = useRef<string | null>(null);
  const announceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setPins(readPins(masjids.map((m) => m.id)));
    if (import.meta.env.DEV)
      setDemoWanted(new URLSearchParams(location.search).has("demo"));
  }, [masjids]);

  // Pinning moves a masjid between the cards and the table; focus follows it.
  useEffect(() => {
    if (!focusKey.current) return;
    document
      .querySelector<HTMLElement>(`[data-key="${focusKey.current}"]`)
      ?.focus();
    focusKey.current = null;
  });

  const now = demo?.now ?? clock;
  const view: View = chosenView ?? (now?.friday ? "jumuah" : "daily");
  const all: Row[] = (demo?.masjids ?? masjids).map((masjid) => ({
    masjid,
    schedule: scheduleFor(masjid, now),
  }));
  const searching = normalize(query) !== "";
  const pinned = searching
    ? []
    : pins.flatMap((id) => all.filter((row) => row.masjid.id === id));
  const rows = all.filter((row) =>
    searching ? matches(row.masjid, query) : !pins.includes(row.masjid.id),
  );
  const checked = checkedRange(
    rows.flatMap((row) => shownSet(row, view)?.checked ?? []),
  );

  function search(value: string) {
    setQuery(value);
    setOpenId(null);
    clearTimeout(announceTimer.current);
    // Wait for a pause in typing before speaking the result count.
    announceTimer.current = setTimeout(() => {
      const count = masjids.filter((m) => matches(m, value)).length;
      if (!normalize(value)) setStatus("");
      else if (!count) setStatus("No masjid matches your search");
      else setStatus(`${count} ${count === 1 ? "masjid" : "masjids"} found`);
    }, 500);
  }

  function pin(id: string) {
    const wasPinned = pins.includes(id);
    const next = togglePin(pins, id);
    setPins(next);
    writePins(next);
    clearTimeout(announceTimer.current);
    const name = masjids.find((m) => m.id === id)?.name;
    setStatus(`${wasPinned ? "Unpinned" : "Pinned"} ${name}`);
    if (wasPinned) {
      setOpenId(id);
      focusKey.current = `row-${id}`;
    } else {
      setQuery("");
      setOpenId(null);
      focusKey.current = `card-${id}`;
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      {DemoControls && demoWanted && (
        <Suspense>
          <DemoControls masjids={masjids} onChange={setDemo} />
        </Suspense>
      )}
      <Input
        ref={searchRef}
        type="search"
        value={query}
        onChange={(event) => search(event.target.value)}
        placeholder="Search masjid or area"
        aria-label="Search masjid or area"
        autoComplete="off"
        enterKeyHint="search"
        className="min-h-11 bg-card"
      />
      <p role="status" className="sr-only">
        {status}
      </p>

      {now &&
        pinned.map(({ masjid, schedule }) => (
          <PinnedCard
            key={masjid.id}
            masjid={masjid}
            schedule={schedule}
            now={now}
            onPin={() => pin(masjid.id)}
          />
        ))}

      {rows.length === 0 && !searching ? (
        <p className="text-xs text-muted-foreground">Every masjid is pinned.</p>
      ) : (
        <>
          <ToggleGroup
            aria-label="Which times"
            value={[view]}
            // Pressing the active choice again must not leave neither selected.
            onValueChange={([value]) => value && setChosenView(value as View)}
            variant="outline"
            size="touch"
            spacing={1.5}
            className="w-full"
          >
            {(
              [
                ["daily", "Daily"],
                ["jumuah", "Jumu‘ah"],
              ] as const
            ).map(([value, label]) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className="flex-1 rounded-full! bg-card font-semibold aria-pressed:bg-primary aria-pressed:text-primary-foreground"
              >
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {!pins.length && !searching && (
            <p className="text-xs text-muted-foreground">
              Open a masjid to pin it.
            </p>
          )}
          {rows.length ? (
            <MasjidTable
              rows={rows}
              view={view}
              now={now}
              openId={openId}
              pins={pins}
              onToggle={(id) => setOpenId(openId === id ? null : id)}
              onPin={pin}
            />
          ) : (
            <Empty className="p-4">
              <EmptyDescription className="text-foreground">
                No masjid matches your search.
              </EmptyDescription>
              <EmptyContent>
                <Button
                  variant="outline"
                  size="touch"
                  className="w-full border-input bg-card font-semibold"
                  onClick={() => {
                    search("");
                    searchRef.current?.focus();
                  }}
                >
                  Clear search
                </Button>
              </EmptyContent>
            </Empty>
          )}
          {checked && (
            <p className="text-xs text-muted-foreground">
              Times checked {checked}. Tap a masjid for its source.
            </p>
          )}
        </>
      )}
    </div>
  );
}
