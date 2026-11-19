// Lokal lagring med AsyncStorage, så maskinopsætning, indtjening, lejemål og
// indstillinger huskes, selv når appen lukkes.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  machine: 'ramswap:machine',
  sessions: 'ramswap:sessions',
  rentals: 'ramswap:rentals',
  settings: 'ramswap:settings',
  prices: 'ramswap:prices',
};

export const DEFAULT_MACHINE = {
  nickname: 'Min gamer-PC',
  gpuId: 'rtx4070',
  cores: 6,
  ramGb: 16,
  pricePerHour: 1.78,
  hoursPerDay: 10,
  sharing: false,
  onlyWhenIdle: true,
};

export const DEFAULT_SETTINGS = {
  largeText: false,
  area: 'DK2',
  maxElpris: 2.2, // Smart udlejning: pause når elprisen er over denne grænse
  smartPause: true,
  utilization: 0.4, // forventet andel af tilgængelige timer, der faktisk bliver lejet ud
};

async function load(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('Kunne ikke hente', key, e);
    return fallback;
  }
}

async function save(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Kunne ikke gemme', key, e);
  }
}

export const loadMachine = () => load(KEYS.machine, null);
export const saveMachine = (v) => save(KEYS.machine, v);
export const loadSessions = () => load(KEYS.sessions, null);
export const saveSessions = (v) => save(KEYS.sessions, v);
export const loadRentals = () => load(KEYS.rentals, []);
export const saveRentals = (v) => save(KEYS.rentals, v);
export const loadSettings = () => load(KEYS.settings, DEFAULT_SETTINGS);
export const saveSettings = (v) => save(KEYS.settings, v);
export const loadCachedPrices = () => load(KEYS.prices, null);
export const saveCachedPrices = (v) => save(KEYS.prices, v);

export async function clearAll() {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (e) {
    console.warn('Kunne ikke rydde data', e);
  }
}
