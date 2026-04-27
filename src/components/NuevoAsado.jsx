import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'

const NOMBRES = ['Delfo', 'Ponssa', 'Nacho', 'Alexis', 'Franco', 'Daza', 'Martin', 'Mati', 'Negro']

const s = {
  section: { marginBottom: '1.2rem' },
  sTitle: {
    fontSize: '13px', fontWeight: '500', color: 'var(--text)',
    marginBottom: '10px', paddingBottom: '7px',
    borderBottom: '0.5px solid var(--border)',
  },
  label: { fontSize: '12px', color: 'var(--text-2)', marginBottom: '5px', display: 'block' },
  input: {
    width: '100%', padding: '9px 12px', fontSize: '14px',
    border: '0.5px solid var(--border-md)', borderRadius: 'var(--radius-sm)',
    background: '#faf9f7', color: 'var(--text)', marginBottom: '10px',
    outline: 'none', fontFamily: 'inherit',
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' },
  chip: (sel) => ({
    padding: '5px 12px', fontSize: '12px',
    borderRadius: 'var(--radius-pill)',
    border: sel ? '1.5px solid var(--brand)' : '0.5px solid var(--border-md)',
    background: sel ? 'var(--brand-light)' : 'transparent',
    color: sel ? 'var(--brand-dark)' : 'var(--text-2)',
    fontWeight: sel ? '500' : '400',
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.12s',
  }),
  saveBtn: {
    width: '100%', padding: '12px', background: 'var(--brand)', color: 'white',
    border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '14px',
    fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px',
  },
  success: {
    textAlign: 'center', padding: '2rem', color: 'var(--brand)',
    fontSize: '16px', fontWeight: '500',
  },
  error: {
    fontSize: '13px', color: '#c0392b', background: '#fdecea',
    border: '0.5px solid #f5c6cb', borderRadius: 'var(--radius-sm)',
    padding: '8px 12px', marginBottom: '12px',
  },
  roleLabel: { fontSize: '12px', color: 'var(--text-2)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' },
}

function ChipGroup({ options, selected, onToggle, single = false }) {
  return (
    <div style={s.chips}>
      {options.map(n => {
        const sel = single ? selected === n : selected.includes(n)
        return (
          <button key={n} type="button" style={s.chip(sel)} onClick={() => onToggle(n)}>
            {n}
          </button>
        )
      })}
    </div>
  )
}

export default function NuevoAsado({ onSaved }) {
  const { profile } = useAuth()
  const today = new Date().toISOString().split('T')[0]

  const [fecha, setFecha] = useState(today)
  const [lugar, setLugar] = useState('')
  const [asador, setAsador] = useState('')
  const [anfitrion, setAnfitrion] = useState('')
  const [proveedores, setProveedores] = useState([])
  const [asistentes, setAsistentes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const toggleMulti = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!asistentes.length) { setError('Agregá al menos un asistente'); return }
    setLoading(true)
    try {
      await addDoc(collection(db, 'asados'), {
        fecha,
        lugar: lugar.trim() || null,
        asador: asador || null,
        anfitrion: anfitrion || null,
        proveedores,
        asistentes,
        creadoPor: profile?.nombre,
        creadoEn: new Date(),
      })
      setSaved(true)
      setTimeout(() => { setSaved(false); onSaved?.() }, 1500)
    } catch {
      setError('Error al guardar, intentá de nuevo')
    }
    setLoading(false)
  }

  if (saved) return <div style={s.success}>✅ Asado guardado!</div>

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={s.error}>{error}</div>}

      <div style={s.section}>
        <div style={s.sTitle}>Datos del asado</div>
        <label style={s.label}>Fecha</label>
        <input style={s.input} type="date" value={fecha} onChange={e => setFecha(e.target.value)} required />
        <label style={s.label}>Lugar (opcional)</label>
        <input style={s.input} type="text" value={lugar} onChange={e => setLugar(e.target.value)} placeholder="Casa de Ponssa, la quinta, nombre del invitado..." />
      </div>

      <div style={s.section}>
        <div style={s.sTitle}>Roles</div>

        <div style={s.roleLabel}>🥩 Asador</div>
        <ChipGroup options={NOMBRES} selected={asador} onToggle={v => setAsador(v === asador ? '' : v)} single />

        <div style={s.roleLabel}>🏠 Anfitrión</div>
        <ChipGroup options={NOMBRES} selected={anfitrion} onToggle={v => setAnfitrion(v === anfitrion ? '' : v)} single />

        <div style={s.roleLabel}>🛒 Proveedores <span style={{ color: 'var(--text-3)', fontWeight: '400' }}>(puede ser más de uno)</span></div>
        <ChipGroup options={NOMBRES} selected={proveedores} onToggle={v => toggleMulti(proveedores, setProveedores, v)} />

        <div style={s.roleLabel}>Quiénes fueron</div>
        <ChipGroup options={NOMBRES} selected={asistentes} onToggle={v => toggleMulti(asistentes, setAsistentes, v)} />
      </div>

      <button style={s.saveBtn} type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar asado'}
      </button>
    </form>
  )
}
