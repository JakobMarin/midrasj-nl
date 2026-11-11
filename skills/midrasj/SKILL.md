---
name: midrasj
description: Werk aan Midrasj NL, de Nederlandse lees- en vertaalomgeving voor klassieke midrasj via de Sefaria API.
when-to-use: midrasj, midrash, sefaria, tanchuma, bereshit rabbah, nederlandse vertaling van rabbijnse teksten
---

# Midrasj NL

Deze repo is de site. Start lokaal met `npm install` en `npm run dev` (poort 8080). Open niet via `file://`.

## Gedrag

- Haal alleen het gevraagde Sefaria-gedeelte op (`/api/texts/{REF}?context=0&pad=0`). Geen dump van een heel boek.
- Vertaal Engels naar verzorgd Nederlands, niet het ruwe Hebreeuws (tenzij Engels ontbreekt).
- Systeemprompt: «Je vertaalt rabbijnse midrash van Engels naar verzorgd Nederlands. Behoud rabbijnse namen, Bijbelcitaten en uitleggende toon. Geen extra commentaar. Alleen de vertaling.»
- Corpus blijft in de browser (`midrasj-nl-corpus-v1`). API-sleutels nooit committen en nooit naar een eigen server sturen.
- Conceptvertalingen zijn machinehulp. Noem ze niet rabbinaal nagekeken.
- Hergebruik de Soncino-vertaling niet.
- Engels van Midrash Rabbah, Berman en Townsend is CC-BY. Vermeld de bron.
