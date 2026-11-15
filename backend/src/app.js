/**
 * Configuración de la app Express (sin arrancar el servidor).
 * Separar app de server permite probar la API sin abrir un puerto.
 */
const express = require("express");
const cors = require("cors");

const opcionesCors = require("./config/cors");
const limitarPeticiones = require("./middleware/limitarPeticiones");
const { rutaNoEncontrada, manejarErrores } = require("./middleware/manejarErrores");
const solicitudesRoutes = require("./routes/solicitudes.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// No anunciar qué tecnología usa el servidor
app.disable("x-powered-by");

// Render pone un proxy delante de la app: sin esto, req.ip sería siempre la IP
// del proxy y el limitador trataría a todos los visitantes como una sola persona.
app.set("trust proxy", 1);

app.use(cors(opcionesCors));

// Un formulario de contacto nunca necesita más de unos pocos KB
app.use(express.json({ limit: "10kb" }));

// El navegador no debe "adivinar" el tipo de contenido de las respuestas
app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    next();
});

// Límite general para toda la API: 100 peticiones por IP cada 15 minutos
app.use(
    "/api",
    limitarPeticiones({
        ventanaMs: 15 * 60 * 1000,
        maximo: 100,
        mensaje: "Demasiadas peticiones. Intenta de nuevo en unos minutos."
    })
);

// Verificación rápida de que la API está viva (también despierta Render)
app.get("/", (req, res) => {
    res.json({
        mensaje: "Aegis Security API",
        estado: "Servidor funcionando correctamente"
    });
});

app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/admin", adminRoutes);

// Siempre al final: lo que ninguna ruta atendió y los errores
app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;
