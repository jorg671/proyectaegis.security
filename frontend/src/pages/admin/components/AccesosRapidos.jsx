import { Link } from 'react-router-dom'
import { servicios } from '../../../data/servicios'

// Enlaces al sitio público; los de servicios salen del catálogo
export default function AccesosRapidos() {
  return (
    <div className="links">
      <Link to="/" target="_blank">
        Ver sitio web
      </Link>

      <Link to="/#contacto" target="_blank">
        Formulario de contacto
      </Link>

      {servicios.map((servicio) => (
        <Link
          key={servicio.slug}
          to={`/servicios/${servicio.slug}`}
          target="_blank"
        >
          {servicio.titulo} {servicio.acento}
        </Link>
      ))}
    </div>
  )
}
