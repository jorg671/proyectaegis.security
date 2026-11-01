import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Hardware() {
  return (
    <>
      <Header variant="service" />
      <main>
        <section className="service-page">
          <span className="section-tag">AEGIS SECURITY</span>
          <h1>
            Hardware <span>Guard</span>
          </h1>
          <p className="service-subtitle">Revisión de hardware</p>

          <div className="service-description">
            <p>
              <strong>Hardware Guard</strong> es un servicio especializado en la
              revisión física de equipos y componentes, diseñado para detectar
              fallos, riesgos de seguridad y puntos débiles que normalmente
              pasan desapercibidos en el uso diario.
            </p>
            <p>
              A diferencia de un simple diagnóstico técnico, este servicio
              analiza el hardware desde una perspectiva de seguridad: no solo
              busca si el equipo “funciona”, sino si está expuesto a riesgos, si
              sus componentes presentan signos de deterioro, manipulación o
              configuraciones inseguras, y qué acciones se pueden tomar para
              reforzar su protección.
            </p>
            <p>
              El objetivo es simple:{' '}
              <strong>
                encontrar problemas antes de que se conviertan en incidentes
              </strong>
              .
            </p>
          </div>

          <div className="service-details">
            <h2>¿Qué revisamos?</h2>
            <ul>
              <li>
                <strong>Componentes físicos del equipo.</strong> Se inspecciona
                el estado de placas, memorias, discos, fuentes de poder, puertos
                y conectores. Se busca desgaste, daños, sobrecalentamiento o
                conexiones deficientes.
              </li>
              <li>
                <strong>Estado y funcionamiento general.</strong> Se evalúa
                estabilidad, respuesta, fallos intermitentes, ruidos anormales o
                temperaturas elevadas que indiquen un problema en desarrollo.
              </li>
              <li>
                <strong>Posibles riesgos de seguridad.</strong> Se identifican
                escenarios donde el hardware puede ser un punto de entrada:
                puertos abiertos, componentes accesibles o falta de protección
                física.
              </li>
              <li>
                <strong>Configuraciones de protección.</strong> Se revisan
                opciones de arranque, bloqueos, controles de acceso físico,
                firmware y parámetros que influyen en la exposición del equipo.
              </li>
              <li>
                <strong>Recomendaciones de mejora.</strong> Se entregan acciones
                concretas: qué corregir, qué reforzar, qué reemplazar y qué
                prácticas adoptar para reducir riesgos.
              </li>
            </ul>
          </div>

          <div className="service-price">
            <span>Precio</span>
            <strong>$80.000 COP</strong>
          </div>

          <Link to="/?servicio=hardware#contacto" className="btn">
            Empezar consulta
          </Link>
        </section>
      </main>
      <Footer compact />
    </>
  )
}
