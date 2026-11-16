import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { enviarMensajeChat, pedirRecomendacion } from '../services/iaApi'
import { servicios } from '../data/servicios'

/**
 * Asistente de IA de Aegis Security: burbuja flotante con dos funciones.
 *  1. Chat: responde dudas sobre servicios y precios (POST /api/ia/chat).
 *  2. Recomendador: el visitante cuenta su caso y la IA sugiere un servicio y
 *     redacta el mensaje, que se pasa al formulario de contacto.
 *
 * Toda la inteligencia (catálogo, tono, reglas) vive en el backend; aquí solo
 * hay interfaz y estado de la conversación.
 */

const MAX_CARACTERES_CHAT = 500
const MAX_CARACTERES_CASO = 1000
const MAX_HISTORIAL = 10 // el backend también lo limita; así no enviamos de más
const MS_AVISO_LENTO = 8000 // pasado este tiempo, avisamos que el servidor despierta

// slug -> nombre para mostrar ("hardware" -> "Hardware Guard")
const NOMBRES_SERVICIO = {
  ...Object.fromEntries(servicios.map((s) => [s.slug, `${s.titulo} ${s.acento}`])),
  capacitacion: 'Aprendizaje y Capacitación',
}

const SALUDO = {
  id: 0,
  rol: 'assistant',
  local: true, // mensaje de la interfaz: no se envía al modelo como historial
  texto:
    '¡Hola! Soy el asistente de Aegis Security. Puedo contarte sobre nuestros servicios y precios, o ayudarte a elegir el que necesitas.',
}

const PREGUNTAS_RAPIDAS = [
  '¿Qué incluye Dual Guard?',
  '¿Cuánto cuesta una revisión?',
]

// Una burbuja de texto (del visitante o del asistente)
export function Burbuja({ mensaje }) {
  const clase = mensaje.rol === 'user' ? 'ia-msg ia-msg-user' : 'ia-msg ia-msg-bot'
  return <div className={clase}>{mensaje.texto}</div>
}

// Resultado del recomendador: servicio sugerido + mensaje listo para el formulario
export function TarjetaRecomendacion({ recomendacion, onUsar }) {
  const { servicio, razon, mensaje } = recomendacion

  // La IA decidió que el caso no tiene relación con los servicios
  if (servicio === 'ninguno') {
    return <p>{razon}</p>
  }

  const tienePagina = servicios.some((s) => s.slug === servicio)

  return (
    <div className="ia-recomendacion">
      <p>
        Te recomiendo: <strong>{NOMBRES_SERVICIO[servicio]}</strong>
      </p>
      <p>{razon}</p>

      {mensaje && (
        <>
          <p className="ia-etiqueta">Mensaje sugerido para el formulario:</p>
          <blockquote className="ia-cita">{mensaje}</blockquote>
        </>
      )}

      <div className="ia-acciones">
        <button type="button" className="ia-btn" onClick={() => onUsar(servicio, mensaje)}>
          Usar en el formulario
        </button>
        {tienePagina && (
          <Link to={`/servicios/${servicio}`} className="ia-enlace">
            Ver detalles
          </Link>
        )}
      </div>
    </div>
  )
}

