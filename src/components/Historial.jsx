import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase'

const s = {
  row: {
    background: 'var(--surface)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '12px', marginBottom: '8px',
  },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' },
  date: { fontSize: '14px', fontWeight: '500', color: 'var(--text)' },
  place: { fontSize: '12px', color: 'var(--text-3)' },
  roles: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' },
  role: { fontSize: '12px', color: 'var(--text-2)' },
  roleName: { color: 'var(--text)', fontWeight: '500' },
  asist: { fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' },
  empty: { textAlign: 'center', color: 'var(--text-3)', padding: '2rem', fontSize: '14px' },
  creadoPor: { fontSize: '11px', color: 'var(--text-3)', marginTop: '4px', textAlign: 'right' },
}

function formatDate(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-')
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Historial() {
  const [asados, setAsados] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const q = query(collection(db, 'asados'), orderBy('fecha', 'desc'))
      const snap = await getDocs(q)
      setAsados(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={s.empty}>Cargando...</div>
  if (!asados.length) return <div style={s.empty}>Todavía no hay asados registrados 👀</div>

  return (
    <div>
      {asados.map(a => (
        <div key={a.id} style={s.row}>
          <div style={s.top}>
            <span style={s.date}>{formatDate(a.fecha)}</span>
            {a.lugar && <span style={s.place}>{a.lugar}</span>}
          </div>
          <div style={s.roles}>
            {a.asador && <span style={s.role}>🥩 <span style={s.roleName}>{a.asador}</span></span>}
            {a.anfitrion && <span style={s.role}>🏠 <span style={s.roleName}>{a.anfitrion}</span></span>}
            {a.proveedores?.length > 0 && (
              <span style={s.role}>🛒 <span style={s.roleName}>{a.proveedores.join(', ')}</span></span>
            )}
          </div>
          {a.asistentes?.length > 0 && (
            <div style={s.asist}>Fueron: {a.asistentes.join(', ')}</div>
          )}
          {a.creadoPor && (
            <div style={s.creadoPor}>Registrado por {a.creadoPor}</div>
          )}
        </div>
      ))}
    </div>
  )
}
