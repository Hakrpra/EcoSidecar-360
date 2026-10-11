import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "backend"))
from fastapi.testclient import TestClient
from app.main import app
from app.calculations import demand_status, energy_cost_inr, grid_import

client = TestClient(app)

def test_health_demo_labelled():
    r = client.get("/health"); assert r.status_code == 200
    assert r.json()["demo_mode"] is True

def test_current_is_simulated():
    j = client.get("/api/telemetry/current").json()
    assert j["source"] == "simulated" and j["kva"] == 70.8

def test_savings_non_negative():
    j = client.get("/api/savings").json(); assert j["saved_kwh"] >= 0

def test_ingest_stub_is_honest():
    r = client.post("/api/telemetry", json={"device_id": "ECO360-NODE1", "kva": 70, "kw": 57, "pf": 0.81})
    assert r.status_code == 202 and r.json()["stored"] is False

def test_calc_parity_with_frontend():
    assert energy_cost_inr(10, 19) == 105
    assert demand_status(71, 75) == "WARNING"
    assert grid_import(20, 30) == 0