export default function AsistenteIA() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([SALUDO])
  const [entrada, setEntrada] = useState('')
  const [cargando, setCargando] = useState(false)
  const [lento, setLento] = useState(false)
  const [error, setError] = useState('')
  const [modoRecomendar, setModoRecomendar] = useState(false)

  const listaRef = useRef(null)
  const inputRef = useRef(null)
  const contadorId = useRef(1)
  const nuevoId = () => contadorId.current++

  // Mantiene visible el último mensaje
  useEffect(() => {
    const lista = listaRef.current
    if (lista) lista.scrollTop = lista.scrollHeight
  }, [mensajes, cargando, error, abierto])

  // El servidor gratuito se duerme: si tarda, se lo explicamos al visitante
  useEffect(() => {
    if (!cargando) return
    const temporizador = setTimeout(() => setLento(true), MS_AVISO_LENTO)
    return () => clearTimeout(temporizador)
  }, [cargando])

  // Accesibilidad: Escape cierra el panel y al abrir se enfoca el campo de texto
  useEffect(() => {
    if (!abierto) return
    inputRef.current?.focus()

    const alPresionar = (e) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [abierto])

  // En el panel de administración no se muestra
  if (pathname.startsWith('/admin')) return null

  const enviar = async (texto) => {
    const limpio = texto.trim()
    if (!limpio || cargando) return

    const delVisitante = { id: nuevoId(), rol: 'user', texto: limpio }
    const conversacion = [...mensajes, delVisitante]

    setMensajes(conversacion)
    setEntrada('')
    setError('')
    setCargando(true)

    try {
      if (modoRecomendar) {
        const recomendacion = await pedirRecomendacion(limpio)
        setMensajes((prev) => [
          ...prev,
          { id: nuevoId(), rol: 'recomendacion', recomendacion },
        ])
        setModoRecomendar(false)
      } else {
        // Solo los últimos mensajes reales; se excluyen saludos y tarjetas
        const historial = conversacion
          .filter((m) => !m.local && (m.rol === 'user' || m.rol === 'assistant'))
          .slice(-MAX_HISTORIAL)
          .map((m) => ({ role: m.rol, content: m.texto }))

        const respuesta = await enviarMensajeChat(historial)
        setMensajes((prev) => [
          ...prev,
          { id: nuevoId(), rol: 'assistant', texto: respuesta },
        ])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
      setLento(false)
    }
  }

  const iniciarRecomendador = () => {
    if (cargando) return
    setModoRecomendar(true)
    setError('')
    setMensajes((prev) => [
      ...prev,
      {
        id: nuevoId(),
        rol: 'assistant',
        local: true,
        texto:
          'Cuéntame tu caso: qué equipo o sistema tienes y qué problema o qué te preocupa. Te recomiendo un servicio y te dejo listo el mensaje para enviarnos.',
      },
    ])
    inputRef.current?.focus()
  }

  // Lleva la recomendación al formulario de contacto, ya rellenado
  const usarEnFormulario = (servicio, mensaje) => {
    const params = new URLSearchParams({ servicio })
    if (mensaje) params.set('mensaje', mensaje)

    setAbierto(false)
    navigate({ pathname: '/', search: `?${params.toString()}`, hash: '#contacto' })
  }

  if (!abierto) {
    return (
      <button
        type="button"
        className="ia-fab"
        aria-label="Abrir el asistente de Aegis Security"
        onClick={() => setAbierto(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        Asistente
      </button>
    )
  }

  return (
    <section className="ia-panel" role="dialog" aria-label="Asistente de Aegis Security">
      <header className="ia-header">
        <div>
          <strong>Asistente Aegis</strong>
          <span>IA que conoce nuestros servicios</span>
        </div>
        <button
          type="button"
          className="ia-cerrar"
          aria-label="Cerrar el asistente"
          onClick={() => setAbierto(false)}
        >
          ×
        </button>
      </header>

      <div className="ia-mensajes" ref={listaRef} aria-live="polite">
        {mensajes.map((m) =>
          m.rol === 'recomendacion' ? (
            <div key={m.id} className="ia-msg ia-msg-bot">
              <TarjetaRecomendacion
                recomendacion={m.recomendacion}
                onUsar={usarEnFormulario}
              />
            </div>
          ) : (
            <Burbuja key={m.id} mensaje={m} />
          )
        )}

        {mensajes.length === 1 && (
          <div className="ia-rapidas">
            {PREGUNTAS_RAPIDAS.map((pregunta) => (
              <button key={pregunta} type="button" onClick={() => enviar(pregunta)}>
                {pregunta}
              </button>
            ))}
            <button type="button" onClick={iniciarRecomendador}>
              ¿Qué servicio necesito?
            </button>
          </div>
        )}

        {cargando && <p className="ia-estado">Escribiendo...</p>}
        {lento && (
          <p className="ia-estado">
            El servidor estaba inactivo y está despertando. Puede tardar hasta
            un minuto.
          </p>
        )}
        {error && (
          <p className="ia-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <form
        className="ia-form"
        onSubmit={(e) => {
          e.preventDefault()
          enviar(entrada)
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          maxLength={modoRecomendar ? MAX_CARACTERES_CASO : MAX_CARACTERES_CHAT}
          placeholder={modoRecomendar ? 'Describe tu caso...' : 'Escribe tu pregunta...'}
          aria-label={modoRecomendar ? 'Describe tu caso' : 'Escribe tu pregunta'}
          disabled={cargando}
        />
        <button type="submit" disabled={cargando || !entrada.trim()}>
          Enviar
        </button>
      </form>

      <p className="ia-aviso">
        Es una IA y puede equivocarse. Para confirmar precios y fechas usa el
        formulario de contacto.
      </p>
    </section>
  )
}
