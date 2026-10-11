"""Transparent calculations. Mirrors frontend/src/services/calculations.js — keep in sync."""

def tariff_for_hour(h: int) -> float:
    if h >= 22 or h < 6: return 6.5
    if h < 18: return 8.0
    return 10.5

def energy_cost_inr(kwh: float, hour: int = 12) -> float:
    return kwh * tariff_for_hour(hour)

def projected_demand(samples: list[float]) -> float:
    return round(sum(samples) / len(samples), 1) if samples else 0.0

def demand_status(projected: float, contract_kva: float = 75.0) -> str:
    if projected >= contract_kva: return "BREACH"
    if projected >= contract_kva * 0.92: return "WARNING"
    return "OK"

def grid_import(consumption_kw: float, solar_kw: float) -> float:
    return max(0.0, round(consumption_kw - solar_kw, 1))

def estimated_savings(baseline_kwh: float, actual_kwh: float, hour: int = 12) -> dict:
    saved = max(0.0, baseline_kwh - actual_kwh)
    return {"saved_kwh": saved, "saved_inr": energy_cost_inr(saved, hour),
            "pct": round(saved / baseline_kwh * 100, 2) if baseline_kwh else 0.0}
