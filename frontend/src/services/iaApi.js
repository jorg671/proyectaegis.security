/**
 * Llamadas HTTP al asistente de IA del backend.
 * El navegador NUNCA habla con Groq: solo con nuestro backend, que guarda la clave.
 */
import { API_URL } from '../config'

const MENSAJE_RED =
  'No pudimos conectar con el asistente. Revisa tu conexión e intenta de nuevo.'
const MENSAJE_GENERICO =
  'No pudimos responder en este momento. Intenta de nuevo.'

// Hace el POST y convierte cualquier fallo en un Error con mensaje legible
async function post(ruta, cuerpo) {
  let respuesta

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    })
  } catch {
    throw new Error(MENSAJE_RED)
  }

  const resultado = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || MENSAJE_GENERICO)
  }

  return resultado
}

// mensajes: [{ role: 'user' | 'assistant', content }] -> texto de la respuesta
export async function enviarMensajeChat(mensajes) {
  const resultado = await post('/api/ia/chat', { mensajes })
  return resultado.respuesta
}

// descripcion: texto libre del caso -> { servicio, razon, mensaje }
export async function pedirRecomendacion(descripcion) {
  const resultado = await post('/api/ia/recomendar', { descripcion })
  return resultado.recomendacion
}
