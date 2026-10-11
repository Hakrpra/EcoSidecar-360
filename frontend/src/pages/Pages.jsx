import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { assets, demandHistory, events, kpis, loadComposition, mcsaSpectrum, solarGrid } from '../data/demoData'
import KpiCard from '../components/KpiCard'

const box = { background: '#0b1220', border: '1px solid #22314d', borderRadius: 8, fontSize: 12 }

export function Overview() {
  const [range, setRange] = useState('24h')
  const data = range === '24h' ? demandHistory : demandHistory.filter((_, i) => i % 2 === 0)
  return <>
    <div className="grid">
      {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      <div className="card span8"><div className="label">Apparent Power vs Time-of-Use Tariff — DEMO</div>
        <div style={{ margin: '10px 0' }}><select value={range} onChange={e => setRange(e.target.value)} aria-label="Time range">
          <option value="24h">Last 24 hours</option><option value="12h">Sampled (every 2h)</option></select></div>
        <ResponsiveContainer width="100%" height={260}><AreaChart data={data}>
          <CartesianGrid stroke="#22314d" /><XAxis dataKey="time" stroke="#8ea0b8" fontSize={11} /><YAxis stroke="#8ea0b8" fontSize={11} />
          <Tooltip contentStyle={box} /><Area dataKey="kva" name="kVA" stroke="#4ee09a" fill="#4ee09a33" /><Area dataKey="tariff" name="Tariff ₹/kWh" stroke="#22d3ee" fill="#22d3ee22" />
        </AreaChart></ResponsiveContainer></div>
      <div className="card span4"><div className="label">Load Composition</div>
        <ResponsiveContainer width="100%" height={260}><PieChart>
          <Pie data={loadComposition} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={3}>
            {loadComposition.map(d => <Cell key={d.name} fill={d.color} />)}</Pie><Tooltip contentStyle={box} /></PieChart></ResponsiveContainer>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{loadComposition.map(d => <div key={d.name}>{d.name} — {d.value}%</div>)}</div></div>
      <div className="card span6"><div className="label">MCSA Spectrum — Main Motor (simulated)</div>
        <ResponsiveContainer width="100%" height={220}><BarChart data={mcsaSpectrum}><CartesianGrid stroke="#22314d" />
          <XAxis dataKey="freq" stroke="#8ea0b8" fontSize={11} label={{ value: 'Hz', fill: '#8ea0b8' }} /><YAxis stroke="#8ea0b8" fontSize={11} />
          <Tooltip contentStyle={box} /><Bar dataKey="amp" name="Amplitude" fill="#22d3ee" /></BarChart></ResponsiveContainer>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>50 Hz fundamental with sidebands at ~46/54 Hz in demo data. A real diagnosis needs a real 8 kHz capture — see docs/safety-limitations.md.</p></div>
      <div className="card span6"><div className="label">Solar · Consumption · Grid Import</div>
        <ResponsiveContainer width="100%" height={220}><LineChart data={solarGrid}><CartesianGrid stroke="#22314d" />
          <XAxis dataKey="time" stroke="#8ea0b8" fontSize={11} /><YAxis stroke="#8ea0b8" fontSize={11} /><Tooltip contentStyle={box} />
          <Line dataKey="solar" stroke="#fbbf24" dot={false} /><Line dataKey="consumption" stroke="#4ee09a" dot={false} /><Line dataKey="grid" stroke="#22d3ee" dot={false} />
        </LineChart></ResponsiveContainer></div>
      <div className="card span4"><div className="label">Virtual Storage (modelled)</div>
        <p style={{ fontSize: 28, fontWeight: 800 }}>18.4 <span style={{ fontSize: 13, color: 'var(--muted)' }}>kWh shiftable</span></p>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Deferrable loads (compressor receiver + thermal mass) treated as virtual storage. This is a scheduling model, not a battery.</p>
        <p><b>Est. bill reduction:</b> ₹4,120/mo modelled<br/><span style={{ color: 'var(--muted)', fontSize: 12 }}>Baseline 11,140 kWh/mo · ToU shifting + PF watch. Not measured.</span></p></div>
      <div className="card span8"><div className="label">Active Industrial Assets</div><AssetsTable /></div>
      <div className="card span12"><div className="label">Real-time Event Feed (demo)</div><EventFeed /></div>
    </div></>
}
export function AssetsTable() {
  if (!assets.length) return <p>No assets — empty state.</p>
  return <table><thead><tr><th>Asset</th><th>Type</th><th>Status</th><th>Load</th><th>Health</th></tr></thead>
    <tbody>{assets.map(a => <tr key={a.id}><td>{a.name}</td><td>{a.type}</td><td><span className={`dot ${a.status.includes('Warning') || a.status.includes('Monitor') ? 'warn' : ''}`} />{a.status}</td><td>{a.loadPct}%</td><td>{a.health}/100</td></tr>)}</tbody></table>
}
export function EventFeed() {
  return <div className="feed">{events.map((e, i) => <div key={i}><b style={{ color: 'var(--muted)' }}>{e.time}</b> &nbsp;{e.text}</div>)}</div>
}
export function EnergyPage() { return <div className="grid"><div className="card span12"><div className="label">Energy & Demand</div>
  <p>Demand history, tariff bands, and the 15-minute window logic are on Overview. Contract: <b>75 kVA</b> · Trigger at 92% (69 kVA in firmware model).</p>
  <ResponsiveContainer width="100%" height={300}><BarChart data={demandHistory}><CartesianGrid stroke="#22314d" /><XAxis dataKey="time" stroke="#8ea0b8" fontSize={11} /><YAxis stroke="#8ea0b8" fontSize={11} /><Tooltip contentStyle={box} /><Bar dataKey="kw" name="kW" fill="#4ee09a" /></BarChart></ResponsiveContainer></div></div> }
export function MotorsPage() { return <div className="grid"><div className="card span12"><div className="label">Motor Health — MCSA</div>
  <p style={{ color: 'var(--muted)' }}>Simulated spectrum only. Health indicator logic lives in <code>src/services/calculations.js → motorHealthIndicator()</code> and is unit-tested.</p>
  <ResponsiveContainer width="100%" height={300}><BarChart data={mcsaSpectrum}><CartesianGrid stroke="#22314d" /><XAxis dataKey="freq" stroke="#8ea0b8" fontSize={11} /><YAxis stroke="#8ea0b8" fontSize={11} /><Tooltip contentStyle={box} /><Bar dataKey="amp" fill="#818cf8" /></BarChart></ResponsiveContainer></div></div> }
export function AssetsPage() { return <div className="grid"><div className="card span12"><div className="label">All Assets</div><AssetsTable /></div></div> }
export function EventsPage() { return <div className="grid"><div className="card span12"><div className="label">Events & Alerts</div><EventFeed /></div></div> }
export function SettingsPage() { return <div className="grid"><div className="card span12"><div className="label">Settings</div>
  <p>Demo mode: <b>ON</b> (always labelled). Backend URL: <code>{import.meta.env.VITE_API_BASE || 'http://localhost:8000'}</code></p>
  <p style={{ color: 'var(--muted)', fontSize: 13 }}>To use live data later: set <code>VITE_DEMO_MODE=false</code>, point the ESP32 to the backend <code>POST /api/telemetry</code> (see docs/telemetry-protocol.md), and remove the DEMO banner only when real sensors are connected.</p></div></div> }
