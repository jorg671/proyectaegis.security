/**
 * Limitador de peticiones por IP (rate limiting), sin dependencias externas.
 *
 * Por qué: el formulario es público y cada envío dispara un correo. Sin límite,
 * un bot podría llenar la base de datos y agotar el cupo diario de Brevo.
 *
 * Cómo: guarda en memoria cuántas peticiones hizo cada IP dentro de una
 * ventana de tiempo. Al pasar el máximo responde 429 (Too Many Requests).
 *
 * Limitación conocida: la memoria es de UN solo servidor y se borra al
 * reiniciar. Basta para esta app (una instancia en Render); si el backend
 * creciera a varias instancias habría que usar un almacén compartido (Redis)
 * o la librería express-rate-limit.
 */
const limitarPeticiones = ({ ventanaMs, maximo, mensaje }) => {
    const registros = new Map(); // ip -> { cuenta, reinicio }

    // Limpieza periódica para que el Map no crezca sin fin.
    // unref() evita que este temporizador impida cerrar el proceso.
    setInterval(() => {
        const ahora = Date.now();
        for (const [ip, registro] of registros) {
            if (registro.reinicio <= ahora) registros.delete(ip);
        }
    }, ventanaMs).unref();

    return (req, res, next) => {
        const ahora = Date.now();
        let registro = registros.get(req.ip);

        // Primera petición o ventana vencida: se empieza a contar de nuevo
        if (!registro || registro.reinicio <= ahora) {
            registro = { cuenta: 0, reinicio: ahora + ventanaMs };
            registros.set(req.ip, registro);
        }

        registro.cuenta++;

        res.set("RateLimit-Limit", String(maximo));
        res.set("RateLimit-Remaining", String(Math.max(0, maximo - registro.cuenta)));

        if (registro.cuenta > maximo) {
            const segundos = Math.ceil((registro.reinicio - ahora) / 1000);
            res.set("Retry-After", String(segundos));
            return res.status(429).json({ exito: false, mensaje });
        }

        next();
    };
};

module.exports = limitarPeticiones;
