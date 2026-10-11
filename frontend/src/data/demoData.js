// DEMO DATA — simulated, clearly labelled. Reference Plant R1 (from Rev 2.3 dossier):
// 75 kVA contract, 37 kW compressor, PF ~0.81, 11,140 kWh/month baseline. NOT field-measured.
function seeded(i, base, amp, period = 24) { return Math.round((base + amp * Math.sin((i / period) * Math.PI * 2) + Math.sin(i * 1.7) * amp * 0.18) * 10) / 10 }

export const demandHistory = Array.from({ length: 24 }, (_, h) => {
  const kva = seeded(h, 62, 14)
  return { time: `${String(h).padStart(2, '0')}:00`, kva, kw: Math.round(kva * 0.81 * 10) / 10, tariff: h >= 18 && h < 22 ? 10.5 : h >= 22 || h < 6 ? 6.5 : 8.0 }
})

export const mcsaSpectrum = Array.from({ length: 60 }, (_, i) => {
  const freq = i * 2
  let amp = Math.max(0.4, 8 - i * 0.12 + Math.sin(i) * 0.6)
  if (i === 25) amp = 100 // 50 Hz fundamental
  if (i === 23 || i === 27) amp = 3.1 // sidebands — simulated fault signature
  if (i === 50) amp = 12 // 100 Hz harmonic
  return { freq, amp: Math.round(amp * 10) / 10 }
})

export const loadComposition = [
  { name: 'Compressor', value: 34, color: '#4ee09a' },
  { name: 'Furnace / Heating', value: 28, color: '#22d3ee' },
  { name: 'CNC / Machines', value: 22, color: '#818cf8' },
  { name: 'Lighting + Aux', value: 16, color: '#fbbf24' },
]

export const solarGrid = Array.from({ length: 24 }, (_, h) => {
  const solar = h >= 6 && h <= 18 ? Math.round(Math.sin(((h - 6) / 12) * Math.PI) * 28 * 10) / 10 : 0
  const consumption = seeded(h, 52, 16)
  return { time: `${String(h).padStart(2, '0')}:00`, solar, consumption, grid: Math.max(0, Math.round((consumption - solar) * 10) / 10) }
})

export const assets = [
  { id: 'AST-01', name: 'Screw Compressor 37 kW', type: 'Compressor', status: 'Loaded', loadPct: 78, health: 84 },
  { id: 'AST-02', name: 'Pit Furnace — Node 2', type: 'Furnace', status: 'Heating', loadPct: 64, health: 91 },
  { id: 'AST-03', name: 'CNC Mill VMC-850', type: 'Machine', status: 'Running', loadPct: 57, health: 88 },
  { id: 'AST-04', name: 'APFC Panel (8 stages)', type: 'Electrical', status: 'Warning — Stage 4 at 41%', loadPct: 50, health: 55 },
  { id: 'AST-05', name: 'Main Motor 15 kW', type: 'Motor', status: 'Monitor (MCSA)', loadPct: 61, health: 68 },
  { id: 'AST-06', name: 'Cooling Tower Pump', type: 'Pump', status: 'Running', loadPct: 43, health: 93 },
]

export const events = [
  { time: '11:42', level: 'warn', text: 'APFC Stage 4 step at 41% of nameplate — schedule replacement (simulated)' },
  { time: '11:28', level: 'info', text: '15-min demand projection 71.2 kVA — below 75 kVA contract' },
  { time: '10:57', level: 'warn', text: 'MCSA sidebands elevated on Main Motor 15 kW — monitor, do not conclude fault from demo data' },
  { time: '10:15', level: 'info', text: 'Solar generation peaked at 27.8 kW (simulated profile)' },
  { time: '09:03', level: 'info', text: 'Compressor ran off-shift 02:00–05:30 in baseline model — leak / idle check advised' },
]

export const kpis = [
  { label: 'Apparent Power', value: '70.8', unit: 'kVA', sub: 'Contract 75 kVA', tone: 'warn' },
  { label: 'Real Power', value: '57.3', unit: 'kW', sub: 'PF 0.810 (simulated)', tone: 'normal' },
  { label: 'Energy Today', value: '842', unit: 'kWh', sub: 'Demo profile', tone: 'normal' },
  { label: 'Est. Bill Reduction', value: '₹4,120', unit: '/mo modelled', sub: 'Not measured — see Docs', tone: 'good' },
]
