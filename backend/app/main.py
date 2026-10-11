"""EcoSidecar-360 backend — SIMULATED telemetry by default.
No live ESP32 integration exists yet: the firmware does not publish telemetry.
POST /api/telemetry is the documented future ingestion point (see docs/telemetry-protocol.md).
"""
import math
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .calculations import demand_status, estimated_savings, grid_import

app = FastAPI(title="EcoSidecar-360 API", description="Simulated telemetry — DEMO MODE")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://localhost:4173"], allow_methods=["*"], allow_headers=["*"])

DEMO = {"demo_mode": True, "source": "simulated", "plant": "Plant R1 (reference)", "trl": 3}

@app.get("/health")
def health(): return {"status": "ok", **DEMO}

@app.get("/api/telemetry/current")
def current():
    kva = 70.8
    return {**DEMO, "kva": kva, "kw": round(kva * 0.81, 1), "pf": 0.81, "flue_o2_pct": 10.8,
            "draft_pa": -8.0, "compressor": "LOADED", "pressure_bar": 6.9,
            "demand_status": demand_status(71.2)}

@app.get("/api/demand/history")
def demand():
    return {**DEMO, "points": [{"hour": h, "kva": round(62 + 14 * math.sin(h / 24 * 6.28), 1)} for h in range(24)]}

@app.get("/api/motor-health")
def motor_health():
    return {**DEMO, "motor": "Main Motor 15 kW", "sideband_ratio": 0.031,
            "indicator": "Monitor", "note": "Simulated spectrum — not a diagnosis"}

@app.get("/api/assets")
def assets():
    return {**DEMO, "assets": [
        {"id": "AST-01", "name": "Screw Compressor 37 kW", "status": "Loaded", "health": 84},
        {"id": "AST-04", "name": "APFC Panel", "status": "Warning — Stage 4 at 41%", "health": 55},
        {"id": "AST-05", "name": "Main Motor 15 kW", "status": "Monitor (MCSA)", "health": 68}]}

@app.get("/api/events")
def events():
    return {**DEMO, "events": [
        {"time": "11:42", "level": "warn", "text": "APFC Stage 4 at 41% of nameplate (simulated)"},
        {"time": "11:28", "level": "info", "text": "Demand projection 71.2 kVA — below contract"}]}

@app.get("/api/solar-grid")
def solar_grid():
    pts = []
    for h in range(24):
        solar = round(math.sin((h - 6) / 12 * math.pi) * 28, 1) if 6 <= h <= 18 else 0.0
        cons = round(52 + 16 * math.sin(h / 24 * 6.28), 1)
        pts.append({"hour": h, "solar_kw": solar, "consumption_kw": cons, "grid_kw": grid_import(cons, solar)})
    return {**DEMO, "points": pts}

@app.get("/api/savings")
def savings():
    return {**DEMO, **estimated_savings(11140, 10600), "basis": "Modelled vs 11,140 kWh/mo baseline — not measured"}

class TelemetryIn(BaseModel):
    device_id: str
    kva: float
    kw: float
    pf: float

@app.post("/api/telemetry", status_code=202)
def ingest(t: TelemetryIn):
    # Future ESP32 ingestion point. Currently accepts + acknowledges only;
    # nothing is persisted, so do not claim live integration from this alone.
    return {"accepted": True, "device_id": t.device_id, "stored": False,
            "note": "Ingestion stub — persistence not yet implemented"}
