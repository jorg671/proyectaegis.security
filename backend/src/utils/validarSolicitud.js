/**
 * Validación de los datos del formulario de contacto.
 *
 * Nunca se confía en el frontend: aunque el navegador valide, cualquiera
 * puede llamar a la API directamente con datos arbitrarios.
 */
const LIMITES = {
    nombre: 100,
    email: 254, // máximo permitido para una dirección de correo
    servicio: 100,
    mensaje: 2000
};

const NOMBRES_CAMPO = {
    nombre: "El nombre",
    email: "El correo",
    servicio: "El servicio",
    mensaje: "El mensaje"
};

// Forma básica: algo@dominio.ext, sin espacios
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Devuelve { datos } con los valores limpios, o { error } con un mensaje
 * legible para mostrar al visitante.
 */
const validarSolicitud = (cuerpo) => {
    const recibido = cuerpo ?? {};
    const datos = {};

    for (const campo of Object.keys(LIMITES)) {
        const valor = recibido[campo];

        // Debe ser texto (evita que envíen números, listas u objetos)
        if (typeof valor !== "string" || valor.trim() === "") {
            return { error: "Todos los campos son obligatorios" };
        }

        datos[campo] = valor.trim();

        if (datos[campo].length > LIMITES[campo]) {
            return {
                error: `${NOMBRES_CAMPO[campo]} no puede superar ${LIMITES[campo]} caracteres`
            };
        }
    }

    if (!FORMATO_EMAIL.test(datos.email)) {
        return { error: "El correo electrónico no es válido" };
    }

    return { datos };
};

module.exports = { validarSolicitud, LIMITES };
