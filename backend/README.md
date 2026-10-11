# Backend — EcoSidecar-360 API (FastAPI)

Simulated telemetry by default. No live hardware integration exists yet.

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Docs: http://localhost:8000/docs   Health: http://localhost:8000/health
```

Endpoints: `/api/telemetry/current`, `/api/demand/history`, `/api/motor-health`, `/api/assets`, `/api/events`, `/api/solar-grid`, `/api/savings`, `POST /api/telemetry` (future ESP32 ingestion stub, 202, not persisted).

Tests: `cd ../tests && python3 -m pytest backend/ -v` (or from repo root: `python3 -m pytest tests/backend -v` after `pip install -r backend/requirements.txt`).
