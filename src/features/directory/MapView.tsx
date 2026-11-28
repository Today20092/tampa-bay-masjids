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
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkedMarker, shownFor, type View } from "@/lib/shown";
import type { Now } from "@/lib/time";
import { Directions, JumuahLine, PinButton } from "./MasjidDetail";
import type { Row } from "./MasjidTable";
import { MAP_HELP } from "@/lib/wording";
import { Check } from "./Times";

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
  const shown = shownFor(masjid, schedule, view);
  const marker = now
    ? checkedMarker(
        now.date,
        shown,
        shown.times === "jumuah"
          ? shown.checked
          : (shown.next?.checked ?? shown.checked),
      )
    : null;
  return (
    <div>
      {shown.times === "jumuah" ? (
        <JumuahLine masjid={masjid} schedule={schedule} />
      ) : (
        <>
          {shown.next && (
            <p className="text-sm font-bold text-primary">{shown.next.line}</p>
          )}
          {shown.times === "unconfirmed" && (
            <p className="text-sm">
              <Check masjid={masjid} />
            </p>
          )}
        </>
      )}
      {marker && <p className="text-xs text-attention">{marker}</p>}
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
  const located = rows.map((row) => row.masjid).filter((m) => m.location);
  const active = rows.find((row) => row.masjid.id === selected);
  function select(id: string) {
    setSelected(id);
    const { lng, lat } = located.find((m) => m.id === id)!.location!;
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
      <p className="text-sm text-muted-foreground">{MAP_HELP}</p>
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
            const { lng: longitude, lat: latitude } = masjid.location!;
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
          <Card
            aria-live="polite"
            className="absolute inset-x-2 bottom-10 z-10 max-w-sm gap-1 p-3"
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
              <Directions {...active} view={view} prominent />
              <PinButton
                masjid={active.masjid}
                pinned={pins.includes(active.masjid.id)}
                onPin={() => onPin(active.masjid.id)}
                focusKey={`map-pin-${active.masjid.id}`}
              />
            </div>
          </Card>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Select
          items={located.map((m) => ({ value: m.id, label: m.name }))}
          value={selected}
          onValueChange={(id) => id && select(id)}
        >
          <SelectLabel className="mb-0 text-sm font-semibold sm:text-sm">
            Choose a masjid
          </SelectLabel>
          <SelectTrigger className="min-h-11 min-w-0 bg-card text-base sm:max-w-sm sm:text-base dark:bg-card">
            <SelectValue placeholder="Select a masjid" />
          </SelectTrigger>
          <SelectPopup alignItemWithTrigger={false}>
            {located.map((m) => (
              <SelectItem
                key={m.id}
                value={m.id}
                className="min-h-11 text-base sm:min-h-11 sm:text-base"
              >
                {m.name}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>
    </div>
  );
}
