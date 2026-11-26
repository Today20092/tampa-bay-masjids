import { SquarePlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/** Chromium's install dialog; not in TypeScript's DOM types. */
type InstallPrompt = Event & { prompt: () => Promise<unknown> };

let installPrompt: InstallPrompt | null = null;

// Listens as soon as the script loads: the browser may fire this before React mounts.
// Android only, so desktop browsers keep their own install control.
if (typeof window !== "undefined" && /Android/.test(navigator.userAgent))
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event as InstallPrompt;
  });

// A website cannot create a bookmark, so each browser gets its own written steps.
const STEPS = {
  inApp: [
    "Open the ••• menu and choose to open this page in Safari or Chrome.",
    "Save the page from there.",
  ],
  ios: [
    "Tap Share. It may be inside the ••• menu.",
    "Choose Add to Home Screen.",
    "Open the new icon, then pin your masjid there.",
  ],
  phone: ["Open your browser menu.", "Choose Add to Home screen."],
};

type Device = keyof typeof STEPS | "mac" | "computer";

/** Null when the page was opened from its saved icon. */
function detectDevice(): Device | null {
  const ua = navigator.userAgent;
  if (
    matchMedia("(display-mode: standalone), (display-mode: minimal-ui)")
      .matches ||
    ("standalone" in navigator && navigator.standalone)
  )
    return null;
  if (/FBAN|FBAV|FB_IAB|Instagram/.test(ua)) return "inApp";
  const mac = /Macintosh/.test(ua);
  // iPadOS says it is a Mac; only the touch screen gives it away.
  if (/iPhone|iPad|iPod/.test(ua) || (mac && navigator.maxTouchPoints > 1))
    return "ios";
  if (/Android|Mobi/.test(ua)) return "phone";
  return mac ? "mac" : "computer";
}

export function SaveToPhone() {
  // Unknown during the static render.
  const [device, setDevice] = useState<Device | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDevice(detectDevice());
    const installed = () => setDevice(null);
    window.addEventListener("appinstalled", installed);
    return () => window.removeEventListener("appinstalled", installed);
  }, []);

  if (!device) return null;

  if (device === "mac" || device === "computer")
    return (
      <p className="py-4 text-sm text-muted-foreground">
        Press <kbd>{device === "mac" ? "⌘D" : "Ctrl+D"}</kbd> to bookmark this
        page.
      </p>
    );

  function toggle(next: boolean) {
    const prompt = installPrompt;
    if (!next || !prompt) return setOpen(next);
    // The dialog works once; a later tap shows the written steps.
    installPrompt = null;
    void prompt.prompt().catch(() => setOpen(true));
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={toggle}
      className="flex flex-col items-start gap-2 py-4"
    >
      <p className="text-sm font-semibold">Keep these times one tap away</p>
      <CollapsibleTrigger
        render={
          <Button
            variant="outline"
            size="touch"
            className="w-full border-input bg-card font-semibold sm:w-fit"
          />
        }
      >
        <SquarePlusIcon aria-hidden="true" />
        Save to your phone
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {STEPS[device].map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </CollapsibleContent>
    </Collapsible>
  );
}
