# Telemetry Protocol

## Today (implemented)
Frontend reads simulated data from the backend (or its built-in fallback):

| Endpoint | Returns |
|---|---|
| `GET /api/telemetry/current` | kVA, kW, PF, O₂, draft, pressure, compressor state |
| `GET /api/demand/history` | 24 hourly demand points |
| `GET /api/motor-health` | MCSA indicator (simulated) |
| `GET /api/assets` · `GET /api/events` · `GET /api/solar-grid` · `GET /api/savings` | Dashboard panels |

Every response carries `demo_mode: true, source: "simulated"`. Clients must surface that, not strip it.

## Future (documented, NOT yet live)
ESP32 → backend ingestion:
```http
POST /api/telemetry
{ "device_id": "ECO360-NODE1", "kva": 70.1, "kw": 56.8, "pf": 0.81 }
→ 202 { "accepted": true, "stored": false }
```
`stored: false` is deliberate honesty: persistence is not implemented yet. When it is, add timestamp, sequence number, and HMAC signing — never send credentials in firmware source; provision them per-device.
