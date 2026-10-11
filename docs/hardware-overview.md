# Hardware Overview

Reference plant R1: 75 kVA contract demand · 37 kW screw compressor (750 L receiver) · pit furnace · PF ~0.81 · 11,140 kWh/month.

| Block | Part / interface (from Rev 2.3 BOM, ₹24,930 total) | Status in this repo |
|---|---|---|
| Current sensing | 3× 200A:333 mV split-core CTs | Spec only |
| MCSA front end | ADS8866 16-bit, 8 kHz, 16,384-pt FFT (0.49 Hz) | Spec only — spectrum in UI is simulated |
| Vibration | ADXL345 (compressor, magnet mount) | Spec only |
| Flue O₂ | Zirconia probe | Simulated in firmware |
| Metering bus | RS-485 / Modbus | Pin definitions only |
| Display | I2C OLED (SDA 21 / SCL 22) | Serial-mirrored stub |
| Comms | 4G modem UART | Pin definitions only |
| Storage | SD over SPI (CS 5) | Pin definitions only |

Pin map lives in `firmware/src/main.cpp` — that file is the source of truth, and it is a reconstruction: verify every pin against your board before connecting anything.
