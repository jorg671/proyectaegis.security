// Ruta pública: cualquier visitante puede enviar el formulario
const { Router } = require("express");
const { crearSolicitud } = require("../controllers/solicitudes.controller");

const router = Router();

router.post("/", crearSolicitud);

module.exports = router;
