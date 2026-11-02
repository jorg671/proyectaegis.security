import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const SERVICE_MAP = {
  hardware: 'Revisión de Hardware',
  software: 'Revisión de Software',
  dual: 'Dual Guard',
  capacitacion: 'Aprendizaje y Capacitación',
}

export default function Home() {
  const location = useLocation()
  const [servicio, setServicio] = useState('')
  const [cargando, setCargando] = useState(false)
  const [respuesta, setRespuesta] = useState('')
  const [tipoRespuesta, setTipoRespuesta] = useState('')

   useEffect(() => {
    const params = new URLSearchParams(location.search)
    const key = params.get('servicio')

    if (key && SERVICE_MAP[key]) {
      setServicio(SERVICE_MAP[key])
    }

    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50)
      }
    }
  }, [location])
  const enviarSolicitud = async (e) => {
    e.preventDefault()

    setCargando(true)
    setRespuesta('')
    setTipoRespuesta('')

    const formulario = e.target

    const datos = {
      nombre: formulario.nombre.value,
      email: formulario.email.value,
      servicio: servicio,
      mensaje: formulario.mensaje.value,
    }

    try {
      const response = await fetch('http://localhost:3000/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      })

      const resultado = await response.json()

      if (!response.ok) {
        throw new Error(resultado.mensaje || 'No se pudo enviar la solicitud')
      }

      setRespuesta(resultado.mensaje)
      setTipoRespuesta('exito')
      formulario.reset()
      setServicio('')

    } catch (error) {
      setRespuesta(error.message || 'Error al enviar la solicitud')
      setTipoRespuesta('error')

    } finally {
      setCargando(false)
    }
  }
  
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section id="inicio" className="hero">
          <div className="container hero-layout">
            <div className="hero-content">
              <p className="tag">PRUEBAS · ANÁLISIS · PROTECCIÓN</p>
              <h1>
                Protegemos lo que <span>hace funcionar</span> tu tecnología.
              </h1>
              <p className="hero-text">
                Aegis Security analiza software y hardware para detectar fallos,
                vulnerabilidades y riesgos, ayudando a mejorar la seguridad y el
                funcionamiento de tus sistemas.
              </p>
              <div className="hero-buttons">
                <a href="#paquetes" className="btn">
                  Ver servicios
                </a>
                <a href="#contacto" className="btn btn-outline">
                  Solicitar revisión
                </a>
              </div>
            </div>
            <div className="shield">
              <div className="shield-a">A</div>
              <div className="scan" />
            </div>
          </div>
        </section>

        {/* PAQUETES */}
        <section id="paquetes" className="section-wrapper packages-wrapper">
          <div className="section packages">
            <div className="container">
              <p className="section-tag">PAQUETES</p>
              <h2>Elige el tipo de revisión</h2>
              <p className="section-intro">
                No son niveles de calidad: cada paquete responde a una necesidad
                diferente.
              </p>
              <div className="package-grid">
                <article className="package-card">
                  <span className="package-number">01</span>
                  <h3>Hardware Guard</h3>
                  <p className="package-type">Revisión de hardware</p>
                  <p>
                    Para equipos donde la prioridad es revisar componentes
                    físicos, funcionamiento y posibles riesgos.
                  </p>
                  <Link to="/servicios/hardware" className="package-btn">
                    Solicitar revisión
                  </Link>
                </article>

                <article className="package-card">
                  <span className="package-number">02</span>
                  <h3>Software Sentinel</h3>
                  <p className="package-type">Revisión de software</p>
                  <p>
                    Para aplicaciones y sistemas donde se necesita identificar
                    vulnerabilidades y problemas de seguridad.
                  </p>
                  <Link to="/servicios/software" className="package-btn">
                    Solicitar revisión
                  </Link>
                </article>

                <article className="package-card featured">
                  <span className="recommended">ANÁLISIS INTEGRAL</span>
                  <span className="package-number">03</span>
                  <h3>Dual Guard</h3>
                  <p className="package-type">Hardware + Software</p>
                  <p>
                    Combina las dos revisiones en un solo servicio. Su precio
                    será menor que contratar Hardware Guard y Software Sentinel
                    por separado.
                  </p>
                  <Link to="/servicios/dual" className="package-btn">
                    Solicitar Dual Guard
                  </Link>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* CAPACITACIÓN */}
        <section id="capacitacion" className="training">
          <div className="container training-layout">
            <div className="training-content">
              <p className="section-tag">SERVICIO INDEPENDIENTE</p>
              <h2>
                Aprendizaje y <span>Capacitación</span>
              </h2>
              <p>
                Aprende conceptos y prácticas relacionadas con seguridad
                informática, análisis de sistemas e identificación de riesgos
                mediante orientación y formación práctica.
              </p>
              <div className="notice">
                <strong>Importante:</strong> Este servicio no está incluido en
                los paquetes de revisión. Se contrata por separado.
              </div>
              <a href="?servicio=capacitacion#contacto" className="btn">
                Consultar capacitación
              </a>
            </div>
            <div className="training-mark">
              A<span>+</span>
            </div>
          </div>
        </section>

        {/* NOSOTROS */}
        <section id="nosotros" className="section-wrapper about-wrapper">
          <div className="section about">
            <div className="container">
              <div className="about-text">
                <p className="section-tag">SOBRE AEGIS SECURITY</p>
                <h2>Analizar para proteger.</h2>
                <p>
                  Aegis Security nace como un proyecto orientado a la seguridad
                  y a las pruebas de software y hardware. No buscamos solo
                  encontrar fallos: explicamos los riesgos de forma clara y
                  proponemos recomendaciones prácticas para mejorar la
                  protección de tus sistemas.
                </p>
                <div className="values">
                  <div>
                    <strong>01</strong>
                    <span>Análisis</span>
                    <p>
                      Revisamos hardware y software para detectar fallos,
                      riesgos y puntos débiles.
                    </p>
                  </div>
                  <div>
                    <strong>02</strong>
                    <span>Prevención</span>
                    <p>
                      Identificamos problemas antes de que se conviertan en
                      incidentes reales.
                    </p>
                  </div>
                  <div>
                    <strong>03</strong>
                    <span>Protección</span>
                    <p>
                      Entregamos recomendaciones claras para reforzar la
                      seguridad de tus sistemas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="section-wrapper contact-wrapper">
          <div className="section contact">
            <div className="container">
              <p className="section-tag">CONTACTO</p>
              <h2>Solicita una revisión</h2>
              <p className="section-intro">
                Cuéntanos qué necesitas y nos pondremos en contacto contigo.
              </p>
              <form
                  className="contact-form"
                  onSubmit={enviarSolicitud}
              >
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  required
                />
                <select
                  name="servicio"
                  id="servicio"
                  required
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="Revisión de Hardware">
                    Revisión de Hardware
                  </option>
                  <option value="Revisión de Software">
                    Revisión de Software
                  </option>
                  <option value="Dual Guard">Dual Guard</option>
                  <option value="Aprendizaje y Capacitación">
                    Aprendizaje y Capacitación
                  </option>
                </select>
                <textarea
                  name="mensaje"
                  placeholder="Cuéntanos brevemente qué necesitas..."
                  required
                />
                <button type="submit" className="btn" disabled={cargando}>
                  {cargando ? 'Enviando...' : 'Enviar solicitud'}
                </button>
             
                {respuesta && (
                <p className={tipoRespuesta === 'exito' ? 'mensaje-exito' : 'mensaje-error'}>
                  {respuesta}
                </p>
                )}
             
               </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
