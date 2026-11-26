import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Masjid } from "@/lib/masjid-schema";
import { readPins, togglePin, writePins } from "@/lib/pins";
import { scheduleFor } from "@/lib/schedule";
import { matches, normalize } from "@/lib/search";
import { nowInTampa, type Now } from "@/lib/time";
import { MasjidTable, shownSet, type Row } from "./MasjidTable";
import { AreaMap } from "./AreaMap";
import { SolarClock } from "./SolarClock";
import { PinnedCard } from "./PinnedCard";
import { ShareButton } from "./ShareButton";
import { checkedRange, type View } from "./text";

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
  const now = useNow();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pins, setPins] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [chosenView, setChosenView] = useState<View | null>(null);
  const [status, setStatus] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const focusKey = useRef<string | null>(null);
  const announceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setPins(readPins(masjids.map((m) => m.id)));
  }, [masjids]);

  // Pinning moves a masjid between the cards and the table; focus follows it.
  useEffect(() => {
    if (!focusKey.current) return;
    const targets = document.querySelectorAll<HTMLElement>(
      `[data-key="${focusKey.current}"]`,
    );
    Array.from(targets)
      .find((target) => target.getClientRects().length)
      ?.focus();
    focusKey.current = null;
  });

  const view: View = chosenView ?? (now?.friday ? "jumuah" : "daily");
  const all: Row[] = masjids.map((masjid) => ({
    masjid,
    schedule: scheduleFor(masjid, now),
  }));
  const searching = normalize(query) !== "";
  const showSearch = pins.length === 0 || searchOpen;
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

  // Pinning on the map keeps the visitor there: no focus move, no search reset.
  function pin(id: string, fromMap = false) {
    const wasPinned = pins.includes(id);
    const next = togglePin(pins, id);
    setPins(next);
    writePins(next);
    clearTimeout(announceTimer.current);
    const name = masjids.find((m) => m.id === id)?.name;
    setStatus(`${wasPinned ? "Unpinned" : "Pinned"} ${name}`);
    setOpenId(null);
    if (fromMap) {
      // The first pin would otherwise hide a search that is still filtering.
      if (searching) setSearchOpen(true);
      return;
    }
    focusKey.current = `pin-${id}`;
    if (!wasPinned) {
      setQuery("");
      setSearchOpen(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
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
            className={`flex-1 rounded-none! border-b-2 border-transparent px-3 font-semibold text-muted-foreground hover:bg-transparent aria-pressed:bg-transparent ${value === "daily" ? "aria-pressed:border-primary aria-pressed:text-primary" : "aria-pressed:border-friday aria-pressed:text-friday"}`}
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
            {pinned.map(({ masjid, schedule }) => (
              <PinnedCard
                key={masjid.id}
                masjid={masjid}
                schedule={schedule}
                now={now}
                view={view}
                onPin={() => pin(masjid.id)}
              />
            ))}
          </div>
        </section>
      )}

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
                  search("");
                  setSearchOpen(false);
                  focusKey.current = "open-search";
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
              setSearchOpen(true);
              focusKey.current = "directory-search-input";
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
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-lg font-semibold tracking-tight">
              {view === "daily" ? "Daily iqama times" : "Jumu‘ah times"}
            </h2>
            {!pins.length && !searching && (
              <p className="text-xs text-muted-foreground">
                Open a masjid for its source and pin options.
              </p>
            )}
          </div>
          {rows.length ? (
            <MasjidTable
              rows={rows}
              view={view}
              now={now}
              openId={openId}
              pins={pins}
              onToggle={(id) => setOpenId(openId === id ? null : id)}
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
        </>
      )}
      <ShareButton />
      <SolarClock />
    </div>
  );
}
