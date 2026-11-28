import { MapIcon } from "lucide-react";
import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MAP_HELP } from "@/lib/wording";
import type { MapViewProps } from "./MapView";

const MapView = lazy(() => import("./MapView"));

/** Takes the loaded map's height: its help text, map and masjid picker. */
function MapLoading() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{MAP_HELP}</p>
      <div className="relative h-80 overflow-clip rounded-lg border">
        <Skeleton className="size-full motion-reduce:animate-none" />
        <p role="status" className="absolute inset-0 grid place-items-center">
          Loading map…
        </p>
      </div>
      <div className="h-17" />
    </div>
  );
}

class MapError extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p>Map unavailable. Use the directory above for directions.</p>
    ) : (
      this.props.children
    );
  }
}

export function AreaMap({
  children,
  showSearch,
  ...map
}: MapViewProps & { children: ReactNode; showSearch: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <div
        className={
          showSearch ? "flex flex-wrap items-start gap-2" : "flex gap-3"
        }
      >
        {children}
        <Button
          // Beside the search field it matches its height and keeps one width.
          className={showSearch ? "min-h-13 shrink-0" : "min-w-0 flex-1"}
          variant="outline"
          size="touch"
          aria-expanded={open}
          aria-controls="area-map"
          onClick={() => setOpen(!open)}
        >
          <MapIcon aria-hidden="true" />
          {showSearch ? "Map" : open ? "Hide map" : "Show map"}
        </Button>
      </div>
      <div id="area-map" hidden={!open}>
        {open && (
          <MapError>
            <Suspense fallback={<MapLoading />}>
              <MapView {...map} />
            </Suspense>
          </MapError>
        )}
      </div>
    </div>
  );
}
