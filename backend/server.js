const express = require("express");
const cors = require("cors");
require("dotenv").config();



console.log("URL Supabase:", process.env.SUPABASE_URL);
const supabase = require("./src/config/supabase");
const supabaseAdmin = require("./src/config/supabaseAdmin");
const admin = require("./src/config/firebaseAdmin");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Enviar notificaciones mediante Brevo
const enviarCorreoBrevo = async ({ nombre, email, servicio, mensaje }) => {
    const escaparHTML = (texto) =>
        String(texto).replace(/[&<>"']/g, (caracter) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caracter]);

    const respuesta = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: {
                name: process.env.BREVO_SENDER_NAME,
                email: process.env.BREVO_SENDER_EMAIL
            },
            to: [
                {
                    email: process.env.EMAIL_DESTINO
                }
            ],
            replyTo: {
                email: email,
                name: nombre
            },
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
    console.error("Respuesta completa de Brevo:", {
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
// Verificar que el usuario sea el administrador
const verificarAdmin = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                mensaje: "No autorizado"
            });
        }

        const token = authorization.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (decodedToken.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({
                mensaje: "No tienes permisos de administrador"
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: "Sesión inválida o expirada"
        });
    }
};
// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "Aegis Security API",
        estado: "Servidor funcionando correctamente"
    });
});

// Probar conexión con Supabase
app.get("/api/prueba-supabase", async (req, res) => {
    try {
        const { error } = await supabase
            .from("solicitudes")
            .select("id")
            .limit(1);

        if (error) {
            console.log("Error Supabase:", error);

            return res.status(500).json({
                conectado: false,
                mensaje: error.message,
                detalles: error.details,
                codigo: error.code
            });
        }

        res.json({
            conectado: true,
            mensaje: "Supabase responde correctamente"
        });

    } catch (error) {
        console.log("Error inesperado:", error);

        res.status(500).json({
            conectado: false,
            mensaje: error.message
        });
    }
});
// Consultar solicitudes (solo administrador)
app.get("/api/admin/solicitudes", verificarAdmin, async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("solicitudes")
            .select("*")
            .order("fecha_creacion", { ascending: false });

        if (error) {
            console.error("Error al consultar solicitudes:", error);

            return res.status(500).json({
                mensaje: "No se pudieron consultar las solicitudes"
            });
        }

        res.json({
            exito: true,
            solicitudes: data
        });

    } catch (error) {
        console.error("Error inesperado:", error);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
});

// Actualizar estado de una solicitud (solo administrador)
app.patch("/api/admin/solicitudes/:id", verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = [
            "Pendiente",
            "En revisión",
            "Aprobada",
            "Finalizada"
        ];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                mensaje: "Estado no válido"
            });
        }

        const { data, error } = await supabaseAdmin
            .from("solicitudes")
            .update({ estado })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error al actualizar:", error);

            return res.status(500).json({
                mensaje: "No se pudo actualizar la solicitud"
            });
        }

        res.json({
            exito: true,
            mensaje: "Estado actualizado correctamente",
            solicitud: data
        });

    } catch (error) {
        console.error("Error inesperado:", error);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
});


// Recibir y guardar solicitudes de contacto
// Recibir y guardar solicitudes de contacto
app.post("/api/solicitudes", async (req, res) => {
    try {
        const { nombre, email, servicio, mensaje } = req.body;

        // Validar campos obligatorios
        if (!nombre || !email || !servicio || !mensaje) {
            return res.status(400).json({
                exito: false,
                mensaje: "Todos los campos son obligatorios"
            });
        }

        // Guardar solicitud en Supabase
        const { error } = await supabase
            .from("solicitudes")
            .insert([
                {
                    nombre: nombre.trim(),
                    correo: email.trim(),
                    servicio: servicio.trim(),
                    mensaje: mensaje.trim()
                }
            ]);

        if (error) {
            console.log("Error al guardar:", error);

            return res.status(500).json({
                exito: false,
                mensaje: "No se pudo guardar la solicitud"
            });
        }

        // Enviar notificación mediante Brevo
        let errorCorreo = false;

        try {
            await enviarCorreoBrevo({
                nombre: nombre.trim(),
                email: email.trim(),
                servicio: servicio.trim(),
                mensaje: mensaje.trim()
            });
        } catch (error) {
            errorCorreo = true;
            console.error("Error al enviar correo con Brevo:", error.message);
        }

        res.status(201).json({
            exito: true,
            mensaje: errorCorreo
                ? "Solicitud guardada, pero no se pudo enviar el correo"
                : "Solicitud enviada correctamente"
        });

    } catch (error) {
        console.log("Error inesperado:", error);

        res.status(500).json({
            exito: false,
            mensaje: "Ocurrió un error al procesar la solicitud"
        });
    }
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});