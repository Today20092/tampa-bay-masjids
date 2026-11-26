import { MapIcon } from "lucide-react";
import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { Masjid } from "@/lib/masjid-schema";

const MapView = lazy(() => import("./MapView"));

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

export function AreaMap({ masjids }: { masjids: Masjid[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="touch"
        aria-expanded={open}
        aria-controls="area-map"
        onClick={() => setOpen(!open)}
      >
        <MapIcon aria-hidden="true" />
        {open ? "Hide area map" : "Show area map"}
      </Button>
      <div id="area-map" hidden={!open}>
        {open && (
          <MapError>
            <Suspense fallback={<p role="status">Loading map…</p>}>
              <MapView masjids={masjids} />
            </Suspense>
          </MapError>
        )}
      </div>
    </div>
  );
}
