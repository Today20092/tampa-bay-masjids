import { LocateFixedIcon, SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Masjid } from "@/lib/masjid-schema";
import { byDistance } from "@/lib/distance";
import { readPins, writePins } from "@/lib/pins";
import { scheduleFor } from "@/lib/schedule";
import { nowInTampa, type Now } from "@/lib/time";
import {
  closeSearch,
  FIRST_VISIT,
  linkedId,
  listing,
  openLinked,
  openSearch,
  pin as pinVisit,
  search as searchVisit,
  searchStatus,
  toggleOpen,
  type Visit,
} from "@/lib/visit";
import { MasjidTable, type Row } from "./MasjidTable";
import { AreaMap } from "./AreaMap";
import { SolarClock } from "./SolarClock";
import { PinnedCard } from "./PinnedCard";
import { ShareButton } from "./ShareButton";
import { checkedRange, shownFor, type View } from "@/lib/shown";
import { useNearest } from "./useNearest";

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

/** The list and the table both render a row; only one of them is on screen. */
function visibleTarget(key: string) {
  const targets = document.querySelectorAll<HTMLElement>(`[data-key="${key}"]`);
  return Array.from(targets).find((target) => target.getClientRects().length);
}

export default function Directory({ masjids }: { masjids: Masjid[] }) {
  const now = useNow();
  const [visit, setVisit] = useState<Visit>(FIRST_VISIT);
  const { query, searchOpen, openId, pins } = visit;
  const [chosenView, setChosenView] = useState<View | null>(null);
  const [status, setStatus] = useState("");
  const [linked, setLinked] = useState<string | null>(null);
  const nearest = useNearest();
  const searchRef = useRef<HTMLInputElement>(null);
  const focusKey = useRef<string | null>(null);
  const announceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const ids = masjids.map((m) => m.id);
    setVisit((v) => ({ ...v, pins: readPins(ids) }));
    const arrive = () => {
      const id = linkedId(window.location.hash, ids);
      if (!id) return;
      setVisit((v) => openLinked(v, id));
      setLinked(id);
    };
    arrive();
    window.addEventListener("hashchange", arrive);
    return () => window.removeEventListener("hashchange", arrive);
  }, [masjids]);

  // A linked masjid is scrolled to once the pins and the time have placed it.
  useEffect(() => {
    if (!linked || !now) return;
    const target = visibleTarget(`row-${linked}`);
    target?.focus({ preventScroll: true });
    target?.closest("li, tr, section")?.scrollIntoView();
    setLinked(null);
  }, [linked, now]);

  // Pinning moves a masjid between the cards and the table; focus follows it.
  useEffect(() => {
    if (!focusKey.current) return;
    visibleTarget(focusKey.current)?.focus();
    focusKey.current = null;
  });

  const view: View = chosenView ?? (now?.friday ? "jumuah" : "daily");
  // Pinned cards keep their pin order; everything else follows this one.
  const all: Row[] = byDistance(
    masjids.map((masjid) => ({ masjid, schedule: scheduleFor(masjid, now) })),
    nearest.here,
  );
  const { searching, showSearch, pinned, rows } = listing(visit, all);
  const checked = checkedRange(
    rows.flatMap(
      (row) => shownFor(row.masjid, row.schedule, view).checked ?? [],
    ),
  );

  function announce(value: string) {
    clearTimeout(announceTimer.current);
    // Wait for a pause in typing before speaking the result count.
    announceTimer.current = setTimeout(
      () => setStatus(searchStatus(masjids, value)),
      500,
    );
  }

  function search(value: string) {
    setVisit(searchVisit(visit, value));
    announce(value);
  }

  function pin(id: string, fromMap = false) {
    const masjid = masjids.find((m) => m.id === id);
    if (!masjid) return;
    const next = pinVisit(visit, masjid, fromMap);
    setVisit(next.visit);
    writePins(next.visit.pins);
    clearTimeout(announceTimer.current);
    setStatus(next.status);
    if (next.focus) focusKey.current = next.focus;
  }

  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup
        aria-label="Prayer schedule"
        value={[view]}
        // Pressing the active choice again must not leave neither selected.
        onValueChange={([value]) => value && setChosenView(value as View)}
        variant="default"
        size="touch"
        spacing={1}
        className="w-full gap-4 rounded-none! border-b sm:w-fit"
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
            className={`flex-1 rounded-none! border-b-2 border-transparent px-3 font-semibold text-muted-foreground hover:bg-transparent aria-pressed:bg-transparent forced-colors:border-b-0 forced-colors:aria-pressed:border-b-4 ${value === "daily" ? "aria-pressed:border-primary aria-pressed:text-primary" : "aria-pressed:border-friday aria-pressed:text-friday"}`}
          >
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {now && pinned.length > 0 && (
        <section aria-labelledby="pinned-heading" className="space-y-3">
          <h2 id="pinned-heading" className="text-base font-semibold">
            Pinned masjids
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {pinned.map(({ masjid, schedule, miles }) => (
              <PinnedCard
                key={masjid.id}
                masjid={masjid}
                schedule={schedule}
                miles={miles}
                now={now}
                view={view}
                onPin={() => pin(masjid.id)}
              />
            ))}
          </div>
        </section>
      )}

      <SolarClock />

      <AreaMap
        rows={all}
        view={view}
        now={now}
        pins={pins}
        onPin={(id) => pin(id, true)}
        showSearch={showSearch}
      >
        <div
          id="directory-search"
          hidden={!showSearch}
          className="w-full min-w-0"
        >
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4 text-muted-foreground"
              />
              <Input
                ref={searchRef}
                data-key="directory-search-input"
                type="search"
                value={query}
                onChange={(event) => search(event.target.value)}
                placeholder="Search masjid or area"
                aria-label="Search masjid or area"
                autoComplete="off"
                enterKeyHint="search"
                className="min-h-13 bg-card pl-11"
              />
            </div>
            {pins.length > 0 && searchOpen && (
              <Button
                variant="outline"
                size="touch"
                aria-label="Close search"
                className="min-h-13"
                onClick={() => {
                  const next = closeSearch(visit);
                  setVisit(next.visit);
                  focusKey.current = next.focus;
                  announce("");
                }}
              >
                <XIcon aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
        {!showSearch && (
          <Button
            variant="outline"
            size="touch"
            aria-expanded={false}
            aria-controls="directory-search"
            data-key="open-search"
            className="min-w-0 flex-1"
            onClick={() => {
              const next = openSearch(visit);
              setVisit(next.visit);
              focusKey.current = next.focus;
            }}
          >
            <SearchIcon aria-hidden="true" />
            Search
          </Button>
        )}
      </AreaMap>
      <p role="status" className="sr-only">
        {status}
      </p>

      {rows.length === 0 && !searching ? (
        <p className="text-xs text-muted-foreground">Every masjid is pinned.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <h2 className="text-lg font-semibold tracking-tight">
                {view === "daily" ? "Daily iqama times" : "Jumu‘ah times"}
              </h2>
              <Button
                variant="outline"
                size="touch"
                aria-pressed={nearest.on}
                className="bg-card font-semibold aria-pressed:border-primary aria-pressed:bg-muted aria-pressed:text-primary forced-colors:aria-pressed:border-4"
                onClick={nearest.toggle}
              >
                <LocateFixedIcon aria-hidden="true" />
                Nearest
              </Button>
            </div>
            <p
              role="status"
              className="text-xs text-muted-foreground not-empty:pt-2"
            >
              {nearest.message}
            </p>
          </div>
          {rows.length ? (
            <MasjidTable
              rows={rows}
              view={view}
              now={now}
              openId={openId}
              pins={pins}
              onToggle={(id) => setVisit(toggleOpen(visit, id))}
              onPin={(id) => pin(id)}
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
        </div>
      )}
      <div className="py-2">
        <ShareButton className="w-full sm:w-fit" />
      </div>
    </div>
  );
}
