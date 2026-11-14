/**
 * Configuración de la app Express (sin arrancar el servidor).
 * Separar app de server permite probar la API sin abrir un puerto.
 */
const express = require("express");
const cors = require("cors");

const solicitudesRoutes = require("./routes/solicitudes.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Verificación rápida de que la API está viva (también despierta Render)
app.get("/", (req, res) => {
    res.json({
        mensaje: "Aegis Security API",
        estado: "Servidor funcionando correctamente"
    });
});

app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
