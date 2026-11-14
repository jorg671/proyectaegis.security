/**
 * Estados posibles de una solicitud. Debe coincidir con ESTADOS_PERMITIDOS
 * del backend (controllers/solicitudes.controller.js): si se agrega uno aquí,
 * hay que agregarlo allá también.
 *
 * `clase` enlaza cada estado con su color en App.css (.request-stat.<clase>).
 */
export const ESTADO_INICIAL = 'Pendiente'

export const ESTADOS = [
  { valor: 'Pendiente', plural: 'Pendientes', clase: 'pending' },
  { valor: 'En revisión', plural: 'En revisión', clase: 'reviewing' },
  { valor: 'Aprobada', plural: 'Aprobadas', clase: 'approved' },
  { valor: 'Finalizada', plural: 'Finalizadas', clase: 'finished' },
]

// "En revisión" -> "en-revisión" (clase CSS .estado-select.estado-en-revisión)
export const claseEstado = (estado = ESTADO_INICIAL) =>
  estado.toLowerCase().replace(/\s+/g, '-')
