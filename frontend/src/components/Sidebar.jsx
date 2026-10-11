export default function Sidebar({ page, setPage }) {
  const items = [
    ['overview', 'Overview', '◈'], ['energy', 'Energy & Demand', '⚡'],
    ['motors', 'Motor Health (MCSA)', '◎'], ['assets', 'Assets', '▦'],
    ['events', 'Events', '☰'], ['settings', 'Settings', '⚙'],
  ]
  return <aside className="sidebar">
    <div className="logo">Eco<span>Sidecar</span>-360</div>
    {items.map(([id, label, icon]) => (
      <button key={id} className={`navbtn ${page === id ? 'active' : ''}`} onClick={() => setPage(id)}>
        <span>{icon}</span><span className="txt">{label}</span>
      </button>
    ))}
    <p className="txt" style={{ color: 'var(--muted)', fontSize: 11, padding: '14px 10px' }}>
      Plant R1 · Pune MSME (demo)<br/>Node 1 Electrical · Node 2 Thermal<br/>TRL 3 — simulated
    </p>
  </aside>
}
