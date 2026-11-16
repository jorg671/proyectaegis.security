/**
 * Servicio de IA (Groq).
 *
 * Aísla al proveedor, igual que correo.service.js con Brevo: si mañana se
 * cambia de Groq a otro servicio, solo se toca este archivo.
 *
 * Groq expone una API compatible con la de OpenAI, por eso la ruta es
 * /openai/v1/chat/completions. La clave (GROQ_API_KEY) vive SOLO en el
 * servidor; si estuviera en el frontend cualquiera podría robarla.
 */
const URL_GROQ =
    process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";

// El modelo se puede cambiar por variable de entorno si Groq retira uno
const MODELO = () => process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const TIEMPO_MAXIMO_MS = 20000;

// Error propio para que el controlador sepa qué decirle al visitante
class ErrorIA extends Error {
    constructor(mensaje, status) {
        super(mensaje);
        this.name = "ErrorIA";
        this.status = status;
    }
}

/**
 * Pide una respuesta al modelo.
 * @param {string}  system       Prompt de sistema (rol, catálogo y reglas)
 * @param {Array}   mensajes     [{ role: "user" | "assistant", content }]
 * @param {boolean} json         true para exigir que responda un objeto JSON
 * @param {number}  maxTokens    Tope de longitud de la respuesta (controla el costo)
 * @param {number}  temperatura  Más bajo = más predecible
 */
const generarRespuesta = async ({
    system,
    mensajes,
    json = false,
    maxTokens = 400,
    temperatura = 0.4
}) => {
    if (!process.env.GROQ_API_KEY) {
        throw new ErrorIA("GROQ_API_KEY no está configurada", 503);
    }

    let respuesta;
    try {
        respuesta = await fetch(URL_GROQ, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODELO(),
                messages: [{ role: "system", content: system }, ...mensajes],
                max_tokens: maxTokens,
                temperature: temperatura,
                ...(json && { response_format: { type: "json_object" } })
            }),
            // Si Groq no responde, no dejamos al visitante esperando para siempre
            signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS)
        });
    } catch (error) {
        const agotado = error.name === "TimeoutError";
        console.error("Error de red con Groq:", agotado ? "tiempo agotado" : error.message);
        throw new ErrorIA("No se pudo contactar al proveedor de IA", agotado ? 504 : 502);
    }

    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
        // Solo estado y motivo: nunca el texto del visitante
        console.error("Error de Groq:", {
            status: respuesta.status,
            message: datos?.error?.message
        });
        throw new ErrorIA("El proveedor de IA rechazó la petición", respuesta.status === 429 ? 429 : 502);
    }

    const texto = datos?.choices?.[0]?.message?.content?.trim();

    if (!texto) {
        throw new ErrorIA("El proveedor de IA devolvió una respuesta vacía", 502);
    }

    return texto;
};

module.exports = { generarRespuesta, ErrorIA };
