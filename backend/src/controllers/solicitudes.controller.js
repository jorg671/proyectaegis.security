/**
 * Controlador de solicitudes de contacto.
 * Contiene la lógica de cada endpoint; las rutas solo dicen "qué URL llama a qué".
 */
const supabase = require("../config/supabase");
const supabaseAdmin = require("../config/supabaseAdmin");
const { enviarNotificacionSolicitud } = require("../services/correo.service");

// Estados que el administrador puede asignar (lista blanca)
const ESTADOS_PERMITIDOS = ["Pendiente", "En revisión", "Aprobada", "Finalizada"];

// PÚBLICO: el visitante envía el formulario de contacto
const crearSolicitud = async (req, res) => {
    try {
        const { nombre, email, servicio, mensaje } = req.body;

        if (!nombre || !email || !servicio || !mensaje) {
            return res.status(400).json({
                exito: false,
                mensaje: "Todos los campos son obligatorios"
            });
        }

        const datos = {
            nombre: nombre.trim(),
            email: email.trim(),
            servicio: servicio.trim(),
            mensaje: mensaje.trim()
        };

        // 1. Guardar primero: la solicitud no se pierde aunque falle el correo
        const { error } = await supabase.from("solicitudes").insert([
            {
                nombre: datos.nombre,
                correo: datos.email,
                servicio: datos.servicio,
                mensaje: datos.mensaje
            }
        ]);

        if (error) {
            console.error("Error al guardar solicitud:", error.message);
            return res.status(500).json({
                exito: false,
                mensaje: "No se pudo guardar la solicitud"
            });
        }

        // 2. Notificar por correo. Si falla, avisamos pero no tumbamos la respuesta
        let errorCorreo = false;
        try {
            await enviarNotificacionSolicitud(datos);
        } catch (err) {
            errorCorreo = true;
            console.error("Error al enviar correo:", err.message);
        }

        res.status(201).json({
            exito: true,
            mensaje: errorCorreo
                ? "Solicitud guardada, pero no se pudo enviar el correo"
                : "Solicitud enviada correctamente"
        });
    } catch (error) {
        console.error("Error inesperado al crear solicitud:", error.message);
        res.status(500).json({
            exito: false,
            mensaje: "Ocurrió un error al procesar la solicitud"
        });
    }
};

// ADMIN: listar todas las solicitudes (clave privada de Supabase)
const listarSolicitudes = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("solicitudes")
            .select("*")
            .order("fecha_creacion", { ascending: false });

        if (error) {
            console.error("Error al consultar solicitudes:", error.message);
            return res.status(500).json({
                mensaje: "No se pudieron consultar las solicitudes"
            });
        }

        res.json({ exito: true, solicitudes: data });
    } catch (error) {
        console.error("Error inesperado al listar:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// ADMIN: cambiar el estado de una solicitud
const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!ESTADOS_PERMITIDOS.includes(estado)) {
            return res.status(400).json({ mensaje: "Estado no válido" });
        }

        const { data, error } = await supabaseAdmin
            .from("solicitudes")
            .update({ estado })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error al actualizar solicitud:", error.message);
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
        console.error("Error inesperado al actualizar:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

module.exports = { crearSolicitud, listarSolicitudes, actualizarEstado };
