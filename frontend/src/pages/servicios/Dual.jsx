import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Dual() {
  return (
    <>
      <Header variant="service" />
      <main>
        <section className="service-page">
          <span className="section-tag">AEGIS SECURITY</span>
          <h1>
            Dual <span>Guard</span>
          </h1>
          <p className="service-subtitle">Hardware + Software</p>

          <div className="service-description">
            <p>
              <strong>Dual Guard</strong> combina la revisión de hardware y
              software en un solo servicio. En lugar de analizar cada capa por
              separado, este servicio integra ambas perspectivas: el estado
              físico de los equipos y el análisis de aplicaciones y sistemas.
              Así se detectan riesgos que muchas veces solo aparecen cuando
              hardware y software se revisan juntos.
            </p>
            <p>
              El objetivo es darte una visión global del sistema, identificar
              debilidades en ambas capas y entregarte recomendaciones claras
              para reforzar la seguridad de forma coordinada.
            </p>
          </div>

          <div className="service-details">
            <h2>¿Qué incluye?</h2>
            <ul>
              <li>
                <strong>Revisión de componentes físicos.</strong> Se inspecciona
                el estado del hardware: placas, memorias, discos, fuentes,
                puertos y conectores, buscando daños, desgaste,
                sobrecalentamiento o condiciones que afecten la seguridad y el
                funcionamiento.
              </li>
              <li>
                <strong>Revisión de software y aplicaciones.</strong> Se
                analizan aplicaciones, sistemas y su entorno para detectar
                debilidades, configuraciones inseguras y puntos de exposición
                en la capa lógica.
              </li>
              <li>
                <strong>Identificación de posibles riesgos.</strong> Se evalúan
                escenarios de riesgo que involucran tanto el hardware como el
                software, incluyendo accesos no controlados, fallos combinados y
                condiciones de exposición.
              </li>
              <li>
                <strong>Detección de posibles vulnerabilidades.</strong> Se
                buscan vulnerabilidades conocidas, fallos de configuración y
                debilidades que puedan facilitar incidentes de seguridad en
                cualquiera de las dos capas.
              </li>
              <li>
                <strong>Recomendaciones de seguridad.</strong> Se entregan
                acciones concretas y priorizadas para corregir, reforzar y
                mejorar la protección del sistema de forma integral.
              </li>
              <li>
                <strong>Informe general de la revisión.</strong> Recibes un
                resumen claro del estado del hardware y del software, los
                hallazgos principales y las recomendaciones para mejorar la
                seguridad del sistema.
              </li>
            </ul>
          </div>

          <div className="service-price">
            <span>Análisis integral</span>
            <strong>Precio menor que por separado</strong>
          </div>

          <Link to="/?servicio=dual#contacto" className="btn">
            Empezar consulta
          </Link>
        </section>
      </main>
      <Footer compact />
    </>
  )
}
