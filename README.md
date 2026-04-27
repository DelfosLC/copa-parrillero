# 🏆 Copa del Ascenso Parrillero

Seguimiento de asados del grupo. Rankings de asistencia, asador, anfitrión y proveedor.

## Setup inicial (solo la primera vez)

### 1. Clonar y abrir el proyecto
```bash
git clone https://github.com/TU_USUARIO/copa-parrillero.git
cd copa-parrillero
npm install
```

### 2. Configurar reglas de Firestore
1. Ir a [Firebase Console](https://console.firebase.google.com) → Bases de datos → Firestore
2. Click en la pestaña **"Reglas"**
3. Reemplazar todo el contenido con el contenido del archivo `firestore.rules`
4. Click **"Publicar"**

### 3. Probar localmente
```bash
npm run dev
```
Abrir http://localhost:5173/copa-parrillero/

## Deploy a GitHub Pages

### Primera vez
1. Crear un repo en GitHub llamado `copa-parrillero`
2. Subir el código:
```bash
git init
git add .
git commit -m "primer commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/copa-parrillero.git
git push -u origin main
```
3. En GitHub → Settings → Pages → Source: **GitHub Actions**
4. El deploy se hace automático con cada push a main

### URL final
`https://TU_USUARIO.github.io/copa-parrillero/`

## Estructura del proyecto
```
src/
  pages/
    Login.jsx       — pantalla de login y registro
    Home.jsx        — layout principal con navegación
  components/
    Ranking.jsx     — rankings global, asistencia, asador, anfitrión, proveedor
    NuevoAsado.jsx  — formulario para registrar un asado
    Anecdotas.jsx   — feed de anécdotas
    Historial.jsx   — listado de todos los asados
  lib/
    firebase.js     — configuración de Firebase
  hooks/
    useAuth.jsx     — contexto de autenticación
```

## Agregar datos iniciales (asados anteriores)
Podés cargar los asados históricos directamente desde la app usando el formulario "Nuevo asado", o manualmente desde la consola de Firestore en Firebase.
