import { MapIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AreaMap() {
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
          <iframe
            title="Tampa Bay area map"
            className="h-72 w-full rounded-lg border"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-82.65%2C27.87%2C-82.20%2C28.25&layer=mapnik"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    </div>
  );
}
