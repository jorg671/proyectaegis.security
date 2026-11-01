import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Software() {
  return (
    <>
      <Header variant="service" />
      <main>
        <section className="service-page">
          <span className="section-tag">AEGIS SECURITY</span>
          <h1>
            Software <span>Sentinel</span>
          </h1>
          <p className="service-subtitle">Revisión de software</p>

          <div className="service-description">
            <p>
              <strong>Software Sentinel</strong> está enfocado en analizar
              aplicaciones y sistemas para identificar vulnerabilidades,
              problemas de seguridad y configuraciones que puedan representar
              riesgos reales para tu entorno digital.
            </p>
            <p>
              No se trata solo de “revisar si el software funciona”. El objetivo
              es detectar debilidades, fallos de configuración, prácticas
              inseguras y puntos de exposición que podrían ser aprovechados por
              amenazas o generar incidentes de seguridad.
            </p>
            <p>
              El servicio busca darte una visión clara del estado de seguridad
              de tus aplicaciones y sistemas, junto con recomendaciones
              prácticas para mejorar su protección.
            </p>
          </div>

          <div className="service-details">
            <h2>¿Qué revisamos?</h2>
            <ul>
              <li>
                <strong>Aplicaciones y sistemas.</strong> Se revisan aplicaciones
                instaladas, servicios activos y el entorno en el que operan para
                detectar debilidades y puntos de exposición.
              </li>
              <li>
                <strong>Configuraciones de seguridad.</strong> Se identifican
                ajustes inseguros, permisos excesivos y prácticas que aumentan
                el riesgo de acceso no autorizado.
              </li>
              <li>
                <strong>Vulnerabilidades conocidas.</strong> Se buscan fallos
                conocidos, software desactualizado y componentes con exposiciones
                documentadas.
              </li>
              <li>
                <strong>Puntos de entrada y exposición.</strong> Se analizan
                interfaces, accesos remotos y canales que podrían ser
                aprovechados por amenazas.
              </li>
              <li>
                <strong>Recomendaciones de mejora.</strong> Se entregan acciones
                prioritarias para cerrar brechas, endurecer configuraciones y
                mejorar la postura de seguridad.
              </li>
            </ul>
          </div>

          <div className="service-price">
            <span>Precio</span>
            <strong>$120.000 COP</strong>
          </div>

          <Link to="/?servicio=software#contacto" className="btn">
            Empezar consulta
          </Link>
        </section>
      </main>
      <Footer compact />
    </>
  )
}
