import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../firebase'

export default function Panel() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

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
            <p className="card-value">3</p>
            <span>Hardware · Software · Dual</span>
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
            <p className="card-value">Chatbase</p>
            <span>Asistente entrenado</span>
          </div>
        </div>

        <h2 className="section-title">Gestión</h2>
        <div className="links">
          {/* Solicitudes del formulario de contacto (Formspree) */}
          <a
            href="https://formspree.io/forms/xjykjrwo/submissions"
            target="_blank"
            rel="noreferrer"
          >
            Ver solicitudes de contacto
          </a>

          {/* Panel de Chatbase para entrenar / actualizar la IA */}
          <a
            href="https://www.chatbase.co/dashboard"
            target="_blank"
            rel="noreferrer"
          >
            Actualizar IA (Chatbase)
          </a>
        </div>

        <h2 className="section-title">Accesos rápidos del sitio</h2>
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