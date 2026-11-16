import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { servicios } from '../../data/servicios'
import { ESTADO_INICIAL } from '../../constants/estados'
import { useSolicitudes } from '../../hooks/useSolicitudes'
import EstadisticasSolicitudes from './components/EstadisticasSolicitudes'
import FiltroEstado from './components/FiltroEstado'
import ListaSolicitudes from './components/ListaSolicitudes'
import AccesosRapidos from './components/AccesosRapidos'

/**
 * Panel de administración (ruta protegida).
 * Este archivo solo coordina: comprueba la sesión y arma la pantalla con
 * piezas pequeñas. La lógica de datos vive en hooks/useSolicitudes.js.
 */
export default function Panel() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('Todos')

  const { solicitudes, cargando, error, errorAccion, cambiarEstado } =
    useSolicitudes(user)

  // Si no hay sesión de Firebase, se manda al login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate('/admin/login', { replace: true })
      } else {
        setUser(u)
      }
      setChecking(false)
    })

    return unsub
  }, [navigate])

  const solicitudesFiltradas = solicitudes.filter(
    (s) =>
      filtroEstado === 'Todos' || (s.estado || ESTADO_INICIAL) === filtroEstado
  )

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/admin/login', { replace: true })
  }

  if (checking) {
    return (
      <div className="admin-panel-page">
        <p style={{ padding: 40, color: '#8fa2b7' }}>Cargando…</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="admin-panel-page">
      <header className="admin-header">
        <div className="logo">
          <span>A</span>EGIS Admin
        </div>

        <div className="header-right">
          <span className="user-email">{user.email}</span>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="admin-main">
        <h1>Panel de administración</h1>
        <p className="subtitle">Bienvenido al panel de Aegis Security</p>

        <div className="cards">
          <div className="card">
            <h3>SERVICIOS</h3>
            <p className="card-value">{servicios.length}</p>
            <span>{servicios.map((s) => s.titulo).join(' · ')}</span>
          </div>

          <div className="card">
            <h3>ESTADO</h3>
            <p className="card-value" style={{ color: '#00d4ff' }}>
              Activo
            </p>
            <span>Sitio en funcionamiento</span>
          </div>

          <div className="card">
            <h3>IA</h3>
            <p className="card-value">Groq</p>
            <span>Asistente propio + recomendador</span>
          </div>
        </div>

        <h2 className="section-title">Solicitudes de contacto</h2>

        <EstadisticasSolicitudes solicitudes={solicitudes} />

        <FiltroEstado valor={filtroEstado} onChange={setFiltroEstado} />

        <ListaSolicitudes
          solicitudes={solicitudesFiltradas}
          total={solicitudes.length}
          cargando={cargando}
          error={error}
          errorAccion={errorAccion}
          onCambiarEstado={cambiarEstado}
        />

        <h2 className="section-title">Accesos rápidos del sitio</h2>
        <AccesosRapidos />
      </main>
    </div>
  )
}
