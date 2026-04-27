import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

const NOMBRES = ['Delfo', 'Ponssa', 'Nacho', 'Alexis', 'Franco', 'Daza', 'Martin', 'Mati', 'Negro']
const PILLS = [
  { id: 'global', label: 'Global' },
  { id: 'asistencia', label: 'Asistencia' },
  { id: 'asador', label: '🥩 Asador' },
  { id: 'anfitrion', label: '🏠 Anfitrión' },
  { id: 'proveedor', label: '🛒 Proveedor' },
]

const s = {
  pills: { display: 'flex', gap: '5px', marginBottom: '1rem', flexWrap: 'wrap' },
  pill: (active) => ({
    padding: '5px 12px', fontSize: '12px',
    borderRadius: 'var(--radius-pill)',
    border: active ? 'none' : '0.5px solid var(--border-md)',
    background: active ? 'var(--brand)' : 'transparent',
    color: active ? 'white' : 'var(--text-2)',
    fontWeight: active ? '500' : '400',
    cursor: 'pointer', fontFamily: 'inherit',
  }),
  sectionLabel: { fontSize: '12px', color: 'var(--text-3)', marginBottom: '10px' },
  row: (isTop, isMe) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 12px',
    background: isTop ? 'var(--gold-bg)' : isMe ? 'var(--green-bg)' : 'var(--surface)',
    border: `0.5px solid ${isTop ? 'var(--gold-border)' : isMe ? 'var(--green-border)' : 'var(--border)'}`,
    borderRadius: 'var(--radius)',
    marginBottom: '5px',
  }),
  pos: (isTop, isMe) => ({
    fontSize: '13px', fontWeight: '500', width: '22px', flexShrink: 0,
    color: isTop ? 'var(--gold-text)' : isMe ? 'var(--green-text)' : 'var(--text-3)',
  }),
  badges: { fontSize: '13px', width: '36px', flexShrink: 0, letterSpacing: '-0.05em' },
  name: (isTop, isMe) => ({
    flex: 1, fontSize: '14px',
    color: isTop ? 'var(--gold-text)' : isMe ? 'var(--green-text)' : 'var(--text)',
    fontWeight: isTop || isMe ? '500' : '400',
  }),
  barWrap: { width: '60px', height: '5px', background: '#ece9e4', borderRadius: '3px', overflow: 'hidden' },
  bar: (isTop, isMe, pct) => ({
    height: '100%', borderRadius: '3px', width: `${pct}%`,
    background: isTop ? 'var(--gold)' : isMe ? 'var(--green)' : 'var(--brand)',
  }),
  count: (isTop, isMe) => ({
    fontSize: '14px', fontWeight: '500', width: '22px', textAlign: 'right',
    color: isTop ? 'var(--gold-text)' : isMe ? 'var(--green-text)' : 'var(--text)',
  }),
  loading: { textAlign: 'center', color: 'var(--text-3)', padding: '2rem', fontSize: '14px' },
  legend: { display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' },
  leg: { fontSize: '11px', color: 'var(--text-3)' },
}

export default function Ranking({ currentUser }) {
  const [active, setActive] = useState('global')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'asados'))
      const counts = {}
      NOMBRES.forEach(n => { counts[n] = { asistencia: 0, asador: 0, anfitrion: 0, proveedor: 0 } })

      snap.forEach(doc => {
        const d = doc.data()
        ;(d.asistentes || []).forEach(n => { if (counts[n]) counts[n].asistencia++ })
        if (d.asador && counts[d.asador]) counts[d.asador].asador++
        if (d.anfitrion && counts[d.anfitrion]) counts[d.anfitrion].anfitrion++
        ;(d.proveedores || []).forEach(n => { if (counts[n]) counts[n].proveedor++ })
      })
      setStats(counts)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={s.loading}>Cargando ranking...</div>

  const sorted = (key) => NOMBRES
    .map(n => ({ nombre: n, count: stats[n][key] }))
    .sort((a, b) => b.count - a.count)

  const leaders = {
    asador: sorted('asador')[0]?.nombre,
    anfitrion: sorted('anfitrion')[0]?.nombre,
    proveedor: sorted('proveedor')[0]?.nombre,
  }

  const maxFor = (key) => Math.max(...NOMBRES.map(n => stats[n][key]), 1)

  const RankList = ({ key2, label }) => {
    const list = sorted(key2)
    const maxVal = maxFor(key2)
    let pos = 0, lastCount = -1
    return (
      <>
        {label && <div style={s.sectionLabel}>{label}</div>}
        {list.map((item, i) => {
          if (item.count !== lastCount) { pos = i + 1; lastCount = item.count }
          const isTop = pos === 1 && item.count > 0
          const isMe = item.nombre === currentUser?.nombre
          return (
            <div key={item.nombre} style={s.row(isTop, isMe)}>
              <span style={s.pos(isTop, isMe)}>{isTop ? '👑' : pos}</span>
              <span style={s.name(isTop, isMe)}>{item.nombre}{isMe ? ' (yo)' : ''}</span>
              <div style={s.barWrap}><div style={s.bar(isTop, isMe, (item.count / maxVal) * 100)} /></div>
              <span style={s.count(isTop, isMe)}>{item.count}</span>
            </div>
          )
        })}
      </>
    )
  }

  const GlobalList = () => {
    const list = sorted('asistencia')
    const maxVal = maxFor('asistencia')
    let pos = 0, lastCount = -1
    return (
      <>
        <div style={s.legend}>
          <span style={s.leg}>👑 asistencia</span>
          <span style={s.leg}>🥩 asador</span>
          <span style={s.leg}>🏠 anfitrión</span>
          <span style={s.leg}>🛒 proveedor</span>
        </div>
        {list.map((item, i) => {
          if (item.count !== lastCount) { pos = i + 1; lastCount = item.count }
          const isTop = pos === 1 && item.count > 0
          const isMe = item.nombre === currentUser?.nombre
          const badges = [
            leaders.asador === item.nombre ? '🥩' : '',
            leaders.anfitrion === item.nombre ? '🏠' : '',
            leaders.proveedor === item.nombre ? '🛒' : '',
          ].join('')
          return (
            <div key={item.nombre} style={s.row(isTop, isMe)}>
              <span style={s.pos(isTop, isMe)}>{isTop ? '👑' : pos}</span>
              <span style={s.badges}>{badges}</span>
              <span style={s.name(isTop, isMe)}>{item.nombre}{isMe ? ' (yo)' : ''}</span>
              <div style={s.barWrap}><div style={s.bar(isTop, isMe, (item.count / maxVal) * 100)} /></div>
              <span style={s.count(isTop, isMe)}>{item.count}</span>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <div>
      <div style={s.pills}>
        {PILLS.map(p => (
          <button key={p.id} style={s.pill(active === p.id)} onClick={() => setActive(p.id)}>
            {p.label}
          </button>
        ))}
      </div>

      {active === 'global' && <GlobalList />}
      {active === 'asistencia' && <RankList key2="asistencia" label="Quién fue más veces" />}
      {active === 'asador' && <RankList key2="asador" label="🥩 Quién prendió el fuego" />}
      {active === 'anfitrion' && <RankList key2="anfitrion" label="🏠 Quién puso la casa" />}
      {active === 'proveedor' && <RankList key2="proveedor" label="🛒 Quién hizo las compras" />}
    </div>
  )
}
