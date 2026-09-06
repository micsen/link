# Busstavle mot Oslo - Trygve Strømbergs vei

En avgangstavle i Home Assistant som viser sanntidsavganger for buss mot Oslo,
hentet fra [Enturs JourneyPlanner v3](https://developer.entur.org/) - samme
datakilde som Ruter-appen. Alt er innebygde integrasjoner: ingen HACS, ingen
custom cards.

| Fil | Hva det er |
|:--|:--|
| `packages/buss_mot_oslo.yaml` | REST-sensor mot Entur + filtrering og nedtelling |
| `dashboards/buss_mot_oslo.yaml` | Selve skjermen (avgangstavle, status, feilsøking) |

## 1. Finn stoppestedets ID

Entur identifiserer holdeplasser med en NSR-ID, f.eks. `NSR:StopPlace:58366`.
Søk opp «Trygve Strømbergs vei» på <https://stoppested.entur.org> og kopier
IDen, eller kjør:

```bash
curl -s -G 'https://api.entur.io/geocoder/v1/autocomplete' \
  -H 'ET-Client-Name: micsen-homeassistant' \
  --data-urlencode 'text=Trygve Strømbergs vei' \
  --data-urlencode 'lang=no' \
  --data-urlencode 'layers=venue' \
  | jq -r '.features[] | [.properties.id, .properties.label] | @tsv'
```

Er det flere treff med samme navn, velg det som ligger i riktig kommune.

## 2. Legg inn pakka

1. Kopier `packages/buss_mot_oslo.yaml` til `config/packages/` på HA-serveren.
2. Sørg for at pakker er slått på i `configuration.yaml`:

   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```

3. Bytt `NSR:StopPlace:XXXXX` i `payload:` med IDen fra steg 1.
4. Sjekk konfigurasjonen (Utviklerverktøy → YAML → «Sjekk konfigurasjon») og
   start Home Assistant på nytt.

## 3. Still inn retningen «mot Oslo»

Som standard tas en avgang med hvis destinasjonsteksten inneholder ett av
stikkordene `oslo`, `bussterminal`, `jernbanetorget`, `helsfyr` eller
`galgeberg`. Det treffer som regel bra, men den presise varianten er å låse
tavla til plattformen som går mot byen:

1. Gå til Utviklerverktøy → Tilstander → `sensor.entur_tsv_raw` og se på
   attributtet `estimatedCalls`. Hver avgang har `quay.id` og
   `destinationDisplay.frontText`.
2. Finn quay-IDen for retningen mot Oslo og skriv den inn i pakka:

   ```yaml
   {% set quays = ['NSR:Quay:12345'] %}
   ```

Er `quays` ikke tom, ignoreres stikkordene helt. Bare bussavganger tas med i
begge tilfeller; tog, trikk og T-bane filtreres bort.

## 4. Legg til skjermen

**Som eget dashbord:** Innstillinger → Dashbord → Legg til dashbord → «Ny
tavle fra bunnen av», åpne den, tre prikker → «Rediger i YAML», og lim inn
innholdet i `dashboards/buss_mot_oslo.yaml`.

**Eller som kort i et eksisterende dashbord:** Rediger dashbord → Legg til kort
→ Manuelt, og lim inn ett og ett kort fra fila.

## Entiteter som opprettes

| Entitet | Beskrivelse |
|:--|:--|
| `sensor.buss_mot_oslo` | Minutter til neste buss mot Oslo, med linje og destinasjon som attributter |
| `sensor.buss_mot_oslo_neste` | Minutter til avgangen etter den |
| `sensor.buss_mot_oslo_data` | Hele avgangslista i attributtet `departures`, oppdatert hvert 30. sekund |
| `binary_sensor.buss_mot_oslo_avvik` | `on` når neste avgang er innstilt eller mer enn 3 minutter forsinket |
| `sensor.entur_tsv_raw` | Rådata fra Entur, nyttig ved feilsøking |

Entur spørres hvert 60. sekund, mens nedtellingen regnes om hvert 30. sekund
lokalt, så tavla står aldri og viser gamle minutter mellom API-kallene.

## Feilsøking

**Tavla er tom, men `sensor.entur_tsv_raw` har avganger.** Da treffer ikke
retningsfilteret. Se på `destinationDisplay.frontText` i rådataene og legg til
stikkordet som faktisk brukes, eller bytt til quay-filteret i steg 3.

**`sensor.entur_tsv_raw` er `unknown` eller `0`.** Sjekk stoppested-IDen, og at
HA-serveren når `api.entur.io`. Test spørringen direkte:

```bash
curl -s https://api.entur.io/journey-planner/v3/graphql \
  -H 'Content-Type: application/json' \
  -H 'ET-Client-Name: micsen-homeassistant' \
  -d '{"query":"{stopPlace(id:\"NSR:StopPlace:XXXXX\"){name estimatedCalls(timeRange:7200,numberOfDepartures:10){expectedDepartureTime destinationDisplay{frontText} quay{id publicCode} serviceJourney{line{publicCode transportMode}}}}}"}' | jq
```

**Historikken blir stor.** `sensor.entur_tsv_raw` har et tungt attributt. Legg
det inn i din eksisterende `recorder:`-blokk i `configuration.yaml`:

```yaml
recorder:
  exclude:
    entities:
      - sensor.entur_tsv_raw
```

## Bruksvilkår

Entur-APIet er åpent og gratis, men krever en `ET-Client-Name`-header på
formatet `<selskap>-<applikasjon>`. Hold oppdateringsintervallet på 60 sekunder
eller mer.
