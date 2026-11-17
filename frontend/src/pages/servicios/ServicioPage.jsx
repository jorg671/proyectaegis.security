import { Link, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { buscarServicio } from '../../data/servicios'

/**
 * Convierte "texto **importante** texto" en JSX con <strong>.
 * Al dividir por el patrón **...**, las posiciones impares son las negritas.
 */
const conNegrita = (texto) =>
  texto
    .split(/\*\*(.+?)\*\*/g)
    .map((parte, i) => (i % 2 ? <strong key={i}>{parte}</strong> : parte))

/**
 * Una sola página para TODOS los servicios (/servicios/hardware, /software, /dual).
 * Antes eran 3 archivos casi idénticos; ahora el diseño vive aquí una vez y el
 * contenido sale de data/servicios.js.
 */
export default function ServicioPage() {
  const { slug } = useParams()
  const servicio = buscarServicio(slug)

  // URL inventada, por ejemplo /servicios/xyz
  if (!servicio) {
    return (
      <>
        <Header variant="service" />
        <main>
          <section className="service-page">
            <h1>Servicio no encontrado</h1>
            <p className="service-subtitle">
              El servicio que buscas no existe o fue retirado.
            </p>
            <Link to="/#paquetes" className="btn">
              Ver servicios disponibles
            </Link>
          </section>
        </main>
        <Footer compact />
      </>
    )
  }

  return (
    <>
      <Header variant="service" />
      <main>
        <section className="service-page">
          <span className="section-tag">AEGIS SECURITY</span>
          <h1>
            {servicio.titulo} <span>{servicio.acento}</span>
          </h1>
          <p className="service-subtitle">{servicio.subtitulo}</p>

          <div className="service-description">
            {servicio.descripcion.map((parrafo, i) => (
              <p key={i}>{conNegrita(parrafo)}</p>
            ))}
          </div>

          <div className="service-details">
            <h2>{servicio.tituloDetalle}</h2>
            <ul>
              {servicio.detalles.map((detalle) => (
                <li key={detalle.titulo}>
                  <strong>{detalle.titulo}.</strong> {detalle.texto}
                </li>
              ))}
            </ul>
          </div>

          

          {/* El Home lee ?servicio= para preseleccionar el formulario */}
          <Link to={`/?servicio=${servicio.slug}#contacto`} className="btn">
            Empezar consulta
          </Link>
        </section>
      </main>
      <Footer compact />
    </>
  )
}
