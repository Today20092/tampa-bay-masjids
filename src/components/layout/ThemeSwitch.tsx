import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Choice = "auto" | "light" | "dark";

declare global {
  interface Window {
    // Defined by the inline script in SeoHead.astro.
    siteTheme: { read: () => Choice; set: (choice: Choice) => void };
  }
}

const CHOICES: [Choice, string][] = [
  ["auto", "Auto"],
  ["light", "Light"],
  ["dark", "Dark"],
];

export default function ThemeSwitch() {
  const [choice, setChoice] = useState(() => window.siteTheme.read());

  useEffect(() => {
    const sync = () => setChoice(window.siteTheme.read());
    addEventListener("storage", sync);
    addEventListener("pageshow", sync);
    return () => {
      removeEventListener("storage", sync);
      removeEventListener("pageshow", sync);
    };
  }, []);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <span id="theme-label" className="text-sm text-muted-foreground">
        Theme
      </span>
      <ToggleGroup
        aria-labelledby="theme-label"
        value={[choice]}
        // Pressing the active choice again must not leave none selected.
        onValueChange={([value]) => {
          if (!value) return;
          window.siteTheme.set(value as Choice);
          setChoice(value as Choice);
        }}
        size="touch"
        className="flex-wrap gap-1"
      >
        {CHOICES.map(([value, label]) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className="rounded-none! border-0 border-b-2 border-transparent font-semibold text-muted-foreground hover:bg-transparent data-pressed:border-primary data-pressed:bg-transparent data-pressed:text-primary forced-colors:border-b-0 forced-colors:data-pressed:border-b-4"
          >
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
