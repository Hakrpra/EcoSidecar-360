import { useState } from 'react'
import Sidebar from './components/Sidebar'
import { AssetsPage, EnergyPage, EventsPage, MotorsPage, Overview, SettingsPage } from './pages/Pages'

const titles = { overview: 'Overview', energy: 'Energy & Demand', motors: 'Motor Health', assets: 'Assets', events: 'Events', settings: 'Settings' }

export default function App() {
  const [page, setPage] = useState('overview')
  const pages = { overview: <Overview />, energy: <EnergyPage />, motors: <MotorsPage />, assets: <AssetsPage />, events: <EventsPage />, settings: <SettingsPage /> }
  return <div className="layout">
    <Sidebar page={page} setPage={setPage} />
    <main className="main">
      <div className="topbar">
        <div><h1 style={{ margin: 0, fontSize: 22 }}>{titles[page]}</h1>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>● Device: ECO360-NODE1 (simulated) &nbsp;|&nbsp; Factory: <b style={{ color: 'var(--text)' }}>Plant R1 — Pune</b></div></div>
        <span className="demo">⚠ DEMO MODE — SIMULATED DATA</span>
      </div>
      {pages[page]}
      <p style={{ color: 'var(--muted)', fontSize: 11, marginTop: 18 }}>EcoSidecar-360 · TRL 3 concept · All figures on this page are simulated/modelled, not field-measured. See README → Known Limitations.</p>
    </main>
  </div>
}
