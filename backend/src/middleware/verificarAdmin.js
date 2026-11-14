/**
 * Middleware de autorización para rutas /api/admin/*.
 *
 * Flujo: el frontend inicia sesión con Firebase, obtiene un ID token y lo
 * envía en el header "Authorization: Bearer <token>". Aquí lo verificamos
 * en el servidor (nunca confiamos en lo que diga el frontend) y comprobamos
 * que el correo sea el del administrador definido en ADMIN_EMAIL.
 */
const admin = require("../config/firebaseAdmin");

const verificarAdmin = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ mensaje: "No autorizado" });
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
        // Token vencido, malformado o falso
        return res.status(401).json({ mensaje: "Sesión inválida o expirada" });
    }
};

module.exports = verificarAdmin;
