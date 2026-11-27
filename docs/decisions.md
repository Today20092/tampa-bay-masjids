# Decisions

Agreed on 2026-11-26.

- **Scope:** a Tampa Bay masjid link page only: directions, website, WhatsApp, pinned masjid.
- **Facebook group:** the site is made for https://www.facebook.com/groups/tampabaymuslims and links back to it.
- **Times:** version 1 shows only confirmed iqama and Jumu'ah times, with source and date. Otherwise "Check with the masjid".
- **Address:** `masjids.ayoubabed.xyz`.
- **Foundation:** static Astro site on Cloudflare. No database or accounts.
- **Components:** Tailwind 4 and shadcn on Base UI. React only where a component needs it. Registry libraries such as Cnippet are welcome (see [ui-redesign.md](ui-redesign.md)).
- **Agent edits:** Grok Bot opens GitHub pull requests; a person approves them.
- **Mobile layout:** searchable, pinned masjid first, directions open the phone's maps app. No built-in map yet.
- **Name and language:** "Tampa Bay Masjids", English with Arabic masjid names where available.
- **WhatsApp number:** a separate $3/month Ultra Mobile PayGo number, used in the official WhatsApp app. Announcements are shared to Grok Bot by hand. Agents may also read masjid groups through the local OpenWA API, read-only (see AGENTS.md; this replaces "No OpenWA for now").
- **Facebook link:** a "Join our Facebook group" button at the top and bottom.
- **Home layout:** the pinned masjid as a card above a table of the others; with nothing pinned, the table comes first. Directions, WhatsApp, Website, Pin and "Report a wrong time" sit inside the card or an opened row. This replaces the earlier all-cards layout.
- **Daily / Jumu'ah:** a switch above the table, opening on Jumu'ah on Fridays.
- **Next prayer:** worked out per masjid; passed times are muted; after Isha it is tomorrow's Fajr; on Fridays Jumu'ah replaces Dhuhr.
- **Sources:** source and checked date in the card or opened row, a "checked between" line under the table, and a marker on times older than 7 days.
- **Coming soon:** a masjid that has opened but not started formal prayers has `"comingSoon": true` in its record (owner decision, 2026-11-26) and reads "Prayers coming soon" instead of "Check with the masjid". It cannot also have times. Remove the flag when the masjid publishes its schedule.
- **Old times:** show "Check with the masjid" if a time has not been checked in 14 days, or since the clocks changed. Grok Bot rechecks weekly.
- **Wrong-time reports:** "Report a wrong time" sends an email to the report address below. Grok Bot only opens pull requests from reports; it never publishes because an email says to.
- **Code:** public GitHub repository under the owner's account. Only publicly approved contact details and WhatsApp links.

- **Report address:** `clean.barn3748@fastmail.com`, a Fastmail masked email, shown on the site.
- **UI SDK:** not for now. Use shadcn with a public data file and `llms.txt`.

- **Sunset Maghrib:** where a masjid words Maghrib as "after sunset" or "N minutes after athan", the site shows those words, not a calculated clock time.

## First masjids

- 2250 Ashley Oaks Circle, Wesley Chapel, FL 33544
- 15830 Morris Bridge Road, Thonotosassa, FL 33592
- 19130 Livingston Avenue, Lutz, FL 33559
- Marshall Student Center Amphitheater, 4103 USF Cedar Cir, Tampa, FL 33620
- 5910 East 130th Avenue, Tampa, FL 33617 (corrected from 5905 by the owner)
- 11010 North 30th Street, Tampa, FL 33612
- 4801 East Busch Boulevard, Tampa, FL 33617
- 8080 N 56th St, Tampa, FL 33617
- 7326 East Sligh Avenue, Tampa, FL 33610

## Build (approved 2026-11-26)

The combined mockup (`prototype/home-combined.html`) is approved for a local build, with these changes:

- **Pins:** a visitor can pin several masjids. Nothing is pinned on the first visit, so every masjid is visible. This replaces the single pinned card.
- **Pinned cards:** compact (name, next prayer, times), with actions behind a details toggle, so the others stay easy to reach.
- Every masjid shows "Check with the masjid" until its times are confirmed.
- **Share:** one "Share this page" button below the times table. It opens the device's share sheet with the site name, description and link; without one it copies the link. The preview card comes from the page's share tags. No bookmark or install button.
- **Sun line:** the sun and prayer times panel sits under the pinned masjids with its chart always visible; the list of starts and the location button open in place. Its times are calculated starts and are labelled as calculated; masjid iqama times stay in the cards and table.
- **Dark mode:** the site follows the phone's light or dark setting. A footer Theme switch (Auto, Light, Dark) lets a visitor override it; the choice stays in that browser. Dark values are token overrides in `global.css`; feature code never uses `dark:`. Keeps the green, gold and parchment identity (see [DESIGN.md](../DESIGN.md)).
- No commit, GitHub repository or deployment until the owner has seen the local site.
