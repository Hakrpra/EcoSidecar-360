export default function KpiCard({ label, value, unit, sub }) {
  return <div className="card kpi"><div className="label">{label}</div>
    <div className="v">{value} <span className="u">{unit}</span></div>
    <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6 }}>{sub}</div></div>
}
