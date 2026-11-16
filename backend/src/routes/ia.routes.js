// Rutas públicas de IA. Cada mensaje cuesta cupo, así que van con límite propio.
const { Router } = require("express");
const { chat, recomendar } = require("../controllers/ia.controller");
const limitarPeticiones = require("../middleware/limitarPeticiones");

const router = Router();

const VENTANA = 15 * 60 * 1000;
const MENSAJE_LIMITE = "Has hecho muchas consultas seguidas. Intenta de nuevo en unos minutos.";

router.post("/chat", limitarPeticiones({ ventanaMs: VENTANA, maximo: 30, mensaje: MENSAJE_LIMITE }), chat);
router.post("/recomendar", limitarPeticiones({ ventanaMs: VENTANA, maximo: 10, mensaje: MENSAJE_LIMITE }), recomendar);

module.exports = router;
