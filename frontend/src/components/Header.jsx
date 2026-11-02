import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header({ variant = 'home' }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const close = () => setOpen(false)

  const navLink = (hash, label) => {
    if (isHome) {
      return (
        <a href={hash} onClick={close}>
          {label}
        </a>
      )
    }
    return (
      <Link to={`/${hash}`} onClick={close}>
        {label}
      </Link>
    )
  }

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo" onClick={close}>
          <span>A</span>EGIS <b>SECURITY</b>
        </Link>

        <button
          className="menu-btn"
          type="button"
          aria-label="Menú"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <ul className={`nav-menu${open ? ' active' : ''}`}>
          {variant === 'service' ? (
            <>
              <li>
                <Link to="/" onClick={close}>
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/#paquetes" onClick={close}>
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/#contacto" onClick={close}>
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="nav-admin" onClick={close}>
                  Admin
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>{navLink('#inicio', 'Inicio')}</li>
              <li>{navLink('#paquetes', 'Servicios')}</li>
              <li>{navLink('#capacitacion', 'Capacitación')}</li>
              <li>{navLink('#nosotros', 'Nosotros')}</li>
              <li>{navLink('#contacto', 'Contacto')}</li>
              <li>
                <Link to="/admin/login" className="nav-admin" onClick={close}>
                  Admin
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}