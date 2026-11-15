/**
 * Manejo central de errores: la API siempre responde JSON, nunca el HTML de
 * error por defecto de Express, y nunca revela detalles internos al cliente.
 */

// Ruta que no existe
const rutaNoEncontrada = (req, res) => {
    res.status(404).json({ exito: false, mensaje: "Ruta no encontrada" });
};

// Cualquier error que llegue con next(err) o se lance en un middleware
// eslint-disable-next-line no-unused-vars
const manejarErrores = (err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ exito: false, mensaje: "El formato de los datos no es válido" });
    }

    if (err.type === "entity.too.large") {
        return res.status(413).json({ exito: false, mensaje: "Los datos enviados son demasiado grandes" });
    }

    if (err.status === 403) {
        return res.status(403).json({ exito: false, mensaje: err.message });
    }

    // Error inesperado: se registra el motivo, pero al cliente no se le cuenta
    console.error("Error no controlado:", err.message);
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" });
};

module.exports = { rutaNoEncontrada, manejarErrores };
