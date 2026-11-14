import { ESTADOS } from '../../../constants/estados'

export default function FiltroEstado({ valor, onChange }) {
  return (
    <div className="filter-container">
      <label htmlFor="filtroEstado">Filtrar solicitudes:</label>

      <select
        id="filtroEstado"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="Todos">Todas las solicitudes</option>
        {ESTADOS.map((estado) => (
          <option key={estado.valor} value={estado.valor}>
            {estado.plural}
          </option>
        ))}
      </select>
    </div>
  )
}
