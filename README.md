# Midrasj NL

Nederlandse lees- en vertaalomgeving voor klassieke joodse midrasj-teksten. De site haalt Hebreeuws en Engels **op verzoek** op via de publieke [Sefaria API](https://www.sefaria.org) en vertaalt alleen het gevraagde gedeelte naar het Nederlands. Het corpus groeit lokaal, in de browser.

## Starten

Open de app niet als `file://`: browsers blokkeren dan de Sefaria API (CORS).

```bash
npm install
npm run dev
```

Daarna [http://localhost:8080](http://localhost:8080) openen.

De bron staat op GitHub: [JakobMarin/midrasj-nl](https://github.com/JakobMarin/midrasj-nl). Wil je er een Grok Bot van maken, plak dan het eerste bericht uit [bot/GROK_BOT.md](bot/GROK_BOT.md) in een nieuwe bot.


## Wat zit erin

- **Midrasj Rabba** — tien boeken, navigatie per hoofdstuk (inclusief petichtaot waar Sefaria die heeft)
- **Tanchuma (gedrukt)** — parasjot en simanim uit de index
- **Tanchuma Boeber** — idem, met extra nodes zoals *Appendix to Korach*
- Drie kolommen: Hebreeuws (RTL), Engels, Nederlands
- Startvertaling van Beresjiet Rabba 1:1–1:3 (nagekeken, CC-BY op de Engelse bron)
- Corpus in `localStorage` (`midrasj-nl-corpus-v1`); export als `midrasj-nl-corpus.json`
- Hash-routing, bijvoorbeeld `#Bereshit_Rabbah.1` of `#Midrash_Tanchuma,_Bereshit.1`

## Vertalen

De knop **Vertaal** zet de **Engelse** Sefaria-tekst naar het Nederlands (niet rauw het Hebreeuws). Voetnoten (`i.footnote`, `sup.footnote-marker`) worden eerst gestript.

- **Automatisch:** eerst `window.Translator` (Chrome/Edge), daarna een machinevertaling Engels→Nederlands; anders een verzoek om een sleutel
- **Eigen chat-API:** OpenAI-compatibel; basis-URL, model en sleutel staan alleen in `localStorage`
- **Vertaal ontbrekende alinea’s** doet alleen het huidige gedeelte, met ~350 ms pauze tussen verzoeken. Nooit een heel boek in één keer.

Conceptvertalingen zijn machinehulp. Ze zijn **niet** rabbinaal gecontroleerd en vragen om menselijke nalezing.

## Licenties

- Hebreeuws en Engels: [Sefaria](https://www.sefaria.org)
- Midrash Rabbah Engels: *The Sefaria Midrash Rabbah, 2022* — **CC-BY**
- Tanchuma gedrukt Engels: Samuel A. Berman, *Midrash Tanhuma-Yelammedenu* — **CC-BY**
- Tanchuma Boeber Engels: John T. Townsend, 1989 — **CC-BY**
- Tanchuma Boeber Hebreeuws: vaak Buber 1885, publiek domein

De Soncino-vertaling wordt **niet** hergebruikt (auteursrecht). Respecteer Sefaria: geen massale dumps, alleen ophalen wat je leest.

## Privacy

Geen accounts, geen tracking, geen eigen backend verplicht. API-sleutels verlaten deze browser niet.
