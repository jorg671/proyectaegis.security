// Rutas privadas: todo lo que cuelga de /api/admin exige ser administrador
const { Router } = require("express");
const verificarAdmin = require("../middleware/verificarAdmin");
const {
    listarSolicitudes,
    actualizarEstado
} = require("../controllers/solicitudes.controller");

const router = Router();

// Se aplica una sola vez a todas las rutas de este archivo
router.use(verificarAdmin);

router.get("/solicitudes", listarSolicitudes);
router.patch("/solicitudes/:id", actualizarEstado);

module.exports = router;
