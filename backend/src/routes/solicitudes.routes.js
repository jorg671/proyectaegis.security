// Ruta pública: cualquier visitante puede enviar el formulario
const { Router } = require("express");
const { crearSolicitud } = require("../controllers/solicitudes.controller");
const limitarPeticiones = require("../middleware/limitarPeticiones");

const router = Router();

// Límite estricto: cada envío guarda datos y manda un correo.
// 10 solicitudes por IP cada 15 minutos es de sobra para una persona real.
const limitarEnvios = limitarPeticiones({
    ventanaMs: 15 * 60 * 1000,
    maximo: 10,
    mensaje: "Has enviado demasiadas solicitudes. Intenta de nuevo en unos minutos."
});

router.post("/", limitarEnvios, crearSolicitud);

module.exports = router;
