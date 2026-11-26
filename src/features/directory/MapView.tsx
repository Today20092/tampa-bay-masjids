import { MapPin } from "lucide-react";
import { useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
} from "@/components/ui/map";
import { directionsUrl } from "@/lib/links";
import type { Masjid } from "@/lib/masjid-schema";

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

export default function MapView({ masjids }: { masjids: Masjid[] }) {
  const mapRef = useRef<MapLibreMap>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const located = masjids.filter((m) => locations[m.id]?.[0] === m.address);
  const active = located.find((m) => m.id === selected);
  function select(id: string) {
    setSelected(id);
    const [, lng, lat] = locations[id];
    mapRef.current?.jumpTo({
      center: [lng, lat],
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
      <div className="relative h-80 overflow-hidden rounded-lg border">
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
                    className="flex size-11 items-center justify-center text-primary focus-visible:outline-3 focus-visible:outline-ring"
                  >
                    <MapPin
                      aria-hidden="true"
                      className={
                        selected === masjid.id
                          ? "size-8 fill-primary stroke-card stroke-[2.5]"
                          : "size-8 fill-card stroke-[2.5]"
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
            className="absolute bottom-10 left-2 z-10 max-w-[calc(100%-1rem)] rounded-lg border bg-card p-3 shadow-md"
          >
            <p className="font-semibold">{active.name}</p>
            <p className="text-sm">{active.address}</p>
            <a
              className="inline-flex min-h-11 items-center font-semibold text-primary underline"
              href={directionsUrl(active)}
              target="_blank"
              rel="noreferrer"
            >
              Get directions to {active.name}
            </a>
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
