# Tampa Bay iqama and Jumu'ah times: research findings

All checks were made on **2026-11-26** (Thursday). Daylight saving time ended on 2026-11-01, which makes old schedules easy to spot.

Labels used below: **Saw** = read on the linked page or in the data that page loaded. **Inferred** = my conclusion. **Could not verify** = no primary evidence found. "Search result" = seen only as a search snippet.

## 0. Findings that change decisions

1. **An aggregator already covers much of this, but it is wrong often enough that it cannot be republished unchecked.** [Fajr Labs](https://www.fajrlabs.com/masjid-map?lat=28.02620&lng=-82.38053&z=12) has 18 Tampa Bay entries with times. Its "Islamic Center of Lakeland" shows the times of the [Islamic Center of Maine](https://www.islamiccenterofmaine.org/) ([its feed today](https://themasjidapp.org/1777/prayers)). Details in 1.3.
2. **Mosques publish conflicting times on their own channels.** Al Qassam, ISSB Sarasota and Omar Al-Mukhtar each show two or three different current-looking schedules (section 3).
3. **No official way exists to auto-post to a Facebook group** since [April 22, 2024](https://developers.facebook.com/docs/graph-api/changelog/version19.0/), and Meta says [automated access without permission breaks its Terms](https://developers.facebook.com/documentation/development/terms-and-policies/automated-data-collection). A human click on native scheduled posts is the safe route.
4. **WhatsApp has an official route for forwarding messages to an AI agent** ([Agents](https://faq.whatsapp.com/1050934623978152), limited countries). Browser automation or unofficial libraries on WhatsApp carry ban risk.
5. **"Grok Bot" is a real xAI product** with a cloud computer and browser, schedules, webhooks, email and phone share-sheet intake ([docs](https://docs.x.ai/grok-bot/overview)).
6. **Smallest useful first step may be no code:** ask Fajr Labs for a Tampa Bay page like its [Orlando table](https://www.fajrlabs.com/prayer-times/orlando), and report the errors below. I found no Tampa page ([404](https://www.fajrlabs.com/prayer-times/tampa)).

## 1. Fajr Labs

### 1.1 The site

**Saw.** The [sitemap](https://www.fajrlabs.com/sitemap.xml) lists 82 URLs: the [masjid map](https://www.fajrlabs.com/masjid-map), [near me](https://www.fajrlabs.com/masjid-near-me), [Jumu'ah near me](https://www.fajrlabs.com/jumuah-near-me), [prayer times](https://www.fajrlabs.com/prayer-times) plus city pages, [website widget](https://www.fajrlabs.com/masjid-map/embed), and side tools ([nur](https://www.fajrlabs.com/nur), [ayah](https://www.fajrlabs.com/ayah), [fast](https://www.fajrlabs.com/fast), [deeds](https://www.fajrlabs.com/deeds), [Ramadan](https://www.fajrlabs.com/ramadan), [calendar](https://www.fajrlabs.com/islamic-calendar), [verse of the day](https://www.fajrlabs.com/quran-verse-of-the-day), [quiz](https://www.fajrlabs.com/quran-challenge)). It claims [3,800+ masajid in the US and Canada](https://www.fajrlabs.com/masjid-near-me).

- **Data origin:** "Times come from the schedule your masjid already publishes, via its prayer-time system or website, and refresh every night" ([embed page](https://www.fajrlabs.com/masjid-map/embed)). Users can submit corrections, which are reviewed ([privacy](https://www.fajrlabs.com/privacy), updated 2026-11-09).
- **Sharing:** a free iframe widget per masjid with a credit line ([embed page](https://www.fajrlabs.com/masjid-map/embed)); a "Share today's times" button on [city pages](https://www.fajrlabs.com/prayer-times/orlando). I found no table-image export (checked only part of the scripts).
- **App:** [Masjid Map for iPhone](https://apps.apple.com/us/app/masjid-map-find-iqamah-times/id6817025115), seller S-Squared Technologies, released 2026-10-25, updated 2026-11-11 (Apple search API). [App privacy](https://www.fajrlabs.com/masjid-map/ios/privacy).

### 1.2 Endpoint and terms

- **Saw:** the map page loads data from a Supabase backend (`latkvrzkqepjncyqzysl.supabase.co`): table `mosques` and functions `map_mosque_detail`, `get_mosque_popup_meta`, `get_mosque_times_origin`. The access key ships in the public scripts. I read only the responses the page itself fetched; I did not call the backend directly.
- It is **not a documented public API.** I found no API documentation and no terms of service page (`/terms`, `/terms-of-service`, `/api`, `/developers` returned 404).
- [robots.txt](https://www.fajrlabs.com/robots.txt) allows pages and disallows `/api/`.
- **Inferred:** no licence to reuse or bulk-read the data is granted. Ask first (contact on the [privacy page](https://www.fajrlabs.com/privacy)). The widget is offered for [masjid websites](https://www.fajrlabs.com/masjid-map/embed).

### 1.3 Tampa Bay data and freshness

**Saw.** Box lat 26.95 to 28.65, lng -82.95 to -81.9 (includes Sarasota and Lakeland): **37 entries, 18 with times.** Your exact link showed "10 in view, 7 with iqamah" in a 1087x1354 window. Of the 18: 14 "automatic" (updated today), 1 mixed (Nov 16), 3 hand-entered (Nov 16, Nov 16, Oct 2). Links open the map card.

| Entry | F / D / A / M / I (iqama) | Jumu'ah | Fajr Labs says | Check against mosque channel |
|---|---|---|---|---|
| [ISTABA](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=ff8a3eec-f50b-4ea9-916c-8a8bce21c105) | 6:10 / 12:50 / 3:55 / 5:44 / 7:15 | 1:30 | auto 11-26 | **Matches** [feed](https://themasjidapp.org/7856/prayers) |
| [Al Qassam](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=5b5797a2-46e5-43e7-a95b-4956a032ab20) | 6:10 / 1:00 / 4:00 / 5:44 / 7:30 | 1:15, 2:30 | auto 11-26 | Matches [Masjidal](https://timing.athanplus.com/masjid/widgets/monthly?masjid_id=0aAegzKj&theme=2) except Maghrib ("Sunset" there, 5:34); differs from [MOHID](https://us.mohid.co/fl/florida/alqassam) |
| [New Tampa (ISONET)](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=2c61876a-0586-429f-bb16-af4da7520f63) | 6:15 / 1:00 / **4:30** / 5:39 / 8:00 | 1:15, 2:25 | auto 11-26 | **Asr wrong:** 4:15 since Nov 8 ([monthly image](https://www.newtampamasjid.org/prayer-schedule), [feed](https://themasjidapp.org/492/prayers)). Jumu'ah shown is iqama; khutbah is 12:50, 2:00 |
| [Sarasota (ISSB)](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=4a6064ec-c464-4ee1-8be5-bf2c62201f60) | 6:11 / 1:00 / 4:15 / 5:46 / 7:30 | 2:10 | auto 11-26 | Matches [Masjidal](https://timing.athanplus.com/masjid/widgets/monthly?theme=1&masjid_id=QL010DAZ) (Maghrib "Sunset" there); differs from [MOHID](https://us.mohid.co/fl/tampa/issb/masjid/widget/api/index/?m=prayertimings) |
| [Lakeland](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=dffc7399-9574-4844-8a6e-6a15af38d9af) | 6:00 / 12:00 / 2:15 / 4:07 / 7:30 | 12:30 | auto 11-26 | **Wrong mosque:** identical to [Maine](https://themasjidapp.org/1777/prayers); entry's website field is the Maine site. Lakeland's [own page](https://isogl.org/masjids/icol) says Jumu'ah 1:30 |
| [Isra](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=fee06b7b-95be-4f6e-be4a-6c094b6b568a) | 5:45 / 1:00 / 4:30 / 5:42 / 8:30 | 1:25 | auto 11-26 | **Contradicts** [site](https://isramasjid.org/): only Fajr and Isha daily, Jumu'ah 1:30, updates via WhatsApp |
| [Brandon](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=dbca8844-9f73-499f-a884-fc8e4743c69e) | 6:45 / 2:00 / 5:30 / 5:44 / 8:30 | 1:40 | auto 11-26 | Matches [site text](https://www.brandonmasjid.org/), but Asr 5:30 is 4 min before sunset. **Inferred stale** |
| [Deen Center](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=61811e98-2b9c-44af-bb63-b6325185324f) | 6:30 / 2:00 / 5:30 / 5:38 / 9:15 | 2:00 | auto 11-26 | **Inferred stale** (same reason); no times found on [site](https://www.thedeencenter.org/) |
| [New Port Richey](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=d21fe8b2-3378-4283-a4e7-5b2771623218) | 6:45 / 1:30 / 4:45 / 5:41 / 8:05 | 1:30 | auto 11-26 | **Jumu'ah conflicts:** [site](https://icnpr.org/salah-calendar/) says khutbah 1:40 |
| [Dunedin](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=d73441aa-f93d-4dc3-acb2-5e867494fbbe) | 6:13 / 12:33 / 3:31 / 5:45 / 6:59 | 2:00 | auto 11-26 | **Jumu'ah conflicts:** [site](https://www.dunedinmasjid.org/services/1/masjid-al-salaam-prayer-services) says khutbah 1:30 |
| [Wesley Chapel (ICWC)](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=8ea1a9ac-b7db-4380-aff4-bb0e1a02eaef) | 5:48 / 12:27 / 3:24 / 5:44 / 7:02 | 12:15 | auto 11-26 | Plausible: [site](https://icwc.us/prayer-times/) shows adhan+10, but dated 11/12 and says "will soon be updated" |
| [St. Petersburg](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=6b2cff16-7c51-47fa-a0fc-c8f17e935e29) | 6:12 / 1:45 / 4:00 / 5:45 / 6:58 | 1:30 | auto 11-26 | Could not verify; [homepage](https://isspmosque.com/) shows a summer schedule |
| [Al-Rahma, Thonotosassa](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=736cf4fe-2954-4371-96a5-15df51fde31b) | 6:10 / 1:00 / 4:00 / 5:43 / 7:30 | 2:30 | auto 11-26 | Could not verify (no website listed) |
| [Al Rahman, Tarpon Springs](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=ee3a29d5-a0c3-4262-9d6f-555f77071fe3) | 6:03 / 2:00 / 3:25 / 5:45 / 6:53 | 2:00 | auto 11-26 | Could not verify ([site](https://alrahmanmasjid.org/) returned 403 to my fetch) |
| [TMC](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=bf938127-ccc3-4c59-aa99-67d1abe4d428) | 6:15 / 1:00 / 4:00 / - / 7:30 | 12:35, 1:35, 3:25 | mixed, 11-16 | Could not verify ([site](https://tmcflorida.org/) home shows adhan only) |
| [Abu Bakr](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=3276354d-e413-4ed6-8911-e8bf4b072fe6) | 6:35 / 2:00 / 5:10 / - / 8:45 | 1:30 | by hand 10-02 | **Stale** (before DST ended) |
| [TMC@USF](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=5de72fd9-b763-4da7-b302-4a692cc55140) | Jumu'ah only | 1:25 | by hand 11-16 | Could not verify |
| [TMC Plant City](https://www.fajrlabs.com/masjid-map?lat=27.9&lng=-82.45&z=9&m=49b61673-5c7f-45d6-ada1-d29b5ef74b54) | Jumu'ah only | 1:45 | by hand 11-16 | Could not verify |

"Auto-updated" means the scrape ran, not that the time is right.

## 2. Apps and services

App dates come from Apple's [search API](https://itunes.apple.com/search?country=us&entity=software&term=MAWAQIT) (US store) on 2026-11-26.

| Service | Times | Who enters iqama | API / feed and reuse | Widgets, sharing | US / Tampa | Alive? |
|---|---|---|---|---|---|---|
| [Fajr Labs](https://www.fajrlabs.com/masjid-map) | Mosque iqama + calculated adhan | Nightly scrape + user corrections ([source](https://www.fajrlabs.com/masjid-map/embed)) | No documented API, no ToS page | Embed, share button | 18 Tampa Bay with times | New, active |
| [Mawaqit](https://github.com/mawaqit/mawaqit-py) | Adhan + iqama, Jumu'ah | Mosque-managed (Mawaqit product; site not read) | API **"not authorized outside of the official MAWAQIT applications"** ([JS](https://github.com/mawaqit/mawaqit-js), [Python](https://github.com/mawaqit/mawaqit-py)); [robots.txt](https://mawaqit.net/robots.txt) blocks Anthropic crawlers | Could not verify | Tampa: could not verify | [App](https://apps.apple.com/us/app/id1460522683) 2026-09-28 |
| [Masjidal / Athan+](https://mymasjidal.com/) | Adhan + iqama | Mosque admin ([help](https://help.masjidal.com/knowledge-base/iqamah/)) | Official [server key](https://help.masjidal.com/knowledge-base/prayer-times-api/) is per mosque, admin-only, one endpoint, excess calls blocked. [Store terms](https://mymasjidal.com/policies/terms-of-service) ban crawl/scrape of the "Service"; whether that covers widgets is unclear | [Widgets](https://help.masjidal.com/knowledge-base/widget/) (domain-locked keys); legacy public monthly pages; [WP plugin](https://wordpress.org/plugins/masjidal/) 2026-11-06 | Qassam, ISSB | [App](https://apps.apple.com/us/app/id1524990518) 2026-11-20 |
| [MOHID](https://us.mohid.co/fl/florida/alqassam) | Adhan + iqama, khutbah | Mosque (management system) | Public widget HTML; [robots](https://us.mohid.co/robots.txt) allows; API and reuse terms: could not verify | Website widget | Qassam, ICWC, ISSB; all three had stale or conflicting data | Pages live |
| [The Masjid App](https://themasjidapp.org/) | Adhan + iqama, Jumu'ah | Mosque admin; app also invites users to [submit](https://themasjidapp.org/en-us/the-deen-center) | No public API found. Public per-mosque HTML. [Terms](https://themasjidapp.org/terms) (June 2024): mosque owns its content; no scraping clause seen. [robots](https://themasjidapp.org/robots.txt) allows public pages | [Widgets](https://themasjidapp.org/about/widgets) (from $30), app | ISTABA and ISONET current; many Tampa listings "No Iqama data" | [App](https://apps.apple.com/us/app/id1492838521) 2026-11-03 |
| [Masjidbox](https://masjidbox.com/) | Adhan + iqama | Mosque | [Terms](https://masjidbox.com/terms) (2026-11-22): no reproducing or exploiting the service without written permission | [Widgets](https://masjidbox.com/widgets), screens | [Omar Al-Mukhtar](https://masjidbox.com/prayer-times/masjidomaralmokhtar) | [App](https://apps.apple.com/us/app/id6502348854) 2026-10-07 |
| [Masjidi](https://masjidiapp.com/) | Adhan + iqama rules | Mosque admin ([docs](https://api.masjidiapp.cc/)) | **Documented free API**; key requested over WhatsApp; public demo key. Licence/terms: could not find | PDF/PNG monthly calendar per mosque, widgets | 30 listings within 60 mi; of 10 with iqama history, none returned Fajr/Dhuhr/Asr/Isha iqama for today (demo key) | [App](https://apps.apple.com/us/app/id1493478907) 2026-11-13 |
| [ConnectMazjid](https://connectmazjid.com/) | Adhan + iqama | Mosque | Could not verify | Widgets, TV, app | Claims 800+ orgs; Tampa not checked | [App](https://apps.apple.com/us/app/id6446208222) 2026-11-12 |
| [Prayers Connect](https://apps.apple.com/us/app/id1387622671) | Iqama, partly predicted (search result) | Users [suggest](https://prayersconnect.com/) times | No public API or terms found. [robots.txt](https://app.prayersconnect.com/robots.txt) blocks ClaudeBot and anthropic-ai | App, web | 41 mosques within 50 mi (their claim) | Original app last updated 2024-11-14; second listing 2026-06-14 |
| [MasjidNow](https://www.masjidnow.com/) | Was mosque iqama | n/a | n/a | n/a | n/a | **Inferred defunct:** domain redirects to a blank `/lander`. A same-named [app](https://apps.apple.com/us/app/id6790945286) (other seller, 2026-09-01) has unknown relation |
| [IslamicFinder](https://www.islamicfinder.org/widgets/) | Calculated | n/a | [Terms](https://www.islamicfinder.org/terms-and-conditions/) (2020): personal, non-commercial; no copying/distribution without consent | Calculated widgets (used by [Brandon](https://www.brandonmasjid.org/), [ICNPR](https://icnpr.org/salah-calendar/)) | Any location | Active |
| [Muslim Pro](https://www.muslimpro.com/) | Calculated adhan (mosque iqama: could not verify) | n/a | Terms: could not retrieve | App | Any location | [App](https://apps.apple.com/us/app/id388389451) 2026-11-26 |
| [Pillars](https://thepillarsapp.com/prayer-times-widget) | Calculated on device | n/a | [Terms](https://thepillarsapp.com/terms) (Mar 2025): personal use, no automated access | Phone widgets | Any location | [App](https://apps.apple.com/us/app/id1559086853) 2026-11-24 |
| [AlAdhan](https://aladhan.com/prayer-times-api) | **Calculated only** | n/a | Free, no account, no warranty ([terms](https://aladhan.com/credits-and-terms), 2026-11-13); a [Tampa call](https://api.aladhan.com/v1/timings/26-11-2026?latitude=27.95&longitude=-82.45&method=2) worked | API | Any location | Active |

**Similarities:** every product computes adhan from location; those with iqama depend on someone at each mosque (or a scraper or users) keeping it current; most are single-mosque views.
**Differences:** who types the time (mosque, scraper, crowd), whether reuse is permitted, and whether khutbah and iqama are separate fields. **None gives a licensed, complete Tampa Bay feed** (inferred from the above).

## 3. Tampa Bay mosques: channels

"Agent-readable" = readable without an account. Facebook and Instagram pages were **not opened**: Meta [prohibits automated collection](https://developers.facebook.com/documentation/development/terms-and-policies/automated-data-collection), so their content and freshness are unverified. Invite links are recorded as published; **nothing was joined or opened.** "None found" means none on the pages I read.

| Mosque | Website method | Other public channels | Best source today (inferred) | Agent-readable |
|---|---|---|---|---|
| ISTABA | [Masjid App iframe](https://istaba.org/prayer/) → [HTML](https://themasjidapp.org/7856/prayers) "Updated today" | WhatsApp Community (invite link omitted) ([listed](https://istaba.org/contact/)), [Facebook](https://www.facebook.com/istabamasjid), [YouTube](https://www.youtube.com/@IslamicSocietyofTampaBayArea), mailing list, app | Masjid App feed | **Yes**, HTML |
| Al Qassam | [Masjidal widget](https://ictampa.org/prayer-times/) → [monthly HTML](https://timing.athanplus.com/masjid/widgets/monthly?masjid_id=0aAegzKj&theme=2): F 6:10 since Nov 18, J 1:15/2:30. [MOHID](https://us.mohid.co/fl/florida/alqassam): F 6:20, J 1:30/2:30 | No social or WhatsApp links found | Masjidal; **confirm with mosque** | **Yes**, two conflicting |
| New Tampa (ISONET) | [Masjid App + monthly JPEG](https://www.newtampamasjid.org/prayer-schedule) | [Facebook](https://www.facebook.com/share/1Ctz6YtWoL/), [Instagram](https://www.instagram.com/isonetofficial), [app](https://isonet.themasjidapp.org/download) | [Feed](https://themasjidapp.org/492/prayers) (agrees with image) | **Yes**, HTML |
| ISSB Sarasota | [Masjidal monthly](https://issb.net/monthly-prayer-times): D 1:00. Homepage [MOHID](https://us.mohid.co/fl/tampa/issb/masjid/widget/api/index/?m=prayertimings): D 2:00 | [Facebook](https://www.facebook.com/115596891803207), [youth Instagram](https://www.instagram.com/issb.youth.group/) | [Masjidal](https://timing.athanplus.com/masjid/widgets/monthly?theme=1&masjid_id=QL010DAZ) | **Yes**, two conflicting |
| Wesley Chapel (ICWC) | [MOHID, server HTML](https://icwc.us/prayer-times/), stale-flagged | [Facebook](https://www.facebook.com/wesleychapelmasjid), [Instagram](https://www.instagram.com/icwc.masjidibrahim/) | Unclear | Yes, check date |
| Brandon | [Static text](https://www.brandonmasjid.org/) + calculated widget | [Facebook](https://www.facebook.com/masjidbrandon), email signup | Unclear; site likely stale | Yes, unreliable |
| Dunedin | [Adhan + khutbah only](https://www.dunedinmasjid.org/) | [Facebook](https://www.facebook.com/dunedinmasjid), YouTube, newsletter | Ask mosque for iqama | Khutbah only |
| New Port Richey | [Calculated widget + khutbah 1:40](https://icnpr.org/salah-calendar/) | [Facebook](https://www.facebook.com/profile.php?id=100069454233585), [Instagram](https://www.instagram.com/icnpr/), YouTube | Unclear | Khutbah only |
| St. Petersburg | [Static summer times](https://isspmosque.com/) (Maghrib 8:25 PM) | [Facebook](https://www.facebook.com/isspmosque), [Instagram](https://www.instagram.com/masjid.alsunnah.st.pete), [YouTube](https://www.youtube.com/@masjid-alsunnah-st-pete), email field | Unclear | Stale |
| Isra, Gibsonton | [Jumu'ah only](https://isramasjid.org/) | **Broadcast-only WhatsApp group (invite link omitted)** ([page](https://www.isramasjid.org/contact)) | **WhatsApp** (the mosque says so) | **No** (must join) |
| Omar Al-Mukhtar | [Static summer times](https://www.masjidomaralmokhtar.org/) | [Masjidbox](https://masjidbox.com/prayer-times/masjidomaralmokhtar) (dated today; Jumu'ah typed "1:30 AM"), [Facebook](https://www.facebook.com/omaralmokhtarmasjid) | Masjidbox; confirm | Yes |
| Abu Bakr | [Domain shows Wix "not connected"](https://www.masjedabubakr.com/) (404 to plain fetch) | Facebook/YouTube/WhatsApp links reported by search result only; [Masjid App](https://themasjidapp.org/en-us/alqassam-masjid) lists no iqama | Could not verify | No |
| Gunn Highway (ICGH) | [No times found](https://tampamasjid.org/); [`/prayer-times`](https://tampamasjid.org/prayer-times) 404. A search snippet showed times dated Sep 28 | [Facebook](https://www.facebook.com/IslamicCenterofGunnHighway), [Instagram](https://www.instagram.com/icgh.tampa) | Could not verify | No |
| Deen Center | [Fundraising site, no times](https://www.thedeencenter.org/) | None found; [Masjid App](https://themasjidapp.org/en-us/the-deen-center) no iqama | Could not verify | No |
| Lakeland (ICOL) | [Jumu'ah 1:30 only](https://isogl.org/masjids/icol) | [Facebook](https://www.facebook.com/Islamic-Center-of-Lakeland-279405818771151/), [society page](https://www.facebook.com/isglfl/) + private group, mailing list | Probably Facebook | Jumu'ah only |
| TMC / USF | [JavaScript app, adhan](https://tmcflorida.org/) | None found | Could not verify | Adhan only |
| Al Rahman, Tarpon Springs | [403](https://alrahmanmasjid.org/); not bypassed | Not checked | Could not verify | No |

**Machine-readable and apparently current:** ISTABA, ISONET, Al Qassam (Masjidal), ISSB (Masjidal), and Omar Al-Mukhtar (Masjidbox, but note its [terms](https://masjidbox.com/terms)). That is about 5 of 17 sampled. Not sampled from the spreadsheet: Al Ansar, Al-Beshara, Al Khaliq, An Noor Wesley, Darussalam (ISONET calls itself [Daarus Salaam](https://www.newtampamasjid.org/prayer-schedule)), and others. [Masjid App listings](https://themasjidapp.org/en-us/iec-masjid-of-tampa) for Al-Ansar and [Al Khaliq](https://themasjidapp.org/en-us/the-deen-center) show no iqama.

**Existing aggregators:** Fajr Labs (section 1), [Prayers Connect Tampa](https://app.prayersconnect.com/united-states/tampa), [The Masjid App](https://themasjidapp.org/), [Masjidi](https://masjidiapp.com/). **I found no current version of the "Daily Iqama & Jum'uah Khutbah Timings (Tampa Bay)" image** by web search; Facebook and chats were not searched. False positive to avoid: [baytulmamur.org](https://baytulmamur.org/) appears in Tampa searches, but its 4:23 PM sunset shows it is not in Florida (inferred).

**Masjid Profile Studio** ([llms.txt](https://today20092.github.io/masjid-profile-designer/llms.txt), [app](https://today20092.github.io/masjid-profile-designer/)): an assistant builds a link with design JSON and the page downloads a 1080x1080 PNG; no account or server call; data stays after `#`. It handles **one masjid, at most 8 rows**. Reuse it for per-mosque images. It cannot produce the 38-mosque table.

## 4. Posting and reading messages

### 4.1 Facebook

- Meta deprecated the Groups API in Graph v19 and removed `publish_to_groups`, `groups_access_member_info` and the Groups API on **April 22, 2024**; group admins also lost the ability to install apps ([changelog](https://developers.facebook.com/docs/graph-api/changelog/version19.0/), [announcement](https://developers.facebook.com/blog/post/2024/01/23/introducing-facebook-graph-and-marketing-api-v19/)). I found no official replacement.
- Meta's developer policy (updated 2025-02-03) says Platform APIs are the only allowed programmatic means without written permission, and quotes Terms 3.2.3: *"You may not access or collect data from our Products using automated means (without our prior permission) … regardless of whether … logged-in to a Facebook account."* ([source](https://developers.facebook.com/documentation/development/terms-and-policies/automated-data-collection)). [facebook.com/robots.txt](https://www.facebook.com/robots.txt) says the same for collection. The current [Terms page](https://www.facebook.com/legal/terms) could not be read by my tool, so later changes are unverified.
- **My reading:** an agent driving a browser to read or post, even as a group admin, is automated access and is not permitted. Enforcement odds are unknown; the account at risk is the admin's.
- **Scheduled posts:** you report the group has it. A Meta help article mentions a group "Scheduled posts" section for Admin Assist welcome posts ([search result](https://www.facebook.com/help/android-app/2063362980550205)); I did not read an official page on scheduling ordinary group posts.
- **Pages API** is official: `pages_manage_posts`, publish or schedule 10 minutes to 30 days ahead ([docs](https://developers.facebook.com/docs/pages-api/posts/)). It posts to a **Page, not a group**. A Page could auto-publish the table and an admin could share it to the group by hand.

### 4.2 WhatsApp

| Route | Facts | Fit and risk |
|---|---|---|
| **Admin forwards to Grok Bot** by phone share sheet | Text, photos, PDFs (Android); photo, file, link, text (iPhone) ([mobile docs](https://docs.x.ai/grok-bot/mobile)) | **Lowest risk found.** WhatsApp is never automated. Needs a human who is in the chats |
| **Forward to a WhatsApp third-party Agent** | Official; limited countries; agent sees only its own chat ([about](https://faq.whatsapp.com/1050934623978152), [setup](https://faq.whatsapp.com/1022679690578731)). API `api.whatsapp.com/agent/v1`, receives text/image/document etc., **messages only its creator**, 12 sends/min, updates kept 30 days ([manual v1, 2026-08-25](https://www.whatsapp.com/developer/WhatsApp-Agent-Platform-Developer-Manual.pdf)). [Agent terms](https://www.whatsapp.com/legal/third-party-agents-terms); chats not end-to-end encrypted | Official. US availability and any native Grok Bot connection: could not verify (a small script would be needed, inferred). Cannot post to groups |
| **Follow public Channels** | One-way broadcast; browsable before following ([help](https://faq.whatsapp.com/549900560675125)) | Safe for a human, who then forwards. I found **no official Channel read/post API** and could not verify account-free reading of posts. I found no Tampa mosque Channel link |
| Agent drives WhatsApp Web | [Terms](https://www.whatsapp.com/legal/terms-of-service) bar auto-messaging, non-personal use without authorization, and unauthorized automated access; [Guidelines](https://www.whatsapp.com/legal/messaging-guidelines) (2026-09-23) cover scraping and harmful automation; [help](https://faq.whatsapp.com/5957850900902049): not intended for bulk or automated messaging | **High risk** (inferred): number could be banned |
| Unofficial libraries/apps | WhatsApp: violates Terms, temporary or permanent ban ([help](https://faq.whatsapp.com/1217634902127718)). [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js): bots/unofficial clients not allowed, blocking possible; [Baileys](https://github.com/WhiskeySockets/Baileys) is unaffiliated | **Do not use** |
| Cloud API [Groups API](https://developers.facebook.com/documentation/business-messaging/whatsapp/groups) | Official Business Account only, **max 8 participants**, invite-only, API-created groups (updated 2026-10-15) | Cannot reach a community group |

Meta also barred general-purpose AI assistants from the Business Platform from January 2026 ([TechCrunch](https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform), secondary).

### 4.3 Other delivery

- **Telegram:** official [Bot API](https://core.telegram.org/bots/api) (10.5, 2026-11-22) with `sendPhoto`; limits about 1 msg/s per chat, 20/min per group ([FAQ](https://core.telegram.org/bots/faq)). [Developer terms](https://telegram.org/tos/bot-developers) forbid spam and bulk scraping of public groups/channels. Fully automatable, but only useful if people move there.
- **A public web page with the current table**, linked from the group description or pinned post, needs no platform permission (inferred). Humans share it or the PNG.

## 5. Grok

| Meaning | What primary sources say |
|---|---|
| **Grok Bot** (most likely) | Launched beta [2026-08-11](https://x.ai/news/introducing-grok-bot), [1.0 on 2026-11-11](https://x.ai/news/grok-bot-1-0). Persistent cloud computer with browser, shell, files; signed-in sessions shared by all your bots ([docs](https://docs.x.ai/grok-bot/computer-and-apps)). Routines on schedule, email, webhook (bearer key), Slack and other events ([docs](https://docs.x.ai/grok-bot/skills-routines-and-automations)). Custom MCP by URL or command; own `@mail.grokbot.com` address ([docs](https://docs.x.ai/grok-bot/computer-and-apps)). Approval cards and "Ask first" rules ([docs](https://docs.x.ai/grok-bot/approvals-security-and-privacy)). Hands you the browser for CAPTCHAs etc. Included in Premium $30, Super $100, Ultra $200 per month ([pricing](https://x.ai/bot), [FAQ](https://docs.x.ai/grok-bot/faq), which lists other eligible legacy plans) |
| xAI API | [Function calling](https://docs.x.ai/developers/tools/function-calling), [remote MCP](https://docs.x.ai/developers/tools/remote-mcp) (HTTP/SSE; `require_approval` unsupported, so approval must live in your tool), [web search](https://docs.x.ai/developers/tools/web-search); tokens + tool fees ([overview](https://docs.x.ai/developers/tools/overview)). You supply the scheduler (inferred) |
| grok.com chat | [Custom MCP connector](https://docs.x.ai/grok/connectors), public URL required ([tunneling](https://docs.x.ai/grok/connectors/custom-mcp-tunneling)). Consumer scheduled tasks: could not verify |
| @bot on X | [Tagging](https://docs.x.ai/grok-bot/tag-on-x) sends a post and its photos to your Bot |
| Grok on Telegram | Partnership announced 2025 ([secondary](https://www.socialmediatoday.com/news/telegram-will-host-xai-grok-chatbot-in-chats/749193/)); current state could not verify |

Terms: you are responsible for the agent's actions, including legality ([xAI consumer terms](https://x.ai/legal/terms-of-service), 2026-10-27). Grok Bot requests run through Cursor's servers ([security](https://docs.x.ai/grok-bot/security)). Using Grok Bot does not grant permission under Meta's or WhatsApp's terms (inferred). A browser that holds your Facebook or WhatsApp login on a shared cloud computer widens the damage of a prompt injection; xAI documents the shared sessions ([docs](https://docs.x.ai/grok-bot/computer-and-apps)).

## 6. Recommendation

### Step 0 (no code)
Ask Fajr Labs for a Tampa Bay page and send the errors in 1.3. Ask mosques with conflicting channels which one is authoritative. If the page is accurate and sharing is allowed, stop here.

### Step 1: smallest build, only for what step 0 leaves missing (the combined image)

1. **Store:** the volunteers' sheet (or one Google Sheet), one row per mosque: times (allow `20/azan` offsets), khutbah and iqama separately, address, **source URL, last confirmed date, confirmed by**. Version history is the audit log.
2. **Source per mosque** (section 3):
   - Public feed/widget, ideally with the mosque's OK: ISTABA, ISONET (Masjid App); Qassam, ISSB (Masjidal, after confirming which widget is right). Ask admins who use Masjidal for a [server key](https://help.masjidal.com/knowledge-base/prayer-times-api/) if you want a sanctioned API.
   - Static websites: read, but treat as unverified.
   - WhatsApp/Facebook only: a human forwards or screenshots to the bot.
   - Fajr Labs: manual cross-check only until permission is given. AlAdhan: adhan for sanity checks.
3. **Agent path:** a Grok Bot routine (e.g. Thursday and daily at DST changes) reads allowed sources, **proposes a diff** with source links, and waits for approval before editing the sheet. Never let it overwrite a confirmed value silently.
4. **Checks on each proposal:** iqama not before adhan or at/after the next prayer; flag Asr within 15 min of Maghrib; flag offsets over 60 minutes; flag adhan differing more than 5 minutes from AlAdhan at the mosque's coordinates (catches Lakeland); flag rows unconfirmed for 14 days or since the last DST change. Thresholds are proposals; tune them.
5. **Image:** one HTML table rendered to PNG by the bot's browser, with "as of" date, a mark on stale rows, and "confirm with the masjid". Consider two images (north/south) so 38 rows stay legible on phones.
6. **Delivery:** the bot hands the PNG to the admin; the admin posts it with native scheduled posts and shares it to the chat. Optional: automate only a Telegram bot or a Facebook Page.

No server, database, scraper service or custom app is needed for this (inferred).

### Legal and terms risks

| Risk | Mitigation |
|---|---|
| Meta: automated Facebook reading/posting | Human posts; no logged-in Facebook in the bot |
| WhatsApp ban | Forwarding or the official Agent only |
| Reusing app data: Mawaqit forbids third-party API use; Masjidbox, Pillars, IslamicFinder restrict reuse; Fajr Labs grants none; Prayers Connect blocks AI crawlers | Source from the mosque; get written OK before reusing an aggregator |
| Masjidal terms' anti-scraping clause; mosque owns Masjid App content | Ask each mosque; low-frequency reads |
| Wrong time causes a missed prayer or Jumu'ah | Human approval, per-row date, disclaimer, correction contact |
| Republishing WhatsApp invite links or personal names/emails seen in widgets | Leave them out of the image |

I did not do a legal review (copyright in facts, contract enforceability).

## 7. Method, limits and disclosures

- Read-only. No sign-ups, logins, forms, joins or contact. I opened no Facebook group or Instagram page; the only facebook.com fetches were `robots.txt` and one unreadable attempt at the Terms page.
- Some pages (Fajr Labs map, several mosque sites, Masjidi docs, WhatsApp help) were loaded in the local browser through the `browse` tool, so sites' normal analytics will have logged visits. About 40 Fajr Labs map loads.
- Masjidi: about 20 requests with the [published demo key](https://api.masjidiapp.cc/). AlAdhan: one call.
- I fetched the Prayers Connect Tampa page, home page and two guessed terms URLs **before** seeing that its robots.txt disallows ClaudeBot/anthropic-ai; no further fetches after. I used none of its times.
- mawaqit.net: only `robots.txt` fetched.
- A single day was checked. Freshness over time, Ramadan handling and enforcement rates are unmeasured. The mosque sample is not all of the ~38 rows.
