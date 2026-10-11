# Architecture

Two-node design (Rev 2.3): **Node 1 — Electrical Master** (LT panel: metering, demand window, APFC stage watch, compressor logic) and **Node 2 — Thermal Satellite** (furnace skid: flue O₂, draft, damper trim simulation). Node 2 reports to Node 1; Node 1 is the only node that would ever talk to the backend.

Trust ladder: **Level 0 Sense** (read-only) → **Level 1 Advise** (recommendations, human acts) → **Level 2 Act within limits** (bounded, hardware-interlocked — simulated only in this repo, never enabled by default).

Data flow today: `demoData.js / FastAPI simulated endpoints → React dashboard`. Data flow tomorrow: `ESP32 → POST /api/telemetry → store → GET endpoints → dashboard`.
