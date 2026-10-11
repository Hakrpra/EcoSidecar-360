const base = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
export async function get(path) {
  const r = await fetch(`${base}${path}`)
  if (!r.ok) throw new Error(`API ${r.status}`)
  return r.json()
}
export const api = {
  current: () => get('/api/telemetry/current'),
  demand: () => get('/api/demand/history'),
  motorHealth: () => get('/api/motor-health'),
  assets: () => get('/api/assets'),
  events: () => get('/api/events'),
  solarGrid: () => get('/api/solar-grid'),
  savings: () => get('/api/savings'),
}
