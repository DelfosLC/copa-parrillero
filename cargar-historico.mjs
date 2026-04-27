import { initializeApp } from 'firebase/app'
import { getFirestore, addDoc, collection } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCwxR5pEIg4gjh2VAe4gUHIMpbmZvg-gQ8",
  authDomain: "copa-parrillero.firebaseapp.com",
  projectId: "copa-parrillero",
  storageBucket: "copa-parrillero.firebasestorage.app",
  messagingSenderId: "108525168842",
  appId: "1:108525168842:web:90e26c282b354e1026ec33"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Datos históricos — cada entrada es un asado "genérico" de asistencia
// Solo registramos asistencia, sin roles por ahora
const historico = [
  { nombre: 'Nacho',  cantidad: 12 },
  { nombre: 'Franco', cantidad: 8  },
  { nombre: 'Martin', cantidad: 7  },
  { nombre: 'Ponssa', cantidad: 7  },
  { nombre: 'Daza',   cantidad: 7  },
  { nombre: 'Alexis', cantidad: 6  },
  { nombre: 'Delfo',  cantidad: 6  },
  { nombre: 'Negro',  cantidad: 4  },
  { nombre: 'Mati',   cantidad: 3  },
]

async function cargar() {
  console.log('Cargando datos históricos...')
  let total = 0

  for (const persona of historico) {
    for (let i = 0; i < persona.cantidad; i++) {
      await addDoc(collection(db, 'asados'), {
        fecha: `2025-01-${String(i + 1).padStart(2, '0')}`,
        lugar: 'Histórico',
        asador: null,
        anfitrion: null,
        proveedores: [],
        asistentes: [persona.nombre],
        creadoPor: 'carga-inicial',
        creadoEn: new Date(),
        historico: true,
      })
      total++
      console.log(`  ✓ ${persona.nombre} (${i + 1}/${persona.cantidad})`)
    }
  }

  console.log(`\n✅ Listo! Se cargaron ${total} registros.`)
  process.exit(0)
}

cargar().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
