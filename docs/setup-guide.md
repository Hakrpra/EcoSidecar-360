# Setup Guide (beginner-friendly)

You need: Node.js 20+, Python 3.11+ (backend only), and optionally PlatformIO (firmware compile check only).

1. Download/unzip the project, open a terminal in the `EcoSidecar-360` folder.
2. Dashboard: `cd frontend && npm install && npm run dev` → open http://localhost:5173 — you should see the navy dashboard with an amber **DEMO MODE** banner.
3. Backend (optional second terminal): see README commands → http://localhost:8000/docs shows every API endpoint; click one and press "Try it out" to see simulated JSON.
4. Firmware (optional): `cd firmware && pio run` should end with `SUCCESS`. Do **not** upload to a board connected to factory equipment.

Troubleshooting: port busy → `npm run dev -- --port 5174`; blank page → check the terminal for a red error and that you ran `npm install` inside `frontend/`, not the root; backend CORS → only localhost:5173/4173 are allowed by default.
