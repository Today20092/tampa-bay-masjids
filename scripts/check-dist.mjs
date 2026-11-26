// Fails when any dev-only sample data reached the production build.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const read = (dir) =>
  readdirSync(dir, { recursive: true })
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isFile())
    .map((path) => ({ path, text: readFileSync(path, "utf8") }));

const markers = [
  "SAMPLE TIMES",
  "Sample source",
  "Pretend it is",
  "DemoControls",
  "sampleMasjids",
  "wa.me/0",
];

// A renamed marker would make this check pass for nothing, so each must still exist in the demo code.
const demo = read("src/features/directory/demo")
  .map((f) => f.path + f.text)
  .join("");
const gone = markers.filter((m) => !demo.includes(m));

const built = read("dist");
const leaks = built.flatMap((file) =>
  markers
    .filter((m) => file.path.includes(m) || file.text.includes(m))
    .map((m) => `${file.path}: ${m}`),
);

if (!built.length || gone.length || leaks.length) {
  console.error({
    filesScanned: built.length,
    markersMissingFromDemo: gone,
    leaks,
  });
  process.exit(1);
}
console.log(
  `No sample data in dist/: ${built.length} files, ${markers.length} markers.`,
);
