import { MapPin, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
} from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { needsDateMarker } from "@/lib/freshness";
import { formatDate, type Now } from "@/lib/time";
import { Directions, JumuahLine, PinButton } from "./MasjidDetail";
import type { Row } from "./MasjidTable";
import { Check } from "./Times";
import { nextLine, type View } from "./text";

// US Census Geocoder address matches, checked 2026-11-26. Address interpolation is approximate.
// Keeping the matched address here prevents a stale pin if the listing moves.
const locations: Record<string, [string, number, number]> = {
  "abu-bakr": [
    "11010 North 30th Street, Tampa, FL 33612",
    -82.426246,
    28.048283,
  ],
  "al-qassam": [
    "5910 East 130th Avenue, Tampa, FL 33617",
    -82.392112,
    28.064634,
  ],
  "an-noor": [
    "2250 Ashley Oaks Circle, Wesley Chapel, FL 33544",
    -82.361854,
    28.189128,
  ],
  daarusalam: [
    "15830 Morris Bridge Road, Thonotosassa, FL 33592",
    -82.279909,
    28.147347,
  ],
  istaba: ["7326 East Sligh Avenue, Tampa, FL 33610", -82.373779, 28.010811],
  omar: ["4801 East Busch Boulevard, Tampa, FL 33617", -82.408211, 28.032582],
  tmc: ["8080 N 56th St, Tampa, FL 33617", -82.393509, 28.022622],
  "usf-jumuah": [
    "Marshall Student Center Amphitheater, 4103 USF Cedar Cir, Tampa, FL 33620",
    -82.412408,
    28.065619,
  ],
  "wesley-chapel": [
    "19130 Livingston Avenue, Lutz, FL 33559",
    -82.430442,
    28.153921,
  ],
};

export type MapViewProps = {
  rows: Row[];
  view: View;
  now: Now | null;
  pins: string[];
  onPin: (id: string) => void;
};

/** When can I pray there, in the schedule being viewed. */
function MapTimes({
  row: { masjid, schedule },
  view,
  now,
}: {
  row: Row;
  view: View;
  now: Now | null;
}) {
  const friday = view === "jumuah" || masjid.jumuahOnly;
  const set = friday ? schedule.jumuah : schedule.iqama;
  if (!set)
    return (
      <p className="text-sm">
        <Check masjid={masjid} />
      </p>
    );
  return (
    <div>
      {friday ? (
        <JumuahLine masjid={masjid} schedule={schedule} />
      ) : (
        <p className="text-sm font-bold text-primary">{nextLine(schedule)}</p>
      )}
      {now && needsDateMarker(set.checked, now.date) && (
        <p className="text-xs text-attention">
          Checked {formatDate(set.checked)}
        </p>
      )}
    </div>
  );
}

export default function MapView({
  rows,
  view,
  now,
  pins,
  onPin,
}: MapViewProps) {
  const mapRef = useRef<MapLibreMap>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const located = rows
    .map((row) => row.masjid)
    .filter((m) => locations[m.id]?.[0] === m.address);
  const active = rows.find((row) => row.masjid.id === selected);
  function select(id: string) {
    setSelected(id);
    const [, lng, lat] = locations[id];
    mapRef.current?.easeTo({
      center: [lng, lat],
      // Keep the marker above the card that covers the bottom of the map.
      offset: [0, -90],
      duration: 0,
      zoom: Math.max(mapRef.current.getZoom(), 12),
    });
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Choose a marker or a masjid below. Use two fingers to move the map on a
        phone. Map locations are approximate; use directions for the
        destination.
      </p>
      <div className="relative h-80 overflow-clip rounded-lg border">
        <Map
          ref={mapRef}
          center={[-82.38, 28.1]}
          zoom={9.7}
          theme="light"
          styles={{ light: "https://tiles.openfreemap.org/styles/positron" }}
          cooperativeGestures
        >
          <MapControls position="top-right" className="[&_button]:size-11" />
          {located.map((masjid) => {
            const [, longitude, latitude] = locations[masjid.id];
            return (
              <MapMarker
                key={masjid.id}
                longitude={longitude}
                latitude={latitude}
              >
                <MarkerContent>
                  <button
                    type="button"
                    aria-label={`Show ${masjid.name} on map`}
                    aria-pressed={selected === masjid.id}
                    onClick={() => select(masjid.id)}
                    // Off-map markers are clipped, so keyboard focus moves the map to them.
                    onFocus={(event) => {
                      if (!event.currentTarget.matches(":focus-visible"))
                        return;
                      mapRef.current?.easeTo({
                        center: [longitude, latitude],
                        offset: [0, active ? -90 : 0],
                        duration: 0,
                      });
                    }}
                    className="flex size-11 items-center justify-center text-brand focus-visible:outline-3 focus-visible:outline-ring"
                  >
                    <MapPin
                      aria-hidden="true"
                      className={
                        selected === masjid.id
                          ? "size-8 fill-brand stroke-brand-foreground stroke-[2.5]"
                          : "size-8 fill-brand-foreground stroke-[2.5]"
                      }
                    />
                  </button>
                </MarkerContent>
              </MapMarker>
            );
          })}
        </Map>
        {active && (
          <div
            aria-live="polite"
            className="absolute inset-x-2 bottom-10 z-10 flex max-w-sm flex-col gap-1 rounded-lg border bg-card p-3 shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{active.masjid.name}</p>
                <p className="text-xs text-muted-foreground">
                  {active.masjid.area ?? active.masjid.address}
                </p>
              </div>
              <Button
                variant="ghost"
                size="touch"
                className="-mt-2 -mr-2 size-11 px-0"
                aria-label="Close masjid details"
                onClick={() => setSelected(null)}
              >
                <XIcon aria-hidden="true" />
              </Button>
            </div>
            <MapTimes row={active} view={view} now={now} />
            <div className="flex flex-wrap gap-1">
              <Directions masjid={active.masjid} prominent />
              <PinButton
                masjid={active.masjid}
                pinned={pins.includes(active.masjid.id)}
                onPin={() => onPin(active.masjid.id)}
                focusKey={`map-pin-${active.masjid.id}`}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="map-masjid" className="text-sm font-semibold">
          Choose a masjid
        </label>
        <select
          id="map-masjid"
          value={selected ?? ""}
          onChange={(event) => {
            if (event.target.value) select(event.target.value);
          }}
          className="min-h-11 w-full rounded-lg border border-input bg-card px-3 text-base sm:max-w-sm"
        >
          <option value="">Select a masjid</option>
          {located.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
