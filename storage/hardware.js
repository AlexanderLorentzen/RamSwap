// Hardwarekatalog og indtjeningsberegner.
// Priserne er forslag i kr. pr. time og ligger tæt på markedsprisen for forbruger-GPU'er
// på Vast.ai og SaladCloud (efterår 2026), omregnet med 1 USD = 6,5 kr. (antagelse).
// Strømforbrug (watt) er producentens TDP; under udlejning regner vi med 85 % belastning.

export const PLATFORM_FEE = 0.2; // RamSwap tager 20 % af lejeprisen
export const CPU_PRICE_PER_CORE = 0.03; // kr. pr. kerne pr. time
export const RAM_PRICE_PER_GB = 0.0065; // kr. pr. GB pr. time
export const BASE_WATT = 80; // resten af computeren (bundkort, CPU i tomgang, ram osv.)
export const GPU_LOAD = 0.85;

export const GPUS = [
  { id: 'none', name: 'Ingen GPU (kun CPU/RAM)', vram: 0, watt: 0, price: 0 },
  { id: 'rtx3060', name: 'RTX 3060', vram: 12, watt: 170, price: 0.9 },
  { id: 'rtx3070', name: 'RTX 3070', vram: 8, watt: 220, price: 1.2 },
  { id: 'rtx3080', name: 'RTX 3080', vram: 10, watt: 320, price: 1.6 },
  { id: 'rtx3090', name: 'RTX 3090', vram: 24, watt: 350, price: 2.2 },
  { id: 'rtx4060ti', name: 'RTX 4060 Ti', vram: 16, watt: 165, price: 1.2 },
  { id: 'rtx4070', name: 'RTX 4070', vram: 12, watt: 200, price: 1.5 },
  { id: 'rtx4080', name: 'RTX 4080', vram: 16, watt: 320, price: 2.4 },
  { id: 'rtx4090', name: 'RTX 4090', vram: 24, watt: 450, price: 3.2 },
  { id: 'rtx5090', name: 'RTX 5090', vram: 32, watt: 575, price: 4.6 },
];

export const getGpu = (id) => GPUS.find((g) => g.id === id) ?? GPUS[0];

// Foreslået timepris ud fra den hardware, brugeren vil dele
export function suggestedPrice({ gpuId, cores, ramGb }) {
  const gpu = getGpu(gpuId);
  return round2(gpu.price + cores * CPU_PRICE_PER_CORE + ramGb * RAM_PRICE_PER_GB);
}

// Strømforbrug pr. udlejet time i kWh
export function kwhPerHour(gpuId, cores) {
  const gpu = getGpu(gpuId);
  const cpuWatt = cores * 8; // groft estimat: 8 W pr. delt kerne under last
  return (gpu.watt * GPU_LOAD + BASE_WATT + cpuWatt) / 1000;
}

// Kernen i appen: hvad tjener du reelt, når strøm og gebyr er trukket fra?
// hoursPerDay = hvor mange timer maskinen er tilgængelig, utilization = andel af de timer der faktisk lejes ud.
export function calcEarnings({ gpuId, cores, ramGb, pricePerHour, elpris, hoursPerDay, utilization }) {
  const gross = pricePerHour;
  const fee = gross * PLATFORM_FEE;
  const kwh = kwhPerHour(gpuId, cores);
  const power = kwh * elpris;
  const net = gross - fee - power;
  const rentedHoursMonth = hoursPerDay * 30 * utilization;
  return {
    grossHour: round2(gross),
    feeHour: round2(fee),
    powerHour: round2(power),
    netHour: round2(net),
    kwhHour: round2(kwh),
    rentedHoursMonth: Math.round(rentedHoursMonth),
    netMonth: Math.round(net * rentedHoursMonth),
    grossMonth: Math.round(gross * rentedHoursMonth),
    breakEvenElpris: round2((gross - fee) / kwh), // over denne elpris taber du penge
  };
}

export const round2 = (n) => Math.round(n * 100) / 100;
export const kr = (n) => `${Number(n).toFixed(2).replace('.', ',')} kr.`;
export const krInt = (n) => `${Math.round(n).toLocaleString('da-DK')} kr.`;
