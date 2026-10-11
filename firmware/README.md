# Firmware — EcoSidecar-360 Node 1 (ESP32)

**Status: simulation-only reference.** Reconstructed from the project spec because no original `main.cpp` was attached to the build request. Diff against your original before flashing — keep your pin definitions.

## Build (PlatformIO)
```bash
cd firmware
pio run          # compile check
pio run -t upload # ONLY on a bench board, never connected to plant actuators in sim mode
pio device monitor
```

## Serial commands (115200)
`status` · `shed` · `load` · `trim <-15..15>` · `help` — all simulated, no GPIO actuation in default mode.

## Audit notes (found in spec review — documented, not silently changed)
1. **Stepper enable polarity** — assumed active-low; verify against your driver datasheet before enabling.
2. **Projection model** — persists-average is simple and can under-react to a late-window spike; a time-weighted projection is on the roadmap.
3. **Pressure abort priority** — abort is checked before shed continuation (correct), but there is no hysteresis; rapid cycling is possible near 5.2 bar. Proposed: 0.3 bar hysteresis.
4. **Watchdog** — heartbeat toggles every 800 ms for a 1.6 s external WDT; if the main loop blocks on Serial reads, the heartbeat stalls. Proposed: move heartbeat to a hardware timer.
5. **Declared ≠ implemented** — RS-485 meter, modem, and SD drivers are pin definitions only in this reference.
6. **No safety-standard compliance is claimed.** See `docs/safety-limitations.md`.
