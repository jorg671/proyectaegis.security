import {
  ESTADOS,
  ESTADO_INICIAL,
  claseEstado,
} from '../../../constants/estados'

/**
 * Muestra la tabla de solicitudes y cubre los 5 casos posibles:
 * cargando, error, lista vacía, filtro sin resultados y tabla con datos.
 */
export default function ListaSolicitudes({
  solicitudes,
  total,
  cargando,
  error,
  errorAccion,
  onCambiarEstado,
}) {
  if (cargando) {
    return (
      <div className="requests-container">
        <p>Cargando solicitudes...</p>
        {/* El servidor gratuito se duerme; avisamos para que no parezca roto */}
        <p className="form-hint">
          Si el servidor estaba inactivo, puede tardar hasta un minuto en
          responder.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="requests-container">
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="requests-container">
        <p>No hay solicitudes registradas.</p>
      </div>
    )
  }

  if (solicitudes.length === 0) {
    return (
      <div className="requests-container">
        <p>No hay solicitudes con ese estado.</p>
      </div>
    )
  }

  return (
    <div className="requests-container">
      {/* Reemplaza al alert(): el error aparece en la página */}
      {errorAccion && (
        <p className="mensaje-error" role="alert">
          {errorAccion}
        </p>
      )}

      <div className="requests-table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Servicio</th>
              <th>Mensaje</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>

          <tbody>
            {solicitudes.map((solicitud) => {
              const estado = solicitud.estado || ESTADO_INICIAL

              return (
                <tr key={solicitud.id}>
                  <td>{solicitud.nombre}</td>
                  <td>{solicitud.correo}</td>
                  <td>{solicitud.servicio}</td>
                  <td>{solicitud.mensaje}</td>

                  <td>
                    <select
                      value={estado}
                      onChange={(e) =>
                        onCambiarEstado(solicitud.id, e.target.value)
                      }
                      className={`estado-select estado-${claseEstado(estado)}`}
                    >
                      {ESTADOS.map((e) => (
                        <option key={e.valor} value={e.valor}>
                          {e.valor}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    {solicitud.fecha_creacion
                      ? new Date(solicitud.fecha_creacion).toLocaleDateString(
                          'es-CO'
                        )
                      : 'Sin fecha'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
