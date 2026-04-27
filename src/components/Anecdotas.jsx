import { useEffect, useState } from 'react'
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase'

const s = {
  newCard: {
    background: 'var(--surface)', border: '0.5px dashed var(--border-md)',
    borderRadius: 'var(--radius)', padding: '12px', marginBottom: '1rem',
  },
  textarea: {
    width: '100%', background: 'transparent', border: 'none',
    fontSize: '14px', color: 'var(--text)', resize: 'none',
    fontFamily: 'inherit', outline: 'none', lineHeight: 1.6,
  },
  newBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' },
  hint: { fontSize: '12px', color: 'var(--text-3)' },
  pubBtn: {
    padding: '6px 14px', fontSize: '12px', background: 'var(--brand)',
    color: 'white', border: 'none', borderRadius: 'var(--radius-sm)',
    cursor: 'pointer', fontFamily: 'inherit', fontWeight: '500',
  },
  card: {
    background: 'var(--surface)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '12px', marginBottom: '8px',
  },
  meta: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  author: { fontSize: '12px', fontWeight: '500', color: 'var(--brand-dark)' },
  date: { fontSize: '12px', color: 'var(--text-3)' },
  text: { fontSize: '14px', color: 'var(--text)', lineHeight: 1.6 },
  empty: { textAlign: 'center', color: 'var(--text-3)', padding: '2rem', fontSize: '14px' },
}

function formatDate(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Anecdotas({ currentUser }) {
  const [texto, setTexto] = useState('')
  const [anecdotas, setAnecdotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  const load = async () => {
    const q = query(collection(db, 'anecdotas'), orderBy('creadoEn', 'desc'))
    const snap = await getDocs(q)
    setAnecdotas(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handlePost = async () => {
    if (!texto.trim()) return
    setPosting(true)
    await addDoc(collection(db, 'anecdotas'), {
      texto: texto.trim(),
      autor: currentUser?.nombre || 'Anónimo',
      creadoEn: new Date(),
    })
    setTexto('')
    await load()
    setPosting(false)
  }

  return (
    <div>
      <div style={s.newCard}>
        <textarea
          style={s.textarea}
          rows={3}
          placeholder="¿Qué pasó hoy? Contá la historia..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
        />
        <div style={s.newBottom}>
          <span style={s.hint}>{currentUser?.nombre || 'Invitado'}</span>
          <button style={s.pubBtn} onClick={handlePost} disabled={posting || !texto.trim()}>
            {posting ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={s.empty}>Cargando...</div>
      ) : anecdotas.length === 0 ? (
        <div style={s.empty}>Todavía no hay anécdotas. ¡Sé el primero!</div>
      ) : (
        anecdotas.map(a => (
          <div key={a.id} style={s.card}>
            <div style={s.meta}>
              <span style={s.author}>{a.autor}</span>
              <span style={s.date}>{formatDate(a.creadoEn)}</span>
            </div>
            <p style={s.text}>{a.texto}</p>
          </div>
        ))
      )}
    </div>
  )
}
