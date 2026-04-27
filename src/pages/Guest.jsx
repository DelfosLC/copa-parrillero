import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

const NOMBRES = ['Delfo', 'Ponssa', 'Nacho', 'Alexis', 'Franco', 'Daza', 'Martin', 'Mati', 'Negro']

const s = {
  page: { minHeight: '100vh', background: '#F7F5F2', paddingBottom: '2rem' },
  header: {
    textAlign: 'center', padding: '1.5rem 1rem 1rem',
    borderBottom: '0.5px solid rgba(0,0,0,0.1)',
    background: 'white', marginBottom: '1rem',
  },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.03em', lineHeight: 1.1 },
  accent: { color: '#D85A30' },
  subtitle: { fontSize: '11px', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '3px' },
  guestBadge: {
    display: 'inline-block', marginTop: '8px',
    padding: '3px 10px', fontSize: '11px',
    background: '#f0ede8', borderRadius: '20px', color: '#888',
  },
  loginBtn: {
    display: 'block', margin: '0.8rem auto 0',
    padding: '8px 20px', fontSize: '13px',
    background: '#D85A30', color: 'white',
    border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontFamily: 'inherit', fontWeight: '500',
  },
  content: { padding: '0 1rem', maxWidth: '480px', margin: '0 auto' },
  sectionLabel: { fontSize: '12px', color: '#999', marginBottom: '10px' },
  row: (isTop) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 12px',
    background: isTop ? '#FAEEDA' : 'white',
    border: `0.5px solid ${isTop ? '#FAC775' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '10px', marginBottom: '5px',
  }),
  pos: (isTop) => ({
    fontSize: '13px', fontWeight: '500', width: '22px', flexShrink: 0,
    color: isTop ? '#854F0B' : '#999',
  }),
  name: (isTop) => ({
    flex: 1, fontSize: '14px',
    color: isTop ? '#633806' : '#1a1a1a',
    fontWeight: isTop ? '500' : '400',
  }),
  barWrap: { width: '60px', height: '5px', background: '#ece9e4', borderRadius: '3px', overflow: 'hidden' },
  bar: (isTop, pct) => ({
    height: '100%', borderRadius: '3px', width: `${pct}%`,
    background: isTop ? '#EF9F27' : '#D85A30',
  }),
  count: (isTop) => ({
    fontSize: '14px', fontWeight: '500', width: '22px', textAlign: 'right',
    color: isTop ? '#633806' : '#1a1a1a',
  }),
  loading: { textAlign: 'center', color: '#999', padding: '2rem', fontSize: '14px' },
}

export default function Guest() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'asados'))
      const counts = {}
      NOMBRES.forEach(n => { counts[n] = 0 })
      snap.forEach(doc => {
        const d = doc.data()
        ;(d.asistentes || []).forEach(n => { if (counts[n] !== undefined) counts[n]++ })
      })
      setStats(counts)
    }
    load()
  }, [])

  const sorted = stats
    ? NOMBRES.map(n => ({ nombre: n, count: stats[n] })).sort((a, b) => b.count - a.count)
    : []

  const maxVal = Math.max(...sorted.map(s => s.count), 1)

  let pos = 0, lastCount = -1

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}>Copa del <span style={s.accent}>Ascenso Parrillero</span> 🏆</div>
        <div style={s.subtitle}>Temporada 2026</div>
        <div style={s.guestBadge}>Modo invitado — solo lectura</div>
        <button style={s.loginBtn} onClick={() => window.location.href = '/copa-parrillero/login'}>
          Iniciar sesión
        </button>
      </div>

      <div style={s.content}>
        <div style={s.sectionLabel}>Ranking de asistencia</div>
        {!stats ? (
          <div style={s.loading}>Cargando...</div>
        ) : (
          sorted.map((item, i) => {
            if (item.count !== lastCount) { pos = i + 1; lastCount = item.count }
            const isTop = pos === 1 && item.count > 0
            return (
              <div key={item.nombre} style={s.row(isTop)}>
                <span style={s.pos(isTop)}>{isTop ? '👑' : pos}</span>
                <span style={s.name(isTop)}>{item.nombre}</span>
                <div style={s.barWrap}><div style={s.bar(isTop, (item.count / maxVal) * 100)} /></div>
                <span style={s.count(isTop)}>{item.count}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
