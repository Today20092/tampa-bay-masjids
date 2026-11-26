# Analytics and Cloudflare settings

## Where to look

- **Visits:** Cloudflare dashboard, Web Analytics, property `ayoubabed.xyz`. Filter by hostname
  `masjids.ayoubabed.xyz`.
- **Search:** Google Search Console, Domain property `ayoubabed.xyz`.

## How collection works

Cloudflare injects the beacon automatically. This repository holds no tracking snippet or token, so
do not add one: pages would be counted twice.

A zone Configuration Rule, "Keep automatic Web Analytics off secondary hosts and private tools",
turns analytics off for every host except `ayoubabed.xyz` and `masjids.ayoubabed.xyz`. It also
excludes some paths, including `/404`, on both hosts. Preview links are not counted. The rule lives
in Cloudflare, not in this repository.

## Checked on 2026-11-26

- The live home page carried one beacon and `/llms.txt` carried none.
- In a headless browser without blockers, the beacon loaded and `POST /cdn-cgi/rum` returned 204.
- Minimum TLS version for the whole zone was raised from 1.0 to 1.2.

## Gaps

- Ad blockers and filtering DNS hide visits, including the owner's own.
- Taps on directions, WhatsApp and website links are not counted.
- Visits before 2026-11-26 were not collected.

## Rollback

- Analytics: in the Configuration Rule, replace the host condition
  `(not http.host in {"ayoubabed.xyz" "masjids.ayoubabed.xyz"})` with
  `(http.host ne "ayoubabed.xyz")`.
- TLS: SSL/TLS, Edge Certificates, Minimum TLS Version.
- Response headers: [`public/_headers`](../public/_headers). Browsers remember the HTTPS-only header
  for a year; to withdraw it, serve `max-age=0` rather than deleting the line.
