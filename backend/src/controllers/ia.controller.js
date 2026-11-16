/**
 * Controlador de IA: dos funciones sobre el mismo servicio.
 *  - chat:       el asistente conversacional del sitio.
 *  - recomendar: sugiere un servicio y redacta el mensaje de contacto.
 */
const { generarRespuesta, ErrorIA } = require("../services/ia.service");
const { promptAsistente, promptRecomendador } = require("../prompts/asistente");
const {
    validarChat,
    validarDescripcion,
    interpretarRecomendacion
} = require("../utils/validarIA");

// Mensajes pensados para el visitante: nunca revelan detalles técnicos
const MENSAJES_ERROR = {
    429: "El asistente está recibiendo muchas consultas. Intenta de nuevo en un momento.",
    503: "El asistente no está disponible por ahora. Puedes escribirnos desde el formulario de contacto.",
    defecto: "No pudimos responder en este momento. Intenta de nuevo o usa el formulario de contacto."
};

const responderError = (res, error) => {
    if (error instanceof ErrorIA) {
        const status = error.status === 429 || error.status === 503 ? error.status : 502;
        return res.status(status).json({
            exito: false,
            mensaje: MENSAJES_ERROR[status] || MENSAJES_ERROR.defecto
        });
    }

    console.error("Error inesperado en IA:", error.message);
    res.status(500).json({ exito: false, mensaje: MENSAJES_ERROR.defecto });
};

const chat = async (req, res) => {
    const { mensajes, error } = validarChat(req.body);

    if (error) {
        return res.status(400).json({ exito: false, mensaje: error });
    }

    try {
        const respuesta = await generarRespuesta({
            system: promptAsistente(),
            mensajes,
            maxTokens: 350,
            temperatura: 0.4
        });

        res.json({ exito: true, respuesta });
    } catch (err) {
        responderError(res, err);
    }
};

const recomendar = async (req, res) => {
    const { descripcion, error } = validarDescripcion(req.body);

    if (error) {
        return res.status(400).json({ exito: false, mensaje: error });
    }

    try {
        const texto = await generarRespuesta({
            system: promptRecomendador(),
            mensajes: [{ role: "user", content: descripcion }],
            json: true,
            maxTokens: 500,
            temperatura: 0.3
        });

        const recomendacion = interpretarRecomendacion(texto);

        if (!recomendacion) {
            // El modelo respondió algo que no cumple el formato: no se lo pasamos al visitante
            console.error("Recomendación con formato inválido");
            return res.status(502).json({ exito: false, mensaje: MENSAJES_ERROR.defecto });
        }

        res.json({ exito: true, recomendacion });
    } catch (err) {
        responderError(res, err);
    }
};

module.exports = { chat, recomendar };
