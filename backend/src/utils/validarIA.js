/**
 * Validación de lo que llega a los endpoints de IA y de lo que devuelve el
 * modelo. Tanto el visitante como el modelo pueden enviar cosas inesperadas,
 * así que ninguno de los dos se da por confiable.
 */
const { SLUGS_VALIDOS } = require("../data/catalogo");

const MAX_MENSAJES_RECIBIDOS = 20; // más que esto se rechaza
const MAX_MENSAJES_HISTORIAL = 10; // al modelo solo se envían los últimos 10
const MAX_LARGO_MENSAJE = 500;
const MIN_LARGO_DESCRIPCION = 10;
const MAX_LARGO_DESCRIPCION = 1000;

// Chat: { mensajes: [{ role: "user"|"assistant", content }] }
const validarChat = (cuerpo) => {
    const mensajes = cuerpo?.mensajes;

    if (!Array.isArray(mensajes) || mensajes.length === 0) {
        return { error: "Escribe un mensaje para poder ayudarte" };
    }

    if (mensajes.length > MAX_MENSAJES_RECIBIDOS) {
        return { error: "La conversación es demasiado larga. Empieza una nueva" };
    }

    const limpios = [];

    for (const m of mensajes) {
        // El visitante nunca puede enviar rol "system": ese lo pone el servidor
        if (!m || (m.role !== "user" && m.role !== "assistant")) {
            return { error: "El formato de la conversación no es válido" };
        }
        if (typeof m.content !== "string" || m.content.trim() === "") {
            return { error: "El formato de la conversación no es válido" };
        }
        if (m.content.length > MAX_LARGO_MENSAJE) {
            return { error: `Cada mensaje puede tener máximo ${MAX_LARGO_MENSAJE} caracteres` };
        }
        limpios.push({ role: m.role, content: m.content.trim() });
    }

    if (limpios[limpios.length - 1].role !== "user") {
        return { error: "El último mensaje debe ser tuyo" };
    }

    return { mensajes: limpios.slice(-MAX_MENSAJES_HISTORIAL) };
};

// Recomendador: { descripcion: "texto libre" }
const validarDescripcion = (cuerpo) => {
    const descripcion = cuerpo?.descripcion;

    if (typeof descripcion !== "string" || descripcion.trim().length < MIN_LARGO_DESCRIPCION) {
        return { error: "Cuéntanos un poco más sobre tu caso para poder recomendarte" };
    }

    if (descripcion.length > MAX_LARGO_DESCRIPCION) {
        return { error: `La descripción puede tener máximo ${MAX_LARGO_DESCRIPCION} caracteres` };
    }

    return { descripcion: descripcion.trim() };
};

/**
 * Interpreta la respuesta JSON del recomendador y la valida.
 * Los modelos a veces añaden texto alrededor del JSON, por eso se extrae el
 * primer objeto { ... }. Devuelve null si no cumple el formato esperado.
 */
const interpretarRecomendacion = (texto) => {
    const inicio = texto.indexOf("{");
    const fin = texto.lastIndexOf("}");
    if (inicio === -1 || fin <= inicio) return null;

    let crudo;
    try {
        crudo = JSON.parse(texto.slice(inicio, fin + 1));
    } catch {
        return null;
    }

    const servicio = typeof crudo.servicio === "string" ? crudo.servicio.trim().toLowerCase() : "";

    // Solo se aceptan servicios que existen en el catálogo (o "ninguno")
    if (!SLUGS_VALIDOS.includes(servicio) && servicio !== "ninguno") return null;
    if (typeof crudo.razon !== "string" || crudo.razon.trim() === "") return null;

    const mensaje = typeof crudo.mensaje === "string" ? crudo.mensaje.trim() : "";

    return {
        servicio,
        razon: crudo.razon.trim().slice(0, 400),
        // Debe caber en el formulario de contacto (máximo 2000), por eso se recorta
        mensaje: servicio === "ninguno" ? "" : mensaje.slice(0, 600)
    };
};

module.exports = { validarChat, validarDescripcion, interpretarRecomendacion };
