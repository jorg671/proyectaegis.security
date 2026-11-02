
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../firebase'

export default function Panel() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [solicitudes, setSolicitudes] = useState([])
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(true)
  const [errorSolicitudes, setErrorSolicitudes] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')

  // Cargar solicitudes desde el backend
  const cargarSolicitudes = async (usuario) => {
    try {
      setCargandoSolicitudes(true)
      setErrorSolicitudes('')

      const token = await usuario.getIdToken()

      const response = await fetch(
        'https://aegis-security-backend.onrender.com/api/admin/solicitudes',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const resultado = await response.json()

      if (!response.ok) {
        throw new Error(
          resultado.mensaje || 'No se pudieron cargar las solicitudes'
        )
      }

      setSolicitudes(resultado.solicitudes || [])
    } catch (error) {
      setErrorSolicitudes(error.message)
    } finally {
      setCargandoSolicitudes(false)
    }
  }

  // Comprobar sesión del administrador
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate('/admin/login', { replace: true })
      } else {
        setUser(u)
        cargarSolicitudes(u)
      }

      setChecking(false)
    })

    return unsub
  }, [navigate])

  // Contadores de solicitudes
  const totalSolicitudes = solicitudes.length

  const solicitudesPendientes = solicitudes.filter(
    (solicitud) => solicitud.estado === 'Pendiente'
  ).length

  const solicitudesEnRevision = solicitudes.filter(
    (solicitud) => solicitud.estado === 'En revisión'
  ).length

 

  const solicitudesFinalizadas = solicitudes.filter(
    (solicitud) => solicitud.estado === 'Finalizada'
  ).length

  // Filtrar solicitudes
  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    if (filtroEstado === 'Todos') return true
    return solicitud.estado === filtroEstado
  })

  // Actualizar estado de una solicitud
  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const token = await user.getIdToken()

      const response = await fetch(
        `https://aegis-security-backend.onrender.com/api/admin/solicitudes/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      )

      const resultado = await response.json()

      if (!response.ok) {
        throw new Error(
          resultado.mensaje || 'No se pudo actualizar el estado'
        )
      }

      setSolicitudes((anteriores) =>
        anteriores.map((solicitud) =>
          solicitud.id === id
            ? { ...solicitud, estado: nuevoEstado }
            : solicitud
        )
      )
    } catch (error) {
      alert(error.message)
    }
  }

  // Cerrar sesión
  const handleLogout = async () => {
    await signOut(auth)
    navigate('/admin/login', { replace: true })
  }

  if (checking) {
    return (
      <div className="admin-panel-page">
        <p style={{ padding: 40, color: '#8fa2b7' }}>
          Cargando…
        </p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="admin-panel-page">

      {/* ENCABEZADO */}
      <header className="admin-header">
        <div className="logo">
          <span>A</span>EGIS Admin
        </div>

        <div className="header-right">
          <span className="user-email">{user.email}</span>

          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="admin-main">

        <h1>Panel de administración</h1>
        <p className="subtitle">
          Bienvenido al panel de Aegis Security
        </p>

        {/* TARJETAS GENERALES */}
        <div className="cards">

          <div className="card">
            <h3>SERVICIOS</h3>
            <p className="card-value">3</p>
            <span>Hardware · Software · Dual</span>
          </div>

          <div className="card">
            <h3>ESTADO</h3>
            <p
              className="card-value"
              style={{ color: '#00d4ff' }}
            >
              Activo
            </p>
            <span>Sitio en funcionamiento</span>
          </div>

          <div className="card">
            <h3>IA</h3>
            <p className="card-value">Chatbase</p>
            <span>Asistente entrenado</span>
          </div>

        </div>

        {/* SOLICITUDES */}
        <h2 className="section-title">
          Solicitudes de contacto
        </h2>

        {/* CONTADORES */}
        <div className="request-stats">

          <div className="request-stat">
            <span>Total de solicitudes</span>
            <h3>{totalSolicitudes}</h3>
          </div>

          <div className="request-stat pending">
            <span>Pendientes</span>
            <h3>{solicitudesPendientes}</h3>
          </div>

          <div className="request-stat reviewing">
            <span>En revisión</span>
            <h3>{solicitudesEnRevision}</h3>
          </div>

          <div className="request-stat finished">
            <span>Finalizadas</span>
            <h3>{solicitudesFinalizadas}</h3>
          </div>

        </div>

        {/* FILTRO */}
        <div className="filter-container">
          <label htmlFor="filtroEstado">
            Filtrar solicitudes:
          </label>

          <select
            id="filtroEstado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="Todos">Todas las solicitudes</option>
            <option value="Pendiente">Pendientes</option>
            <option value="En revisión">En revisión</option>
            <option value="Aprobada">Aprobadas</option>
            <option value="Finalizada">Finalizadas</option>
          </select>
        </div>

        {/* TABLA */}
        <div className="requests-container">

          {cargandoSolicitudes ? (
            <p>Cargando solicitudes...</p>

          ) : errorSolicitudes ? (
            <p className="mensaje-error">
              {errorSolicitudes}
            </p>

          ) : solicitudes.length === 0 ? (
            <p>No hay solicitudes registradas.</p>

          ) : solicitudesFiltradas.length === 0 ? (
            <p>No hay solicitudes con ese estado.</p>

          ) : (

            <div className="requests-table-container">
              <table className="requests-table">

                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Servicio</th>
                    <th>Mensaje</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {solicitudesFiltradas.map((solicitud) => (
                    <tr key={solicitud.id}>

                      <td>{solicitud.nombre}</td>
                      <td>{solicitud.correo}</td>
                      <td>{solicitud.servicio}</td>
                      <td>{solicitud.mensaje}</td>

                      <td>
                        <select
                          value={solicitud.estado || 'Pendiente'}
                          onChange={(e) =>
                            actualizarEstado(
                              solicitud.id,
                              e.target.value
                            )
                          }
                          className={`estado-select estado-${(
                            solicitud.estado || 'Pendiente'
                          )
                            .toLowerCase()
                            .replace(/\s+/g, '-')}`}
                        >
                          <option value="Pendiente">
                            Pendiente
                          </option>
                          <option value="En revisión">
                            En revisión
                          </option>
                          <option value="Aprobada">
                            Aprobada
                          </option>
                          <option value="Finalizada">
                            Finalizada
                          </option>
                        </select>
                      </td>

                      <td>
                        {solicitud.fecha_creacion
                          ? new Date(
                              solicitud.fecha_creacion
                            ).toLocaleDateString('es-CO')
                          : 'Sin fecha'}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

        {/* GESTIÓN */}
        <h2 className="section-title">Gestión</h2>

        <div className="links">
          <a
            href="https://www.chatbase.co/dashboard"
            target="_blank"
            rel="noreferrer"
          >
            Actualizar IA (Chatbase)
          </a>
        </div>

        {/* ACCESOS RÁPIDOS */}
        <h2 className="section-title">
          Accesos rápidos del sitio
        </h2>

        <div className="links">
          <Link to="/" target="_blank">
            Ver sitio web
          </Link>

          <Link to="/#contacto" target="_blank">
            Formulario de contacto
          </Link>

          <Link to="/servicios/hardware" target="_blank">
            Hardware Guard
          </Link>

          <Link to="/servicios/software" target="_blank">
            Software Sentinel
          </Link>

          <Link to="/servicios/dual" target="_blank">
            Dual Guard
          </Link>
        </div>

      </main>
    </div>
  )
}
