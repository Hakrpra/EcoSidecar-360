// Transparent calculations — all inputs are DEMO / simulated unless labelled measured.
// Keep these pure and testable.

export const TARIFFS = [
  { label: 'Night (22:00-06:00)', rate: 6.5, color: '#22d3ee' },
  { label: 'Normal (06:00-18:00)', rate: 8.0, color: '#4ee09a' },
  { label: 'Peak (18:00-22:00)', rate: 10.5, color: '#fbbf24' },
]

export function tariffForHour(h) {
  if (h >= 22 || h < 6) return TARIFFS[0]
  if (h < 18) return TARIFFS[1]
  return TARIFFS[2]
}

export function energyCostINR(kwh, hour = 12) {
  return kwh * tariffForHour(hour).rate
}

export function projectedDemand(windowSamplesKva, elapsedMin, windowMin = 15) {
  if (!windowSamplesKva.length) return 0
  const avgSoFar = windowSamplesKva.reduce((a, b) => a + b, 0) / windowSamplesKva.length
  // Simple, honest projection: assume current average persists for the rest of the window.
  // elapsedMin is documented for future weighted models; current model = avgSoFar.
  void elapsedMin; void windowMin
  return Math.round(avgSoFar * 10) / 10
}

export function demandStatus(projected, contractKva = 75, triggerRatio = 0.92) {
  if (projected >= contractKva) return 'BREACH'
  if (projected >= contractKva * triggerRatio) return 'WARNING'
  return 'OK'
}

export function estimatedSavings(baselineKwh, actualKwh, hour = 12) {
  const savedKwh = Math.max(0, baselineKwh - actualKwh)
  return { savedKwh, savedINR: energyCostINR(savedKwh, hour), pct: baselineKwh ? (savedKwh / baselineKwh) * 100 : 0 }
}

export function gridImport(consumptionKw, solarKw) {
  return Math.max(0, Math.round((consumptionKw - solarKw) * 10) / 10)
}

export function motorHealthIndicator(sidebandRatio) {
  // sidebandRatio: (sideband amplitude / fundamental) from MCSA spectrum — simulated input.
  if (sidebandRatio < 0.02) return { label: 'Healthy', score: 92 }
  if (sidebandRatio < 0.05) return { label: 'Monitor', score: 68 }
  return { label: 'Inspect — possible broken bar / eccentricity', score: 38 }
}
