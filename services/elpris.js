// NY FUNKTIONALITET: henter dagens spotpriser fra Energinets åbne API (Energi Data Service).
// Gratis og uden API-nøgle. Datasættet "DayAheadPrices" erstattede "Elspotprices" efter 30/9 2025.
// Spotprisen er kun selve strømmen; vi lægger moms, nettarif og elafgift oveni for at få
// den pris, en husstand faktisk betaler (groft estimat, se README).
const API = 'https://api.energidataservice.dk/dataset/DayAheadPrices';

export const TARIFF_ESTIMATE = 0.7; // kr./kWh: nettarif + Energinet-tarif + abonnement (antagelse)
export const ELAFGIFT = 0.01; // kr./kWh inkl. moms i 2026-2027

// Spotpris (kr. pr. MWh) -> forbrugerpris (kr. pr. kWh)
export const toConsumerPrice = (spotDkkPerMwh) => (spotDkkPerMwh / 1000) * 1.25 + TARIFF_ESTIMATE + ELAFGIFT;

export async function fetchSpotPrices(area = 'DK2') {
  const filter = encodeURIComponent(JSON.stringify({ PriceArea: [area] }));
  const url = `${API}?limit=200&sort=TimeUTC%20desc&filter=${filter}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  // Priserne kommer i kvarterer. Vi samler dem til timer og runder af.
  const byHour = {};
  for (const r of json.records ?? []) {
    const time = r.TimeDK ?? r.HourDK;
    const dkk = r.DayAheadPriceDKK ?? r.SpotPriceDKK;
    if (!time || dkk == null) continue;
    const hourKey = time.slice(0, 13);
    (byHour[hourKey] ??= []).push(dkk);
  }
  const all = Object.entries(byHour)
    .map(([hour, vals]) => ({
      hour,
      label: hour.slice(11, 13),
      price: toConsumerPrice(vals.reduce((a, b) => a + b, 0) / vals.length),
    }))
    .sort((a, b) => a.hour.localeCompare(b.hour));
  // De næste 24 timer fra nu (day-ahead-priserne for i morgen udkommer ca. kl. 13)
  const start = all.findIndex((p) => p.hour >= currentHourKey());
  return start >= 0 ? all.slice(start, start + 24) : all.slice(-24);
}

// "YYYY-MM-DDTHH" i dansk tid, samme format som TimeDK
export function currentHourKey() {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Copenhagen', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false,
  }).format(new Date()); // fx "2026-11-16 12"
  return parts.replace(' ', 'T');
}

// Reserve hvis man er offline: et typisk døgnmønster (billig nat, dyr kogespids kl. 17-20)
export function fallbackPrices() {
  const pattern = [1.62, 1.55, 1.5, 1.48, 1.5, 1.6, 1.85, 2.15, 2.2, 2.0, 1.85, 1.75,
    1.7, 1.68, 1.72, 1.9, 2.3, 2.75, 2.85, 2.5, 2.1, 1.9, 1.78, 1.68];
  const now = new Date().getHours();
  return [...Array(24)].map((_, i) => {
    const h = (now + i) % 24;
    return { hour: `demo-${i}`, label: String(h).padStart(2, '0'), price: pattern[h] };
  });
}
