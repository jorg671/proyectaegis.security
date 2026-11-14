/**
 * Llamadas HTTP al backend para el panel de administración.
 * Todas envían el token de Firebase; el servidor lo verifica (verificarAdmin).
 */
import { API_URL } from '../config'

// Hace la petición y convierte cualquier fallo en un Error con mensaje legible
async function llamarApi(usuario, ruta, opciones = {}) {
  const token = await usuario.getIdToken()

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const resultado = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || 'Ocurrió un error inesperado')
  }

  return resultado
}

export async function obtenerSolicitudes(usuario) {
  const resultado = await llamarApi(usuario, '/api/admin/solicitudes')
  return resultado.solicitudes || []
}

export function cambiarEstadoSolicitud(usuario, id, estado) {
  return llamarApi(usuario, `/api/admin/solicitudes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  })
}
