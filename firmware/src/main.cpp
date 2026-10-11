/*
 * EcoSidecar-360 — Node 1 Firmware (RECONSTRUCTED REFERENCE)
 * ==========================================================
 * IMPORTANT — READ FIRST
 * - No original main.cpp was attached to the build request in this session.
 *   This file is reconstructed from the project spec (Rev 2.3 dossier +
 *   task description). If you have the original, diff it against this file
 *   and keep YOUR pin definitions — do not blindly overwrite.
 * - DEFAULT MODE IS SIMULATION-ONLY. No live actuator is driven.
 *   Physical actuation requires: SIMULATION_ONLY=0, ENABLE_ACTUATION=1,
 *   and a site safety review. See docs/safety-limitations.md.
 * - Interfaces marked DECLARED are pin/ bus definitions only; the driver
 *   code behind them is not yet implemented and must not be claimed as such.
 *
 * Features (as described): 15-min demand window + projection, compressor
 * load-shed logic, pressure-abort, OLED output, flue O2 + draft simulation,
 * damper stepper simulation, serial test commands, watchdog heartbeat.
 */
#include <Arduino.h>
#include <Wire.h>

// ---------- Safety configuration (do not change casually) ----------
#ifndef SIMULATION_ONLY
#define SIMULATION_ONLY 1
#endif
#define ENABLE_ACTUATION 0   // must stay 0 until safety review is signed off

// ---------- Pin definitions (PRESERVE from original where known) ----------
// DECLARED interfaces — drivers not fully implemented yet:
#define PIN_RS485_DE        4    // RS-485 driver enable (DECLARED)
#define PIN_RS485_RX        16   // RS-485 / energy meter UART RX (DECLARED)
#define PIN_RS485_TX        17   // RS-485 / energy meter UART TX (DECLARED)
#define PIN_MODEM_RX        26   // 4G modem UART RX (DECLARED)
#define PIN_MODEM_TX        27   // 4G modem UART TX (DECLARED)
#define PIN_SD_CS           5    // SD card SPI CS (DECLARED)
#define PIN_OLED_SDA        21   // I2C OLED
#define PIN_OLED_SCL        22
#define PIN_STEPPER_STEP    12   // Damper stepper STEP (SIMULATED by default)
#define PIN_STEPPER_DIR     13   // Damper stepper DIR  (SIMULATED by default)
#define PIN_STEPPER_EN      14   // Stepper enable — held DISABLED in sim mode
#define PIN_COMPRESSOR_RELAY 25  // Load-shed relay — NEVER driven in sim mode
#define PIN_WATCHDOG_HEARTBEAT 2 // Heartbeat LED / external WDT feed

// ---------- Control constants (from Rev 2.3 model, Plant R1) ----------
static const float CONTRACT_KVA   = 75.0f;
static const float DEMAND_TRIGGER = 69.0f;   // 92% of contract
static const uint32_t WINDOW_MS   = 15UL * 60UL * 1000UL;
static const float PRESSURE_FLOOR_BAR = 5.5f; // abort shed below this
static const float PRESSURE_ABORT_BAR = 5.2f;
static const int   DAMPER_BASE_DEG = 35;
static const int   DAMPER_AUTHORITY_DEG = 15; // hard bound ±15°

// ---------- State ----------
static uint32_t windowStartMs = 0;
static float windowSumKva = 0; static uint32_t windowSamples = 0;
static bool compressorLoaded = true;
static uint32_t shedUntilMs = 0;
static float simPressureBar = 6.9f;
static float simFlueO2 = 10.8f;      // SIMULATED zirconia reading
static float simDraftPa = -8.0f;     // SIMULATED draft
static int   damperTrimDeg = 0;      // SIMULATED trim
static uint32_t lastTickMs = 0, lastHeartbeatMs = 0;

// ---------- Simulation inputs (replace with real drivers later) ----------
static float readApparentPowerKva_SIM() {
  // Demo waveform around 70 kVA. NOT a measurement.
  float t = millis() / 1000.0f;
  return 70.8f + 2.3f * sinf(t / 43.0f) + (random(-100, 101) / 100.0f) * 0.6f
         - (compressorLoaded ? 0.0f : 5.5f);
}
static float readPressureBar_SIM() {
  simPressureBar += compressorLoaded ? 0.01f : -0.008f;
  simPressureBar = constrain(simPressureBar, 6.2f, 7.6f);
  return simPressureBar;
}
static void updateThermalSim() {
  simFlueO2 += (10.8f - simFlueO2) * 0.02f + (random(-10, 11) / 1000.0f);
  simDraftPa += (-8.0f - simDraftPa) * 0.03f + (random(-10, 11) / 100.0f);
}

