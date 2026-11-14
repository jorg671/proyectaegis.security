/**
 * Firebase Admin: se usa SOLO para verificar el token del administrador.
 *
 * Decisión técnica: la credencial puede venir de dos lugares.
 *  1. Variable de entorno FIREBASE_SERVICE_ACCOUNT (JSON completo en una línea).
 *     Es lo ideal en producción (Render), porque no hay que subir archivos.
 *  2. Archivo firebase-service-account.json en /backend (para desarrollo local).
 */
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const path = require("path");

const cargarCredencial = () => {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
    return require(path.join(__dirname, "../../firebase-service-account.json"));
};

// getApps() evita inicializar Firebase dos veces (error común con --watch)
const app = getApps().length
    ? getApps()[0]
    : initializeApp({ credential: cert(cargarCredencial()) });

const admin = {
    auth: () => getAuth(app)
};

module.exports = admin;
