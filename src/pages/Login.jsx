import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const NOMBRES = ['Delfo', 'Ponssa', 'Nacho', 'Alexis', 'Franco', 'Daza', 'Martin', 'Mati', 'Negro']

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2.8rem',
    letterSpacing: '0.03em',
    color: 'var(--text)',
    lineHeight: 1.1,
  },
  titleAccent: { color: 'var(--brand)' },
  subtitle: { fontSize: '12px', color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' },
  card: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '0.5px solid var(--border)',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '380px',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    background: '#f0ede8',
    borderRadius: 'var(--radius-sm)',
    padding: '3px',
    marginBottom: '1.5rem',
  },
  tab: (active) => ({
    flex: 1,
    padding: '7px',
    fontSize: '13px',
    fontWeight: active ? '500' : '400',
    border: active ? '0.5px solid var(--border)' : 'none',
    borderRadius: 'var(--radius-sm)',
    background: active ? 'white' : 'transparent',
    color: active ? 'var(--text)' : 'var(--text-2)',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }),
  label: { fontSize: '12px', color: 'var(--text-2)', marginBottom: '6px', display: 'block' },
  input: {
    width: '100%',
    padding: '9px 12px',
    fontSize: '14px',
    border: '0.5px solid var(--border-md)',
    borderRadius: 'var(--radius-sm)',
    background: '#faf9f7',
    color: 'var(--text)',
    marginBottom: '12px',
    outline: 'none',
  },
  nameGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
    marginBottom: '14px',
  },
  nameBtn: (selected) => ({
    padding: '8px 4px',
    fontSize: '13px',
    fontWeight: selected ? '500' : '400',
    border: selected ? '1.5px solid var(--brand)' : '0.5px solid var(--border-md)',
    borderRadius: 'var(--radius-sm)',
    background: selected ? 'var(--brand-light)' : 'transparent',
    color: selected ? 'var(--brand-dark)' : 'var(--text-2)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  }),
  btn: {
    width: '100%',
    padding: '11px',
    background: 'var(--brand)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '4px',
  },
  error: {
    fontSize: '13px',
    color: '#c0392b',
    background: '#fdecea',
    border: '0.5px solid #f5c6cb',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 12px',
    marginBottom: '12px',
  },
  guestBtn: {
    marginTop: '1rem',
    fontSize: '13px',
    color: 'var(--text-3)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  }
}

export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError('Email o contraseña incorrectos')
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!selectedName) { setError('Elegí tu nombre del grupo'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      // Check if name is taken
      const nameCheck = await getDoc(doc(db, 'nombres_tomados', selectedName))
      if (nameCheck.exists()) { setError(`${selectedName} ya tiene cuenta`); setLoading(false); return }

      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        nombre: selectedName,
        uid: cred.user.uid,
        createdAt: new Date(),
      })
      await setDoc(doc(db, 'nombres_tomados', selectedName), { uid: cred.user.uid })
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('Ese email ya está registrado')
      else setError('Error al registrarse, intentá de nuevo')
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}>
          Copa del<br /><span style={s.titleAccent}>Ascenso Parrillero</span>
        </div>
        <div style={s.subtitle}>Temporada 2026</div>
      </div>

      <div style={s.card}>
        <div style={s.tabs}>
          <button style={s.tab(tab === 'login')} onClick={() => { setTab('login'); setError('') }}>Entrar</button>
          <button style={s.tab(tab === 'register')} onClick={() => { setTab('register'); setError('') }}>Registrarse</button>
        </div>

        {error && <div style={s.error}>{error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
            <label style={s.label}>Contraseña</label>
            <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required />
            <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <label style={s.label}>¿Quién sos?</label>
            <div style={s.nameGrid}>
              {NOMBRES.map(n => (
                <button key={n} type="button" style={s.nameBtn(selectedName === n)} onClick={() => setSelectedName(n)}>{n}</button>
              ))}
            </div>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
            <label style={s.label}>Contraseña</label>
            <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required />
            <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</button>
          </form>
        )}
      </div>

      <button style={s.guestBtn} onClick={() => navigate('/guest')}>
        Ver ranking como invitado
      </button>
    </div>
  )
}
