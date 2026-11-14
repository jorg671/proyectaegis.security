import { ESTADOS, ESTADO_INICIAL } from '../../../constants/estados'

// Tarjetas con el total y un contador por cada estado.
// Una solicitud sin estado se considera "Pendiente" (igual que en la tabla).
export default function EstadisticasSolicitudes({ solicitudes }) {
  const contar = (estado) =>
    solicitudes.filter((s) => (s.estado || ESTADO_INICIAL) === estado).length

  return (
    <div className="request-stats">
      <div className="request-stat">
        <span>Total de solicitudes</span>
        <h3>{solicitudes.length}</h3>
      </div>

      {ESTADOS.map((estado) => (
        <div key={estado.valor} className={`request-stat ${estado.clase}`}>
          <span>{estado.plural}</span>
          <h3>{contar(estado.valor)}</h3>
        </div>
      ))}
    </div>
  )
}
