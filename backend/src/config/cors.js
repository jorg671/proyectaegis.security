/**
 * CORS: define QUÉ páginas web pueden llamar a esta API desde el navegador.
 *
 * Por defecto solo el frontend publicado y el entorno local de desarrollo.
 * Para agregar otros (por ejemplo un dominio propio) se define CORS_ORIGINS
 * con los orígenes separados por coma, sin barra final ni ruta:
 *   CORS_ORIGINS=https://miempresa.com,https://jorg671.github.io
 *
 * Las peticiones sin cabecera Origin (curl, Render, servidor a servidor) se
 * permiten: CORS solo protege a los navegadores, no es autenticación.
 */
const ORIGENES_POR_DEFECTO = [
    "https://jorg671.github.io",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173" // vite preview
];

const origenesPermitidos = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
    : ORIGENES_POR_DEFECTO;

const opcionesCors = {
    origin(origen, callback) {
        if (!origen || origenesPermitidos.includes(origen)) {
            return callback(null, true);
        }
        const error = new Error("Origen no permitido");
        error.status = 403;
        callback(error);
    },
    maxAge: 600 // el navegador recuerda el permiso 10 min y evita preflights repetidos
};

module.exports = opcionesCors;
