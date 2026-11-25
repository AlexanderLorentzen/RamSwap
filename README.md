# RamSwap

React Native-app (Expo) til en dansk markedsplads, hvor privatpersoner kan udleje deres ubrugte GPU-, CPU- og RAM-kapacitet til studerende, startups og små virksomheder.
Lavet til **den afsluttende gruppeopgave i Innovation og ny teknologi (INNT), CBS, E2026**.

Gruppe: Alexander Lorentzen Villekjaer Og Emil Johan Guntofte

## Funktioner
| Funktion | Skærm | Kommer fra |
|---|---|---|
| **Ærlig indtjeningsberegner**: lejepris minus 20 % gebyr minus strøm = netto pr. time og pr. måned | Udlej | Interviews med gamere: "Hvad tjener jeg REELT?" |
| **Live elpris fra Energinet** (Energi Data Service, DayAheadPrices, ingen API-nøgle) | Forside, Udlej | Strømmen æder en stor del af indtjeningen |
| **Smart pause**: udlejning pauser automatisk, når elprisen er over brugerens grænse | Udlej, Indstillinger | Validering af value hypothesis |
| **Søgning + filtre + sortering** i markedspladsen (GPU, by, VRAM, pris, verificeret) | Marked | Interviews med lejere (studerende/startups) |
| **Book en maskine** i X timer, se samlet pris, del maskinen via telefonens delingsmenu | Maskine | Lejer-test |
| **Ny knap: "Start/Pause udlejning"** | Forside | Kravspecifikation |
| **Ny knap: "Simulér job"** og **"Udbetal"** | Aktivitet | Demo af udlejer-flowet |
| **Gemmer data med AsyncStorage** (maskine, job, lejemål, indstillinger, sidste elpriser) | Alle | Krav fra opgaven |
| **Stor tekst** | Indstillinger | Tilgængelighed |
| **Navigation:** bundmenu (5 tabs) + stack til "Maskine" og "Om RamSwap" | | Kravspecifikation |

Skærme i alt: 7 (Forside, Udlej, Marked, Maskine, Aktivitet, Indstillinger, Om RamSwap).

## Hvem har kodet hvad
| Gruppemedlem | Skærm/del |
|---|---|
| <fiktiv>Navn 1</fiktiv> | Forside + navigation (App.js) + AppContext |
| <fiktiv>Navn 2</fiktiv> | Udlej + indtjeningsberegner (storage/hardware.js) |
| <fiktiv>Navn 3</fiktiv> | Marked + Maskine (søgning, filtre, booking) |
| <fiktiv>Navn 4</fiktiv> | Aktivitet + Indstillinger + elpris-API (services/elpris.js) |

## Struktur
```
App.js                      Navigation (tab + stack)
context/AppContext.js       Global state + automatisk gem/hent
storage/storage.js          AsyncStorage-funktioner
storage/hardware.js         GPU-katalog, prisforslag og indtjeningsberegning
storage/marketplace.js      Eksempelmaskiner på markedspladsen
services/elpris.js          Henter spotpriser fra Energinet og omregner til forbrugerpris
components/ui.js            Stepper, chips, søjlediagram, regnestykke-rækker
screens/                    Skærmene
styles/styles.js            AL styling (separat fil)
INTERVIEW_GUIDE.md          Interviewguide (udlejere, lejere, stakeholders)
```

## Antagelser i beregningerne
- Markedspriser for forbruger-GPU'er fra Vast.ai og SaladCloud (efterår 2026), 1 USD = 6,5 kr.
- CPU 0,03 kr. pr. kerne-time og RAM 0,0065 kr. pr. GB-time (SaladClouds CPU-priser).
- Strøm: GPU'ens TDP × 85 % + 80 W til resten af maskinen + 8 W pr. delt kerne.
- Forbrugerpris for strøm = spotpris × 1,25 (moms) + 0,70 kr. i tariffer + 1 øre elafgift (2026-2027).
- Udnyttelse: 40 % af de tilgængelige timer bliver faktisk lejet ud (kan ændres under Indstillinger).

## Hvad er IKKE bygget (prototype)
Desktop-agenten, der faktisk kører lejernes containere, samt betaling og MitID-verifikation. Derfor kan job simuleres under Aktivitet, og markedspladsen bruger eksempeldata plus din egen maskine.

## Kør appen lokalt
```
npm install
npx expo start
```
Scan QR-koden med Expo Go (iOS/Android, SDK 58), eller tryk `w` for web.

## Demovideo
<fiktiv>Indsæt link til demovideo</fiktiv>

## GitHub
<fiktiv>Indsæt link til public repo</fiktiv>
