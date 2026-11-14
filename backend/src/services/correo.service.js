/**
 * Servicio de correo (Brevo).
 * Aísla la integración externa: si mañana cambiamos de proveedor,
 * solo se toca este archivo y los controladores no se enteran.
 */

// Evita que el texto del usuario inyecte HTML/JS en el correo (XSS)
const escaparHTML = (texto) =>
    String(texto).replace(/[&<>"']/g, (caracter) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);

const enviarNotificacionSolicitud = async ({ nombre, email, servicio, mensaje }) => {
    const respuesta = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            accept: "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: {
                name: process.env.BREVO_SENDER_NAME,
                email: process.env.BREVO_SENDER_EMAIL
            },
            to: [{ email: process.env.EMAIL_DESTINO }],
            // Al responder el correo, la respuesta va directo al cliente
            replyTo: { email, name: nombre },
            subject: "Nueva solicitud - Aegis Security",
            htmlContent: `
                <h2>Nueva solicitud recibida</h2>
                <p><strong>Nombre:</strong> ${escaparHTML(nombre)}</p>
                <p><strong>Correo:</strong> ${escaparHTML(email)}</p>
                <p><strong>Servicio:</strong> ${escaparHTML(servicio)}</p>
                <p><strong>Mensaje:</strong> ${escaparHTML(mensaje)}</p>
            `
        })
    });

    const resultado = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
        // Solo se registra el estado y el motivo, nunca los datos del cliente
        console.error("Error de Brevo:", {
            status: respuesta.status,
            code: resultado.code,
            message: resultado.message
        });

        throw new Error(
            `Brevo (${respuesta.status}): ${resultado.code || "Sin código"} - ${resultado.message || "Error desconocido"}`
        );
    }

    return resultado;
};

module.exports = { enviarNotificacionSolicitud };
