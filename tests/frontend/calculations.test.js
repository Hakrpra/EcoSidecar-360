import { describe, expect, it } from 'vitest'
import { demandStatus, energyCostINR, estimatedSavings, gridImport, motorHealthIndicator, projectedDemand } from '../../frontend/src/services/calculations'

describe('calculations', () => {
  it('tariff cost uses peak rate at 19:00', () => { expect(energyCostINR(10, 19)).toBe(105) })
  it('night tariff is cheaper', () => { expect(energyCostINR(10, 23)).toBe(65) })
  it('projected demand averages samples', () => { expect(projectedDemand([70, 72, 71], 5)).toBe(71) })
  it('demand status warns near contract', () => { expect(demandStatus(71, 75)).toBe('WARNING'); expect(demandStatus(76, 75)).toBe('BREACH'); expect(demandStatus(50, 75)).toBe('OK') })
  it('grid import never negative', () => { expect(gridImport(20, 30)).toBe(0); expect(gridImport(50, 20)).toBe(30) })
  it('savings are non-negative', () => { expect(estimatedSavings(100, 120).savedKwh).toBe(0) })
  it('motor health bands', () => { expect(motorHealthIndicator(0.01).label).toBe('Healthy'); expect(motorHealthIndicator(0.09).score).toBe(38) })
})
