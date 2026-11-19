// Eksempeldata for markedspladsen (lejer-siden). I en færdig version kommer listen fra
// en backend (fx Firebase), hvor hver udlejers desktop-agent melder sin maskine online.
// Brugerens egen maskine lægges automatisk ind i listen, når udlejning er slået til.
export const SEED_LISTINGS = [
  { id: 'm1', owner: 'Mikkel', city: 'Aarhus C', gpuId: 'rtx4090', cores: 8, ramGb: 32, price: 3.4, rating: 4.9, uptime: 98, verified: true, jobs: 212 },
  { id: 'm2', owner: 'Sofie', city: 'Frederiksberg', gpuId: 'rtx3090', cores: 8, ramGb: 64, price: 2.3, rating: 4.8, uptime: 95, verified: true, jobs: 147 },
  { id: 'm3', owner: 'Jonas', city: 'Odense', gpuId: 'rtx4080', cores: 12, ramGb: 32, price: 2.6, rating: 4.6, uptime: 91, verified: false, jobs: 58 },
  { id: 'm4', owner: 'Amalie', city: 'København NV', gpuId: 'rtx4070', cores: 6, ramGb: 32, price: 1.6, rating: 4.7, uptime: 93, verified: true, jobs: 96 },
  { id: 'm5', owner: 'Frederik', city: 'Aalborg', gpuId: 'rtx5090', cores: 16, ramGb: 64, price: 4.9, rating: 5.0, uptime: 99, verified: true, jobs: 31 },
  { id: 'm6', owner: 'Emil', city: 'Roskilde', gpuId: 'rtx3060', cores: 6, ramGb: 16, price: 0.95, rating: 4.4, uptime: 87, verified: false, jobs: 40 },
  { id: 'm7', owner: 'Ida', city: 'Vejle', gpuId: 'rtx4060ti', cores: 8, ramGb: 32, price: 1.3, rating: 4.5, uptime: 90, verified: true, jobs: 73 },
  { id: 'm8', owner: 'Oliver', city: 'Esbjerg', gpuId: 'none', cores: 16, ramGb: 128, price: 1.3, rating: 4.3, uptime: 96, verified: false, jobs: 19 },
];

// Hvad lejerne typisk bruger computerkraften til (vises på detaljeskærmen)
export const USE_CASES = {
  high: 'AI-billedgenerering, finjustering af små sprogmodeller, 3D-rendering',
  mid: 'AI-inferens, video-encoding, Blender-rendering',
  low: 'Batch-job, kompilering af kode, dataanalyse i R/Python',
};
