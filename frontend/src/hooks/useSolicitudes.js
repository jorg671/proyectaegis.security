import { useCallback, useEffect, useState } from 'react'
import {
  obtenerSolicitudes,
  cambiarEstadoSolicitud,
} from '../services/adminApi'

/**
 * Maneja todo el estado de las solicitudes del panel:
 * carga inicial, errores y cambio de estado.
 * Así Panel.jsx solo se ocupa de mostrar, no de pedir datos.
 */
export function useSolicitudes(usuario) {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('') // fallo al cargar la lista
  const [errorAccion, setErrorAccion] = useState('') // fallo al actualizar

  const cargar = useCallback(async () => {
    if (!usuario) return
    try {
      setCargando(true)
      setError('')
      setSolicitudes(await obtenerSolicitudes(usuario))
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [usuario])

  useEffect(() => {
    cargar()
  }, [cargar])

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      setErrorAccion('')
      await cambiarEstadoSolicitud(usuario, id, nuevoEstado)

      // Actualiza la fila en pantalla sin volver a pedir toda la lista
      setSolicitudes((anteriores) =>
        anteriores.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
      )
    } catch (err) {
      setErrorAccion(err.message)
    }
  }

  return { solicitudes, cargando, error, errorAccion, cambiarEstado }
}
