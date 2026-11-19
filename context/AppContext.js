import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  loadMachine, saveMachine, loadSessions, saveSessions, loadRentals, saveRentals,
  loadSettings, saveSettings, loadCachedPrices, saveCachedPrices, clearAll,
  DEFAULT_MACHINE, DEFAULT_SETTINGS,
} from '../storage/storage';
import { calcEarnings, kwhPerHour, PLATFORM_FEE, round2 } from '../storage/hardware';
import { SEED_LISTINGS } from '../storage/marketplace';
import { fetchSpotPrices, fallbackPrices } from '../services/elpris';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const DAY = 24 * 60 * 60 * 1000;

// Første gang appen åbnes: en uges eksempeljob, så grafen på Aktivitet ikke er tom.
function starterSessions(machine) {
  const hours = [3, 5, 2, 6, 4, 7, 3];
  return hours.map((h, i) => makeSession(machine, h, 1.9, Date.now() - (6 - i) * DAY));
}

function makeSession(machine, hours, elpris, time = Date.now()) {
  const gross = machine.pricePerHour * hours;
  const fee = gross * PLATFORM_FEE;
  const power = kwhPerHour(machine.gpuId, machine.cores) * hours * elpris;
  return {
    id: `${time}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date(time).toISOString(),
    hours,
    renter: ['AI-studerende, DTU', 'Indie-spilstudie', 'Arkitekt (rendering)', 'ML-startup', 'Speciale-gruppe, CBS'][Math.floor(Math.random() * 5)],
    gross: round2(gross),
    fee: round2(fee),
    power: round2(power),
    net: round2(gross - fee - power),
    paidOut: false,
  };
}

export function AppProvider({ children }) {
  const [machine, setMachine] = useState(DEFAULT_MACHINE);
  const [sessions, setSessions] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [prices, setPrices] = useState({ list: fallbackPrices(), live: false, fetchedAt: null });
  const [loaded, setLoaded] = useState(false);

  // Hent gemte data ved opstart
  useEffect(() => {
    (async () => {
      const [m, s, r, st, p] = await Promise.all([
        loadMachine(), loadSessions(), loadRentals(), loadSettings(), loadCachedPrices(),
      ]);
      const mach = { ...DEFAULT_MACHINE, ...(m ?? {}) };
      setMachine(mach);
      setSessions(s ?? starterSessions(mach));
      setRentals(r);
      setSettings({ ...DEFAULT_SETTINGS, ...st });
      if (p) setPrices(p);
      setLoaded(true);
    })();
  }, []);

  // Gem automatisk når data ændres (først efter første indlæsning)
  useEffect(() => { if (loaded) saveMachine(machine); }, [machine, loaded]);
  useEffect(() => { if (loaded) saveSessions(sessions); }, [sessions, loaded]);
  useEffect(() => { if (loaded) saveRentals(rentals); }, [rentals, loaded]);
  useEffect(() => { if (loaded) saveSettings(settings); }, [settings, loaded]);

  // Hent live elpriser fra Energinet, når appen er klar, eller når prisområdet skiftes
  const refreshPrices = useCallback(async () => {
    try {
      const list = await fetchSpotPrices(settings.area);
      if (list.length === 0) throw new Error('tom liste');
      const next = { list, live: true, fetchedAt: new Date().toISOString() };
      setPrices(next);
      saveCachedPrices(next);
      return true;
    } catch (e) {
      console.warn('Elpris kunne ikke hentes, bruger gemte/typiske priser', e);
      return false;
    }
  }, [settings.area]);

  useEffect(() => { if (loaded) refreshPrices(); }, [loaded, refreshPrices]);

  // Aktuel elpris = første time i listen (listen starter ved indeværende time)
  const currentElpris = prices.list.length ? prices.list[0].price : 2.0;
  const avgElpris = prices.list.length
    ? prices.list.reduce((a, p) => a + p.price, 0) / prices.list.length
    : 2.0;

  const earnings = useMemo(
    () => calcEarnings({ ...machine, elpris: avgElpris, utilization: settings.utilization }),
    [machine, avgElpris, settings.utilization],
  );

  // Smart udlejning: er elprisen lige nu for høj til, at det kan betale sig?
  const pausedByPrice = settings.smartPause && currentElpris > settings.maxElpris;

  const updateMachine = useCallback((patch) => setMachine((m) => ({ ...m, ...patch })), []);
  const toggleSharing = useCallback(() => setMachine((m) => ({ ...m, sharing: !m.sharing })), []);
  const updateSettings = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);

  // Demo: simulerer at en lejer har brugt maskinen (i den rigtige løsning melder desktop-agenten det)
  const simulateJob = useCallback(() => {
    const hours = 1 + Math.floor(Math.random() * 6);
    const s = makeSession(machine, hours, currentElpris);
    setSessions((cur) => [s, ...cur]);
    return s;
  }, [machine, currentElpris]);

  const balance = round2(sessions.filter((s) => !s.paidOut).reduce((a, s) => a + s.net, 0));

  const payout = useCallback(() => {
    setSessions((cur) => cur.map((s) => ({ ...s, paidOut: true })));
  }, []);

  // Lejer-siden: lej en maskine fra markedspladsen
  const rentMachine = useCallback((listing, hours) => {
    setRentals((cur) => [
      {
        id: Date.now().toString(),
        listingId: listing.id,
        owner: listing.owner,
        gpuId: listing.gpuId,
        hours,
        total: round2(listing.price * hours),
        date: new Date().toISOString(),
        status: 'Aktiv',
      },
      ...cur,
    ]);
  }, []);

  const endRental = useCallback((id) => {
    setRentals((cur) => cur.map((r) => (r.id === id ? { ...r, status: 'Afsluttet' } : r)));
  }, []);

  // Markedspladsen: eksempeldata + brugerens egen maskine, hvis den er udlejet
  const listings = useMemo(() => {
    const own = machine.sharing
      ? [{
        id: 'own', owner: 'Dig', city: 'Din maskine', gpuId: machine.gpuId, cores: machine.cores,
        ramGb: machine.ramGb, price: machine.pricePerHour, rating: 5, uptime: 100, verified: false, jobs: sessions.length, own: true,
      }]
      : [];
    return [...own, ...SEED_LISTINGS];
  }, [machine, sessions.length]);

  const resetEverything = useCallback(async () => {
    await clearAll();
    setMachine(DEFAULT_MACHINE);
    setSessions(starterSessions(DEFAULT_MACHINE));
    setRentals([]);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = {
    loaded, machine, sessions, rentals, settings, prices, listings,
    currentElpris, avgElpris, earnings, pausedByPrice, balance,
    updateMachine, toggleSharing, updateSettings, simulateJob, payout,
    rentMachine, endRental, refreshPrices, resetEverything,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
