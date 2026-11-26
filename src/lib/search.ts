import type { Masjid } from "./masjid-schema";

const ARABIC: Record<string, string> = {
  ٱ: "ا",
  ى: "ي",
  ة: "ه",
  ء: "",
  ـ: "",
};

/** Ignores case, accents, hyphens, apostrophes, spaces, harakat and hamza forms. */
export function normalize(value: string): string {
  return (
    value
      .toLowerCase()
      // NFKD splits أ إ آ ؤ ئ into a base letter plus a mark, which the next line drops.
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .replace(/[ٱىةءـ]/g, (c) => ARABIC[c])
      .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x660))
      // Transliteration marks such as ʿ count as letters in Unicode.
      .replace(/[ʹ-ˁ]/g, "")
      .replace(/[^\p{L}\p{N}]/gu, "")
  );
}

const SHORT_FORMS: Record<string, string> = {
  n: "north",
  s: "south",
  e: "east",
  w: "west",
  st: "street",
  ave: "avenue",
  blvd: "boulevard",
  rd: "road",
  cir: "circle",
};

const spellOut = (address: string) =>
  address.replace(
    /\b[a-z]+\b/gi,
    (word) => SHORT_FORMS[word.toLowerCase()] ?? word,
  );

export function matches(masjid: Masjid, query: string): boolean {
  const whole = normalize(query);
  if (!whole) return true;
  const fields = [
    masjid.name,
    masjid.arabicName,
    ...masjid.aliases,
    masjid.area,
    masjid.address,
    spellOut(masjid.address),
  ]
    .filter((f): f is string => Boolean(f))
    .map(normalize);
  const found = (term: string) => fields.some((f) => f.includes(term));
  return (
    found(whole) ||
    query.split(/\s+/).map(normalize).filter(Boolean).every(found)
  );
}