// ---------- Outputs ----------
static void setCompressorLoaded(bool loaded, const char* reason) {
#if SIMULATION_ONLY || !ENABLE_ACTUATION
  // Simulation: change state + log only. No GPIO is driven.
  compressorLoaded = loaded;
  Serial.printf("[SIM] Compressor -> %s (%s) — NO physical output driven\n",
                loaded ? "LOADED" : "UNLOADED", reason);
#else
  // Real actuation path intentionally left unimplemented pending review.
  (void)loaded; (void)reason;
#endif
}
static void setDamperTrim_SIM(int deg) {
  damperTrimDeg = constrain(deg, -DAMPER_AUTHORITY_DEG, DAMPER_AUTHORITY_DEG);
#if !SIMULATION_ONLY && ENABLE_ACTUATION
  // TODO(reviewed): step motor here — bounded, with clutch/return-spring check.
#endif
}
static void oledPrint(float kva, float projected, float o2) {
  // OLED driver calls are stubbed so firmware compiles without the display
  // attached in CI. Wire Adafruit_SSD1306 here on the bench build.
  Serial.printf("[OLED] %.1f kVA | proj %.1f | O2 %.1f%% | damper %d deg\n",
                kva, projected, o2, DAMPER_BASE_DEG + damperTrimDeg);
}

// ---------- Demand window ----------
static float projectedDemandKva() {
  if (!windowSamples) return 0;
  return windowSumKva / windowSamples; // persists-average model (documented)
}
static void demandTick() {
  float kva = readApparentPowerKva_SIM();
  float pressure = readPressureBar_SIM();
  windowSumKva += kva; windowSamples++;
  if (millis() - windowStartMs >= WINDOW_MS) {
    windowStartMs = millis(); windowSumKva = 0; windowSamples = 0;
    Serial.println("[WINDOW] New 15-minute demand window");
  }
  float projected = projectedDemandKva();
  // Pressure-abort has priority over any shed decision.
  if (shedUntilMs && millis() < shedUntilMs && pressure < PRESSURE_ABORT_BAR) {
    shedUntilMs = 0; setCompressorLoaded(true, "PRESSURE ABORT");
  } else if (!shedUntilMs && projected >= DEMAND_TRIGGER && pressure > PRESSURE_FLOOR_BAR) {
    shedUntilMs = millis() + 210000UL; // 210 s shed, as in the R1 model
    setCompressorLoaded(false, "demand projection over trigger");
  } else if (shedUntilMs && millis() >= shedUntilMs) {
    shedUntilMs = 0; setCompressorLoaded(true, "shed interval complete");
  }
  oledPrint(kva, projected, simFlueO2);
}

// ---------- Serial test commands ----------
static void handleSerial() {
  if (!Serial.available()) return;
  String cmd = Serial.readStringUntil('\n'); cmd.trim();
  if (cmd == "status") {
    Serial.printf("kVA proj=%.1f pressure=%.1f O2=%.1f draft=%.1f trim=%d sim=%d\n",
      projectedDemandKva(), simPressureBar, simFlueO2, simDraftPa, damperTrimDeg, SIMULATION_ONLY);
  } else if (cmd == "shed")   setCompressorLoaded(false, "serial test");
  else if (cmd == "load")     setCompressorLoaded(true, "serial test");
  else if (cmd.startsWith("trim ")) setDamperTrim_SIM(cmd.substring(5).toInt());
  else if (cmd == "help")     Serial.println("Commands: status | shed | load | trim <-15..15> | help");
  else if (cmd.length())      Serial.println("Unknown command — try: help");
}

void setup() {
  Serial.begin(115200);
  // Safe output init: everything de-energised / disabled at boot.
  pinMode(PIN_STEPPER_EN, OUTPUT);       digitalWrite(PIN_STEPPER_EN, HIGH); // disabled (active-low driver assumed — VERIFY on bench)
  pinMode(PIN_COMPRESSOR_RELAY, OUTPUT); digitalWrite(PIN_COMPRESSOR_RELAY, LOW);
  pinMode(PIN_WATCHDOG_HEARTBEAT, OUTPUT);
  windowStartMs = millis();
  Serial.println("EcoSidecar-360 Node 1 — SIMULATION ONLY — no live actuation");
}

void loop() {
  handleSerial();
  if (millis() - lastHeartbeatMs >= 800) { // 1.6 s watchdog period, toggled
    lastHeartbeatMs = millis();
    digitalWrite(PIN_WATCHDOG_HEARTBEAT, !digitalRead(PIN_WATCHDOG_HEARTBEAT));
  }
  if (millis() - lastTickMs >= 2000) { lastTickMs = millis(); updateThermalSim(); demandTick(); }
}
