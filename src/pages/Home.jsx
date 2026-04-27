import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import Ranking from '../components/Ranking'
import NuevoAsado from '../components/NuevoAsado'
import Anecdotas from '../components/Anecdotas'
import Historial from '../components/Historial'

const TABS = [
  { id: 'ranking', label: 'Ranking' },
  { id: 'nuevo', label: '+ Asado' },
  { id: 'anecdotas', label: 'Anécdotas' },
  { id: 'historial', label: 'Historial' },
]

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)', paddingBottom: '2rem' },
  header: {
    background: 'var(--surface)',
    borderBottom: '0.5px solid var(--border)',
    padding: '0.8rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.4rem',
    letterSpacing: '0.03em',
    lineHeight: 1,
  },
  titleAccent: { color: 'var(--brand)' },
  userRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: {
    width: '28px', height: '28px', borderRadius: '50%',
    background: 'var(--brand-light)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: '500', color: 'var(--brand-dark)',
  },
  userName: { fontSize: '13px', color: 'var(--text-2)' },
  logoutBtn: {
    fontSize: '11px', color: 'var(--text-3)',
    border: '0.5px solid var(--border)', background: 'transparent',
    borderRadius: 'var(--radius-sm)', padding: '3px 8px',
    cursor: 'pointer', fontFamily: 'inherit',
  },
  nav: {
    display: 'flex',
    gap: '3px',
    background: '#ece9e4',
    borderRadius: 'var(--radius-sm)',
    padding: '3px',
    margin: '1rem',
  },
  navBtn: (active) => ({
    flex: 1,
    padding: '7px 4px',
    fontSize: '12px',
    fontWeight: active ? '500' : '400',
    border: active ? '0.5px solid var(--border)' : 'none',
    borderRadius: 'var(--radius-sm)',
    background: active ? 'white' : 'transparent',
    color: active ? 'var(--text)' : 'var(--text-2)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  }),
  content: { padding: '0 1rem' },
}

export default function Home() {
  const { profile } = useAuth()
  const [tab, setTab] = useState('ranking')

  const initials = profile?.nombre
    ? profile.nombre.slice(0, 2).toUpperCase()
    : '?'

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}>
          Copa del <span style={s.titleAccent}>Ascenso Parrillero</span> 🏆
        </div>
        <div style={s.userRow}>
          <div style={s.avatar}>{initials}</div>
          <span style={s.userName}>{profile?.nombre}</span>
          <button style={s.logoutBtn} onClick={() => signOut(auth)}>Salir</button>
        </div>
      </div>

      <div style={s.nav}>
        {TABS.map(t => (
          <button key={t.id} style={s.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {tab === 'ranking' && <Ranking currentUser={profile} />}
        {tab === 'nuevo' && <NuevoAsado onSaved={() => setTab('historial')} />}
        {tab === 'anecdotas' && <Anecdotas currentUser={profile} />}
        {tab === 'historial' && <Historial />}
      </div>
    </div>
  )
}
