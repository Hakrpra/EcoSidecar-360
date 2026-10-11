# Safety & Limitations — read before any hardware work

- **Simulation-only by default.** `SIMULATION_ONLY=1`, `ENABLE_ACTUATION=0`. Both must change, plus a documented site safety review, before any physical output is even possible in code.
- **This project claims no compliance** with any industrial safety, electrical, or furnace standard. Nothing here is certified.
- **Fail-safe principle (design intent, not yet field-proven):** if the controller dies, the factory must run exactly as it does today — damper on a clutch + return spring, compressor control advisory until Level 2 is separately approved.
- **Pressure floor:** compressor shedding aborts below 5.2 bar in the model; a real installation needs a hardwired pressure interlock independent of this software.
- **Damper authority** is bounded to ±15° around the operator baseline in code; a mechanical limit must also exist on real hardware.
- **MCSA / vibration indicators are screening aids, not diagnoses.** Never schedule a motor teardown from demo or unvalidated data.
- **Do not connect this firmware to live industrial actuators** based on this repository alone.
