import { useEffect, useState } from 'react'
// Tries the backend; falls back to demo data so the UI never looks broken offline.
export function useTelemetry(fallback) {
  const [data, setData] = useState(fallback)
  const [source, setSource] = useState('demo')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
    fetch(`${base}/api/telemetry/current`).then(r => { if (!r.ok) throw new Error('api') ; return r.json() })
      .then(j => { if (alive) { setData(j); setSource('backend-simulated') } })
      .catch(() => { if (alive) setSource('demo-offline') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])
  return { data, source, loading }
}
